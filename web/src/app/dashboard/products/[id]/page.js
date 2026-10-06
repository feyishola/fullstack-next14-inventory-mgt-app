import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Pencil } from "lucide-react";
import { deleteProduct } from "@/actions/products";
import { requireUser } from "@/lib/dal";
import { getProduct, listProducts } from "@/lib/queries";
import { money, number, relativeTime, shortDate } from "@/lib/format";
import { daysUntil, stockStatus } from "@/lib/inventory";
import { ButtonLink, Card, StatusBadges } from "@/components/ui";
import { StockDialog } from "@/components/StockDialog";
import { ConfirmButton } from "@/components/ConfirmButton";
import { ProductForm } from "@/components/ProductForm";
import { MovementLabel } from "@/components/MovementLabel";

export async function generateMetadata({ params }) {
  const user = await requireUser();
  const data = await getProduct(user.workspaceId, (await params).id);
  return { title: data?.product.name || "Product" };
}

function Stat({ label, value, sub, tone }) {
  return (
    <Card className="p-4">
      <div className="text-xs text-muted">{label}</div>
      <div className={`mt-1 text-xl font-semibold tabular ${tone || ""}`}>{value}</div>
      {sub && <div className="mt-0.5 text-xs text-muted">{sub}</div>}
    </Card>
  );
}

export default async function ProductPage({ params, searchParams }) {
  const user = await requireUser();
  const { id } = await params;
  const { edit } = await searchParams;
  const data = await getProduct(user.workspaceId, id);
  if (!data) notFound();

  const { product, history, last30 } = data;
  const currency = user.workspace.currency;
  const status = stockStatus(product);
  // Runway is more useful than a raw count: "about 4 days left" tells you when to act
  const runway = last30.perDay > 0 ? Math.floor(product.stock / last30.perDay) : null;
  const margin = product.price ? ((product.price - product.cost) / product.price) * 100 : 0;
  const expiryDays = daysUntil(product.expiryDate);
  // If stock outlasts the expiry date at the current pace, say how much will be wasted
  const unsoldAtExpiry =
    expiryDays !== null && expiryDays >= 0 && product.stock > 0 ? Math.max(0, Math.round(product.stock - last30.perDay * expiryDays)) : 0;

  if (edit) {
    const { categories } = await listProducts(user.workspaceId, { page: 1 });
    return (
      <>
        <Link href={`/dashboard/products/${id}`} className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-ink">
          <ChevronLeft className="size-4" /> {product.name}
        </Link>
        <h1 className="mb-6 text-2xl font-semibold tracking-tight">Edit product</h1>
        <ProductForm product={product} categories={categories} currency={currency} />
      </>
    );
  }

  return (
    <>
      <Link href="/dashboard/products" className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-ink">
        <ChevronLeft className="size-4" /> Products
      </Link>

      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{product.name}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted">
            <span className="font-mono">{product.sku}</span>·<span>{product.category}</span>
            <StatusBadges product={product} />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <StockDialog product={product} type="sale" currency={currency} label="Sell" variant="primary" size="md" />
          <StockDialog product={product} type="restock" currency={currency} label="Restock" size="md" />
          <StockDialog product={product} type="writeoff" currency={currency} label="Write off" size="md" variant="ghost" />
          <ButtonLink href={`/dashboard/products/${id}?edit=1`} variant="ghost">
            <Pencil className="size-4" /> Edit
          </ButtonLink>
          {user.role === "admin" && (
            <ConfirmButton
              action={deleteProduct}
              fields={{ id }}
              label="Delete"
              title={`Delete ${product.name}?`}
              body="The product is removed from your catalogue. Its past sales stay in Activity so your revenue history still adds up."
              confirmLabel="Delete product"
              size="md"
              className="text-bad hover:text-bad"
            />
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat
          label="In stock"
          value={number(product.stock)}
          tone={status === "out" ? "text-bad" : status === "low" ? "text-warn" : ""}
          sub={
            runway === null
              ? "No sales in the last 30 days"
              : runway === 0
                ? "Sells out today at this pace"
                : `About ${runway} ${runway === 1 ? "day" : "days"} left at current pace`
          }
        />
        <Stat label="Sold, last 30 days" value={number(last30.units)} sub={money(last30.revenue, currency)} />
        <Stat label="Price" value={money(product.price, currency)} sub={`${margin.toFixed(0)}% margin on ${money(product.cost, currency)} cost`} />
        <Stat
          label="Expiry"
          value={product.expiryDate ? shortDate(product.expiryDate) : "None"}
          tone={expiryDays !== null && expiryDays <= 30 ? (expiryDays < 0 ? "text-bad" : "text-warn") : ""}
          sub={expiryDays === null ? "Doesn't expire" : expiryDays < 0 ? `${-expiryDays} days ago` : `In ${expiryDays} days`}
        />
      </div>

      {unsoldAtExpiry > 0 && (
        <div className="mt-6 flex flex-col gap-3 rounded-[var(--radius-card)] border border-warn/20 bg-warn-soft p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-warn">
            <span className="font-semibold">
              About {number(unsoldAtExpiry)} {unsoldAtExpiry === 1 ? "unit" : "units"} won&apos;t sell before{" "}
              {expiryDays === 0 ? "they expire today" : `they expire in ${expiryDays} days`}
            </span>{" "}
            at the current pace ({last30.perDay.toFixed(1)} a day). Consider a discount, or move them to the front of the shelf.
          </p>
          <StockDialog product={product} type="sale" currency={currency} label="Record a discounted sale" size="md" />
        </div>
      )}

      {product.description && <p className="mt-6 max-w-2xl text-sm text-muted">{product.description}</p>}

      <Card className="mt-6">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="font-semibold">History</h2>
          <span className="text-xs text-muted">Reorder level: {product.reorderLevel}</span>
        </div>
        {history.length === 0 ? (
          <p className="px-5 py-8 text-sm text-muted">No stock movements yet.</p>
        ) : (
          <ul className="divide-y divide-line">
            {history.map((m) => (
              <li key={m._id} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-5 py-3 text-sm">
                <div className="min-w-0">
                  <MovementLabel movement={m} currency={currency} showProduct={false} />
                  {m.note && <p className="mt-0.5 text-xs text-muted">{m.note}</p>}
                </div>
                <div className="text-right text-xs text-faint">
                  <div title={new Date(m.at).toLocaleString()}>{relativeTime(m.at)}</div>
                  {m.userName && <div>{m.userName}</div>}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}
