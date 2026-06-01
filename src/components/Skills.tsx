import ScrollReveal from "./ScrollReveal";

const categories = [
  {
    title: "Backend & Languages",
    items: ["Python", "FastAPI", "Django", "Node.js", "PostgreSQL", "Redis"],
  },
  {
    title: "Frontend",
    items: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
  },
  {
    title: "Testing & Tools",
    items: ["Pytest", "Docker", "Git", "REST APIs"],
  },
];

export default function Skills() {
  return (
    <section id="stack" className="section-container">
      <ScrollReveal delay={0}>
        <p className="section-label">
          <span>02</span> / Stack
        </p>
        <h2 className="section-title">Tools chosen for longevity, not hype.</h2>
      </ScrollReveal>

      <div className="stack-categories">
        {categories.map((cat, catIdx) => (
          <ScrollReveal key={cat.title} delay={0.1 * catIdx}>
            <div className="stack-category">
              <h3>{cat.title}</h3>
              <div className="stack-tags">
                {cat.items.map((item) => (
                  <span key={item} className="stack-tag">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
