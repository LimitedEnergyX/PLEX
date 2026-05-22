# LEX — Limited Energy eXperts · Project Repository

> **Storage:** D:\DEV\LEX — RAID 1 redundant volume (Jarvis workstation)
> **Live site:** deployed via Netlify CLI · `netlify deploy --dir site --prod`

---

## Project Overview

**LEX** is the public-facing website for Limited Energy eXperts (limitedenergy.net), a specialty limited energy / low-voltage engineering and coordination consultancy.

The primary tool hosted on the site is **PLEX — Power Load EXaminer**, a client-side single-page application for sizing TR/ER infrastructure: power, UPS, generator, PoE budget, and cooling load. No server required. No build step. Ships as a single HTML file.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Language | HTML5 / CSS3 / Vanilla JavaScript (ES6+) |
| Fonts | Google Fonts — Oswald, Barlow, Barlow Condensed, Space Mono |
| Build | None — single-file deploy, no bundler or transpiler |
| Hosting | Netlify (static) |
| Deploy CLI | Netlify CLI (`netlify deploy --dir site --prod`) |
| Version control | Git (local repo on Jarvis · D:\DEV\LEX) |
| Persistence | Browser `localStorage` (`.plex` JSON export/import) |

---

## Repository Structure

```
D:\DEV\LEX\
├── site\                        # Deployable web root (Netlify target)
│   ├── index.html               # LEX main site
│   ├── plex.html                # PLEX Power Load EXaminer (primary tool)
│   ├── favicon.svg / .ico       # Brand favicons
│   └── apple-touch-icon.png
├── scripts\                     # Utility and import scripts (not deployed)
│   └── plex-excel-import\       # Rack-elevation XLSX → .plex converter
├── .claude\                     # Claude Code project config
│   ├── commands\                # Slash commands (deploy, etc.)
│   └── tools\                   # Import/export helpers
├── .netlify\                    # Netlify CLI site binding (state.json)
├── .gitignore
└── README.md                    # This file
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

## Deploy Procedure

```powershell
# From D:\DEV\LEX
netlify deploy --dir site --prod
```

The Netlify site ID is stored in `.netlify/state.json`. No manual site ID needed.

---

## Development Workflow

1. **Scope changes** — discuss and confirm scope before editing `plex.html`
2. **Explicit compile gate** — no edits to `site/plex.html` without explicit "compile" confirmation
3. **Edit → Git commit → Deploy** — no staging environment; Netlify publishes immediately
4. **Version bump** — update all 5 version strings on each functional compile
5. **Commit message format** — `PLEX vX.XX — short description` for PLEX changes

---

## Development Machine

| Item | Detail |
|---|---|
| Host | Jarvis (RDPJarvis) |
| Project drive | D:\ — RAID 1 mirrored volume |
| Shell | Git Bash (MSYS) + PowerShell 7 |
| Claude Code | Anthropic Claude — project memory at `%USERPROFILE%\.claude\projects\D--DEV-LEX\` |

---

*Limited Energy eXperts · limitedenergy.net · Open reuse of PLEX permitted with credit.*
