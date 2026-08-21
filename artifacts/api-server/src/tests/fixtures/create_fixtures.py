#!/usr/bin/env python3
"""
PhotonLint DRC benchmark fixture generator.

Creates five synthetic GDS files that exercise each check type in isolation.
Each fixture is small, deterministic, and independently verifiable by hand.

Output: JSON manifest written to stdout:
  { "<name>": { "gds_path": "...", "rules": { ... } } }

Rules shared by all fixtures (so tests can run them unchanged):
  gridSize   = 0.005 µm  (5 nm)
  layer 1/0  "WG"
    minWidth      = 0.2 µm  (200 nm)
    minSpacing    = 2.0 µm
    minBendRadius = 5.0 µm

Fixture geometry and expected outcome:
  clean        — 10×10 µm square — PASS (passedChecks=4, violations=[])
  grid-snap    — same square, one vertex 1 nm off-grid — PASS, Grid Snap warning
  min-width    — 0.1×20 µm strip (too narrow) — FAIL, Minimum Feature Width critical
  min-spacing  — two 10×5 µm rects 0.5 µm apart — FAIL, Minimum Spacing critical
  bend-radius  — fat L-shape, inner corners ~3.8 µm radius — PASS, Bend Radius warnings
"""
import sys
import json
import argparse
import os

try:
    import gdspy
except ImportError as e:
    json.dump({"error": f"Missing dependency: {e}"}, sys.stdout)
    sys.exit(1)

# ── Shared rules ──────────────────────────────────────────────────────────────

RULES = {
    "gridSize": 0.005,
    "layers": [
        {
            "layer": 1,
            "datatype": 0,
            "name": "WG",
            "minWidth": 0.2,
            "minSpacing": 2.0,
            "minBendRadius": 5.0,
        }
    ],
}


# ── GDS writer ────────────────────────────────────────────────────────────────

def _write_gds(
    path: str,
    polys: list,
    layer: int = 1,
    datatype: int = 0,
) -> None:
    lib = gdspy.GdsLibrary()
    # gdspy tracks cells in a process-global library.  Without this reset,
    # the second fixture created in the same process raises:
    #   ValueError: Cell named TOP already present in library.
    gdspy.current_library = lib
    cell = lib.new_cell("TOP")
    for pts in polys:
        cell.add(gdspy.Polygon(pts, layer=layer, datatype=datatype))
    lib.write_gds(path)


def _p(output_dir: str, name: str) -> str:
    return os.path.join(output_dir, f"{name}.gds")


# ── Fixture definitions ───────────────────────────────────────────────────────

def fixture_clean(output_dir: str) -> str:
    """
    A single 10×10 µm square on layer 1/0.

    Check 1  Grid Snap:       all vertices on 5 nm grid → PASS
    Check 2  Min Width:       10 µm >> 0.2 µm → PASS
    Check 3  Min Spacing:     single polygon, no pairs → PASS (vacuously)
    Check 4  Bend Radius:     corner circumradius = √2/2×10 ≈ 7.1 µm > 5 µm → PASS

    Expected: status=pass, passedChecks=4, violations=[]
    """
    path = _p(output_dir, "clean")
    _write_gds(path, [[(0, 0), (10, 0), (10, 10), (0, 10)]])
    return path


def fixture_grid_snap(output_dir: str) -> str:
    """
    Same 10×10 µm square with vertex (0,0) shifted to (0.001, 0) — 1 nm off-grid.

    Check 1  Grid Snap:       1 off-grid vertex → FAIL → Grid Snap warning
    Check 2  Min Width:       10 µm >> 0.2 µm → PASS
    Check 3  Min Spacing:     single polygon → PASS
    Check 4  Bend Radius:     corners still ~7.1 µm > 5 µm → PASS

    Expected: status=pass (warnings only), passedChecks=3, violations=[Grid Snap warning]
    """
    path = _p(output_dir, "grid-snap")
    # Vertex 0 is 1 nm off-grid; rest are on-grid
    _write_gds(path, [[(0.001, 0), (10, 0), (10, 10), (0, 10)]])
    return path


