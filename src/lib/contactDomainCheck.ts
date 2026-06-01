import "server-only";

import { promises as dns } from "dns";

/** Confirm the domain can receive mail (MX or A record). */
export async function domainAcceptsMail(domain: string): Promise<boolean> {
  try {
    const mx = await dns.resolveMx(domain);
    if (mx.length > 0) return true;
  } catch {
    /* try A record fallback */
  }

  try {
    const a = await dns.resolve4(domain);
    return a.length > 0;
  } catch {
    return false;
  }
}
