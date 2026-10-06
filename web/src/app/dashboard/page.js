import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, CheckCircle2, PackagePlus, Sparkles } from "lucide-react";
import { loadSampleData } from "@/actions/settings";
import { requireUser } from "@/lib/dal";
import { getDashboard, productOptions } from "@/lib/queries";
import { change, money, number, relativeTime } from "@/lib/format";
import { daysUntil, expiryStatus, stockStatus, suggestedRestock } from "@/lib/inventory";
import { Badge, ButtonLink, Card, EmptyState, StatusBadges } from "@/components/ui";
import { SubmitButton } from "@/components/forms";
import { StockDialog } from "@/components/StockDialog";
import { RevenueChart } from "@/components/RevenueChart";
import { MovementLabel } from "@/components/MovementLabel";

export const metadata = { title: "Overview" };

const WELCOME = {
  sample: {
    title: "Welcome to your workspace",
    body: "We've added 24 sample products and 60 days of sales so you can see how everything works. Remove them from Settings whenever you're ready.",
  },
  demo: {
    title: "This is your private demo",
    body: "Everything works, from selling and restocking to editing and adding your team. Nobody else sees your changes, and it all disappears in 24 hours.",
  },
  empty: { title: "Welcome to Stockroom", body: "Add your first product to get started." },
};

