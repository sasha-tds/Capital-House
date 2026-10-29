// Builds the client inputs document (Word) and the input templates workbook (Excel).
// Content lives in inputs_content.js. Output goes to ../../requirements/.
//   npm install
//   node build_inputs.js
const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType,
  HeadingLevel, AlignmentType, BorderStyle, ShadingType, LevelFormat, PageBreak,
  Footer, PageNumber, VerticalAlign,
} = require('docx');
const ExcelJS = require('exceljs');
const C = require('./inputs_content');

const OUT = path.resolve(__dirname, '..', '..', 'requirements');
const DOC_NAME = 'Capital_House_Client_Inputs_v1.docx';
const XLSX_NAME = 'Capital_House_Input_Templates_v1.xlsx';

// ------------------------------------------------------------------ docx helpers
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
  keepNext: opts.keepNext,
});
const H1 = (t) => new Paragraph({ text: t, heading: HeadingLevel.HEADING_1, spacing: { before: 360, after: 160 } });
const H2 = (t) => new Paragraph({ text: t, heading: HeadingLevel.HEADING_2, spacing: { before: 240, after: 120 }, keepNext: true });
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
const spacer = (after = 160) => new Paragraph({ children: [run('')], spacing: { after } });

// content: string | string[] (one paragraph each) | { runs: TextRun[] }
function cell(content, { width, bold = false, fill, align, size } = {}) {
  let paragraphs;
  if (content && typeof content === 'object' && !Array.isArray(content) && content.runs) {
    paragraphs = [new Paragraph({ children: content.runs, alignment: align, spacing: { after: 40 } })];
  } else {
    const items = Array.isArray(content) ? content : [content];
    paragraphs = items.map((t) => new Paragraph({
      children: [run(String(t), { bold, size })],
      alignment: align,
      spacing: { after: 40 },
    }));
  }
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    borders: BORDERS,
    verticalAlign: VerticalAlign.TOP,
    shading: fill ? { fill, type: ShadingType.CLEAR, color: 'auto' } : undefined,
    margins: { top: 60, bottom: 60, left: 100, right: 100 },
    children: paragraphs,
  });
}

function table(headers, rows, widths, { fontSize = 19, totalRowIdx = [], boldFirstCol = false } = {}) {
  const sum = widths.reduce((a, b) => a + b, 0);
  if (sum !== CONTENT_W) throw new Error(`widths sum ${sum} != ${CONTENT_W} for table starting "${headers[0]}"`);
  const headerRow = new TableRow({
    tableHeader: true,
    children: headers.map((h, i) => cell(h, { width: widths[i], bold: true, fill: HEAD_FILL, size: fontSize })),
  });
  const bodyRows = rows.map((r, ri) => new TableRow({
    cantSplit: true,
    children: r.map((c, i) => cell(c, {
      width: widths[i],
      bold: totalRowIdx.includes(ri) || (boldFirstCol && i === 0),
      fill: totalRowIdx.includes(ri) ? SUB_FILL : (boldFirstCol && i === 0 ? SUB_FILL : undefined),
      size: fontSize,
    })),
  }));
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: widths,
    rows: [headerRow, ...bodyRows],
  });
}

const footerText = `Capital House  |  Client Inputs, ${C.VERSION}  |  ${C.DATE}  |  Page `;

const baseDoc = (sections) => new Document({
  creator: 'Capital House client inputs',
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
      children: [new TextRun({ children: [footerText, PageNumber.CURRENT, ' of ', PageNumber.TOTAL_PAGES], size: 16, color: '7F7F7F' })],
    })] }) },
    children,
  })),
});

const title = (main, sub) => [
  new Paragraph({ text: main, style: 'Title' }),
  P(sub, { run: { size: 26, bold: true, color: '2E5597' }, after: 60 }),
  P(`${C.VERSION}  |  ${C.DATE}  |  For the Scope of Work, Version 2`, { run: { size: 20, color: '595959' }, after: 60 }),
  P('Prepared for: Capital House        Prepared by: [Vendor company name]', { run: { size: 20, color: '595959' }, after: 240 }),
];

const listText = (key) => `${C.LISTS[key].name}: ${C.LISTS[key].values.join('; ')}`;

// ------------------------------------------------------------------ workbook sheet index
// [sheet, what to fill, needed by]
const SHEETS = [
  ['Read me', 'How to fill the workbook', ''],
  ['Checklist', 'Owner, status and date for every input in section 13', 'Ongoing'],
  ['Decisions', 'Your decision on each item in section 12', 'As listed'],
  ['Branches', 'Every branch', 'Week 1'],
  ['Staff', 'Every staff member with role, branch, reporting line, commission share', 'Week 1'],
  ['Insurers', 'Every insurer you work with', 'Week 1'],
  ['Insurer contacts', 'People at each insurer', 'Week 1'],
  ['Products', 'Plans per insurer with commission rates', 'Week 1'],
  ['Lists', 'Our proposed dropdown values: keep, change or add', 'Phase 1 start'],
  ['Clients', '20 sample clients', 'Phase 1 testing'],
  ['Family members', 'Family members of the sample clients', 'Phase 1 testing'],
  ['Policies', '20 sample policies across insurers and types', 'Phase 1 testing'],
  ['Leads', '20 sample leads', 'Phase 1 testing'],
  ['Payments and recovery', 'Three months of payments on behalf and recoveries', 'Phase 1 testing'],
  ['Notification templates', 'Edit and approve our draft texts', 'Phase 1 testing'],
  ['Third-party policies', '10 sample records', 'Phase 2 testing'],
  ['Claims', '10 recent claims', 'Phase 2 testing'],
  ['Investments', '10 records across SIP, FD, Bond and NCD', 'Phase 2 testing'],
  ['Reports', 'Confirm or change the eight standard reports', 'Phase 2 start'],
  ['Office phones', 'Phones for the call recording and logging app, with staff mapping', 'Phase 3 start'],
];

