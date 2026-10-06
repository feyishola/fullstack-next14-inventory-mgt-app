"use client";

import { useRef } from "react";
import { SubmitButton } from "./forms";
import { buttonClass } from "./ui";

// Destructive actions name exactly what will happen before they happen
export function ConfirmButton({ action, fields = {}, label, title, body, confirmLabel = "Delete", variant = "ghost", size = "sm", className }) {
  const ref = useRef(null);
  return (
    <>
      <button type="button" onClick={() => ref.current?.showModal()} className={buttonClass({ variant, size, className })}>
        {label}
      </button>
      <dialog
        ref={ref}
        onClick={(e) => e.target === ref.current && ref.current.close()}
        className="m-auto w-[min(420px,calc(100vw-2rem))] rounded-2xl border border-line bg-surface p-6 text-ink shadow-[var(--shadow-pop)] open:animate-rise"
      >
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="mt-2 text-sm text-muted">{body}</p>
        <form action={action} className="mt-6 flex justify-end gap-2">
          {Object.entries(fields).map(([k, v]) => (
            <input key={k} type="hidden" name={k} value={v} />
          ))}
          <button type="button" onClick={() => ref.current?.close()} className={buttonClass({ variant: "secondary" })}>
            Cancel
          </button>
          <SubmitButton variant="danger" pendingText="Deleting…">
            {confirmLabel}
          </SubmitButton>
        </form>
      </dialog>
    </>
  );
}
