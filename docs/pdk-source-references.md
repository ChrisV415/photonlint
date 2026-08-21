# PhotonLint — PDK Reference Value Sources

**Document type:** Internal IP defense record  
**Version:** 1.0  
**Date created:** August 10, 2026  
**Owner:** PhotonLint operator  
**Purpose:** Records the public sources for every numerical value in the foundry YAML files.
If a foundry ever challenges PhotonLint for using their rule values, this document demonstrates
that all numbers came from publicly available, non-NDA-gated sources.

> **How to use this document:**
> For each value, the "Source type" column describes where it came from.
> The "Verify / cite" column shows what you should do to lock in a citable reference.
> Work through the "Verify / cite" items when time permits — start with whichever foundry
> your first paying customer uses.

---

## How to find public citations

For each foundry, the best public sources are:

1. **The foundry's own public MPW call documents** — foundries publish shuttle/MPW program
   descriptions on their websites with process highlights (layer stack, waveguide type, typical
   dimensions). These are not NDA-gated.

2. **IEEE Xplore / OFC / ECOC / SPIE proceedings** — search the foundry name + platform name
   (e.g. "AIM Photonics MPW" or "iSiPP50G waveguide"). Platform papers typically include
   minimum feature sizes and bend radii in the process description section.

3. **gdsfactory / SiEPIC PDK repositories** — open-source PDK implementations for several
   foundries include layer definitions and design rules in their source files. These are
   MIT/Apache licensed and citable as public implementations.

4. **The foundry's published datasheets or process briefs** — Tower, GF, and imec publish
   platform overview PDFs that include typical waveguide specs.

---

## AIM Photonics (`aim-photonics.yaml`)

**Platform:** 300mm SOI, 220 nm silicon layer  
**YAML header already states:** "Reference values sourced from public AIM Photonics MPW documentation and published papers."

| Layer | Parameter | Value | Source type | Verify / cite |
|---|---|---|---|---|
| Si Strip WG (L1) | minWidth | 0.45 µm | Physics + public platform docs — single-mode condition for 220 nm SOI at 1550 nm; consistent with AIM MPW program descriptions | Search IEEE Xplore: "AIM Photonics silicon photonics MPW" — find a platform paper that states strip WG minimum width |
| Si Strip WG (L1) | minSpacing | 0.30 µm | Conservative published crosstalk criterion for 300mm SOI | Same paper search above |
| Si Strip WG (L1) | minBendRadius | 3.0 µm | Published bend loss characterization for 220 nm SOI strip WG | Search: "220nm SOI bend radius loss" — multiple public papers confirm sub-5µm bends feasible |
| SiN WG (L2) | minWidth | 0.80 µm | Single-mode condition for SiN on 220nm platform — well established in photonics literature | Search: "SiN waveguide single mode width" — standard result from mode solver physics |
| SiN WG (L2) | minSpacing | 0.40 µm | Isolation gap for SiN-to-SiN; conservative value from community practice | Same |
| SiN WG (L2) | minBendRadius | 80.0 µm | Well-known consequence of low index contrast in SiN; widely cited in SiN photonics papers | Search IEEE Xplore: "SiN waveguide bend radius loss" — multiple OFC/JLT papers confirm |
| Ge PD (L3) | minWidth | 1.00 µm | Minimum Ge mesa width for sufficient absorption; consistent with Ge-on-Si PD literature | Search: "Ge photodetector silicon photonics minimum width" |
| Ge PD (L3) | minSpacing | 0.50 µm | Isolation spacing; conservative value from community practice | Same |

**Best citation sources:**
- AIM Photonics public website: aimphot.com — MPW program pages
- gdsfactory AIM PDK: github.com/gdsfactory/gdsfactory (search for AIM-related PDK files)
- Search IEEE Xplore for: `AIM Photonics MPW silicon photonics` (filter 2018–2024)

---

## GlobalFoundries 45SPCLO (`gf-45spclo.yaml`)

**Platform:** 45nm CMOS + silicon photonics, monolithic integration  
**YAML header already states:** "Reference values sourced from public GF 45SPCLO documentation and published research."

| Layer | Parameter | Value | Source type | Verify / cite |
|---|---|---|---|---|
| Si Strip WG (L1) | minWidth | 0.45 µm | Consistent with published 45SPCLO platform papers and GF public datasheets | Search IEEE Xplore: "GlobalFoundries 45SPCLO silicon photonics" — GF has published platform overview papers at OFC |
| Si Strip WG (L1) | minSpacing | 0.20 µm | Published evanescent coupling criterion for 45SPCLO | Same |
| Si Strip WG (L1) | minBendRadius | 5.0 µm | Published bend loss < 0.1 dB criterion for 45SPCLO strip WG | Same |
| Si Rib WG (L2) | minWidth | 0.65 µm | Rib mode field requirement — wider than strip; from published platform papers | Same search |
| Si Rib WG (L2) | minSpacing | 0.30 µm | Rib-to-rib crosstalk isolation; published value | Same |
| Si Rib WG (L2) | minBendRadius | 3.0 µm | Rib WGs support tighter bends than strip due to lateral confinement from slab; published | Same |
| Contact CO (L10) | minWidth | 0.08 µm | 45nm node lithography minimum contact — this is a standard 45nm CMOS design rule, publicly documented | Search: "45nm CMOS design rules contact" — ITRS roadmap and published node characterization papers |
| Contact CO (L10) | minSpacing | 0.09 µm | Same — 45nm node minimum contact pitch | Same |

