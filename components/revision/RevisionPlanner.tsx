"use client";

import { useMemo, useState, type FormEvent } from "react";
import type { GeneratedRevisionPlan, RevisionTopic, RevisionTopicPriority } from "@/lib/validators/schemas";

const mockTopics: RevisionTopic[] = [
  {
    id: "phy-electrostatics",
    subject: "Physics",
    topic: "Electrostatics",
    priority: "Weak",
    action: "Review concept",
    status: "pending",
  },
  {
    id: "chem-equilibrium",
    subject: "Chemistry",
    topic: "Chemical Equilibrium",
    priority: "Needs Practice",
    action: "Solve practice questions",
    status: "pending",
  },
  {
    id: "math-integration",
    subject: "Mathematics",
    topic: "Integration",
    priority: "Weak",
    action: "Take a quiz",
    status: "pending",
  },
  {
    id: "phy-modern",
    subject: "Physics",
    topic: "Modern Physics",
    priority: "Strong / Quick Revision",
    action: "Review concept",
    status: "pending",
  },
];

type RevisionResponse = {
  plan: GeneratedRevisionPlan;
};

function priorityStyle(priority: RevisionTopicPriority) {
  if (priority === "Weak") {
    return "bg-rose-400/15 text-rose-200 border-rose-400/20";
  }

  if (priority === "Needs Practice") {
    return "bg-amber-400/15 text-amber-200 border-amber-400/20";
  }

  return "bg-emerald-400/15 text-emerald-200 border-emerald-400/20";
}

function actionLabel(action: RevisionTopic["action"]) {
  return action;
}

