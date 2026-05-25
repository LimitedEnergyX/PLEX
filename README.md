# LEX — Limited Energy eXperts · Project Repository

> **Storage:** D:\\DEV\\LEX — RAID 1 redundant volume (Jarvis workstation)
> **Live site:** [limitedenergy.net](https://limitedenergy.net) — deployed via Netlify

---

## Project Overview

**LEX** is the public-facing website for Limited Energy eXperts (limitedenergy.net), a specialty limited energy / low-voltage engineering and coordination consultancy.

Tools hosted on the site:
- **PLEX v2.28** — Power Load EXaminer. TR/ER infrastructure sizing: power, UPS, generator, PoE, cooling. Single HTML file, client-side.
- **The Estimator v1.25** — Limited energy job costing, BICSI WBS, sell-side proposal + internal bid report. Single HTML file, client-side.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Language | HTML5 / CSS3 / Vanilla JavaScript (ES6+) |
| Fonts | Google Fonts — Oswald, Barlow, Space Mono |
| Build | None — single-file deploy, no bundler or transpiler |
| Hosting | Netlify (static) |
| Deploy (local) | Netlify CLI — `netlify deploy --dir site --prod` |
| Deploy (remote) | Netlify MCP proxy via Cowork / Claude Agent |
| Version control | Git (local repo · D:\\DEV\\LEX) |
| Persistence | Browser `localStorage` (`.plex` JSON export/import) |

---

## Repository Structure

```
D:\DEV\LEX\
├── site\                          # Deployable web root (Netlify target)
│   ├── index.html                 # LEX main site
│   ├── home-automation.html       # Home Automation design subpage
│   ├── plex.html                  # PLEX Power Load EXaminer v2.28
│   ├── estimate.html              # The Estimator v1.25
│   ├── portrait.webp              # Hero portrait (extracted from Exante360 PDF)
│   ├── ha-workstation.jpg         # Home automation stack photo
│   ├── ha-energy.jpg              # Grafana energy dashboard screenshot
│   ├── ha-grafana.jpg             # Grafana 3-panel screenshot
│   ├── analytics.html             # Netlify analytics dashboard
│   ├── linkedin.html              # LinkedIn dashboard
│   ├── space-knight.html          # Space Knight tool
│   ├── sitemap.xml
│   ├── robots.txt
│   ├── netlify.toml
│   ├── favicon.svg / .ico
│   └── apple-touch-icon.png
├── scripts\                       # Utility scripts (not deployed)
│   └── plex-excel-import\         # Rack-elevation XLSX → .plex converter
├── .claude\                       # Claude Code project config
│   ├── commands\                  # Slash commands (deploy, etc.)
│   └── tools\                     # Import/export helpers
├── .netlify\                      # Netlify CLI site binding (state.json)
├── .gitignore
└── README.md                      # This file
```

> **Deploy boundary:** Only `site\` is published. The repo root, `.claude\`, `scripts\`, and any scratch/generated files are NOT for deployment.

---

## PLEX — Power Load EXaminer

Current version: **v2.28**

Single-file client-side tool. All logic, styles, and markup in `site/plex.html`.

### Version discipline
- Version format: `2.xx` (two-digit minor, e.g. 2.22, 2.23 … 2.28)
- Bump on each compile when PLEX functionality changes
- Non-functional changes (metadata, favicons) do not require a bump
- Five version string locations in `plex.html` (comment, title, header span, print credit, `PLEX_VERSION` constant)

### Data model
- State persisted in `localStorage` as JSON
- Export/import via `.plex` files (JSON with `PLEX-LEX` signature header)
- Wall devices and rack items handled separately; UPS items have capacity fields (`cW`, `cVA`, `rtMin`)

### Key editorial rules (NEC 2026 / TIA alignment)
- **"Limited energy"** — never "low voltage" in public-facing copy
- **TR / ER / EF** (TIA) — never MDF / IDF in new copy
- No client identifiers in deliverables, scripts, notes, or memory (site codes are OK)

---

## The Estimator

Current version: **v1.25** (`site/estimate.html`, URL: `/estimate`)

Single-file client-side job costing tool. BICSI WBS section codes, configurable crew roles, federal/California OT rules, sell-side margin form, customer proposal, internal bid report. No account required. No data leaves the browser.

---

## Deploy Procedure

### Local (preferred for major changes)
```powershell
# From D:\DEV\LEX
netlify deploy --dir site --prod
```
The Netlify site ID is stored in `.netlify/state.json`.

### Remote via Cowork / Claude Agent
Netlify MCP proxy deploy — used for quick fixes from phone or remote sessions. Deploys atomically from the Cowork outputs folder. **After any remote deploy, sync changes back into `site\` before the next local deploy to avoid overwrite divergence.**

---

## Development Workflow

1. **Scope changes** — discuss and confirm scope before editing tools
2. **Explicit compile gate** — no edits to `site/plex.html` without explicit "compile" confirmation
3. **Edit → Git commit → Deploy** — no staging environment; Netlify publishes immediately
4. **Version bump** — update all 5 version strings on each functional PLEX compile
5. **Commit message format** — `PLEX vX.XX — short description` for PLEX changes
6. **Sync after remote deploys** — copy changed files from Cowork outputs back to `site\` to keep local repo current

---

## Development Machine

| Item | Detail |
|---|---|
| Host | Jarvis (RDPJarvis) |
| Project drive | D:\\ — RAID 1 mirrored volume ("Jurrano") |
| Shell | Git Bash (MSYS) + PowerShell 7 |
| RAM | Corsair 32GB DDR4 @ 3200MHz (XMP II enabled) |
| Claude Code | Anthropic Claude — project memory at `%USERPROFILE%\.claude\projects\D--DEV-LEX\` |

---

*Limited Energy eXperts · limitedenergy.net · Open reuse of PLEX and The Estimator permitted with credit.*
