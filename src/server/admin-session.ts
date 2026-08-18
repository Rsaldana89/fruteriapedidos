import { cookies } from "next/headers";
import { authenticateAdminUser, isAdminUserActive } from "./admin-users-repository";

const COOKIE = "abf_admin_session";

function base64url(bytes: Uint8Array) {
  return btoa(String.fromCharCode(...bytes)).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

async function sign(value: string) {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error("ADMIN_SESSION_SECRET no está configurada");
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return base64url(new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value))));
}

export function isAdminConfigured() {
  return Boolean(process.env.DATABASE_URL && process.env.ADMIN_SESSION_SECRET);
}

export async function verifyAdminCredentials(user: string, password: string) {
  if (!isAdminConfigured()) return null;
  return authenticateAdminUser(user.trim(), password);
}

export async function createAdminSession(user: string) {
  const expires = Date.now() + 8 * 60 * 60 * 1000;
  const payload = `${encodeURIComponent(user)}:${expires}`;
  const signature = await sign(payload);
  const jar = await cookies();
  jar.set(COOKIE, `${payload}.${signature}`, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(expires),
  });
}

export async function clearAdminSession() {
  const jar = await cookies();
  jar.set(COOKIE, "", { httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 0 });
}

export async function hasAdminSession() {
  if (!isAdminConfigured()) return false;
  const jar = await cookies();
  const value = jar.get(COOKIE)?.value;
  if (!value) return false;
  const dot = value.lastIndexOf(".");
  if (dot < 0) return false;
  const payload = value.slice(0, dot);
  const supplied = value.slice(dot + 1);
  const separator = payload.lastIndexOf(":");
  if (separator < 0) return false;
  let user: string;
  try {
    user = decodeURIComponent(payload.slice(0, separator));
  } catch {
    return false;
  }
  const expiry = payload.slice(separator + 1);
  if (!user || Number(expiry) < Date.now()) return false;
  const expected = await sign(payload);
  if (supplied.length !== expected.length) return false;
  let difference = 0;
  for (let i = 0; i < supplied.length; i += 1) difference |= supplied.charCodeAt(i) ^ expected.charCodeAt(i);
  if (difference !== 0) return false;
  return isAdminUserActive(user);
}
