
import { SignJWT } from "jose";

export async function POST(request) {
  try {
    const { password } = await request.json();

    if (
      typeof password !== "string" ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return Response.json(
        { error: "Incorrect password." },
        { status: 401 }
      );
    }

    const secret = new TextEncoder().encode(
      process.env.SESSION_SECRET
    );

    const token = await new SignJWT({ admin: true })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(secret);

    const response = Response.json({ success: true });

    response.cookies.set("admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 604800
    });

    return response;
  } catch {
    return Response.json(
      { error: "Login failed." },
      { status: 500 }
    );
  }
}
