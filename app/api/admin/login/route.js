import { SignJWT } from "jose";
import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function POST(request) {
  try {
    const { env } = getCloudflareContext();
    const { password } = await request.json();

    if (
      typeof password !== "string" ||
      password !== env.ADMIN_PASSWORD
    ) {
      return NextResponse.json(
        { error: "Incorrect password." },
        { status: 401 }
      );
    }

    const secret = new TextEncoder().encode(
      env.SESSION_SECRET
    );

    if (!env.SESSION_SECRET) {
      throw new Error("SESSION_SECRET is missing");
    }

    const token = await new SignJWT({ admin: true })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(secret);

    const response = NextResponse.json({ success: true });

    response.cookies.set("admin_session", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 604800
    });

    return response;
  } catch (error) {
    console.error("Admin login error:", error);

    return NextResponse.json(
      { error: "Login failed." },
      { status: 500 }
    );
  }
}