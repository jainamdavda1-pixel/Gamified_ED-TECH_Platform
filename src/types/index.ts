// ─── Core Domain Types ───────────────────────────────────────────────────────
// These mirror the shape of future Prisma models.

export interface Student {
  id: string;
  name: string;
  email: string;
  avatar: string;
  enrolledSubjects: string[]; // subject IDs
  overallProgress: number; // 0-100
  streakDays: number;
  totalXp: number;
  joinedAt: string; // ISO date
}

export interface Subject {
  id: string;
  code: string;
  title: string;
  description: string;
  instructor: string;
  credits: number;
  semester: number;
  coverColor: string; // tailwind gradient class token
  totalModules: number;
  totalTopics: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Topic {
  id: string;
  moduleId: string;
  title: string;
  type: "video" | "reading" | "quiz" | "assignment" | "simulation";
  durationMinutes: number;
  isCompleted: boolean;
  order: number;
  // Content fields — stored as JSON columns in Prisma later
  videoId?: string;          // YouTube video ID
  ebookContent?: string;     // HTML string for reading view
  quizQuestions?: QuizQuestion[];
  assignmentDescription?: string;
  simulationUrl?: string;    // URL for embedded simulations
  numericalsContent?: string; // HTML string for step-by-step numericals
}

export interface Module {
  id: string;
  subjectId: string;
  title: string;
  description: string;
  order: number;
  topics: Topic[];
  isLocked: boolean; // kept for future role-based locking
}

export interface StudentProgress {
  studentId: string;
  subjectId: string;
  completedTopics: string[]; // topic IDs
  completedModules: string[]; // module IDs
  lastAccessedAt: string;
  xpEarned: number;
  quizScores: Record<string, number>; // topicId -> score
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string; // emoji or icon name
  earnedAt: string | null;
}
