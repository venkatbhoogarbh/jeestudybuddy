import Link from "next/link";

const features = [
  {
    title: "AI Teacher",
    description:
      "Breaks down tough JEE concepts with clear explanations, examples, and step-by-step guidance.",
  },
  {
    title: "Smart Doubt Solver",
    description:
      "Ask by text or image and get fast, contextual help for homework, concepts, and tricky problems.",
  },
  {
    title: "Personalized Quizzes",
    description:
      "Generate practice that matches your current level, topic focus, and recent performance.",
  },
  {
    title: "Weak Topic Detection",
    description:
      "Tracks repeated mistakes and highlights concepts you need to revisit before they slip away.",
  },
  {
    title: "Smart Revision",
    description:
      "Suggests review moments based on your quiz history, mistakes, and retention patterns.",
  },
  {
    title: "Personalized Study Planner",
    description:
      "Builds a focused daily plan that balances revision, practice, and progress toward JEE goals.",
  },
];

const steps = [
  {
    title: "Learn and ask questions",
    description:
      "Study concepts, clear doubts, and keep the conversation going whenever you get stuck.",
  },
  {
    title: "Practice with quizzes",
    description:
      "Test your understanding with topic-specific quizzes and fast feedback after every attempt.",
  },
  {
    title: "Spot weak areas",
    description:
      "JEE Study Buddy notices repeated mistakes, slow topics, and areas that need extra attention.",
  },
  {
    title: "Get personalized recommendations",
    description:
      "Receive revision tips, next-step guidance, and study plans tailored to your learning journey.",
  },
];

