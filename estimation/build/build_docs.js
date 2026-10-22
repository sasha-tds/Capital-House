const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType,
  HeadingLevel, AlignmentType, BorderStyle, ShadingType, LevelFormat, PageBreak,
  Footer, PageNumber, VerticalAlign,
} = require('docx');

const OUT = path.resolve(__dirname, '..');
const CONTENT_W = 9026; // A4 width 11906 minus 2 x 1440 margins
const HEAD_FILL = 'D9E2F3';
const SUB_FILL = 'F2F2F2';
const BORDER = { style: BorderStyle.SINGLE, size: 4, color: 'A6A6A6' };
const BORDERS = { top: BORDER, bottom: BORDER, left: BORDER, right: BORDER };

const run = (text, opts = {}) => new TextRun({ text, ...opts });
const P = (text, opts = {}) => new Paragraph({
  children: typeof text === 'string' ? [run(text, opts.run || {})] : text,
  spacing: { after: opts.after ?? 120, before: opts.before ?? 0 },
  alignment: opts.align,
});
const H1 = (t) => new Paragraph({ text: t, heading: HeadingLevel.HEADING_1, spacing: { before: 360, after: 160 } });
const H2 = (t) => new Paragraph({ text: t, heading: HeadingLevel.HEADING_2, spacing: { before: 240, after: 120 } });
const B = (text, level = 0) => new Paragraph({
  children: typeof text === 'string' ? [run(text)] : text,
  numbering: { reference: 'bullets', level },
  spacing: { after: 60 },
});
const N = (text) => new Paragraph({
  children: typeof text === 'string' ? [run(text)] : text,
  numbering: { reference: 'numbers', level: 0 },
  spacing: { after: 60 },
});
const BR = () => new Paragraph({ children: [new PageBreak()] });

function cell(content, { width, bold = false, fill, align, size } = {}) {
  const items = Array.isArray(content) ? content : [content];
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    borders: BORDERS,
    verticalAlign: VerticalAlign.TOP,
    shading: fill ? { fill, type: ShadingType.CLEAR, color: 'auto' } : undefined,
    margins: { top: 60, bottom: 60, left: 100, right: 100 },
    children: items.map((t) => new Paragraph({
      children: [run(String(t), { bold, size })],
      alignment: align,
      spacing: { after: 40 },
    })),
  });
}

function table(headers, rows, widths, { fontSize = 19, totalRowIdx = [] } = {}) {
  const sum = widths.reduce((a, b) => a + b, 0);
  if (sum !== CONTENT_W) throw new Error(`widths sum ${sum} != ${CONTENT_W}`);
  const headerRow = new TableRow({
    tableHeader: true,
    children: headers.map((h, i) => cell(h, { width: widths[i], bold: true, fill: HEAD_FILL, size: fontSize })),
  });
  const bodyRows = rows.map((r, ri) => new TableRow({
    cantSplit: true,
    children: r.map((c, i) => cell(c, {
      width: widths[i],
      bold: totalRowIdx.includes(ri),
      fill: totalRowIdx.includes(ri) ? SUB_FILL : undefined,
      size: fontSize,
    })),
  }));
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: widths,
    rows: [headerRow, ...bodyRows],
  });
}

const spacer = (after = 160) => new Paragraph({ children: [run('')], spacing: { after } });

const baseDoc = (sections) => new Document({
  creator: 'Capital House SOW',
  styles: {
    default: { document: { run: { font: 'Calibri', size: 21 } } },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 28, bold: true, color: '1F3864', font: 'Calibri' },
        paragraph: { spacing: { before: 360, after: 160 }, outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 24, bold: true, color: '2E5597', font: 'Calibri' },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 1 } },
      { id: 'Title', name: 'Title', basedOn: 'Normal', next: 'Normal',
        run: { size: 44, bold: true, color: '1F3864', font: 'Calibri' },
        paragraph: { spacing: { after: 120 } } },
    ],
  },
  numbering: {
    config: [
      { reference: 'bullets', levels: [
        { level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 540, hanging: 300 } } } },
        { level: 1, format: LevelFormat.BULLET, text: '–', alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 1080, hanging: 300 } } } },
      ] },
      { reference: 'numbers', levels: [
        { level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 540, hanging: 360 } } } },
      ] },
    ],
  },
  sections: sections.map((children) => ({
    properties: { page: { margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } } },
    footers: { default: new Footer({ children: [new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ children: ['Capital House  |  Version 2  |  22 October 2026  |  Page ', PageNumber.CURRENT, ' of ', PageNumber.TOTAL_PAGES], size: 16, color: '7F7F7F' })],
    })] }) },
    children,
  })),
});

