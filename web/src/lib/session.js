import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const COOKIE = "session";
const MAX_AGE_DAYS = 7;
const key = () => new TextEncoder().encode(process.env.AUTH_SECRET);

export async function encrypt(payload) {
  return new SignJWT(payload).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime(`${MAX_AGE_DAYS}d`).sign(key());
}

export async function decrypt(token) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, key(), { algorithms: ["HS256"] });
    return payload;
  } catch {
    return null;
  }
}

export async function createSession({ userId, workspaceId, role }, { expires } = {}) {
  const expiresAt = expires || new Date(Date.now() + MAX_AGE_DAYS * 864e5);
  const token = await encrypt({ userId, workspaceId, role });
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export async function readSession() {
  return decrypt((await cookies()).get(COOKIE)?.value);
}

export async function deleteSession() {
  (await cookies()).delete(COOKIE);
}