export default function RevisionPlanner() {
  const [topics, setTopics] = useState<RevisionTopic[]>(mockTopics);
  const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>(
    mockTopics.filter((topic) => topic.priority === "Weak" || topic.priority === "Needs Practice").map((topic) => topic.id),
  );
  const [plan, setPlan] = useState<GeneratedRevisionPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedTopics = useMemo(
    () => topics.filter((topic) => selectedTopicIds.includes(topic.id)),
    [selectedTopicIds, topics],
  );

  const groupedTopics = useMemo(() => {
    return {
      weak: topics.filter((topic) => topic.priority === "Weak"),
      needsPractice: topics.filter((topic) => topic.priority === "Needs Practice"),
      strong: topics.filter((topic) => topic.priority === "Strong / Quick Revision"),
    };
  }, [topics]);

  async function handleGeneratePlan(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/ai/revision", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topics: selectedTopics,
        }),
      });

      const data = (await response.json()) as RevisionResponse & { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate revision plan.");
      }

      setPlan(data.plan);
    } catch (requestError) {
      setPlan(null);
      setError(requestError instanceof Error ? requestError.message : "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }

  function toggleTopic(topicId: string) {
    setSelectedTopicIds((current) =>
      current.includes(topicId) ? current.filter((id) => id !== topicId) : [...current, topicId],
    );
  }

  function markAsRevised(topicId: string) {
    setTopics((current) =>
      current.map((topic) => (topic.id === topicId ? { ...topic, status: "revised" as const } : topic)),
    );
    setSelectedTopicIds((current) => current.filter((id) => id !== topicId));
  }

  function resetPlan() {
    setPlan(null);
    setError(null);
  }

  const visibleTopics = topics.filter((topic) => topic.status !== "revised");

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-cyan-300">Smart Revision</p>
          <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Revise weak and important topics efficiently</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
            This page currently uses clearly marked mock topic data and is structured so it can later connect to Supabase.
          </p>
        </div>

        {plan ? (
          <button
            type="button"
            onClick={resetPlan}
            className="inline-flex items-center justify-center rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-white transition hover:border-cyan-400/30 hover:bg-white/5"
          >
            Generate Another Plan
          </button>
        ) : null}
      </div>

      {visibleTopics.length === 0 ? (
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 text-center">
          <h2 className="text-xl font-semibold text-white">No revision topics available</h2>
          <p className="mt-3 text-sm leading-7 text-slate-400">
            Once weak or important topics are available, they will appear here for quick revision planning.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[1fr_0.95fr]">
          <div className="space-y-6">
            <form
              onSubmit={handleGeneratePlan}
              className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 sm:p-8"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Generate revision plan</p>
                  <h2 className="mt-3 text-2xl font-semibold text-white">AI-powered short revision timeline</h2>
                </div>
                <span className="text-xs uppercase tracking-[0.2em] text-slate-500">Mock data</span>
              </div>

              <p className="mt-4 text-sm leading-7 text-slate-300">
                Select the topics you want to revise now. The AI will generate a short session plan focused on weak areas.
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {[...groupedTopics.weak, ...groupedTopics.needsPractice, ...groupedTopics.strong].map((topic) => {
                  const isSelected = selectedTopicIds.includes(topic.id);

                  return (
                    <button
                      key={topic.id}
                      type="button"
                      onClick={() => toggleTopic(topic.id)}
                      className={`rounded-3xl border p-5 text-left transition ${
                        isSelected
                          ? "border-cyan-400/40 bg-cyan-400/10"
                          : "border-white/10 bg-slate-950/70 hover:border-cyan-400/25 hover:bg-white/5"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm text-slate-400">{topic.subject}</p>
                          <h3 className="mt-1 text-lg font-semibold text-white">{topic.topic}</h3>
                        </div>
                        <span className={`rounded-full border px-3 py-1 text-xs font-medium ${priorityStyle(topic.priority)}`}>
                          {topic.priority}
                        </span>
                      </div>

                      <p className="mt-4 text-sm text-slate-300">
                        Recommended action: <span className="text-white">{actionLabel(topic.action)}</span>
                      </p>
                      <p className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-500">
                        Click to {isSelected ? "remove" : "include"} in plan
                      </p>
                    </button>
                  );
                })}
              </div>

              {error ? (
                <div className="mt-5 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={isLoading || selectedTopics.length === 0}
                className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 to-indigo-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? "Generating revision plan..." : "Generate Revision Plan"}
              </button>
            </form>

            <article className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
              <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Topic groups</p>
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                {[
                  { label: "Weak", items: groupedTopics.weak },
                  { label: "Needs Practice", items: groupedTopics.needsPractice },
                  { label: "Strong / Quick Revision", items: groupedTopics.strong },
                ].map((group) => (
                  <div key={group.label} className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
                    <h3 className="text-base font-semibold text-white">{group.label}</h3>
                    <div className="mt-4 space-y-3">
                      {group.items.map((topic) => (
                        <div key={topic.id} className="rounded-2xl border border-white/10 bg-white/5 p-3">
                          <p className="text-sm text-white">{topic.topic}</p>
                          <p className="mt-1 text-xs text-slate-400">{topic.subject}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </div>

          <aside className="space-y-6">
            <article className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
              <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Local revision status</p>
              <div className="mt-5 space-y-4">
                {topics.map((topic) => (
                  <div key={topic.id} className="rounded-3xl border border-white/10 bg-slate-950/70 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm text-slate-400">{topic.subject}</p>
                        <h3 className="mt-1 font-medium text-white">{topic.topic}</h3>
                        <p className="mt-2 text-sm text-slate-400">{topic.action}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => markAsRevised(topic.id)}
                        disabled={topic.status === "revised"}
                        className="rounded-full border border-white/15 px-3 py-1.5 text-xs font-medium text-white transition hover:border-cyan-400/30 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {topic.status === "revised" ? "Revised" : "Mark as Revised"}
                      </button>
                    </div>
                    <p className="mt-3 text-xs uppercase tracking-[0.18em] text-slate-500">{topic.priority}</p>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
              <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Generated plan</p>
              {plan ? (
                <div className="mt-5 space-y-4">
                  <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
                    <h2 className="text-2xl font-semibold text-white">{plan.title}</h2>
                    <p className="mt-2 text-sm text-slate-400">
                      Focus topics: <span className="text-slate-200">{plan.focusTopics.join(", ")}</span>
                    </p>
                  </div>

                  <div className="space-y-3">
                    {plan.sessions.map((session) => (
                      <div key={session.step} className="flex gap-4 rounded-3xl border border-white/10 bg-slate-950/70 p-4">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cyan-400/15 text-sm font-semibold text-cyan-200">
                          {session.step}
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-medium text-white">{session.title}</h3>
                          <p className="mt-2 text-sm leading-6 text-slate-300">{session.action}</p>
                          <p className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-500">
                            {session.subject} · {session.topic} · {session.durationMinutes} min
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="mt-4 text-sm leading-7 text-slate-400">
                  Generate a revision plan to see a focused timeline based on your selected weak topics.
                </p>
              )}
            </article>
          </aside>
        </div>
      )}
    </section>
  );
}
