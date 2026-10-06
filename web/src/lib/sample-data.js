import "server-only";
import mongoose from "mongoose";
import { Movement, Product } from "./models";

const DAYS = 60;

// [name, category, price, cost, reorderLevel, salesPerDay, shelfLifeDays, endState]
// endState shapes the final picture so the dashboard has real work to show.
const CATALOG = [
  ["Coca-Cola 50cl (pack of 12)", "Beverages", 4800, 3900, 10, 2.6, 160, "ok"],
  ["Peak Evaporated Milk 160g", "Groceries", 650, 520, 24, 5.2, 210, "expiring"],
  ["Golden Penny Spaghetti 500g", "Groceries", 1100, 860, 20, 3.4, 300, "ok"],
  ["Indomie Chicken (carton of 40)", "Groceries", 9800, 8200, 6, 1.4, 180, "low"],
  ["Milo Refill 500g", "Beverages", 3900, 3100, 8, 1.1, 240, "ok"],
  ["Malta Guinness 33cl (pack of 6)", "Beverages", 3300, 2650, 10, 1.9, 21, "expiring"],
  ["Fresh Yoghurt 1L", "Beverages", 2200, 1700, 6, 1.2, -3, "expired"],
  ["Dangote Sugar 1kg", "Groceries", 1650, 1350, 15, 2.2, 365, "ok"],
  ["Mama Gold Rice 5kg", "Groceries", 12500, 10800, 5, 0.7, 365, "low"],
  ["Dettol Antiseptic 500ml", "Personal care", 2900, 2200, 8, 0.8, 540, "ok"],
  ["Close-Up Toothpaste 140g", "Personal care", 1200, 900, 12, 1.5, 480, "out"],
  ["Nivea Body Lotion 400ml", "Personal care", 4600, 3600, 6, 0.6, 600, "ok"],
  ["Hypo Bleach 1L", "Household", 1450, 1050, 10, 0.9, 700, "ok"],
  ["Morning Fresh 750ml", "Household", 2100, 1600, 10, 1.3, 700, "ok"],
  ["Oraimo FreePods 4", "Electronics", 28500, 21000, 3, 0.25, null, "ok"],
  ["Oraimo 20,000mAh Power Bank", "Electronics", 19500, 14800, 4, 0.35, null, "low"],
  ["USB-C Fast Charger 25W", "Phones", 8500, 5600, 6, 0.6, null, "ok"],
  ["Tecno Spark 20 Screen Guard", "Phones", 2500, 900, 10, 0.9, null, "ok"],
  ["Samsung Galaxy A15 128GB", "Phones", 189000, 162000, 2, 0.08, null, "out"],
  ["HP 15 Laptop Sleeve", "Computers", 9500, 6200, 3, 0.2, null, "ok"],
  ["SanDisk 64GB Flash Drive", "Computers", 6800, 4900, 6, 0.5, null, "ok"],
  ["Binatone Electric Kettle 1.7L", "Kitchen", 16500, 12500, 3, 0.15, null, "ok"],
  ["Non-stick Frying Pan 28cm", "Kitchen", 14000, 9800, 3, 0.12, null, "low"],
  ["Ankara Tote Bag", "Clothing", 7500, 4200, 4, 0.3, null, "ok"],
];

const rand = (min, max) => min + Math.random() * (max - min);
const randInt = (min, max) => Math.floor(rand(min, max + 1));
// Poisson-ish daily demand without pulling in a stats library
const demand = (rate) => {
  let n = 0;
  let p = Math.exp(-rate);
  let s = p;
  const u = Math.random();
  while (u > s && n < 50) {
    n += 1;
    p *= rate / n;
    s += p;
  }
  return n;
};
const atDay = (daysAgo, hour = randInt(8, 20)) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hour, randInt(0, 59), randInt(0, 59), 0);
  return d;
};
const skuFor = (name, i) =>
  `${name
    .replace(/[^A-Za-z]/g, "")
    .slice(0, 3)
    .toUpperCase()}-${String(1001 + i)}`;