function Kpi({ label, value, sub, delta }) {
  const up = delta > 0;
  return (
    <Card className="p-5">
      <div className="text-sm text-muted">{label}</div>
      <div className="mt-2 text-2xl font-semibold tracking-tight tabular">{value}</div>
      <div className="mt-1 flex items-center gap-1.5 text-xs text-muted">
        {delta !== null && delta !== undefined && Number.isFinite(delta) && (
          <span className={`inline-flex items-center font-medium tabular ${up ? "text-ok" : "text-bad"}`}>
            {up ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
            {Math.abs(delta).toFixed(0)}%
          </span>
        )}
        {sub}
      </div>
    </Card>
  );
}

// Most urgent first: nothing to sell > can't sell > about to run out > about to expire
const severity = (p) => (stockStatus(p) === "out" ? 0 : expiryStatus(p) === "expired" ? 1 : stockStatus(p) === "low" ? 2 : 3);

function AttentionRow({ product, currency }) {
  const expired = expiryStatus(product) === "expired";
  const reason =
    stockStatus(product) === "out"
      ? "Customers can't buy this right now"
      : expired
        ? `Expired ${Math.abs(daysUntil(product.expiryDate))} days ago, ${product.stock} units on the shelf`
        : stockStatus(product) === "low"
          ? `${product.stock} left, reorder level is ${product.reorderLevel}`
          : `${product.stock} units expire in ${daysUntil(product.expiryDate)} days`;
  return (
    <li className="flex items-center gap-3 py-3">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <Link href={`/dashboard/products/${product._id}`} className="truncate font-medium hover:underline">
            {product.name}
          </Link>
          <StatusBadges product={product} />
        </div>
        <p className="mt-0.5 text-sm text-muted">{reason}</p>
      </div>
      {expired ? (
        <StockDialog product={product} type="writeoff" currency={currency} label="Write off" />
      ) : stockStatus(product) === "ok" ? (
        <StockDialog product={product} type="sale" currency={currency} label="Sell" />
      ) : (
        <StockDialog product={product} type="restock" currency={currency} label={`Restock ${suggestedRestock(product)}`} variant="primary" />
      )}
    </li>
  );
}

export default async function OverviewPage({ searchParams }) {
  const user = await requireUser();
  const { welcome } = await searchParams;
  const [data, options] = await Promise.all([getDashboard(user.workspaceId), productOptions(user.workspaceId)]);
  const currency = user.workspace.currency;
  const greeting = WELCOME[welcome];

  if (!data.productCount) {
    return (
      <>
        <h1 className="mb-6 text-2xl font-semibold tracking-tight">Overview</h1>
        <Card>
          <EmptyState
            icon={<PackagePlus className="size-5" />}
            title="Your stockroom is empty"
            action={
              <div className="flex flex-wrap justify-center gap-2">
                <ButtonLink href="/dashboard/products/new">Add your first product</ButtonLink>
                {user.role === "admin" && (
                  <form action={loadSampleData}>
                    <SubmitButton variant="secondary" pendingText="Loading…">
                      <Sparkles className="size-4" /> Explore with sample data
                    </SubmitButton>
                  </form>
                )}
              </div>
            }
          >
            Add products to start tracking stock and sales, or load sample data to see what Stockroom does with a few weeks of trading.
          </EmptyState>
        </Card>
      </>
    );
  }

  const { current, previous } = data;
  const attention = [...data.attention].sort((a, b) => severity(a) - severity(b));
  const margin = current.revenue ? (current.profit / current.revenue) * 100 : 0;

  return (
    <>
      {greeting && (
        <div className="mb-6 rounded-[var(--radius-card)] border border-brand-100 bg-brand-50 p-5 animate-rise">
          <h2 className="font-semibold text-brand-700">{greeting.title}</h2>
          <p className="mt-1 text-sm text-brand-700/80">{greeting.body}</p>
        </div>
      )}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
          <p className="mt-1 text-sm text-muted">Last 30 days, compared with the 30 days before.</p>
        </div>
        <StockDialog products={options} type="sale" currency={currency} label="Record a sale" variant="primary" size="md" />
      </div>

      {/* On phones the things to act on come first; on desktop KPIs lead */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.25fr_1fr] [&>*]:min-w-0">
        <div className="order-2 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:order-1 xl:col-span-2 xl:grid-cols-4">
          <Kpi
            label="Revenue"
            value={money(current.revenue, currency)}
            delta={change(current.revenue, previous.revenue)}
            sub={previous.revenue ? "vs previous 30 days" : "No earlier sales to compare"}
          />
          <Kpi
            label="Gross profit"
            value={money(current.profit, currency)}
            delta={change(current.profit, previous.profit)}
            sub={`${margin.toFixed(0)}% margin`}
          />
          <Kpi
            label="Units sold"
            value={number(current.units)}
            delta={change(current.units, previous.units)}
            sub={`across ${number(current.orders)} sales`}
          />
          <Kpi
            label="Stock on hand"
            value={money(data.stock.atCost, currency)}
            sub={`at cost · ${money(data.stock.atRetail, currency, { compact: true })} at retail`}
          />
        </div>

        <Card className="order-1 p-5 xl:order-2">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Needs attention</h2>
            {attention.length > 0 && <Badge tone="warn">{attention.length}</Badge>}
          </div>
          {attention.length === 0 ? (
            <div className="flex items-center gap-3 py-8 text-sm text-muted">
              <CheckCircle2 className="size-5 text-ok" />
              Everything is stocked and in date. Nice.
            </div>
          ) : (
            <>
              <ul className="divide-y divide-line">
                {attention.slice(0, 6).map((p) => (
                  <AttentionRow key={p._id} product={p} currency={currency} />
                ))}
              </ul>
              {attention.length > 6 && (
                <Link href="/dashboard/products?status=low" className="mt-2 inline-block text-sm font-medium text-brand-600 hover:underline">
                  See all {attention.length}
                </Link>
              )}
            </>
          )}
        </Card>

        <Card className="order-3 p-5">
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="font-semibold">Revenue</h2>
            <span className="text-sm text-muted tabular">{money(current.revenue, currency)}</span>
          </div>
          <RevenueChart data={data.series} currency={currency} />
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2 [&>*]:min-w-0">
        <Card className="p-5">
          <h2 className="mb-3 font-semibold">Top sellers</h2>
          {data.top.length === 0 ? (
            <p className="py-6 text-sm text-muted">No sales in the last 30 days yet.</p>
          ) : (
            <ol className="space-y-3">
              {data.top.map((t, i) => {
                const share = (t.revenue / data.top[0].revenue) * 100;
                return (
                  <li key={t._id}>
                    <div className="flex justify-between gap-3 text-sm">
                      <Link href={`/dashboard/products/${t._id}`} className="truncate hover:underline">
                        <span className="mr-2 text-faint tabular">{i + 1}</span>
                        {t.name}
                      </Link>
                      <span className="shrink-0 font-medium tabular">{money(t.revenue, currency)}</span>
                    </div>
                    <div className="mt-1.5 h-1.5 rounded-full bg-canvas">
                      <div className="h-full rounded-full bg-brand-500" style={{ width: `${share}%` }} />
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </Card>

        <Card className="p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold">Recent activity</h2>
            <Link href="/dashboard/activity" className="text-sm font-medium text-brand-600 hover:underline">
              View all
            </Link>
          </div>
          <ul className="divide-y divide-line">
            {data.recent.map((m) => (
              <li key={m._id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                <div className="min-w-0">
                  <MovementLabel movement={m} currency={currency} />
                </div>
                <span className="shrink-0 text-xs text-faint">{relativeTime(m.at)}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}
