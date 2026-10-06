import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BellRing, ListChecks, Receipt, Users } from "lucide-react";
import { Logo } from "@/components/Logo";
import { DemoButton } from "@/components/AuthForms";
import { ButtonLink } from "@/components/ui";

// Server actions on this page may seed sample data, which can exceed the default limit on a cold start
export const maxDuration = 60;

const FEATURES = [
  {
    icon: ListChecks,
    title: "A to-do list for your stock",
    body: "Out of stock, running low or close to expiry: it's all in one queue, most urgent first, with the fix one click away.",
  },
  {
    icon: BellRing,
    title: "See the consequence first",
    body: "Before you record a sale, Stockroom shows the total and what will be left on the shelf. It won't let you sell what you don't have.",
  },
  {
    icon: Receipt,
    title: "Numbers that add up",
    body: "Every sale, delivery and correction is logged, so stock levels are auditable and revenue and profit come from real sales.",
  },
  {
    icon: Users,
    title: "Your team, your rules",
    body: "Staff record sales and deliveries. Admins manage the team, settings and deletions.",
  },
];

export default function Home() {
  return (
    <div className="min-h-dvh">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Logo />
        <nav className="flex items-center gap-2">
          <ButtonLink href="/login" variant="ghost">
            Sign in
          </ButtonLink>
          <ButtonLink href="/register" variant="dark">
            Get started
          </ButtonLink>
        </nav>
      </header>

      <main>
        <section className="mx-auto max-w-6xl px-6 pb-16 pt-12 text-center sm:pt-20">
          <p className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs font-medium text-muted">
            <span className="size-1.5 rounded-full bg-ok" /> Inventory for shops, pharmacies and small warehouses
          </p>
          <h1 className="mx-auto max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
            Know what to reorder before you run out.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-muted">
            Stockroom tracks stock, sales and expiry dates, and tells you what needs attention today.
          </p>
          <div className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row sm:justify-center">
            <DemoButton className="sm:w-auto" />
            <ButtonLink href="/register" size="lg" variant="primary">
              Create a free workspace <ArrowRight className="size-4" />
            </ButtonLink>
          </div>
          <p className="mt-3 text-xs text-faint">The demo is a private workspace with sample data. It deletes itself after 24 hours.</p>

          <div className="relative mx-auto mt-14 max-w-5xl">
            <div className="absolute -inset-x-10 -top-10 bottom-0 -z-10 rounded-[40px] bg-gradient-to-b from-brand-100/70 to-transparent blur-2xl" />
            <Image
              src="/screens/overview.png"
              alt="Stockroom overview: revenue, needs-attention queue and sales chart"
              width={2400}
              height={1500}
              priority
              className="rounded-2xl border border-line shadow-[var(--shadow-pop)]"
            />
          </div>
        </section>

        <section className="border-t border-line bg-surface">
          <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 sm:grid-cols-2">
            {FEATURES.map(({ icon: Icon, title, body }) => (
              <div key={title} className="flex gap-4">
                <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
                  <Icon className="size-5" />
                </div>
                <div>
                  <h2 className="font-semibold">{title}</h2>
                  <p className="mt-1 text-muted">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-ink p-10 text-white sm:flex-row sm:items-center">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Ready to stop counting shelves?</h2>
              <p className="mt-1 text-white/70">Set up in under a minute. Start with sample data or your own products.</p>
            </div>
            <ButtonLink href="/register" size="lg" variant="secondary" className="border-0">
              Create a free workspace
            </ButtonLink>
          </div>
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 text-sm text-muted">
          <span>© {new Date().getFullYear()} Stockroom</span>
          <Link href="https://github.com/feyishola/fullstack-next14-inventory-mgt-app" className="hover:text-ink">
            Source on GitHub
          </Link>
        </div>
      </footer>
    </div>
  );
}
