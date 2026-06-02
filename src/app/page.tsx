import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Process from "@/components/Process";
import Contact from "@/components/Contact";
import { loadHeroStats } from "@/lib/heroStatsStore";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { stats } = await loadHeroStats();

  return (
    <>
      <Hero stats={stats} />
      <About />
      <Skills />
      <Projects />
      <Process />
      <Contact />
    </>
  );
}
