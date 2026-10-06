// Stock status rules shared by the server queries and the UI
export const EXPIRY_WINDOW_DAYS = 30;

export function daysUntil(date) {
  if (!date) return null;
  return Math.ceil((new Date(date).getTime() - Date.now()) / 864e5);
}

export function stockStatus(product) {
  if (product.stock <= 0) return "out";
  if (product.stock <= product.reorderLevel) return "low";
  return "ok";
}

export function expiryStatus(product) {
  const days = daysUntil(product.expiryDate);
  if (days === null) return null;
  if (days < 0) return "expired";
  if (days <= EXPIRY_WINDOW_DAYS) return "expiring";
  return null;
}

// Enough to get comfortably above the reorder level again
export function suggestedRestock(product) {
  const target = Math.max(product.reorderLevel * 3, 10);
  return Math.max(target - product.stock, 1);
}

export function makeSku(name) {
  const letters = name
    .toUpperCase()
    .replace(/[^A-Z0-9 ]/g, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 3)
    .map((w) => w.slice(0, 3))
    .join("-");
  return `${letters || "ITEM"}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

export const DEFAULT_CATEGORIES = [
  "Beverages",
  "Groceries",
  "Personal care",
  "Household",
  "Electronics",
  "Phones",
  "Computers",
  "Kitchen",
  "Clothing",
  "Toys",
];