// ------------------------------------------------------------------ the document
function buildDocument() {
  const d = [];
  d.push(...title('CAPITAL HOUSE', 'Client Inputs for the CRM Build'));
  d.push(P('Capital House has approved the Scope of Work, Version 2. This document lists what we need from Capital House to build it: accounts, branding, organisation data, master data, the fields and rules of every page, message texts, document templates, reports, existing data for migration, office phones and app store details. It comes with an Excel workbook of fill-in templates. Where we propose a default, it is marked as our proposal; keep it or change it.'));

  d.push(P('Contents', { run: { bold: true, color: '1F3864', size: 22 }, after: 60 }));
  d.push(table(['', 'Section'], [
    ['1', 'How to use this document and when inputs are needed'],
    ['2', 'Accounts and access'],
    ['3', 'Branding and legal'],
    ['4', 'Organisation setup'],
    ['5', 'Masters'],
    ['6', 'Module by module: pages, fields, lists, rules, documents, access, sample data'],
    ['7', 'Communication content: notifications, message texts, document templates'],
    ['8', 'Reports'],
    ['9', 'Data migration'],
    ['10', 'Call recording and logging'],
    ['11', 'CRM mobile app: store details'],
    ['12', 'Decisions pending'],
    ['13', 'Checklist of inputs'],
  ], [600, 8426]));

  // 1
  d.push(H1('1. How to use this document'));
  d.push(P('Work through the sections in order. Section 2 starts the accounts that have lead times; those go first. Sections 3 to 5 collect the data the whole system depends on. Section 6 goes module by module. Sections 7 to 11 cover texts, reports, migration, phones and the stores. Section 12 lists decisions we need, with our recommendation for each. Section 13 is the checklist to track everything.'));
  d.push(P('How to respond', { run: { bold: true }, after: 60 }));
  d.push(B('Fill the Excel workbook for structured data: branches, staff, insurers, products, lists, sample records, templates, decisions and the checklist.'));
  d.push(B('Mark up this document for everything else: confirm or change the proposed fields, lists and rules in section 6, and answer the questions in each module\'s table. Comments in Word, or a short written reply per section, both work.'));
  d.push(B('Send files (logos, letterheads, sample documents, current Excel registers, brochures) by shared folder. Never send passwords in a file or by email; hand them over on a call or through a password manager.'));
  d.push(B('Fields marked * are mandatory in our proposal. Lists show our proposed values; add, rename or remove as you see fit.'));
  d.push(P('When inputs are needed', { run: { bold: true }, after: 60, before: 120 }));
  d.push(P('The delivery timeline is agreed separately, so the "needed by" points in this document are relative to the project phases.', { after: 80 }));
  d.push(table(['Needed by', 'Meaning'], C.MILESTONES, [1800, 7226], { boldFirstCol: true }));
  d.push(spacer());
  d.push(P('The workbook', { run: { bold: true }, after: 60 }));
  d.push(P(`${XLSX_NAME} has one sheet per entity. Yellow cells are for you to fill. Row 2 of each sheet is an example in grey italics; overwrite or delete it.`, { after: 80 }));
  d.push(table(['Sheet', 'What to fill', 'Needed by'], SHEETS, [2200, 5226, 1600]));

  // 2
  d.push(H1('2. Accounts and access'));
  d.push(P('Every account below is opened in Capital House\'s name and owned by Capital House. We are given access. Subscription and usage charges are payable by Capital House to the provider, as set out in the Scope of Work. Start the items with lead times in week one.', { after: 80 }));
  d.push(table(['Account', 'Why we need it', 'What Capital House does', 'What to give us', 'Lead time and needed by'],
    C.ACCOUNTS.map((r) => [r[0], r[1], r[2], r[3], `${r[4]}. ${r[5]}.`]),
    [1400, 1800, 2400, 1900, 1526], { fontSize: 17, boldFirstCol: true }));

  // 3
  d.push(H1('3. Branding and legal'));
  d.push(table(['Item', 'Detail', 'Format'], C.BRANDING, [1700, 5426, 1900], { boldFirstCol: true }));

  // 4
  d.push(H1('4. Organisation setup'));
  d.push(P('Fill the Branches and Staff sheets. Each staff member has one role, one home branch and one reporting manager. The commission share is the percentage of the agency\'s commission that the staff member earns on policies they sell; it can be changed per policy later. Mark the people who get admin access.'));
  d.push(P('Access rules', { run: { bold: true }, after: 60 }));
  d.push(P('Our proposed permission matrix is below. "Own" means records the staff member created or is assigned to. "Branch" means every record in their branch. Confirm or change it; roles can be added.', { after: 80 }));
  d.push(table(C.ROLE_HEADERS, C.ROLE_MATRIX, [1826, 1200, 1200, 1200, 1200, 1200, 1200], { fontSize: 17, boldFirstCol: true }));
  d.push(spacer(80));
  d.push(P('Also tell us: working hours and days for the branches; whether staff may log in outside working hours; whether logins are restricted to office devices; and the password policy you want (we propose a minimum of 8 characters with a number, a change on first login, and two-factor login for admins).', { run: { size: 19 } }));

  // 5
  d.push(H1('5. Masters'));
  d.push(P('Masters are the reference data every module uses. The structured ones have their own sheet. The simple value lists are on the Lists sheet, pre-filled with our proposals: mark each value Keep or write the replacement, and add rows for new values.', { after: 80 }));
  d.push(table(['Master', 'Fields we need', 'Where to fill', 'Proposal included'], C.MASTERS, [1700, 4426, 1800, 1100], { boldFirstCol: true }));

  // 6
  d.push(BR());
  d.push(H1('6. Module by module'));
  d.push(P('For each module: the pages it has, the fields each page shows and captures, the lists behind the dropdowns, the business rules we need you to confirm, the documents attached, who can see and edit, and the sample data we need to build and test it. Fields marked * are mandatory in our proposal. Modules follow the phases of the Scope of Work.'));
  C.MODULES.forEach((m, i) => {
    d.push(H2(`6.${i + 1} ${m.name} (Phase ${m.phase})`));
    d.push(P(m.purpose, { after: 80 }));
    d.push(table(['Page', 'What it does', 'Fields'], m.pages, [1600, 2500, 4926], { fontSize: 18, boldFirstCol: true }));
    d.push(spacer(80));
    const lists = [...m.lists.map(listText), ...((m.extraLists || []).map(([n, v]) => `${n}: ${v}`))];
    const rows = [
      ['Lists and values', lists.length ? lists : ['None specific to this module.']],
      ['Rules to confirm', m.rules.map((r) => `• ${r}`)],
      ['Documents attached', m.documents],
      ['Who sees and edits', m.access],
      ['Sample data we need', m.samples],
    ];
    d.push(table(['Input', 'What we need from you'], rows, [1700, 7326], { fontSize: 18, boldFirstCol: true }));
    d.push(spacer());
  });

  // 7
  d.push(BR());
  d.push(H1('7. Communication content'));
  d.push(H2('7.1 Notification catalogue'));
  d.push(P('Every event that sends a message, with the recipients, channels and timing we propose and the merge fields available for the text. Confirm each row. WhatsApp and SMS texts need approval from Meta and on the DLT portal, so the texts are needed before Phase 1 testing.', { after: 80 }));
  d.push(table(['Event', 'To', 'Channels', 'When', 'Merge fields', 'Needed from you'], C.NOTIFICATIONS, [1500, 1150, 1600, 1500, 1876, 1400], { fontSize: 17, boldFirstCol: true }));
  d.push(spacer());
  d.push(H2('7.2 Message texts'));
  d.push(P('The Notification templates sheet in the workbook carries our draft text for every event and channel. Edit the text in the yellow column and mark it approved. Points to keep in mind:', { after: 60 }));
  d.push(B('WhatsApp: templates are approved by Meta per language. Marketing texts and transactional texts are separate categories. Variables such as the client name are filled from the record.'));
  d.push(B('SMS: each text is registered on the DLT portal exactly as it will be sent, with the sender ID. Keep texts under 160 characters where possible. Variables are allowed within limits set by the operators.'));
  d.push(B('Email: one layout with your logo, colours and footer, used for every email; approve our draft. Documents such as policies and receipts are attached.'));
  d.push(B('In-app and push: short texts for staff; no approval by a third party.'));
  d.push(B('Languages: each extra language needs its own approved WhatsApp and SMS templates. Decision 7 in section 12.'));
  d.push(B('Also send screenshots of the messages you send clients today, so the tone matches.'));
  d.push(H2('7.3 Document templates'));
  d.push(P('Generated as PDF from the system using your letterhead. Send each as you produce it today.', { after: 80 }));
  d.push(table(['Template', 'Used in', 'What we need'], C.DOC_TEMPLATES, [1800, 2600, 4626], { boldFirstCol: true }));

  // 8
  d.push(H1('8. Reports'));
  d.push(P('The eight standard reports with the filters, columns and grouping we propose. Confirm or change them on the Reports sheet, and tell us who receives each report by scheduled email and how often. Every report exports to Excel, CSV and PDF. Premium is shown as net and gross.', { after: 80 }));
  d.push(table(['#', 'Report', 'Proposed filters', 'Proposed columns', 'Grouping'], C.REPORTS, [400, 1500, 2300, 3326, 1500], { fontSize: 17 }));

  // 9
  d.push(H1('9. Data migration'));
  d.push(P('Your existing records are loaded through the import tool. The work starts with one sample of each file as it exists today, so the import templates and column mappings can be designed around your data.', { after: 80 }));
  d.push(table(['File', 'What it holds', 'How far back', 'Needed by'], C.MIGRATION_FILES, [1800, 3400, 2100, 1726], { boldFirstCol: true }));
  d.push(spacer());
  d.push(P('Steps', { run: { bold: true }, after: 60 }));
  C.MIGRATION_STEPS.forEach((s) => d.push(N(s)));
  d.push(P('Responsibilities', { run: { bold: true }, after: 60, before: 120 }));
  d.push(table(['Who', 'Does'], C.MIGRATION_RESPONSIBILITIES, [1600, 7426], { boldFirstCol: true }));
  d.push(spacer(80));
  d.push(P('Decisions for migration: how far back policies go (we propose active plus two years of expired); the cut-off date; what happens to records without a mobile number (we propose import with a flag for follow-up); and whether scanned documents are loaded in bulk, which needs files named by policy number.', { run: { size: 19 } }));

  // 10
  d.push(H1('10. Call recording and logging'));
  d.push(P('The staff call recording and logging app is a separate Android app installed directly on company-owned office phones. It is not the CRM mobile app and it is not published on Google Play. It uploads call logs and the recordings made by the phone\'s built-in recorder. Android does not allow apps to record calls themselves, so the phone model matters.', { after: 80 }));
  d.push(table(['Input', 'Detail', 'Format or proposal'], C.CALLS, [1800, 5226, 2000], { boldFirstCol: true }));

  // 11
  d.push(H1('11. CRM mobile app: store details'));
  d.push(P('For the CRM mobile app on Android and iOS, with staff and client logins. The store accounts themselves are in section 2.', { after: 80 }));
  d.push(table(['Input', 'Detail', 'Format'], C.MOBILE, [1800, 5226, 2000], { boldFirstCol: true }));

  // 12
  d.push(H1('12. Decisions pending'));
  d.push(P('Each decision with the options, our recommendation and when we need it. Record your decision on the Decisions sheet.', { after: 80 }));
  d.push(table(['#', 'Decision', 'Options', 'Our recommendation', 'Needed by'], C.DECISIONS, [400, 2000, 2200, 3126, 1300], { fontSize: 17 }));

  // 13
  d.push(BR());
  d.push(H1('13. Checklist of inputs'));
  d.push(P('Every input in this document, in the order it is needed. The Checklist sheet in the workbook has the same rows with columns for the owner at Capital House, status and date.', { after: 80 }));
  d.push(table(['#', 'Input', 'Section', 'Format', 'Needed by', 'Owner', 'Status'],
    C.CHECKLIST.map((r, i) => [String(i + 1), r[0], r[1], r[2], r[3], '', '']),
    [400, 3226, 900, 1500, 1100, 1000, 900], { fontSize: 17 }));
  d.push(spacer());
  d.push(P('Questions on any item: contact the project lead at [Vendor company name].', { run: { size: 19, color: '595959' } }));
  return d;
}

