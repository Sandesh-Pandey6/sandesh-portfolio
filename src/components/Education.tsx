type EducationItem = {
  degree: string;
  institution: string;
  location?: string;
  board?: string;
  coursework?: string[];
};

const education: EducationItem[] = [
  {
    degree: "BSc (Hons) Computing",
    institution: "Islington College, London Metropolitan University",
    location: "Kamal Marg, Kamalpokhari, Kathmandu",
    coursework: [
      "Data Structures & Algorithms",
      "Database Management Systems",
      "Web Development",
      "Software Engineering",
      "Object-Oriented Programming",
    ],
  },
];

export default function Education() {
  return (
    <section
      id="education"
      className="scroll-mt-20 bg-zinc-100 px-4 py-20 dark:bg-zinc-900/50"
    >
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-12 text-3xl font-bold text-zinc-900 dark:text-zinc-100">
          Education
        </h2>
        <div className="space-y-10">
          {education.map((item) => (
            <div
              key={item.degree}
              className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <h3 className="mb-1 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                {item.degree}
              </h3>
              <p className="mb-1 text-emerald-600 dark:text-emerald-400">
                {item.institution}
              </p>
              {item.location && (
                <p
                  className={`text-sm text-zinc-600 dark:text-zinc-400 ${item.coursework ? "mb-4" : "mb-1"}`}
                >
                  {item.location}
                </p>
              )}
              {item.board && (
                <p className="mb-4 text-sm text-zinc-500 dark:text-zinc-500">
                  {item.board}
                </p>
              )}
              {item.coursework && (
                <>
                  <h4 className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Relevant Coursework:
                  </h4>
                  <ul className="list-inside list-disc space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
                    {item.coursework?.map((course) => (
                      <li key={course}>{course}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
