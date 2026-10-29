# Capital House: handoff for the next session

**Start the next session with:** "Read HANDOFF.md in the Capital-House repo and continue with the next task in section 9."

Written 29 October 2026 at the end of the estimation session. Everything below is settled unless listed under section 10, open items.

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

## 9. Next task: the client inputs document

**What the user asked for:** now that the client has approved Version 2, a detailed document telling the client what we need from them, page by page and module by module: which fields and values each page needs, master data, sample data, documents, templates, business rules, branding, accounts and decisions. It will be discussed and refined in the new session.

**Suggested deliverable:** a Word document in the same style as the SOW (reuse the pattern in `estimation/build/build_docs.js`), plus an Excel workbook of fill-in templates for master and sample data, one sheet per entity. Put the inputs document under `estimation/client/` or a new `requirements/` folder, and the build script beside the existing one.

**Suggested structure of the document**

1. How to use this document and the order in which inputs are needed (Phase 1 inputs first; accounts in week one).
2. Accounts and access the client must create or provide: hosting and domain, Apple and Google developer accounts, WhatsApp BSP and Meta verification, SMS provider and DLT, email provider and DNS, Firebase project ownership.
3. Branding and legal: logo files, colours, company details for documents and app stores, privacy policy content, terms for the client login.
4. Organisation setup: branches, staff list with roles and reporting lines, commission percentages per staff member, user access rules.
5. Masters: insurers with contacts and addresses, products and plans per insurer with commission rates, lead sources, lead stages, policy types and statuses, claim statuses, document categories, task types, investment types.
6. Module by module, for every page: the fields the page shows and captures, which are mandatory, the values or lists behind dropdowns, business rules and calculations, the documents attached, who can see and edit, and the sample records or files we need to build and test it. Use the module list in section 4 of this file and the descriptions in the detailed SOW.
7. Communication content: WhatsApp template texts for each event in the notifications catalogue (renewal reminders at 30, 15, 7 and 1 days; recovery due; follow-up due; task assigned; lead assigned; policy issued; claim status; portability status; payment recorded; service request updates; birthdays), SMS texts, email layouts, and the document templates (quotation, receipt, welcome letter, renewal notice) as they are produced today.
8. Reports: confirm the 8 standard reports and the filters and columns each should carry.
9. Data migration: the existing Excel files as they are today, one sample of each, so the import templates and mappings can be designed; agreed cut-off date; cleansing responsibilities.
10. Call recording and logging: office phone model and count, staff to phone mapping, which task types count as "required calls", recording retention period, consent approach.
11. Mobile app specifics: app name, icon, store descriptions, screenshots approval, test devices and tester accounts.
12. Decisions still pending from the client (section 10 below), with the date by which each is needed.
13. A checklist table: input, owner at the client, format, needed by (phase and week), status.

**Starter checklist of inputs by module** (to expand in the new session)

| Module | Inputs needed from the client |
|---|---|
| Lead | Lead sources; stages and what moves a lead between them; assignment rules by branch or staff; mandatory fields; follow-up frequency expectations; 20 sample leads |
| Renewal | Reminder schedule; who owns a renewal; renewal statuses; grace period rules; sample of renewals due list |
| Calling & Follow-up | Call outcome options; callback rules; which activities count; sample call log |
| Policy | Full field list per policy type (health, motor, life, other); member fields; statuses; document types per policy; 20 sample policies covering each insurer |
| Quotation | How quotes are prepared today; comparison format; fields; sample quotes; what converts a quote to a policy |
| Payment and premium recovery | How payments on behalf of clients are recorded today; receipt format; recovery follow-up practice; sample ledger |
| Portability | Request fields; document checklist; statuses |
| Notifications | Channel preference by event; template texts; quiet hours; who receives internal alerts |
| Client & Family | Client fields and KYC documents; relationship types; sample client records |
| Task | Task types; priorities; who assigns; escalation when overdue |
| Document Management | Document categories; expiry-tracked documents; who may view each category |
| Insurance Company Master | Insurer list with contacts, addresses, portal URLs; products and plans with commission rates; who may reveal credentials |
| Dashboard | Which KPIs matter per role; targets if any |
| Data Import & Export | Current Excel files; column meanings; cut-off date; who cleans data |
| Training & Documentation | Existing vendor training material; brochures per insurer and product; completion tracking expectations |
| Claim | Claim fields; document checklist; statuses; TAT expectations |
| Income / Commission | Commission structure per insurer and product; staff percentages; incentive rules; payout cycle; sample statement |
| Reports | Confirm the 8 reports; filters, columns, groupings; who receives scheduled reports |
| Third-Party Policy | Fields; source of these records; import format |
| WhatsApp Marketing | BSP choice; approved template list; campaign audiences; opt-out handling |
| Investments | Fields per instrument; schedules; reminders; sample records |
| Calendar & Meetings | Meeting types; attendees; reminder lead times |
| Templates | Current quotation, receipt, letter and notice formats as files |
| Client Self-Service and Service Requests | What clients may see and do; request types; response expectations |
| CRM mobile app | App name, icon, store text, test devices, tester accounts |
| Call recording app | Phone model and count, staff mapping, required-call task types, retention, consent |
| Admin, Settings & Masters | Admin users; settings the client wants to control |
| Audit Trail | Who may view the audit log; retention |

## 10. Open items

- `[Vendor company name]` placeholder in both client documents and the acceptance table.
- Licence and ownership wording in SOW section 11 to be checked by whoever handles contracts.
- Delivery timeline and phase milestones: not yet discussed with the client.
- Hosting: VPS or cPanel; provider; who pays and manages.
- Provider choices: WhatsApp BSP, SMS gateway, email service.
- Office phone model and count for the call recording app.
- Date of the initial estimate, if the documents should reference it exactly.
- Repository: this branch is the only one; decide whether to make it `main` or merge into one.
