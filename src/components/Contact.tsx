"use client";

import { useState, FormEvent } from "react";
import ScrollReveal from "./ScrollReveal";
import { SITE_EMAIL_MAILTO, SOCIAL_GITHUB, SOCIAL_LINKEDIN } from "@/data/site";
import {
  normalizeContactPayload,
  validateContactFields,
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
    });

    const validationError = validateContactFields(payload);
    if (validationError) {
      setStatus("error");
      setMessage(validationError);
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
            <input
              id="email"
              name="email"
              type="email"
              required
              maxLength={254}
              autoComplete="email"
              placeholder="you@company.com"
            />
            <span className="form-hint">Use a real inbox — temporary emails are blocked.</span>
          </div>
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
            disabled={status === "loading"}
          >
            {status === "loading" ? "Sending…" : "Send message"}
          </button>
          {message && (
            <p
              className={`form-status ${status === "success" ? "success" : "error"}`}
            >
              {message}
            </p>
          )}
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
