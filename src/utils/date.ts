export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function monthKey(dateISO: string): string {
  return dateISO.slice(0, 7);
}

export function currentMonthKey(): string {
  return todayISO().slice(0, 7);
}

function parseMonthKey(mk: string): { year: number; month: number } {
  const [year, month] = mk.split("-").map(Number);
  return { year: year ?? 1970, month: month ?? 1 };
}

export function daysInMonth(mk: string): number {
  const { year, month } = parseMonthKey(mk);
  return new Date(year, month, 0).getDate();
}

export function endOfMonthISO(mk: string): string {
  return `${mk}-${String(daysInMonth(mk)).padStart(2, "0")}`;
}

// Fraction of the month elapsed (0..1), used to compare spending against pace.
export function monthPace(mk: string): number {
  const today = new Date(todayISO());
  const day = mk === currentMonthKey() ? today.getDate() : daysInMonth(mk);
  return day / daysInMonth(mk);
}

export function formatDateBR(dateISO: string): string {
  return dateISO.split("-").reverse().join("/");
}

export function addMonths(dateISO: string, months: number): string {
  const d = new Date(dateISO);
  d.setMonth(d.getMonth() + months);
  return d.toISOString().slice(0, 10);
}

export function shortMonthLabel(mk: string): string {
  const { year, month } = parseMonthKey(mk);
  return new Date(year, month - 1, 1).toLocaleDateString("pt-BR", { month: "short" });
}
