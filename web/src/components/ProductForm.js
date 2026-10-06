"use client";

import { useActionState, useState } from "react";
import { saveProduct } from "@/actions/products";
import { money } from "@/lib/format";
import { DEFAULT_CATEGORIES } from "@/lib/inventory";
import { FormError, Input, SubmitButton, Textarea } from "./forms";
import { Card } from "./ui";

const toDateInput = (d) => (d ? new Date(d).toISOString().slice(0, 10) : "");

export function ProductForm({ product, categories = [], currency }) {
  const [state, action] = useActionState(saveProduct, null);
  const v = state?.values || {};
  const e = state?.errors || {};
  const initial = (key, fallback = "") => v[key] ?? product?.[key] ?? fallback;

  const [price, setPrice] = useState(initial("price"));
  const [cost, setCost] = useState(initial("cost"));
  const [stock, setStock] = useState(initial("stock", product ? undefined : "0"));
  const stockChanged = product && Number(stock) !== product.stock;

  const p = Number(price);
  const c = Number(cost);
  const margin = p > 0 && cost !== "" ? ((p - c) / p) * 100 : null;
  const allCategories = [...new Set([...categories, ...DEFAULT_CATEGORIES])];

  return (
    <form action={action} className="grid gap-6 lg:grid-cols-[1fr_320px]">
      {product && <input type="hidden" name="id" value={product._id} />}
      <div className="flex flex-col gap-6">
        <Card className="grid gap-4 p-5 sm:grid-cols-2">
          <h2 className="font-semibold sm:col-span-2">Details</h2>
          <Input
            label="Name"
            name="name"
            defaultValue={initial("name")}
            error={e.name}
            required
            autoFocus={!product}
            className="sm:col-span-2"
            placeholder="e.g. Milo Refill 500g"
          />
          <Input
            label="SKU"
            name="sku"
            defaultValue={initial("sku")}
            error={e.sku}
            optional
            hint="Leave blank and we'll generate one."
            className="[&_input]:font-mono"
          />
          <Input label="Category" name="category" defaultValue={initial("category")} list="categories" optional placeholder="e.g. Beverages" />
          <datalist id="categories">
            {allCategories.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
          <Textarea label="Description" name="description" defaultValue={initial("description")} rows={3} optional className="sm:col-span-2" />
        </Card>

        <Card className="grid gap-4 p-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <h2 className="font-semibold">Pricing</h2>
          </div>
          <Input
            label="Selling price"
            name="price"
            type="number"
            step="any"
            min={0}
            value={price}
            onChange={(ev) => setPrice(ev.target.value)}
            error={e.price}
            required
            className="tabular"
          />
          <Input
            label="Cost price"
            name="cost"
            type="number"
            step="any"
            min={0}
            value={cost}
            onChange={(ev) => setCost(ev.target.value)}
            error={e.cost}
            optional
            hint="What you pay your supplier."
            className="tabular"
          />
          {margin !== null && (
            <p className={`text-sm sm:col-span-2 ${margin < 0 ? "text-bad" : "text-muted"}`}>
              {margin < 0 ? "You'd lose " : "You make "}
              <span className="font-medium text-ink tabular">{money(Math.abs(p - c), currency)}</span> per unit,{" "}
              <span className="font-medium text-ink tabular">{margin.toFixed(0)}%</span> margin.
            </p>
          )}
        </Card>
      </div>

      <div className="flex flex-col gap-6">
        <Card className="flex flex-col gap-4 p-5">
          <h2 className="font-semibold">Stock</h2>
          <Input
            label={product ? "Units in stock" : "Opening stock"}
            name="stock"
            type="number"
            min={0}
            value={stock ?? ""}
            onChange={(ev) => setStock(ev.target.value)}
            error={e.stock}
            required
            className="tabular"
          />
          {stockChanged && (
            <Input
              label="Why is the count changing?"
              name="reason"
              placeholder="e.g. Shelf count, damaged units"
              hint="Saved to the activity log. For sales and deliveries, use Sell or Restock instead."
            />
          )}
          <Input
            label="Reorder level"
            name="reorderLevel"
            type="number"
            min={0}
            defaultValue={initial("reorderLevel", 5)}
            error={e.reorderLevel}
            hint="We'll flag it as low stock at this level."
            className="tabular"
          />
          <Input
            label="Expiry date"
            name="expiryDate"
            type="date"
            defaultValue={v.expiryDate ?? toDateInput(product?.expiryDate)}
            error={e.expiryDate}
            optional
            hint="We'll warn you 30 days before."
          />
        </Card>
        <FormError message={state?.error} />
        <SubmitButton size="lg" pendingText="Saving…" className="w-full">
          {product ? "Save changes" : "Add product"}
        </SubmitButton>
      </div>
    </form>
  );
}
