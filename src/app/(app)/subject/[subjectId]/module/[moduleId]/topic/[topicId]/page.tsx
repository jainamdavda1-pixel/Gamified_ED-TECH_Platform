import { notFound } from "next/navigation";
import Link from "next/link";
import {
  MOCK_SUBJECT,
  MOCK_PROGRESS,
} from "@/lib/mockData";
import { getModulesWithCustomTopics } from "@/lib/course";
import TopicTypeBadge from "@/components/ui/TopicTypeBadge";
import SimulationPlayer from "@/components/ui/SimulationPlayer";

interface TopicPageProps {
  params: Promise<{ subjectId: string; moduleId: string; topicId: string }>;
}

export default async function TopicPage({ params }: TopicPageProps) {
  const { subjectId, moduleId, topicId } = await params;

  if (subjectId !== MOCK_SUBJECT.id) notFound();

  const modules = await getModulesWithCustomTopics();
  const mod = modules.find((m) => m.id === moduleId);
  if (!mod) notFound();

  const topic = mod.topics.find((t) => t.id === topicId);
  if (!topic) notFound();

  const isCompleted = MOCK_PROGRESS.completedTopics.includes(topic.id);

  const topicIndex = mod.topics.findIndex((t) => t.id === topicId);
  const nextTopic = mod.topics[topicIndex + 1] ?? null;
  const prevTopic = mod.topics[topicIndex - 1] ?? null;

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
        <Link href="/dashboard" className="hover:text-gray-300 transition">
          Dashboard
        </Link>
        <span>/</span>
        <Link href={`/subject/${MOCK_SUBJECT.id}`} className="hover:text-gray-300 transition">
          {MOCK_SUBJECT.code}
        </Link>
        <span>/</span>
        <Link href={`/subject/${MOCK_SUBJECT.id}/module/${mod.id}`} className="hover:text-gray-300 transition">
          {mod.title}
        </Link>
        <span>/</span>
        <span className="text-gray-300 font-medium">{topic.title}</span>
      </nav>

      {/* Header */}
      <header className="glass rounded-3xl p-7 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <TopicTypeBadge type={topic.type} />
            <span className="text-xs text-gray-500">⏱ {topic.durationMinutes} min</span>
            {isCompleted && (
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-600/20 text-emerald-300 border border-emerald-500/30">
                ✅ Completed
              </span>
            )}
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">{topic.title}</h1>
        </div>
      </header>

      {/* Content Area */}
      <main className="glass rounded-3xl p-7 min-h-[500px]">
        {topic.type === "video" && topic.videoId && (
          <div className="aspect-video w-full rounded-2xl overflow-hidden bg-gray-900 border border-gray-800">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${topic.videoId}`}
              title={topic.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        )}

        {topic.type === "reading" && topic.ebookContent && (
          <div className="prose prose-invert max-w-none prose-violet">
            <div dangerouslySetInnerHTML={{ __html: topic.ebookContent }} />
          </div>
        )}

        {topic.type === "quiz" && topic.quizQuestions && (
          <div className="space-y-6">
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-200 mb-6">
              <h3 className="font-semibold mb-1">Knowledge Check</h3>
              <p className="text-sm">Answer the following questions to complete this topic.</p>
            </div>
            
            {topic.quizQuestions.map((q, idx) => (
              <div key={q.id} className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                <p className="font-medium text-white mb-4">
                  <span className="text-gray-500 mr-2">{idx + 1}.</span>
                  {q.question}
                </p>
                <div className="space-y-2">
                  {q.options.map((opt, optIdx) => (
                    <label key={optIdx} className="flex items-center gap-3 p-3 rounded-xl border border-gray-800 hover:border-violet-500/50 hover:bg-gray-800/50 cursor-pointer transition">
                      <input type="radio" name={`question-${q.id}`} value={optIdx} className="accent-violet-500" />
                      <span className="text-gray-300 text-sm">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
            
            <button className="mt-6 px-6 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold rounded-xl transition shadow-lg shadow-violet-900/30">
              Submit Answers
            </button>
          </div>
        )}

        {topic.type === "assignment" && topic.assignmentDescription && (
          <div className="prose prose-invert max-w-none prose-violet">
             <div className="whitespace-pre-wrap text-gray-300 font-mono text-sm bg-gray-900 p-6 rounded-2xl border border-gray-800">
               {topic.assignmentDescription}
             </div>
             <div className="mt-8 pt-6 border-t border-gray-800">
                <h3 className="text-lg font-semibold text-white mb-4">Submit Assignment</h3>
                <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-700 border-dashed rounded-2xl cursor-pointer hover:bg-gray-800/50 hover:border-violet-500/50 transition">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg className="w-8 h-8 mb-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <p className="mb-2 text-sm text-gray-400"><span className="font-semibold text-violet-400">Click to upload</span> or drag and drop</p>
                            <p className="text-xs text-gray-500">PDF, ZIP, or Jupyter Notebook</p>
                        </div>
                        <input type="file" className="hidden" />
                    </label>
                </div>
             </div>
          </div>
        )}

        {topic.type === "simulation" && topic.simulationUrl && (
          <div className="space-y-6">
             {/* Detailed explanation above the simulation */}
             {topic.ebookContent && (
               <div className="prose prose-invert max-w-none prose-violet">
                 <div dangerouslySetInnerHTML={{ __html: topic.ebookContent }} />
               </div>
             )}

             {/* Simulation banner + iframe */}
             <div className="p-4 bg-fuchsia-500/10 border border-fuchsia-500/20 rounded-xl text-fuchsia-200">
               <h3 className="font-semibold mb-1">🧪 Interactive Simulation</h3>
               <p className="text-sm">Now that you understand the theory, experiment with the visualizer below to see the algorithm execute step-by-step on real data.</p>
             </div>
             <SimulationPlayer url={topic.simulationUrl} title={topic.title} />
          </div>
        )}

        {topic.numericalsContent && (
           <div className="mt-8 pt-8 border-t border-gray-800">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span>🧮</span> Step-by-Step Numericals
              </h3>
              <div className="prose prose-invert max-w-none prose-emerald bg-emerald-950/20 border border-emerald-900/50 p-6 rounded-2xl">
                <div dangerouslySetInnerHTML={{ __html: topic.numericalsContent }} />
              </div>
           </div>
        )}
      </main>

      {/* Navigation Footer */}
      <nav className="flex items-center justify-between gap-4">
        {prevTopic ? (
          <Link
            href={`/subject/${MOCK_SUBJECT.id}/module/${mod.id}/topic/${prevTopic.id}`}
            className="flex items-center gap-2 px-4 py-2.5 glass rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:border-violet-500/40 transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Previous Topic
          </Link>
        ) : (
          <Link
            href={`/subject/${MOCK_SUBJECT.id}/module/${mod.id}`}
            className="flex items-center gap-2 px-4 py-2.5 glass rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:border-violet-500/40 transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Module
          </Link>
        )}

        {nextTopic ? (
          <Link
            href={`/subject/${MOCK_SUBJECT.id}/module/${mod.id}/topic/${nextTopic.id}`}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-600/30 to-indigo-600/30 border border-violet-500/40 rounded-xl text-sm font-medium text-violet-300 hover:from-violet-600/40 hover:to-indigo-600/40 transition-all"
          >
            {isCompleted ? "Next Topic" : "Complete & Continue"}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ) : (
          <Link
            href={`/subject/${MOCK_SUBJECT.id}/module/${mod.id}`}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600/30 to-teal-600/30 border border-emerald-500/40 rounded-xl text-sm font-medium text-emerald-300 hover:from-emerald-600/40 hover:to-teal-600/40 transition-all"
          >
            Finish Module
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </Link>
        )}
      </nav>
    </div>
  );
}
