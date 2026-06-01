import Image from "next/image";
import Link from "next/link";
import githubIcon from "@/Images/Gemini_Generated_Image_nd6qoand6qoand6q.png";
import linkedinIcon from "@/Images/12.png";
import {
  SITE_EMAIL,
  SITE_EMAIL_MAILTO,
  SOCIAL_GITHUB,
  SOCIAL_LINKEDIN,
} from "@/data/site";

const navLinks = [
  { href: "#about", label: "About" },
  { href: "#stack", label: "Stack" },
  { href: "/projects", label: "Work" },
  { href: "#process", label: "Process" },
  { href: "#contact", label: "Contact" },
];

const socialLinks = [
  { label: "GitHub", href: SOCIAL_GITHUB, icon: githubIcon },
  { label: "LinkedIn", href: SOCIAL_LINKEDIN, icon: linkedinIcon },
] as const;

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__top">
          <div className="footer__brand">
            <Link href="/" className="footer__logo">
              Sandesh<span className="footer__logo-accent">.dev</span>
            </Link>
            <p className="footer__tagline">
              Full-stack developer crafting reliable web applications — from
              architecture to interface.
            </p>
          </div>

          <nav className="footer__col" aria-label="Footer navigation">
            <p className="footer__heading">Navigate</p>
            <ul className="footer__links">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="footer__col">
            <p className="footer__heading">Connect</p>
            <div className="footer__socials">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer__social-link hover-target"
                  aria-label={social.label}
                >
                  <Image
                    src={social.icon}
                    alt=""
                    width={40}
                    height={40}
                    className="footer__social-icon"
                  />
                </a>
              ))}
            </div>
            <a href={SITE_EMAIL_MAILTO} className="footer__email-link">
              {SITE_EMAIL}
            </a>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copy">© {year} Sandesh Pandey. All rights reserved.</p>
          <p className="footer__credit">Designed &amp; built with precision.</p>
          <a href="#hero" className="footer__top-link hover-target">
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
