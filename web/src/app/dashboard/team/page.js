import { changeRole, removeMember } from "@/actions/team";
import { requireAdmin } from "@/lib/dal";
import { listTeam } from "@/lib/queries";
import { shortDate } from "@/lib/format";
import { Badge, Card, PageHeader } from "@/components/ui";
import { ConfirmButton } from "@/components/ConfirmButton";
import { SubmitButton } from "@/components/forms";
import { AddMemberForm } from "@/components/TeamForms";

export const metadata = { title: "Team" };

export default async function TeamPage() {
  const user = await requireAdmin();
  const team = await listTeam(user.workspaceId);
  const admins = team.filter((m) => m.role === "admin").length;

  return (
    <>
      <PageHeader title="Team" description="Who can sign in to this workspace." />
      <Card>
        <ul className="divide-y divide-line">
          {team.map((m) => {
            const isMe = m._id === user.id;
            const lastAdmin = m.role === "admin" && admins <= 1;
            return (
              <li key={m._id} className="flex flex-wrap items-center gap-3 px-5 py-4">
                <div className="grid size-9 place-items-center rounded-full bg-canvas text-sm font-semibold text-muted">
                  {m.name
                    .split(" ")
                    .map((p) => p[0])
                    .slice(0, 2)
                    .join("")}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 font-medium">
                    {m.name}
                    {isMe && <Badge>You</Badge>}
                  </div>
                  <div className="truncate text-sm text-muted">
                    {m.email} · joined {shortDate(m.createdAt)}
                  </div>
                </div>
                <Badge tone={m.role === "admin" ? "brand" : "neutral"} className="capitalize">
                  {m.role}
                </Badge>
                <form action={changeRole}>
                  <input type="hidden" name="id" value={m._id} />
                  <input type="hidden" name="role" value={m.role === "admin" ? "staff" : "admin"} />
                  <SubmitButton variant="ghost" size="sm" disabled={lastAdmin} title={lastAdmin ? "A workspace needs at least one admin" : undefined}>
                    {m.role === "admin" ? "Make staff" : "Make admin"}
                  </SubmitButton>
                </form>
                {!isMe && (
                  <ConfirmButton
                    action={removeMember}
                    fields={{ id: m._id }}
                    label="Remove"
                    title={`Remove ${m.name}?`}
                    body="They won't be able to sign in any more. Sales and restocks they recorded stay in the activity log."
                    confirmLabel="Remove"
                    className="text-bad hover:text-bad"
                  />
                )}
              </li>
            );
          })}
        </ul>
      </Card>

      <Card className="mt-6 p-5">
        <h2 className="font-semibold">Add a team member</h2>
        <p className="mb-5 mt-1 text-sm text-muted">They&apos;ll sign in with the email and temporary password you set.</p>
        <AddMemberForm />
      </Card>
    </>
  );
}
