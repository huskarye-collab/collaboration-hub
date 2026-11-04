
import { db } from "@/lib/server";
import { Resend } from "resend";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const body = await request.json();

    const username = String(body.username || "").trim();
    const contact = String(body.contact || "").trim();
    const platform = String(body.platform || "").trim();
    const message = String(body.message || "").trim();

    if (
      username.length < 2 || username.length > 50 ||
      contact.length < 3 || contact.length > 150 ||
      message.length < 10 || message.length > 2000 ||
      !["YouTube", "Discord", "Roblox", "Other"].includes(platform)
    ) {
      return Response.json(
        { error: "Please check your information." },
        { status: 400 }
      );
    }

    const { data, error } = await db
      .from("collaboration_requests")
      .insert({ username, contact, platform, message })
      .select("id")
      .single();

    if (error) throw error;

    const resend = new Resend(process.env.RESEND_API_KEY);

    const email = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: process.env.OWNER_EMAIL,
      subject: "New Collaboration Request!",
      text: `
Username: ${username}
Contact: ${contact}
Platform: ${platform}

Message:
${message}

Request ID: ${data.id}
`
    });

    if (email.error) {
      console.error("Email notification failed:", email.error);
    }

    return Response.json({
      success: true,
      message: "Request submitted!"
    });

  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}