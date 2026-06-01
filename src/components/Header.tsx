"use client";

import { useState } from "react";
import Link from "next/link";

/** Pre-cropped 256×256 from logo.png — sharp in small circles */
const LOGO_SRC = "/logo-header.png";

const navLinks = [
  { href: "#about", label: "About" },
  { href: "#stack", label: "Stack" },
  { href: "/projects", label: "Work" },
  { href: "#process", label: "Process" },
  { href: "#contact", label: "Contact" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <nav>
        <Link
          href="/"
          className="logo-link"
          onClick={() => setMobileMenuOpen(false)}
        >
          <span className="logo-mark">
            {/* Native img — full-res PNG, no Next.js resize/WebP compression */}
            <img
              src={LOGO_SRC}
              alt="Sandesh Pandey"
              width={256}
              height={256}
              className="logo-img"
              decoding="sync"
              fetchPriority="high"
            />
          </span>
          <span className="logo-text">
            Sandesh<span className="logo-text__accent">.dev</span>
          </span>
        </Link>

        <div className="nav-links">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </div>

        <button
          type="button"
          className="menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-expanded={mobileMenuOpen}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? "Close" : "Menu"}
        </button>
      </nav>

      {mobileMenuOpen && (
        <div className="mobile-nav">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
