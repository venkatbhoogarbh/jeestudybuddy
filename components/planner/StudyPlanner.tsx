"use client";

import { useState, type FormEvent } from "react";
import type { GeneratedStudyPlan, QuizSubject } from "@/lib/validators/schemas";

const subjects: QuizSubject[] = ["Physics", "Chemistry", "Mathematics"];

type PlanResponse = {
  plan: GeneratedStudyPlan;
};

export default function StudyPlanner() {
  const [examDate, setExamDate] = useState("");
  const [dailyStudyHours, setDailyStudyHours] = useState("6");
  const [selectedSubjects, setSelectedSubjects] = useState<QuizSubject[]>(["Physics", "Chemistry", "Mathematics"]);
  const [topics, setTopics] = useState("");
  const [plan, setPlan] = useState<GeneratedStudyPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGeneratePlan(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/ai/planner", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          examDate,
          dailyStudyHours: Number(dailyStudyHours),
          subjects: selectedSubjects,
          topics,
        }),
      });

      const data = (await response.json()) as PlanResponse & { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate study plan.");
      }

      setPlan(data.plan);
    } catch (requestError) {
      setPlan(null);
      setError(requestError instanceof Error ? requestError.message : "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }

  function toggleSubject(subject: QuizSubject) {
    setSelectedSubjects((current) =>
      current.includes(subject) ? current.filter((item) => item !== subject) : [...current, subject],
    );
  }

  function resetPlan() {
    setPlan(null);
    setError(null);
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-cyan-300">Study Planner</p>
          <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Build a personalized JEE study schedule</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
            Set your exam date, available study hours, subjects, and topics. The AI will create a realistic daily plan with
            study, revision, break, and practice blocks.
          </p>
        </div>

        {plan ? (
          <button
            type="button"
            onClick={resetPlan}
            className="inline-flex items-center justify-center rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-white transition hover:border-cyan-400/30 hover:bg-white/5"
          >
            New Plan
          </button>
        ) : null}
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <form
          onSubmit={handleGeneratePlan}
          className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 sm:p-8"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-200">Target exam date</span>
              <input
                type="date"
                value={examDate}
                onChange={(event) => setExamDate(event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-cyan-400/50"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-200">Available study hours/day</span>
              <input
                type="number"
                min="1"
                step="0.5"
                value={dailyStudyHours}
                onChange={(event) => setDailyStudyHours(event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-cyan-400/50"
              />
            </label>
          </div>

          <div className="mt-5">
            <span className="text-sm font-medium text-slate-200">Subjects</span>
            <div className="mt-3 flex flex-wrap gap-3">
              {subjects.map((subject) => {
                const isActive = selectedSubjects.includes(subject);

                return (
                  <button
                    key={subject}
                    type="button"
                    onClick={() => toggleSubject(subject)}
                    className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                      isActive
                        ? "bg-cyan-400 text-slate-950"
                        : "border border-white/10 bg-white/5 text-slate-200 hover:border-cyan-400/30 hover:bg-white/10"
                    }`}
                  >
                    {subject}
                  </button>
                );
              })}
            </div>
          </div>

          <label className="mt-5 block space-y-2">
            <span className="text-sm font-medium text-slate-200">Topics to study</span>
            <textarea
              rows={5}
              value={topics}
              onChange={(event) => setTopics(event.target.value)}
              placeholder="Separate topics by commas or line breaks. Example: Electrostatics, Mole concept, Integration"
              className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/50"
            />
          </label>

          {error ? (
            <div className="mt-5 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isLoading || !examDate || !topics.trim() || selectedSubjects.length === 0}
            className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 to-indigo-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Generating plan..." : "Generate Study Plan"}
          </button>
        </form>

        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Generated schedule</p>
          {plan ? (
            <div className="mt-5 space-y-5">
              <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
                <h2 className="text-2xl font-semibold text-white">{plan.title}</h2>
                <p className="mt-2 text-sm text-slate-400">
                  Exam date: <span className="text-slate-200">{plan.examDate}</span> · Study hours/day:{" "}
                  <span className="text-slate-200">{plan.dailyStudyHours}</span>
                </p>
              </div>

              <div className="space-y-4">
                {plan.sessions.map((session, sessionIndex) => (
                  <article key={`${session.day}-${sessionIndex}`} className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-lg font-semibold text-white">{session.day}</h3>
                      <span className="text-xs uppercase tracking-[0.2em] text-slate-500">{session.blocks.length} blocks</span>
                    </div>
                    <div className="mt-4 space-y-3">
                      {session.blocks.map((block, blockIndex) => (
                        <div key={`${session.day}-${blockIndex}`} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                              <p className="text-sm font-medium text-white">
                                {block.type} · {block.subject}
                              </p>
                              <p className="mt-1 text-sm text-slate-400">{block.topic || "Short break / reset"}</p>
                            </div>
                            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200">
                              {block.durationMinutes} min
                            </span>
                          </div>
                          <p className="mt-3 text-sm leading-6 text-slate-300">{block.notes}</p>
                        </div>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-5 rounded-3xl border border-dashed border-white/10 bg-slate-950/50 p-8 text-sm leading-7 text-slate-400">
              Your personalized daily schedule will appear here after generation, including study blocks, revision slots,
              practice sessions, and short breaks.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
