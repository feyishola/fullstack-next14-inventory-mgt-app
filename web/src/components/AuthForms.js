"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { Eye, EyeOff, Sparkles } from "lucide-react";
import { login, signup, startDemo } from "@/actions/auth";
import { FormError, Input, SubmitButton } from "./forms";

function PasswordInput({ error, hint, label = "Password", autoComplete }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Input
        label={label}
        name="password"
        type={show ? "text" : "password"}
        error={error}
        hint={hint}
        required
        autoComplete={autoComplete}
        className="[&_input]:pr-10"
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        aria-label={show ? "Hide password" : "Show password"}
        className="absolute right-2 top-[30px] rounded-md p-1.5 text-faint hover:text-ink"
      >
        {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  );
}

export function DemoButton({ className = "" }) {
  return (
    <form action={startDemo} className={className}>
      <SubmitButton variant="secondary" size="lg" pendingText="Setting up your demo…" className="w-full">
        <Sparkles className="size-4 text-brand-600" />
        Try the live demo, no sign-up
      </SubmitButton>
    </form>
  );
}

export function LoginForm({ next, notice }) {
  const [state, action] = useActionState(login, null);
  return (
    <form action={action} className="flex flex-col gap-4">
      {next && <input type="hidden" name="next" value={next} />}
      {notice && !state && <div className="rounded-lg bg-brand-50 px-3 py-2.5 text-sm text-brand-700">{notice}</div>}
      <Input
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        defaultValue={state?.values?.email}
        error={state?.errors?.email}
        required
        autoFocus
      />
      <PasswordInput error={state?.errors?.password} autoComplete="current-password" />
      <FormError message={state?.error} />
      <SubmitButton size="lg" pendingText="Signing in…" className="w-full">
        Sign in
      </SubmitButton>
    </form>
  );
}

export function SignupForm() {
  const [state, action] = useActionState(signup, null);
  const v = state?.values || {};
  const e = state?.errors || {};
  return (
    <form action={action} className="flex flex-col gap-4">
      <Input
        label="Business name"
        name="workspace"
        placeholder="e.g. Ada's Corner Mart"
        defaultValue={v.workspace}
        error={e.workspace}
        required
        autoFocus
      />
      <Input label="Your name" name="name" autoComplete="name" defaultValue={v.name} error={e.name} required />
      <Input
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        defaultValue={v.email}
        error={
          e.email && e.email.includes("already") ? (
            <>
              {e.email.replace(" Sign in instead?", "")}{" "}
              <Link href="/login" className="font-medium underline">
                Sign in instead
              </Link>
            </>
          ) : (
            e.email
          )
        }
        required
      />
      <PasswordInput error={e.password} hint="At least 8 characters, including a number." autoComplete="new-password" />
      <label className="flex items-start gap-3 rounded-lg border border-line bg-canvas p-3 text-sm">
        <input
          type="checkbox"
          name="sample"
          value="on"
          defaultChecked={state ? v.sample === "on" : true}
          className="mt-0.5 size-4 accent-brand-600"
        />
        <span>
          <span className="font-medium">Start with sample data</span>
          <span className="block text-muted">
            24 products and 60 days of sales, so you can see everything working. Remove it from Settings anytime.
          </span>
        </span>
      </label>
      <SubmitButton size="lg" pendingText="Creating your workspace…" className="w-full">
        Create workspace
      </SubmitButton>
    </form>
  );
}
