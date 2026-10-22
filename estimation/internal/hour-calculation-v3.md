# Capital House: fresh modules and hour calculation structure (v3)

How the hours are calculated:
- **Section A** is the scope already quoted to the client. Its hours stay exactly as given: 304 to 360.
- **Sections B to E** are everything that came after that quote. Each line has its own hours.
- All hours are team effort: time the team spends building and testing. They are not elapsed days. Delivery timeline is handled separately after all sections are confirmed.
- Total = A + C. Section A carries the quoted scope plus the notifications channel work. Section C carries the fresh modules, with import and export as one line. Section D is included, not billed; only third-party charges are separate. Contingency is a separate line at 10 percent.
- Exclusions and third-party lead times are in the clauses document.

---

## 1. Which modules are fresh

Every module the client has ever named, classified against the first estimate.

| Module | Status | Where it sits now |
|---|---|---|
| Training & Documentation | Quoted | Section A |
| Lead Management | Quoted | Section A |
| Renewal Management | Quoted | Section A |
| Calling & Follow-up Management | Quoted | Section A |
| Policy Management | Quoted | Section A |
| Quotation Management | Quoted | Section A |
| Payment Management | Quoted | Section A |
| Portability Management | Quoted | Section A |
| Notifications | Quoted; five channels, SMS and email connections and OTP login added to the module at 4 to 5 days | Section A |
| Task Management | Quoted | Section A |
| Claim Management | Quoted | Section A |
| Income / Commission Management | Quoted | Section A |
| Advanced Reports & Analytics | Quoted; report framework and 8 reports absorbed | Section A |
| Third-Party Policy Management | Quoted | Section A |
| WhatsApp Marketing | Quoted | Section A |
| Staff Application / Client Application | Quoted, now one app with both logins, Android and iOS | Section A |
| Client & Family Management | Quoted | Section A |
| Call Forwarding & Telephony | Quoted, replaced by the call recording and logging app at no extra charge | Section A |
| Call Activity | Quoted | Section A |
| Admin Monitoring | Quoted | Section A |
| Document Management | Fresh, client added; attachments already in A, register remains | Section C1 |
| Insurance Company Master | Fresh, client added; insurer list already in A, contacts and credentials remain | Section C2 |
| Client Premium Recovery | Client added, but covered by Payment Management | Section A, no hours |
| Dashboard (Default) | Fresh, client added; shell in platform base, widgets remain | Section C4 |
| Data Export to Excel/CSV/PDF | Fresh, client added; report export absorbed, list exports remain | Section C5 |
| SIP Tracking | Fresh, client added; merged with investment log | Section C6 |
| Product Knowledge Library / Brochures | Client added; library already in Training & Documentation | Section C7, 4 hours |
| Calendar & Meeting Management | Fresh, client added | Section C8 |
| One-Time Investment Entry Log | Fresh, client added; merged with SIP into Investments | Section C6 |
| Templates | Fresh, client added; message templates already in A, document templates remain | Section C10 |
| Customer Self-Service Portal | Fresh, client added; delivered as client login on the web app | Section C11 |
| Security / Audit Trail | Fresh, client added; logging in platform base, viewer remains | Section C12 |
| Ticket / Support Management | In developer SOW only; client never asked; reduced to client service requests on Task Management | Section C13 |
| App Store and Play Store release | Nobody listed it; absorbed as part of building the apps | Section A |
| WhatsApp API and push | Implied by WhatsApp Marketing and the mobile apps in the quote; included | Section A |
| SMS, email, OTP login | Not named anywhere; delivered within the Notifications addition | Section A |
| Data import tool | Fresh, agreed after client said they will import their own data; merged with Data Export | Section C5 |

Count: 20 quoted; 13 client-added items plus the import tool reduced to 11 fresh lines after removing overlaps; 5 integrations included, not billed.

---

## 2. Section A: scope already quoted

Hours as given to the client, plus one addition to the Notifications module.

| Original phase | Modules | Hours |
|---|---|---|
| Phase 1 | Training & Documentation, Lead, Renewal, Calling & Follow-up, Policy, Quotation, Payment, Portability, Notifications | 104 to 120 |
| Phase 2 | Task, Claim, Income / Commission, Advanced Reports, Third-Party Policy, WhatsApp Marketing | 64 to 80 |
| Phase 3 | Staff and Client Application (now one app with both logins, Android and iOS) | 80 to 96 |
| Phase 4 | Client & Family, Call Forwarding & Telephony (replaced by the call recording and logging app), Call Activity, Admin Monitoring | 56 to 64 |
| Addition to Notifications | Five channels (in-app, email, SMS, WhatsApp, push) with templates, preferences and delivery log; SMS and email connections; OTP login for clients | 32 to 40 |
| **Section A total** | | **336 to 400** |

Included in Section A at no extra charge: the Staff Call Recording & Logging app in place of call forwarding, the report framework with 8 core reports and export wiring, the WhatsApp API and push delivery, and the App Store and Play Store release.

Delivery sequence: the web application is built first. The mobile app for Android and iOS is built after it, on the same backend and APIs, so staff and clients get the same experience on web and mobile. The call recording and logging app is Android only.

