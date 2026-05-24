"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSignUp } from "@clerk/nextjs/legacy";
import {
  Gamepad2,
  Brain,
  Coins,
  Sparkles,
  Eye,
  EyeOff,
  MailCheck,
  AlertCircle,
} from "lucide-react";

export default function SignUpPage() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");

  const [pendingVerification, setPendingVerification] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignUp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!isLoaded) return;

    setError("");
    setLoading(true);

    try {
      await signUp.create({
        emailAddress,
        password,
      });

      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      setPendingVerification(true);
    } catch (err: any) {
      setError(
        err?.errors?.[0]?.message ||
        "Something went wrong while creating your account."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyCode(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!isLoaded || !setActive) return;

    setError("");
    setLoading(true);

    try {
      const completeSignUp =
        await signUp.attemptEmailAddressVerification({
          code,
        });

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        router.push("/dashboard");
      } else {
        setError("Verification is not complete. Please try again.");
      }
    } catch (err: any) {
      setError(
        err?.errors?.[0]?.message ||
        "Invalid verification code. Please check your Gmail and try again."
      );
    } finally {
      setLoading(false);
    }
  }

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
              Start your learning journey
            </div>

            <h1 className="max-w-xl text-6xl font-black leading-tight">
              Create your account and{" "}
              <span className="bg-gradient-to-r from-emerald-300 to-cyan-200 bg-clip-text text-transparent">
                start earning XP.
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-8 text-slate-300">
              Join lessons, complete quizzes, unlock coins, defeat boss battles,
              and improve with AI-personalized practice.
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
              <div className="rounded-[1.6rem] bg-white px-8 py-8 text-slate-950 shadow-2xl">
                {!pendingVerification ? (
                  <>
                    <div className="mb-7 text-center">
                      <h2 className="text-3xl font-black text-slate-950">
                        Create your account
                      </h2>
                      <p className="mt-2 text-sm text-slate-500">
                        Enter your details to start your learning quest.
                      </p>
                    </div>

                    <form onSubmit={handleSignUp} className="space-y-5">
                      <div>
                        <label
                          htmlFor="email"
                          className="mb-2 block text-sm font-semibold text-slate-700"
                        >
                          Email address
                        </label>
                        <input
                          id="email"
                          type="email"
                          value={emailAddress}
                          onChange={(e) => setEmailAddress(e.target.value)}
                          placeholder="Enter your email address"
                          required
                          className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="password"
                          className="mb-2 block text-sm font-semibold text-slate-700"
                        >
                          Password
                        </label>

                        <div className="relative">
                          <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Create a password"
                            required
                            className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                          />

                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          >
                            {showPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </div>

                      {error && <ErrorMessage message={error} />}

                      <button
                        type="submit"
                        disabled={loading}
                        className="h-12 w-full rounded-2xl bg-gradient-to-r from-emerald-600 to-cyan-500 font-bold text-white shadow-lg shadow-emerald-500/25 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {loading ? "Sending code..." : "Create account"}
                      </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-slate-500">
                      Already have an account?{" "}
                      <Link
                        href="/sign-in"
                        className="font-bold text-emerald-600 hover:text-emerald-700"
                      >
                        Sign in
                      </Link>
                    </p>
                  </>
                ) : (
                  <>
                    <div className="mb-7 text-center">
                      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                        <MailCheck className="h-7 w-7" />
                      </div>

                      <h2 className="text-3xl font-black text-slate-950">
                        Verify your Gmail
                      </h2>
                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        We sent a verification code to{" "}
                        <span className="font-semibold text-slate-700">
                          {emailAddress}
                        </span>
                        . Enter it below to complete sign up.
                      </p>
                    </div>

                    <form onSubmit={handleVerifyCode} className="space-y-5">
                      <div>
                        <label
                          htmlFor="code"
                          className="mb-2 block text-sm font-semibold text-slate-700"
                        >
                          Verification code
                        </label>
                        <input
                          id="code"
                          type="text"
                          value={code}
                          onChange={(e) => setCode(e.target.value)}
                          placeholder="Enter verification code"
                          required
                          className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-center text-lg font-bold tracking-[0.35em] text-slate-900 outline-none transition placeholder:text-sm placeholder:font-normal placeholder:tracking-normal placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                        />
                      </div>

                      {error && <ErrorMessage message={error} />}

                      <button
                        type="submit"
                        disabled={loading}
                        className="h-12 w-full rounded-2xl bg-gradient-to-r from-emerald-600 to-cyan-500 font-bold text-white shadow-lg shadow-emerald-500/25 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {loading ? "Verifying..." : "Verify email"}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setPendingVerification(false);
                          setCode("");
                          setError("");
                        }}
                        className="w-full text-sm font-semibold text-slate-500 hover:text-slate-700"
                      >
                        Change email address
                      </button>
                    </form>
                  </>
                )}
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

function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="flex gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
      <p>{message}</p>
    </div>
  );
}