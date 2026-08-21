---
name: Rate limiter placement relative to multer
description: drcCheckLimiter must be applied before upload.single() so that rate-limited requests are rejected before multer parses and writes the uploaded file to disk
---

In Express routes that use multer for file uploads, any rate-limiting middleware must be registered before the multer middleware in the handler chain.

**Why:** If multer runs first, it streams and writes the uploaded file to the temp directory before the rate limiter can reject the request. This wastes disk I/O and temp space on every over-limit request, and creates files that may not be cleaned up.

**How to apply:** `router.post("/drc/check", drcCheckLimiter, upload.single("file"), handler)` — limiter first, multer second.
