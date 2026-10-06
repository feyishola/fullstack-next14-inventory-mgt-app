"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models";
import { actionUser } from "@/lib/dal";
import { ttl } from "@/lib/ttl";
import { fieldErrors, memberSchema, formValues } from "@/lib/validation";

export async function addMember(_prev, formData) {
  const { user, error } = await actionUser({ admin: true });
  if (error) return { error };
  const values = formValues(formData);
  const parsed = memberSchema.safeParse(values);
  if (!parsed.success) return { errors: fieldErrors(parsed.error), values };

  await connectDB();
  const { name, email, password, role } = parsed.data;
  if (await User.exists({ email })) return { errors: { email: "That email already has an account" }, values };
  await User.create({ workspace: user.workspaceId, name, email, role, passwordHash: await bcrypt.hash(password, 10), ...ttl(user) });
  revalidatePath("/dashboard/team");
  return { ok: true, at: Date.now(), message: `${name} can now sign in with ${email}.` };
}

export async function changeRole(formData) {
  const { user, error } = await actionUser({ admin: true });
  if (error) return;
  const id = formData.get("id");
  const role = formData.get("role") === "admin" ? "admin" : "staff";
  await connectDB();
  if (role === "staff") {
    const admins = await User.countDocuments({ workspace: user.workspaceId, role: "admin" });
    if (admins <= 1) return; // never leave a workspace without an admin
  }
  await User.updateOne({ _id: id, workspace: user.workspaceId }, { role });
  revalidatePath("/dashboard/team");
}

export async function removeMember(formData) {
  const { user, error } = await actionUser({ admin: true });
  if (error) return;
  const id = formData.get("id");
  if (id === user.id) return; // can't remove yourself
  await connectDB();
  await User.deleteOne({ _id: id, workspace: user.workspaceId });
  revalidatePath("/dashboard/team");
}
