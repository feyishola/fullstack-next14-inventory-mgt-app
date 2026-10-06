import { ButtonLink } from "@/components/ui";

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center px-6 text-center">
      <div>
        <p className="font-mono text-sm text-faint">404</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">We couldn&apos;t find that</h1>
        <p className="mt-2 text-muted">It may have been deleted, or the link is out of date.</p>
        <div className="mt-6 flex justify-center gap-2">
          <ButtonLink href="/dashboard">Go to dashboard</ButtonLink>
          <ButtonLink href="/" variant="secondary">
            Home
          </ButtonLink>
        </div>
      </div>
    </main>
  );
}
