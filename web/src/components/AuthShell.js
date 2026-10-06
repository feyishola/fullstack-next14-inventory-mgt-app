import { Logo } from "./Logo";

export function AuthShell({ title, subtitle, children, footer }) {
  return (
    <main className="grid min-h-dvh lg:grid-cols-[1fr_minmax(0,560px)]">
      <div className="flex flex-col px-6 py-6 sm:px-10">
        <Logo />
        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-10">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {subtitle && <p className="mt-1.5 text-sm text-muted">{subtitle}</p>}
          <div className="mt-8">{children}</div>
          {footer && <div className="mt-6 text-center text-sm text-muted">{footer}</div>}
        </div>
      </div>
      <aside className="relative hidden overflow-hidden bg-ink p-10 text-white lg:flex lg:flex-col lg:justify-end">
        <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_1px_1px,#ffffff33_1px,transparent_0)] [background-size:22px_22px]" />
        <div className="relative">
          <p className="text-3xl font-semibold leading-tight tracking-tight">Know what to reorder before you run out.</p>
          <ul className="mt-6 space-y-3 text-white/75">
            <li>Low stock and expiring items, queued up with a one-click restock.</li>
            <li>Every sale and delivery logged, so the numbers always add up.</li>
            <li>Revenue and profit from real sales, not guesses.</li>
          </ul>
        </div>
      </aside>
    </main>
  );
}
