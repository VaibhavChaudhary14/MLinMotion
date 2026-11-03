/**
 * RFC 4180 Compliant CSV Parser
 * Handles escaped quotes, commas inside quoted fields, multiline records, and CRLF / LF line breaks.
 */

export interface ParsedCSV {
  headers: string[];
  rows: Record<string, any>[];
  totalRows: number;
}

export function parseCSV(text: string): ParsedCSV {
  const records: string[][] = [];
  let currentRecord: string[] = [];
  let currentField = '';
  let insideQuote = false;

  const len = text.length;
  for (let i = 0; i < len; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (insideQuote && nextChar === '"') {
        currentField += '"';
        i++; // Skip escaped quote
      } else {
        insideQuote = !insideQuote;
      }
    } else if (char === ',' && !insideQuote) {
      currentRecord.push(currentField);
      currentField = '';
    } else if ((char === '\r' || char === '\n') && !insideQuote) {
      if (char === '\r' && nextChar === '\n') {
        i++; // Skip \n of CRLF
      }
      currentRecord.push(currentField);
      currentField = '';
      if (currentRecord.length > 0 && !(currentRecord.length === 1 && currentRecord[0].trim() === '')) {
        records.push(currentRecord);
      }
      currentRecord = [];
    } else {
      currentField += char;
    }
  }

  // Final field/record if not terminated by newline
  if (currentField.length > 0 || currentRecord.length > 0) {
    currentRecord.push(currentField);
    if (currentRecord.length > 0 && !(currentRecord.length === 1 && currentRecord[0].trim() === '')) {
      records.push(currentRecord);
    }
  }

  if (records.length === 0) {
    return { headers: [], rows: [], totalRows: 0 };
  }

  const rawHeaders = records[0];
  const headers = rawHeaders.map((h) => h.trim().replace(/^"|"$/g, ''));
  const rows: Record<string, any>[] = [];

  for (let r = 1; r < records.length; r++) {
    const record = records[r];
    const rowObj: Record<string, any> = {};
    headers.forEach((h, idx) => {
      let val = record[idx];
      if (val === undefined) {
        rowObj[h] = '';
      } else {
        val = val.trim();
        // Convert to number if non-empty and strictly numeric
        if (val !== '' && !isNaN(Number(val)) && !isNaN(parseFloat(val))) {
          rowObj[h] = Number(val);
        } else {
          rowObj[h] = val;
        }
      }
    });
    rows.push(rowObj);
  }

  return { headers, rows, totalRows: rows.length };
}
