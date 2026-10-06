import { NextResponse } from "next/server";

// Clears a stale session (deleted user, expired demo) and sends the person to
// sign in. Cookies can't be changed while a page renders, hence a route.
export async function GET(req) {
  const reason = req.nextUrl.searchParams.get("reason");
  const url = new URL(reason ? `/login?reason=${encodeURIComponent(reason)}` : "/login", req.nextUrl);
  const res = NextResponse.redirect(url);
  res.cookies.delete("session");
  return res;
}
