import "server-only";
import mongoose from "mongoose";
import { connectDB } from "./db";
import { Movement, Product, User } from "./models";
import { EXPIRY_WINDOW_DAYS } from "./inventory";

export const PAGE_SIZE = 10;
const oid = (id) => new mongoose.Types.ObjectId(id);
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const daysFromNow = (n) => new Date(Date.now() + n * 864e5);

// Plain objects safe to pass to client components
const serialize = (doc) => JSON.parse(JSON.stringify(doc));

const STATUS_FILTERS = {
  out: () => ({ stock: { $lte: 0 } }),
  low: () => ({ stock: { $gt: 0 }, $expr: { $lte: ["$stock", "$reorderLevel"] } }),
  expiring: () => ({ expiryDate: { $lte: daysFromNow(EXPIRY_WINDOW_DAYS) } }),
};

const SORTS = {
  name: { name: 1 },
  stock: { stock: 1, name: 1 },
  value: { price: -1 },
  updated: { updatedAt: -1 },
};

export async function listProducts(workspaceId, { q = "", category = "", status = "", sort = "name", page = 1 } = {}) {
  await connectDB();
  const filter = { workspace: oid(workspaceId) };
  if (q) {
    const rx = new RegExp(escapeRegex(q.trim()), "i");
    filter.$or = [{ name: rx }, { sku: rx }];
  }
  if (category) filter.category = category;
  if (STATUS_FILTERS[status]) Object.assign(filter, STATUS_FILTERS[status]());

  const current = Math.max(1, Number(page) || 1);
  const [total, items, categories] = await Promise.all([
    Product.countDocuments(filter),
    Product.find(filter)
      .sort(SORTS[sort] || SORTS.name)
      .skip((current - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE)
      .lean(),
    Product.distinct("category", { workspace: oid(workspaceId) }),
  ]);
  return { total, items: serialize(items), categories: categories.sort(), page: current, pages: Math.max(1, Math.ceil(total / PAGE_SIZE)) };
}

export async function getProduct(workspaceId, id) {
  if (!mongoose.isValidObjectId(id)) return null;
  await connectDB();
  const product = await Product.findOne({ _id: id, workspace: oid(workspaceId) }).lean();
  if (!product) return null;
  const since = daysFromNow(-30);
  const [history, [stats]] = await Promise.all([
    Movement.find({ workspace: oid(workspaceId), product: product._id })
      .sort({ at: -1 })
      .limit(50)
      .lean(),
    Movement.aggregate([
      { $match: { workspace: oid(workspaceId), product: product._id, type: "sale", at: { $gte: since } } },
      { $group: { _id: null, units: { $sum: "$quantity" }, revenue: { $sum: { $multiply: ["$quantity", "$unitPrice"] } } } },
    ]),
  ]);
  const units = stats?.units || 0;
  return serialize({
    product,
    history,
    last30: { units, revenue: stats?.revenue || 0, perDay: units / 30 },
  });
}

export async function listMovements(workspaceId, { type = "", page = 1 } = {}) {
  await connectDB();
  const filter = { workspace: oid(workspaceId) };
  if (["sale", "restock", "adjustment", "writeoff"].includes(type)) filter.type = type;
  const current = Math.max(1, Number(page) || 1);
  const [total, items] = await Promise.all([
    Movement.countDocuments(filter),
    Movement.find(filter)
      .sort({ at: -1 })
      .skip((current - 1) * 20)
      .limit(20)
      .lean(),
  ]);
  return { total, items: serialize(items), page: current, pages: Math.max(1, Math.ceil(total / 20)) };
}

// Products for the "record a sale/restock" picker
export async function productOptions(workspaceId) {
  await connectDB();
  const items = await Product.find({ workspace: oid(workspaceId) }, { name: 1, sku: 1, stock: 1, price: 1, cost: 1, reorderLevel: 1 })
    .sort({ name: 1 })
    .lean();
  return serialize(items);
}

export async function getDashboard(workspaceId) {
  await connectDB();
  const ws = oid(workspaceId);
  const now = new Date();
  const start = daysFromNow(-30);
  const prevStart = daysFromNow(-60);

  const salesTotals = (from, to) =>
    Movement.aggregate([
      { $match: { workspace: ws, type: "sale", at: { $gte: from, $lt: to } } },
      {
        $group: {
          _id: null,
          revenue: { $sum: { $multiply: ["$quantity", "$unitPrice"] } },
          profit: { $sum: { $multiply: ["$quantity", { $subtract: ["$unitPrice", "$unitCost"] }] } },
          units: { $sum: "$quantity" },
          orders: { $sum: 1 },
        },
      },
    ]).then(([r]) => r || { revenue: 0, profit: 0, units: 0, orders: 0 });

  const [current, previous, daily, top, [stock], attention, recent, productCount] = await Promise.all([
    salesTotals(start, now),
    salesTotals(prevStart, start),
    Movement.aggregate([
      { $match: { workspace: ws, type: "sale", at: { $gte: start } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$at" } },
          revenue: { $sum: { $multiply: ["$quantity", "$unitPrice"] } },
          units: { $sum: "$quantity" },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    Movement.aggregate([
      { $match: { workspace: ws, type: "sale", at: { $gte: start } } },
      {
        $group: {
          _id: "$product",
          name: { $last: "$productName" },
          units: { $sum: "$quantity" },
          revenue: { $sum: { $multiply: ["$quantity", "$unitPrice"] } },
        },
      },
      { $sort: { revenue: -1 } },
      { $limit: 5 },
    ]),
    Product.aggregate([
      { $match: { workspace: ws } },
      {
        $group: {
          _id: null,
          atCost: { $sum: { $multiply: ["$stock", "$cost"] } },
          atRetail: { $sum: { $multiply: ["$stock", "$price"] } },
          units: { $sum: "$stock" },
        },
      },
    ]),
    Product.find({
      workspace: ws,
      $or: [{ stock: { $lte: 0 } }, { $expr: { $lte: ["$stock", "$reorderLevel"] } }, { expiryDate: { $lte: daysFromNow(EXPIRY_WINDOW_DAYS) } }],
    })
      .sort({ stock: 1 })
      .limit(50)
      .lean(),
    Movement.find({ workspace: ws }).sort({ at: -1 }).limit(8).lean(),
    Product.countDocuments({ workspace: ws }),
  ]);

  // Fill missing days so the chart doesn't skip quiet days
  const byDay = Object.fromEntries(daily.map((d) => [d._id, d]));
  const series = Array.from({ length: 30 }, (_, i) => {
    const d = daysFromNow(-29 + i);
    const key = d.toISOString().slice(0, 10);
    return { date: key, revenue: byDay[key]?.revenue || 0, units: byDay[key]?.units || 0 };
  });

  return serialize({
    current,
    previous,
    series,
    top,
    stock: stock || { atCost: 0, atRetail: 0, units: 0 },
    attention,
    recent,
    productCount,
  });
}

export async function listTeam(workspaceId) {
  await connectDB();
  return serialize(
    await User.find({ workspace: oid(workspaceId) })
      .sort({ role: 1, name: 1 })
      .lean(),
  );
}
