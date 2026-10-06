"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { recordMovement } from "@/actions/products";
import { money, number } from "@/lib/format";
import { suggestedRestock } from "@/lib/inventory";
import { SubmitButton, FormError } from "./forms";
import { buttonClass, cx } from "./ui";
import { toast } from "./toast";

const TYPES = [
  { value: "sale", label: "Sell", verb: "Record sale" },
  { value: "restock", label: "Restock", verb: "Add stock" },
  { value: "writeoff", label: "Write off", verb: "Write off" },
];

function MovementForm({ product: fixed, products, defaultType, currency, onDone }) {
  // The toast is raised inside the action, before React re-renders, so it still
  // shows if this row disappears (e.g. a restocked item leaves the attention list)
  const [state, action] = useActionState(async (prev, formData) => {
    const result = await recordMovement(prev, formData);
    if (result?.ok) toast(result.message);
    return result;
  }, null);
  const [type, setType] = useState(defaultType);
  const [productId, setProductId] = useState(fixed?._id || "");
  const product = fixed || products?.find((p) => p._id === productId);
  const [qty, setQty] = useState(() => (defaultType === "restock" && fixed ? String(suggestedRestock(fixed)) : "1"));
  const [price, setPrice] = useState("");

  useEffect(() => {
    if (state?.ok) onDone();
  }, [state, onDone]);

  const n = Math.max(0, parseInt(qty, 10) || 0);
  const unit = price === "" ? ((type === "sale" ? product?.price : product?.cost) ?? 0) : Number(price) || 0;
  const after = product ? product.stock + (type === "restock" ? n : -n) : null;
  const short = product && type !== "restock" && n > product.stock;

  return (
    <form action={action} className="flex flex-col gap-4 p-5">
      <input type="hidden" name="type" value={type} />
      <div role="radiogroup" aria-label="Type" className="grid grid-cols-3 gap-1 rounded-lg bg-canvas p-1">
        {TYPES.map((t) => (
          <button
            key={t.value}
            type="button"
            role="radio"
            aria-checked={type === t.value}
            onClick={() => {
              setType(t.value);
              setPrice("");
              if (t.value === "restock" && product) setQty(String(suggestedRestock(product)));
            }}
            className={cx(
              "h-8 rounded-md text-sm font-medium transition",
              type === t.value ? "bg-surface text-ink shadow-sm" : "text-muted hover:text-ink",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {fixed ? (
        <input type="hidden" name="productId" value={fixed._id} />
      ) : (
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Product
          <select
            name="productId"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            required
            className="h-10 rounded-lg border border-line bg-surface px-3 text-sm font-normal focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
          >
            <option value="" disabled>
              Choose a product…
            </option>
            {products?.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name} · {p.stock} in stock
              </option>
            ))}
          </select>
        </label>
      )}

      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Quantity
          <input
            name="quantity"
            type="number"
            inputMode="numeric"
            min={1}
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            autoFocus
            aria-invalid={short || Boolean(state?.errors?.quantity)}
            className={cx(
              "h-10 rounded-lg border bg-surface px-3 text-sm font-normal tabular focus:outline-none focus:ring-2 focus:ring-brand-500/30",
              short || state?.errors?.quantity ? "border-bad" : "border-line focus:border-brand-500",
            )}
          />
        </label>
        {type !== "writeoff" && (
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            {type === "sale" ? "Unit price" : "Unit cost"}
            <input
              name="unitPrice"
              type="number"
              step="any"
              min={0}
              value={price}
              placeholder={product ? String(type === "sale" ? product.price : product.cost) : ""}
              onChange={(e) => setPrice(e.target.value)}
              className="h-10 rounded-lg border border-line bg-surface px-3 text-sm font-normal tabular focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
            />
          </label>
        )}
      </div>

      {type !== "sale" && (
        <input
          name="note"
          placeholder={type === "restock" ? "Supplier or reference (optional)" : "Reason, e.g. damaged, expired (optional)"}
          className="h-10 rounded-lg border border-line bg-surface px-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
        />
      )}

      {/* Show the consequence before committing */}
      {product && (
        <div className={cx("rounded-lg px-3 py-2.5 text-sm", short ? "bg-bad-soft text-bad" : "bg-canvas text-muted")}>
          {short ? (
            product.stock === 0 ? (
              "This product is out of stock."
            ) : (
              `Only ${product.stock} in stock. Lower the quantity or restock first.`
            )
          ) : (
            <>
              {type === "sale" && n > 0 && <span className="font-medium text-ink">{money(n * unit, currency)} total. </span>}
              Leaves <span className="font-medium text-ink tabular">{number(after)}</span> in stock
              {after <= product.reorderLevel && after > 0 && (
                <span className="text-warn">, at or below the reorder level ({product.reorderLevel})</span>
              )}
              {after === 0 && <span className="text-warn">, sold out</span>}.
            </>
          )}
        </div>
      )}

      <FormError message={state?.error || state?.errors?.quantity || (state?.errors?.productId && "Choose a product")} />

      <SubmitButton
        variant={type === "writeoff" ? "danger" : "primary"}
        disabled={short || n < 1 || !product}
        pendingText="Saving…"
        className="w-full"
      >
        {TYPES.find((t) => t.value === type).verb}
      </SubmitButton>
    </form>
  );
}

export function StockDialog({ product, products, type = "sale", currency, label, variant = "secondary", size = "sm", className, icon }) {
  const ref = useRef(null);
  const [session, setSession] = useState(0);
  const open = () => {
    setSession((s) => s + 1);
    ref.current?.showModal();
  };
  const close = () => ref.current?.close();
  const title = product ? product.name : "Record stock movement";

  return (
    <>
      <button type="button" onClick={open} className={buttonClass({ variant, size, className })}>
        {icon}
        {label}
      </button>
      <dialog
        ref={ref}
        onClick={(e) => e.target === ref.current && close()}
        className="m-auto w-[min(440px,calc(100vw-2rem))] rounded-2xl border border-line bg-surface p-0 text-ink shadow-[var(--shadow-pop)] open:animate-rise"
        aria-label={title}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
          <div className="min-w-0">
            <h2 className="truncate font-semibold">{title}</h2>
            {product && <p className="text-xs text-muted tabular">{product.stock} in stock</p>}
          </div>
          <button type="button" onClick={close} aria-label="Close" className="rounded-md p-1 text-muted hover:bg-hover hover:text-ink">
            <X className="size-5" />
          </button>
        </div>
        {session > 0 && <MovementForm key={session} product={product} products={products} defaultType={type} currency={currency} onDone={close} />}
      </dialog>
    </>
  );
}