// ------------------------------------------------------------------ the workbook
const FONT = 'Calibri';
const YELLOW = 'FFFFF9E5';
const GREY_FILL = 'FFF2F2F2';
const HEAD = 'FFD9E2F3';
const GREY_TEXT = 'FF7F7F7F';
const FILL_ROWS = 200;
const thin = { style: 'thin', color: { argb: 'FFA6A6A6' } };
const BORDER_ALL = { top: thin, left: thin, bottom: thin, right: thin };

// Every list becomes a column on a hidden sheet; data validations point at these ranges.
// The sheet itself is added last so it sits at the end of the workbook.
const LIST_KEYS = Object.keys(C.LISTS);
const colLetter = (n) => { let s = ''; while (n > 0) { const m = (n - 1) % 26; s = String.fromCharCode(65 + m) + s; n = Math.floor((n - 1) / 26); } return s; };
const LIST_REF = Object.fromEntries(LIST_KEYS.map((k, i) => {
  const letter = colLetter(i + 1);
  return [k, `_lists!$${letter}$2:$${letter}$${C.LISTS[k].values.length + 1}`];
}));
function addHiddenLists(wb) {
  const ws = wb.addWorksheet('_lists', { state: 'hidden' });
  LIST_KEYS.forEach((k, i) => { ws.getColumn(i + 1).values = [C.LISTS[k].name, ...C.LISTS[k].values]; });
}

function headerCell(ws, colIdx, name, hint, mandatory) {
  const cell = ws.getCell(1, colIdx);
  const parts = [{ font: { name: FONT, size: 10, bold: true }, text: name + (mandatory ? '*' : '') }];
  if (hint) parts.push({ font: { name: FONT, size: 8, italic: true, color: { argb: GREY_TEXT } }, text: `\n${hint}` });
  cell.value = { richText: parts };
  cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: HEAD } };
  cell.alignment = { vertical: 'top', wrapText: true };
  cell.border = BORDER_ALL;
}

