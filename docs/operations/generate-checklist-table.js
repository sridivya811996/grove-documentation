const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, 'app-store-launch-checklist.csv');
const outPath = path.join(__dirname, 'app-store-checklist-table.mdx');

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        cell += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && next === '\n') {
        i += 1;
      }
      row.push(cell);
      cell = '';
      if (row.length > 1 || row[0] !== '') {
        rows.push(row);
      }
      row = [];
      continue;
    }

    if (char === ',' && !inQuotes) {
      row.push(cell);
      cell = '';
      continue;
    }

    cell += char;
  }

  if (cell.length > 0 || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }

  return rows;
}

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const csv = fs.readFileSync(csvPath, 'utf8');
const rows = parseCsv(csv);
const header = rows.shift();

const tableRows = rows
  .filter((row) => row.length && row.some((cell) => cell.trim() !== ''))
  .map((row) => {
    const cells = header.map((_, idx) => {
      const raw = row[idx] ?? '';
      const withBreaks = raw.replace(/\r?\n/g, '<br />');
      return `<td>${escapeHtml(withBreaks)}</td>`;
    });
    return `    <tr>\n      ${cells.join('\n      ')}\n    </tr>`;
  })
  .join('\n');

const tableHeader = header
  .map((label) => `<th>${escapeHtml(label)}</th>`)
  .join('\n      ');

const content = `---\ntitle: App store checklist (table)\n---\n\nDownload the latest files:\n\n- [Checklist CSV](/files/app-store-launch-checklist.csv)\n- [Checklist XLSX](/files/app-store-launch-checklist.xlsx)\n- [Summary CSV](/files/app-store-launch-summary.csv)\n\n<table>\n  <thead>\n    <tr>\n      ${tableHeader}\n    </tr>\n  </thead>\n  <tbody>\n${tableRows}\n  </tbody>\n</table>\n`;

fs.writeFileSync(outPath, content, 'utf8');
console.log(`Generated ${outPath}`);
