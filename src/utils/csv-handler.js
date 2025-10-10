import * as fs from 'fs';
import { parse } from 'csv-parse/sync';

export function loadTestData(filePath) {
  const csvData = fs.readFileSync(filePath, 'utf8');
  return parse(csvData, { columns: true, skip_empty_lines: true });
}

export function writeCsvHeader(filePath, headers) {
  const headerLine = headers.join(',');
  fs.writeFileSync(filePath, `${headerLine}\n`);
}

export function appendCsvRow(filePath, row) {
  const values = Object.values(row).map(val => `"${String(val).replace(/"/g, '""')}"`);
  const rowLine = values.join(',');
  fs.appendFileSync(filePath, `${rowLine}\n`);
}

export function writeCsvRows(filePath, rows) {
  const csvLines = rows.map(row => {
    const values = Object.values(row).map(val => `"${String(val).replace(/"/g, '""')}"`);
    return values.join(',');
  });
  fs.writeFileSync(filePath, csvLines.join('\n') + '\n');
}

export function appendCsvRows(filePath, rows) {
  const csvLines = rows.map(row => {
    const values = Object.values(row).map(val => `"${String(val).replace(/"/g, '""')}"`);
    return values.join(',');
  });
  fs.appendFileSync(filePath, csvLines.join('\n') + '\n');
}
