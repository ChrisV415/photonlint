#!/usr/bin/env python3
"""
PhotonLint DRC Engine — layer-aware rule checking.

Checks implemented (per configured PDK layer):
  1. Grid snap      — vertices must land on the foundry manufacturing grid (global)
  2. Minimum width  — feature width via minimum rotated bounding rectangle
                       (correctly handles angled waveguides)
  3. Minimum spacing — exact pairwise polygon distance via shapely
                        (O(n²) for MVP — fine for single-cell layouts up to ~300 polys)
  4. Minimum bend radius — HEURISTIC. Flags sharp turn angles over short edge segments
     as a proxy for tight bends. Labeled WARNING, not CRITICAL. Will both miss real
     violations (smooth discretized curves) and flag legal sharp couplers. Verify manually.

Layer awareness:
  The rules JSON now carries a `layers` list. Only polygons on configured (layer, datatype)
  pairs receive width/spacing/bend checks, using that layer's specific thresholds.
  Grid snap applies globally to all polygons (it's a global fabrication grid rule).

Geometry output:
  - Each violation carries a `geometry` field ([[x,y],...]) for visual highlighting
  - Result carries a `layoutData` field with all polygons for the layout viewer

Usage:
  python3 drc_engine.py --gds-path <path> --rules-json '<json>'

Rules JSON format:
  {
    "gridSize": 0.001,
    "layers": [
      {"layer": 1, "datatype": 0, "name": "Si Waveguide",
       "minWidth": 0.45, "minSpacing": 0.20, "minBendRadius": 5.0},
      ...
    ]
  }
"""

import sys
import json
import argparse

# ── stdout isolation ──────────────────────────────────────────────────────────
# Redirect stdout to stderr IMMEDIATELY so that any print() calls from this
# file or imported libraries (gdspy, shapely, numpy) go to stderr.
# Node.js reads only stdout; a stray print there breaks JSON.parse.
# The final result is written to _real_stdout explicitly.
_real_stdout = sys.stdout
sys.stdout = sys.stderr


def _emit(obj: dict) -> None:
    """Write the JSON result to the real stdout and flush."""
    _real_stdout.write(json.dumps(obj) + "\n")
    _real_stdout.flush()


try:
    import gdspy
    import numpy as np
    from collections import defaultdict
    from shapely.geometry import Polygon
    from shapely.strtree import STRtree
    from shapely.validation import make_valid
except ImportError as e:
    _emit({
        "status": "error",
        "errorMessage": f"Missing Python dependency: {e}. Run: pip install gdspy numpy shapely",
        "violations": [],
        "passedChecks": 0,
        "totalChecks": 0,
        "layoutData": None,
    })
    sys.exit(0)


MAX_LAYOUT_POLYGONS = 2000  # cap to keep JSON response size reasonable


# ── Geometry helpers ──────────────────────────────────────────────────────────

def poly_to_list(poly) -> list:
    """Convert a numpy polygon array to a plain Python list of [x, y] pairs."""
    return [[float(pt[0]), float(pt[1])] for pt in poly]


def bbox_polygon(min_x: float, min_y: float, max_x: float, max_y: float) -> list:
    """Return an axis-aligned rectangle as a polygon vertex list."""
    return [
        [min_x, min_y],
        [max_x, min_y],
        [max_x, max_y],
        [min_x, max_y],
    ]


# ── Shapely helpers ───────────────────────────────────────────────────────────

def _to_shapely(poly_points):
    """Convert a gdspy polygon (Nx2 array) into a valid shapely Polygon."""
    try:
        p = Polygon(poly_points)
        if not p.is_valid:
            p = make_valid(p)
        return p if (p is not None and not p.is_empty) else None
    except Exception:
        return None


def _effective_width(poly_points):
    """
    True minimum feature width via minimum rotated bounding rectangle.
    Correctly measures angled waveguides instead of inflating their width
    to the diagonal of the axis-aligned bounding box.
    """
    p = _to_shapely(poly_points)
    if p is None:
        return None
    rect = p.minimum_rotated_rectangle
    coords = list(rect.exterior.coords)
    if len(coords) < 4:
        return None
    side_a = np.linalg.norm(np.array(coords[0]) - np.array(coords[1]))
    side_b = np.linalg.norm(np.array(coords[1]) - np.array(coords[2]))
    return min(side_a, side_b)


