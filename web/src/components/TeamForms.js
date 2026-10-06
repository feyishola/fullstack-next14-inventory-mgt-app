"use client";

import { useActionState, useEffect, useRef } from "react";
import { addMember } from "@/actions/team";
import { updateWorkspace } from "@/actions/settings";
import { CURRENCIES } from "@/lib/format";
import { FormError, Input, Select, SubmitButton } from "./forms";

export function AddMemberForm() {
  const [state, action] = useActionState(addMember, null);
  const ref = useRef(null);
  useEffect(() => {
    if (state?.ok) ref.current?.reset();
  }, [state]);
  const e = state?.errors || {};
  const v = state?.ok ? {} : state?.values || {};
  return (
    <form ref={ref} action={action} className="grid gap-4 sm:grid-cols-2">
      <Input label="Name" name="name" defaultValue={v.name} error={e.name} required />
      <Input label="Email" name="email" type="email" defaultValue={v.email} error={e.email} required />
      <Input
        label="Temporary password"
        name="password"
        type="text"
        defaultValue={v.password}
        error={e.password}
        hint="Share it with them. 8+ characters with a number."
        required
        autoComplete="off"
      />
      <Select label="Role" name="role" defaultValue={v.role || "staff"}>
        <option value="staff">Staff: sell, restock, edit products</option>
        <option value="admin">Admin: everything, including team and settings</option>
      </Select>
      <div className="flex items-center gap-3 sm:col-span-2">
        <SubmitButton pendingText="Adding…">Add to team</SubmitButton>
        {state?.ok && (
          <span role="status" className="text-sm text-ok animate-rise">
            {state.message}
          </span>
        )}
      </div>
      <FormError message={state?.error} />
    </form>
  );
}

export function WorkspaceForm({ workspace }) {
  const [state, action] = useActionState(updateWorkspace, null);
  return (
    <form action={action} className="grid gap-4 sm:grid-cols-2">
      <Input label="Workspace name" name="name" defaultValue={workspace.name} error={state?.errors?.name} required />
      <Select label="Currency" name="currency" defaultValue={workspace.currency} hint="Used for all prices and reports.">
        {CURRENCIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </Select>
      <div className="flex items-center gap-3 sm:col-span-2">
        <SubmitButton pendingText="Saving…">Save</SubmitButton>
        {state?.ok && (
          <span key={state.at} role="status" className="text-sm text-ok animate-rise">
            {state.message}
          </span>
        )}
      </div>
      <FormError message={state?.error} />
    </form>
  );
}
