"use client";

import { buttonClass } from "@/components/ui";

export default function DashboardError({ reset }) {
  return (
    <div className="grid place-items-center py-24 text-center">
      <h1 className="text-xl font-semibold">Something went wrong loading this page</h1>
      <p className="mt-2 text-sm text-muted">It&apos;s probably a temporary connection problem. Your data is safe.</p>
      <button type="button" onClick={reset} className={buttonClass({ className: "mt-6" })}>
        Try again
      </button>
    </div>
  );
}
