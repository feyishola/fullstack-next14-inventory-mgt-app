import Link from "next/link";
import { requireUser } from "@/lib/dal";
import { listMovements, productOptions } from "@/lib/queries";
import { money, relativeTime } from "@/lib/format";
import { Card, EmptyState, PageHeader, cx } from "@/components/ui";
import { Pagination } from "@/components/Pagination";
import { StockDialog } from "@/components/StockDialog";
import { MovementLabel } from "@/components/MovementLabel";

export const metadata = { title: "Activity" };

const TYPES = [
  ["", "All"],
  ["sale", "Sales"],
  ["restock", "Restocks"],
  ["writeoff", "Write-offs"],
  ["adjustment", "Corrections"],
];

export default async function ActivityPage({ searchParams }) {
  const user = await requireUser();
  const params = await searchParams;
  const [data, options] = await Promise.all([listMovements(user.workspaceId, params), productOptions(user.workspaceId)]);
  const currency = user.workspace.currency;
  const href = (type) => (type ? `?type=${type}` : "?");

  return (
    <>
      <PageHeader
        title="Activity"
        description="Every sale, delivery and correction, newest first."
        actions={
          <>
            <StockDialog products={options} type="restock" currency={currency} label="Record delivery" size="md" />
            <StockDialog products={options} type="sale" currency={currency} label="Record sale" variant="primary" size="md" />
          </>
        }
      />
      <Card>
        <nav className="flex gap-1 border-b border-line p-3" aria-label="Filter by type">
          {TYPES.map(([value, label]) => (
            <Link
              key={value}
              href={href(value)}
              aria-current={(params.type || "") === value ? "true" : undefined}
              className={cx(
                "rounded-md px-3 py-1.5 text-sm font-medium",
                (params.type || "") === value ? "bg-canvas text-ink" : "text-muted hover:text-ink",
              )}
            >
              {label}
            </Link>
          ))}
        </nav>
        {data.items.length === 0 ? (
          <EmptyState title="Nothing here yet">Sales, restocks and adjustments will appear here as they happen.</EmptyState>
        ) : (
          <ul className="divide-y divide-line">
            {data.items.map((m) => (
              <li key={m._id} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-5 py-3 text-sm">
                <div className="min-w-0">
                  <MovementLabel movement={m} currency={currency} />
                  {m.note && <p className="mt-0.5 text-xs text-muted">{m.note}</p>}
                </div>
                <div className="text-right text-xs text-faint">
                  <div title={new Date(m.at).toLocaleString()}>{relativeTime(m.at)}</div>
                  <div>
                    {m.userName}
                    {m.type === "restock" && m.unitPrice > 0 && ` · cost ${money(m.quantity * m.unitPrice, currency)}`}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
        <Pagination page={data.page} pages={data.pages} total={data.total} pageSize={20} params={params} noun="entries" />
      </Card>
    </>
  );
}
