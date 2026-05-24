import { notFound } from "next/navigation";
import Link from "next/link";
import {
  MOCK_SUBJECT,
  MOCK_PROGRESS,
  getModuleProgress,
} from "@/lib/mockData";
import { getModulesWithCustomTopics } from "@/lib/course";
import ProgressBar from "@/components/ui/ProgressBar";

interface SubjectPageProps {
  params: Promise<{ subjectId: string }>;
}

export default async function SubjectPage({ params }: SubjectPageProps) {
  const { subjectId } = await params;

  // Future: replace with Prisma query by subjectId
  if (subjectId !== MOCK_SUBJECT.id) notFound();

  const modules = await getModulesWithCustomTopics();
  const totalTopicsCount = modules.reduce((acc, m) => acc + m.topics.length, 0);
  const completedInCourse = MOCK_PROGRESS.completedTopics.filter(id => 
    modules.some(m => m.topics.some(t => t.id === id))
  ).length;
  const subjectProgress = totalTopicsCount > 0 ? Math.round((completedInCourse / totalTopicsCount) * 100) : 0;
  const completedModulesCount = modules.filter(m => getModuleProgress(m, MOCK_PROGRESS.completedTopics) === 100 || MOCK_PROGRESS.completedModules.includes(m.id)).length;

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/dashboard" className="hover:text-gray-300 transition" id="breadcrumb-dashboard">
          Dashboard
        </Link>
        <span>/</span>
        <span className="text-gray-300">{MOCK_SUBJECT.title}</span>
      </nav>

      {/* Hero Header */}
      <header
        className={`relative rounded-3xl p-8 bg-gradient-to-br ${MOCK_SUBJECT.coverColor} overflow-hidden shadow-2xl shadow-violet-900/30`}
      >
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-1/2 w-48 h-48 bg-black/10 rounded-full translate-y-1/2" />

        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-sm border border-white/20">
              {MOCK_SUBJECT.code}
            </span>
            <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-sm border border-white/20">
              Semester {MOCK_SUBJECT.semester}
            </span>
            <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-sm border border-white/20">
              {MOCK_SUBJECT.credits} Credits
            </span>
          </div>
          <h1 className="text-2xl lg:text-4xl font-bold text-white mb-2">
            {MOCK_SUBJECT.title}
          </h1>
          <p className="text-white/70 max-w-2xl text-sm lg:text-base">
            {MOCK_SUBJECT.description}
          </p>
          <p className="text-white/60 text-sm mt-3">👨‍🏫 {MOCK_SUBJECT.instructor}</p>
        </div>
      </header>

      {/* Progress Overview */}
      <section className="grid grid-cols-3 gap-4">
        {[
          { id: "ov-topics", label: "Topics Done", value: `${completedInCourse}`, total: `/${totalTopicsCount}` },
          { id: "ov-modules", label: "Modules Done", value: `${completedModulesCount}`, total: `/${modules.length}` },
          { id: "ov-completion", label: "Completion", value: `${subjectProgress}`, total: "%" },
        ].map((item) => (
          <div key={item.id} id={item.id} className="glass rounded-2xl p-5 text-center">
            <p className="text-3xl font-bold gradient-text">
              {item.value}
              <span className="text-lg text-gray-500 font-normal">{item.total}</span>
            </p>
            <p className="text-sm text-gray-400 mt-1">{item.label}</p>
          </div>
        ))}
      </section>

      {/* Overall progress bar */}
      <div className="glass rounded-2xl p-5">
        <ProgressBar value={subjectProgress} showLabel height="h-3" id="subject-overview-progress" />
      </div>

      {/* Modules List */}
      <section>
        <h2 className="text-lg font-semibold text-white mb-4">Course Modules</h2>
        <div className="space-y-3">
          {modules.map((mod) => {
            const prog = getModuleProgress(mod, MOCK_PROGRESS.completedTopics);
            const completed = MOCK_PROGRESS.completedModules.includes(mod.id) || prog === 100;
            const videoCount = mod.topics.filter((t) => t.type === "video").length;
            const quizCount = mod.topics.filter((t) => t.type === "quiz").length;
            const assignCount = mod.topics.filter((t) => t.type === "assignment").length;

            return (
              <div
                key={mod.id}
                id={`module-card-${mod.id}`}
                className={`glass rounded-2xl p-5 transition-all duration-200 glass-hover cursor-pointer`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    {/* Order badge */}
                    <div
                      className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${
                        completed
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : "bg-violet-600/20 text-violet-400 border border-violet-500/30"
                      }`}
                    >
                      {completed ? "✓" : mod.order}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className={`font-semibold text-white`}>
                          {mod.title}
                        </h3>
                        {completed && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-600/20 text-emerald-300 text-xs border border-emerald-500/30">
                            Completed
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-400 mt-0.5 line-clamp-1">{mod.description}</p>

                      <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
                        <span>{mod.topics.length} topics</span>
                        {videoCount > 0 && <span>🎬 {videoCount} videos</span>}
                        {quizCount > 0 && <span>📝 {quizCount} quizzes</span>}
                        {assignCount > 0 && <span>📋 {assignCount} assignments</span>}
                      </div>
                    </div>
                  </div>

                  {/* Progress ring placeholder + link */}
                  <div className="flex-shrink-0 flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-bold text-violet-300">{prog}%</p>
                      <p className="text-xs text-gray-500">complete</p>
                    </div>
                      <Link
                        href={`/subject/${MOCK_SUBJECT.id}/module/${mod.id}`}
                        id={`module-link-${mod.id}`}
                        className="flex-shrink-0 px-4 py-2 rounded-xl bg-violet-600/20 text-violet-300 text-sm font-medium border border-violet-500/30 hover:bg-violet-600/30 transition"
                      >
                        {completed ? "Review" : prog > 0 ? "Continue" : "Start"}
                      </Link>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-4">
                  <ProgressBar
                    value={prog}
                    colorClass={
                      completed
                        ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                        : "bg-gradient-to-r from-violet-500 to-indigo-500"
                    }
                    id={`mod-prog-bar-${mod.id}`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
