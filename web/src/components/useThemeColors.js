"use client";

import { useEffect, useState } from "react";

// Reads CSS colour tokens for libraries (like Recharts) that set SVG attributes,
// where var(--…) doesn't resolve. Re-reads when the theme changes.
export function useThemeColors(names) {
  const key = names.join(",");
  const [colors, setColors] = useState(null);

  useEffect(() => {
    const read = () => {
      const style = getComputedStyle(document.documentElement);
      setColors(Object.fromEntries(key.split(",").map((n) => [n, style.getPropertyValue(`--color-${n}`).trim()])));
    };
    read();
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    const media = matchMedia("(prefers-color-scheme: dark)");
    media.addEventListener("change", read);
    return () => {
      observer.disconnect();
      media.removeEventListener("change", read);
    };
  }, [key]);

  return colors;
}
