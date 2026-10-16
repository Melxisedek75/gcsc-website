import fs from "node:fs";
import path from "node:path";

const root = "C:\\gcsc\\docs\\bids\\2026-SWR-031_PARTNER_REVIEW_FINAL";
const sourceDir = path.join(root, "02_prepared_bid_working_package");
const outHtml = path.join(root, "2026-SWR-031_CCB_Door_Widening_BID_SUBMISSION_SINGLE_FILE.html");

const docs = [
  "02_BID_COVER_LETTER.md",
  "03_SCOPE_AND_PRICE_PROPOSAL.md",
  "04_CONSTRUCTION_SCHEDULE_AND_WORK_PLAN.md",
  "05_QUALITY_CONTROL_PLAN.md",
  "06_SITE_SAFETY_AND_LOGISTICS_PLAN.md",
  "07_PREVAILING_WAGE_AND_COMPLIANCE_PLAN.md",
  "08_BACKGROUND_CHECK_ROSTER.md",
  "09_ACM_COMPLIANCE_STATEMENT_DRAFT.md",
  "01_SUBMISSION_CHECKLIST.md",
  "12_FINAL_SUBMISSION_INSTRUCTIONS.md",
];

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function inlineMarkdown(value) {
  return escapeHtml(value)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<span class="ref">$1</span>');
}

function renderTable(lines) {
  const rows = lines
    .filter((line) => !/^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(line))
    .map((line) => line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((cell) => cell.trim()));
  if (!rows.length) return "";
  const [head, ...body] = rows;
  return `<table><thead><tr>${head.map((cell) => `<th>${inlineMarkdown(cell)}</th>`).join("")}</tr></thead><tbody>${body
    .map((row) => `<tr>${row.map((cell) => `<td>${inlineMarkdown(cell)}</td>`).join("")}</tr>`)
    .join("")}</tbody></table>`;
}

function renderMarkdown(markdown) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const html = [];
  let paragraph = [];
  let list = [];
  let table = [];

  function flushParagraph() {
    if (paragraph.length) {
      html.push(`<p>${inlineMarkdown(paragraph.join(" "))}</p>`);
      paragraph = [];
    }
  }
  function flushList() {
    if (list.length) {
      html.push(`<ul>${list.map((item) => `<li>${inlineMarkdown(item)}</li>`).join("")}</ul>`);
      list = [];
    }
  }
  function flushTable() {
    if (table.length) {
      html.push(renderTable(table));
      table = [];
    }
  }
  function flushAll() {
    flushParagraph();
    flushList();
    flushTable();
  }

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!line.trim()) {
      flushAll();
      continue;
    }
    if (/^\|.*\|$/.test(line)) {
      flushParagraph();
      flushList();
      table.push(line);
      continue;
    }
    flushTable();
    if (line.startsWith("# ")) {
      flushAll();
      html.push(`<h1>${inlineMarkdown(line.slice(2).trim())}</h1>`);
      continue;
    }
    if (line.startsWith("## ")) {
      flushAll();
      html.push(`<h2>${inlineMarkdown(line.slice(3).trim())}</h2>`);
      continue;
    }
    if (line.startsWith("### ")) {
      flushAll();
      html.push(`<h3>${inlineMarkdown(line.slice(4).trim())}</h3>`);
      continue;
    }
    const bullet = line.match(/^[-*]\s+(.*)$/);
    if (bullet) {
      flushParagraph();
      list.push(bullet[1]);
      continue;
    }
    paragraph.push(line);
  }
  flushAll();
  return html.join("\n");
}

const sections = docs.map((fileName) => {
  const source = fs.readFileSync(path.join(sourceDir, fileName), "utf8");
  return `<section class="doc-section">${renderMarkdown(source)}</section>`;
});

