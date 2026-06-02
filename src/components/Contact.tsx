"use client";

import { useState, FormEvent } from "react";
import ScrollReveal from "./ScrollReveal";
import { SITE_EMAIL_MAILTO, SOCIAL_GITHUB, SOCIAL_LINKEDIN } from "@/data/site";
import {
  normalizeContactPayload,
  validateContactFields,
  validateEmailFormat,
} from "@/lib/contactValidation";

const socialLinks = [
  { name: "GitHub", href: SOCIAL_GITHUB },
  { name: "LinkedIn", href: SOCIAL_LINKEDIN },
];

export default function Contact() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [message, setMessage] = useState("");
  const [verificationToken, setVerificationToken] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [codeStatus, setCodeStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const [codeMessage, setCodeMessage] = useState("");

  async function handleSendCode() {
    setCodeStatus("sending");
    setCodeMessage("");
    setVerificationToken(null);

    const emailInput = document.getElementById("email") as HTMLInputElement | null;
    const email = emailInput?.value.trim().toLowerCase() ?? "";

    const emailError = validateEmailFormat(email);
    if (emailError) {
      setCodeStatus("error");
      setCodeMessage(emailError);
      return;
    }

    try {
      const res = await fetch("/api/contact/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await res.json()) as {
        verificationToken?: string;
        error?: string;
      };

      if (!res.ok) {
        throw new Error(data.error || "Could not send verification code");
      }

      setVerificationToken(data.verificationToken ?? null);
      setCodeStatus("sent");
      setCodeMessage(`We sent a 6-digit code to ${email}. Enter it below, then send your message.`);
      setVerificationCode("");
    } catch (err) {
      setCodeStatus("error");
      setCodeMessage(
        err instanceof Error ? err.message : "Could not send verification code."
      );
    }
  }

  function handleCodeChange(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 6);
    setVerificationCode(digits);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = normalizeContactPayload({
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
      website: formData.get("website"),
      verificationToken,
      verificationCode,
    });

    const validationError = validateContactFields(payload);
    if (validationError) {
      setStatus("error");
      setMessage(validationError);
      return;
    }

    if (!verificationToken || verificationCode.length !== 6) {
      setStatus("error");
      setMessage("Verify your email first: click “Send code” and enter the 6-digit code.");
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      setStatus("success");
      setMessage("Thanks! Your message was sent. I'll get back to you within a day.");
      form.reset();
      setVerificationToken(null);
      setVerificationCode("");
      setCodeStatus("idle");
      setCodeMessage("");
    } catch (err) {
      setStatus("error");
      setMessage(
        err instanceof Error ? err.message : "Something went wrong. Try again."
      );
    }
  }

  return (
    <section id="contact" className="contact-section">
      <ScrollReveal delay={0}>
        <p className="contact-eyebrow">Let&apos;s build something</p>
        <h2>Have a project in mind? Let&apos;s talk.</h2>
        <p className="contact-intro">
          Whether it&apos;s a product MVP, an API integration, or a full rebuild
          — drop a note and I&apos;ll get back within a day.
        </p>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <form className="contact-form" onSubmit={handleSubmit} noValidate>
          <div className="contact-honeypot" aria-hidden="true">
            <label htmlFor="website">Website</label>
            <input
              id="website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              minLength={2}
              maxLength={100}
              autoComplete="name"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="contact-email-row">
              <input
                id="email"
                name="email"
                type="email"
                required
                maxLength={254}
                autoComplete="email"
                placeholder="alex.smith@gmail.com"
                onChange={() => {
                  setVerificationToken(null);
                  setCodeStatus("idle");
                  setCodeMessage("");
                }}
              />
              <button
                type="button"
                className="btn-secondary contact-verify-btn"
                disabled={codeStatus === "sending"}
                onClick={() => void handleSendCode()}
              >
                {codeStatus === "sending" ? "Sending…" : "Send code"}
              </button>
            </div>
            <span className="form-hint">
              Gmail or Outlook only. We email you a code to confirm the inbox is real.
            </span>
            {codeMessage ? (
              <p
                className={`form-status contact-code-status ${
                  codeStatus === "error" ? "error" : "success"
                }`}
                role="status"
              >
                {codeMessage}
              </p>
            ) : null}
          </div>
          {verificationToken ? (
            <div className="form-group">
              <label htmlFor="verificationCode">Verification code</label>
              <input
                id="verificationCode"
                name="verificationCode"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="6-digit code"
                maxLength={6}
                value={verificationCode}
                onChange={(e) => handleCodeChange(e.target.value)}
                className="contact-code-input"
              />
            </div>
          ) : null}
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              required
              minLength={10}
              maxLength={5000}
            />
          </div>
          <button
            type="submit"
            className="btn-primary"
            disabled={status === "loading" || !verificationToken}
          >
            {status === "loading" ? "Sending…" : "Send message"}
          </button>
          {message ? (
            <p
              className={`form-status ${status === "success" ? "success" : "error"}`}
            >
              {message}
            </p>
          ) : null}
        </form>
      </ScrollReveal>

      <ScrollReveal delay={0.15}>
        <div className="contact-socials">
          {socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.name}
            </a>
          ))}
          <a href={SITE_EMAIL_MAILTO} className="contact-socials__email">
            Email
          </a>
        </div>
      </ScrollReveal>
    </section>
  );
}