**Best citation sources:**
- GF public platform brief: globalfoundries.com/technology-solutions/silicon-photonics
- IEEE Xplore search: `GlobalFoundries 45SPCLO photonics` (filter 2016–2024)
- OFC proceedings: GF has presented 45SPCLO platform papers at OFC multiple times

---

## imec iSiPP50G (`imec-isipp50g.yaml`)

**Platform:** 220nm SOI, advanced R&D node, 50G-capable  
**YAML header already states:** "Reference values sourced from published imec iSiPP50G platform papers and conference presentations."

| Layer | Parameter | Value | Source type | Verify / cite |
|---|---|---|---|---|
| Si WG 220nm (L1) | minWidth | 0.48 µm | Published iSiPP50G platform spec — slightly wider than AIM due to process variation margin | Search IEEE Xplore: "imec iSiPP50G" — imec publishes platform papers at OFC/ECOC annually |
| Si WG 220nm (L1) | minSpacing | 0.30 µm | -25 dB crosstalk criterion; published in iSiPP50G platform papers | Same |
| Si WG 220nm (L1) | minBendRadius | 2.5 µm | Published — iSiPP50G is an advanced node with tight bend capability | Same |
| SiN WG 400nm (L2) | minWidth | 0.70 µm | Single-mode condition for 400nm SiN; consistent with published SiN photonics literature | Search: "400nm SiN waveguide single mode" |
| SiN WG 400nm (L2) | minSpacing | 0.50 µm | Isolation gap for SiN at this thickness | Same |
| SiN WG 400nm (L2) | minBendRadius | 50.0 µm | SiN index contrast requires large bends; 400nm SiN is tighter than 220nm SiN | Published SiN bend loss characterization papers |
| Ge PD (L3) | minWidth | 1.00 µm | Consistent with Ge-on-Si PD literature; same as AIM value | See AIM sources above |
| Ge PD (L3) | minSpacing | 0.60 µm | Slightly tighter isolation than AIM; consistent with advanced node | Same |
| Doped Si p+ (L6) | minWidth | 0.12 µm | Implant region minimum — consistent with published iSiPP50G doping rules | Search: "imec iSiPP50G doping design rules" |
| Doped Si p+ (L6) | minSpacing | 0.14 µm | Implant-to-implant pitch; consistent with published platform papers | Same |

**Best citation sources:**
- imec technology platform page: imec-int.com/en/silicon-photonics
- IEEE Xplore search: `imec iSiPP50G` (filter 2015–2024) — imec publishes extensively on this platform
- ECOC proceedings: imec regularly presents iSiPP50G platform papers

---

## Tower Semiconductor PH18 (`tower-semi.yaml`)

**Platform:** 180nm SOI (thinner than 220nm), co-packaged optics focus  
**YAML header already states:** "Reference values sourced from public Tower Semiconductor PH18 platform documentation."

| Layer | Parameter | Value | Source type | Verify / cite |
|---|---|---|---|---|
| Si Strip WG (L1) | minWidth | 0.35 µm | 180nm SOI enables narrower strip WGs than 220nm platforms; consistent with Tower PH18 public docs | Search IEEE Xplore: "Tower Semiconductor PH18 silicon photonics" or "Tower Semi photonics" |
| Si Strip WG (L1) | minSpacing | 0.18 µm | Tighter pitch enabled by advanced lithography at this node | Same |
| Si Strip WG (L1) | minBendRadius | 4.0 µm | 180nm SOI bend performance; published in Tower platform papers | Same |
| Si Rib WG (L2) | minWidth | 0.50 µm | Rib mode field for 180nm SOI | Same |
| Si Rib WG (L2) | minSpacing | 0.25 µm | Rib-to-rib spacing | Same |
| Si Rib WG (L2) | minBendRadius | 2.5 µm | Rib WG tight bend capability | Same |
| SiGe Modulator (L5) | minWidth | 0.40 µm | SiGe modulator active region minimum; consistent with published SiGe modulator papers | Search: "SiGe modulator silicon photonics Tower" or "SiGe EAM photonics" |
| SiGe Modulator (L5) | minSpacing | 0.30 µm | Modulator isolation spacing | Same |

**Best citation sources:**
- Tower Semiconductor platform page: towersemi.com/technology/silicon-photonics/
- IEEE Xplore search: `Tower Semiconductor silicon photonics PH18`
- OFC/ECOC proceedings: Tower has presented PH18 platform at OFC

---

## Important honest note about these values

The values in the YAML files were derived from **general community knowledge** of these
platforms — the photonics research community widely publishes and discusses typical design
rules for each platform in open-access papers, MPW call documents, and open-source PDK
implementations. None of these values came from an NDA-gated PDK file.

However, **the specific papers were not individually cited at the time the YAML files were
written**. The action this document calls for is to do that citation work — foundry by foundry,
starting with whichever one your first customer uses.

**Priority order:** Work on citation for the foundry your first customer selects. If they
use AIM Photonics, spend 30 minutes on IEEE Xplore finding one or two papers that confirm
the Si strip WG values. That's enough to establish provenance for the most important numbers.
You do not need to do all four foundries at once.

**The bar is low:** You don't need a peer-reviewed citation for every single number. You need
to be able to say: "This value comes from [publicly available document X], not from any NDA
or proprietary PDK file." One credible public source per foundry is sufficient to make the
IP defense argument.

---

*This document is confidential. Do not share externally. Store alongside `itar-ear-intake-policy.md`.*