const today = new Date().toLocaleDateString("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>2026-SWR-031 CCB Door Widening Bid Submission</title>
<style>
  @page { size: Letter; margin: 0.65in 0.58in; }
  * { box-sizing: border-box; }
  body {
    color: #17202a;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 10.5pt;
    line-height: 1.38;
    margin: 0;
  }
  .cover {
    min-height: 9.2in;
    display: flex;
    flex-direction: column;
    justify-content: center;
    border: 2px solid #1f4e79;
    padding: 0.55in;
    page-break-after: always;
  }
  .label {
    color: #1f4e79;
    font-size: 10pt;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  .cover h1 {
    border: 0;
    color: #111827;
    font-size: 28pt;
    margin: 0.18in 0 0.12in;
    padding: 0;
  }
  .cover .subtitle {
    color: #374151;
    font-size: 14pt;
    margin-bottom: 0.3in;
  }
  .cover-grid {
    border-collapse: collapse;
    margin-top: 0.25in;
    width: 100%;
  }
  .cover-grid td {
    border: 1px solid #d1d5db;
    padding: 0.12in;
    vertical-align: top;
  }
  .cover-grid td:first-child {
    background: #f3f6f9;
    color: #1f4e79;
    font-weight: 700;
    width: 31%;
  }
  .notice {
    background: #fff8e5;
    border-left: 4px solid #b7791f;
    margin-top: 0.28in;
    padding: 0.13in 0.16in;
  }
  h1 {
    border-bottom: 2px solid #1f4e79;
    color: #1f4e79;
    font-size: 18pt;
    margin: 0 0 0.18in;
    padding-bottom: 0.08in;
  }
  h2 {
    color: #1f4e79;
    font-size: 13.5pt;
    margin: 0.22in 0 0.08in;
  }
  h3 {
    color: #243b53;
    font-size: 11.5pt;
    margin: 0.18in 0 0.06in;
  }
  p { margin: 0 0 0.09in; }
  ul { margin: 0.03in 0 0.12in 0.2in; padding-left: 0.16in; }
  li { margin: 0.025in 0; }
  table {
    border-collapse: collapse;
    margin: 0.1in 0 0.16in;
    page-break-inside: avoid;
    width: 100%;
  }
  th {
    background: #1f4e79;
    border: 1px solid #1f4e79;
    color: white;
    font-size: 9pt;
    padding: 0.065in;
    text-align: left;
  }
  td {
    border: 1px solid #d8dee6;
    font-size: 9pt;
    padding: 0.06in;
    vertical-align: top;
  }
  tr:nth-child(even) td { background: #f8fafc; }
  code {
    background: #eef2f7;
    border: 1px solid #d8dee6;
    border-radius: 3px;
    font-family: Consolas, monospace;
    font-size: 9pt;
    padding: 1px 3px;
  }
  .doc-section {
    page-break-before: always;
  }
  .doc-section:first-of-type {
    page-break-before: auto;
  }
  .toc {
    page-break-after: always;
  }
  .signature {
    margin-top: 0.28in;
    page-break-inside: avoid;
  }
  .footer-note {
    border-top: 1px solid #d1d5db;
    color: #4b5563;
    font-size: 9pt;
    margin-top: 0.24in;
    padding-top: 0.08in;
  }
</style>
</head>
<body>
  <div class="cover">
    <div class="label">Bid Submission Package</div>
    <h1>CCB First Floor Door Widening</h1>
    <div class="subtitle">Pierce County Solicitation 2026-SWR-031</div>
    <table class="cover-grid">
      <tr><td>Project Location</td><td>County-City Building, 930 Tacoma Ave S, Tacoma, WA 98402</td></tr>
      <tr><td>Owner</td><td>Pierce County</td></tr>
      <tr><td>Project / Contract</td><td>Project No. 24-00013 / Contract No. SC-2026-SWR-031</td></tr>
      <tr><td>Bid Due</td><td>May 20, 2026 at 1:00 PM</td></tr>
      <tr><td>Prepared By</td><td>[Company Legal Name] / KNB LLC - to be confirmed before submission</td></tr>
      <tr><td>Prepared Date</td><td>${today}</td></tr>
      <tr><td>Bid Amount</td><td>$________________________</td></tr>
      <tr><td>Authorized Signer</td><td>________________________, ________________________</td></tr>
    </table>
    <div class="notice">
      <strong>Submission note:</strong> This single PDF is a consolidated professional bid package.
      If Pierce County/OpenGov requires official forms, bid bond, certifications, background checks,
      or addenda acknowledgments as separate required uploads, those official documents must still be completed
      exactly as required by the owner.
    </div>
  </div>
  <section class="toc">
    <h1>Table Of Contents</h1>
    <ol>
      <li>Bid Cover Letter</li>
      <li>Scope And Price Proposal</li>
      <li>Construction Schedule And Work Plan</li>
      <li>Quality Control Plan</li>
      <li>Site Safety And Logistics Plan</li>
      <li>Prevailing Wage And Compliance Plan</li>
      <li>Background Check Roster</li>
      <li>ACM Statement Of Compliance</li>
      <li>Submission Checklist</li>
      <li>Final Submission Instructions</li>
    </ol>
    <div class="footer-note">
      Original owner-issued documents reviewed for this package include the bid packet, drawings,
      technical specifications, Division 01 general requirements, background check form, hazardous material survey,
      hot work procedure, and sample ACM compliance form.
    </div>
  </section>
  ${sections.join("\n")}
</body>
</html>`;

fs.writeFileSync(outHtml, html, "utf8");
console.log(outHtml);
