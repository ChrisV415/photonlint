#!/usr/bin/env python3
"""
PhotonLint PDF Report Generator.

Reads a DRC run JSON from stdin, writes the PDF bytes to stdout.

Usage:
  echo '<run-json>' | python3 report.py
"""

import sys
import json
from io import BytesIO
from datetime import datetime
from xml.sax.saxutils import escape as xml_escape

try:
    from reportlab.lib import colors
    from reportlab.lib.pagesizes import letter
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib.units import inch
    from reportlab.platypus import (
        SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
        HRFlowable,
    )
except ImportError as e:
    sys.stderr.write(f"Missing reportlab: {e}\n")
    sys.exit(1)


DARK = colors.HexColor("#0f172a")
TEAL = colors.HexColor("#0ea5e9")
RED  = colors.HexColor("#dc2626")
AMB  = colors.HexColor("#d97706")
GRN  = colors.HexColor("#16a34a")
LGRY = colors.HexColor("#f1f5f9")
MGRY = colors.HexColor("#e2e8f0")
DGRY = colors.HexColor("#64748b")


def build_pdf(run: dict) -> bytes:
    buffer = BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        topMargin=0.75 * inch,
        bottomMargin=0.75 * inch,
        leftMargin=0.75 * inch,
        rightMargin=0.75 * inch,
    )

    styles = getSampleStyleSheet()
    title_s  = ParagraphStyle("PLTitle",  parent=styles["Title"],  textColor=DARK,
                               fontSize=20, spaceAfter=4)
    sub_s    = ParagraphStyle("PLSub",    parent=styles["Normal"], textColor=DGRY,
                               fontSize=9,  spaceAfter=2)
    label_s  = ParagraphStyle("PLLabel",  parent=styles["Normal"], textColor=DARK,
                               fontSize=10, fontName="Helvetica-Bold", spaceBefore=10, spaceAfter=2)
    body_s   = ParagraphStyle("PLBody",   parent=styles["Normal"], textColor=DARK, fontSize=9)
    note_s   = ParagraphStyle("PLNote",   parent=styles["Normal"], textColor=DGRY, fontSize=8,
                               spaceBefore=16)
    verdict_pass_s = ParagraphStyle("PLPass", parent=styles["Normal"], textColor=GRN,
                                    fontSize=16, fontName="Helvetica-Bold", spaceBefore=8)
    verdict_fail_s = ParagraphStyle("PLFail", parent=styles["Normal"], textColor=RED,
                                    fontSize=16, fontName="Helvetica-Bold", spaceBefore=8)

    violations  = run.get("violations", [])
    status      = run.get("status", "error")
    foundry     = run.get("foundryName", "Unknown Foundry")
    filename    = run.get("filename", "unknown.gds")
    checked_at  = run.get("checkedAt", "")
    proc_ms     = run.get("processingTimeMs", 0)
    passed      = run.get("passedChecks", 0)
    total       = run.get("totalChecks", 0)
    error_msg   = run.get("errorMessage")

    # Format timestamp
    try:
        ts = datetime.fromisoformat(checked_at.replace("Z", "+00:00"))
        ts_str = ts.strftime("%Y-%m-%d %H:%M UTC")
    except Exception:
        ts_str = checked_at or "—"

    n_critical = sum(1 for v in violations if v.get("severity") == "critical")
    n_warning  = sum(1 for v in violations if v.get("severity") == "warning")

    elems = [
        Paragraph("PhotonLint DRC Report", title_s),
        HRFlowable(width="100%", thickness=1, color=MGRY),
        Spacer(1, 6),
        Paragraph(f"File: <b>{xml_escape(filename)}</b>", sub_s),
        Paragraph(f"Foundry / PDK: <b>{xml_escape(foundry)}</b>", sub_s),
        Paragraph(f"Generated: {ts_str}  ·  Processing time: {proc_ms} ms", sub_s),
        Spacer(1, 12),
    ]

    # Verdict
    if status == "pass":
        elems.append(Paragraph(
            "PRELIMINARY SCREEN COMPLETE — No critical findings in the configured checks. "
            "This is not foundry approval or tape-out sign-off.",
            verdict_pass_s,
        ))
    elif status == "fail":
        elems.append(Paragraph(f"FAIL — {n_critical} critical violation(s), {n_warning} warning(s) found.", verdict_fail_s))
    else:
        elems.append(Paragraph(f"ERROR — {xml_escape(error_msg or 'Processing failed.')}", verdict_fail_s))

    # Summary table
    elems.append(Spacer(1, 12))
    elems.append(Paragraph("Summary", label_s))
    summary_data = [
        ["Checks run", "Passed", "Critical violations", "Warnings"],
        [str(total), str(passed), str(n_critical), str(n_warning)],
    ]
    summary_tbl = Table(summary_data, colWidths=[1.5 * inch, 1.2 * inch, 2.0 * inch, 1.2 * inch])
    summary_tbl.setStyle(TableStyle([
        ("BACKGROUND",  (0, 0), (-1, 0),  DARK),
        ("TEXTCOLOR",   (0, 0), (-1, 0),  colors.white),
        ("FONTNAME",    (0, 0), (-1, 0),  "Helvetica-Bold"),
        ("FONTSIZE",    (0, 0), (-1, -1), 9),
        ("ALIGN",       (0, 0), (-1, -1), "CENTER"),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [LGRY, colors.white]),
        ("GRID",        (0, 0), (-1, -1), 0.4, MGRY),
        ("VALIGN",      (0, 0), (-1, -1), "MIDDLE"),
        ("TOPPADDING",  (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ]))
    elems.append(summary_tbl)

    # Violations table
    if violations:
        elems.append(Spacer(1, 16))
        elems.append(Paragraph("Violations", label_s))

        col_widths = [1.5 * inch, 1.3 * inch, 1.5 * inch, 0.8 * inch, 2.0 * inch]
        header = ["Rule", "Requirement", "Location", "Severity", "Details"]
        rows   = [header]
        for v in violations:
            sev = v.get("severity", "info").upper()
            rows.append([
                Paragraph(xml_escape(v.get("rule", "")), body_s),
                Paragraph(xml_escape(v.get("requirement", "")), body_s),
                Paragraph(xml_escape(v.get("location", "")), body_s),
                Paragraph(xml_escape(sev), body_s),
                Paragraph(xml_escape(v.get("details", "")), body_s),
            ])

        tbl = Table(rows, colWidths=col_widths, repeatRows=1)
        row_colors = []
        for idx, v in enumerate(violations, start=1):
            sev = v.get("severity", "info")
            bg = colors.HexColor("#fef2f2") if sev == "critical" else \
                 colors.HexColor("#fffbeb") if sev == "warning" else colors.white
            row_colors.append(("BACKGROUND", (0, idx), (-1, idx), bg))

        tbl.setStyle(TableStyle([
            ("BACKGROUND",   (0, 0), (-1, 0),  DARK),
            ("TEXTCOLOR",    (0, 0), (-1, 0),  colors.white),
            ("FONTNAME",     (0, 0), (-1, 0),  "Helvetica-Bold"),
            ("FONTSIZE",     (0, 0), (-1, -1), 8),
            ("GRID",         (0, 0), (-1, -1), 0.4, MGRY),
            ("VALIGN",       (0, 0), (-1, -1), "TOP"),
            ("TOPPADDING",   (0, 0), (-1, -1), 4),
            ("BOTTOMPADDING",(0, 0), (-1, -1), 4),
            *row_colors,
        ]))
        elems.append(tbl)

    # Footer note
    elems.append(Spacer(1, 20))
    elems.append(HRFlowable(width="100%", thickness=0.5, color=MGRY))
    elems.append(Paragraph(
        "Rule source: reference estimate or engineering override, not an NDA-gated official foundry PDK deck. "
        "This report is preliminary geometry screening only and is not foundry approval, PDK validation, or "
        "tape-out sign-off. Bend findings use the circumradius of consecutive polygon vertices; they do not "
        "reconstruct the original waveguide centerline or curve. Verify all findings and intentional sharp "
        "features against the foundry's official flow before submission.",
        note_s,
    ))

    try:
        doc.build(elems)
    except Exception as e:
        sys.stderr.write(f"[report] PDF build error: {e}\n")
        raise
    buffer.seek(0)
    return buffer.getvalue()


if __name__ == "__main__":
    raw = sys.stdin.read()
    try:
        run = json.loads(raw)
    except json.JSONDecodeError as e:
        sys.stderr.write(f"Invalid JSON: {e}\n")
        sys.exit(1)

    pdf_bytes = build_pdf(run)
    try:
        sys.stdout.buffer.write(pdf_bytes)
        sys.stdout.buffer.flush()
    except BrokenPipeError:
        pass  # Node process closed stdin before we finished writing — not an error
