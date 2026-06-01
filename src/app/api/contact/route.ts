import { NextResponse } from "next/server";
import { Resend } from "resend";
import { SITE_EMAIL } from "@/data/site";
import { checkContactRateLimit, rateLimitMessage } from "@/lib/contactRateLimit";
import { domainAcceptsMail } from "@/lib/contactDomainCheck";
import {
  getEmailDomain,
  normalizeContactPayload,
  validateContactFields,
} from "@/lib/contactValidation";

export const maxDuration = 15;

const TO_EMAIL = process.env.CONTACT_TO_EMAIL?.trim() || SITE_EMAIL;
const FROM_EMAIL =
  process.env.RESEND_FROM?.trim() || "Portfolio Contact <onboarding@resend.dev>";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip") || "unknown";
}

export async function POST(request: Request) {
  try {
    if (!checkContactRateLimit(clientIp(request))) {
      return NextResponse.json({ error: rateLimitMessage() }, { status: 429 });
    }

    const body = await request.json();
    const payload = normalizeContactPayload(body);

    const fieldError = validateContactFields(payload);
    if (fieldError) {
      return NextResponse.json({ error: fieldError }, { status: 400 });
    }

    const domain = getEmailDomain(payload.email);
    if (!domain) {
      return NextResponse.json(
        { error: "Enter a valid email address." },
        { status: 400 }
      );
    }

    const mailDomainOk = await domainAcceptsMail(domain);
    if (!mailDomainOk) {
      return NextResponse.json(
        {
          error:
            "That email domain does not look valid. Please use a real address you can receive mail at.",
        },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey || apiKey.trim() === "") {
      console.error(
        "[Contact API] RESEND_API_KEY is not set. Add it to .env.local and restart the dev server."
      );
      return NextResponse.json(
        {
          error:
            "Email service not configured. Add RESEND_API_KEY to .env.local and restart the dev server.",
        },
        { status: 503 }
      );
    }

    const resend = new Resend(apiKey);
    const { name, email, message } = payload;
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeMessage = escapeHtml(message).replace(/\n/g, "<br>");

    const subject = `Portfolio: message from ${name}`;
    const textBody = [
      "New message from your portfolio",
      "",
      `Name: ${name}`,
      `Email: ${email}`,
      "",
      "Message:",
      message,
    ].join("\n");

    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [TO_EMAIL],
      replyTo: email,
      subject,
      text: textBody,
      html: `
        <h2>New message from your portfolio</h2>
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
        <p><strong>Message:</strong></p>
        <p>${safeMessage}</p>
      `,
    });

    if (error) {
      console.error("[Contact API] Resend error:", error);
      const hint =
        process.env.NODE_ENV === "development"
          ? error.message
          : "Failed to send message. Please try again later.";
      return NextResponse.json({ error: hint }, { status: 500 });
    }

    return NextResponse.json(
      { message: "Message received successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Contact API] Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}
