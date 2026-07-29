import crypto from "crypto";
import { cookies } from "next/headers";
import { query } from "./db";

/**
 * Studio auth — no Payload. Passwords are verified against the same `users` table
 * Payload uses (PBKDF2, sha256, 25000 iterations, 512 keylen — Payload's scheme),
 * so existing admin accounts log in unchanged. The session is a compact
 * HMAC-signed cookie (no DB session table needed).
 */

const SECRET = process.env.PAYLOAD_SECRET || "dev-insecure-secret-change-me";
const COOKIE = "studio_session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export type Session = { uid: number; email: string; name: string | null; role: string };

type UserRow = { id: number; email: string; name: string | null; role: string; hash: string; salt: string };

/** Constant-time PBKDF2 check against the stored salt+hash. */
function verifyPassword(password: string, salt: string, hash: string): boolean {
  const derived = crypto.pbkdf2Sync(password, salt, 25000, 512, "sha256").toString("hex");
  const a = Buffer.from(derived, "hex");
  const b = Buffer.from(hash, "hex");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/** Returns the session payload for valid credentials, else null. */
export async function authenticate(email: string, password: string): Promise<Session | null> {
  const rows = await query<UserRow>(
    `SELECT id, email, name, role, hash, salt FROM users WHERE lower(email) = lower($1) LIMIT 1`,
    [email.trim()],
  );
  const user = rows[0];
  if (!user?.hash || !user?.salt) return null;
  if (!verifyPassword(password, user.salt, user.hash)) return null;
  return { uid: user.id, email: user.email, name: user.name, role: user.role };
}

const b64url = (buf: Buffer | string) =>
  Buffer.from(buf).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const fromB64url = (s: string) => Buffer.from(s.replace(/-/g, "+").replace(/_/g, "/"), "base64");

function sign(payloadB64: string): string {
  return b64url(crypto.createHmac("sha256", SECRET).update(payloadB64).digest());
}

function serialize(session: Session): string {
  const body = { ...session, exp: Math.floor(Date.now() / 1000) + MAX_AGE };
  const payloadB64 = b64url(JSON.stringify(body));
  return `${payloadB64}.${sign(payloadB64)}`;
}

function parse(token: string): Session | null {
  const [payloadB64, sig] = token.split(".");
  if (!payloadB64 || !sig) return null;
  const expected = sign(payloadB64);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const body = JSON.parse(fromB64url(payloadB64).toString("utf8"));
    if (typeof body.exp !== "number" || body.exp < Math.floor(Date.now() / 1000)) return null;
    return { uid: body.uid, email: body.email, name: body.name, role: body.role };
  } catch {
    return null;
  }
}

export async function createSession(session: Session): Promise<void> {
  const store = await cookies();
  store.set(COOKIE, serialize(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/studio",
    maxAge: MAX_AGE,
  });
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE);
}

/** Current session or null — used by the studio layout to gate access. */
export async function getSession(): Promise<Session | null> {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  return token ? parse(token) : null;
}
