import "server-only";
import mongoose from "mongoose";

const { Schema, model, models } = mongoose;
const { ObjectId } = Schema.Types;

// Demo workspaces carry `expiresAt`; MongoDB's TTL monitor deletes them (and
// every document stamped with the same field) once that time passes.
const expiresAt = { type: Date, default: undefined };
const withTTL = (schema) => {
  schema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
  return schema;
};

const workspaceSchema = withTTL(
  new Schema(
    {
      name: { type: String, required: true, trim: true, maxlength: 80 },
      currency: { type: String, default: "NGN" },
      isDemo: { type: Boolean, default: false },
      expiresAt,
    },
    { timestamps: true },
  ),
);

const userSchema = withTTL(
  new Schema(
    {
      workspace: { type: ObjectId, ref: "Workspace", required: true, index: true },
      name: { type: String, required: true, trim: true, maxlength: 80 },
      email: { type: String, required: true, unique: true, lowercase: true, trim: true },
      passwordHash: { type: String, required: true, select: false },
      role: { type: String, enum: ["admin", "staff"], default: "staff" },
      expiresAt,
    },
    { timestamps: true },
  ),
);

const productSchema = withTTL(
  new Schema(
    {
      workspace: { type: ObjectId, ref: "Workspace", required: true },
      name: { type: String, required: true, trim: true, maxlength: 120 },
      sku: { type: String, required: true, trim: true, uppercase: true, maxlength: 40 },
      category: { type: String, trim: true, default: "General", maxlength: 40 },
      price: { type: Number, required: true, min: 0 },
      cost: { type: Number, default: 0, min: 0 },
      stock: { type: Number, required: true, min: 0, default: 0 },
      reorderLevel: { type: Number, min: 0, default: 5 },
      expiryDate: { type: Date },
      description: { type: String, trim: true, maxlength: 1000, default: "" },
      sample: { type: Boolean, default: false },
      expiresAt,
    },
    { timestamps: true },
  ),
);
productSchema.index({ workspace: 1, sku: 1 }, { unique: true });
productSchema.index({ workspace: 1, name: 1 });

// Every change to stock is recorded here, so stock levels are auditable and the
// dashboard can report real revenue and profit.
const movementSchema = withTTL(
  new Schema({
    workspace: { type: ObjectId, ref: "Workspace", required: true },
    product: { type: ObjectId, ref: "Product", required: true },
    // Snapshots keep history readable after a product is renamed or deleted
    productName: { type: String, required: true },
    sku: { type: String },
    type: { type: String, enum: ["sale", "restock", "adjustment", "writeoff"], required: true },
    quantity: { type: Number, required: true, min: 1 },
    delta: { type: Number, required: true },
    unitPrice: { type: Number, default: 0 },
    unitCost: { type: Number, default: 0 },
    note: { type: String, trim: true, maxlength: 200, default: "" },
    user: { type: ObjectId, ref: "User" },
    userName: { type: String },
    at: { type: Date, default: Date.now },
    sample: { type: Boolean, default: false },
    expiresAt,
  }),
);
movementSchema.index({ workspace: 1, at: -1 });
movementSchema.index({ workspace: 1, product: 1, at: -1 });

export const Workspace = models.Workspace || model("Workspace", workspaceSchema);
export const User = models.User || model("User", userSchema);
export const Product = models.Product || model("Product", productSchema);
export const Movement = models.Movement || model("Movement", movementSchema);
