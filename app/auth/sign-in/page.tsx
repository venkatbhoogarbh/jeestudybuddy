import Link from "next/link";
import { signInAction } from "./actions";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string; next?: string }>;
}) {
  const params = await searchParams;
  const errorMessage = params.error ?? null;
  const infoMessage = params.message ?? null;
  const nextPath = params.next ?? "/dashboard";

  return (
    <main className="min-h-screen bg-[#050816] px-4 py-12 text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] w-full max-w-md flex-col justify-center">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/30 backdrop-blur-xl">
          <Link href="/" className="mb-8 inline-flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-400/10 text-sm font-semibold text-cyan-200">
              J
            </span>
            <span className="text-sm font-semibold tracking-[0.24em] uppercase text-white/90">
              JEE Study Buddy
            </span>
          </Link>

          <h1 className="text-3xl font-semibold">Welcome back</h1>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Sign in to continue your personalized JEE study journey.
          </p>

          {errorMessage ? (
            <p className="mt-6 rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
              {errorMessage}
            </p>
          ) : null}

          {infoMessage ? (
            <p className="mt-6 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-100">
              {infoMessage}
            </p>
          ) : null}

          <form action={signInAction} className="mt-8 space-y-4">
            <input type="hidden" name="next" value={nextPath} />
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-200">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/40"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-200">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/40"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100"
            >
              Sign In
            </button>
          </form>

          <p className="mt-6 text-sm text-slate-400">
            New here?{" "}
            <Link href="/auth/sign-up" className="font-medium text-cyan-200 hover:text-cyan-100">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