// spec: { name, columns: [{ h, hint, w, list, m, date }], example: [], fillCols: [idx...] (default all) }
function addEntitySheet(wb, listRef, spec) {
  const ws = wb.addWorksheet(spec.name);
  spec.columns.forEach((c, i) => {
    headerCell(ws, i + 1, c.h, c.hint, c.m);
    ws.getColumn(i + 1).width = c.w || 18;
  });
  ws.getRow(1).height = 42;
  // row 2: example
  spec.columns.forEach((c, i) => {
    const cell = ws.getCell(2, i + 1);
    cell.value = spec.example[i] ?? '';
    cell.font = { name: FONT, size: 10, italic: true, color: { argb: GREY_TEXT } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: GREY_FILL } };
    cell.alignment = { vertical: 'top', wrapText: true };
    cell.border = BORDER_ALL;
  });
  // fill-in rows
  const fillCols = spec.fillCols || spec.columns.map((_, i) => i);
  const prefilled = spec.rows || [];
  const lastRow = Math.max(2 + FILL_ROWS, 2 + prefilled.length);
  prefilled.forEach((r, ri) => r.forEach((v, ci) => { ws.getCell(3 + ri, ci + 1).value = v; }));
  for (let r = 3; r <= lastRow; r++) {
    spec.columns.forEach((c, i) => {
      const cell = ws.getCell(r, i + 1);
      cell.font = { name: FONT, size: 10 };
      cell.alignment = { vertical: 'top', wrapText: true };
      cell.border = BORDER_ALL;
      if (fillCols.includes(i)) cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: YELLOW } };
      if (c.date) cell.numFmt = 'dd/mm/yyyy';
    });
  }
  // validations
  spec.columns.forEach((c, i) => {
    if (!c.list) return;
    const letter = ws.getColumn(i + 1).letter;
    ws.dataValidations.add(`${letter}3:${letter}${lastRow}`, {
      type: 'list', allowBlank: true, formulae: [listRef[c.list]],
      showErrorMessage: true, errorStyle: 'warning', errorTitle: 'Not in the proposed list',
      error: 'You can keep this value. Add it on the Lists sheet so we include it.',
    });
  });
  ws.views = [{ state: 'frozen', xSplit: 1, ySplit: 2 }];
  ws.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: spec.columns.length } };
  return ws;
}

function addReadMe(wb) {
  const ws = wb.addWorksheet('Read me');
  ws.getColumn(1).width = 26; ws.getColumn(2).width = 70; ws.getColumn(3).width = 18;
  const put = (r, c, v, style = {}) => { const cell = ws.getCell(r, c); cell.value = v; cell.font = { name: FONT, size: 10, ...style }; cell.alignment = { vertical: 'top', wrapText: true }; return cell; };
  put(1, 1, 'Capital House: input templates', { bold: true, size: 14, color: { argb: 'FF1F3864' } });
  put(2, 1, `${C.VERSION}, ${C.DATE}. Goes with the document Client Inputs for the CRM Build. Prepared by [Vendor company name].`, { color: { argb: 'FF595959' } });
  const legend = [
    ['How to fill', 'One row per record. Do not rename or move the header row. Add rows freely. Yellow cells are for you to fill; grey cells are ours.'],
    ['Example row', 'Row 2 of each data sheet is an example in grey italics. Overwrite it or delete it before sending.'],
    ['Mandatory fields', 'A header marked * is mandatory in the system. Leave it blank only if you do not have the value; we will ask.'],
    ['Dropdowns', 'Cells with a dropdown carry our proposed values. You may type another value; then add it on the Lists sheet so we include it.'],
    ['Dates and numbers', 'Dates as DD/MM/YYYY. Mobile numbers as 10 digits without +91. Amounts in rupees without commas. Percentages as numbers, for example 15 for 15 percent.'],
    ['Codes', 'Branch, staff, insurer and client codes link the sheets together. Use the same code everywhere. Your own existing codes are fine.'],
    ['Passwords', 'Never put insurer portal passwords or any other password in this workbook. Hand them over on a call or through a password manager.'],
    ['Sending', 'Send the workbook as one file, by shared folder, as often as you like. We work from the latest version.'],
  ];
  let r = 4;
  put(r, 1, 'Legend', { bold: true }); r++;
  legend.forEach(([k, v]) => { put(r, 1, k, { bold: true }); put(r, 2, v); r++; });
  r++;
  put(r, 1, 'Sheet', { bold: true }); put(r, 2, 'What to fill', { bold: true }); put(r, 3, 'Needed by', { bold: true });
  [1, 2, 3].forEach((c) => { const cell = ws.getCell(r, c); cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: HEAD } }; cell.border = BORDER_ALL; });
  r++;
  SHEETS.forEach(([s, w, n]) => {
    put(r, 1, s); put(r, 2, w); put(r, 3, n);
    [1, 2, 3].forEach((c) => { ws.getCell(r, c).border = BORDER_ALL; });
    r++;
  });
  r++;
  put(r, 1, 'Colour key', { bold: true }); r++;
  const y = put(r, 1, 'Fill in'); y.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: YELLOW } }; y.border = BORDER_ALL; put(r, 2, 'Yellow: for Capital House to fill.'); r++;
  const g = put(r, 1, 'Example', { italic: true, color: { argb: GREY_TEXT } }); g.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: GREY_FILL } }; g.border = BORDER_ALL; put(r, 2, 'Grey italics: example values to overwrite or delete.'); r++;
  const h = put(r, 1, 'Header', { bold: true }); h.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: HEAD } }; h.border = BORDER_ALL; put(r, 2, 'Blue: column headers and our proposals. Do not change.'); r++;
}

function addListsSheet(wb, listRef) {
  const skip = new Set(['yesNo', 'recordStatuses', 'checklistStatuses']);
  const rows = [];
  Object.keys(C.LISTS).filter((k) => !skip.has(k)).forEach((k) => {
    C.LISTS[k].values.forEach((v) => rows.push([C.LISTS[k].name, v, '', '', '']));
  });
  for (let i = 0; i < 8; i++) rows.push(['Investment providers', '', '', '', i === 0 ? 'Fund houses, banks, NBFCs and issuers you work with. One per row.' : '']);
  const spec = {
    name: 'Lists',
    columns: [
      { h: 'List', hint: 'Which dropdown this value belongs to', w: 30 },
      { h: 'Proposed value', hint: 'Our proposal; leave as is', w: 34 },
      { h: 'Keep', hint: 'Yes or No', w: 10, list: 'yesNo' },
      { h: 'Replace with or add', hint: 'New wording, or a new value on a new row with the list name', w: 34 },
      { h: 'Notes', hint: '', w: 34 },
    ],
    example: ['Lead sources', 'Walk-in', 'Yes', '', 'To add a value, insert a row with the list name in column A and the value in column D.'],
    rows,
    fillCols: [2, 3, 4],
  };
  return addEntitySheet(wb, listRef, spec);
}

