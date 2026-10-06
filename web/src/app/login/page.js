import Link from "next/link";
import { AuthShell } from "@/components/AuthShell";
import { DemoButton, LoginForm } from "@/components/AuthForms";

// Server actions on this page may seed sample data, which can exceed the default limit on a cold start
export const maxDuration = 60;

export const metadata = { title: "Sign in" };

const NOTICES = {
  expired: "Your session ended. Demo workspaces delete themselves after 24 hours. Sign in, or start a fresh demo.",
};

export default async function LoginPage({ searchParams }) {
  const { next, reason, demo } = await searchParams;
  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to your workspace."
      footer={
        <>
          New to Stockroom?{" "}
          <Link href="/register" className="font-medium text-brand-600 hover:underline">
            Create a workspace
          </Link>
        </>
      }
    >
      <LoginForm next={next} notice={demo === "busy" ? "The demo is busy right now. Please try again in a few minutes." : NOTICES[reason]} />
      <div className="my-6 flex items-center gap-3 text-xs text-faint">
        <span className="h-px flex-1 bg-line" />
        or
        <span className="h-px flex-1 bg-line" />
      </div>
      <DemoButton />
    </AuthShell>
  );
}
