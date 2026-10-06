"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { buttonClass, cx } from "./ui";

export function SubmitButton({ children, pendingText, variant, size, className, ...props }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={buttonClass({ variant, size, className })} {...props}>
      {pending && <Loader2 className="size-4 animate-spin" aria-hidden />}
      {pending && pendingText ? pendingText : children}
    </button>
  );
}

const inputClass = (error) =>
  cx(
    "w-full rounded-lg border bg-surface px-3 text-sm text-ink placeholder:text-faint transition-colors",
    "focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500",
    error ? "border-bad" : "border-line hover:border-line-strong",
  );

// Label, control, then hint or error. The hint and error sit outside the
// <label> and are linked with aria-describedby, so the accessible name stays
// just the label text.
export function Field({ label, name, error, hint, className, children, optional }) {
  return (
    <div className={cx("flex flex-col gap-1.5", className)}>
      <label className="text-sm font-medium" htmlFor={name}>
        {label}
        {optional && <span className="ml-1 font-normal text-faint">optional</span>}
      </label>
      {children}
      {error ? (
        <span id={`${name}-error`} className="text-xs text-bad" role="alert">
          {error}
        </span>
      ) : (
        hint && (
          <span id={`${name}-hint`} className="text-xs text-muted">
            {hint}
          </span>
        )
      )}
    </div>
  );
}

const describedBy = (name, error, hint) => (error ? `${name}-error` : hint ? `${name}-hint` : undefined);

export function Input({ label, name, error, hint, optional, className, prefix, ...props }) {
  return (
    <Field label={label} name={name} error={error} hint={hint} optional={optional} className={className}>
      <div className="relative">
        {prefix && <span className="pointer-events-none absolute inset-y-0 left-3 grid place-items-center text-sm text-faint">{prefix}</span>}
        <input
          id={name}
          name={name}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy(name, error, hint)}
          className={cx(inputClass(error), "h-10", prefix && "pl-9")}
          {...props}
        />
      </div>
    </Field>
  );
}

export function Select({ label, name, error, hint, optional, className, children, ...props }) {
  return (
    <Field label={label} name={name} error={error} hint={hint} optional={optional} className={className}>
      <select
        id={name}
        name={name}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy(name, error, hint)}
        className={cx(inputClass(error), "h-10 pr-8")}
        {...props}
      >
        {children}
      </select>
    </Field>
  );
}

export function Textarea({ label, name, error, hint, optional, className, ...props }) {
  return (
    <Field label={label} name={name} error={error} hint={hint} optional={optional} className={className}>
      <textarea
        id={name}
        name={name}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy(name, error, hint)}
        className={cx(inputClass(error), "py-2.5")}
        {...props}
      />
    </Field>
  );
}

export function FormError({ message }) {
  if (!message) return null;
  return (
    <div role="alert" className="rounded-lg border border-bad/20 bg-bad-soft px-3 py-2.5 text-sm text-bad">
      {message}
    </div>
  );
}