function buildWorkbook() {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'Capital House client inputs';
  wb.created = new Date();
  addReadMe(wb);
  const listRef = LIST_REF;

  addEntitySheet(wb, listRef, {
    name: 'Checklist',
    columns: [
      { h: '#', hint: '', w: 5 }, { h: 'Input', hint: 'From section 13 of the document', w: 60 }, { h: 'Section', hint: '', w: 9 },
      { h: 'Format', hint: '', w: 24 }, { h: 'Needed by', hint: '', w: 15 },
      { h: 'Owner at Capital House', hint: 'Name', w: 22 }, { h: 'Status', hint: 'From list', w: 15, list: 'checklistStatuses' },
      { h: 'Date provided', hint: 'DD/MM/YYYY', w: 14, date: true }, { h: 'Notes', hint: '', w: 40 },
    ],
    example: ['0', 'Example: domain confirmed and DNS access given', '2', 'DNS records', 'Week 1', 'Asha Mehta', 'Provided', '03/11/2026', 'Records added by the IT vendor'],
    rows: C.CHECKLIST.map((r, i) => [i + 1, r[0], r[1], r[2], r[3], '', '', '', '']),
    fillCols: [5, 6, 7, 8],
  });

  addEntitySheet(wb, listRef, {
    name: 'Decisions',
    columns: [
      { h: '#', hint: '', w: 5 }, { h: 'Decision', hint: 'From section 12', w: 34 }, { h: 'Options', hint: '', w: 34 },
      { h: 'Our recommendation', hint: '', w: 44 }, { h: 'Needed by', hint: '', w: 15 },
      { h: 'Your decision', hint: 'Write the option you choose', w: 34 }, { h: 'Decided by', hint: 'Name', w: 18 }, { h: 'Date', hint: 'DD/MM/YYYY', w: 14, date: true },
    ],
    example: ['0', 'Example: SSL certificate', 'Free Let\'s Encrypt; purchased certificate', 'Free Let\'s Encrypt', 'Phase 1 testing', 'Free Let\'s Encrypt', 'Director', '05/11/2026'],
    rows: C.DECISIONS.map((r) => [Number(r[0]), ...r.slice(1), '', '', '']),
    fillCols: [5, 6, 7],
  });

  addEntitySheet(wb, listRef, {
    name: 'Branches',
    columns: [
      { h: 'Branch code', hint: 'Short, unique, e.g. BR1', w: 12, m: true }, { h: 'Branch name', hint: '', w: 24, m: true },
      { h: 'Address line 1', hint: '', w: 28, m: true }, { h: 'Address line 2', hint: '', w: 24 }, { h: 'City', hint: '', w: 16, m: true },
      { h: 'State', hint: '', w: 16, m: true }, { h: 'PIN', hint: '6 digits', w: 10, m: true }, { h: 'Phone', hint: '', w: 16, m: true },
      { h: 'Email', hint: '', w: 26 }, { h: 'GSTIN', hint: 'If separate from head office', w: 18 },
      { h: 'Branch head', hint: 'Staff code', w: 14 }, { h: 'Status', hint: 'Active or Inactive', w: 12, list: 'recordStatuses' },
    ],
    example: ['BR1', 'Main branch', '12 Station Road', 'Near City Mall', 'Pune', 'Maharashtra', '411001', '020 2345 6789', 'main@capitalhouse.example', '', 'S001', 'Active'],
  });

  addEntitySheet(wb, listRef, {
    name: 'Staff',
    columns: [
      { h: 'Staff code', hint: 'Short, unique, e.g. S001', w: 12, m: true }, { h: 'Full name', hint: '', w: 24, m: true },
      { h: 'Mobile', hint: '10 digits; used to log in', w: 14, m: true }, { h: 'Email', hint: '', w: 28, m: true },
      { h: 'Branch code', hint: 'From Branches', w: 12, m: true }, { h: 'Role', hint: 'From list', w: 18, m: true, list: 'staffRoles' },
      { h: 'Designation', hint: 'As on visiting card', w: 20 }, { h: 'Reports to', hint: 'Staff code of the manager', w: 12 },
      { h: 'Date of joining', hint: 'DD/MM/YYYY', w: 14, date: true }, { h: 'Commission share %', hint: 'Share of agency commission on own sales', w: 14 },
      { h: 'Monthly premium target', hint: 'Rupees, if set', w: 16 }, { h: 'IRDAI or POSP code', hint: 'If any', w: 16 },
      { h: 'May reveal insurer credentials', hint: 'Yes or No', w: 14, list: 'yesNo' }, { h: 'Status', hint: 'Active or Inactive', w: 12, list: 'recordStatuses' },
      { h: 'Notes', hint: '', w: 30 },
    ],
    example: ['S002', 'Asha Mehta', '9876543210', 'asha@capitalhouse.example', 'BR1', 'Sales executive', 'Senior Advisor', 'S001', '01/04/2019', '20', '500000', 'POSP12345', 'No', 'Active', ''],
  });

  addEntitySheet(wb, listRef, {
    name: 'Insurers',
    columns: [
      { h: 'Insurer code', hint: 'Short, unique', w: 12, m: true }, { h: 'Insurer name', hint: 'Full legal name', w: 32, m: true },
      { h: 'Type', hint: 'From list', w: 22, m: true, list: 'insurerTypes' }, { h: 'IRDAI registration no', hint: '', w: 14 },
      { h: 'Our agency code', hint: 'Your code with this insurer', w: 16, m: true }, { h: 'Agency manager name', hint: 'Your contact at the insurer', w: 20 },
      { h: 'Agency manager mobile', hint: '', w: 14 }, { h: 'Agency manager email', hint: '', w: 26 },
      { h: 'Head office address', hint: '', w: 32 }, { h: 'Local office address', hint: 'Office you deal with', w: 32 }, { h: 'Local office city', hint: '', w: 14 },
      { h: 'Portal URL', hint: 'Login page, no credentials', w: 28 }, { h: 'Claim intimation phone', hint: '', w: 16 }, { h: 'Claim intimation email', hint: '', w: 26 },
      { h: 'Customer care no', hint: '', w: 16 }, { h: 'Website', hint: '', w: 26 }, { h: 'Status', hint: 'Active or Inactive', w: 12, list: 'recordStatuses' }, { h: 'Notes', hint: '', w: 30 },
    ],
    example: ['BGIC', 'Bharat General Insurance Co. Ltd. (example)', 'General insurance', '999', 'AG123456', 'Priya Nair', '9812345678', 'priya@insurer.example', 'Insurer House, Mumbai 400001', '2nd Floor, Business Park, Pune 411014', 'Pune', 'https://portal.insurer.example', '1800 000 0000', 'claims@insurer.example', '1800 000 0001', 'https://www.insurer.example', 'Active', ''],
  });

  addEntitySheet(wb, listRef, {
    name: 'Insurer contacts',
    columns: [
      { h: 'Insurer code', hint: 'From Insurers', w: 12, m: true }, { h: 'Contact name', hint: '', w: 24, m: true },
      { h: 'Designation', hint: '', w: 22 }, { h: 'Role', hint: 'From list', w: 18, m: true, list: 'contactRoles' },
      { h: 'Mobile', hint: '', w: 14 }, { h: 'Email', hint: '', w: 28 }, { h: 'Office or city', hint: '', w: 18 }, { h: 'Notes', hint: '', w: 30 },
    ],
    example: ['BGIC', 'Rohan Desai', 'Claims Manager', 'Claims', '9823456789', 'rohan@insurer.example', 'Pune', 'Health claims above 1 lakh'],
  });

  addEntitySheet(wb, listRef, {
    name: 'Products',
    columns: [
      { h: 'Insurer code', hint: 'From Insurers', w: 12, m: true }, { h: 'Product or plan name', hint: 'As on the policy', w: 30, m: true },
      { h: 'Policy type', hint: 'From list', w: 22, m: true, list: 'policyTypes' }, { h: 'UIN or product code', hint: '', w: 20 },
      { h: 'Variants', hint: 'Separated by commas', w: 22 }, { h: 'Min sum insured', hint: 'Rupees', w: 14 }, { h: 'Max sum insured', hint: 'Rupees', w: 14 },
      { h: 'Commission % first year', hint: 'Number, e.g. 15', w: 14, m: true }, { h: 'Commission % renewal', hint: 'Number', w: 14, m: true },
      { h: 'Commission % years 2 and 3', hint: 'Life only', w: 14 }, { h: 'Commission % year 4 onwards', hint: 'Life only', w: 14 },
      { h: 'Effective from', hint: 'DD/MM/YYYY', w: 14, m: true, date: true }, { h: 'Effective to', hint: 'DD/MM/YYYY or blank', w: 14, date: true },
      { h: 'Brochure available', hint: 'Yes or No', w: 12, list: 'yesNo' }, { h: 'Status', hint: 'Active or Inactive', w: 12, list: 'recordStatuses' }, { h: 'Notes', hint: 'Rate varies by slab, term or branch? Say how', w: 34 },
    ],
    example: ['BGIC', 'Bharat Health Secure (example)', 'Health', 'BGIHLIP21001V012021', 'Silver, Gold', '300000', '5000000', '15', '15', '', '', '01/04/2026', '', 'Yes', 'Active', ''],
  });

  addListsSheet(wb, listRef);

  addEntitySheet(wb, listRef, {
    name: 'Clients',
    columns: [
      { h: 'Client code', hint: 'Your reference; unique', w: 12, m: true }, { h: 'Full name', hint: '', w: 24, m: true },
      { h: 'Mobile', hint: '10 digits; unique; login number', w: 14, m: true }, { h: 'Alternate mobile', hint: '', w: 14 }, { h: 'Email', hint: '', w: 26 },
      { h: 'Date of birth', hint: 'DD/MM/YYYY', w: 14, m: true, date: true }, { h: 'Gender', hint: 'From list', w: 10, list: 'genders' }, { h: 'Marital status', hint: '', w: 12 },
      { h: 'Address line 1', hint: '', w: 28, m: true }, { h: 'Address line 2', hint: '', w: 22 }, { h: 'City', hint: '', w: 14, m: true }, { h: 'State', hint: '', w: 14, m: true }, { h: 'PIN', hint: '6 digits', w: 10, m: true },
      { h: 'Occupation', hint: 'From list', w: 18, list: 'occupations' }, { h: 'Annual income band', hint: 'From list', w: 16, list: 'incomeBands' }, { h: 'PAN', hint: '10 characters', w: 12 },
      { h: 'Client type', hint: 'From list', w: 16, m: true, list: 'clientTypes' }, { h: 'Firm name', hint: 'Businesses only', w: 24 }, { h: 'Firm GSTIN', hint: '', w: 18 },
      { h: 'Branch code', hint: 'From Branches', w: 12, m: true }, { h: 'Relationship manager', hint: 'Staff code', w: 14, m: true }, { h: 'Source', hint: 'From list', w: 18, list: 'leadSources' },
      { h: 'Client since', hint: 'DD/MM/YYYY', w: 14, date: true }, { h: 'Anniversary date', hint: 'DD/MM/YYYY', w: 14, date: true },
      { h: 'Preferred language', hint: 'From list', w: 14, list: 'languages' }, { h: 'Preferred channel', hint: 'From list', w: 14, list: 'contactChannels' }, { h: 'Notes', hint: '', w: 30 },
    ],
    example: ['C0001', 'Rajesh Kumar', '9876501234', '', 'rajesh@example.com', '15/08/1980', 'Male', 'Married', '45 Lake View Apartments', 'FC Road', 'Pune', 'Maharashtra', '411004', 'Salaried', '10 to 25 lakh', 'ABCDE1234F', 'Family head', '', '', 'BR1', 'S002', 'Reference from client', '12/06/2018', '20/11/2006', 'English', 'WhatsApp', ''],
  });

  addEntitySheet(wb, listRef, {
    name: 'Family members',
    columns: [
      { h: 'Client code', hint: 'From Clients', w: 12, m: true }, { h: 'Member name', hint: '', w: 24, m: true },
      { h: 'Relationship', hint: 'To the client; from list', w: 16, m: true, list: 'relationshipTypes' }, { h: 'Date of birth', hint: 'DD/MM/YYYY', w: 14, m: true, date: true },
      { h: 'Gender', hint: 'From list', w: 10, list: 'genders' }, { h: 'Mobile', hint: '', w: 14 }, { h: 'Email', hint: '', w: 26 },
      { h: 'Own login', hint: 'Yes or No', w: 10, list: 'yesNo' }, { h: 'Notes', hint: '', w: 30 },
    ],
    example: ['C0001', 'Sunita Kumar', 'Spouse', '02/02/1983', 'Female', '9876505678', '', 'No', ''],
  });

  addEntitySheet(wb, listRef, {
    name: 'Policies',
    columns: [
      { h: 'Policy number', hint: 'As on the policy', w: 22, m: true }, { h: 'Client code', hint: 'From Clients', w: 12, m: true },
      { h: 'Insurer code', hint: 'From Insurers', w: 12, m: true }, { h: 'Product or plan', hint: 'From Products', w: 26, m: true },
      { h: 'Policy type', hint: 'From list', w: 20, m: true, list: 'policyTypes' }, { h: 'Business type', hint: 'From list', w: 14, m: true, list: 'businessTypes' },
      { h: 'Start date', hint: 'DD/MM/YYYY', w: 14, m: true, date: true }, { h: 'End date', hint: 'DD/MM/YYYY', w: 14, m: true, date: true }, { h: 'Issue date', hint: 'DD/MM/YYYY', w: 14, date: true },
      { h: 'Policy term (years)', hint: '', w: 10 }, { h: 'Premium frequency', hint: 'From list', w: 14, m: true, list: 'premiumFrequencies' },
      { h: 'Net premium', hint: 'Rupees, without GST', w: 14, m: true }, { h: 'GST', hint: 'Rupees', w: 12 }, { h: 'Gross premium', hint: 'Rupees, as paid', w: 14, m: true },
      { h: 'Sum insured or assured', hint: 'Rupees', w: 16, m: true }, { h: 'Status', hint: 'From list', w: 16, m: true, list: 'policyStatuses' },
      { h: 'Sold by', hint: 'Staff code', w: 12, m: true }, { h: 'Serviced by', hint: 'Staff code', w: 12 }, { h: 'Branch code', hint: '', w: 12, m: true },
      { h: 'Previous policy no', hint: '', w: 20 }, { h: 'Previous insurer', hint: '', w: 20 },
      { h: 'Nominee name', hint: '', w: 20 }, { h: 'Nominee relationship', hint: 'From list', w: 16, list: 'relationshipTypes' },
      { h: 'Members covered', hint: 'Health: names and DOB, or "see Family members"', w: 30 }, { h: 'Cover type', hint: 'Health or motor cover type', w: 18 },
      { h: 'Vehicle registration no', hint: 'Motor', w: 16 }, { h: 'Vehicle make and model', hint: 'Motor', w: 22 }, { h: 'IDV', hint: 'Motor, rupees', w: 12 }, { h: 'NCB %', hint: 'Motor', w: 10 },
      { h: 'Premium paying term', hint: 'Life, years', w: 12 }, { h: 'Maturity date', hint: 'Life, DD/MM/YYYY', w: 14, date: true }, { h: 'Remarks', hint: '', w: 30 },
    ],
    example: ['BGIC/HL/2026/001234', 'C0001', 'BGIC', 'Bharat Health Secure (example)', 'Health', 'Renewal', '01/07/2026', '30/06/2027', '28/06/2026', '1', 'Annual', '18500', '3330', '21830', '1000000', 'Active', 'S002', 'S002', 'BR1', 'BGIC/HL/2025/000987', '', 'Sunita Kumar', 'Spouse', 'Rajesh Kumar 15/08/1980; Sunita Kumar 02/02/1983', 'Family floater', '', '', '', '', '', '', ''],
  });

  addEntitySheet(wb, listRef, {
    name: 'Leads',
    columns: [
      { h: 'Lead reference', hint: 'Your reference, if any', w: 12 }, { h: 'Full name', hint: '', w: 24, m: true }, { h: 'Mobile', hint: '10 digits', w: 14, m: true },
      { h: 'Email', hint: '', w: 26 }, { h: 'City or area', hint: '', w: 16 }, { h: 'Branch code', hint: '', w: 12, m: true },
      { h: 'Source', hint: 'From list', w: 20, m: true, list: 'leadSources' }, { h: 'Referred by', hint: 'Client or staff name', w: 20 },
      { h: 'Product interest', hint: 'From list', w: 20, m: true, list: 'policyTypes' }, { h: 'Preferred insurer', hint: '', w: 20 }, { h: 'Expected premium', hint: 'Rupees', w: 14 },
      { h: 'Stage', hint: 'From list', w: 16, m: true, list: 'leadStages' }, { h: 'Assigned to', hint: 'Staff code', w: 12, m: true },
      { h: 'Created date', hint: 'DD/MM/YYYY', w: 14, m: true, date: true }, { h: 'Next follow-up date', hint: 'DD/MM/YYYY', w: 14, date: true },
      { h: 'Lost reason', hint: 'From list, when Lost', w: 16, list: 'lostReasons' }, { h: 'Notes', hint: '', w: 34 },
    ],
    example: ['L0001', 'Meena Patel', '9898012345', 'meena@example.com', 'Pune', 'BR1', 'Website', '', 'Motor: private car', 'Bharat General (example)', '12000', 'Quotation sent', 'S003', '20/10/2026', '02/11/2026', '', 'Wants zero depreciation add-on'],
  });

  addEntitySheet(wb, listRef, {
    name: 'Payments and recovery',
    columns: [
      { h: 'Policy number', hint: '', w: 22, m: true }, { h: 'Client code', hint: '', w: 12, m: true },
      { h: 'Payment date', hint: 'DD/MM/YYYY', w: 14, m: true, date: true }, { h: 'Amount', hint: 'Rupees', w: 12, m: true },
      { h: 'Paid to insurer by', hint: 'From list', w: 28, m: true, list: 'paidBy' }, { h: 'Mode', hint: 'From list', w: 18, m: true, list: 'paymentModes' },
      { h: 'Reference', hint: 'Cheque, UPI or transaction ID', w: 22 }, { h: 'Capital House bank account', hint: 'Which account paid', w: 24 }, { h: 'Receipt no', hint: 'If issued', w: 16 },
      { h: 'Amount recovered so far', hint: 'Rupees', w: 14 }, { h: 'Last recovery date', hint: 'DD/MM/YYYY', w: 14, date: true }, { h: 'Outstanding', hint: 'Rupees', w: 12 },
      { h: 'Next follow-up', hint: 'DD/MM/YYYY', w: 14, date: true }, { h: 'Remarks', hint: '', w: 34 },
    ],
    example: ['BGIC/HL/2026/001234', 'C0001', '28/06/2026', '21830', 'Capital House on behalf of client', 'Net banking', 'UTR 2026062812345', 'Current account 1', 'BR1/2026-27/0042', '10000', '15/07/2026', '11830', '15/11/2026', 'Balance promised by Diwali'],
  });

  addEntitySheet(wb, listRef, {
    name: 'Notification templates',
    columns: [
      { h: 'Event', hint: 'From section 7', w: 30 }, { h: 'Audience', hint: '', w: 10 }, { h: 'Channel', hint: '', w: 14 },
      { h: 'Our draft', hint: 'Merge fields in {{ }}', w: 70 }, { h: 'Your text', hint: 'Edit here, or leave blank to accept the draft', w: 70 },
      { h: 'Approved', hint: 'Yes or No', w: 10, list: 'yesNo' }, { h: 'Language', hint: 'From list', w: 12, list: 'languages' }, { h: 'Notes', hint: '', w: 30 },
    ],
    example: ['Example: renewal reminder', 'Client', 'WhatsApp', 'Dear {{client_name}}, ...', 'Dear {{client_name}}, your policy ... (your wording)', 'Yes', 'English', 'Shorter, less formal'],
    rows: C.TEMPLATE_DRAFTS.map((r) => [...r, '', '', '', '']),
    fillCols: [4, 5, 6, 7],
  });

  addEntitySheet(wb, listRef, {
    name: 'Third-party policies',
    columns: [
      { h: 'Client code', hint: '', w: 12, m: true }, { h: 'Insurer name', hint: 'As known', w: 28, m: true }, { h: 'Policy number', hint: '', w: 22, m: true },
      { h: 'Policy type', hint: 'From list', w: 20, m: true, list: 'policyTypes' }, { h: 'Product', hint: '', w: 24 },
      { h: 'Start date', hint: 'DD/MM/YYYY', w: 14, m: true, date: true }, { h: 'End date', hint: 'DD/MM/YYYY', w: 14, m: true, date: true },
      { h: 'Premium', hint: 'Rupees', w: 12 }, { h: 'Sum insured', hint: 'Rupees', w: 14 }, { h: 'Sold through', hint: 'From list', w: 16, list: 'soldThrough' },
      { h: 'Target for renewal pitch', hint: 'Yes or No', w: 12, list: 'yesNo' }, { h: 'Remarks', hint: '', w: 34 },
    ],
    example: ['C0001', 'Other Insurer Ltd (example)', 'OTH/2025/55667', 'Motor: private car', 'Comprehensive car package', '15/03/2026', '14/03/2027', '14200', '650000', 'Online', 'Yes', 'Pitch in January'],
  });

  addEntitySheet(wb, listRef, {
    name: 'Claims',
    columns: [
      { h: 'Policy number', hint: '', w: 22, m: true }, { h: 'Client code', hint: '', w: 12, m: true }, { h: 'Claimant or member', hint: '', w: 20, m: true },
      { h: 'Claim type', hint: 'From list', w: 22, m: true, list: 'claimTypes' }, { h: 'Event date', hint: 'DD/MM/YYYY', w: 14, m: true, date: true }, { h: 'Intimation date', hint: 'DD/MM/YYYY', w: 14, m: true, date: true },
      { h: 'Insurer claim no', hint: '', w: 16 }, { h: 'TPA', hint: 'Health', w: 16 }, { h: 'Hospital or garage', hint: '', w: 24 },
      { h: 'Claimed amount', hint: 'Rupees', w: 14 }, { h: 'Approved amount', hint: 'Rupees', w: 14 }, { h: 'Settled amount', hint: 'Rupees', w: 14 }, { h: 'Settlement date', hint: 'DD/MM/YYYY', w: 14, date: true },
      { h: 'Status', hint: 'From list', w: 22, m: true, list: 'claimStatuses' }, { h: 'Handled by', hint: 'Staff code', w: 12 }, { h: 'Remarks', hint: '', w: 34 },
    ],
    example: ['BGIC/HL/2026/001234', 'C0001', 'Sunita Kumar', 'Health: cashless', '10/09/2026', '10/09/2026', 'CLM778899', 'Care TPA (example)', 'City Hospital, Pune', '85000', '80000', '80000', '25/09/2026', 'Settled', 'S004', 'Room rent deduction 5000'],
  });

  addEntitySheet(wb, listRef, {
    name: 'Investments',
    columns: [
      { h: 'Client code', hint: '', w: 12, m: true }, { h: 'Type', hint: 'From list', w: 10, m: true, list: 'investmentTypes' },
      { h: 'Provider', hint: 'Fund house, bank, NBFC or issuer', w: 26, m: true }, { h: 'Scheme or instrument', hint: '', w: 30, m: true },
      { h: 'Folio, FD number or ISIN', hint: '', w: 20 }, { h: 'Amount', hint: 'Rupees; SIP instalment, FD principal, or face value times units', w: 14, m: true },
      { h: 'Start or allotment date', hint: 'DD/MM/YYYY', w: 14, m: true, date: true }, { h: 'SIP frequency', hint: 'SIP; from list', w: 12, list: 'sipFrequencies' }, { h: 'SIP date', hint: 'Day of month', w: 10 },
      { h: 'Rate %', hint: 'FD interest or coupon', w: 10 }, { h: 'Maturity date', hint: 'DD/MM/YYYY, or Perpetual', w: 16 },
      { h: 'Payout frequency', hint: 'From list', w: 14, list: 'payoutFrequencies' }, { h: 'Status', hint: 'From list', w: 12, m: true, list: 'investmentStatuses' },
      { h: 'Advised by', hint: 'Staff code', w: 12, m: true }, { h: 'Remarks', hint: '', w: 34 },
    ],
    example: ['C0001', 'SIP', 'Bharat Mutual Fund (example)', 'Bharat Flexi Cap Fund, Growth', '1234567/89', '5000', '05/01/2026', 'Monthly', '5', '', 'Perpetual', '', 'Active', 'S002', 'Step-up 10 percent yearly'],
  });

  addEntitySheet(wb, listRef, {
    name: 'Reports',
    columns: [
      { h: '#', hint: '', w: 5 }, { h: 'Report', hint: '', w: 28 }, { h: 'Proposed filters', hint: '', w: 40 }, { h: 'Proposed columns', hint: '', w: 60 }, { h: 'Grouping', hint: '', w: 24 },
      { h: 'Keep as proposed', hint: 'Yes or No', w: 12, list: 'yesNo' }, { h: 'Changes', hint: 'Columns to add or remove, other filters', w: 44 },
      { h: 'Send by email to', hint: 'Email addresses', w: 30 }, { h: 'Frequency', hint: 'Daily, weekly, monthly, none', w: 14 },
    ],
    example: ['0', 'Example: renewals due', 'Due in 30, 60 or 90 days', 'Policy, client, expiry...', 'Month', 'No', 'Add the client\'s city', 'manager@capitalhouse.example', 'Weekly, Monday'],
    rows: C.REPORTS.map((r) => [Number(r[0]), ...r.slice(1), '', '', '', '']),
    fillCols: [5, 6, 7, 8],
  });

  addEntitySheet(wb, listRef, {
    name: 'Office phones',
    columns: [
      { h: 'Phone label', hint: 'Sticker on the phone, e.g. PH01', w: 12, m: true }, { h: 'Make and model', hint: 'One standard model', w: 24, m: true },
      { h: 'Android version', hint: '', w: 12, m: true }, { h: 'IMEI or serial', hint: '', w: 20 }, { h: 'SIM mobile number', hint: '10 digits', w: 16, m: true },
      { h: 'Assigned staff', hint: 'Staff code', w: 14, m: true }, { h: 'Branch code', hint: '', w: 12, m: true },
      { h: 'Built-in call recorder present', hint: 'Yes or No', w: 14, m: true, list: 'yesNo' }, { h: 'Records all calls automatically', hint: 'Yes or No', w: 14, list: 'yesNo' }, { h: 'Notes', hint: '', w: 30 },
    ],
    example: ['PH01', 'Samsung Galaxy A35 (example)', '14', '35xxxxxxxxxxxxx', '9800012345', 'S003', 'BR1', 'Yes', 'Yes', ''],
  });

  addHiddenLists(wb);
  return wb;
}

// ------------------------------------------------------------------ main
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const docBuf = await Packer.toBuffer(baseDoc([buildDocument()]));
  fs.writeFileSync(path.join(OUT, DOC_NAME), docBuf);
  console.log('wrote', DOC_NAME, docBuf.length, 'bytes');
  const wb = buildWorkbook();
  await wb.xlsx.writeFile(path.join(OUT, XLSX_NAME));
  console.log('wrote', XLSX_NAME, fs.statSync(path.join(OUT, XLSX_NAME)).size, 'bytes');
})().catch((e) => { console.error(e); process.exit(1); });
