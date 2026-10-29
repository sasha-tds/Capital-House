# Capital House: handoff for the next session

**Start the next session with:** "Read HANDOFF.md in the Capital-House repo and continue with the next task in section 9."

Written 29 October 2026 at the end of the estimation session; updated the same day at the end of the second session, which built the client inputs document. Everything below is settled unless listed under section 10, open items.

---

## 1. The project in one paragraph

Capital House is an insurance agency (2 to 3 branches, 10 to 15 staff, roughly 5,000 to 10,000 policies) that also sells investments such as SIPs, FDs, bonds and NCDs. We are building them a CRM: a web application first, then one mobile app for Android and iOS with staff and client logins on the same backend, plus a separate Android-only app for staff call logging and call recording. The build is also the base of a white-label product we intend to sell to other insurance agencies, which shapes the licence clause and the architecture.

## 2. Parties and how we work

- **Client:** Capital House. They have approved the Version 2 scope and hours.
- **Vendor:** our company. The client documents carry the placeholder `[Vendor company name]`; it has not been filled yet.
- **Developer:** produced the module hours in the updated estimation document (`estimation/reference/`). Development runs through AI agents with human planning and a daily check-in on code quality, spec and timeline.
- **Hours are team effort, not calendar days.** 8-hour days. Delivery timeline has not been discussed with the client yet and is a separate conversation.

## 3. Where things are

| Path | What it is |
|---|---|
| `estimation/client/Capital_House_Revised_Estimate_Summary_v2.docx` | Two-page summary the client approved |
| `estimation/client/Capital_House_SOW_v2_Detailed.docx` | Eight-page detailed Scope of Work the client approved |
| `estimation/internal/hour-calculation-v3.md` | How the hours add up: Sections A, C, D, totals, phase split, internal notes. Not for the client. |
| `estimation/internal/clauses-exclusions-lead-times.md` | Exclusions, lead times, hosting requirements, assumptions |
| `estimation/reference/Developer_SOW_Updated_Estimation.docx` | The developer's estimation document and its Markdown conversion |
| `estimation/build/build_docs.js` | Generates both client Word documents with the `docx` npm package |
| `estimation/README.md` | Folder guide, regeneration steps, current numbers |
| `requirements/Capital_House_Client_Inputs_v1.docx` | Client inputs document, Version 1, 29 October 2026: what we need from the client, 13 sections, 41 pages A4. Built in session 2, not yet reviewed with the user or sent. |
| `requirements/Capital_House_Input_Templates_v1.xlsx` | Fill-in workbook that goes with it: 20 sheets plus a hidden `_lists` sheet for dropdowns |
| `estimation/build/build_inputs.js` and `inputs_content.js` | Generate both requirements files. Content is in `inputs_content.js`; layout in `build_inputs.js`. `npm install` in `estimation/build` installs `docx` and `exceljs` from `package.json`. |
| `requirements/README.md` | Folder guide and regeneration steps for the requirements files |

## 4. Approved scope and numbers

| Phase | Modules (added after the initial estimate marked *) | Days |
|---|---|---|
| 1. Web, core | Lead; Renewal; Calling & Follow-up; Policy; Quotation; Payment with premium recovery; Portability; Notifications on five channels with OTP login; Client & Family; Task; Document Management*; Insurance Company Master*; Dashboard*; Data Import & Export* | 23 to 27 |
| 2. Web, business | Training & Documentation with product brochures*; Claim; Income / Commission; Reports & Analytics; Third-Party Policy; WhatsApp Marketing; Investments SIP/FD/Bond/NCD*; Calendar & Meetings*; Templates*; Client Self-Service web login*; Client Service Requests* | 17 to 21 |
| 3. Apps and calls | CRM mobile app Android and iOS, staff and client logins; Staff Call Recording & Logging app, Android; Call Activity; Admin Monitoring, Settings & Masters; Security / Audit Trail viewer* | 15 to 17 |
| **Development total** | | **55 to 65** |
| Contingency, separate, used only with client approval | | 6 to 7 |

Hours: Section A (initial scope 304 to 360 plus Notifications addition 32 to 40) = 336 to 400. Section C (added modules) = 126 to 170. Sum 462 to 570, consolidation for shared components −22 to −50, quoted total 440 to 520 hours.

Included at no additional charge: platform foundation (auth, roles, users and branches, masters framework, settings, dashboard shell, audit infrastructure, file storage, background jobs), reporting framework with 8 standard reports, WhatsApp API and push connections, store releases, the call recording app in place of call forwarding.

