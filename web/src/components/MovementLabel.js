import Link from "next/link";
import { money } from "@/lib/format";
import { Badge } from "./ui";

const TYPE = {
  sale: { label: "Sale", tone: "brand" },
  restock: { label: "Restock", tone: "ok" },
  adjustment: { label: "Adjustment", tone: "neutral" },
  writeoff: { label: "Write-off", tone: "bad" },
};

export function MovementLabel({ movement: m, currency, showProduct = true }) {
  const t = TYPE[m.type];
  return (
    <div className="flex min-w-0 items-center gap-2">
      <Badge tone={t.tone}>{t.label}</Badge>
      <span className="truncate">
        <span className={`font-medium tabular ${m.delta < 0 ? "" : "text-ok"}`}>
          {m.delta > 0 ? "+" : "−"}
          {m.quantity}
        </span>
        {showProduct && (
          <>
            {" "}
            <Link href={`/dashboard/products/${m.product}`} className="hover:underline">
              {m.productName}
            </Link>
          </>
        )}
        {m.type === "sale" && <span className="text-muted"> · {money(m.quantity * m.unitPrice, currency)}</span>}
      </span>
    </div>
  );
}
