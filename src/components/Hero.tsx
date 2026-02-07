export default function Hero() {
  return (
    <section
      id="hero"
      className="flex min-h-screen items-center justify-center px-4 pt-20"
    >
      <div className="mx-auto max-w-4xl text-center">
        <p className="mb-4 text-sm font-medium uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
          Welcome to my portfolio
        </p>
        <h1 className="mb-6 text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-5xl md:text-6xl">
          Hi, I&apos;m Sandesh Pandey
        </h1>
        <p className="mb-4 text-xl font-medium text-zinc-700 dark:text-zinc-300 sm:text-2xl">
          Frontend / Full-Stack Web Developer
        </p>
        <p className="mx-auto mb-10 max-w-2xl text-base text-zinc-600 dark:text-zinc-400 sm:text-lg">
          I build modern, responsive web applications with clean code and great
          user experiences. Passionate about turning ideas into reality through
          the power of React, Next.js, and Tailwind CSS.
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="#projects"
            className="inline-flex w-full items-center justify-center rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:bg-emerald-500 hover:shadow-emerald-500/25 sm:w-auto"
          >
            View Projects
          </a>
          <a
            href="#contact"
            className="inline-flex w-full items-center justify-center rounded-lg border-2 border-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-700 transition-all hover:border-emerald-500 hover:text-emerald-600 dark:border-zinc-600 dark:text-zinc-300 dark:hover:border-emerald-500 dark:hover:text-emerald-400 sm:w-auto"
          >
            Contact Me
          </a>
        </div>
      </div>
    </section>
  );
}
