"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  PlusCircle,
  FolderOpen,
  Trash2,
  Video,
  BookOpen,
  Sliders,
  Sparkles,
  Search,
  CheckCircle,
  FileText,
  AlertCircle
} from "lucide-react";
import ProgressBar from "@/components/ui/ProgressBar";

interface StudentData {
  id: string;
  name: string;
  email: string;
  role: string;
  xp: number;
  coins: number;
  level: number;
  createdAt: string;
}

interface CustomTopicData {
  id: string;
  moduleId: string;
  title: string;
  type: string;
  durationMinutes: number;
  videoId?: string | null;
  ebookContent?: string | null;
  simulationUrl?: string | null;
  createdBy: string;
  createdAt: string;
}

interface FacultyDashboardClientProps {
  initialStudents: StudentData[];
  initialCustomTopics: CustomTopicData[];
}

const MODULES_LIST = [
  { id: "mod_01", title: "Module 1: Analysis of Basic Algorithms" },
  { id: "mod_02", title: "Module 2: Divide and Conquer Algorithms" },
  { id: "mod_03", title: "Module 3: Greedy Algorithms & DP" },
  { id: "mod_04", title: "Module 4: Backtracking & B&B" },
  { id: "mod_05", title: "Module 5: Computability Theory" },
];

export default function FacultyDashboardClient({
  initialStudents,
  initialCustomTopics,
}: FacultyDashboardClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"students" | "add" | "manage">("students");
  const [students, setStudents] = useState<StudentData[]>(initialStudents);
  const [customTopics, setCustomTopics] = useState<CustomTopicData[]>(initialCustomTopics);
  const [searchQuery, setSearchQuery] = useState("");

  // Form states
  const [moduleId, setModuleId] = useState("mod_01");
  const [contentType, setContentType] = useState<"video" | "reading" | "simulation">("video");
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState(15);
  const [videoId, setVideoId] = useState("");
  const [ebookContent, setEbookContent] = useState("");
  const [simulationUrl, setSimulationUrl] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Filter students based on search
  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Form Submission
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);

    if (!title.trim()) {
      setError("Please enter a title");
      setLoading(false);
      return;
    }

    const payload: any = {
      moduleId,
      title,
      type: contentType,
      durationMinutes: duration,
    };

    if (contentType === "video") {
      if (!videoId.trim()) {
        setError("Please enter a YouTube video ID");
        setLoading(false);
        return;
      }
      payload.videoId = videoId.trim();
    } else if (contentType === "reading") {
      if (!ebookContent.trim()) {
        setError("Please enter the eBook reading content");
        setLoading(false);
        return;
      }
      payload.ebookContent = ebookContent.trim();
    } else if (contentType === "simulation") {
      if (!simulationUrl.trim()) {
        setError("Please enter the simulation iframe URL");
        setLoading(false);
        return;
      }
      payload.simulationUrl = simulationUrl.trim();
    }

    try {
      const res = await fetch("/api/faculty/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add content");

      setSuccessMsg(`"${title}" has been successfully added!`);
      setTitle("");
      setVideoId("");
      setEbookContent("");
      setSimulationUrl("");

      // Update state dynamically
      setCustomTopics([data.topic, ...customTopics]);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  // Deletion Handling
  async function handleDelete(id: string, name: string) {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      const res = await fetch(`/api/faculty/content?id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete content");

      setCustomTopics(customTopics.filter((ct) => ct.id !== id));
      router.refresh();
    } catch (err: any) {
      alert(err.message || "Failed to delete item");
    }
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Title Header */}
      <header className="flex flex-col gap-2">
        <p className="text-gray-500 text-sm font-medium">KJSCE Curriculum Control</p>
        <h1 className="text-3xl font-black text-white flex items-center gap-3">
          <span>👨‍🏫 Faculty Portal</span>
          <span className="text-xs px-2.5 py-1 rounded-full bg-violet-600/20 text-violet-300 border border-violet-500/30">
            Teacher Role
          </span>
        </h1>
      </header>

      {/* Stats Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="glass rounded-2xl p-5 flex items-center gap-4 border border-white/5">
          <div className="w-12 h-12 rounded-xl bg-violet-600/20 flex items-center justify-center text-violet-400">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Total Students</p>
            <p className="text-2xl font-bold text-white mt-0.5">{students.length}</p>
          </div>
        </div>
        <div className="glass rounded-2xl p-5 flex items-center gap-4 border border-white/5">
          <div className="w-12 h-12 rounded-xl bg-emerald-600/20 flex items-center justify-center text-emerald-400">
            <PlusCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Custom Resources</p>
            <p className="text-2xl font-bold text-white mt-0.5">{customTopics.length}</p>
          </div>
        </div>
        <div className="glass rounded-2xl p-5 flex items-center gap-4 border border-white/5">
          <div className="w-12 h-12 rounded-xl bg-indigo-600/20 flex items-center justify-center text-indigo-400">
            <FolderOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Syllabus Modules</p>
            <p className="text-2xl font-bold text-white mt-0.5">{MODULES_LIST.length}</p>
          </div>
        </div>
      </section>

      {/* Tabs Menu */}
      <div className="flex border-b border-gray-800 gap-2 flex-wrap">
        <button
          onClick={() => setActiveTab("students")}
          className={`flex items-center gap-2 px-5 py-3 font-semibold text-sm transition-all border-b-2 cursor-pointer ${
            activeTab === "students"
              ? "border-violet-500 text-violet-400"
              : "border-transparent text-gray-400 hover:text-gray-200"
          }`}
        >
          <Users className="w-4 h-4" />
          Student Progress
        </button>
        <button
          onClick={() => setActiveTab("add")}
          className={`flex items-center gap-2 px-5 py-3 font-semibold text-sm transition-all border-b-2 cursor-pointer ${
            activeTab === "add"
              ? "border-violet-500 text-violet-400"
              : "border-transparent text-gray-400 hover:text-gray-200"
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          Add Course Material
        </button>
        <button
          onClick={() => setActiveTab("manage")}
          className={`flex items-center gap-2 px-5 py-3 font-semibold text-sm transition-all border-b-2 cursor-pointer ${
            activeTab === "manage"
              ? "border-violet-500 text-violet-400"
              : "border-transparent text-gray-400 hover:text-gray-200"
          }`}
        >
          <FolderOpen className="w-4 h-4" />
          Manage Uploads
        </button>
      </div>

      {/* Tab Contents */}
      <main className="glass rounded-3xl p-6 min-h-[400px]">
        {/* Tab 1: Student Progress */}
        {activeTab === "students" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <h2 className="text-lg font-bold text-white">Students Progress Log</h2>
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 pl-10 pr-4 rounded-xl border border-gray-800 bg-gray-900/50 text-sm text-gray-200 outline-none focus:border-violet-500/50"
                />
              </div>
            </div>

            {filteredStudents.length === 0 ? (
              <p className="text-center text-gray-500 py-10">No students registered yet.</p>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-gray-800">
                <table className="w-full border-collapse text-left text-sm text-gray-400">
                  <thead className="bg-gray-900/75 text-gray-300 font-semibold border-b border-gray-800">
                    <tr>
                      <th className="p-4">Name / Email</th>
                      <th className="p-4">Level</th>
                      <th className="p-4">XP Points</th>
                      <th className="p-4">Course Progress</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800 bg-gray-950/20">
                    {filteredStudents.map((student) => {
                      const computedProgress = Math.min(Math.round((student.xp / 1500) * 100), 100);
                      return (
                        <tr key={student.id} className="hover:bg-white/5 transition-all">
                          <td className="p-4">
                            <p className="font-semibold text-white">{student.name}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{student.email}</p>
                          </td>
                          <td className="p-4">
                            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                              Lvl {student.level}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="font-bold text-white">{student.xp} XP</span>
                          </td>
                          <td className="p-4 max-w-[200px]">
                            <div className="flex items-center gap-3">
                              <span className="font-semibold text-xs text-violet-300">{computedProgress}%</span>
                              <div className="flex-1">
                                <ProgressBar value={computedProgress} height="h-1.5" />
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Add Content */}
        {activeTab === "add" && (
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-lg font-bold text-white mb-2">Upload New Material</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Target Module */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Target Syllabus Module</label>
                <select
                  value={moduleId}
                  onChange={(e) => setModuleId(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl border border-gray-800 bg-gray-950 text-sm text-gray-200 focus:border-violet-500/50 outline-none"
                >
                  {MODULES_LIST.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Resource Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Resource Type</label>
                <div className="grid grid-cols-3 gap-3">
                  {(["video", "reading", "simulation"] as const).map((t) => {
                    const active = contentType === t;
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setContentType(t)}
                        className={`h-12 border rounded-xl flex items-center justify-center gap-2 text-sm font-semibold transition cursor-pointer ${
                          active
                            ? "bg-violet-600/10 border-violet-500 text-violet-400"
                            : "border-gray-800 bg-gray-950/20 text-gray-400 hover:bg-gray-800/40 hover:text-gray-200"
                        }`}
                      >
                        {t === "video" && <Video className="w-4 h-4" />}
                        {t === "reading" && <BookOpen className="w-4 h-4" />}
                        {t === "simulation" && <Sliders className="w-4 h-4" />}
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* General Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Material Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Prim's Algorithm Visual Analysis"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl border border-gray-800 bg-gray-950 text-sm text-gray-200 focus:border-violet-500/50 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Duration (mins)</label>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value) || 15)}
                    className="w-full h-12 px-4 rounded-xl border border-gray-800 bg-gray-950 text-sm text-gray-200 focus:border-violet-500/50 outline-none"
                  />
                </div>
              </div>

              {/* Dynamic Form Context fields */}
              {contentType === "video" && (
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">YouTube Video ID</label>
                  <input
                    type="text"
                    placeholder="e.g. Hoixgm4-P4M"
                    value={videoId}
                    onChange={(e) => setVideoId(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl border border-gray-800 bg-gray-950 text-sm text-gray-200 focus:border-violet-500/50 outline-none font-mono"
                  />
                  <p className="text-xs text-gray-500 mt-1.5">Enter the 11-character video ID from the YouTube URL (e.g. youtube.com/watch?v=<b>ID_HERE</b>).</p>
                </div>
              )}

              {contentType === "reading" && (
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">eBook Reading Material (HTML Supported)</label>
                  <textarea
                    placeholder="<h1>Sorting Algorithms</h1><p>Here is an introduction...</p>"
                    rows={8}
                    value={ebookContent}
                    onChange={(e) => setEbookContent(e.target.value)}
                    className="w-full p-4 rounded-xl border border-gray-800 bg-gray-950 text-sm text-gray-200 focus:border-violet-500/50 outline-none font-mono"
                  />
                  <p className="text-xs text-gray-500 mt-1.5">You can use standard HTML formatting (e.g., &lt;h1&gt;, &lt;p&gt;, &lt;strong&gt;, &lt;ul&gt;).</p>
                </div>
              )}

              {contentType === "simulation" && (
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Simulation Visualizer URL</label>
                  <input
                    type="url"
                    placeholder="e.g. https://visualgo.net/en/sssp"
                    value={simulationUrl}
                    onChange={(e) => setSimulationUrl(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl border border-gray-800 bg-gray-950 text-sm text-gray-200 focus:border-violet-500/50 outline-none"
                  />
                  <p className="text-xs text-gray-500 mt-1.5">Enter the direct visualizer URL that can be safely embedded in an iframe.</p>
                </div>
              )}

              {/* Status Notifications */}
              {error && (
                <div className="flex gap-2 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-400">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <p>{error}</p>
                </div>
              )}
              {successMsg && (
                <div className="flex gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-sm text-emerald-400">
                  <CheckCircle className="w-5 h-5 shrink-0" />
                  <p>{successMsg}</p>
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 font-bold text-white shadow-lg shadow-violet-900/20 hover:from-violet-500 hover:to-indigo-500 cursor-pointer transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Adding..." : "Add to Module"}
              </button>
            </form>
          </div>
        )}

        {/* Tab 3: Manage Uploads */}
        {activeTab === "manage" && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-white">Manage Faculty Uploads</h2>

            {customTopics.length === 0 ? (
              <p className="text-center text-gray-500 py-10">No custom resources have been uploaded to modules yet.</p>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-gray-800">
                <table className="w-full border-collapse text-left text-sm text-gray-400">
                  <thead className="bg-gray-900/75 text-gray-300 font-semibold border-b border-gray-800">
                    <tr>
                      <th className="p-4">Resource</th>
                      <th className="p-4">Module</th>
                      <th className="p-4">Type</th>
                      <th className="p-4">Duration</th>
                      <th className="p-4">Uploaded By</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800 bg-gray-950/20">
                    {customTopics.map((ct) => (
                      <tr key={ct.id} className="hover:bg-white/5 transition-all">
                        <td className="p-4">
                          <span className="font-semibold text-white block truncate max-w-[240px]">
                            {ct.title}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-gray-800 text-gray-400">
                            {MODULES_LIST.find((m) => m.id === ct.moduleId)?.title.split(":")[0] || ct.moduleId}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="capitalize">{ct.type}</span>
                        </td>
                        <td className="p-4">{ct.durationMinutes} min</td>
                        <td className="p-4 text-gray-300 font-medium">{ct.createdBy}</td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleDelete(ct.id, ct.title)}
                            className="text-gray-500 hover:text-red-400 p-1.5 hover:bg-red-500/10 rounded-lg transition"
                            aria-label="Delete resource"
                          >
                            <Trash2 className="w-4.5 h-4.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
