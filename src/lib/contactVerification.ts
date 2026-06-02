import { createHmac, randomInt, timingSafeEqual } from "crypto";

const CODE_TTL_MS = 10 * 60 * 1000; // 10 minutes

function getSecret(): string | null {
  const secret =
    process.env.CONTACT_VERIFY_SECRET?.trim() ||
    process.env.ADMIN_SECRET?.trim() ||
    process.env.ADMIN_PASSWORD?.trim();
  return secret || null;
}

function hashCode(code: string): string {
  const secret = getSecret();
  if (!secret) throw new Error("Verification is not configured");
  return createHmac("sha256", secret).update(`contact-code:${code}`).digest("hex");
}

export function createVerificationCode(): string {
  return String(randomInt(100_000, 1_000_000));
}

export function issueVerificationToken(email: string, code: string): string {
  const secret = getSecret();
  if (!secret) throw new Error("Verification is not configured");

  const exp = Date.now() + CODE_TTL_MS;
  const payload = JSON.stringify({
    email,
    codeHash: hashCode(code),
    exp,
  });

  const sig = createHmac("sha256", secret)
    .update(`contact-verify:${payload}`)
    .digest("hex");

  return Buffer.from(`${payload}::${sig}`).toString("base64url");
}

export function verifyVerificationToken(
  token: string,
  email: string,
  code: string
): boolean {
  const secret = getSecret();
  if (!secret || !token || !code) return false;

  try {
    const decoded = Buffer.from(token, "base64url").toString("utf8");
    const sep = decoded.lastIndexOf("::");
    if (sep < 0) return false;

    const payload = decoded.slice(0, sep);
    const sig = decoded.slice(sep + 2);

    const expectedSig = createHmac("sha256", secret)
      .update(`contact-verify:${payload}`)
      .digest("hex");

    const sigBuf = Buffer.from(sig, "hex");
    const expectedBuf = Buffer.from(expectedSig, "hex");
    if (sigBuf.length !== expectedBuf.length || !timingSafeEqual(sigBuf, expectedBuf)) {
      return false;
    }

    const data = JSON.parse(payload) as {
      email?: string;
      codeHash?: string;
      exp?: number;
    };

    if (data.email !== email || typeof data.exp !== "number" || Date.now() > data.exp) {
      return false;
    }

    const codeHash = hashCode(code.trim());
    const a = Buffer.from(codeHash, "hex");
    const b = Buffer.from(data.codeHash ?? "", "hex");
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function isVerificationConfigured(): boolean {
  return Boolean(getSecret());
}