Clarifications that do not change hours: Payment Management records payments the agency makes on behalf of clients, no gateway. Commission is tracked per policy with the insurer rate and each staff member's percentage, incentives, payouts and history. Training content is supplied by the client.

---

## 3. Section B: removed

No separate "changes" section. Notifications was in the first SOW, so the channel work is added to that module inside Section A at 4 to 5 days. The call recording app, the report framework and the store release are included in Section A at no extra charge.

---

## 4. Section C: fresh modules

Each client-added item checked against Section A and against the other C items. Where the quoted scope or the platform base already covers part of it, only the remaining work is counted.

| # | Fresh line | Already covered by | What remains to build | Hours |
|---|---|---|---|---|
| C1 | Document register | Attachments on clients, policies, portability and claims are in Section A; upload service is in the platform base | One cross-module document register: categories, search, versions, expiry flags, bulk download, role access | 8 to 12 |
| C2 | Insurer contacts and credential vault | Insurer and product list is needed by Policy Management in Section A; masters framework is in the platform base | Contact persons, addresses, encrypted per-insurer portal credentials with role-restricted reveal and an audit entry on every reveal | 8 to 10 |
| C3 | Client Premium Recovery | Payment Management in Section A already has pending payments, collection tracking and receipts; recovery reminders come from Notifications; recovery aging is core report 7 | Nothing separate. Shown inside Payment Management as the paid-on-behalf ledger | 0 |
| C4 | Dashboard KPI widgets | Dashboard shell is in the platform base | The widgets themselves: renewals due, leads by stage, recoveries outstanding, tasks today, premium month to date, policies expiring, birthdays, claims open | 12 to 16 |
| C5 | Data Import & Export | Report export is in the included report framework; PDF output is in C10 | Import framework: template download per entity, column mapping, validation, dry run with error report, queued import, rollback of a failed batch (12 to 16). Entity mappings for clients, family, policies, leads, third-party policies, masters (8 to 12). Generic Excel/CSV exporter on about 12 list screens, exporting with current filters (6 to 8). The export column sets double as the import templates, which is where the saving against separate lines comes from. | 26 to 36 |
| C6 | Investments: SIP, FD, Bond, NCD | Nothing in Section A; SIP Tracking and One-Time Investment Entry Log merged into one module | Investment register with type-specific fields, SIP instalment schedule, maturity tracking for FD, Bond and NCD, status, reminders | 18 to 24 |
| C7 | Product brochures in the library | Training & Documentation in Section A already has a document library | Product and insurer categories plus a share-to-client link | 4 |
| C8 | Calendar and meetings | Follow-ups, tasks and renewals already carry dates and reminders in Section A | Day, week and month calendar over those items, plus a meeting entity with attendees and client or lead link | 10 to 14 |
| C9 | Merged into C6 | | | 0 |
| C10 | Document templates and PDF | Message templates already exist in WhatsApp Marketing and Notifications | Document templates with merge fields and PDF output for quotation, receipt, welcome letter and renewal notice | 10 to 14 |
| C11 | Client self-service, web login | Backend APIs are shared with the client side of the mobile app in Section A | Client-facing web screens: profile and family, policies and documents, renewals, payment history, claims, requests, notifications | 16 to 22 |
| C12 | Audit trail viewer | Audit log infrastructure is in the platform base and records changes from Phase 1 | Searchable viewer with filters by user, entity, action and date, export, plus explicit events for credential reveal, export and login | 8 to 10 |
| C13 | Client service requests | Task Management in Section A; the client never asked for a ticket module | Clients raise a request from the web login or app; it becomes a task with client-visible status and replies | 6 to 8 |
| | **Section C total** | | | **126 to 170** |

Options: C3 can carry 4 to 6 hours if you want a recovery aging screen inside Payment Management rather than relying on the report. C12 can be absorbed if the client pushes back, since a white-label insurance product needs it regardless.

C5 assumptions: the client prepares data in the templates and does the cleansing; 5,000 to 10,000 policies import in minutes through the queue; two import rehearsals before go-live; a fixed-format template without the mapping screen would take C5 to 18 to 24.

---

## 5. Section D: integrations (included, not billed)

Decision: no separate integration charges. The developer's SOW already places WhatsApp messaging inside the WhatsApp Marketing module and push notifications inside the mobile app foundation, and its third-party paragraph says only subscription, usage and transaction charges are separate from the development scope. Billing integration effort on top would contradict that.

Where each integration now lives:

| Integration | Team effort (hours) | Now inside | Billed |
|---|---|---|---|
| WhatsApp Business API through one BSP | 20 to 24 | Section A, WhatsApp Marketing and Notifications | No |
| Push delivery, backend side | 4 to 6 | Section A, mobile app foundation | No |
| SMS gateway with DLT mapping | 6 to 8 | Section A, Notifications addition | Within that addition |
| Transactional email | 4 to 6 | Section A, Notifications addition | Within that addition |
| OTP login for client web login and app | 6 to 8 | Section A, Notifications addition | Within that addition |
| **Total team effort** | **40 to 52** | | **0 beyond the Notifications addition** |

