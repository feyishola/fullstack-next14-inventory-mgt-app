import Link from "next/link";
import { AuthShell } from "@/components/AuthShell";
import { SignupForm } from "@/components/AuthForms";

// Server actions on this page may seed sample data, which can exceed the default limit on a cold start
export const maxDuration = 60;

export const metadata = { title: "Create your workspace" };

export default function RegisterPage() {
  return (
    <AuthShell
      title="Create your workspace"
      subtitle="Free, and ready in a few seconds."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-brand-600 hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <SignupForm />
    </AuthShell>
  );
}
