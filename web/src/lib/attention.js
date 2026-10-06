import "server-only";
import mongoose from "mongoose";
import { connectDB } from "./db";
import { Product } from "./models";
import { EXPIRY_WINDOW_DAYS } from "./inventory";

export async function attentionCount(workspaceId) {
  await connectDB();
  return Product.countDocuments({
    workspace: new mongoose.Types.ObjectId(workspaceId),
    $or: [
      { stock: { $lte: 0 } },
      { $expr: { $lte: ["$stock", "$reorderLevel"] } },
      { expiryDate: { $lte: new Date(Date.now() + EXPIRY_WINDOW_DAYS * 864e5) } },
    ],
  });
}
