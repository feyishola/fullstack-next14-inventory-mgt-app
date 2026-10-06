"use client";

import { buttonClass } from "@/components/ui";

export default function AppError({ reset }) {
  return (
    <main className="grid min-h-dvh place-items-center px-6 text-center">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Something went wrong</h1>
        <p className="mt-2 text-muted">We couldn&apos;t reach the database. This is usually temporary, so please try again in a moment.</p>
        <button type="button" onClick={reset} className={buttonClass({ className: "mt-6" })}>
          Try again
        </button>
      </div>
    </main>
  );
}
