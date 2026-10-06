"use client";

import { useSyncExternalStore } from "react";
import { CheckCircle2, Info } from "lucide-react";

// A tiny app-wide toast store. It lives outside any component, so a message
// survives the component that triggered it unmounting (e.g. a restocked item
// leaving the "Needs attention" list).
const listeners = new Set();
let current = null;
let timer;
const emit = () => listeners.forEach((l) => l());

export function toast(text, tone = "ok") {
  current = { text, tone, id: Date.now() };
  emit();
  clearTimeout(timer);
  timer = setTimeout(() => {
    current = null;
    emit();
  }, 4500);
}

const subscribe = (l) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export function Toaster() {
  const t = useSyncExternalStore(
    subscribe,
    () => current,
    () => null,
  );
  if (!t) return null;
  const Icon = t.tone === "ok" ? CheckCircle2 : Info;
  return (
    <div
      key={t.id}
      role="status"
      className="fixed bottom-5 left-1/2 z-50 flex max-w-[calc(100vw-2rem)] -translate-x-1/2 items-center gap-2 rounded-xl bg-night px-4 py-3 ring-1 ring-white/10 text-sm text-white shadow-[var(--shadow-pop)] animate-rise"
    >
      <Icon className={t.tone === "ok" ? "size-4 shrink-0 text-emerald-400" : "size-4 shrink-0 text-sky-300"} />
      {t.text}
    </div>
  );
}
