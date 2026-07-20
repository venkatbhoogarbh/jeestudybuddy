"use client";

import { useMemo, useState, type FormEvent } from "react";
import type { GeneratedQuiz, QuizDifficulty, QuizQuestionCount, QuizSubject } from "@/lib/validators/schemas";

const subjects: QuizSubject[] = ["Physics", "Chemistry", "Mathematics"];
const difficulties: QuizDifficulty[] = ["Easy", "Medium", "Hard"];
const questionCounts: QuizQuestionCount[] = [5, 10];

type QuizResponse = {
  quiz: GeneratedQuiz;
};

export default function QuizGenerator() {
  const [subject, setSubject] = useState<QuizSubject>("Physics");
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState<QuizDifficulty>("Medium");
  const [questionCount, setQuestionCount] = useState<QuizQuestionCount>(5);
  const [quiz, setQuiz] = useState<GeneratedQuiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const currentQuestion = quiz?.questions[currentQuestionIndex] ?? null;
  const answeredCount = Object.keys(selectedAnswers).length;
  const progressPercent = quiz ? Math.round((answeredCount / quiz.questions.length) * 100) : 0;
  const score = useMemo(() => {
    if (!quiz) {
      return 0;
    }

    return quiz.questions.reduce((total, question, index) => {
      return selectedAnswers[index] === question.answerIndex ? total + 1 : total;
    }, 0);
  }, [quiz, selectedAnswers]);

  const totalQuestions = quiz?.questions.length ?? 0;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  const hasCompletedAllQuestions = quiz ? Object.keys(selectedAnswers).length === quiz.questions.length : false;

  async function handleGenerateQuiz(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setSubmitted(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});

    try {
      const response = await fetch("/api/ai/quizzes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject,
          topic,
          difficulty,
          questionCount,
        }),
      });

      const data = (await response.json()) as QuizResponse & { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate quiz.");
      }

      setQuiz(data.quiz);
    } catch (requestError) {
      setQuiz(null);
      setError(requestError instanceof Error ? requestError.message : "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }

  function selectAnswer(questionIndex: number, answerIndex: number) {
    setSelectedAnswers((current) => ({
      ...current,
      [questionIndex]: answerIndex,
    }));
  }

  function goToNextQuestion() {
    if (!quiz) return;
    setCurrentQuestionIndex((current) => Math.min(current + 1, quiz.questions.length - 1));
  }

  function goToPreviousQuestion() {
    setCurrentQuestionIndex((current) => Math.max(current - 1, 0));
  }

  function finishQuiz() {
    setSubmitted(true);
  }

  function startNewQuiz() {
    setQuiz(null);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setSubmitted(false);
    setError(null);
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-cyan-300">Quiz Generator</p>
          <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Practice with AI-generated MCQ quizzes</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
            Generate a focused quiz by subject, topic, and difficulty. Each quiz shows one question at a time, tracks your
            answers, and reveals explanations only after completion.
          </p>
        </div>

        {quiz ? (
          <button
            type="button"
            onClick={startNewQuiz}
            className="inline-flex items-center justify-center rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-white transition hover:border-cyan-400/30 hover:bg-white/5"
          >
            New Quiz
          </button>
        ) : null}
      </div>

      {!quiz ? (
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <form
            onSubmit={handleGenerateQuiz}
            className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 sm:p-8"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-200">Subject</span>
                <select
                  value={subject}
                  onChange={(event) => setSubject(event.target.value as QuizSubject)}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-cyan-400/50"
                >
                  {subjects.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-200">Difficulty</span>
                <select
                  value={difficulty}
                  onChange={(event) => setDifficulty(event.target.value as QuizDifficulty)}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-cyan-400/50"
                >
                  {difficulties.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="mt-5 block space-y-2">
              <span className="text-sm font-medium text-slate-200">Topic</span>
              <input
                value={topic}
                onChange={(event) => setTopic(event.target.value)}
                placeholder="e.g. Electrostatics, Chemical Bonding, Integration"
                className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/50"
              />
            </label>

            <div className="mt-5">
              <span className="text-sm font-medium text-slate-200">Number of questions</span>
              <div className="mt-3 flex gap-3">
                {questionCounts.map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setQuestionCount(count)}
                    className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                      questionCount === count
                        ? "bg-cyan-400 text-slate-950"
                        : "border border-white/10 bg-white/5 text-slate-200 hover:border-cyan-400/30 hover:bg-white/10"
                    }`}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>

            {error ? (
              <div className="mt-5 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isLoading || !topic.trim()}
              className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 to-indigo-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Generating quiz..." : "Generate Quiz"}
            </button>
          </form>

          <aside className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">How it works</p>
            <div className="mt-5 space-y-4 text-sm leading-7 text-slate-300">
              <p>
                Pick a subject, add a topic, and choose a difficulty level. The AI will create a fresh MCQ set in strict JSON
                format.
              </p>
              <p>
                Questions appear one at a time, so you can focus on solving before moving forward. Answers and explanations stay
                hidden until the quiz is finished.
              </p>
              <p>
                After completion, you&apos;ll see your score, which options were correct or incorrect, and a short explanation for
                every question.
              </p>
            </div>
          </aside>
        </div>
      ) : null}

      {quiz ? (
        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">{quiz.subject}</p>
                <h2 className="mt-3 text-2xl font-semibold text-white">{quiz.title}</h2>
                <p className="mt-2 text-sm text-slate-400">
                  Topic: <span className="text-slate-200">{quiz.topic}</span> {"·"} Difficulty:{" "}
                  <span className="text-slate-200">{quiz.difficulty}</span>
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-center">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Progress</p>
                <p className="mt-1 text-lg font-semibold text-white">
                  {Math.min(answeredCount, quiz.questions.length)}/{quiz.questions.length}
                </p>
              </div>
            </div>

            <div className="mt-6 h-2 rounded-full bg-white/10">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-cyan-400 to-indigo-400 transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="mt-6 rounded-3xl border border-white/10 bg-slate-950/70 p-5 sm:p-6">
              {currentQuestion ? (
                <>
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm text-cyan-300">
                      Question {currentQuestionIndex + 1} of {quiz.questions.length}
                    </p>
                    <p className="text-sm text-slate-400">Choose one answer</p>
                  </div>

                  <h3 className="mt-4 text-xl font-semibold leading-8 text-white">{currentQuestion.question}</h3>

                  <div className="mt-6 grid gap-3">
                    {currentQuestion.options.map((option, optionIndex) => {
                      const isSelected = selectedAnswers[currentQuestionIndex] === optionIndex;

                      return (
                        <button
                          key={`${currentQuestion.id}-${optionIndex}`}
                          type="button"
                          onClick={() => selectAnswer(currentQuestionIndex, optionIndex)}
                          className={`rounded-2xl border px-4 py-3 text-left text-sm leading-6 transition ${
                            isSelected
                              ? "border-cyan-400/60 bg-cyan-400/10 text-white"
                              : "border-white/10 bg-white/5 text-slate-200 hover:border-cyan-400/30 hover:bg-white/10"
                          }`}
                        >
                          <span className="mr-3 inline-flex h-6 w-6 items-center justify-center rounded-full border border-white/15 text-xs text-slate-300">
                            {String.fromCharCode(65 + optionIndex)}
                          </span>
                          {option}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={goToPreviousQuestion}
                      disabled={currentQuestionIndex === 0}
                      className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-white transition hover:border-white/30 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Previous
                    </button>

                    {!isLastQuestion ? (
                      <button
                        type="button"
                        onClick={goToNextQuestion}
                        disabled={selectedAnswers[currentQuestionIndex] === undefined}
                        className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Next
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={finishQuiz}
                        disabled={!hasCompletedAllQuestions}
                        className="rounded-full bg-gradient-to-r from-cyan-400 to-indigo-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Finish Quiz
                      </button>
                    )}
                  </div>
                </>
              ) : null}
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
              <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Quiz summary</p>
              <div className="mt-5 grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Answered</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{answeredCount}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Score</p>
                  <p className="mt-2 text-2xl font-semibold text-white">
                    {submitted ? `${score}/${quiz.questions.length}` : "Hidden"}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-400">
                Answers remain hidden until the quiz is submitted. You can navigate back and forth before finishing.
              </p>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
              <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Completion</p>
              {submitted ? (
                <div className="mt-4 space-y-4">
                  <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-5">
                    <p className="text-sm text-emerald-100">Great work - your quiz is complete.</p>
                    <p className="mt-2 text-3xl font-semibold text-white">
                      {score}/{quiz.questions.length}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {quiz.questions.map((question, index) => {
                      const selectedAnswer = selectedAnswers[index];
                      const isCorrect = selectedAnswer === question.answerIndex;

                      return (
                        <article key={question.id} className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="text-sm font-medium text-white">Question {index + 1}</p>
                              <p className="mt-1 text-sm leading-6 text-slate-400">{question.question}</p>
                            </div>
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-medium ${
                                isCorrect ? "bg-emerald-400/15 text-emerald-200" : "bg-rose-400/15 text-rose-200"
                              }`}
                            >
                              {isCorrect ? "Correct" : "Incorrect"}
                            </span>
                          </div>
                          <div className="mt-3 space-y-2 text-sm text-slate-300">
                            <p>
                              Your answer: {" "}
                              <span className="text-white">
                                {selectedAnswer !== undefined ? question.options[selectedAnswer] : "Not answered"}
                              </span>
                            </p>
                            <p>
                              Correct answer: {" "}
                              <span className="text-white">{question.options[question.answerIndex]}</span>
                            </p>
                            <p className="leading-6 text-slate-400">{question.explanation}</p>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <p className="mt-4 text-sm leading-7 text-slate-400">
                  Finish all questions to unlock the score, answer review, and explanations.
                </p>
              )}
            </div>
          </aside>
        </div>
      ) : null}
    </section>
  );
}
