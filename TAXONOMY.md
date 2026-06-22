# PLEX Division 27/28 Taxonomy
Version: 1.0
Status: Authoritative — all PLEX outputs and consuming tools must conform to these definitions.

## Canonical Term Mapping (Aliases)
Terms PLEX accepts as input vs. terms used in all outputs.

| Concept | Canonical Term (outputs) | Accepted aliases (input/informal) |
|---|---|---|
| Telecommunications Room | TR | MDF, IDF, comms closet, telecom closet, wiring closet |
| Equipment Room | ER | Main data room, server room, network room, comms room |
| Security Equipment Room | SER | Security room, head-end room, guard room |
| Entrance Facility | EF | Demarc room, MPOE, entrance room |
| Limited Energy | Limited Energy | Low voltage, LV, IT/AV, structured cabling |

Note: MDF and IDF are legacy terms. PLEX outputs always use TR/ER/EF per TIA-568/TIA-569.

---

## Facility Types
Values used in schema `facility.facilityType` and `FACILITY_PROFILES` constant.

| Value | Label | Definition |
|---|---|---|
| `missioncritical` | Mission Critical / Data Center | Facility where any service interruption causes significant operational, financial, or safety impact. No single point of failure is acceptable. Typical examples: hyperscale data center and mission-critical clients, financial trading floors, broadcast facilities. |
| `healthcare` | Healthcare / Medical | Facility subject to NFPA 99 Healthcare Technology Management requirements. Life safety and critical branch loads must be identified and isolated. Typical examples: hospitals, surgical centers, medical office buildings. |
| `publicsafety` | Public Safety / Emergency Services | Facility providing emergency communications or dispatch services. Subject to NENA, TIA-1221, and applicable state/local emergency communications standards. Typical examples: 911 PSAPs, EOCs, dispatch centers. |
| `correctional` | Correctional / Detention | Facility requiring continuous access control and surveillance availability. Security system power continuity is a life safety requirement. |
| `education` | Education | K–12 or higher education facility. High device density, BYOD/1:1 device planning required. Generator typically owner preference. |
| `enterprise` | Enterprise / Commercial Office | Standard commercial office environment. ICT infrastructure planned for technology refresh and tenant flexibility. |
| `government` | Government / Federal | Government or federal facility. May be subject to FISMA, FedRAMP, COOP, or physical security requirements beyond standard commercial practice. |
| `hospitality` | Hospitality / Retail | Guest-facing or retail environment. High device density, guest network access, high turnover. |
| `unknown` | Not specified | Facility type not identified. Conservative defaults applied. |

---

## Room Types
Values used in schema `rooms[].roomType`.

| Value | Label | TIA Reference | Definition |
|---|---|---|---|
| `tr` | Telecommunications Room | TIA-568, TIA-569 | Enclosed space for termination of telecommunications cabling, housing active network equipment serving the floor or zone. May be called a wiring closet or IDF in legacy usage — use TR in all outputs. |
| `er` | Equipment Room | TIA-568, TIA-569 | Centralized space housing the main cross-connect, core network equipment, servers, and/or security head-end equipment for the building or campus. May be called MDF or server room in legacy usage — use ER in all outputs. |
| `ser` | Security Equipment Room | Division 28 practice | Dedicated space for physical security head-end equipment: access control servers, video management systems, intercom infrastructure, and related power and UPS. |
| `ef` | Entrance Facility | TIA-568 | Space housing the point of demarcation between outside plant and building cabling. Houses service provider equipment and building entrance protectors. |
| `dc` | Data Center Space | TIA-942 | Purpose-built space for high-density IT equipment. Subject to TIA-942 Tier/Rated classification methodology. |
| `cabinet` | Outdoor Cabinet | NEMA / IEC | Weatherproof enclosure for network, security, or communications equipment installed outdoors or in untempered spaces. |
| `unknown` | Not specified | — | Room type not identified. |

---

## Project Phases
Maps to AIA project delivery phases. Values used in `project.phase`.

| Value | Label | Definition | Appropriate PLEX use |
|---|---|---|---|
| `conceptual` | Conceptual | Pre-design; equipment lists are notional. Values should not be used for procurement, permitting, or construction. | Order-of-magnitude budgeting, owner programming. |
| `schematic` | Schematic Design | Preliminary design; equipment selection is not final. Verify quantities and wattages at DD. | Basis of Design drafting, MEP coordination kickoff. |
| `dd` | Design Development | Current design intent; minor adjustments expected through CD. | Coordination submissions, engineer cross-check. |
| `cd` | Construction Documents | Final design intent; values should be coordinated with all trade drawings. | Final power schedules, permit submissions. |

---

## Availability Objectives
Values used in `designIntent.availabilityObjective`.

| Value | Label | One-sentence definition |
|---|---|---|
| `standard` | Standard | Normal commercial availability; planned maintenance windows acceptable; interruptions tolerable with advance notice. |
| `enhanced` | Enhanced | Reduced planned outage windows; redundant components preferred; N+1 for critical systems. |
| `highavailability` | High Availability | No single point of failure in power or cooling; N+1 minimum redundancy throughout; generator strongly recommended. |
| `missioncritical` | Mission Critical | Continuous availability required; no service interruption acceptable; N+1 or 2N redundancy; generator required; concurrent maintainability target. |

---

## Recovery Objectives
Values used in `designIntent.recoveryObjective`.