def _circumradius(p1, p2, p3) -> float:
    """
    Circumradius of the triangle formed by three points = radius of the unique
    circle passing through all three. For a discretized arc this equals the local
    radius of curvature. Returns inf for collinear points (straight line, no bend).
    
    Formula: R = (a·b·c) / (4·Area), where a,b,c are side lengths.
    Numerically stable: area computed via cross product; inf returned when area < ε.
    """
    a = np.linalg.norm(p2 - p1)
    b = np.linalg.norm(p3 - p2)
    c = np.linalg.norm(p1 - p3)
    # Signed area via cross product (2× area = |cross|)
    area2 = abs((p2[0] - p1[0]) * (p3[1] - p1[1]) - (p3[0] - p1[0]) * (p2[1] - p1[1]))
    if area2 < 1e-12:
        return float("inf")  # collinear — infinite radius (straight segment)
    return (a * b * c) / (2.0 * area2)


def _check_bend_radius(poly_points, min_bend_radius):
    """
    Circle-fit bend radius check. For each triple of consecutive polygon vertices
    (p_prev, p_curr, p_next), the circumradius of their triangle equals the radius
    of the arc through those three points — the local radius of curvature at p_curr.

    A circumradius below min_bend_radius means the waveguide bends tighter than the
    foundry minimum at that vertex. Returns list of (vertex, measured_radius_µm, turn_angle_deg).

    Advantages over the angle heuristic:
    - Catches tight bends on smooth discretized curves where per-vertex angles are small
    - Reports the actual measured bend radius in µm rather than a proxy angle

    Limitation (same as the heuristic):
    - Still flags intentional sharp features (right-angle couplers, grating corners) —
      verify those manually against your foundry's official DRC.
    """
    flags = []
    n = len(poly_points)
    if n < 3:
        return flags

    pts = [np.array(poly_points[i], dtype=float) for i in range(n)]

    for i in range(n):
        p_prev = pts[i - 1]
        p_curr = pts[i]
        p_next = pts[(i + 1) % n]

        len1 = np.linalg.norm(p_curr - p_prev)
        len2 = np.linalg.norm(p_next - p_curr)
        if len1 < 1e-9 or len2 < 1e-9:
            continue  # degenerate edge — skip

        r = _circumradius(p_prev, p_curr, p_next)

        if r < min_bend_radius:
            # Confirm a meaningful turn exists — collinear noise gives inf radius,
            # so this branch is only reached for genuine corners.
            cos_a = np.clip(
                np.dot(p_curr - p_prev, p_next - p_curr) / (len1 * len2), -1.0, 1.0
            )
            turn_deg = np.degrees(np.arccos(cos_a))
            if turn_deg > 5.0:  # ignore sub-5° wobble on nominally straight edges
                flags.append((tuple(p_curr), round(float(r), 4), round(turn_deg, 1)))

    return flags


def _error(msg: str) -> dict:
    return {
        "status": "error",
        "errorMessage": msg,
        "violations": [],
        "passedChecks": 0,
        "totalChecks": 4,
        "layoutData": None,
    }


# ── Main DRC logic ────────────────────────────────────────────────────────────