What remains separate, in the clauses document: BSP subscription and Meta per-conversation charges, SMS and DLT fees, email provider plan, and all onboarding lead times.

Assumptions that protect the included effort: one provider per channel, chosen before the work starts, with a documented REST API and webhooks; a provider change after build is a change request; provider-side API changes after go-live are maintenance.

---

## 6. Section E: merged into C5

Import and export are one line, C5 Data Import & Export, in Section C.

---

## 7. Totals

| Section | Hours | Days |
|---|---|---|
| A. Scope already quoted, 304 to 360, plus Notifications addition, 32 to 40 | 336 to 400 | 42 to 50 |
| C. Fresh modules, including Data Import & Export | 126 to 170 | 16 to 21 |
| D. Integrations | included | 0 |
| Sum of lines | 462 to 570 | 58 to 71 |
| Consolidation for shared components | −22 to −50 | −3 to −6 |
| **Quoted development total** | **440 to 520** | **55 to 65** |
| Contingency, 10 percent of the quoted total, separate line | 44 to 52 | 6 to 7 |

The consolidation is 5 to 9 percent of the sum of lines. It reflects components counted in more than one line when modules are estimated independently: the export engine shared by C5 and the report framework; the notifications engine serving renewal, recovery, follow-up and task reminders across modules; the client web login sharing its APIs with the client side of the app; the document register sharing the upload service with per-module attachments; the investments module sharing schedule and reminder components; the calendar reusing already dated items. The document must show this line so that the module hours visibly reconcile to the quoted total.

---

## 8. Delivery phases

The client's three-phase grouping, with fresh hours per phase. Section A hours are not split per phase here because the quote gave them by the original four phases.

| Phase | Modules from Section A | Fresh items and hours |
|---|---|---|
| Phase 1: Web core | Lead, Renewal, Calling & Follow-up, Policy, Quotation, Payment, Portability, Notifications, Client & Family, Task | C1 document register 8 to 12; C2 insurer contacts and credentials 8 to 10; C4 dashboard widgets 12 to 16; C5 import and export 26 to 36; Notifications addition 32 to 40. **Fresh: 86 to 114** |
| Phase 2: Web business | Training & Documentation, Claim, Income / Commission, Advanced Reports, Third-Party Policy, WhatsApp Marketing | C6 investments 18 to 24; C7 brochures 4; C8 calendar 10 to 14; C10 document templates 10 to 14; C11 client web login 16 to 22; C13 client requests 6 to 8. Included here: WhatsApp API, report framework and 8 reports. **Fresh: 64 to 86** |
| Phase 3: Apps and calls | CRM app with staff and client logins (Android and iOS), Call Activity, Admin Monitoring | C12 audit viewer 8 to 10. Included here: push delivery, call recording and logging app, store release. **Fresh: 8 to 10** |

Import and export sit in Phase 1 because the client's existing policies must be loaded before Phase 1 goes live.

---

## 9. Excluded from this SOW

| Item | Indicative hours | Notes |
|---|---|---|
| AI transcription and summary, SIP AI | on request | Phase 4; call recordings would be the input; API usage charges apply |
| Extended report pack, 20 reports | 65 to 94 | List in the v2.1 working draft, section 9 |
| Google or Microsoft calendar sync | 12 to 16 | |
| Object storage for documents and recordings | 4 to 8 | Recommended once recording volume grows |
| Payment gateway, insurer APIs | not planned | |

---

## 10. Internal notes, not for the client

- Effort inside Section A as now scoped, using the developer's detailed figures plus the included call recording app, report framework, store release, WhatsApp API, push delivery and the notifications channel work, less the app consolidation saving, is about 530 to 698 hours. Section A is billed at 336 to 400. Unbilled effort is therefore about 194 to 298 hours. It is the margin decision, and the white-label plan is the reason it can be justified.
- One app with both logins on Android and iOS, instead of two separate apps, saves 24 to 32 hours of effort against the developer's detailed figures through the shared foundation and shared screens. It is not shown to the client as a credit, because the original 80 to 96 hours for the apps was already below the detailed effort.
- Call recording depends on the phone's built-in recorder. Android 10 and later blocks third-party apps from recording call audio directly. The app picks up the recorder's files and matches them to the call log. One standard office phone model, and a 1 to 2 day feasibility check on it before Phase 3 is committed. Approach and assumptions are in the v2.1 working draft, section 11.
- Office phones will be a recent Android model; the recorder-file approach holds on recent models from the main brands sold in India. The short check on the actual phone stays inside Phase 3.
- Section C reviewed for overlaps; 178 to 238 became 108 to 146, then 126 to 170 with import merged into C5. Section B removed; Notifications addition of 32 to 40 sits in Section A. Section D included, not billed. Quoted total set at 55 to 65 days with a visible consolidation line.
- Internal effort on the developer's detailed figures is about 656 to 868 hours across A and C. Quoted at 440 to 520. Unbilled effort is about 216 to 348 hours, 27 to 44 days.
- Next: the Word document, then delivery timeline.
