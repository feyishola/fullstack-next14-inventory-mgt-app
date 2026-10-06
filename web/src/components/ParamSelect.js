"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function ParamSelect({ name, options, label }) {
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  return (
    <label className="flex items-center gap-2 text-sm text-muted">
      <span className="sr-only">{label}</span>
      <select
        value={params.get(name) || ""}
        onChange={(e) => {
          const next = new URLSearchParams(params);
          e.target.value ? next.set(name, e.target.value) : next.delete(name);
          next.delete("page");
          router.replace(`${pathname}?${next}`, { scroll: false });
        }}
        className="h-10 rounded-lg border border-line bg-surface px-3 text-sm text-ink hover:border-line-strong focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
      >
        {options.map(([value, text]) => (
          <option key={value} value={value}>
            {text}
          </option>
        ))}
      </select>
    </label>
  );
}
