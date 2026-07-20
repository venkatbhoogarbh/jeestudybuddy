const overallProgress = 64;

const subjectProgress = [
  { subject: "Physics", value: 68, color: "from-cyan-400 to-sky-400" },
  { subject: "Chemistry", value: 54, color: "from-indigo-400 to-violet-400" },
  { subject: "Mathematics", value: 61, color: "from-emerald-400 to-teal-400" },
];

const topicStrengths = [
  { topic: "Electrostatics", status: "Strong", detail: "Consistent quiz accuracy and fast recall." },
  { topic: "Chemical Bonding", status: "Needs Practice", detail: "Good concept familiarity, weaker application." },
  { topic: "Integration", status: "Weak", detail: "Needs more problem-solving repetition." },
  { topic: "Modern Physics", status: "Strong", detail: "High accuracy in recent quizzes." },
  { topic: "Equilibrium", status: "Needs Practice", detail: "Revision helps, but speed is inconsistent." },
];

const quizPerformance = [
  { label: "Average score", value: "72%" },
  { label: "Questions attempted", value: "184" },
  { label: "Correct answers", value: "133" },
];

const recentActivity = [
  {
    title: "Completed quiz on Electrostatics",
    meta: "Today · Physics · 10 questions",
  },
  {
    title: "Reviewed weak topic: Integration",
    meta: "Yesterday · Mathematics",
  },
  {
    title: "Finished daily plan session",
    meta: "Yesterday · 3 study blocks",
  },
  {
    title: "Asked a doubt about SN1 vs SN2",
    meta: "2 days ago · Chemistry",
  },
];

const nextSteps = [
  "Revise Integration formulas and solve 5 mixed problems.",
  "Take a medium-difficulty Chemistry quiz on Chemical Bonding.",
  "Revisit Electrostatics concepts before the next revision session.",
  "Use the Study Planner to add one practice-heavy math block.",
];

function getStrengthStyle(status: string) {
  if (status === "Strong") {
    return "bg-emerald-400/15 text-emerald-200 border-emerald-400/20";
  }

  if (status === "Needs Practice") {
    return "bg-amber-400/15 text-amber-200 border-amber-400/20";
  }

  return "bg-rose-400/15 text-rose-200 border-rose-400/20";
}

export default function ProgressPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.28em] text-cyan-300">Progress Dashboard</p>
        <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Track your JEE preparation in one place</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
          This page uses clearly marked mock data for now and is ready to be connected to Supabase progress data later.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6">
          <article className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Overall preparation</p>
                <h2 className="mt-3 text-2xl font-semibold text-white">Mock progress overview</h2>
              </div>
              <span className="rounded-full border border-white/10 bg-slate-950/70 px-4 py-2 text-sm text-slate-200">
                {overallProgress}% complete
              </span>
            </div>

            <div className="mt-6 h-3 rounded-full bg-white/10">
              <div
                className="h-3 rounded-full bg-gradient-to-r from-cyan-400 to-indigo-400"
                style={{ width: `${overallProgress}%` }}
              />
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Study momentum</p>
                <p className="mt-3 text-3xl font-semibold text-white">Good</p>
                <p className="mt-2 text-sm text-slate-400">Steady progress across all three subjects.</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Consistency</p>
                <p className="mt-3 text-3xl font-semibold text-white">78%</p>
                <p className="mt-2 text-sm text-slate-400">Based on recent quizzes and planner completion.</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Revision focus</p>
                <p className="mt-3 text-3xl font-semibold text-white">Active</p>
                <p className="mt-2 text-sm text-slate-400">Weak areas are being scheduled for review.</p>
              </div>
            </div>
          </article>

          <article className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Subject-wise progress</p>
                <h2 className="mt-3 text-xl font-semibold text-white">Physics, Chemistry, Mathematics</h2>
              </div>
              <span className="text-xs uppercase tracking-[0.2em] text-slate-500">Mock data</span>
            </div>

            <div className="mt-6 space-y-5">
              {subjectProgress.map((item) => (
                <div key={item.subject}>
                  <div className="mb-2 flex items-center justify-between text-sm text-slate-300">
                    <span>{item.subject}</span>
                    <span>{item.value}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10">
                    <div
                      className={`h-2 rounded-full bg-gradient-to-r ${item.color}`}
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Topic strength indicators</p>
                <h2 className="mt-3 text-xl font-semibold text-white">Where you stand right now</h2>
              </div>
              <span className="text-xs uppercase tracking-[0.2em] text-slate-500">Mock data</span>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {topicStrengths.map((topic) => (
                <article key={topic.topic} className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-white">{topic.topic}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-400">{topic.detail}</p>
                    </div>
                    <span className={`rounded-full border px-3 py-1 text-xs font-medium ${getStrengthStyle(topic.status)}`}>
                      {topic.status}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </article>
        </div>

        <aside className="space-y-6">
          <article className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Quiz performance</p>
            <div className="mt-5 grid gap-4">
              {quizPerformance.map((item) => (
                <div key={item.label} className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
                  <p className="text-sm text-slate-400">{item.label}</p>
                  <p className="mt-3 text-3xl font-semibold text-white">{item.value}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs leading-6 uppercase tracking-[0.18em] text-slate-500">Mock data</p>
          </article>

          <article className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Recent activity</p>
            <div className="mt-5 space-y-4">
              {recentActivity.map((item) => (
                <div key={item.title} className="rounded-3xl border border-white/10 bg-slate-950/70 p-4">
                  <h3 className="font-medium text-white">{item.title}</h3>
                  <p className="mt-2 text-sm text-slate-400">{item.meta}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Recommended next steps</p>
            <div className="mt-5 space-y-3">
              {nextSteps.map((step, index) => (
                <div key={step} className="flex gap-4 rounded-3xl border border-white/10 bg-slate-950/70 p-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cyan-400/15 text-sm font-semibold text-cyan-200">
                    {index + 1}
                  </div>
                  <p className="text-sm leading-6 text-slate-300">{step}</p>
                </div>
              ))}
            </div>
          </article>
        </aside>
      </div>
    </section>
  );
}
