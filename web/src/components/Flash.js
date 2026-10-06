"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "./toast";

const MESSAGES = {
  saved: ["Product saved.", "ok"],
  deleted: ["Product deleted. Its sales history is kept in Activity.", "ok"],
  denied: ["That page is for admins only.", "info"],
};

// One-shot confirmations passed through the URL after a redirect (?saved=1),
// shown as a toast and then removed from the address bar
export function Flash() {
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const key = Object.keys(MESSAGES).find((k) => params.has(k));
    if (!key) return;
    toast(...MESSAGES[key]);
    const next = new URLSearchParams(params);
    next.delete(key);
    router.replace(next.size ? `${pathname}?${next}` : pathname, { scroll: false });
  }, [params, pathname, router]);

  return null;
}
