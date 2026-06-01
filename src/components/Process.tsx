import ScrollReveal from "./ScrollReveal";
import ProcessLifecycle from "./ProcessLifecycle";

export default function Process() {
  return (
    <section id="process" className="section-container process-section">
      <div className="process-watermark" aria-hidden>
        04
      </div>
      <div className="process-bg-glow" aria-hidden />

      <div className="process-layout">
        <ScrollReveal delay={0}>
          <div className="process-intro">
            <p className="section-label">
              <span>04</span> / Process
            </p>
            <h2 className="section-title process-section-title">
              From idea to production — on repeat.
            </h2>
            <p className="process-intro-text">
              A continuous loop: discover, design, build, and ship — then feed
              learnings back into the next cycle.
            </p>
          </div>
        </ScrollReveal>

        <ProcessLifecycle />
      </div>
    </section>
  );
}