// Builds 60 days of believable history and inserts it for a workspace.
// Each product's ledger sums exactly to its current stock.
export async function seedSampleData(workspaceId, { user, expiresAt } = {}) {
  const ws = new mongoose.Types.ObjectId(workspaceId);
  const products = [];
  const movements = [];

  CATALOG.forEach(([name, category, price, cost, reorderLevel, rate, shelfLife, endState], i) => {
    const _id = new mongoose.Types.ObjectId();
    const sku = skuFor(name, i);
    const base = { workspace: ws, product: _id, productName: name, sku, sample: true, expiresAt, user: user?.id, userName: user?.name };

    let stock = Math.max(Math.round(rate * randInt(10, 18)) + reorderLevel, reorderLevel * 2, 4);
    movements.push({ ...base, type: "adjustment", quantity: stock, delta: stock, unitCost: cost, note: "Opening stock", at: atDay(DAYS, 8) });

    const hour = new Date().getHours();
    // Today only counts the part of the trading day (8am-8pm) that has passed
    const todayShare = Math.min(Math.max((hour - 8) / 12, 0), 1);
    for (let day = DAYS - 1; day >= 0; day--) {
      // Busier weekends for consumer goods
      const weekday = atDay(day).getDay();
      const share = day === 0 ? todayShare : 1;
      const sold = Math.min(stock, demand(rate * share * (weekday === 0 || weekday === 6 ? 1.35 : 1)));
      if (sold > 0) {
        stock -= sold;
        const at = day === 0 ? atDay(0, randInt(8, Math.max(8, hour - 1))) : atDay(day);
        movements.push({ ...base, type: "sale", quantity: sold, delta: -sold, unitPrice: price, unitCost: cost, at });
      }
      if (day === 0) break;
      if (stock <= reorderLevel && Math.random() < 0.55) {
        const qty = Math.max(reorderLevel * 3 - stock, 5);
        stock += qty;
        movements.push({
          ...base,
          type: "restock",
          quantity: qty,
          delta: qty,
          unitPrice: cost,
          unitCost: cost,
          note: "Supplier delivery",
          at: atDay(day, 9),
        });
      }
    }

    // Shape today's picture
    const drainTo = endState === "out" ? 0 : endState === "low" ? Math.max(1, reorderLevel - randInt(1, 2)) : null;
    if (endState !== "out" && endState !== "low" && stock <= reorderLevel) {
      const qty = reorderLevel * 3 - stock;
      stock += qty;
      movements.push({
        ...base,
        type: "restock",
        quantity: qty,
        delta: qty,
        unitPrice: cost,
        unitCost: cost,
        note: "Supplier delivery",
        at: atDay(1, 9),
      });
    }
    // Sell down gradually over the last few days rather than in one spike today
    for (let day = 5; drainTo !== null && stock > drainTo && day >= 1; day--) {
      const qty = day === 1 ? stock - drainTo : Math.max(1, Math.round((stock - drainTo) / day));
      stock -= qty;
      movements.push({ ...base, type: "sale", quantity: qty, delta: -qty, unitPrice: price, unitCost: cost, at: atDay(day) });
    }

    const expiryDays = endState === "expiring" ? randInt(6, 12) : shelfLife;
    // Over-ordered perishables: more on the shelf than will sell before expiry,
    // so the demo shows the "won't sell in time" warning
    if (endState === "expiring") {
      const needed = Math.ceil(rate * expiryDays * 1.6) + 10;
      if (stock < needed) {
        const qty = needed - stock;
        stock += qty;
        movements.push({ ...base, type: "restock", quantity: qty, delta: qty, unitPrice: cost, unitCost: cost, note: "Bulk delivery", at: atDay(2, 9) });
      }
    }
    products.push({
      _id,
      workspace: ws,
      name,
      sku,
      category,
      price,
      cost,
      stock,
      reorderLevel,
      expiryDate: expiryDays === null ? undefined : atDay(-expiryDays, 12),
      description: "",
      sample: true,
      expiresAt,
    });
  });

  await Product.insertMany(products);
  await Movement.insertMany(movements);
  return { products: products.length, movements: movements.length };
}

export async function clearSampleData(workspaceId) {
  const ws = new mongoose.Types.ObjectId(workspaceId);
  const [p, m] = await Promise.all([Product.deleteMany({ workspace: ws, sample: true }), Movement.deleteMany({ workspace: ws, sample: true })]);
  return { products: p.deletedCount, movements: m.deletedCount };
}
