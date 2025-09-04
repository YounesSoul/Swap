export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const email = (body.email || "").toLowerCase().trim();
  const password = body.password || "";
  const firstName = body.firstName || "";
  const lastName = body.lastName || "";
  const dateOfBirth = body.dateOfBirth ? new Date(body.dateOfBirth) : null;

  if (!email || !password || password.length < 8) {
    return NextResponse.json({ error: "Invalid email or password too short" }, { status: 400 });
  }

  const allowed = (process.env.ALLOWED_EMAIL_DOMAINS || "")
    .split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
  const dom = email.split("@").pop()?.toLowerCase();
  if (allowed.length && (!dom || !allowed.includes(dom))) {
    return NextResponse.json({ error: "Email domain not allowed" }, { status: 403 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  const hash = await bcrypt.hash(password, 10);

  if (existing) {
    if (existing.passwordHash) {
      return NextResponse.json({ error: "Account already exists. Please log in." }, { status: 409 });
    }
    await prisma.user.update({
      where: { email },
      data: { passwordHash: hash, firstName, lastName, dateOfBirth: dateOfBirth || undefined },
    });
  } else {
    await prisma.user.create({
      data: { email, firstName, lastName, dateOfBirth: dateOfBirth || undefined, passwordHash: hash },
    });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
