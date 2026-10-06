import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { buttonClass } from "./ui";

export function Pagination({ page, pages, total, pageSize, params, noun = "items" }) {
  if (!total) return null;
  const href = (p) => {
    const next = new URLSearchParams(params);
    p > 1 ? next.set("page", p) : next.delete("page");
    return `?${next}`;
  };
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);
  return (
    <div className="flex items-center justify-between gap-3 border-t border-line px-4 py-3 text-sm text-muted">
      <span className="tabular">
        {from}–{to} of {total} {noun}
      </span>
      {pages > 1 && (
        <div className="flex gap-2">
          {page > 1 ? (
            <Link href={href(page - 1)} className={buttonClass({ variant: "secondary", size: "sm" })} aria-label="Previous page">
              <ChevronLeft className="size-4" />
            </Link>
          ) : (
            <span className={buttonClass({ variant: "secondary", size: "sm", className: "opacity-40" })} aria-hidden>
              <ChevronLeft className="size-4" />
            </span>
          )}
          {page < pages ? (
            <Link href={href(page + 1)} className={buttonClass({ variant: "secondary", size: "sm" })} aria-label="Next page">
              <ChevronRight className="size-4" />
            </Link>
          ) : (
            <span className={buttonClass({ variant: "secondary", size: "sm", className: "opacity-40" })} aria-hidden>
              <ChevronRight className="size-4" />
            </span>
          )}
        </div>
      )}
    </div>
  );
}