const title = (main, sub) => [
  new Paragraph({ text: main, style: 'Title' }),
  P(sub, { run: { size: 26, bold: true, color: '2E5597' }, after: 60 }),
  P('Version 2  |  22 October 2026  |  Supersedes the initial estimate', { run: { size: 20, color: '595959' }, after: 60 }),
  P('Prepared for: Capital House        Prepared by: [Vendor company name]', { run: { size: 20, color: '595959' }, after: 240 }),
];

// ---------------------------------------------------------------- SUMMARY
const summary = [
  ...title('CAPITAL HOUSE', 'Revised Estimate: Summary'),
  P('This summary updates the initial estimate to cover the modules added since, the clarified requirements, and the items included without additional charge. The detailed Scope of Work (Version 2) carries module descriptions, assumptions and exclusions. Figures are development effort in 8-hour days; the delivery timeline is agreed separately.'),

  H1('1. Scope and effort by phase'),
  P('Modules marked * were added after the initial estimate.', { run: { italics: true, size: 19 } }),
  table(
    ['Phase', 'Modules', 'Effort (days)'],
    [
      ['Phase 1: Web application, core', 'Lead Management; Renewal Management; Calling & Follow-up; Policy Management; Quotation Management; Payment Management with premium recovery; Portability Management; Notifications on five channels with OTP login; Client & Family Management; Task Management; Document Management*; Insurance Company Master*; Dashboard*; Data Import & Export*', '23 to 27'],
      ['Phase 2: Web application, business management', 'Training & Documentation with product brochures*; Claim Management; Income / Commission Management; Reports & Analytics; Third-Party Policy Management; WhatsApp Marketing; Investments: SIP, FD, Bond, NCD*; Calendar & Meeting Management*; Templates*; Client Self-Service web login*; Client Service Requests*', '17 to 21'],
      ['Phase 3: Mobile apps and call activity', 'CRM mobile app for Android and iOS with staff and client logins; Staff Call Recording & Logging app for Android; Call Activity; Admin Monitoring, Settings & Masters; Security / Audit Trail viewer*', '15 to 17'],
      ['Total development effort', '', '55 to 65'],
      ['Contingency, held separately, used only with your approval', '', '6 to 7'],
    ],
    [2300, 5326, 1400],
    { totalRowIdx: [3, 4] },
  ),
  spacer(),

  H1('2. What changed since the initial estimate'),
  table(
    ['', 'Effort (days)'],
    [
      ['Initial estimate: 20 modules across web and mobile', '38 to 45'],
      ['Added at your request: 12 modules plus the data import tool, consolidated into 11 lines after removing overlaps with existing modules', ''],
      ['Clarified: notifications on five channels with OTP login; call recording and logging in place of call forwarding; one CRM app carrying both staff and client logins', ''],
      ['Revised total', '55 to 65'],
    ],
    [7626, 1400],
    { totalRowIdx: [3] },
  ),
  spacer(80),
  P('Included at no additional charge:', { run: { bold: true }, after: 60 }),
  B('Platform foundation: authentication, roles and permissions, user and branch management, masters framework, settings, dashboard shell, audit log infrastructure, file storage and background jobs.'),
  B('Reporting framework with eight standard reports and export; further reports at 3 to 5 hours each.'),
  B('WhatsApp Business API and push notification connections; App Store and Google Play release work.'),
  B('Staff Call Recording & Logging app for Android in place of the call forwarding item.'),

  H1('3. Not included'),
  P('Payable by Capital House directly to the provider, at actuals, and outside the development effort:', { after: 60 }),
  B('Domain, hosting, SSL, backups and storage for documents and call recordings.'),
  B('Apple Developer Program and Google Play Console accounts, registered in Capital House\'s name.'),
  B('WhatsApp Business API provider fees and Meta per-conversation charges; SMS gateway charges and DLT registration; email service.'),
  B('Content and data preparation: training material, brochures, message template text, insurer and product master data, existing client and policy records.'),
  B('Maintenance and support beyond the warranty period, offered under a separate annual maintenance contract. Changes to scope after sign-off are handled as change requests.'),

  H1('4. Items on the client side with lead times'),
  P('These depend on Capital House and third parties, run alongside development, and gate the go-live of the related feature rather than the development itself.', { after: 60 }),
  table(
    ['Item', 'Typical lead time'],
    [
      ['Meta Business verification for WhatsApp API', '1 to 2 weeks, longer if Meta raises queries'],
      ['SMS DLT registration: entity, sender ID, templates', '1 to 2 weeks'],
      ['Apple Developer Program, organisation enrolment (needs a D-U-N-S number)', 'Up to 2 weeks for a new D-U-N-S number, then 1 to 3 days'],
      ['Google Play Console, organisation account', 'A few days'],
      ['Hosting, domain and SSL provisioning', '1 to 3 days'],
    ],
    [5426, 3600],
  ),
  spacer(),

  H1('5. Next steps'),
  N('Confirm the scope in this summary and the detailed Scope of Work (Version 2).'),
  N('Agree the delivery timeline and phase milestones.'),
  N('Start the client-side items above in week one so they are ready when the related features are.'),
];

