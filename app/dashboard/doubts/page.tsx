"use client";

import Image from "next/image";
import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import MarkdownMessage from "@/components/ai/MarkdownMessage";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const examplePrompts = [
  "Why does a convex lens form a real image?",
  "Solve this limit step by step",
  "Explain why SN2 is a one-step reaction",
];

export default function DoubtsPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [question, setQuestion] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasConversation = messages.length > 0;

  const emptyState = useMemo(
    () => (
      <div className="rounded-[2rem] border border-dashed border-white/15 bg-white/5 p-8 text-center">
        <h2 className="text-xl font-semibold text-white">Ask a text or image doubt</h2>
        <p className="mt-3 text-sm leading-7 text-slate-300">
          Upload a question image or type the missing part and get a step-by-step solution.
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
    ),
    [],
  );

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setImageFile(file);
    setError(null);

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setImagePreview(file ? URL.createObjectURL(file) : null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading || (!question.trim() && !imageFile)) return;

    const nextMessages: ChatMessage[] = [
      ...messages,
      {
        role: "user",
        content: question.trim() || (imageFile ? "Uploaded an image question." : ""),
      },
    ];

    setMessages(nextMessages);
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("question", question.trim());
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const response = await fetch("/api/ai/doubts", {
        method: "POST",
        body: formData,
      });

      const data = (await response.json()) as { answer?: string; error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to solve the doubt.");
      }

      setMessages((current) => [...current, { role: "assistant", content: data.answer ?? "" }]);
      setQuestion("");
      setImageFile(null);
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      setImagePreview(null);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  function clearDoubt() {
    setMessages([]);
    setQuestion("");
    setImageFile(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
    setError(null);
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Doubt Solver</p>
              <h1 className="mt-3 text-3xl font-semibold text-white">Ask with text or an image.</h1>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-300">
                Get a clear, step-by-step explanation for Physics, Chemistry, or Mathematics doubts.
              </p>
            </div>

            <button
              type="button"
              onClick={clearDoubt}
              className="inline-flex items-center justify-center rounded-full border border-white/15 px-5 py-2 text-sm font-medium text-white/90 transition hover:border-white/30 hover:bg-white/5"
            >
              New doubt
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
                      Solving...
                    </div>
                  </div>
                ) : null}
              </div>
            ) : (
              emptyState
            )}
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <label htmlFor="question" className="sr-only">
              Describe your doubt
            </label>
            <textarea
              id="question"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              rows={4}
              className="w-full rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/40"
              placeholder="Type your doubt here, or upload a question image below..."
            />

            <div className="grid gap-4 md:grid-cols-[1fr_auto]">
              <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-200" htmlFor="image">
                  Upload image
                </label>
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-slate-300 file:mr-4 file:rounded-full file:border-0 file:bg-white file:px-4 file:py-2 file:text-sm file:font-semibold file:text-slate-950 hover:file:bg-cyan-100"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={loading || (!question.trim() && !imageFile)}
                  className="inline-flex w-full items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100 disabled:cursor-not-allowed disabled:opacity-60 md:w-auto"
                >
                  {loading ? "Sending..." : "Send"}
                </button>
              </div>
            </div>

            {imagePreview ? (
              <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-4">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm font-medium text-slate-200">Selected image preview</p>
                  <button
                    type="button"
                    onClick={() => {
                      if (imagePreview) URL.revokeObjectURL(imagePreview);
                      setImageFile(null);
                      setImagePreview(null);
                    }}
                    className="text-sm text-cyan-300 hover:text-cyan-200"
                  >
                    Remove image
                  </button>
                </div>
                <Image
                  src={imagePreview}
                  alt="Selected doubt preview"
                  width={1200}
                  height={900}
                  unoptimized
                  className="mt-4 h-auto max-h-96 w-full rounded-2xl object-contain"
                />
              </div>
            ) : null}
          </form>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Best results</p>
            <div className="mt-4 space-y-3 text-sm leading-7 text-slate-300">
              <p>• Type the full question when possible.</p>
              <p>• Upload a clear, well-lit image for handwritten or printed problems.</p>
              <p>• If part of the image is unclear, type the missing text in the doubt field.</p>
            </div>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Teaching style</p>
            <div className="mt-4 space-y-4 text-sm leading-7 text-slate-300">
              <p>Patient, step-by-step, and concept-first.</p>
              <p>Clearly highlights final answers and common mistakes.</p>
              <p>Never invents unreadable values from an unclear image.</p>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
