import Link from "next/link";
import { AuthShell } from "@/components/AuthShell";
import { SignupForm } from "@/components/AuthForms";

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
