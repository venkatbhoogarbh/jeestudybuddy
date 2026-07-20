"use client";

import { useState, type FormEvent } from "react";
import MarkdownMessage from "@/components/ai/MarkdownMessage";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const examplePrompts = [
  "Explain Newton's laws in a simple way",
  "Teach me electrostatics step by step",
  "What is the difference between SN1 and SN2?",
];

export default function TeacherPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasConversation = messages.length > 0;

  const emptyState = (
    <div className="rounded-[2rem] border border-dashed border-white/15 bg-white/5 p-8 text-center">
      <h2 className="text-xl font-semibold text-white">Start a conversation with your AI Teacher</h2>
      <p className="mt-3 text-sm leading-7 text-slate-300">
        Ask a concept question and get a step-by-step explanation tailored for JEE prep.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        {examplePrompts.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => setQuestion(prompt)}
            className="rounded-full border border-white/15 px-4 py-2 text-sm text-slate-200 transition hover:border-cyan-400/30 hover:bg-white/5"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedQuestion = question.trim();
    if (!trimmedQuestion || loading) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: trimmedQuestion }];
    setMessages(nextMessages);
    setQuestion("");
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/ai/teacher", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: trimmedQuestion,
          history: messages.slice(-8),
        }),
      });

      const data = (await response.json()) as { answer?: string; error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to get an AI response.");
      }

      setMessages((current) => [...current, { role: "assistant", content: data.answer ?? "" }]);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  function clearConversation() {
    setMessages([]);
    setQuestion("");
    setError(null);
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">AI Teacher</p>
              <h1 className="mt-3 text-3xl font-semibold text-white">Learn concepts interactively.</h1>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-300">
                Ask anything from Physics, Chemistry, or Mathematics and get a patient, step-by-step explanation.
              </p>
            </div>

            <button
              type="button"
              onClick={clearConversation}
              className="inline-flex items-center justify-center rounded-full border border-white/15 px-5 py-2 text-sm font-medium text-white/90 transition hover:border-white/30 hover:bg-white/5"
            >
              New conversation
            </button>
          </div>

          <div className="mt-6 space-y-4">
            {error ? (
              <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
                {error}
              </div>
            ) : null}

            {hasConversation ? (
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={`${message.role}-${index}`}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-3xl px-4 py-3 text-sm leading-7 ${
                        message.role === "user"
                          ? "bg-cyan-400 text-slate-950"
                          : "border border-white/10 bg-slate-950/70 text-slate-100"
                      }`}
                    >
                      {message.role === "assistant" ? (
                        <MarkdownMessage content={message.content} className="text-slate-100" />
                      ) : (
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      )}
                    </div>
                  </div>
                ))}
                {loading ? (
                  <div className="flex justify-start">
                    <div className="rounded-3xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-300">
                      Thinking...
                    </div>
                  </div>
                ) : null}
              </div>
            ) : (
              emptyState
            )}
          </div>

          <form onSubmit={handleSubmit} className="mt-6">
            <label htmlFor="question" className="sr-only">
              Ask your question
            </label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <textarea
                id="question"
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                rows={3}
                className="min-h-16 flex-1 rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/40"
                placeholder="Ask your JEE question..."
              />
              <button
                type="submit"
                disabled={loading || !question.trim()}
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100 disabled:cursor-not-allowed disabled:opacity-60 sm:self-end"
              >
                {loading ? "Sending..." : "Send"}
              </button>
            </div>
          </form>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">How to use it</p>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-300">
              <li>• Ask for concepts, doubts, or step-by-step teaching.</li>
              <li>• Use the example prompts to start quickly.</li>
              <li>• Clear the chat anytime to begin a fresh lesson.</li>
            </ul>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Teaching style</p>
            <div className="mt-4 space-y-4 text-sm leading-7 text-slate-300">
              <p>Patient, encouraging, and concept-first.</p>
              <p>Explains Physics, Chemistry, and Mathematics clearly.</p>
              <p>Asks guiding questions when a student seems confused.</p>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