const featureBullets = [
  "Tracks progress across subjects and topics",
  "Remembers recurring mistakes and weak areas",
  "Adapts quiz difficulty and revision timing",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <div className="absolute inset-x-0 top-0 -z-10 h-[36rem] bg-[radial-gradient(circle_at_top,_rgba(76,110,245,0.28),_transparent_55%),radial-gradient(circle_at_20%_20%,_rgba(99,102,241,0.18),_transparent_30%),linear-gradient(to_bottom,_rgba(15,23,42,1),_rgba(5,8,22,1))]" />

      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050816]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-400/10 text-sm font-semibold text-cyan-200 shadow-[0_0_30px_rgba(34,211,238,0.18)]">
              J
            </span>
            <span className="text-sm font-semibold tracking-[0.24em] text-white/90 uppercase">
              JEE Study Buddy
            </span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm text-white/70 md:flex" aria-label="Primary">
            <a className="transition-colors hover:text-white" href="#features">
              Features
            </a>
            <a className="transition-colors hover:text-white" href="#how-it-works">
              How It Works
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/auth/sign-in"
              className="hidden rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-white/85 transition hover:border-white/25 hover:bg-white/5 sm:inline-flex"
            >
              Sign In
            </Link>
            <Link
              href="#get-started"
              className="inline-flex rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:brightness-110"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-14 px-4 py-20 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-28">
        <div className="flex flex-col justify-center">
          <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-100">
            <span className="h-2 w-2 rounded-full bg-cyan-300" />
            Personalized AI mentor for JEE aspirants
          </div>

          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Your AI Study Buddy That Learns With You
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
            JEE Study Buddy tracks your progress, identifies weak topics, helps solve doubts, generates quizzes,
            and creates personalized revision plans so every study session becomes more effective than the last.
          </p>

          <ul className="mt-8 grid gap-3 text-sm text-slate-300 sm:grid-cols-3">
            {featureBullets.map((bullet) => (
              <li
                key={bullet}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur"
              >
                {bullet}
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a
              href="#get-started"
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100"
            >
              Start Learning
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white/90 transition hover:border-white/30 hover:bg-white/5"
            >
              See How It Works
            </a>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-6 rounded-[2rem] bg-cyan-500/10 blur-3xl" />
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/80 p-4 shadow-2xl shadow-black/40 backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-white/10 px-4 pb-4">
              <div>
                <p className="text-sm font-medium text-white/90">Student Dashboard Preview</p>
                <p className="text-xs text-slate-400">A polished static mockup of the experience</p>
              </div>
              <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-200">
                +12% this week
              </div>
            </div>

            <div className="grid gap-4 p-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Progress</p>
                  <div className="mt-4 flex items-end justify-between">
                    <div>
                      <p className="text-3xl font-semibold text-white">78%</p>
                      <p className="text-sm text-slate-400">Completion this month</p>
                    </div>
                    <div className="rounded-2xl bg-cyan-400/15 px-3 py-2 text-right">
                      <p className="text-xs text-cyan-100">Consistency</p>
                      <p className="text-sm font-semibold text-cyan-200">Strong</p>
                    </div>
                  </div>
                  <div className="mt-4 h-2 rounded-full bg-white/10">
                    <div className="h-2 w-[78%] rounded-full bg-gradient-to-r from-cyan-400 to-indigo-400" />
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Weak Topics</p>
                  <div className="mt-4 space-y-3">
                    <div>
                      <div className="mb-1 flex justify-between text-sm text-slate-300">
                        <span>Electrostatics</span>
                        <span>Needs focus</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/10">
                        <div className="h-2 w-[62%] rounded-full bg-amber-400" />
                      </div>
                    </div>
                    <div>
                      <div className="mb-1 flex justify-between text-sm text-slate-300">
                        <span>Organic Mechanisms</span>
                        <span>Review soon</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/10">
                        <div className="h-2 w-[48%] rounded-full bg-rose-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-[1.05fr_0.95fr]">
                <div className="rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-cyan-400/10 to-indigo-500/10 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-cyan-100/70">Study Recommendation</p>
                  <h2 className="mt-3 text-lg font-semibold text-white">Focus on Electrostatics today</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    Your last two quizzes showed recurring mistakes in field direction and potential difference.
                    Review these before moving to harder problems.
                  </p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">AI Teacher</p>
                  <div className="mt-4 space-y-3">
                    <div className="rounded-2xl rounded-tl-md bg-white/10 p-3 text-sm text-slate-200">
                      Why does the electric field point away from a positive charge?
                    </div>
                    <div className="rounded-2xl rounded-tr-md bg-cyan-400/10 p-3 text-sm text-cyan-50">
                      Because field direction shows the force on a positive test charge. That is why it points away from
                      positive charges.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">Features</p>
          <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
            Built to support every step of JEE prep.
          </h2>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/20 transition hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-white/8"
            >
              <div className="mb-4 h-11 w-11 rounded-2xl bg-gradient-to-br from-cyan-400/20 to-indigo-500/20 ring-1 ring-white/10" />
              <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">How it works</p>
          <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
            A simple flow that adapts to your progress.
          </h2>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-4">
          {steps.map((step, index) => (
            <article key={step.title} className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/10 text-lg font-semibold text-cyan-200 ring-1 ring-cyan-400/20">
                0{index + 1}
              </div>
              <h3 className="mt-5 text-lg font-semibold text-white">{step.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-8 rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/20 lg:grid-cols-[0.95fr_1.05fr] lg:p-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">
              Main differentiator
            </p>
            <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
              It remembers your learning journey.
            </h2>
          </div>
          <div className="space-y-4 text-sm leading-7 text-slate-300 sm:text-base">
            <p>
              Quiz performance, mistakes, weak topics, and revision history help JEE Study Buddy understand how you
              learn over time.
            </p>
            <p>
              That memory lets future AI interactions become more relevant, more targeted, and more supportive — so the
              app behaves like a real study partner instead of a generic chatbot.
            </p>
          </div>
        </div>
      </section>

      <section id="get-started" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-cyan-400/20 bg-gradient-to-r from-cyan-400/15 via-indigo-500/15 to-fuchsia-500/15 p-8 text-center shadow-2xl shadow-black/30 sm:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-200">
            Ready to begin?
          </p>
          <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-semibold text-white sm:text-4xl lg:text-5xl">
            Stop studying blindly. Start studying intelligently.
          </h2>
          <div className="mt-8">
            <Link
              href="/auth/sign-up"
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-slate-400 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <p>© 2026 JEE Study Buddy. Built for focused JEE preparation.</p>
          <div className="flex flex-wrap gap-5">
            <a className="transition hover:text-white" href="#features">
              Features
            </a>
            <a className="transition hover:text-white" href="#how-it-works">
              How It Works
            </a>
            <Link className="transition hover:text-white" href="/auth/sign-in">
              Sign In
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
