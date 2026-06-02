import ScrollReveal from "./ScrollReveal";
import { loadSkills } from "@/data/skills";

export default async function Skills() {
  const skills = await loadSkills();

  if (!skills.enabled || skills.categories.length === 0) {
    return null;
  }

  const labelParts = skills.sectionLabel.split("/").map((s) => s.trim());
  const labelNumber = labelParts[0] ?? "02";
  const labelName = labelParts.slice(1).join(" / ") || "Stack";

  return (
    <section id="stack" className="section-container">
      <ScrollReveal delay={0}>
        <p className="section-label">
          <span>{labelNumber}</span>
          {labelName ? ` / ${labelName}` : null}
        </p>
        <h2 className="section-title">{skills.sectionTitle}</h2>
      </ScrollReveal>

      <div className="stack-categories">
        {skills.categories.map((cat, catIdx) => (
          <ScrollReveal key={cat.id} delay={0.1 * catIdx}>
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
