import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type Role = "admin" | "editor";

export type Session = {
  userId: string;
  email: string;
  role: Role;
};

export const COOKIE_NAME = "session";

function getSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET is not set");
  }
  return secret;
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function signSession(payload: Session) {
  return jwt.sign(payload, getSecret(), { expiresIn: "7d" });
}

export function verifySession(token: string): Session | null {
  try {
    return jwt.verify(token, getSecret()) as Session;
  } catch {
    return null;
  }
}

export function getSessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7
  };
}

export function getSession(): Session | null {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySession(token);
}

export function requireSession(): Session {
  const session = getSession();
  if (!session) {
    redirect("/login");
  }
  return session;
}

export function requireRole(role: Role): Session {
  const session = requireSession();
  if (session.role !== role) {
    redirect("/dashboard");
  }
  return session;
}
