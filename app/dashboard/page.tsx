import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/auth";
import { getUserProfile } from "@/lib/db/users";
import { signOutAction } from "./actions";

const todaysOverview = [
  { label: "Study time", value: "4h 30m", note: "Planned today" },
  { label: "Topics planned", value: "5", note: "Mock data" },
  { label: "Topics completed", value: "3", note: "Mock data" },
  { label: "Current streak", value: "7 days", note: "Mock data" },
];

const quickActions = [
  { label: "AI Teacher", href: "/dashboard/teacher" },
  { label: "Ask a Doubt", href: "/dashboard/doubts" },
  { label: "Generate Quiz", href: "/dashboard/quizzes" },
  { label: "Study Planner", href: "/dashboard/planner" },
  { label: "Progress", href: "/dashboard/progress" },
  { label: "Revision", href: "/dashboard/revision" },
];

const focusItems = [
  {
    title: "Electrostatics",
    subtitle: "Review field direction and potential difference",
    progress: 72,
  },
  {
    title: "Organic Mechanisms",
    subtitle: "Revise reaction pathways before the next quiz",
    progress: 58,
  },
];

export default async function DashboardHome() {
  const user = await getCurrentUser();
  const profile = user ? await getUserProfile(user.id) : null;
  const displayName =
    profile?.data?.full_name || user?.user_metadata?.full_name || user?.email || "Student";

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Dashboard</p>
                <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
                  Welcome back, {displayName}.
                </h1>
                <p className="mt-2 text-sm text-slate-400">
                  Signed in as <span className="text-slate-200">{user?.email ?? "unknown"}</span>
                </p>
              </div>

              <form action={signOutAction}>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-full border border-white/15 px-5 py-2 text-sm font-medium text-white/90 transition hover:border-white/30 hover:bg-white/5"
                >
                  Log out
                </button>
              </form>
            </div>

            <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
              This is your central hub for AI teaching, doubt solving, quiz practice, revision, and progress tracking.
              The values below are placeholders for now and are ready to be connected to Supabase data later.
            </p>
          </div>

          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Today&apos;s study overview</h2>
              <span className="text-xs uppercase tracking-[0.2em] text-slate-500">Mock data</span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {todaysOverview.map((item) => (
                <article key={item.label} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <p className="text-sm text-slate-400">{item.label}</p>
                  <p className="mt-3 text-3xl font-semibold text-white">{item.value}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.2em] text-cyan-300/80">{item.note}</p>
                </article>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Quick access</h2>
              <span className="text-xs uppercase tracking-[0.2em] text-slate-500">Feature routes</span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {quickActions.map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="group rounded-3xl border border-white/10 bg-white/5 p-5 transition hover:-translate-y-0.5 hover:border-cyan-400/30 hover:bg-white/8"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold text-white">{action.label}</h3>
                    <span className="text-cyan-300 transition group-hover:translate-x-0.5">→</span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    Open the {action.label.toLowerCase()} workspace.
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Continue learning</p>
                <h2 className="mt-3 text-xl font-semibold text-white">Today&apos;s focus</h2>
              </div>
              <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-200">
                Ready
              </span>
            </div>

            <div className="mt-5 space-y-4">
              {focusItems.map((item) => (
                <article key={item.title} className="rounded-3xl border border-white/10 bg-slate-950/70 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-white">{item.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-slate-400">{item.subtitle}</p>
                    </div>
                    <span className="text-sm font-medium text-cyan-200">{item.progress}%</span>
                  </div>
                  <div className="mt-4 h-2 rounded-full bg-white/10">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-cyan-400 to-indigo-400"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Progress overview</p>
            <div className="mt-5 space-y-4">
              <div>
                <div className="mb-2 flex items-center justify-between text-sm text-slate-300">
                  <span>Physics</span>
                  <span>68%</span>
                </div>
                <div className="h-2 rounded-full bg-white/10">
                  <div className="h-2 w-[68%] rounded-full bg-cyan-400" />
                </div>
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between text-sm text-slate-300">
                  <span>Chemistry</span>
                  <span>54%</span>
                </div>
                <div className="h-2 rounded-full bg-white/10">
                  <div className="h-2 w-[54%] rounded-full bg-indigo-400" />
                </div>
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between text-sm text-slate-300">
                  <span>Mathematics</span>
                  <span>61%</span>
                </div>
                <div className="h-2 rounded-full bg-white/10">
                  <div className="h-2 w-[61%] rounded-full bg-emerald-400" />
                </div>
              </div>
            </div>
            <p className="mt-4 text-xs leading-6 text-slate-500">
              Progress values are placeholder UI only and will later be powered by Supabase.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