Not included (client pays provider at actuals): domain, hosting, SSL, backups, storage; Apple and Google developer accounts in the client's name; WhatsApp BSP and Meta charges; SMS and DLT; email service; content and data preparation; maintenance after warranty; change requests. Payment gateway, insurer APIs and AI features are out of scope.

## 5. Decisions already made, do not reopen

**Apps and architecture**
- Web application first (React, Laravel, MySQL or MariaDB). One React Native CRM app for Android and iOS, staff and client logins, on the web app's backend and APIs, published on both stores. One separate native Android app for staff call logging and recording, installed directly as an APK on company-owned office phones, never on Google Play.
- Call recording works by picking up files from the phone's built-in call recorder and matching them to the call log; Android 10 and later blocks direct recording. Office phones will be a recent Android model. Storage and retention of recordings, staff consent and informing clients are the client's decisions.
- Platform foundation comes from our base platform at no charge.
- White-label: no hard-coded branding, data-driven masters and rules, single-tenant deployment per customer. Licence clause: client gets a perpetual non-exclusive licence, we retain platform IP, client data and branding are theirs. Store, Meta, SMS and email accounts are owned by the client.
- Hosting: fresh, undecided between VPS and cPanel. VPS recommended. Requirements are in the clauses file.

**Modules**
- Payment Management records premiums paid by the agency on behalf of clients and their recovery. No online payment, no gateway. Client Premium Recovery lives inside it.
- Commission is tracked per policy with the insurer rate and each staff member's percentage, incentives, payouts, history. No insurer statement reconciliation.
- Notifications: in-app, email, SMS, WhatsApp, push, with templates, preferences, scheduling, delivery log, plus OTP login for clients. SMS stays as fallback to WhatsApp.
- Reports: framework plus 8 standard reports (policy register; new business; renewals due; renewal performance; lead funnel; staff daily activity; premium recovery aging; commission expected vs received). More at 3 to 5 hours each. Export is in the framework.
- Training & Documentation is an in-app learning module; the client supplies content and already has vendor training material. Product brochures live inside it with a share-to-client link.
- Ticket module was dropped; replaced by Client Service Requests on Task Management.
- Investments is one module for SIP, FD, Bond and NCD.
- Client Self-Service is a client login on the web app first; the app gives the same features later.
- Data Import & Export: client prepares data in our templates and does the cleansing; we build template download, column mapping, validation, dry run, rollback; two import rehearsals; export to Excel or CSV from list screens.
- Insurance Company Master: insurer and product records, contacts, addresses, commission rates per product, encrypted per-insurer portal credentials with role-restricted reveal and audit on every reveal.
- Dashboard is KPI widgets on the existing shell. Audit Trail is a viewer on the existing logging.
- Integrations (WhatsApp BSP, SMS, email, OTP, push) are included effort; one provider per channel chosen before work starts; provider change later is a change request; only charges are separate.
- Optional AI (transcription, summaries) is Phase 4, excluded.

**Commercial**
- The client held the initial 38 to 45 days. We kept that scope at its figure, billed only what was added, and absorbed the rest as product investment. Internal effort on the developer's figures is around 656 to 868 hours against 440 to 520 quoted. This is deliberate and known; it is not for the client documents.
- Contingency is shown separately at 10 percent.

## 6. Style and working preferences observed

- Plain, short answers. The user corrected me more than once for over-explaining and for confusing the two apps; be precise about which app is which.
- Client-facing documents never carry internal notes, absorbed effort or unbilled figures.
- The user knows the C1 to C13 line numbering from the hour calculation; keep using it.
- Documents go out as Word, generated from the build script so they can be regenerated. Version and date in the footer. A4.
- The user decides commercial questions; present the choice and a recommendation in one or two lines, then apply what they decide.

## 7. Client facts to reuse

2 to 3 branches. 10 to 15 staff. 5,000 to 10,000 policies, likely in Excel today; the client will import their own data through our tool. Clients include iPhone users, hence iOS for the CRM app. Office phones are Android. The client already has vendor-provided training material. Insurers sell through them with different commission percentages per staff member.

## 8. Reference numbers for lead times (client side)

Meta Business verification 1 to 2 weeks, up to 3 to 4 with queries; WhatsApp templates hours to 3 days each; SMS DLT 1 to 2 weeks; Apple organisation enrolment up to 2 weeks for a new D-U-N-S then 1 to 3 days; Google Play organisation account a few days, and a new personal account would need a 14-day closed test with 12 testers; App Store review 1 to 3 days per submission; hosting and SSL 1 to 3 days.

---

## 9. Next task: review the client inputs document with the user, then finalise it for the client

