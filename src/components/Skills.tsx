import Image from "next/image";

type Skill = { name: string; icon: string } | { name: string; image: string };

const skills: Skill[] = [
  { name: "HTML", icon: "🌐" },
  { name: "CSS", image: "/css-logo.png" },
  { name: "JavaScript", image: "/javascript-logo.png" },
  { name: "React", image: "/react-logo.png" },
  { name: "Next.js", icon: "▲" },
  { name: "Tailwind CSS", image: "/tailwind-logo.png" },
  { name: "Git & GitHub", image: "/github-logo.png" },
  { name: "Basic Backend", icon: "🔧" },
];

export default function Skills() {
  return (
    <section
      id="skills"
      className="scroll-mt-20 bg-zinc-100 px-4 py-20 dark:bg-zinc-900/50"
    >
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-12 text-3xl font-bold text-zinc-900 dark:text-zinc-100">
          Skills
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {skills.map((skill, index) => (
            <div
              key={skill.name}
              className="group rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-emerald-200 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-emerald-800"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {"image" in skill && skill.image ? (
                <span className="mb-3 block size-12">
                  <Image
                    src={skill.image}
                    alt=""
                    width={48}
                    height={48}
                    className="size-full object-contain"
                    aria-hidden
                  />
                </span>
              ) : "icon" in skill ? (
                <span className="mb-3 block text-3xl" aria-hidden>
                  {skill.icon}
                </span>
              ) : null}
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                {skill.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
