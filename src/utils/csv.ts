import { todayISO } from "./date";

export interface ParsedCsvRow {
  date: string;
  description: string;
  amount: number;
}

// Parses a bank-statement CSV. Expected columns per line: date, description,
// amount (negative = expense). Handles ";" or "," delimiters, ISO or dd/mm/yyyy
// dates, and pt-BR decimal formatting.
export function parseStatementCsv(text: string): ParsedCsvRow[] {
  const lines = text.trim().split(/\r?\n/);
  const firstLine = lines[0];
  if (!firstLine) return [];

  const delim = firstLine.includes(";") ? ";" : ",";
  const hasHeader = /data|date|descri|amount|valor/.test(firstLine.toLowerCase());
  const rows: ParsedCsvRow[] = [];

  for (let i = hasHeader ? 1 : 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;
    const cols = line.split(delim).map((c) => c.trim().replace(/^"|"$/g, ""));
    if (cols.length < 2) continue;

    const [rawDate = "", rawDescription = "", rawAmount = ""] = cols;
    const amount = parseBrNumber(rawAmount);
    if (Number.isNaN(amount)) continue;

    rows.push({
      date: normalizeDate(rawDate),
      description: rawDescription || "Importado",
      amount,
    });
  }
  return rows;
}

function normalizeDate(value: string): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const m = value.match(/(\d{2})\/(\d{2})\/(\d{4})/);
  if (m) return `${m[3]}-${m[2]}-${m[1]}`;
  return todayISO();
}

function parseBrNumber(value: string): number {
  return parseFloat((value || "0").replace(/\./g, "").replace(",", "."));
}