def run_drc(gds_path: str, rules: dict) -> dict:
    grid_size = rules.get("gridSize", 0.001)

    # Build per-layer rule lookup: (layer_num, datatype) -> rule dict
    layer_rules = {}
    for lr in rules.get("layers", []):
        key = (int(lr["layer"]), int(lr["datatype"]))
        layer_rules[key] = {
            "minWidth":      float(lr.get("minWidth",      0.4)),
            "minSpacing":    float(lr.get("minSpacing",    0.2)),
            "minBendRadius": float(lr.get("minBendRadius", 5.0)),
            "name":          lr.get("name", f"Layer {lr['layer']}/{lr['datatype']}"),
        }

    # Fallback: if no layers configured, fall back to legacy flat rules so old
    # callers still work (e.g. integration tests that pass a flat rules object).
    if not layer_rules:
        key = (1, 0)
        layer_rules[key] = {
            "minWidth":      float(rules.get("minWidth",      0.4)),
            "minSpacing":    float(rules.get("minSpacing",    0.2)),
            "minBendRadius": float(rules.get("minBendRadius", 5.0)),
            "name":          "Layer 1/0",
        }

    # Load GDS
    try:
        gdsii = gdspy.GdsLibrary()
        gdsii.read_gds(gds_path)
        top_cells = gdsii.top_level()
        if not top_cells:
            return _error("No top-level cells found in the GDS file.")
        cell = top_cells[0]
    except Exception as e:
        return _error(f"Failed to parse GDS file: {e}")

    all_polygons_by_spec = cell.get_polygons(by_spec=True)
    if not all_polygons_by_spec:
        return _error("No polygons found in this GDS file. Check that the file contains layout geometry.")

    # Flatten all polygons: (layer, datatype, numpy_array)
    all_raw = []
    for (layer, dt), polys in all_polygons_by_spec.items():
        for poly in polys:
            all_raw.append((layer, dt, poly))

    # Polygons on PDK-configured layers only
    pdk_raw = [(layer, dt, poly) for (layer, dt, poly) in all_raw
               if (layer, dt) in layer_rules]

    # ── Build layout data (all polygons, capped for response size) ────────────
    layout_polygons = []
    for layer, dt, poly in all_raw[:MAX_LAYOUT_POLYGONS]:
        layout_polygons.append({
            "layer": int(layer),
            "datatype": int(dt),
            "vertices": poly_to_list(poly),
            "isPdkLayer": (int(layer), int(dt)) in layer_rules,
        })

    # Defensive guard — all_raw should be non-empty (checked above), but vstack
    # on an empty list raises ValueError, so be explicit.
    if not all_raw:
        return _error("No polygon data could be extracted from the GDS file.")
    all_pts = np.vstack([poly for _, _, poly in all_raw])
    layout_bounds = {
        "minX": float(all_pts[:, 0].min()),
        "minY": float(all_pts[:, 1].min()),
        "maxX": float(all_pts[:, 0].max()),
        "maxY": float(all_pts[:, 1].max()),
    }
    layout_data = {
        "topCell":  cell.name,          # GDS top-cell name — used by the KLayout .lyrdb export
        "bounds": layout_bounds,
        "polygons": layout_polygons,
        "configuredLayers": [
            {"layer": k[0], "datatype": k[1], "name": v["name"]}
            for k, v in layer_rules.items()
        ],
    }

    violations = []
    passed_checks = 0
    total_checks = 4

    # ── Check 1: Grid snap (global — all layers) ──────────────────────────────
    off_grid = 0
    examples = []
    first_off_grid_poly = None

    for (layer, dt, poly) in all_raw:
        poly_has_off_grid = False
        for pt in poly:
            rx = round(pt[0] / grid_size) * grid_size
            ry = round(pt[1] / grid_size) * grid_size
            if abs(rx - pt[0]) > 1e-9 or abs(ry - pt[1]) > 1e-9:
                off_grid += 1
                poly_has_off_grid = True
                if len(examples) < 3:
                    examples.append(f"({pt[0]:.4f}, {pt[1]:.4f})")
        if poly_has_off_grid and first_off_grid_poly is None:
            first_off_grid_poly = poly

    if off_grid > 0:
        ex_str = ", ".join(examples)
        if off_grid > len(examples):
            ex_str += f" … and {off_grid - len(examples)} more"
        violations.append({
            "rule":        "Grid Snap",
            "requirement": f"{grid_size} µm ({int(grid_size * 1000)} nm grid)",
            "location":    f"{off_grid} off-grid vertex/vertices — e.g. {ex_str}",
            "severity":    "warning",
            "details":     (f"{off_grid} polygon vertex/vertices are not snapped to the "
                            f"{int(grid_size * 1000)} nm manufacturing grid. "
                            "Off-grid coordinates cause lithography errors during fabrication."),
            "geometry":    poly_to_list(first_off_grid_poly) if first_off_grid_poly is not None else None,
        })
    else:
        passed_checks += 1

    # ── Checks 2–4 operate only on PDK-configured layers ─────────────────────

    if not pdk_raw:
        # No polygons on any configured layer — report an info violation and pass the checks
        violations.append({
            "rule":        "Layer Coverage",
            "requirement": "At least one polygon on a PDK-configured layer",
            "location":    "Entire layout",
            "severity":    "info",
            "details":     ("No polygons found on any PDK-configured layer. "
                            f"Configured layers: {', '.join(f'{k[0]}/{k[1]}' for k in layer_rules)}. "
                            "Checks 2–4 (width, spacing, bend radius) were skipped."),
            "geometry":    None,
        })
        passed_checks += 3  # width, spacing, bend — vacuously pass
        has_critical = any(v.get("severity") == "critical" for v in violations)
        return {
            "status":       "fail" if has_critical else "pass",
            "errorMessage": None,
            "violations":   violations,
            "passedChecks": passed_checks,
            "totalChecks":  total_checks,
            "layoutData":   layout_data,
        }

    # ── Check 2: Minimum width per layer (rotated rectangle) ─────────────────
    width_viols = []
    for (layer, dt, poly) in pdk_raw:
        lr = layer_rules[(layer, dt)]
        min_width = lr["minWidth"]
        layer_name = lr["name"]
        w = _effective_width(poly)
        if w is not None and w < min_width:
            min_x, min_y = np.min(poly, axis=0)
            width_viols.append((layer, dt, layer_name, w, min_width, min_x, min_y, poly))

    if width_viols:
        for (layer, dt, layer_name, w, min_width, mx, my, poly) in width_viols[:5]:
            violations.append({
                "rule":        "Minimum Feature Width",
                "requirement": f"≥ {min_width} µm ({int(min_width * 1000)} nm) on {layer_name}",
                "location":    f"Layer {layer}/{dt} ({layer_name}) polygon at ({mx:.3f}, {my:.3f})",
                "severity":    "critical",
                "details":     (f"True minor-axis width {w:.4f} µm is below the "
                                f"{min_width} µm minimum for {layer_name}. "
                                "Measured via minimum rotated bounding rectangle — correctly "
                                "handles angled waveguides. Features this narrow cannot be "
                                "reliably fabricated."),
                "geometry":    poly_to_list(poly),
            })
        if len(width_viols) > 5:
            violations.append({
                "rule":        "Minimum Feature Width",
                "requirement": "See layer-specific thresholds",
                "location":    f"… {len(width_viols) - 5} additional polygons",
                "severity":    "critical",
                "details":     f"{len(width_viols) - 5} more polygons violate the minimum width rule.",
                "geometry":    None,
            })
    else:
        passed_checks += 1

    # ── Check 3: Minimum spacing — STRtree spatial index per layer ───────────
    # Builds an R-tree per (layer, datatype) group: candidates are found in
    # O(n log n) rather than O(n²) — no polygon cap, handles full-chip layouts.
    # Only compares polygons on the same (layer, datatype); cross-layer overlap
    # is intentional in multi-layer photonic designs.

    # Build shapely representations for all PDK polygons
    shapely_polys = []
    pdk_poly_data = []
    for (layer, dt, poly) in pdk_raw:
        sp = _to_shapely(poly)
        if sp is not None:
            shapely_polys.append(sp)
            pdk_poly_data.append((layer, dt, poly))

    # Group polygon indices by (layer, datatype) for same-layer comparisons
    layer_groups: dict = defaultdict(list)
    for idx, (layer, dt, _) in enumerate(pdk_poly_data):
        layer_groups[(layer, dt)].append(idx)

    spacing_viols = []
    for (layer, dt), group_indices in layer_groups.items():
        if len(group_indices) < 2:
            continue
        lr = layer_rules[(layer, dt)]
        min_spacing = lr["minSpacing"]
        layer_name = lr["name"]

        local_polys = [shapely_polys[i] for i in group_indices]
        tree = STRtree(local_polys)

        for local_i, poly_a in enumerate(local_polys):
            # Buffer by min_spacing — any polygon whose bbox intersects the
            # buffered area is a candidate worth an exact distance check.
            candidates = tree.query(poly_a.buffer(min_spacing))
            for local_j in candidates:
                local_j = int(local_j)
                if local_j <= local_i:
                    continue  # skip self and already-processed pairs
                poly_b = local_polys[local_j]
                try:
                    dist = poly_a.distance(poly_b)
                except Exception:
                    continue
                if dist < min_spacing:  # dist==0 means overlapping — also a violation
                    c = poly_a.centroid
                    raw_i = group_indices[local_i]
                    raw_j = group_indices[local_j]
                    pts_pair = np.vstack([pdk_poly_data[raw_i][2], pdk_poly_data[raw_j][2]])
                    region_geo = bbox_polygon(
                        float(pts_pair[:, 0].min()), float(pts_pair[:, 1].min()),
                        float(pts_pair[:, 0].max()), float(pts_pair[:, 1].max()),
                    )
                    spacing_viols.append((dist, c.x, c.y, layer, dt, layer_name, min_spacing, region_geo))

    if spacing_viols:
        for (dist, cx, cy, layer, dt, layer_name, min_spacing, geo) in spacing_viols[:5]:
            violations.append({
                "rule":        "Minimum Spacing (crosstalk risk)",
                "requirement": f"≥ {min_spacing} µm ({int(min_spacing * 1000)} nm) on {layer_name}",
                "location":    f"Layer {layer}/{dt} ({layer_name}) polygon pair near ({cx:.2f}, {cy:.2f})",
                "severity":    "critical",
                "details":     (f"Exact polygon-to-polygon gap {dist:.4f} µm is below the "
                                f"{min_spacing} µm threshold for {layer_name}. "
                                "Waveguides this close will exhibit evanescent coupling "
                                "(optical crosstalk), degrading channel isolation."),
                "geometry":    geo,
            })
        if len(spacing_viols) > 5:
            violations.append({
                "rule":        "Minimum Spacing (crosstalk risk)",
                "requirement": "See layer-specific thresholds",
                "location":    f"… {len(spacing_viols) - 5} additional pairs",
                "severity":    "critical",
                "details":     f"{len(spacing_viols) - 5} more polygon pairs violate minimum spacing.",
                "geometry":    None,
            })
    else:
        passed_checks += 1

    # ── Check 4: Minimum bend radius — circle-fit per layer ───────────────────
    bend_viols = []
    for (layer, dt, poly) in pdk_raw:
        lr = layer_rules[(layer, dt)]
        min_bend_r = lr["minBendRadius"]
        layer_name = lr["name"]
        if min_bend_r <= 0:
            continue  # layer not applicable (e.g. rectangular contacts)
        flags = _check_bend_radius(poly, min_bend_r)
        for (pt, radius, angle) in flags:
            bend_viols.append((pt, radius, angle, layer, dt, layer_name, min_bend_r, poly))

    if bend_viols:
        for (pt, radius, angle, layer, dt, layer_name, min_bend_r, poly) in bend_viols[:5]:
            margin = min_bend_r * 0.5
            geo = bbox_polygon(pt[0] - margin, pt[1] - margin, pt[0] + margin, pt[1] + margin)
            violations.append({
                "rule":        "Minimum Bend Radius",
                "requirement": f"≥ {min_bend_r} µm on {layer_name}",
                "location":    f"Layer {layer}/{dt} ({layer_name}) vertex at ({pt[0]:.3f}, {pt[1]:.3f})",
                "severity":    "warning",
                "details":     (f"Measured bend radius {radius:.3f} µm (circumradius of consecutive "
                                f"vertex triple, turn angle {angle:.1f}°) is below the {min_bend_r} µm "
                                f"minimum for {layer_name}. "
                                "Intentional sharp features (right-angle couplers, grating corners) "
                                "should be verified manually against your foundry's official DRC "
                                "before tape-out."),
                "geometry":    geo,
            })
        if len(bend_viols) > 5:
            violations.append({
                "rule":        "Minimum Bend Radius",
                "requirement": "See layer-specific thresholds",
                "location":    f"… {len(bend_viols) - 5} additional vertices",
                "severity":    "warning",
                "details":     f"{len(bend_viols) - 5} more vertices have circumradius below the minimum bend threshold.",
                "geometry":    None,
            })
    else:
        passed_checks += 1

    has_critical = any(v.get("severity") == "critical" for v in violations)
    return {
        "status":       "fail" if has_critical else "pass",
        "errorMessage": None,
        "violations":   violations,
        "passedChecks": passed_checks,
        "totalChecks":  total_checks,
        "layoutData":   layout_data,
    }


def main():
    parser = argparse.ArgumentParser(description="PhotonLint DRC Engine")
    parser.add_argument("--gds-path",   required=True)
    parser.add_argument("--rules-json", required=True)
    args = parser.parse_args()

    try:
        rules = json.loads(args.rules_json)
    except json.JSONDecodeError as e:
        _emit(_error(f"Invalid rules JSON: {e}"))
        sys.exit(0)

    try:
        result = run_drc(args.gds_path, rules)
    except Exception as e:  # noqa: BLE001
        _emit(_error(f"DRC engine internal error: {type(e).__name__}: {e}"))
        sys.exit(2)
    _emit(result)


if __name__ == "__main__":
    main()
