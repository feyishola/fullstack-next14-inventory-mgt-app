import { loadSampleData, removeSampleData } from "@/actions/settings";
import { connectDB } from "@/lib/db";
import { requireAdmin } from "@/lib/dal";
import { Product } from "@/lib/models";
import { Card, PageHeader } from "@/components/ui";
import { SubmitButton } from "@/components/forms";
import { ConfirmButton } from "@/components/ConfirmButton";
import { WorkspaceForm } from "@/components/TeamForms";

// Server actions on this page may seed sample data, which can exceed the default limit on a cold start
export const maxDuration = 60;

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const user = await requireAdmin();
  await connectDB();
  const sampleCount = await Product.countDocuments({ workspace: user.workspaceId, sample: true });

  return (
    <>
      <PageHeader title="Settings" />
      <Card className="p-5">
        <h2 className="mb-5 font-semibold">Workspace</h2>
        <WorkspaceForm workspace={user.workspace} />
      </Card>

      <Card className="mt-6 p-5">
        <h2 className="font-semibold">Sample data</h2>
        {sampleCount > 0 ? (
          <div className="mt-1 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted">
              {sampleCount} sample products and their history are in this workspace. Products you added yourself won&apos;t be touched.
            </p>
            <ConfirmButton
              action={removeSampleData}
              label="Remove sample data"
              variant="secondary"
              size="md"
              title="Remove sample data?"
              body={`This deletes the ${sampleCount} sample products and their sales history. Anything you added yourself stays.`}
              confirmLabel="Remove sample data"
            />
          </div>
        ) : (
          <div className="mt-1 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted">Load 24 sample products with 60 days of sales to explore reports and alerts.</p>
            <form action={loadSampleData}>
              <SubmitButton variant="secondary" pendingText="Loading…">
                Load sample data
              </SubmitButton>
            </form>
          </div>
        )}
      </Card>
    </>
  );
}
