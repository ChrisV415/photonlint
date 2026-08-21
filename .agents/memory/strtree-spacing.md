---
name: STRtree spacing check
description: The DRC spacing check uses shapely STRtree grouped per (layer, datatype) — O(n log n), no polygon cap
---

The minimum-spacing DRC check in `drc_engine.py` uses `shapely.STRtree` rather than a nested O(n²) loop. Polygons are grouped by `(layer, datatype)`. For each group a tree is built; each polygon is queried with `.buffer(min_spacing)` to find bbox candidates, then exact `.distance()` is called only for those.

**Why:** The original O(n²) loop was capped at 300 polygons (`SPACING_CAP`), silently skipping spacing checks on larger layouts. STRtree handles full-chip GDS files without a cap.

**How to apply:** Cross-layer comparisons are intentionally skipped (different layer overlaps are by design in photonics). Only same-(layer, datatype) pairs are compared.
