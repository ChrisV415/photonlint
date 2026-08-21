---
name: Bend radius circle-fit
description: drc_engine.py bend-radius check uses circumradius, not the angle heuristic; return tuple changed.
---

## Rule
`_check_bend_radius` returns `(vertex_tuple, radius_µm: float, turn_angle_deg: float)` — three elements, not two.

Check 4 unpacks as `for (pt, radius, angle, layer, dt, layer_name, min_bend_r, poly) in bend_viols`.

**Why:** Replaced the `angle > threshold AND edge < min_bend_radius` heuristic with circumradius of consecutive vertex triples (R = abc/2·area). Circumradius equals the local radius of curvature for discretized arcs, so it catches smooth tight bends where per-vertex angles are small and the old heuristic silently missed them.

**How to apply:** If you regenerate or extend the bend-radius logic, the return signature is `(point, float, float)` not `(point, float)`. The violation message reports measured radius in µm, not angle. Same false-positive caveat on right-angle couplers applies — those are labeled "verify manually."
