import Image from "next/image";
import Link from "next/link";
import githubIcon from "@/Images/Gemini_Generated_Image_nd6qoand6qoand6q.png";
import linkedinIcon from "@/Images/12.png";
import { SOCIAL_GITHUB, SOCIAL_LINKEDIN } from "@/data/site";
import type { HeroStat } from "@/types/heroStats";

const heroSocials = [
  { label: "GitHub", href: SOCIAL_GITHUB, icon: githubIcon },
  { label: "LinkedIn", href: SOCIAL_LINKEDIN, icon: linkedinIcon },
] as const;

const marqueeItems = [
  "React",
  "Next.js",
  "TypeScript",
  "Python",
  "FastAPI",
  "Django",
  "PostgreSQL",
  "Docker",
  "Tailwind CSS",
  "REST APIs",
  "Git",
  "Redis",
];

function MarqueeContent() {
  return (
    <>
      {[...marqueeItems, ...marqueeItems].map((item, i) => (
        <span key={`${item}-${i}`} className="marquee-item">
          {item}
          <span className="star">✦</span>
        </span>
      ))}
    </>
  );
}

const defaultStats: HeroStat[] = [
  { value: "1+", label: "Years building" },
  { value: "5+", label: "Shipped projects" },
  { value: "10+", label: "Stacks fluent" },
];

export default function Hero({ stats = defaultStats }: { stats?: HeroStat[] }) {
  return (
    <>
      <section id="hero" className="hero">
        <div className="hero-inner">
          <div className="hero-layout">
            <div className="hero-stack">
              <div className="hero-badge-row">
                <span className="badge-available">Available</span>
              </div>

              <h1 className="hero-title">
                <span className="hero-title__line">
                  Hi, I&apos;m a{" "}
                  <span className="highlight">Full-Stack Developer</span>{" "}
                  crafting
                </span>
                <span className="hero-title__line">
                  robust &amp; scalable web applications.
                </span>
              </h1>

              <p className="hero-desc">
                I design clean architectures, build modern backends, and ship
                seamless user experiences — turning product ideas into reliable
                systems that hold up in production.
              </p>

              <div className="hero-actions">
              <Link href="/projects" className="btn-primary">
                Explore Projects
              </Link>
                <Link href="#contact" className="btn-secondary">
                  Get in Touch
                </Link>
              </div>

              <div className="hero-stats">
                {stats.map((stat, i) => (
                  <div key={`${stat.label}-${i}`}>
                    <div className="stat-value">{stat.value}</div>
                    <div className="stat-label">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <aside className="hero-aside" aria-label="Social profiles">
              <div className="hero-social-rail">
                {heroSocials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hero-social-link hover-target"
                    aria-label={social.label}
                  >
                    <Image
                      src={social.icon}
                      alt=""
                      width={80}
                      height={80}
                      className="hero-social-link__icon"
                      sizes="80px"
                    />
                    <span className="hero-social-link__label">{social.label}</span>
                  </a>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </section>

      <div className="marquee-wrap">
        <div className="marquee-track">
          <MarqueeContent />
        </div>
      </div>
    </>
  );
}
