/** Shared contact form validation (client + server). */

const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

/** Common disposable / temporary inbox domains */
const DISPOSABLE_DOMAINS = new Set([
  "10minutemail.com",
  "10minutemail.net",
  "dispostable.com",
  "dropmail.me",
  "fakeinbox.com",
  "getnada.com",
  "guerrillamail.com",
  "guerrillamail.de",
  "guerrillamail.info",
  "guerrillamail.net",
  "guerrillamail.org",
  "guerrillamailblock.com",
  "maildrop.cc",
  "mailinator.com",
  "mailinator.net",
  "mailinator.org",
  "mailnesia.com",
  "mintemail.com",
  "moakt.com",
  "sharklasers.com",
  "spam4.me",
  "temp-mail.org",
  "tempmail.com",
  "tempmail.net",
  "throwaway.email",
  "trashmail.com",
  "trashmail.de",
  "yopmail.com",
  "yopmail.fr",
  "yopmail.net",
]);

const FAKE_LOCAL = /^(test|testing|fake|spam|temp|tmp|noreply|no-reply|admin|user|asdf|qwerty|abc|123|none|null|foo|bar)$/i;

const FAKE_DOMAIN =
  /^(example\.(com|org|net)|test\.(com|de)|localhost|invalid|fake|temp|throwaway)$/i;

export type ContactPayload = {
  name: string;
  email: string;
  message: string;
  website?: string;
};

export function normalizeContactPayload(body: Record<string, unknown>): ContactPayload {
  return {
    name: String(body.name ?? "").trim(),
    email: String(body.email ?? "").trim().toLowerCase(),
    message: String(body.message ?? "").trim(),
    website: String(body.website ?? "").trim(),
  };
}

export function getEmailDomain(email: string): string | null {
  const at = email.lastIndexOf("@");
  if (at < 1) return null;
  return email.slice(at + 1).toLowerCase();
}

export function isDisposableDomain(domain: string): boolean {
  if (DISPOSABLE_DOMAINS.has(domain)) return true;
  const parts = domain.split(".");
  for (let i = 1; i < parts.length; i++) {
    const parent = parts.slice(i).join(".");
    if (DISPOSABLE_DOMAINS.has(parent)) return true;
  }
  return false;
}

export function validateEmailFormat(email: string): string | null {
  if (!email) return "Email is required.";
  if (email.length > 254) return "Email is too long.";
  if (!EMAIL_REGEX.test(email)) return "Enter a valid email address.";

  const [local, domain] = email.split("@");
  if (!local || !domain || local.length > 64) {
    return "Enter a valid email address.";
  }

  const labels = domain.split(".");
  if (labels.length < 2) return "Enter a valid email address.";

  const tld = labels[labels.length - 1];
  if (tld.length < 2 || !/^[a-zA-Z]{2,}$/.test(tld)) {
    return "Enter a valid email address.";
  }

  if (FAKE_LOCAL.test(local)) {
    return "Please use your real email address.";
  }

  if (FAKE_DOMAIN.test(domain)) {
    return "Please use a real email address (not a test domain).";
  }

  if (isDisposableDomain(domain)) {
    return "Temporary email addresses are not allowed. Use your real inbox.";
  }

  return null;
}

export function validateContactFields(
  payload: ContactPayload
): string | null {
  if (payload.website) {
    return "Unable to send message.";
  }

  if (!payload.name || payload.name.length < 2) {
    return "Name must be at least 2 characters.";
  }

  if (payload.name.length > 100) {
    return "Name is too long.";
  }

  const emailError = validateEmailFormat(payload.email);
  if (emailError) return emailError;

  if (!payload.message || payload.message.length < 10) {
    return "Message must be at least 10 characters.";
  }

  if (payload.message.length > 5000) {
    return "Message is too long.";
  }

  return null;
}