// ---------------------------------------------------------------- DETAILED SOW
const mod = (name, desc) => [name, desc];

const phase1 = [
  mod('Lead Management', 'Lead capture, assignment, stages, source tracking, follow-ups, reminders, notes and conversion to client and policy.'),
  mod('Renewal Management', 'Upcoming renewals, expiry tracking, reminders, follow-ups, status and renewal history.'),
  mod('Calling & Follow-up Management', 'Call records, remarks, callback scheduling, activities and activity history.'),
  mod('Policy Management', 'Policy details, members, coverage, documents, status, expiry and policy history.'),
  mod('Quotation Management', 'Quotation creation, comparison, premium details, status, follow-up and conversion tracking.'),
  mod('Payment Management', 'Records of premium payments made by Capital House on behalf of clients, pending amounts, receipts, collection tracking and history. Includes the premium recovery ledger: amounts paid on behalf of each client, amounts recovered and outstanding balance. No online payment and no payment gateway.'),
  mod('Portability Management', 'Portability requests, existing and new policy details, document collection, status and follow-ups.'),
  mod('Notifications', 'Event-driven notifications across five channels: in-app, email, SMS, WhatsApp and mobile push. Per-channel templates with merge fields, user and client channel preferences with opt-out, scheduled reminders (for example 30, 15, 7 and 1 days before renewal), retry on failure and a delivery log. Includes the SMS and email connections and OTP login for clients on web and app.'),
  mod('Client & Family Management', 'Client profiles, family members, contact details, documents, relationships and history.'),
  mod('Task Management', 'Task creation, assignment, priority, due dates, status, reminders and activity tracking.'),
  mod('Document Management *', 'Central document register across clients, policies, claims and leads, with categories, search, version history, expiry flags, bulk download and role-based access. Documents attached inside modules appear here automatically.'),
  mod('Insurance Company Master *', 'Insurer and product records with contact persons, addresses and branch details, commission rates per product, and encrypted storage of per-insurer portal credentials with role-restricted reveal and an audit entry on every reveal.'),
  mod('Dashboard *', 'Role-based landing dashboard with KPI widgets: renewals due, leads by stage, recoveries outstanding, tasks due today, premium month to date, policies expiring, claims open and client birthdays.'),
  mod('Data Import & Export *', 'Import of existing records from Excel or CSV using downloadable templates, column mapping, validation, dry run with error report, queued import with progress and rollback of a failed batch, for clients, family members, policies, leads, third-party policies and masters. Export to Excel or CSV from list screens with the current filters applied.'),
];

