import Image from "next/image";
import ScrollReveal from "./ScrollReveal";
import profilePhoto from "@/Images/my.jpg";

export default function About() {
  return (
    <section id="about" className="section-container">
      <ScrollReveal delay={0}>
        <p className="section-label">
          <span>01</span> / About
        </p>
      </ScrollReveal>

      <div className="about-grid">
        <ScrollReveal delay={0.1}>
          <div className="profile-intro">
            <Image
              src={profilePhoto}
              alt="Sandesh Pandey"
              width={profilePhoto.width}
              height={profilePhoto.height}
              className="profile-photo"
              sizes="(max-width: 767px) min(100vw, 320px), 280px"
              priority
            />
            <p className="profile-handle">
              <span>sandesh_pandey</span>
            </p>
          </div>
        </ScrollReveal>

        <div>
          <ScrollReveal delay={0.15}>
            <h2 className="about-heading">
              I bridge powerful backend logic with intuitive frontend
              experiences.
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <p className="about-text">
              I&apos;m a passionate full-stack developer who treats software the
              way a craftsman treats their tools — with respect, restraint, and a
              relentless eye for detail. From REST APIs to pixel-tight React
              interfaces, I enjoy owning the whole pipeline.
            </p>
            <p className="about-text">
              My focus is on writing clean, testable, maintainable code —
              software that holds its shape under pressure, scales without
              ceremony, and is genuinely pleasant to work in months later.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.25}>
            <div className="pillars">
              <div className="pillar-card">
                <h4>Clean Architecture</h4>
                <p>Layered, modular, deliberate.</p>
              </div>
              <div className="pillar-card">
                <h4>Vibe Designer Touch</h4>
                <p>Micro-interactions that delight.</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