def fixture_min_width(output_dir: str) -> str:
    """
    A 0.1×20 µm rectangle (width 0.1 µm < 0.2 µm minimum).

    Check 1  Grid Snap:       0.1/0.005=20, 20/0.005=4000 — all on-grid → PASS
    Check 2  Min Width:       0.1 µm < 0.2 µm → FAIL → critical violation
    Check 3  Min Spacing:     single polygon → PASS
    Check 4  Bend Radius:     short-edge corner: R = (20×0.1×√(400.01))/(2×2) ≈ 50 µm > 5 µm → PASS

    Expected: status=fail, passedChecks=3, violations=[Minimum Feature Width critical]
    """
    path = _p(output_dir, "min-width")
    _write_gds(path, [[(0, 0), (0.1, 0), (0.1, 20), (0, 20)]])
    return path


def fixture_min_spacing(output_dir: str) -> str:
    """
    Two 10×5 µm rectangles separated by 0.5 µm (< 2.0 µm minimum spacing).

    Rect A: y=[0, 5]   Rect B: y=[5.5, 10.5]   gap=0.5 µm

    Check 1  Grid Snap:       all on-grid → PASS
    Check 2  Min Width:       both rects 5 µm wide >> 0.2 µm → PASS
    Check 3  Min Spacing:     pair distance 0.5 µm < 2.0 µm → FAIL → critical
    Check 4  Bend Radius:     rectangle corners ~ 5.6 µm > 5 µm → PASS

    Expected: status=fail, passedChecks=3, violations=[Minimum Spacing critical]
    """
    path = _p(output_dir, "min-spacing")
    _write_gds(path, [
        [(0, 0),   (10, 0),   (10, 5),    (0, 5)],     # rect A
        [(0, 5.5), (10, 5.5), (10, 10.5), (0, 10.5)],  # rect B, 0.5 µm gap
    ])
    return path


def fixture_bend_radius(output_dir: str) -> str:
    """
    Fat L-shaped waveguide with 3 µm-wide legs and a sharp inner corner.

    Polygon: [(0,0),(10,0),(10,3),(3,3),(3,10),(0,10)]

    Inner corners at (10,3) and (3,3)/(3,10):
      At (10,3): prev=(10,0), curr=(10,3), next=(3,3)
        a=3, b=7, c=√(49+9)≈7.62, area2=21 → R=3×7×7.62/(2×21)≈3.8 µm < 5 µm ✓

    Check 1  Grid Snap:       all on integer µm (divisible by 0.005) → PASS
    Check 2  Min Width:       3 µm leg >> 0.2 µm → PASS
    Check 3  Min Spacing:     single polygon → PASS
    Check 4  Bend Radius:     inner corners ~3.8 µm < 5 µm → FAIL → warning(s)

    Expected: status=pass (warnings only), passedChecks=3, violations=[Bend Radius warning(s)]
    """
    path = _p(output_dir, "bend-radius")
    pts = [(0, 0), (10, 0), (10, 3), (3, 3), (3, 10), (0, 10)]
    _write_gds(path, [pts])
    return path


# ── Entry point ───────────────────────────────────────────────────────────────

def main() -> None:
    parser = argparse.ArgumentParser(
        description="Generate labeled DRC benchmark fixtures"
    )
    parser.add_argument(
        "--output-dir",
        required=True,
        help="Directory to write GDS fixture files into (created if absent)",
    )
    args = parser.parse_args()

    os.makedirs(args.output_dir, exist_ok=True)

    manifest = {
        "clean":        {"gds_path": fixture_clean(args.output_dir),       "rules": RULES},
        "grid-snap":    {"gds_path": fixture_grid_snap(args.output_dir),   "rules": RULES},
        "min-width":    {"gds_path": fixture_min_width(args.output_dir),   "rules": RULES},
        "min-spacing":  {"gds_path": fixture_min_spacing(args.output_dir), "rules": RULES},
        "bend-radius":  {"gds_path": fixture_bend_radius(args.output_dir), "rules": RULES},
    }

    json.dump(manifest, sys.stdout)
    sys.stdout.flush()


if __name__ == "__main__":
    main()
