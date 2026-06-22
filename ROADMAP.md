# PLEX Product Roadmap
Status: Internal planning document
Last updated: 2026-06-13

## Vision

PLEX is a Division 27/28 coordination assistant, not a calculator.

The core value proposition:
**Interview once. Reuse throughout the project lifecycle.**

An RCDD or Division 27/28 designer enters project information once — facility type, room classification, design intent, equipment list. Every deliverable (coordination report, basis of design, spec notes, AI prompts, cost estimates) is generated from that single project model.

The long-term goal is eliminating the Division 27 consultant's most persistent problem: entering the same project information in seven different places across the project lifecycle.

---

## Product Architecture

### The Project Model
PLEX captures a structured project model (see TAXONOMY.md) that is the authoritative source for all outputs. The calculator is the first consumer of this model; it will not be the last.

```
Wizard (interview) → Project Model → Outputs:
                                     ├─ Coordination Report (PDF)
                                     ├─ Basis of Design (narrative)
                                     ├─ EOR AI Prompt (structured text)
                                     ├─ Project Data Export (JSON)
                                     ├─ SpecGen integration (future)
                                     └─ Estimator integration (future)
```

### Client-Side Commitment
PLEX is intentionally client-side only. No backend, no accounts, no subscriptions. Advantages:
- No infrastructure cost or maintenance
- Works offline
- Private by default — project data never leaves the user's machine
- Fast, zero friction

This commitment holds until a specific feature requires persistence that cannot be satisfied by file export. That decision point has not been reached.

### Multi-Room Architecture
Schema v1.0 supports multi-room projects via `rooms[]`. The UI currently implements single-room (rooms[0]). Multi-room UI is a planned enhancement; the data model is ready.

---

## Completed (v2.50)

- [x] Guided wizard — facility type, room type, goals, equipment knowledge, start mode
- [x] Facility profiles — 9 types with pre-configured UPS, cooling, generator, and growth defaults
- [x] Design intent fields — availability objective, recovery objective, growth/redundancy philosophy
- [x] Context-aware assistant panel — reactive to live calc() output
- [x] Category-based diversity factors per ASHRAE TC 9.9
- [x] Buffered cooling output (IT load + ambient gain + 1.25× buffer)
- [x] Per-rack BTU/hr and W/U density display
- [x] Load density thresholds with flag text
- [x] Electrical service sizing suggestion (208V 3Ø and 240V 1Ø)
- [x] Ambient heat gain field (cooling only)
- [x] Full UPS sizing workflow — 4-way backing per device, planning load, recommended size, runtime calc
- [x] UPS warning bands (Good/Acceptable/Caution/Overloaded)
- [x] Manufacturer UPS presets — APC, Eaton, Vertiv, CyberPower (23 models)
- [x] Room maturity indicator — Conceptual/SD/DD/CD with phase-appropriate disclaimer language
- [x] Starter templates — Small TR, Medium TR, Standard ER, High-Density ER
- [x] Create Design Report — cover page + 8-section print/PDF output
- [x] EOR AI Prompt — structured text export with Copy and Download
- [x] Project Data Export — schema v1.0 JSON with multi-room structure
- [x] Visual refresh — rounded corners, elevation shadows, modern feel
- [x] TAXONOMY.md — authoritative term and value definitions

---

## Prioritized Backlog

### Priority 1: Stable Schema and Taxonomy (immediate)
- [ ] TAXONOMY.md established ✓ (this document)
- [ ] Schema v1.0 contract documented ✓
- [ ] All outputs verified against taxonomy (no term drift)

### Priority 2: Basis of Design Generator
The highest-ROI next feature. An RCDD can generate a 2–3 page BoD narrative at the end of an SD meeting, covering:
- Room purpose and classification
- Availability and recovery strategy
- UPS strategy (philosophy, sizing basis, runtime rationale)
- Generator strategy
- Cooling strategy
- Growth philosophy and assumptions

All inputs already exist in the project model. This is a document template engine consuming existing data.

**Success metric:** An RCDD can hand the generated BoD to an architect or owner and reference it in meeting minutes without editing.

### Priority 3: EOR AI Prompt Refinement
The current EOR prompt is functional. Enhancements:
- Runtime estimate confidence levels (Manual entry: Moderate / Manufacturer preset: High)
- Applicable standards list auto-populated by facility type (NFPA 99 for healthcare, TIA-1221 for public safety, etc.)
- "Export to Specification Notes" variant — Division 27 narrative register

### Priority 4: Multi-Room UI
Single room selector UI; rooms share project/facility/designIntent; each room has independent equipment list and calculations. Project-level summary aggregates all rooms.

### Priority 5: SpecGen Integration
Machine-readable JSON output (already built) consumed by a SpecGen tool to generate Division 27 specification language. Integration requires:
- Stable schema (complete)
- SpecGen endpoint that accepts PLEX JSON
- Review/approval workflow in SpecGen

### Priority 6: Estimator Integration
Same pattern as SpecGen — PLEX JSON → Estimator tool.

### Priority 7: Team / Project Save
Only introduce if a specific feature requires it and users are explicitly requesting it. Consider: read-only share link (encode project JSON in URL hash) as a zero-backend sharing mechanism.

### Not on the Roadmap
- CFD / airflow modeling
- Electrical one-lines
- Breaker coordination / selective coordination
- Short-circuit analysis
- Raceway fill calculations
- BIM integration

**Reason:** These features compete with MEP software the EOR already has. The moment PLEX enters this territory, it becomes a worse version of something else rather than the best version of what it is.

---

## Competitive Context

PLEX is not competing with:
- APC / Eaton calculators (single-vendor, single-purpose)
- HVAC load calculators (different domain)
- BIM tools (different audience and scope)

PLEX's actual competitive risk is AI-first engineering workflow products that do not yet exist but will. The durable differentiator is not the load calculations — those are replicable. The durable differentiator is:
- RCDD-grounded domain expertise embedded in the taxonomy
- Structured engineering intent capture (facility profiles, design intent fields, availability/recovery objectives)
- BICSI/TIA-correct terminology throughout
- Practitioner-level outputs that translate directly into professional deliverables

The collected engineering judgment is not replicable without the professional context.

---

## Homepage Evolution

Current message: "Power, UPS & Cooling Planning for ICT and Security Systems"
— Describes functionality. Sells a tool.

Target message: "Capture design intent once. Reuse it throughout the project lifecycle."
— Describes value. Sells a workflow.

This transition should happen when the Basis of Design generator ships, because that's when the value proposition is fully demonstrable.
