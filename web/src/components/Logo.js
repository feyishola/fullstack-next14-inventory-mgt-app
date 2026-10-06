import Link from "next/link";

export function LogoMark({ className = "size-7" }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <rect width="32" height="32" rx="8" fill="#17171a" />
      <path d="M8 12.5 16 8l8 4.5v7L16 24l-8-4.5z" fill="none" stroke="#fff" strokeWidth="2" strokeLinejoin="round" />
      <path d="M8 12.5 16 17l8-4.5M16 17v7" fill="none" stroke="#7c7ff7" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

export function Logo({ href = "/" }) {
  return (
    <Link href={href} className="inline-flex items-center gap-2 font-semibold tracking-tight">
      <LogoMark />
      Stockroom
    </Link>
  );
}
