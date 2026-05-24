import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { Gamepad2, Brain, Coins, Sparkles } from "lucide-react";
import { clerkAuthAppearance } from "@/lib/clerkAppearance";

export default function SignInPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#22c55e44,transparent_35%),radial-gradient(circle_at_bottom_right,#7c3aed55,transparent_35%)]" />

      <div className="relative z-10 grid min-h-screen grid-cols-1 lg:grid-cols-2">
        <section className="hidden flex-col justify-between p-12 lg:flex">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500 shadow-lg shadow-emerald-500/30">
              <Gamepad2 className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold">KJSCE Gamified ED-TECH Platform</span>
          </Link>

          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-emerald-100 backdrop-blur-md">
              <Sparkles className="h-4 w-4" />
              Welcome back to your quest
            </div>

            <h1 className="max-w-xl text-6xl font-black leading-tight">
              Sign in to{" "}
              <span className="bg-gradient-to-r from-emerald-300 to-cyan-200 bg-clip-text text-transparent">
                resume learning.
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-8 text-slate-300">
              Continue lessons, complete quizzes, unlock coins, defeat boss battles,
              and build your daily consistency.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <MiniStat icon={<Brain />} title="AI Quizzes" />
            <MiniStat icon={<Coins />} title="Coins" />
            <MiniStat icon={<Sparkles />} title="Rewards" />
          </div>
        </section>

        <section className="flex items-center justify-center px-6 py-10">
          <div className="w-full max-w-[480px]">
            <div className="mb-8 text-center lg:hidden">
              <Link href="/" className="inline-flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500">
                  <Gamepad2 className="h-6 w-6" />
                </div>
                <span className="text-xl font-bold">KJSCE Gamified ED-TECH Platform</span>
              </Link>
            </div>

            <div className="rounded-[2rem] border border-white/15 bg-white/10 p-3 shadow-2xl shadow-black/30 backdrop-blur-2xl">
              <div className="rounded-[1.6rem] bg-white px-8 py-8 shadow-2xl">
                <SignIn
                  appearance={clerkAuthAppearance}
                  path="/sign-in"
                  routing="path"
                  signUpUrl="/sign-up"
                  fallbackRedirectUrl="/dashboard"
                />
              </div>
            </div>

            <p className="mt-5 text-center text-sm text-slate-400">
              Learn daily. Earn XP. Build consistency.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

function MiniStat({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl">
      <div className="mb-3 text-emerald-200 [&>svg]:h-6 [&>svg]:w-6">
        {icon}
      </div>
      <p className="font-semibold">{title}</p>
    </div>
  );
}