**Done in session 2.** The client inputs document and the templates workbook were built from the brief that stood here (structure of 13 sections, starter checklist by module). They are in `requirements/`, generated by `estimation/build/build_inputs.js` from `estimation/build/inputs_content.js`. The document was rendered to PDF and checked page by page; the workbook was read back and opened in LibreOffice without errors. Neither has been shown to the user yet.

**What the document contains:** 1 how to use it and the "needed by" milestones (Week 1, Phase 1 start, Phase 1 testing, Phase 2 start, Phase 2 testing, Phase 3 start, Phase 3 testing, Go-live; relative because no timeline is agreed); 2 accounts and access, 11 items with lead times; 3 branding and legal; 4 organisation with a proposed permission matrix for six roles; 5 masters; 6 module by module, 6.1 to 6.28 in SOW order, each with a pages-and-fields table and an inputs table (lists, rules to confirm, documents, access, sample data); 7 notification catalogue of 20 events, message text notes, document templates; 8 the eight reports with proposed filters, columns and grouping; 9 data migration files, steps, responsibilities; 10 call recording inputs; 11 store details for the CRM app; 12 twenty-three decisions with options and a recommendation each; 13 a checklist of 74 inputs with section, format and needed-by.

**What the workbook contains:** Read me (legend, sheet index), Checklist (74 rows, owner and status to fill), Decisions (23 rows), Branches, Staff, Insurers, Insurer contacts, Products, Lists (every dropdown value proposed, with Keep and Replace columns), Clients, Family members, Policies, Leads, Payments and recovery, Notification templates (36 draft texts for WhatsApp, SMS, email, in-app and push, with a column for the client's wording), Third-party policies, Claims, Investments, Reports, Office phones. Yellow cells are fill-in, row 2 of each sheet is an example, dropdowns use a hidden `_lists` sheet. No formulas.

**What to do next, in order**

1. Walk the user through the document. Section 6 is where corrections are most likely: the fields, lists and rules are proposals written from insurance agency practice, not from client facts. The user knows the client; expect changes.
2. Points I decided without client facts; confirm each with the user:
   - Languages list is English, Hindi, Gujarati, Marathi (guessed region). Change on the Lists sheet.
   - Example rows use Pune, Maharashtra and fictional insurers and products, all marked "(example)".
   - Proposed defaults throughout: renewal reminders 30, 15, 7, 1 days; recovery reminders 7, 15, 30 then monthly; grace 30 days health and life, none motor; receipt series BR1/2026-27/0001; quiet hours 9 pm to 9 am; OTP 5 minutes, 3 attempts; file limit 25 MB; recording retention 1 year; audit archive after 2 years; session timeout 8 hours web, 30 days app; two-factor for admins.
   - Permission matrix in section 4 and the roles list (Admin, Branch manager, Sales executive, Operations, Accounts, Telecaller, Trainer, Viewer).
   - Recommendation in decision 15 that clients see amounts paid on their behalf in the self-service login.
   - Storage estimate for recordings in section 10: roughly 0.5 MB per minute, example 7.5 GB a month for 10 staff.
3. Apply the user's changes in `inputs_content.js` and rebuild. Keep module order; the checklist references 6.1 to 6.28 by number.
4. Replace `[Vendor company name]` (also in the two estimation documents). Decide whether the document goes as Word or PDF; the workbook always as Excel.
5. Agree with the user who at the client owns the checklist, and whether we track status in the workbook or in a shared sheet.
6. Later, when the client returns the workbook: the masters feed the Insurance Company Master and settings; the sample sheets become the first import rehearsal data; the Lists sheet becomes the seed data for the masters framework.

## 10. Open items

- `[Vendor company name]` placeholder in both client documents and the acceptance table.
- Licence and ownership wording in SOW section 11 to be checked by whoever handles contracts.
- Delivery timeline and phase milestones: not yet discussed with the client.
- Hosting: VPS or cPanel; provider; who pays and manages.
- Provider choices: WhatsApp BSP, SMS gateway, email service.
- Office phone model and count for the call recording app.
- Date of the initial estimate, if the documents should reference it exactly.
- Repository: work is on `claude/capital-house-section-9-j8lnu0` (session 2) on top of `claude/inspiring-mccarthy-csq3hd` (session 1); decide whether to make one of them `main` or merge into one.
- Client inputs document: not yet reviewed with the user; see section 9 for the assumptions to confirm.
- Example data in the workbook: Pune and fictional insurers; change if the user wants the client's own city or real insurer names.
- Delivery timeline would let the "needed by" milestones in the inputs document become dates.
