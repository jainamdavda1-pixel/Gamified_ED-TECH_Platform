import { notFound } from "next/navigation";
import Link from "next/link";
import {
  MOCK_SUBJECT,
  MOCK_PROGRESS,
  getModuleProgress,
} from "@/lib/mockData";
import { getModulesWithCustomTopics } from "@/lib/course";
import ProgressBar from "@/components/ui/ProgressBar";
import TopicTypeBadge from "@/components/ui/TopicTypeBadge";

interface ModulePageProps {
  params: Promise<{ subjectId: string; moduleId: string }>;
}

export default async function ModulePage({ params }: ModulePageProps) {
  const { subjectId, moduleId } = await params;

  if (subjectId !== MOCK_SUBJECT.id) notFound();

  const modules = await getModulesWithCustomTopics();
  const mod = modules.find((m) => m.id === moduleId);
  if (!mod) notFound();

  const moduleIndex = modules.findIndex((m) => m.id === moduleId);
  const prevModule = modules[moduleIndex - 1] ?? null;
  const nextModule = modules[moduleIndex + 1] ?? null;

  const prog = getModuleProgress(mod, MOCK_PROGRESS.completedTopics);
  const isCompleted = MOCK_PROGRESS.completedModules.includes(mod.id) || prog === 100;
  const totalMinutes = mod.topics.reduce((a, t) => a + t.durationMinutes, 0);
  const doneTopics = mod.topics.filter((t) =>
    MOCK_PROGRESS.completedTopics.includes(t.id)
  ).length;

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
        <Link href="/dashboard" className="hover:text-gray-300 transition" id="bc-dashboard">
          Dashboard
        </Link>
        <span>/</span>
        <Link href={`/subject/${MOCK_SUBJECT.id}`} className="hover:text-gray-300 transition" id="bc-subject">
          {MOCK_SUBJECT.code}
        </Link>
        <span>/</span>
        <span className="text-gray-300 font-medium">{mod.title}</span>
      </nav>

      {/* Module Header */}
      <header className="glass rounded-3xl p-7">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-violet-600/20 text-violet-300 border border-violet-500/30">
                Module {mod.order}
              </span>
              {isCompleted && (
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-600/20 text-emerald-300 border border-emerald-500/30">
                  ✅ Completed
                </span>
              )}
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">{mod.title}</h1>
            <p className="text-gray-400 max-w-xl">{mod.description}</p>
          </div>

          {/* Circular progress visual */}
          <div className="flex-shrink-0 w-24 h-24 relative">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="#1f2937" strokeWidth="3" />
              <circle
                cx="18" cy="18" r="15.9" fill="none"
                stroke="url(#prog-grad)"
                strokeWidth="3"
                strokeDasharray={`${prog} ${100 - prog}`}
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="prog-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#7c3aed" />
                  <stop offset="100%" stopColor="#4f46e5" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-bold text-white">{prog}%</span>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex flex-wrap gap-6 mt-5 text-sm text-gray-400">
          <div className="flex items-center gap-1.5">
            <span className="text-violet-400">📋</span>
            <span>{mod.topics.length} topics</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-violet-400">✅</span>
            <span>{doneTopics} done</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-violet-400">⏱</span>
            <span>~{totalMinutes} min total</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <ProgressBar value={prog} height="h-2.5" id="module-progress-bar" />
        </div>
      </header>

      {/* Topics List */}
      <section>
        <h2 className="text-lg font-semibold text-white mb-4">Topics in this Module</h2>
        <div className="space-y-3">
          {mod.topics.map((topic, idx) => {
            const completed = MOCK_PROGRESS.completedTopics.includes(topic.id);
            const quizScore = MOCK_PROGRESS.quizScores[topic.id];
            const href = `/subject/${subjectId}/module/${moduleId}/topic/${topic.id}`;

            return (
              <Link
                key={topic.id}
                href={href}
                id={`topic-${topic.id}`}
                className="glass glass-hover rounded-2xl p-5 flex items-center gap-4 transition-all duration-150 cursor-pointer"
              >
                {/* Completion indicator */}
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all ${
                    completed
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                      : "bg-gray-800 text-gray-500 border border-gray-700"
                  }`}
                >
                  {completed ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span>{idx + 1}</span>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <p className={`font-medium ${completed ? "text-gray-300" : "text-white"}`}>
                        {topic.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <TopicTypeBadge type={topic.type} />
                        <span className="text-xs text-gray-500">⏱ {topic.durationMinutes} min</span>
                        {quizScore !== undefined && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                            Score: {quizScore}%
                          </span>
                        )}
                      </div>
                    </div>
                    <span
                      className={`flex-shrink-0 text-xs font-medium px-3 py-1.5 rounded-lg border ${
                        completed
                          ? "bg-gray-800 text-gray-400 border-gray-700"
                          : "bg-violet-600/20 text-violet-300 border-violet-500/30"
                      }`}
                    >
                      {completed ? "Review" : "Start →"}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Module Navigation */}
      <nav className="flex items-center justify-between gap-4">
        {prevModule ? (
          <Link
            href={`/subject/${MOCK_SUBJECT.id}/module/${prevModule.id}`}
            id="prev-module-link"
            className="flex items-center gap-2 px-4 py-2.5 glass rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:border-violet-500/40 transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {prevModule.title}
          </Link>
        ) : (
          <div />
        )}

        {nextModule ? (
          <Link
            href={`/subject/${MOCK_SUBJECT.id}/module/${nextModule.id}`}
            id="next-module-link"
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-600/30 to-indigo-600/30 border border-violet-500/40 rounded-xl text-sm font-medium text-violet-300 hover:from-violet-600/40 hover:to-indigo-600/40 transition-all"
          >
            {nextModule.title}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ) : (
          <div />
        )}
      </nav>
    </div>
  );
}
