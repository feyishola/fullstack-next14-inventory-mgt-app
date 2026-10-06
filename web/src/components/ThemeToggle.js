"use client";

import { useEffect, useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { cx } from "./ui";

const KEY = "theme";
const OPTIONS = [
  { value: "light", label: "Light", icon: Sun },
  { value: "system", label: "System", icon: Monitor },
  { value: "dark", label: "Dark", icon: Moon },
];

// Runs in <head> before the page paints, so a saved dark theme never flashes light
export const themeScript = `try{var t=localStorage.getItem("${KEY}");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

function apply(value) {
  const root = document.documentElement;
  if (value === "system") delete root.dataset.theme;
  else root.dataset.theme = value;
  try {
    value === "system" ? localStorage.removeItem(KEY) : localStorage.setItem(KEY, value);
  } catch {
    /* storage blocked: the choice still applies for this visit */
  }
}

export function ThemeToggle({ className }) {
  // Starts as null on the server; the real value is read after mount
  const [theme, setTheme] = useState(null);
  useEffect(() => {
    let saved = null;
    try {
      saved = localStorage.getItem(KEY);
    } catch {}
    setTheme(saved === "light" || saved === "dark" ? saved : "system");
  }, []);

  return (
    <div role="radiogroup" aria-label="Theme" className={cx("inline-flex rounded-lg bg-hover p-0.5", className)}>
      {OPTIONS.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          type="button"
          role="radio"
          aria-checked={theme === value}
          aria-label={`${label} theme`}
          title={label}
          onClick={() => {
            setTheme(value);
            apply(value);
          }}
          className={cx(
            "grid size-7 place-items-center rounded-md transition-colors",
            theme === value ? "bg-surface text-ink shadow-[var(--shadow-card)]" : "text-faint hover:text-ink",
          )}
        >
          <Icon className="size-3.5" />
        </button>
      ))}
    </div>
  );
}
