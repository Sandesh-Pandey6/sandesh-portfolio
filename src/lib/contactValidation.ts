/** Shared contact form validation (client + server). */

/** Exact domains allowed on the contact form */
export const ALLOWED_CONTACT_DOMAINS = new Set([
  "gmail.com",
  "googlemail.com",
  "outlook.com",
  "hotmail.com",
  "live.com",
  "msn.com",
]);

const MICROSOFT_MAIL_ROOTS = new Set(["outlook", "hotmail", "live"]);

function isMicrosoftConsumerDomain(domain: string): boolean {
  const labels = domain.split(".");
  if (labels.length < 2 || labels.length > 3) return false;
  return MICROSOFT_MAIL_ROOTS.has(labels[0]);
}

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

/** Local parts that are almost never real inboxes */
const FAKE_LOCAL =
  /^(test|testing|fake|spam|temp|tmp|noreply|no-reply|admin|user|you|your|yours|me|hello|hi|email|mail|contact|name|sample|demo|example|asdf|qwerty|abc|123|none|null|foo|bar)$/i;

/** Example addresses from the form — not real mailboxes */
const PLACEHOLDER_EMAILS = new Set([
  "you@gmail.com",
  "you@outlook.com",
  "your.name@gmail.com",
  "your.name@outlook.com",
]);

const FAKE_DOMAIN =
  /^(example\.(com|org|net)|test\.(com|de)|localhost|invalid|fake|temp|throwaway)$/i;

export type ContactPayload = {
  name: string;
  email: string;
  message: string;
  website?: string;
  verificationToken?: string;
  verificationCode?: string;
};

export function normalizeContactPayload(body: Record<string, unknown>): ContactPayload {
  return {
    name: String(body.name ?? "").trim(),
    email: String(body.email ?? "").trim().toLowerCase(),
    message: String(body.message ?? "").trim(),
    website: String(body.website ?? "").trim(),
    verificationToken: String(body.verificationToken ?? "").trim(),
    verificationCode: String(body.verificationCode ?? "").trim(),
  };
}

export function getEmailDomain(email: string): string | null {
  const at = email.lastIndexOf("@");
  if (at < 1) return null;
  return email.slice(at + 1).toLowerCase();
}

export function isAllowedContactEmail(email: string): boolean {
  const domain = getEmailDomain(email);
  if (!domain) return false;
  if (ALLOWED_CONTACT_DOMAINS.has(domain)) return true;
  return isMicrosoftConsumerDomain(domain);
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

  if (PLACEHOLDER_EMAILS.has(email)) {
    return "Enter your real Gmail or Outlook address — not the example text from the form.";
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

  if (!isAllowedContactEmail(email)) {
    return "Please use a Gmail or Outlook address (e.g. alex.smith@gmail.com).";
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
