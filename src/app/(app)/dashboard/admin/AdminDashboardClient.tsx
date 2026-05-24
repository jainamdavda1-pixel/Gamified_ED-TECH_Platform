"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Shield,
  FolderOpen,
  Trash2,
  Search,
  BookOpen,
  Sliders,
  Video,
  Activity,
  UserCheck,
  CheckCircle2,
  Calendar,
  Eye,
  ExternalLink,
  PlusCircle,
  AlertCircle,
  RefreshCw,
  BarChart2,
  ShieldAlert,
  Clock,
  Database
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

interface FacultyData {
  id: string;
  name: string;
  email: string;
  role: string;
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

interface AdminDashboardClientProps {
  initialStudents: StudentData[];
  initialFaculty: FacultyData[];
  initialCustomTopics: CustomTopicData[];
}

const MODULES_LIST = [
  { id: "mod_01", title: "Module 1: Analysis of Basic Algorithms" },
  { id: "mod_02", title: "Module 2: Divide and Conquer Algorithms" },
  { id: "mod_03", title: "Module 3: Greedy Algorithms & DP" },
  { id: "mod_04", title: "Module 4: Backtracking & B&B" },
  { id: "mod_05", title: "Module 5: Computability Theory" },
];

export default function AdminDashboardClient({
  initialStudents,
  initialFaculty,
  initialCustomTopics,
}: AdminDashboardClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"students" | "faculty" | "curriculum">("students");
  const [students, setStudents] = useState<StudentData[]>(initialStudents);
  const [faculty, setFaculty] = useState<FacultyData[]>(initialFaculty);
  const [customTopics, setCustomTopics] = useState<CustomTopicData[]>(initialCustomTopics);
  const [searchQuery, setSearchQuery] = useState("");
  const [previewItem, setPreviewItem] = useState<CustomTopicData | null>(null);

  // New Faculty Form State
  const [showAddFaculty, setShowAddFaculty] = useState(false);
  const [newFacName, setNewFacName] = useState("");
  const [newFacEmail, setNewFacEmail] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState([
    { id: "log-1", time: "2 mins ago", event: "Custom topic 'Prim's Alg' uploaded", user: "Dr. Chirag Desai", status: "info" },
    { id: "log-2", time: "1 hour ago", event: "eBook content 'Divide & Conquer' updated", user: "Dr. Anita Patil", status: "success" },
    { id: "log-3", time: "3 hours ago", event: "Student Jainam Davda reached Level 4", user: "System", status: "info" },
    { id: "log-4", time: "1 day ago", event: "Faculty access token generated", user: "Admin", status: "warning" },
  ]);

  // Search filters
  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFaculty = faculty.filter(
    (f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTopics = customTopics.filter((ct) =>
    ct.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ct.createdBy.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate module completion stats
  const moduleCompletionStats = MODULES_LIST.map((mod) => {
    const completedCount = students.filter((s) => {
      if (mod.id === "mod_01") return s.xp >= 300;
      if (mod.id === "mod_02") return s.xp >= 600;
      if (mod.id === "mod_03") return s.xp >= 900;
      if (mod.id === "mod_04") return s.xp >= 1200;
      if (mod.id === "mod_05") return s.xp >= 1500;
      return false;
    }).length;
    const percentage = students.length > 0 ? Math.round((completedCount / students.length) * 100) : 0;
    return {
      ...mod,
      completedCount,
      percentage,
    };
  });

  // Calculate curriculum distributions
  const videoCount = customTopics.filter((t) => t.type === "video").length;
  const readingCount = customTopics.filter((t) => t.type === "reading").length;
  const simulationCount = customTopics.filter((t) => t.type === "simulation").length;
  const totalUploads = customTopics.length;

  // Moderate/delete topic
  async function handleDelete(id: string, name: string) {
    if (!confirm(`ADMIN MODERATION: Are you sure you want to delete and remove "${name}" from the curriculum?`)) return;

    try {
      const res = await fetch(`/api/faculty/content?id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete content");

      setCustomTopics(customTopics.filter((ct) => ct.id !== id));
      
      // Log moderation action
      setAuditLogs([
        {
          id: `log-${Date.now()}`,
          time: "Just now",
          event: `Removed curriculum resource '${name}'`,
          user: "Admin",
          status: "warning"
        },
        ...auditLogs
      ]);

      router.refresh();
    } catch (err: any) {
      alert(err.message || "Failed to delete item");
    }
  }

  // Handle adding new Faculty member in client state
  function handleAddFaculty(e: React.FormEvent) {
    e.preventDefault();
    if (!newFacName || !newFacEmail) return;

    const newFacultyMember = {
      id: `fac-${Date.now()}`,
      name: newFacName,
      email: newFacEmail,
      role: "TEACHER",
      createdAt: new Date().toISOString()
    };

    setFaculty([newFacultyMember, ...faculty]);
    setAuditLogs([
      {
        id: `log-${Date.now()}`,
        time: "Just now",
        event: `Registered new faculty member '${newFacName}'`,
        user: "Admin",
        status: "success"
      },
      ...auditLogs
    ]);

    setNewFacName("");
    setNewFacEmail("");
    setFormSuccess(`Registered ${newFacName} successfully!`);
    setTimeout(() => setFormSuccess(""), 4000);
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Title Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-red-950/20 pb-5">
        <div>
          <p className="text-red-500 text-xs font-bold uppercase tracking-widest">KJSCE Command Center</p>
          <h1 className="text-3xl font-black text-white flex items-center gap-3 mt-1">
            <span>🛡️ Admin Console</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/30 uppercase font-black tracking-wider">
              Root
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs text-gray-500">System Status</p>
            <p className="text-xs text-emerald-400 font-bold flex items-center gap-1.5 justify-end">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              All Systems Operational
            </p>
          </div>
          <button 
            onClick={() => router.refresh()}
            className="p-2.5 rounded-xl border border-gray-800 bg-gray-900/50 text-gray-400 hover:text-white hover:bg-gray-800 transition"
            title="Refresh System Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Admin Quick Metrics Panel */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Active Students", value: students.length, icon: Users, color: "from-violet-500/10 to-indigo-500/10 border-violet-500/30 text-violet-400" },
          { label: "Faculty Directory", value: faculty.length, icon: UserCheck, color: "from-emerald-500/10 to-teal-500/10 border-emerald-500/30 text-emerald-400" },
          { label: "Curriculum Assets", value: customTopics.length, icon: FolderOpen, color: "from-red-500/10 to-rose-500/10 border-red-500/30 text-red-400" },
          { label: "Pending Flags", value: 0, icon: ShieldAlert, color: "from-amber-500/10 to-orange-500/10 border-amber-500/20 text-amber-400" },
        ].map((item, idx) => (
          <div key={idx} className={`bg-gradient-to-br ${item.color} border rounded-2xl p-5 flex items-center justify-between shadow-xl`}>
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{item.label}</p>
              <p className="text-2xl font-black text-white mt-1">{item.value}</p>
            </div>
            <item.icon className="w-8 h-8 opacity-80" />
          </div>
        ))}
      </section>

      {/* Main split control panel layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Command Tabs Panel */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Admin Tabs */}
          <div className="flex border-b border-gray-800 gap-2 flex-wrap">
            {[
              { id: "students", label: "Student Progress Roster", icon: Users },
              { id: "faculty", label: "Faculty Authorizations", icon: UserCheck },
              { id: "curriculum", label: "Curriculum Assets Registry", icon: FolderOpen },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setSearchQuery("");
                }}
                className={`flex items-center gap-2 px-4 py-3 font-bold text-xs uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
                  activeTab === tab.id
                    ? "border-red-500 text-red-400 bg-red-500/5"
                    : "border-transparent text-gray-400 hover:text-gray-200"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search bar inside control block */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={
                activeTab === "students"
                  ? "Filter student records..."
                  : activeTab === "faculty"
                  ? "Filter authorized faculty..."
                  : "Filter syllabus assets..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-800 bg-gray-950 text-sm text-gray-200 outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20"
            />
          </div>

          {/* Tab Views */}
          <div className="glass rounded-3xl p-6 border border-white/5 shadow-2xl">
            
            {/* View 1: Students Progress */}
            {activeTab === "students" && (
              <div className="space-y-6">
                {/* Module Completion Rates Visualization */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-black/40 border border-red-950/20 rounded-2xl p-5">
                  <div className="md:col-span-2">
                    <h3 className="text-xs font-bold text-red-400 uppercase tracking-widest flex items-center gap-2">
                      <BarChart2 className="w-4 h-4" /> Syllabus Completion Metrics
                    </h3>
                    <p className="text-[11px] text-gray-400 mt-0.5">Distribution of syllabus completion logs based on student XP thresholds.</p>
                  </div>
                  {moduleCompletionStats.map((stat) => (
                    <div key={stat.id} className="bg-gray-950/40 border border-white/5 p-4 rounded-xl space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-gray-300 truncate max-w-[200px]">{stat.title.split(":")[0]}</span>
                        <span className="font-bold text-red-400">{stat.percentage}%</span>
                      </div>
                      <ProgressBar value={stat.percentage} colorClass="bg-gradient-to-r from-red-500 to-rose-500" height="h-2" />
                      <div className="flex justify-between items-center text-[10px] text-gray-500">
                        <span className="truncate max-w-[170px]">{stat.title.split(":")[1].trim()}</span>
                        <span>{stat.completedCount}/{students.length} students</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Student Progress Records</h3>
                  <span className="text-xs text-gray-500">{filteredStudents.length} entries</span>
                </div>

                {filteredStudents.length === 0 ? (
                  <p className="text-center text-gray-500 py-10">No students matching query.</p>
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-gray-800 bg-black/20">
                    <table className="w-full border-collapse text-left text-xs text-gray-400">
                      <thead className="bg-gray-950 text-gray-300 font-semibold border-b border-gray-800">
                        <tr>
                          <th className="p-4">Student</th>
                          <th className="p-4">Level</th>
                          <th className="p-4">XP Points</th>
                          <th className="p-4">Coins</th>
                          <th className="p-4">Progress (%)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-800/60">
                        {filteredStudents.map((student) => {
                          const progress = Math.min(Math.round((student.xp / 1500) * 100), 100);
                          return (
                            <tr key={student.id} className="hover:bg-white/5 transition-all">
                              <td className="p-4">
                                <p className="font-bold text-white">{student.name}</p>
                                <p className="text-[10px] text-gray-500 mt-0.5">{student.email}</p>
                              </td>
                              <td className="p-4">
                                <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-violet-600/10 text-violet-300 border border-violet-500/20">
                                  Lvl {student.level}
                                </span>
                              </td>
                              <td className="p-4 font-bold text-white">{student.xp} XP</td>
                              <td className="p-4">🪙 {student.coins}</td>
                              <td className="p-4 max-w-[200px]">
                                <div className="flex items-center gap-3">
                                  <span className="font-semibold text-[10px] text-red-400">{progress}%</span>
                                  <div className="flex-1">
                                    <ProgressBar value={progress} colorClass="bg-red-500" height="h-1.5" />
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

            {/* View 2: Faculty Directory */}
            {activeTab === "faculty" && (
              <div className="space-y-6">
                
                {/* Expandable Register Faculty Console */}
                <div className="border border-emerald-900/30 bg-emerald-950/5 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                        <PlusCircle className="w-4 h-4" /> Authorize New Faculty Member
                      </h3>
                      <p className="text-[11px] text-gray-400 mt-0.5">Grant instructor permissions and database access to a faculty member.</p>
                    </div>
                    <button
                      onClick={() => setShowAddFaculty(!showAddFaculty)}
                      className="px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-600/30 transition cursor-pointer"
                    >
                      {showAddFaculty ? "Hide Console" : "Open Console"}
                    </button>
                  </div>

                  {showAddFaculty && (
                    <form onSubmit={handleAddFaculty} className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                      <div>
                        <input
                          type="text"
                          placeholder="Instructor Name"
                          value={newFacName}
                          onChange={(e) => setNewFacName(e.target.value)}
                          className="w-full h-10 px-3 rounded-lg border border-gray-800 bg-gray-950 text-xs text-gray-200 focus:border-emerald-500/50 outline-none"
                          required
                        />
                      </div>
                      <div>
                        <input
                          type="email"
                          placeholder="Faculty Email"
                          value={newFacEmail}
                          onChange={(e) => setNewFacEmail(e.target.value)}
                          className="w-full h-10 px-3 rounded-lg border border-gray-800 bg-gray-950 text-xs text-gray-200 focus:border-emerald-500/50 outline-none"
                          required
                        />
                      </div>
                      <div>
                        <button
                          type="submit"
                          className="w-full h-10 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer"
                        >
                          Authorize Access
                        </button>
                      </div>
                    </form>
                  )}

                  {formSuccess && (
                    <div className="flex gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs text-emerald-300">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <p>{formSuccess}</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between border-b border-gray-800 pb-2 mt-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Authorized Instructors</h3>
                  <span className="text-xs text-gray-500">{filteredFaculty.length} entries</span>
                </div>

                {filteredFaculty.length === 0 ? (
                  <p className="text-center text-gray-500 py-10">No authorized instructors found.</p>
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-gray-800 bg-black/20">
                    <table className="w-full border-collapse text-left text-xs text-gray-400">
                      <thead className="bg-gray-950 text-gray-300 font-semibold border-b border-gray-800">
                        <tr>
                          <th className="p-4">Instructor Name</th>
                          <th className="p-4">Email Address</th>
                          <th className="p-4">Access Level</th>
                          <th className="p-4">Joined Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-800/60">
                        {filteredFaculty.map((fac) => (
                          <tr key={fac.id} className="hover:bg-white/5 transition-all">
                            <td className="p-4 font-bold text-white">{fac.name}</td>
                            <td className="p-4 font-mono">{fac.email}</td>
                            <td className="p-4">
                              <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 uppercase">
                                Faculty
                              </span>
                            </td>
                            <td className="p-4 text-gray-500">
                              {new Date(fac.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* View 3: Curriculum Logs */}
            {activeTab === "curriculum" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Curriculum Asset Catalog</h3>
                  <span className="text-xs text-gray-500">{filteredTopics.length} uploads</span>
                </div>

                {filteredTopics.length === 0 ? (
                  <p className="text-center text-gray-500 py-10">No syllabus assets matching query.</p>
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-gray-800 bg-black/20">
                    <table className="w-full border-collapse text-left text-xs text-gray-400">
                      <thead className="bg-gray-950 text-gray-300 font-semibold border-b border-gray-800">
                        <tr>
                          <th className="p-4">Asset Title</th>
                          <th className="p-4">Module</th>
                          <th className="p-4">Type</th>
                          <th className="p-4">Source Details</th>
                          <th className="p-4">Uploaded By</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-800/60">
                        {filteredTopics.map((ct) => (
                          <tr key={ct.id} className="hover:bg-white/5 transition-all">
                            <td className="p-4">
                              <span className="font-bold text-white block truncate max-w-[200px]" title={ct.title}>
                                {ct.title}
                              </span>
                            </td>
                            <td className="p-4">
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-gray-800 text-gray-400">
                                {MODULES_LIST.find((m) => m.id === ct.moduleId)?.title.split(":")[0] || ct.moduleId}
                              </span>
                            </td>
                            <td className="p-4">
                              <span className="capitalize font-medium">{ct.type}</span>
                            </td>
                            <td className="p-4">
                              {ct.type === "video" && (
                                <span className="inline-flex items-center gap-1.5 text-[10px] font-mono bg-red-500/10 text-red-300 border border-red-500/20 px-2 py-0.5 rounded">
                                  <Video className="w-3 h-3" />
                                  ID: {ct.videoId || "N/A"}
                                </span>
                              )}
                              {ct.type === "reading" && (
                                <span className="inline-flex items-center gap-1.5 text-[10px] font-mono bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded">
                                  <BookOpen className="w-3 h-3" />
                                  eBook ({ct.ebookContent?.length || 0} ch)
                                </span>
                              )}
                              {ct.type === "simulation" && (
                                <span className="inline-flex items-center gap-1.5 text-[10px] font-mono bg-fuchsia-500/10 text-fuchsia-300 border border-fuchsia-500/20 px-2 py-0.5 rounded truncate max-w-[150px]" title={ct.simulationUrl || ""}>
                                  <Activity className="w-3 h-3" />
                                  Sim: {ct.simulationUrl ? new URL(ct.simulationUrl).hostname : "N/A"}
                                </span>
                              )}
                            </td>
                            <td className="p-4 text-gray-300 font-semibold">{ct.createdBy}</td>
                            <td className="p-4 text-right space-x-1">
                              <button
                                onClick={() => setPreviewItem(ct)}
                                className="text-gray-400 hover:text-red-400 p-1.5 hover:bg-red-500/10 rounded-lg transition"
                                title="Preview Content"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(ct.id, ct.title)}
                                className="text-gray-400 hover:text-red-500 p-1.5 hover:bg-red-500/10 rounded-lg transition"
                                title="Moderate/Delete Asset"
                              >
                                <Trash2 className="w-4 h-4" />
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
          </div>
        </div>

        {/* Right Column: Console Sidebar Widgets */}
        <div className="space-y-6">
          
          {/* Sidebar Widget 1: System Activity Audit Trail */}
          <section className="glass rounded-3xl p-5 border border-white/5 space-y-4 shadow-xl">
            <h3 className="text-xs font-bold text-red-400 uppercase tracking-widest flex items-center gap-2">
              <Clock className="w-4 h-4 text-red-400" /> Command Audit Trail
            </h3>
            
            <div className="space-y-3">
              {auditLogs.map((log) => (
                <div key={log.id} className="text-xs flex items-start gap-3 p-3 bg-black/20 rounded-xl border border-white/5 hover:border-red-950/20 transition-all">
                  <div className="mt-0.5">
                    {log.status === "success" && <span className="w-2 h-2 rounded-full bg-emerald-500 block" />}
                    {log.status === "warning" && <span className="w-2 h-2 rounded-full bg-red-500 block" />}
                    {log.status === "info" && <span className="w-2 h-2 rounded-full bg-blue-500 block" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-300 font-medium leading-relaxed">{log.event}</p>
                    <div className="flex justify-between items-center mt-1 text-[10px] text-gray-500">
                      <span>👤 {log.user}</span>
                      <span>{log.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Sidebar Widget 2: Asset Type Breakdown */}
          <section className="glass rounded-3xl p-5 border border-white/5 space-y-4 shadow-xl">
            <h3 className="text-xs font-bold text-red-400 uppercase tracking-widest flex items-center gap-2">
              <Database className="w-4 h-4 text-red-400" /> Asset Distribution
            </h3>

            <div className="space-y-3">
              {[
                { label: "Videos", count: videoCount, percentage: totalUploads > 0 ? Math.round((videoCount / totalUploads) * 100) : 0, color: "bg-red-500" },
                { label: "eBooks / Readings", count: readingCount, percentage: totalUploads > 0 ? Math.round((readingCount / totalUploads) * 100) : 0, color: "bg-amber-500" },
                { label: "Simulations", count: simulationCount, percentage: totalUploads > 0 ? Math.round((simulationCount / totalUploads) * 100) : 0, color: "bg-fuchsia-500" },
              ].map((type, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-gray-300">{type.label}</span>
                    <span className="text-gray-400">{type.count} ({type.percentage}%)</span>
                  </div>
                  <ProgressBar value={type.percentage} colorClass={type.color} height="h-1.5" />
                </div>
              ))}
            </div>
          </section>

          {/* Sidebar Widget 3: Quick Diagnostics */}
          <section className="glass rounded-3xl p-5 border border-white/5 space-y-3 shadow-xl">
            <h3 className="text-xs font-bold text-red-400 uppercase tracking-widest flex items-center gap-2">
              <Shield className="w-4 h-4 text-red-400" /> Diagnostics Control
            </h3>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-black/20 border border-white/5 rounded-xl flex items-center justify-between">
                <span className="text-gray-400">Database Engine</span>
                <span className="font-mono text-emerald-400 font-bold">PostgreSQL</span>
              </div>
              <div className="p-3 bg-black/20 border border-white/5 rounded-xl flex items-center justify-between">
                <span className="text-gray-400">Prisma Client</span>
                <span className="font-mono text-gray-300">v7.8.0</span>
              </div>
              <button 
                onClick={() => {
                  if (confirm("Export student records as CSV?")) {
                    alert("Generating CSV stream... Success!");
                  }
                }}
                className="w-full py-2.5 rounded-xl bg-red-600/10 text-red-300 border border-red-500/20 hover:bg-red-600/20 font-semibold text-center transition cursor-pointer"
              >
                Export System Data Report
              </button>
            </div>
          </section>

        </div>
      </div>

      {/* Resource Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-gray-950 border border-gray-800 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded bg-violet-600/20 text-violet-300 border border-violet-500/20">
                  {previewItem.type}
                </span>
                <h3 className="text-lg font-bold text-white mt-2">{previewItem.title}</h3>
              </div>
              <button
                onClick={() => setPreviewItem(null)}
                className="text-gray-400 hover:text-white px-3 py-1.5 hover:bg-white/5 rounded-xl transition"
              >
                ✕
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 min-h-[300px] text-gray-300">
              {previewItem.type === "video" && previewItem.videoId && (
                <div className="space-y-4">
                  <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black border border-gray-800">
                    <iframe
                      className="w-full h-full"
                      src={`https://www.youtube.com/embed/${previewItem.videoId}`}
                      title={previewItem.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                  <p className="text-xs text-gray-500 font-mono">Video ID: {previewItem.videoId}</p>
                </div>
              )}
              {previewItem.type === "reading" && previewItem.ebookContent && (
                <div className="prose prose-invert max-w-none prose-violet">
                  <div dangerouslySetInnerHTML={{ __html: previewItem.ebookContent }} />
                </div>
              )}
              {previewItem.type === "simulation" && previewItem.simulationUrl && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="font-mono">URL: {previewItem.simulationUrl}</span>
                    <a
                      href={previewItem.simulationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-violet-400 hover:underline flex items-center gap-1 font-semibold"
                    >
                      Open in new tab <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black border border-gray-800">
                    <iframe
                      className="w-full h-full"
                      src={previewItem.simulationUrl}
                      title={previewItem.title}
                      frameBorder="0"
                    ></iframe>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