const phase2 = [
  mod('Training & Documentation', 'In-app training content and learning materials, document library, staff progress and completion tracking. Includes a product knowledge section for insurer and product brochures with a share-to-client link. Content is supplied by Capital House.'),
  mod('Claim Management', 'Claim registration, policy mapping, documents, follow-ups, status and settlement tracking.'),
  mod('Income / Commission Management', 'Commission calculation per policy using the insurer rate and each staff member\'s percentage, staff commissions, incentives, payout tracking and commission history.'),
  mod('Reports & Analytics', 'Reporting framework with a shared filter bar (date range, branch, staff, insurer, product, status), grouping with totals, column chooser, saved views, export to Excel, CSV and PDF, and scheduled email of a saved report. Eight standard reports: policy register; new business by period, insurer, product, staff and branch; renewals due in 30, 60 and 90 days; renewal performance and retention; lead funnel with conversion; staff daily activity; premium recovery outstanding with aging; commission expected versus received. Further reports can be added at 3 to 5 hours each.'),
  mod('Third-Party Policy Management', 'Entry and import of policies sold by others, mapping, validation, tracking and status.'),
  mod('WhatsApp Marketing', 'Approved templates, campaigns, individual and bulk messaging, reminders, delivery and read status tracking, inbound replies and opt-out handling, through one WhatsApp Business API provider.'),
  mod('Investments: SIP, FD, Bond, NCD *', 'Investment register with type-specific fields, SIP instalment schedules, maturity tracking for FD, Bond and NCD, status and reminders.'),
  mod('Calendar & Meeting Management *', 'Day, week and month calendar showing follow-ups, tasks, renewals and meetings; meeting records with attendees and a link to the client or lead.'),
  mod('Templates *', 'Document templates with merge fields and PDF output for quotations, receipts, welcome letters and renewal notices.'),
  mod('Client Self-Service, web login *', 'Client login on the web application: profile and family, policies and documents, renewals, payment history, claims, service requests and notifications. The mobile app later provides the same features on the same backend.'),
  mod('Client Service Requests *', 'Clients raise requests from the web login or the app; each becomes a task for staff with client-visible status and replies.'),
];

const phase3 = [
  mod('CRM Mobile App, Android and iOS', 'One React Native application with staff and client logins, built on the web application\'s backend and APIs so the experience matches the web. Staff: dashboard, leads, clients, policies, renewals, follow-ups, tasks and notifications. Clients: dashboard, profile and family, policies and documents, renewals, payment history, claims, service requests and notifications. Push notifications. Published on the App Store and Google Play.'),
  mod('Staff Call Recording & Logging App, Android', 'A separate Android application installed directly on company-owned office phones; not published on Google Play. It uploads call log entries (number, direction, duration, time) and the recordings produced by the phone\'s built-in call recorder, and matches each call to clients, leads and assigned tasks. Offline upload queue, device registration per staff member and in-app update.'),
  mod('Call Activity', 'Incoming, outgoing and missed call activity with date and time, linked to clients, leads and tasks; required-versus-made view per staff member per day; follow-up creation; manual tagging of unmatched numbers.'),
  mod('Admin Monitoring, Settings & Masters', 'Admin review of call activity against assigned tasks, audio playback and exceptions; settings screens for Capital House masters.'),
  mod('Security / Audit Trail *', 'Changes are recorded from Phase 1. Searchable viewer with filters by user, record, action and date, with export; explicit events for credential reveal, data export and login.'),
  mod('Store release', 'Store listings, screenshots, privacy policy page, reviewer accounts, testing tracks and review iterations on the App Store and Google Play.'),
];

const modTable = (rows) => table(['Module', 'Scope'], rows, [2600, 6426]);

