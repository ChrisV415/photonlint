---
name: GDS file type — frontend/backend sync
description: Both .gds and .gdsii are valid GDSII extensions; keep frontend drop handler and file input accept in sync with the backend multer fileFilter
---

The backend multer fileFilter (drc.ts) accepts both `.gds` and `.gdsii` extensions. The frontend drop handler and `<input accept>` attribute must match, otherwise valid `.gdsii` files are silently rejected by the browser before reaching the server.

**Why:** GDSII files use both extensions interchangeably in the EDA industry. Rejecting `.gdsii` at the frontend while accepting it at the backend is a silent mismatch that frustrates users with valid files.

**How to apply:** In the drop handler use `/\.gds(ii)?$/i.test(f.name)`. In the file input use `accept=".gds,.gdsii"`. Any time the backend fileFilter changes, update both frontend checks.
