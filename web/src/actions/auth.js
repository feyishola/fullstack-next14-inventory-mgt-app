"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db";
import { User, Workspace } from "@/lib/models";
import { createSession, deleteSession } from "@/lib/session";
import { seedSampleData } from "@/lib/sample-data";
import { fieldErrors, loginSchema, signupSchema } from "@/lib/validation";

// Compared against when the email doesn't exist, so response time doesn't
// reveal which emails have accounts
const DUMMY_HASH = "$2b$10$CwTycUXWue0Thq9StjUM0uJ8.7dDW7z5mH0cHw2f1n8L1Q8mXq9cW";
const DEMO_TTL_HOURS = 24;
const DEMO_LIMIT_PER_HOUR = 60;

const safeNext = (next) => (typeof next === "string" && next.startsWith("/dashboard") ? next : "/dashboard");

export async function signup(_prev, formData) {
  const values = Object.fromEntries(formData);
  const parsed = signupSchema.safeParse(values);
  if (!parsed.success) return { errors: fieldErrors(parsed.error), values };

  const { workspace: workspaceName, name, email, password, sample } = parsed.data;
  await connectDB();
  if (await User.exists({ email })) {
    return { errors: { email: "That email already has an account. Sign in instead?" }, values };
  }

  const workspace = await Workspace.create({ name: workspaceName });
  const user = await User.create({
    workspace: workspace._id,
    name,
    email,
    passwordHash: await bcrypt.hash(password, 10),
    role: "admin",
  });
  if (sample) await seedSampleData(workspace._id, { user: { id: user._id, name } });

  await createSession({ userId: String(user._id), workspaceId: String(workspace._id), role: "admin" });
  redirect(`/dashboard?welcome=${sample ? "sample" : "empty"}`);
}

export async function login(_prev, formData) {
  const values = Object.fromEntries(formData);
  const parsed = loginSchema.safeParse(values);
  if (!parsed.success) return { errors: fieldErrors(parsed.error), values: { email: values.email } };

  await connectDB();
  const user = await User.findOne({ email: parsed.data.email }).select("+passwordHash");
  const ok = await bcrypt.compare(parsed.data.password, user?.passwordHash || DUMMY_HASH);
  if (!user || !ok) {
    return { error: "That email and password don't match.", values: { email: values.email } };
  }

  await createSession({ userId: String(user._id), workspaceId: String(user.workspace), role: user.role });
  redirect(safeNext(values.next));
}

export async function logout() {
  await deleteSession();
  redirect("/");
}

// A private, pre-filled workspace that deletes itself after 24 hours, so anyone
// can try every feature without an account or affecting anyone else.
export async function startDemo() {
  await connectDB();
  const recent = await Workspace.countDocuments({ isDemo: true, createdAt: { $gte: new Date(Date.now() - 36e5) } });
  if (recent >= DEMO_LIMIT_PER_HOUR) redirect("/login?demo=busy");

  const expiresAt = new Date(Date.now() + DEMO_TTL_HOURS * 36e5);
  const workspace = await Workspace.create({ name: "Corner Mart (demo)", isDemo: true, expiresAt });
  const tag = Math.random().toString(36).slice(2, 10);
  const user = await User.create({
    workspace: workspace._id,
    name: "Demo Admin",
    email: `demo-${tag}@demo.stockroom.app`,
    passwordHash: await bcrypt.hash(crypto.randomUUID(), 10),
    role: "admin",
    expiresAt,
  });
  await seedSampleData(workspace._id, { user: { id: user._id, name: user.name }, expiresAt });

  await createSession({ userId: String(user._id), workspaceId: String(workspace._id), role: "admin" }, { expires: expiresAt });
  redirect("/dashboard?welcome=demo");
}
