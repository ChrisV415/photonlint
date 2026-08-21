---
name: ReportLab XML escaping
description: User-supplied strings in report.py must be xml_escape()'d before Paragraph() or PDF generation crashes
---

ReportLab's `Paragraph()` uses a mini-HTML parser. Any `<`, `>`, or `&` in user-supplied text causes a parse error and crashes PDF generation mid-build with no useful error message to the end user.

**Why:** Filenames, violation rule names, locations, and detail strings all originate from GDS files and DRC engine output — they can contain angle brackets (e.g. layer names like `<metal1>`) or ampersands.

**How to apply:** In `report.py`, wrap every user-supplied string in `xml_escape()` (from `xml.sax.saxutils`) before passing to `Paragraph()`. Static strings (hardcoded labels, integer counts) don't need escaping.
