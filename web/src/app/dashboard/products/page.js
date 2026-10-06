import Link from "next/link";
import { Suspense } from "react";
import { Package, Plus } from "lucide-react";
import { requireUser } from "@/lib/dal";
import { listProducts, PAGE_SIZE } from "@/lib/queries";
import { money, number } from "@/lib/format";
import { stockStatus, suggestedRestock } from "@/lib/inventory";
import { ButtonLink, Card, EmptyState, PageHeader, StatusBadges, cx } from "@/components/ui";
import { SearchBox } from "@/components/SearchBox";
import { ParamSelect } from "@/components/ParamSelect";
import { Pagination } from "@/components/Pagination";
import { StockDialog } from "@/components/StockDialog";

export const metadata = { title: "Products" };

const STATUSES = [
  ["", "All"],
  ["low", "Low stock"],
  ["out", "Out of stock"],
  ["expiring", "Expiring"],
];

function StockCell({ product }) {
  const status = stockStatus(product);
  // Bar fills relative to a comfortable level (3× reorder) so "low" reads visually
  const full = Math.max(product.reorderLevel * 3, 1);
  const pct = Math.min(100, (product.stock / full) * 100);
  return (
    <div className="w-24">
      <div className="text-sm font-medium tabular">{number(product.stock)}</div>
      <div className="mt-1 h-1 rounded-full bg-canvas">
        <div
          className={cx("h-full rounded-full", status === "ok" ? "bg-ok" : status === "low" ? "bg-warn" : "bg-bad")}
          style={{ width: `${Math.max(pct, status === "out" ? 0 : 4)}%` }}
        />
      </div>
    </div>
  );
}

function Actions({ product, currency }) {
  return (
    <div className="flex justify-end gap-2">
      <StockDialog product={product} type="sale" currency={currency} label="Sell" variant="secondary" />
      <StockDialog
        product={product}
        type="restock"
        currency={currency}
        label="Restock"
        variant={stockStatus(product) === "ok" ? "ghost" : "primary"}
      />
    </div>
  );
}

export default async function ProductsPage({ searchParams }) {
  const user = await requireUser();
  const params = await searchParams;
  const { q = "", category = "", status = "", sort = "name", page = 1 } = params;
  const data = await listProducts(user.workspaceId, { q, category, status, sort, page });
  const currency = user.workspace.currency;
  const filtered = q || category || status;
  const statusHref = (value) => {
    const next = new URLSearchParams(params);
    value ? next.set("status", value) : next.delete("status");
    next.delete("page");
    return `?${next}`;
  };

  return (
    <>
      <PageHeader
        title="Products"
        description="Everything you stock, with live quantities."
        actions={
          <ButtonLink href="/dashboard/products/new">
            <Plus className="size-4" /> Add product
          </ButtonLink>
        }
      />

      <Card>
        <div className="flex flex-col gap-3 border-b border-line p-4 xl:flex-row xl:items-center xl:justify-between">
          <Suspense>
            <SearchBox placeholder="Search by name or SKU" />
          </Suspense>
          <div className="flex flex-wrap items-center gap-2">
            <nav className="flex gap-1 rounded-lg bg-canvas p-1" aria-label="Filter by status">
              {STATUSES.map(([value, label]) => (
                <Link
                  key={value}
                  href={statusHref(value)}
                  aria-current={status === value ? "true" : undefined}
                  className={cx(
                    "rounded-md px-3 py-1.5 text-sm font-medium",
                    status === value ? "bg-surface text-ink shadow-sm" : "text-muted hover:text-ink",
                  )}
                >
                  {label}
                </Link>
              ))}
            </nav>
            <Suspense>
              <ParamSelect name="category" label="Category" options={[["", "All categories"], ...data.categories.map((c) => [c, c])]} />
              <ParamSelect
                name="sort"
                label="Sort"
                options={[
                  ["", "Sort: Name"],
                  ["stock", "Sort: Lowest stock"],
                  ["value", "Sort: Highest price"],
                  ["updated", "Sort: Recently updated"],
                ]}
              />
            </Suspense>
          </div>
        </div>

        {data.items.length === 0 ? (
          filtered ? (
            <EmptyState
              title="No products match"
              action={
                <ButtonLink href="/dashboard/products" variant="secondary">
                  Clear filters
                </ButtonLink>
              }
            >
              Try a different search or filter.
            </EmptyState>
          ) : (
            <EmptyState
              icon={<Package className="size-5" />}
              title="No products yet"
              action={<ButtonLink href="/dashboard/products/new">Add your first product</ButtonLink>}
            >
              Products you add will show here with live stock levels.
            </EmptyState>
          )
        ) : (
          <>
            {/* Table on larger screens */}
            <table className="hidden w-full text-sm md:table">
              <thead className="text-left text-xs font-medium uppercase tracking-wide text-faint">
                <tr className="border-b border-line">
                  <th className="px-4 py-3 font-medium">Product</th>
                  <th className="px-4 py-3 font-medium">Price</th>
                  <th className="px-4 py-3 font-medium">Stock</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {data.items.map((p) => (
                  <tr key={p._id} className="group hover:bg-canvas/60">
                    <td className="px-4 py-3">
                      <Link href={`/dashboard/products/${p._id}`} className="font-medium hover:underline">
                        {p.name}
                      </Link>
                      <div className="mt-0.5 text-xs text-muted">
                        <span className="font-mono">{p.sku}</span> · {p.category}
                      </div>
                    </td>
                    <td className="px-4 py-3 tabular">{money(p.price, currency)}</td>
                    <td className="px-4 py-3">
                      <StockCell product={p} />
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadges product={p} />
                    </td>
                    <td className="px-4 py-3">
                      <Actions product={p} currency={currency} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Cards on phones */}
            <ul className="divide-y divide-line md:hidden">
              {data.items.map((p) => (
                <li key={p._id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link href={`/dashboard/products/${p._id}`} className="font-medium hover:underline">
                        {p.name}
                      </Link>
                      <div className="mt-0.5 text-xs text-muted">
                        {money(p.price, currency)} · <span className="tabular">{p.stock}</span> in stock
                      </div>
                    </div>
                    <StatusBadges product={p} />
                  </div>
                  <div className="mt-3">
                    <Actions product={p} currency={currency} />
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
        <Pagination page={data.page} pages={data.pages} total={data.total} pageSize={PAGE_SIZE} params={params} noun="products" />
      </Card>
    </>
  );
}
