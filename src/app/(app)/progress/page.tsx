import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import {
  MOCK_SUBJECT,
  MOCK_PROGRESS,
  getModuleProgress,
} from "@/lib/mockData";
import { getModulesWithCustomTopics } from "@/lib/course";
import ProgressBar from "@/components/ui/ProgressBar";
import TopicTypeBadge from "@/components/ui/TopicTypeBadge";
import { prisma } from "@/lib/prisma";

export default async function ProgressPage() {
  const user = await currentUser();

  const firstName =
    user?.firstName ||
    user?.fullName?.split(" ")[0] ||
    user?.emailAddresses[0]?.emailAddress.split("@")[0] ||
    "Learner";

  let dbUser = null;
  try {
    dbUser = user
      ? await prisma.user.findUnique({
          where: { clerkId: user.id },
        })
      : null;
  } catch (error) {
    console.error("Failed to fetch user from database for progress page, using fallbacks:", error);
  }

  // Load modules dynamically including any custom topics added by faculty/admin
  const modules = await getModulesWithCustomTopics();

  const completedCount = MOCK_PROGRESS.completedTopics.filter(id => 
    modules.some(m => m.topics.some(t => t.id === id))
  ).length;
  const totalTopics = modules.reduce((acc, m) => acc + m.topics.length, 0);
  const subjectProgress = totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;

  // Stats for the user
  const level = dbUser?.level ?? 1;
  const xp = dbUser?.xp ?? 0;
  const coins = dbUser?.coins ?? 0;

  // Quizzes count
  const allQuizzes = modules.flatMap((m) => m.topics.filter((t) => t.type === "quiz"));
  const completedQuizzes = allQuizzes.filter((q) => MOCK_PROGRESS.completedTopics.includes(q.id));

  return (
    <main className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8 text-white">
      {/* Title Header */}
      <header className="space-y-1">
        <h1 className="text-3xl font-bold text-white tracking-tight" id="progress-page-title">
          My Progress
        </h1>
        <p className="text-sm text-gray-400">
          Track your achievements, topics completed, and quiz performance for {MOCK_SUBJECT.title}.
        </p>
      </header>

      {/* Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Progress Circular Card */}
        <section
          aria-label="Overall Course Progress"
          className="md:col-span-2 glass rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden"
          id="course-progress-card"
        >
          <div className="absolute top-[-30%] right-[-10%] w-[300px] h-[300px] bg-violet-600/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-[-30%] left-[-10%] w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-violet-300 uppercase tracking-wider">
                Course Completion
              </span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-violet-500/20 text-violet-200 border border-violet-500/30">
                {MOCK_SUBJECT.code}
              </span>
            </div>
            <h2 className="text-xl font-bold mb-2">{MOCK_SUBJECT.title}</h2>
            <p className="text-sm text-gray-400 mb-6 line-clamp-2">{MOCK_SUBJECT.description}</p>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-end text-sm">
              <span className="text-gray-400 font-medium">
                Completed {completedCount} of {totalTopics} topics
              </span>
              <span className="text-2xl font-black text-violet-300">{subjectProgress}%</span>
            </div>
            <ProgressBar value={subjectProgress} colorClass="bg-gradient-to-r from-violet-600 to-cyan-400" id="overall-progress" />
          </div>
        </section>

        {/* Level & Reward Stats */}
        <section
          aria-label="Student Stats"
          className="glass rounded-3xl p-6 flex flex-col justify-between bg-gradient-to-br from-gray-900/50 to-gray-950/70 border border-gray-800/80"
          id="stats-rewards-card"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-xl shadow-lg shadow-violet-500/20">
              👑
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Rank Title</p>
              <h3 className="text-lg font-bold text-white">Algorithm Cadet</h3>
            </div>
          </div>

          <div className="space-y-5 my-2">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">⭐</span>
                <span className="text-sm text-gray-300 font-medium">Level</span>
              </div>
              <span className="font-extrabold text-white text-lg">{level}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">⚡</span>
                <span className="text-sm text-gray-300 font-medium">Total XP</span>
              </div>
              <span className="font-extrabold text-violet-300 text-lg">{xp.toLocaleString()}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">🪙</span>
                <span className="text-sm text-gray-300 font-medium">Coins</span>
              </div>
              <span className="font-extrabold text-cyan-400 text-lg">{coins}</span>
            </div>
          </div>

          <div className="text-xs text-center text-gray-500">
            Next level at {(level * 1000).toLocaleString()} XP
          </div>
        </section>
      </div>

      {/* Main content split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Modules Breakdown */}
        <section className="lg:col-span-2 space-y-6" aria-labelledby="modules-breakdown-heading">
          <h2 className="text-xl font-bold text-white mb-4" id="modules-breakdown-heading">
            Module Progress & Topics
          </h2>

          <div className="space-y-4">
            {modules.map((mod) => {
              const modProgress = getModuleProgress(mod, MOCK_PROGRESS.completedTopics);
              const isModCompleted = MOCK_PROGRESS.completedModules.includes(mod.id) || modProgress === 100;

              return (
                <details
                  key={mod.id}
                  className="group glass rounded-3xl border border-white/10 overflow-hidden transition-all duration-200"
                  id={`module-details-${mod.id}`}
                >
                  <summary className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden hover:bg-white/5 transition">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-xs font-semibold text-violet-400">
                          Module {mod.order}
                        </span>
                        {isModCompleted ? (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            Completed
                          </span>
                        ) : (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                            Active
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-white group-open:text-violet-300 transition">
                        {mod.title}
                      </h3>
                      <p className="text-xs text-gray-400 mt-1 line-clamp-1">{mod.description}</p>
                    </div>

                    <div className="flex items-center gap-4 min-w-[180px]">
                      <div className="flex-1 space-y-1">
                        <div className="flex justify-between text-xs text-gray-400 font-semibold">
                          <span>Progress</span>
                          <span>{modProgress}%</span>
                        </div>
                        <ProgressBar
                          value={modProgress}
                          colorClass={
                            isModCompleted
                              ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                              : "bg-gradient-to-r from-violet-500 to-indigo-500"
                          }
                          id={`mod-bar-${mod.id}`}
                        />
                      </div>
                      <span className="text-gray-400 group-open:rotate-180 transition-transform duration-200">
                        ▼
                      </span>
                    </div>
                  </summary>

                  {/* List of Topics */}
                  <div className="border-t border-white/10 bg-black/20 p-4 space-y-2">
                    {mod.topics.map((topic) => {
                      const isTopicDone = MOCK_PROGRESS.completedTopics.includes(topic.id);

                      return (
                        <div
                          key={topic.id}
                          className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 transition text-sm gap-4"
                          id={`topic-row-${topic.id}`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="flex-shrink-0">
                              {isTopicDone ? (
                                <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xs font-bold">
                                  ✓
                                </div>
                              ) : (
                                <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 text-xs font-semibold">
                                  •
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className={`font-semibold truncate ${isTopicDone ? "text-gray-400 line-through" : "text-gray-200"}`}>
                                {topic.title}
                              </p>
                              <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-500">
                                <span>⏱ {topic.durationMinutes} min</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex-shrink-0">
                            <TopicTypeBadge type={topic.type} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </details>
              );
            })}
          </div>
        </section>

        {/* Quizzes and performance */}
        <section className="space-y-6" aria-labelledby="quizzes-performance-heading">
          <h2 className="text-xl font-bold text-white" id="quizzes-performance-heading">
            Quiz Analytics
          </h2>

          <div className="glass rounded-3xl p-5 space-y-5" id="quiz-analytics-card">
            <div className="flex justify-between items-center pb-4 border-b border-white/10">
              <div>
                <p className="text-xs text-gray-400 font-medium">Completed Quizzes</p>
                <h3 className="text-2xl font-black text-white">
                  {completedQuizzes.length} / {allQuizzes.length}
                </h3>
              </div>
              <div className="text-3xl">📝</div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                My Scores
              </h4>

              {allQuizzes.map((quiz) => {
                const score = MOCK_PROGRESS.quizScores[quiz.id];
                const isTaken = score !== undefined;

                return (
                  <div
                    key={quiz.id}
                    className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between gap-4"
                    id={`quiz-score-${quiz.id}`}
                  >
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-gray-200 truncate">
                        {quiz.title.replace("Quiz: ", "")}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {isTaken ? "Completed" : "Not attempted yet"}
                      </p>
                    </div>

                    <div>
                      {isTaken ? (
                        <span className="text-sm font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-xl">
                          {score}%
                        </span>
                      ) : (
                        <span className="text-xs font-semibold text-gray-400 bg-white/5 border border-white/10 px-2.5 py-1 rounded-xl">
                          0%
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
