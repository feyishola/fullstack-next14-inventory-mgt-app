"use server";

import mongoose from "mongoose";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db";
import { Movement, Product } from "@/lib/models";
import { actionUser } from "@/lib/dal";
import { makeSku } from "@/lib/inventory";
import { ttl } from "@/lib/ttl";
import { fieldErrors, movementSchema, productSchema, formValues } from "@/lib/validation";

const refresh = () => revalidatePath("/dashboard", "layout");

const logMovement = (user, product, fields) =>
  Movement.create({
    workspace: user.workspaceId,
    product: product._id,
    productName: product.name,
    sku: product.sku,
    unitCost: product.cost,
    user: user.id,
    userName: user.name,
    ...ttl(user),
    ...fields,
  });

// Create (no id) or update a product
export async function saveProduct(_prev, formData) {
  const { user, error } = await actionUser();
  if (error) return { error };

  const values = formValues(formData);
  const parsed = productSchema.safeParse(values);
  if (!parsed.success) return { errors: fieldErrors(parsed.error), values };

  const data = { ...parsed.data, sku: parsed.data.sku || makeSku(parsed.data.name), category: parsed.data.category || "General" };
  if (!data.expiryDate) data.expiryDate = undefined;
  await connectDB();

  let product;
  try {
    if (values.id) {
      const existing = await Product.findOne({ _id: values.id, workspace: user.workspaceId });
      if (!existing) return { error: "That product no longer exists." };
      const delta = data.stock - existing.stock;
      Object.assign(existing, data);
      if (!data.expiryDate) existing.expiryDate = undefined;
      product = await existing.save();
      // Editing the count directly is still recorded, so stock stays auditable
      if (delta !== 0) {
        await logMovement(user, product, {
          type: "adjustment",
          quantity: Math.abs(delta),
          delta,
          note: values.reason?.trim() || "Stock count corrected",
        });
      }
    } else {
      product = await Product.create({ ...data, workspace: user.workspaceId, ...ttl(user) });
      if (product.stock > 0) {
        await logMovement(user, product, { type: "adjustment", quantity: product.stock, delta: product.stock, note: "Opening stock" });
      }
    }
  } catch (err) {
    if (err.code === 11000) return { errors: { sku: "Another product already uses this SKU" }, values };
    throw err;
  }

  refresh();
  redirect(`/dashboard/products/${product._id}?saved=1`);
}

export async function deleteProduct(formData) {
  const { user, error } = await actionUser({ admin: true });
  if (error) return { error };
  const id = formData.get("id");
  if (!mongoose.isValidObjectId(id)) return { error: "Unknown product" };
  await connectDB();
  // Movements are kept (with name snapshots) so past sales still add up
  await Product.deleteOne({ _id: id, workspace: user.workspaceId });
  refresh();
  redirect("/dashboard/products?deleted=1");
}

// Sell, restock or write off stock from anywhere in the app
export async function recordMovement(_prev, formData) {
  const { user, error } = await actionUser();
  if (error) return { error };

  const parsed = movementSchema.safeParse(formValues(formData));
  if (!parsed.success) return { errors: fieldErrors(parsed.error) };
  const { productId, type, quantity, unitPrice, note } = parsed.data;
  const delta = type === "restock" ? quantity : -quantity;

  await connectDB();
  // Atomic: a sale or write-off only applies if there's enough stock right now,
  // so two people can't sell the last unit at the same time
  const guard = delta < 0 ? { stock: { $gte: quantity } } : {};
  const product = await Product.findOneAndUpdate(
    { _id: productId, workspace: user.workspaceId, ...guard },
    { $inc: { stock: delta } },
    { returnDocument: "after" },
  );

  if (!product) {
    const current = await Product.findOne({ _id: productId, workspace: user.workspaceId }, { stock: 1 }).lean();
    if (!current) return { error: "That product no longer exists." };
    return { errors: { quantity: current.stock ? `Only ${current.stock} in stock` : "Out of stock" } };
  }

  await logMovement(user, product, {
    type,
    quantity,
    delta,
    unitPrice: type === "sale" ? (unitPrice ?? product.price) : (unitPrice ?? product.cost),
    note,
  });

  refresh();
  const verb = { sale: "Sold", restock: "Restocked", writeoff: "Wrote off" }[type];
  return { ok: true, at: Date.now(), message: `${verb} ${quantity} × ${product.name}. ${product.stock} now in stock.`, stock: product.stock };
}
