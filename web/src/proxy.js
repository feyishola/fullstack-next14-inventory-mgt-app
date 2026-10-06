import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

// Optimistic check only: real authorisation happens in src/lib/dal.js on every
// page and server action. This just avoids rendering protected pages for
// visitors with no valid session cookie.
async function hasSession(req) {
  const token = req.cookies.get("session")?.value;
  if (!token) return false;
  try {
    await jwtVerify(token, new TextEncoder().encode(process.env.AUTH_SECRET), { algorithms: ["HS256"] });
    return true;
  } catch {
    return false;
  }
}

export default async function proxy(req) {
  const { pathname, search } = req.nextUrl;
  const signedIn = await hasSession(req);

  if (pathname.startsWith("/dashboard") && !signedIn) {
    const url = new URL("/login", req.nextUrl);
    url.searchParams.set("next", pathname + search);
    return NextResponse.redirect(url);
  }
  if ((pathname === "/login" || pathname === "/register") && signedIn) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
