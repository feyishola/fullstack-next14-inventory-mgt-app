export const CURRENCIES = ["NGN", "USD", "GBP", "EUR", "KES", "GHS", "ZAR"];

export function money(amount, currency = "NGN", { compact = false } = {}) {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol",
    notation: compact ? "compact" : "standard",
    maximumFractionDigits: compact ? 1 : amount % 1 === 0 ? 0 : 2,
  }).format(amount || 0);
}

export const number = (n) => new Intl.NumberFormat("en").format(n || 0);

export function shortDate(d) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function relativeTime(d) {
  const diff = (new Date(d).getTime() - Date.now()) / 1000;
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const steps = [
    [60, "second"],
    [60, "minute"],
    [24, "hour"],
    [7, "day"],
    [4.35, "week"],
    [12, "month"],
    [Infinity, "year"],
  ];
  let value = diff;
  for (const [size, unit] of steps) {
    if (Math.abs(value) < size) return rtf.format(Math.round(value), unit);
    value /= size;
  }
}

// "+12% vs previous 30 days", or null when there's nothing to compare with
export function change(current, previous) {
  if (!previous) return null;
  return ((current - previous) / previous) * 100;
}
