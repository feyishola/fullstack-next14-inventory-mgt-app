"use server";

import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/db";
import { Product, Workspace } from "@/lib/models";
import { actionUser } from "@/lib/dal";
import { clearSampleData, seedSampleData } from "@/lib/sample-data";
import { fieldErrors, workspaceSchema } from "@/lib/validation";

export async function updateWorkspace(_prev, formData) {
  const { user, error } = await actionUser({ admin: true });
  if (error) return { error };
  const parsed = workspaceSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { errors: fieldErrors(parsed.error) };
  await connectDB();
  await Workspace.updateOne({ _id: user.workspaceId }, parsed.data);
  revalidatePath("/dashboard", "layout");
  return { ok: true, at: Date.now(), message: "Saved." };
}

export async function loadSampleData() {
  const { user, error } = await actionUser({ admin: true });
  if (error) return { error };
  await connectDB();
  if (await Product.exists({ workspace: user.workspaceId, sample: true })) return { error: "Sample data is already loaded." };
  await seedSampleData(user.workspaceId, {
    user: { id: user.id, name: user.name },
    expiresAt: user.workspace.expiresAt ? new Date(user.workspace.expiresAt) : undefined,
  });
  revalidatePath("/dashboard", "layout");
  return { ok: true };
}

export async function removeSampleData() {
  const { user, error } = await actionUser({ admin: true });
  if (error) return { error };
  await connectDB();
  const result = await clearSampleData(user.workspaceId);
  revalidatePath("/dashboard", "layout");
  return { ok: true, message: `Removed ${result.products} sample products.` };
}
