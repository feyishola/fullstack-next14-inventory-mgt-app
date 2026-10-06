"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { Search } from "lucide-react";

// Search lives in the URL, so results can be shared and survive a refresh
export function SearchBox({ placeholder }) {
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const update = useDebouncedCallback((value) => {
    const next = new URLSearchParams(params);
    value ? next.set("q", value) : next.delete("q");
    next.delete("page");
    router.replace(`${pathname}?${next}`, { scroll: false });
  }, 250);

  return (
    <label className="relative block w-full sm:max-w-xs">
      <span className="sr-only">Search</span>
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-faint" />
      <input
        type="search"
        defaultValue={params.get("q") || ""}
        onChange={(e) => update(e.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-lg border border-line bg-surface pl-9 pr-3 text-sm placeholder:text-faint hover:border-line-strong focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
      />
    </label>
  );
}
