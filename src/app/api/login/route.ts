import { NextResponse } from "next/server";
import { getUserByEmail } from "@/lib/queries";
import { COOKIE_NAME, getSessionCookieOptions, signSession, verifyPassword } from "@/lib/auth";

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  const user = await getUserByEmail(email);
  if (!user) {
    return NextResponse.redirect(new URL("/login?error=Invalid%20credentials", request.url));
  }

  const ok = await verifyPassword(password, user.password_hash);
  if (!ok) {
    return NextResponse.redirect(new URL("/login?error=Invalid%20credentials", request.url));
  }

  const token = signSession({ userId: user.id, email: user.email, role: user.role });
  const response = NextResponse.redirect(new URL("/dashboard", request.url));
  response.cookies.set(COOKIE_NAME, token, getSessionCookieOptions());
  return response;
}
