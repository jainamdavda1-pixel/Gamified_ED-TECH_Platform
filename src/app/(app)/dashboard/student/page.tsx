import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import {
  MOCK_SUBJECT,
  MOCK_PROGRESS,
  getSubjectProgress,
  getModuleProgress,
} from "@/lib/mockData";
import { getModulesWithCustomTopics } from "@/lib/course";
import ProgressBar from "@/components/ui/ProgressBar";
import { prisma } from "@/lib/prisma";

export default async function StudentDashboardPage() {
  const user = await currentUser();

  const firstName =
    user?.firstName ||
    user?.fullName?.split(" ")[0] ||
    user?.emailAddresses[0]?.emailAddress.split("@")[0] ||
    "Learner";

  const profileImage = user?.imageUrl;

  let dbUser = null;
  try {
    dbUser = user
      ? await prisma.user.findUnique({
          where: { clerkId: user.id },
        })
      : null;
  } catch (error) {
    console.error("Failed to fetch user from database, using fallback values:", error);
  }

  // Load modules dynamically including any custom topics added by faculty/admin
  const modules = await getModulesWithCustomTopics();

  const subjectProgress = getSubjectProgress(MOCK_PROGRESS.completedTopics);
  const lastModule = modules.find(
    (m) => !MOCK_PROGRESS.completedModules.includes(m.id) && !m.isLocked
  );
  const nextTopic = lastModule?.topics.find(
    (t) => !MOCK_PROGRESS.completedTopics.includes(t.id)
  );

  const stats = [
    {
      id: "stat-progress",
      label: "Subject Progress",
      value: `${subjectProgress}%`,
      icon: "📈",
      sub: `${MOCK_PROGRESS.completedTopics.length}/${modules.reduce((acc, m) => acc + m.topics.length, 0)} topics`,
    },
    {
      id: "stat-xp",
      label: "Total XP",
      value: (dbUser?.xp ?? 0).toLocaleString(),
      icon: "⚡",
      sub: "Experience points",
    },
    {
      id: "stat-streak",
      label: "Study Streak",
      value: "0 days",
      icon: "🔥",
      sub: "Keep it going!",
    },
    {
      id: "stat-modules",
      label: "Modules Done",
      value: `${MOCK_PROGRESS.completedModules.length}/${MOCK_SUBJECT.totalModules}`,
      icon: "🏆",
      sub: "Modules completed",
    },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <header className="flex items-center justify-between gap-4">
        <div>
          <p className="text-gray-500 text-sm font-medium">Good evening 👋</p>
          <h1 className="text-2xl lg:text-3xl font-bold text-white mt-0.5">
            Welcome back, <span className="gradient-text">{firstName}</span>
          </h1>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
          {profileImage && (
            <img
              src={profileImage}
              alt={firstName}
              className="h-10 w-10 rounded-full object-cover"
            />
          )}

          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-white">
              {user?.fullName || firstName}
            </p>
            <p className="text-xs text-gray-400">
              {user?.emailAddresses[0]?.emailAddress}
            </p>
          </div>

          <UserButton />
        </div>
      </header>

      {/* Stats Grid */}
      <section aria-label="Stats" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.id}
            id={stat.id}
            className="glass glass-hover rounded-2xl p-4 flex flex-col gap-2"
          >
            <span className="text-2xl">{stat.icon}</span>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <div>
              <p className="text-sm font-medium text-gray-300">{stat.label}</p>
              <p className="text-xs text-gray-500">{stat.sub}</p>
            </div>
          </div>
        ))}
      </section>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Subject Card */}
        <section className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold text-white">My Subject</h2>
          <Link href={`/subject/${MOCK_SUBJECT.id}`} id="subject-card-link">
            <div className="glass glass-hover rounded-2xl p-6 cursor-pointer">
              <div
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r ${MOCK_SUBJECT.coverColor} text-white text-xs font-semibold mb-4`}
              >
                {MOCK_SUBJECT.code}
              </div>
              <h3 className="text-xl font-bold text-white mb-1">{MOCK_SUBJECT.title}</h3>
              <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                {MOCK_SUBJECT.description}
              </p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-4">
                <span>👨‍🏫 {MOCK_SUBJECT.instructor}</span>
                <span>🎓 {MOCK_SUBJECT.credits} Credits</span>
                <span>📚 Semester {MOCK_SUBJECT.semester}</span>
              </div>
              <ProgressBar value={subjectProgress} showLabel id="subject-progress-bar" />
            </div>
          </Link>

          {/* Module Progress Breakdown */}
          <div className="glass rounded-2xl p-6">
            <h3 className="text-base font-semibold text-white mb-4">Module Progress</h3>
            <div className="space-y-4">
              {modules.map((mod) => {
                const prog = getModuleProgress(mod, MOCK_PROGRESS.completedTopics);
                const completed = MOCK_PROGRESS.completedModules.includes(mod.id);
                return (
                  <div key={mod.id} id={`module-row-${mod.id}`}>
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <div className="flex items-center gap-2">
                        {completed ? (
                          <span className="text-emerald-400">✅</span>
                        ) : (
                          <span className="text-violet-400">▶</span>
                        )}
                        <span className="font-medium text-gray-200">
                          {mod.title}
                        </span>
                      </div>
                      <span className="font-semibold text-xs text-violet-300">
                        {prog}%
                      </span>
                    </div>
                    <ProgressBar
                      value={prog}
                      colorClass={
                        completed
                          ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                          : "bg-gradient-to-r from-violet-500 to-indigo-500"
                      }
                      id={`progress-${mod.id}`}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Continue Learning */}
          {nextTopic && lastModule && (
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">Continue Learning</h2>
              <Link href={`/subject/${MOCK_SUBJECT.id}/module/${lastModule.id}/topic/${nextTopic.id}`} id="continue-learning-link">
                <div className="rounded-2xl p-5 bg-gradient-to-br from-violet-600/30 to-indigo-700/30 border border-violet-500/30 hover:border-violet-400/50 transition-all duration-200 hover:-translate-y-0.5">
                  <p className="text-xs text-violet-300 font-medium mb-1">
                    {lastModule.title}
                  </p>
                  <p className="text-sm font-semibold text-white mb-3 text-wrap line-clamp-2">
                    {nextTopic.title}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                      ⏱ {nextTopic.durationMinutes} min
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-violet-600/40 text-violet-200 border border-violet-500/40">
                      Resume →
                    </span>
                  </div>
                </div>
              </Link>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
