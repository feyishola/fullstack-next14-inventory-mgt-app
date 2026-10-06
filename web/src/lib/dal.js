import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { connectDB } from "./db";
import { User, Workspace } from "./models";
import { readSession } from "./session";

// The single place pages and server actions get the signed-in user from.
// The proxy only does an optimistic cookie check; this re-verifies against the
// database on every request, so a deleted user or expired demo is locked out.
export const getCurrentUser = cache(async () => {
  const session = await readSession();
  if (!session?.userId) return null;
  await connectDB();
  const user = await User.findById(session.userId).lean();
  if (!user) return null;
  const workspace = await Workspace.findById(user.workspace).lean();
  if (!workspace) return null;
  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    role: user.role,
    workspaceId: String(workspace._id),
    workspace: {
      id: String(workspace._id),
      name: workspace.name,
      currency: workspace.currency,
      isDemo: workspace.isDemo,
      expiresAt: workspace.expiresAt?.toISOString() ?? null,
    },
  };
});

export async function requireUser() {
  const user = await getCurrentUser();
  // A stale cookie (deleted user, expired demo) is cleared by the logout route
  if (!user) redirect("/logout?reason=expired");
  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "admin") redirect("/dashboard?denied=1");
  return user;
}

// For server actions: returns an error object instead of redirecting
export async function actionUser({ admin = false } = {}) {
  const user = await getCurrentUser();
  if (!user) return { error: "Your session has ended. Please sign in again." };
  if (admin && user.role !== "admin") return { error: "Only admins can do that." };
  return { user };
}