| Value | Label | Definition | Typical UPS runtime implication |
|---|---|---|---|
| `orderly` | Orderly Shutdown | UPS provides time for controlled equipment shutdown during utility outage. Generator not required. | 5–15 minutes. |
| `ridethrough` | Generator Ride-Through | UPS bridges power gap until standby generator transfers and stabilizes (typically 10–30 seconds transfer + stabilization). | 15–30 minutes recommended; verify with generator ATS spec. |
| `continuous` | Continuous Operations | No service interruption acceptable. UPS + generator provides seamless continuity. Utility restoration does not require load transfer. | 30+ minutes; sized for generator maintenance window. |

---

## Equipment Backing Types
Values used in `equipment[].upsBacking`.

| Value | Label | Definition |
|---|---|---|
| `ups` | UPS Backed | Equipment connected to UPS output; receives conditioned power and battery backup during outage. |
| `gen` | Generator Backed | Equipment connected to generator-backed circuit but NOT UPS backed; experiences brief interruption during transfer. |
| `critical` | Life Safety / Critical | Equipment on dedicated life safety or critical branch UPS with generator backup; subject to highest reliability requirement. |
| `none` | Non-Backed | Equipment on utility-only circuit; no backup power. |

---

## Diversity Factors (ASHRAE TC 9.9 basis)
Applied in `calc()` by equipment category. These are design-load factors applied to nameplate wattage.

| Category | Factor | Basis |
|---|---|---|
| Servers | 0.90 | ASHRAE TC 9.9; modern servers with active power management typically operate at 80–90% of nameplate under production load. |
| Network (switches, routers) | 0.75 | Manufacturer nameplate includes significant headroom for maximum PoE delivery; chassis rarely at full load. |
| Storage | 0.85 | Typical operating load for spinning disk and flash storage arrays. |
| UPS | 1.00 | UPS self-consumption is fixed; no diversity applied. |
| ACS Power Supplies (Wall) | 0.90 | Access control power supplies at steady-state operating load. |
| Cameras | 0.95 | IP cameras near nameplate draw during continuous recording. |
| Default | 0.90 | Applied when category is not explicitly mapped. |

Note: Diversity factors apply to the `w:` value from the equipment library. Library values are already derated to 90% of nameplate at time of entry. Combined effect: Network gear, for example, is at 90% nameplate × 0.75 diversity = 67.5% of true nameplate. This is intentionally conservative for coordination-level estimates.

---

## UPS Planning Targets
Default values by facility type.

| Facility Type | Max Load Target | Runtime Target | UPS Type |
|---|---|---|---|
| Mission Critical | 75% | 30 min | Centralized |
| Healthcare | 80% | 15 min | Centralized |
| Public Safety | 75% | 240 min (4 hr) | Centralized |
| Correctional | 80% | 240 min (4 hr) | Security |
| Education | 80% | 15 min | Telecom |
| Enterprise | 80% | 15 min | Rack-mounted |
| Government | 75% | 30 min | Centralized |
| Hospitality | 80% | 15 min | Distributed |

Note: Public Safety and Correctional 4-hour targets reflect continuous operations requirements, not generator ride-through. Verify final runtime with AHJ and applicable standards (TIA-1221 for PSAPs).

---

## Cooling Design Parameters

| Parameter | Value | Basis |
|---|---|---|
| BTU conversion | 1 W = 3.41214 BTU/hr | Exact thermodynamic conversion |
| Tons conversion | 1 ton = 12,000 BTU/hr | Standard refrigeration ton |
| Cooling buffer | 1.25× IT load | BICSI 002 recommended minimum |
| Ambient heat gain | 10% default | BICSI / ASHRAE: lighting, envelope, personnel; typical TR/ER. Adjustable 0–50%. |
| Load density thresholds | <50 W/U: Low; 50–100 W/U: Moderate; 100–150 W/U: High; >150 W/U: Very High | Industry practice; ASHRAE TC 9.9 |

---

## Generator Sizing Parameters

| Parameter | Value | Basis |
|---|---|---|
| Continuous load factor | 1.25× connected load | NEC / standard practice |
| Standard generator sizes (kW) | 7.5, 10, 15, 20, 30, 45, 60, 75, 100, 125, 150, 175, 200, 250, 300, 350, 400, 500 | Common commercial generator ratings |

---

## Electrical Planning Parameters

| Parameter | Value | Basis |
|---|---|---|
| Continuous load factor (breakers) | 1.25× | NEC 210.20(A) |
| Standard breaker sizes (A) | 15, 20, 25, 30, 35, 40, 50, 60, 70, 80, 90, 100, 110, 125, 150, 175, 200 | NEC standard commercial sizes |
| Standard panel sizes (A) | 100, 125, 150, 200, 225, 400, 600, 800, 1200 | Common commercial panel ratings |

---

## Schema Versioning

| Schema Version | PLEX Version | Status | Notes |
|---|---|---|---|
| 1.0 | 2.50 | Current | Multi-room structure established; single-room UI |

Schema 1.0 contract:
- `rooms[]` always present; single-room projects use `rooms[0]` only
- Consuming tools MUST iterate `rooms[]`, not assume a single entry
- All field names are stable within schema 1.0
- Breaking changes require schema version increment

---

## Disclaimer Language

Canonical disclaimer (all outputs):
> PLEX provides preliminary ICT/ESS coordination values for Division 27/28 project planning. Final UPS selection, electrical circuiting, battery runtime, available fault current, grounding, code compliance, and manufacturer verification remain by the electrical engineer, UPS vendor, and Engineer of Record. This document does not constitute an electrical or mechanical engineering deliverable.

Canonical practitioner identification:
> ICT Design Consultant & Physical Security Systems Designer · RCDD

Canonical practice identification:
> Limited Energy eXperts · ICT design and consulting practice · limitedenergy.net
