import Link from "next/link";
import { expiryStatus, stockStatus, daysUntil } from "@/lib/inventory";

export const cx = (...c) => c.filter(Boolean).join(" ");

const BUTTON = {
  base: "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap",
  size: { sm: "h-8 px-3 text-sm", md: "h-10 px-4 text-sm", lg: "h-12 px-6 text-base" },
  variant: {
    primary: "bg-brand-600 text-white hover:bg-brand-700 shadow-sm",
    secondary: "bg-surface text-ink border border-line hover:border-line-strong hover:bg-canvas",
    ghost: "text-muted hover:text-ink hover:bg-black/5",
    danger: "bg-bad text-white hover:bg-bad/90",
    dark: "bg-ink text-white hover:bg-ink/85",
  },
};

export function buttonClass({ variant = "primary", size = "md", className } = {}) {
  return cx(BUTTON.base, BUTTON.size[size], BUTTON.variant[variant], className);
}

export function ButtonLink({ href, variant, size, className, children, ...props }) {
  return (
    <Link href={href} className={buttonClass({ variant, size, className })} {...props}>
      {children}
    </Link>
  );
}

export function Card({ className, children, ...props }) {
  return (
    <div className={cx("rounded-[var(--radius-card)] border border-line bg-surface shadow-[var(--shadow-card)]", className)} {...props}>
      {children}
    </div>
  );
}

export function PageHeader({ title, description, actions }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

const TONES = {
  ok: "bg-ok-soft text-ok",
  warn: "bg-warn-soft text-warn",
  bad: "bg-bad-soft text-bad",
  neutral: "bg-black/5 text-muted",
  brand: "bg-brand-50 text-brand-700",
};

export function Badge({ tone = "neutral", children, className }) {
  return (
    <span className={cx("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap", TONES[tone], className)}>
      {children}
    </span>
  );
}

// The one place stock/expiry state is turned into words and colour
export function StatusBadges({ product }) {
  const stock = stockStatus(product);
  const expiry = expiryStatus(product);
  const days = daysUntil(product.expiryDate);
  return (
    <span className="inline-flex flex-wrap gap-1">
      {stock === "out" && <Badge tone="bad">Out of stock</Badge>}
      {stock === "low" && <Badge tone="warn">Low stock</Badge>}
      {stock === "ok" && <Badge tone="ok">In stock</Badge>}
      {expiry === "expired" && <Badge tone="bad">Expired</Badge>}
      {expiry === "expiring" && <Badge tone="warn">Expires in {days}d</Badge>}
    </span>
  );
}

export function EmptyState({ icon, title, children, action }) {
  return (
    <div className="flex flex-col items-center px-6 py-14 text-center">
      {icon && <div className="mb-4 grid size-12 place-items-center rounded-full bg-brand-50 text-brand-600">{icon}</div>}
      <h3 className="font-semibold">{title}</h3>
      {children && <p className="mt-1 max-w-sm text-sm text-muted">{children}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
