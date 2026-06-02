import { NextResponse } from "next/server";
import { Resend } from "resend";
import { checkContactRateLimit, rateLimitMessage } from "@/lib/contactRateLimit";
import {
  normalizeContactPayload,
  validateEmailFormat,
} from "@/lib/contactValidation";
import {
  createVerificationCode,
  isVerificationConfigured,
  issueVerificationToken,
} from "@/lib/contactVerification";

export const maxDuration = 15;

const FROM_EMAIL =
  process.env.RESEND_FROM?.trim() || "Portfolio Contact <onboarding@resend.dev>";

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip") || "unknown";
}

export async function POST(request: Request) {
  try {
    if (!isVerificationConfigured()) {
      return NextResponse.json(
        {
          error:
            "Email verification is not configured. Set ADMIN_PASSWORD or CONTACT_VERIFY_SECRET.",
        },
        { status: 503 }
      );
    }

    if (!checkContactRateLimit(clientIp(request), "send-code")) {
      return NextResponse.json(
        { error: rateLimitMessage("send-code") },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { email } = normalizeContactPayload(body);

    const emailError = validateEmailFormat(email);
    if (emailError) {
      return NextResponse.json({ error: emailError }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY?.trim();
    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "Email service not configured. Add RESEND_API_KEY to .env.local and restart.",
        },
        { status: 503 }
      );
    }

    const code = createVerificationCode();
    const verificationToken = issueVerificationToken(email, code);
    const resend = new Resend(apiKey);

    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [email],
      subject: "Your portfolio contact verification code",
      text: [
        "Use this code to verify your email on Sandesh's portfolio contact form:",
        "",
        code,
        "",
        "The code expires in 10 minutes.",
        "If you did not request this, you can ignore this email.",
      ].join("\n"),
      html: `
        <p>Use this code to verify your email on the portfolio contact form:</p>
        <p style="font-size:1.5rem;font-weight:700;letter-spacing:0.2em">${code}</p>
        <p style="color:#666">Expires in 10 minutes. Ignore this if you did not request it.</p>
      `,
    });

    if (error) {
      console.error("[Contact send-code] Resend error:", error);
      const msg = error.message?.toLowerCase() ?? "";
      if (msg.includes("only send") || msg.includes("testing") || msg.includes("verified")) {
        return NextResponse.json(
          {
            error:
              "Could not send a code to that address. In Resend, verify your domain so you can email Gmail and Outlook visitors (not only your own inbox).",
          },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: "Could not send verification email. Check the address and try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ verificationToken });
  } catch (error) {
    console.error("[Contact send-code] Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}
