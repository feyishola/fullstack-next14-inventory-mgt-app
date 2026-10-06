"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Activity, LayoutDashboard, Menu, Package, Settings, Users, X } from "lucide-react";
import { cx } from "./ui";

const LINKS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/products", label: "Products", icon: Package },
  { href: "/dashboard/activity", label: "Activity", icon: Activity },
  { href: "/dashboard/team", label: "Team", icon: Users, admin: true },
  { href: "/dashboard/settings", label: "Settings", icon: Settings, admin: true },
];

function Links({ role, attention, onNavigate }) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-0.5">
      {LINKS.filter((l) => !l.admin || role === "admin").map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cx(
              "flex h-9 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors",
              active ? "bg-surface text-ink shadow-[var(--shadow-card)] ring-1 ring-line" : "text-muted hover:bg-hover hover:text-ink",
            )}
          >
            <Icon className="size-4" />
            {label}
            {href === "/dashboard" && attention > 0 && (
              <span
                className="ml-auto rounded-full bg-warn-soft px-1.5 text-xs font-semibold text-warn tabular"
                title={`${attention} items need attention`}
              >
                {attention}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}

export function SideNav(props) {
  return <Links {...props} />;
}

export function MobileNav({ children, ...props }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="lg:hidden">
      <button type="button" onClick={() => setOpen(true)} aria-label="Open menu" className="rounded-md p-2 text-muted hover:bg-hover">
        <Menu className="size-5" />
      </button>
      {open && (
        <div className="fixed inset-0 z-40 bg-hover0" onClick={() => setOpen(false)}>
          <div className="flex h-full w-72 flex-col bg-canvas p-4 shadow-[var(--shadow-pop)] animate-rise" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex justify-end">
              <button type="button" onClick={() => setOpen(false)} aria-label="Close menu" className="rounded-md p-2 text-muted hover:bg-hover">
                <X className="size-5" />
              </button>
            </div>
            <div className="flex-1">
              <Links {...props} onNavigate={() => setOpen(false)} />
            </div>
            {children}
          </div>
        </div>
      )}
    </div>
  );
}