const detailed = [
  ...title('CAPITAL HOUSE', 'Scope of Work: Detailed (Version 2)'),
  P('This Scope of Work replaces the initial estimate. It covers the web application, the CRM mobile application for Android and iOS, the staff call recording and logging application for Android, the modules added since the initial estimate, and the terms on which the effort is estimated. Modules marked * were added after the initial estimate.'),

  H1('1. Delivery approach'),
  B('The web application is built first, as one React and Laravel codebase.'),
  B('The CRM mobile application for Android and iOS is built after the web application on the same backend and APIs, as one React Native codebase with staff and client logins.'),
  B('The staff call recording and logging application is a separate Android application installed directly on company-owned office phones.'),
  B('The platform foundation is provided from the vendor\'s base platform at no additional development charge: authentication, roles and permissions, user and branch management, masters framework, settings, application shell and navigation, dashboard shell, audit log infrastructure, file upload service, background job runner and deployment scripts.'),
  B('Effort figures are development effort in 8-hour days for the delivery team. They are not calendar durations. The delivery timeline and phase milestones are agreed separately.'),

  H1('2. Phase 1: Web application, core modules'),
  modTable(phase1),
  spacer(),
  H1('3. Phase 2: Web application, business management'),
  modTable(phase2),
  spacer(),
  H1('4. Phase 3: Mobile applications and call activity'),
  modTable(phase3),
  spacer(),

  BR(),
  H1('5. Effort estimate'),
  H2('5.1 Scope from the initial estimate'),
  P('Hours as given in the initial estimate, with one addition to the Notifications module.', { after: 80 }),
  table(
    ['Original phase', 'Modules', 'Hours', 'Days'],
    [
      ['Phase 1', 'Training & Documentation, Lead, Renewal, Calling & Follow-up, Policy, Quotation, Payment, Portability, Notifications', '104 to 120', '13 to 15'],
      ['Phase 2', 'Task, Claim, Income / Commission, Reports & Analytics, Third-Party Policy, WhatsApp Marketing', '64 to 80', '8 to 10'],
      ['Phase 3', 'Staff and client mobile application', '80 to 96', '10 to 12'],
      ['Phase 4', 'Client & Family, call tracking (delivered as the call recording and logging app), Call Activity, Admin Monitoring', '56 to 64', '7 to 8'],
      ['Addition', 'Notifications on five channels, SMS and email connections, OTP login for clients', '32 to 40', '4 to 5'],
      ['Subtotal A', '', '336 to 400', '42 to 50'],
    ],
    [1500, 5126, 1200, 1200],
    { totalRowIdx: [5] },
  ),
  spacer(),
  H2('5.2 Modules added since the initial estimate'),
  table(
    ['#', 'Module', 'Hours'],
    [
      ['1', 'Document Management', '8 to 12'],
      ['2', 'Insurance Company Master', '8 to 10'],
      ['3', 'Client Premium Recovery', 'Included in Payment Management, no additional hours'],
      ['4', 'Dashboard', '12 to 16'],
      ['5', 'Data Import & Export', '26 to 36'],
      ['6', 'Investments: SIP, FD, Bond, NCD', '18 to 24'],
      ['7', 'Product Knowledge / Brochures, inside Training & Documentation', '4'],
      ['8', 'Calendar & Meeting Management', '10 to 14'],
      ['9', 'Templates', '10 to 14'],
      ['10', 'Client Self-Service, web login', '16 to 22'],
      ['11', 'Security / Audit Trail viewer', '8 to 10'],
      ['12', 'Client Service Requests', '6 to 8'],
      ['', 'Subtotal C', '126 to 170 hours, 16 to 21 days'],
    ],
    [600, 5226, 3200],
    { totalRowIdx: [12] },
  ),
  spacer(),
  H2('5.3 Included at no additional charge'),
  B('Reporting framework with eight standard reports and export wiring.'),
  B('Staff Call Recording & Logging application in place of the call forwarding item.'),
  B('WhatsApp Business API connection and push notification delivery.'),
  B('App Store and Google Play release work.'),
  B('Platform foundation as listed in section 1.'),
  H2('5.4 Totals'),
  table(
    ['', 'Hours', 'Days'],
    [
      ['Sum of lines (A plus C)', '462 to 570', '58 to 71'],
      ['Consolidation for components shared across modules', '−22 to −50', '−3 to −6'],
      ['Development total', '440 to 520', '55 to 65'],
      ['Contingency, 10 percent, held separately and used only with Capital House\'s approval', '44 to 52', '6 to 7'],
    ],
    [6226, 1400, 1400],
    { totalRowIdx: [2] },
  ),
  spacer(80),
  P('The consolidation reflects components that are counted in more than one line when modules are estimated independently: the export engine shared by Data Import & Export and the reporting framework; the notifications engine serving reminders in several modules; the client web login sharing its APIs with the client side of the mobile app; the document register sharing the upload service with attachments inside modules.', { run: { size: 19 } }),
  H2('5.5 Effort by delivery phase'),
  table(
    ['Phase', 'Days'],
    [
      ['Phase 1: Web application, core', '23 to 27'],
      ['Phase 2: Web application, business management', '17 to 21'],
      ['Phase 3: Mobile applications and call activity', '15 to 17'],
      ['Development total', '55 to 65'],
    ],
    [7626, 1400],
    { totalRowIdx: [3] },
  ),
  spacer(),

  H1('6. Technology and hosting'),
  table(
    ['Layer', 'Technology'],
    [
      ['Web application', 'React with TypeScript'],
      ['Backend and API', 'Laravel (PHP)'],
      ['Database', 'MySQL or MariaDB'],
      ['CRM mobile application', 'React Native with TypeScript, Android and iOS'],
      ['Call recording and logging application', 'Native Android, installed directly on office phones'],
      ['Push notifications', 'Firebase Cloud Messaging, with Apple Push Notification service for iOS'],
      ['Hosting', 'VPS or cPanel-compatible hosting meeting the requirements below; to be confirmed'],
      ['Version control', 'Git'],
    ],
    [3000, 6026],
  ),
  spacer(80),
  P('Hosting requirements: PHP 8.2 or later, MySQL 8 or MariaDB 10.6 or later, HTTPS, SSH access, cron, the ability to run a persistent queue worker, storage that grows with uploaded documents and call recordings, and daily backups. A VPS is recommended over shared hosting: shared plans commonly lack SSH and a queue worker and throttle cron, which affects scheduled reminders, WhatsApp campaigns, push notifications and report generation. The mobile applications are distributed through the stores and as a direct install; only the web application and API are hosted.', { run: { size: 19 } }),

  H1('7. Third-party services and connections'),
  P('The following connections are included in the development effort. Subscription, usage and transaction charges are payable by Capital House to the provider.', { after: 60 }),
  B('WhatsApp Business API through one Business Solution Provider: templates, single and bulk sending, delivery and read status, inbound replies and opt-out.'),
  B('SMS gateway with DLT template mapping for OTP and transactional messages.'),
  B('Transactional email with SPF and DKIM set up on Capital House\'s domain.'),
  B('OTP login for clients on the web login and the app, over SMS with WhatsApp as fallback or the reverse.'),
  B('Push notifications through Firebase for Android and iOS.'),
  P('One provider per channel is chosen before the related work starts. The estimate assumes a mainstream provider with a documented REST API and webhooks. A change of provider after the connection is built is handled as a change request. Changes made by a provider after go-live, such as API deprecations, fall under maintenance.', { before: 60 }),

  H1('8. Not included'),
  P('The following are outside the development effort and are payable by Capital House directly to the respective provider, at actuals:', { after: 60 }),
  B('Domain name registration and renewals, DNS management.'),
  B('Web hosting, SSL certificate, server backups, bandwidth, and disk or object storage for uploaded documents and call recordings beyond the base server disk.'),
  B('Apple Developer Program membership (currently USD 99 per year) and Google Play Console registration (currently USD 25 one-time), both registered in Capital House\'s legal entity name.'),
  B('WhatsApp Business API provider fees and Meta per-conversation charges.'),
  B('SMS gateway charges and DLT registration fees for entity, sender IDs and templates.'),
  B('Transactional email service.'),
  B('Payment gateway and cloud telephony: not in scope; fees would apply only if added later by change request.'),
  B('Insurer or other third-party API access fees, where such APIs exist.'),
  B('Content and data preparation: training content, brochures, message template text, insurer and product master data, cleansing of existing client and policy records before import.'),
  B('Maintenance and support beyond the warranty period, offered under a separate annual maintenance contract.'),
  B('Changes to scope after sign-off, handled as change requests.'),

  H1('9. Client responsibilities and lead times'),
  P('These items depend on Capital House and third parties. They run alongside development and gate the go-live of the related feature, not the development itself. Durations are typical, not guaranteed.', { after: 60 }),
  table(
    ['Item', 'Initiated by', 'Typical lead time', 'Notes'],
    [
      ['Meta Business verification for WhatsApp API', 'Capital House, with provider assistance', '1 to 2 weeks; up to 3 to 4 if Meta raises queries', 'Documents must match the legal entity name. Until verified, daily conversation limits apply.'],
      ['WhatsApp message template approvals', 'Vendor drafts, Capital House approves', 'Hours to 3 business days per template', 'Templates are drafted while verification is pending.'],
      ['SMS DLT registration: entity, sender ID, templates', 'Capital House', '1 to 2 weeks', 'Required before any OTP or transactional SMS.'],
      ['Apple Developer Program, organisation enrolment', 'Capital House', 'D-U-N-S number up to 2 weeks if new; Apple verification 1 to 3 days after', 'Needs a legal entity, a website on Capital House\'s own domain and an authorised signatory.'],
      ['Google Play Console, organisation account', 'Capital House', 'A few days, subject to identity verification', 'Register as an organisation; a new personal account cannot publish to production until a 14-day closed test with 12 testers.'],
      ['App Store and Play Store review', 'Vendor submits', 'App Store 1 to 3 days per submission, allow 2 to 3 iterations; Play Store hours to a few days', 'Privacy policy URL and a reviewer demo account are required.'],
      ['Hosting, domain pointing, SSL', 'Capital House', '1 to 3 days', 'Credentials are needed before the first deployment.'],
      ['Insurer API access', 'Capital House', 'Unknown; frequently unavailable to intermediaries', 'Out of scope unless API documentation and credentials are provided.'],
    ],
    [2200, 1700, 2200, 2926],
    { fontSize: 18 },
  ),
  spacer(),

  H1('10. Assumptions'),
  B('Effort is in 8-hour development days for the delivery team and excludes waiting time on third parties.'),
  B('User acceptance testing: two rounds per phase. Defects reported within the UAT window are fixed within scope.'),
  B('Warranty: bug fixes for 30 days after each phase goes live. Enhancements are change requests.'),
  B('Capital House supplies branding, master data, template text, training content, test devices and test accounts, and prepares existing data in the import templates. Two import rehearsals are included before go-live.'),
  B('Store, Meta, SMS and email provider accounts are owned by Capital House; the vendor is granted access.'),
  B('Call recording and logging: Android only, on company-owned office phones of a recent model from a mainstream manufacturer, one standard model where possible. Recordings come from the phone\'s built-in call recorder; the vendor does not control that recorder across operating system updates. Storage for recordings and the retention period after which they are deleted are Capital House\'s decisions. Staff consent for recording on company phones and the practice of informing clients are Capital House\'s policy.'),
  B('Hosting choice is to be confirmed before deployment; the requirements in section 6 apply either way.'),

  H1('11. Licence and ownership'),
  P('Capital House receives a perpetual, non-exclusive licence to use the delivered system for its business. The vendor retains ownership of the platform, source code and know-how, including the right to offer the platform to others. Capital House\'s data, branding and content remain Capital House\'s property. Final wording to be agreed in the contract.'),

  H1('12. Future options, not in this Scope of Work'),
  table(
    ['Item', 'Indicative effort', 'Notes'],
    [
      ['AI transcription and summary of recorded calls or meetings', 'On request', 'Call recordings would be the input; API usage charges apply'],
      ['Extended report pack, 20 further reports', '65 to 94 hours', 'Or individually at 3 to 5 hours each'],
      ['Google or Microsoft calendar sync', '12 to 16 hours', ''],
      ['Object storage for documents and recordings', '4 to 8 hours', 'Recommended once recording volume grows'],
    ],
    [4026, 1800, 3200],
  ),
  spacer(),

  H1('13. Acceptance'),
  table(
    ['', 'For Capital House', 'For [Vendor company name]'],
    [
      ['Name', '', ''],
      ['Designation', '', ''],
      ['Signature', '', ''],
      ['Date', '', ''],
    ],
    [2026, 3500, 3500],
  ),
];

(async () => {
  const docs = [
    ['Capital_House_Revised_Estimate_Summary_v2.docx', [summary]],
    ['Capital_House_SOW_v2_Detailed.docx', [detailed]],
  ];
  for (const [name, sections] of docs) {
    const buf = await Packer.toBuffer(baseDoc(sections));
    fs.writeFileSync(path.join(OUT, name), buf);
    console.log('wrote', name, buf.length, 'bytes');
  }
})().catch((e) => { console.error(e); process.exit(1); });
