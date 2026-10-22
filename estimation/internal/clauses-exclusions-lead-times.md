# Capital House: draft clauses for the next estimate

Paste sections 1 to 4 into the next SOW after the effort tables. Updated after scope clarifications: no call forwarding, no payment gateway, call activity via a side-loaded Android app. Hour calculation is in capital-house-sow-v3-calculation.md.

---

## 1. Not included in the development estimate

The following are payable by the client directly to the respective provider, at actuals, and are outside the development scope and effort:

- Domain name registration and renewals, DNS management.
- Web hosting (cPanel or VPS), SSL certificate, server backups, bandwidth, and disk or object storage for uploaded documents and call recordings beyond the base server disk.
- Apple Developer Program membership (currently USD 99 per year) and Google Play Console registration (currently USD 25 one-time). Both accounts are registered in the client's legal entity name.
- WhatsApp Business Platform: Business Solution Provider (BSP) setup and subscription fees, and Meta per-conversation charges.
- SMS gateway charges and, in India, DLT registration fees for entity, sender IDs and templates.
- Transactional email service.
- Payment gateway and cloud telephony are not in scope. Their fees would apply only if added later by change request.
- AI and speech API usage charges (only if the optional AI modules are taken up).
- Insurer or other third-party API access fees, where such APIs exist.
- Content and data entry: training content, brochures, message template copy, insurer and product master data, existing client and policy records.
- Data migration from existing records (quoted separately after reviewing the data).
- Post-go-live maintenance and support beyond the warranty period (offered separately as an annual maintenance contract).
- Changes to scope after sign-off (handled as change requests).

## 2. Third-party onboarding lead times

These depend on the client and on third parties. They run in parallel with development where possible and are not counted in the development days. Durations below are typical, not guaranteed.

| Item | Who initiates | Typical lead time | Notes |
|---|---|---|---|
| Meta Business verification for WhatsApp API | Client, with BSP assistance | 1 to 2 weeks, up to 3 to 4 if Meta raises queries | Documents must match the legal entity name exactly. Until verified, daily conversation limits apply. |
| WhatsApp message template approvals | Vendor drafts, client approves | Hours to 2 or 3 business days per template | Draft templates while verification is pending. |
| SMS DLT registration (India): entity, sender ID, templates | Client | 1 to 2 weeks | Required before any OTP or transactional SMS can be sent. |
| Apple Developer Program, organization enrollment | Client | D-U-N-S number up to 2 weeks if new; Apple verification 1 to 3 days after | Needs a legal entity, a website on the client's own domain and an authorised signatory. |
| Google Play Console, organization account | Client | Days, subject to identity verification | Register as an organization. New personal accounts must run a 14-day closed test with 12 testers before production access. |
| App Store review (CRM app) | Vendor submits | 1 to 3 days per submission; allow 2 to 3 iterations for a first release | Privacy policy URL and a reviewer demo account are required. |
| Play Store review (CRM app) | Vendor submits | Hours to a few days; allow 2 iterations for a first release | Privacy policy URL and a reviewer demo account are required. The call recording and logging app is side-loaded and does not go through Play. |
| Hosting provisioning, domain pointing, SSL | Client | 1 to 3 days | Credentials are needed before the first deployment. |
| Insurer API access | Client | Unknown; frequently not available to intermediaries | Out of scope unless API documentation and credentials are provided. |

## 3. Hosting requirements

Minimum: PHP 8.2 or later, MySQL 8 or MariaDB 10.6 or later, HTTPS, SSH access, cron, the ability to run a persistent queue worker (Supervisor or equivalent), storage that grows with uploaded documents, and daily backups.

Recommendation: a VPS, with or without cPanel/WHM, rather than shared cPanel hosting. Shared plans commonly lack SSH and Supervisor and throttle cron. That affects scheduled reminders, WhatsApp campaigns, push notifications and report generation. The CRM app is distributed through the App Store and Google Play, and the call recording app as a direct APK; only the API and web application are hosted.

## 4. Working assumptions

- Estimates are development effort in 8-hour days for the stated team. They are not calendar durations. Calendar time adds client review cycles, UAT and the third-party lead times above.
- One React + Laravel web codebase, built first. One React Native app for Android and iOS for the CRM with staff and client logins, built on the web app's backend and APIs. One Android app for staff call recording and logging, installed directly as an APK.
- The client supplies branding, master data, template copy, test devices and test accounts.
- UAT: [N] rounds per section. Defects reported within the UAT window are fixed within scope.
- Warranty: bug fixes for [N] days after each section's go-live. Enhancements are change requests.
- Store accounts, Meta/BSP, SMS and email provider accounts are owned by the client; the vendor is granted access.
- Call activity is captured by a separate Android-only Staff Call Recording & Logging app, side-loaded as an APK on company-owned office phones and not published on Google Play. It uploads call log entries and the audio files produced by the phone's built-in call recorder. Audio capture therefore depends on the phone model's recorder; the office phones are one standard model tested by the vendor. iOS is not supported for this function.
- Staff consent for recording on company phones, informing clients, and the retention period after which recordings are deleted are the client's policy decisions.
- Payment Management and Client Premium Recovery record payments made by the agency on behalf of clients. No online payment by clients and no payment gateway.
- Optional AI modules are quoted separately on request and carry usage charges.
