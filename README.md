# LEX — Limited Energy eXperts · Project Repository

> **Storage:** D:\\DEV\\LEX — RAID 1 redundant volume (Jarvis workstation)
> **Live site:** [limitedenergy.net](https://limitedenergy.net) — deployed via Netlify

---

## Project Overview

**LEX** is the public-facing website for Limited Energy eXperts (limitedenergy.net), an independent consulting practice for AI-enabled design and smart automation — ICT design consulting, Division 27/28 design support, and AI tooling for engineering workflows.

**Positioning:** Not a licensed engineering firm. No PE services offered or implied. Shawn C. Tovey holds the RCDD credential from BICSI. All work is ICT design consulting and AI tooling.

Tools hosted on the site:
- **PLEX v2.32** — Power Load EXaminer. TR/ER infrastructure sizing: power, UPS, generator, PoE, cooling. Single HTML file, client-side. Library power values at 90% of nameplate max.
- **The Estimator v1.25** — Limited energy job costing, BICSI WBS, sell-side proposal + internal bid report. Single HTML file, client-side.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Language | HTML5 / CSS3 / Vanilla JavaScript (ES6+) |
| Fonts | Google Fonts — Oswald, Barlow, Space Mono |
| Build | None — single-file deploy, no bundler or transpiler |
| Hosting | Netlify (static) |
| Analytics | Google Analytics 4 — G-ECRHM5MP0Y |
| Deploy | Netlify CLI — `netlify deploy --dir site --prod` (from D:\\DEV\\LEX) |
| Version control | Git (local repo · D:\\DEV\\LEX) |
| Persistence | Browser `localStorage` (`.plex` JSON export/import) |

---

## Repository Structure

```
D:\DEV\LEX\
├── site\                              # Deployable web root (Netlify target)
│   ├── index.html                     # LEX main site (home)
│   ├── about.html                     # About — Shawn C. Tovey, RCDD
│   ├── home-automation.html           # Smart home design subpage
│   ├── plex.html                      # PLEX Power Load EXaminer v2.32
│   ├── estimate.html                  # The Estimator v1.25
│   ├── 404.html                       # Custom 404
│   ├── 410.html                       # Custom 410
│   ├── space-knight.html              # Space Knight tool (private)
│   ├── analytics.bak.2026-05-21.html  # Analytics dashboard (backup, not served)
│   ├── linkedin.bak.2026-05-21.html   # LinkedIn dashboard (backup, not served)
│   ├── manifest.json                  # PWA manifest (linked from plex + estimate)
│   ├── sitemap.xml                    # 5 URLs: / /plex /estimate /home-automation /about
│   ├── llms.txt                       # LLM-readable site description
│   ├── robots.txt
│   ├── netlify.toml
│   ├── favicon.svg / .ico / favicon-32.png
│   ├── apple-touch-icon.png
│   ├── og-image.png                   # OG/Twitter share image
│   ├── portrait.webp                  # Hero portrait
│   ├── ha-workstation.jpg             # Home automation stack photo
│   ├── ha-energy.jpg                  # Grafana energy dashboard screenshot
│   ├── ha-grafana.jpg                 # Grafana 3-panel screenshot
│   └── data\                          # Private data files (not linked publicly)
├── scripts\                           # Utility scripts (not deployed)
│   └── plex-excel-import\             # Rack-elevation XLSX → .plex converter
├── PLEX_Library_v2.32.xlsx            # Excel export of PLEX device library
├── .claude\                           # Claude Code project config
├── .netlify\                          # Netlify CLI site binding (state.json)
├── .gitignore
└── README.md                          # This file
```

> **Deploy boundary:** Only `site\` is published. Repo root, `.claude\`, `scripts\`, and scratch files are NOT deployed.

---

## Nav Architecture

All 5 public pages share a unified hamburger navigation. No desktop nav-links list — hamburger only.

| Page | Desktop CTA | Mobile drawer |
|---|---|---|
| index.html | Launch PLEX → | About / PLEX / The Estimator / Home Automation / Contact |
| about.html | Launch PLEX → | Home / About / PLEX / The Estimator / Home Automation / Contact |
| home-automation.html | Launch PLEX → | Home / About / PLEX / The Estimator / Home Automation / Contact |
| plex.html (tool nav) | The Estimator → | Home / About / PLEX / The Estimator / Home Automation / Contact |
| estimate.html (tool nav) | Launch PLEX → | Home / About / PLEX / The Estimator / Home Automation / Contact |

Tool pages (plex, estimate) use a compact 38px `#lex-sitenav` with `lsn-*` CSS classes. Content pages use a 64px full nav.

---

## Google Analytics 4

**Property:** G-ECRHM5MP0Y

Custom events tracked:
- `email_click` — delegated listener on `a[href^="mailto:"]` (all pages)
- `tool_run` — fired on print/export actions in PLEX and The Estimator
- `contact_form_submit` — fired on successful Netlify form submission

Key events to star in GA after first fire: `email_click`, `tool_run`, `contact_form_submit`

---

## PLEX — Power Load EXaminer

Current version: **v2.32**

Single-file client-side tool. All logic, styles, and markup in `site/plex.html`.

### Version discipline
- Version format: `2.xx` (two-digit minor, e.g. 2.28 … 2.32)
- Bump on each compile when PLEX functionality or library data changes
- Non-functional changes (metadata only) do not require a bump
- Five version string locations in `plex.html`: comment header, `<title>`, header span, print credit, `PLEX_VERSION` constant

### Library — power values
- All `w:` values = `floor(nameplate_max_W × 0.90)`
- PoE switch `w:` = chassis overhead only; PoE budget tracked in `poeB:`
- UPS `w:` = self-consumption (inverter losses), not load capacity
- Access control board `w:` includes board + reader port loads
- Door hardware `w:` = peak actuating draw at design voltage

### Data model
- State persisted in `localStorage` as JSON
- Export/import via `.plex` files (JSON with `PLEX-LEX` signature header)
- Wall devices and rack items handled separately; UPS items have capacity fields (`cW`, `cVA`, `rtMin`)

### Library — pending verification
The following entries remain unverified pending confirmed datasheets:
- Genetec Streamvault SV-110, SV-500, SV-1100 (removed — model names unconfirmed)
- LifeSafety Power FlexPower e2, e8 (first-principles estimates)
- Altronix AL600ULX, AL1012ULACM (first-principles estimates)
- Milestone Husky IVO 800R/500R (renamed to 700R/350R — confirmed datasheets)

### Key editorial rules (NEC 2026 / TIA alignment)
- **"Limited energy"** — never "low voltage" in public-facing copy
- **TR / ER / EF** (TIA) — never MDF / IDF in new copy
- No client identifiers in deliverables, scripts, notes, or memory (site codes are OK)

---

## The Estimator

Current version: **v1.25** (`site/estimate.html`, URL: `/estimate`)

Single-file client-side job costing tool. BICSI WBS section codes, configurable crew roles, federal/California OT rules, sell-side margin form, customer proposal, internal bid report. No account required. No data leaves the browser.

---

## Texas Law Compliance (Engineering Titles)

Per Texas Occupations Code Chapter 1001 (Texas Engineering Practice Act):
- Shawn is never described as an "engineer" — title is **ICT Design Consultant & Physical Security Systems Designer**
- LEX is never described as an "engineering firm" — it is an **ICT design and consulting practice**
- "AI-Enabled Design" (not "Engineering") throughout
- "Division 27/28 design support" (not "engineering support")
- PE disclaimer present on index.html and about.html footers

**Keep as-is (correct usage):**
- "engineer of record" / EOR — references to the licensed PE reviewing output
- "licensed electrical engineer" — correct disclaimers in PLEX/Estimator
- "Milestone Certified Design Engineer" — third-party credential name

---

## Deploy Procedure

**Always use PowerShell. Never Bash for Windows paths.**

```powershell
# From D:\DEV\LEX — explicit directory, every time
Set-Location D:\DEV\LEX
netlify deploy --prod --dir=site
```

The Netlify site ID is stored in `.netlify/state.json`. The production publish lock can be managed at app.netlify.com → limitedenergy → Deploys.

**Deploy rule: only deploy when explicitly instructed. Never auto-deploy after edits.**

---

## Development Workflow

1. **Scope changes** — discuss and confirm scope before editing
2. **Edit** — make targeted, surgical changes only
3. **Verify** — grep/read to confirm changes before deploying
4. **Deploy on instruction** — wait for explicit "deploy" command
5. **Version bump** — update all 5 PLEX version strings on each functional compile
6. **llms.txt + about.html** — keep PLEX version number in sync across these files

---

## Development Machine

| Item | Detail |
|---|---|
| Host | Jarvis (RDPJarvis) |
| Project drive | D:\\ — RAID 1 mirrored volume ("Jurrano") |
| Shell | PowerShell 7 (primary for deploys) + Git Bash |
| Claude Code | Anthropic Claude — project memory at `%USERPROFILE%\.claude\projects\D--DEV-LEX\` |

---

*Limited Energy eXperts · limitedenergy.net · Open reuse of PLEX and The Estimator permitted with credit.*
