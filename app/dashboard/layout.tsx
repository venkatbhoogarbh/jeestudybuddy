import Link from "next/link";
import { ensureProfile } from "@/lib/auth/auth";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await ensureProfile();

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <header className="border-b border-white/10 bg-[#050816]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/dashboard" className="font-semibold tracking-[0.2em] uppercase text-white/90">
            JEE Study Buddy
          </Link>
          <nav className="flex flex-wrap gap-4 text-sm text-slate-300">
            <Link href="/dashboard" className="hover:text-white">
              Overview
            </Link>
            <Link href="/dashboard/teacher" className="hover:text-white">
              Teacher
            </Link>
            <Link href="/dashboard/doubts" className="hover:text-white">
              Doubts
            </Link>
            <Link href="/dashboard/quizzes" className="hover:text-white">
              Quizzes
            </Link>
            <Link href="/dashboard/planner" className="hover:text-white">
              Planner
            </Link>
            <Link href="/dashboard/progress" className="hover:text-white">
              Progress
            </Link>
            <Link href="/dashboard/revision" className="hover:text-white">
              Revision
            </Link>
          </nav>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
