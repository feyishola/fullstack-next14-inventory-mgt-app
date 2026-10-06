import Link from "next/link";
import { Suspense } from "react";
import { Clock, LogOut } from "lucide-react";
import { logout } from "@/actions/auth";
import { Logo } from "@/components/Logo";
import { MobileNav, SideNav } from "@/components/Nav";
import { Flash } from "@/components/Flash";
import { Toaster } from "@/components/toast";
import { ThemeToggle } from "@/components/ThemeToggle";
import { requireUser } from "@/lib/dal";
import { attentionCount } from "@/lib/attention";

function DemoBanner({ expiresAt }) {
  const hours = Math.max(1, Math.round((new Date(expiresAt).getTime() - Date.now()) / 36e5));
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 bg-night px-4 py-2 text-center text-sm text-white">
      <span className="inline-flex items-center gap-1.5">
        <Clock className="size-4 text-white/60" />
        You&apos;re in a private demo workspace. It deletes itself in about {hours} {hours === 1 ? "hour" : "hours"}.
      </span>
      <Link href="/register" className="font-medium text-[#a5a7ff] hover:underline">
        Create your own workspace →
      </Link>
    </div>
  );
}

function Account({ user }) {
  return (
    <div className="flex flex-col gap-3 border-t border-line pt-4">
      <div className="flex items-center justify-between px-1">
        <span className="text-xs text-muted">Appearance</span>
        <ThemeToggle />
      </div>
      <div className="flex items-center gap-3">
        <div className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
          {user.name
            .split(" ")
            .map((p) => p[0])
            .slice(0, 2)
            .join("")}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium">{user.name}</div>
          <div className="truncate text-xs capitalize text-muted">{user.role}</div>
        </div>
        <form action={logout}>
          <button type="submit" aria-label="Sign out" title="Sign out" className="rounded-md p-2 text-muted hover:bg-hover hover:text-ink">
            <LogOut className="size-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

export default async function DashboardLayout({ children }) {
  const user = await requireUser();
  const attention = await attentionCount(user.workspaceId);
  const navProps = { role: user.role, attention };

  return (
    <div className="min-h-dvh">
      <div className="lg:grid lg:grid-cols-[248px_1fr]">
        <aside className="sticky top-0 hidden h-dvh flex-col gap-6 border-r border-line p-4 lg:flex">
          <div className="px-2 pt-1">
            <Logo href="/dashboard" />
            <div className="mt-3 truncate text-xs font-medium uppercase tracking-wide text-faint">{user.workspace.name}</div>
          </div>
          <div className="flex-1">
            <SideNav {...navProps} />
          </div>
          <Account user={user} />
        </aside>

        <div className="min-w-0">
          {user.workspace.isDemo && <DemoBanner expiresAt={user.workspace.expiresAt} />}
          <header className="flex items-center justify-between border-b border-line px-4 py-3 lg:hidden">
            <Logo href="/dashboard" />
            <MobileNav {...navProps}>
              <Account user={user} />
            </MobileNav>
          </header>
          <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
        </div>
      </div>
      <Suspense>
        <Flash />
      </Suspense>
      <Toaster />
    </div>
  );
}
