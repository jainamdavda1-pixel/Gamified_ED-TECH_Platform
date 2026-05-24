import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import AdminDashboardClient from "./AdminDashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const user = await currentUser();
  if (!user) redirect("/login");

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
  });

  // Authorization check (ADMIN only)
  if (dbUser?.role !== "ADMIN") {
    redirect("/dashboard/student");
  }

  const students = await prisma.user.findMany({
    where: { role: "STUDENT" },
    orderBy: { xp: "desc" },
  });

  const faculty = await prisma.user.findMany({
    where: { role: "TEACHER" },
    orderBy: { createdAt: "desc" },
  });

  const customTopics = await prisma.customTopic.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <AdminDashboardClient
      initialStudents={students.map(s => ({
        id: s.id,
        name: s.name,
        email: s.email,
        role: s.role,
        xp: s.xp,
        coins: s.coins,
        level: s.level,
        createdAt: s.createdAt.toISOString()
      }))}
      initialFaculty={faculty.map(f => ({
        id: f.id,
        name: f.name,
        email: f.email,
        role: f.role,
        createdAt: f.createdAt.toISOString()
      }))}
      initialCustomTopics={customTopics.map(ct => ({
        id: ct.id,
        moduleId: ct.moduleId,
        title: ct.title,
        type: ct.type,
        durationMinutes: ct.durationMinutes,
        videoId: ct.videoId,
        ebookContent: ct.ebookContent,
        simulationUrl: ct.simulationUrl,
        createdBy: ct.createdBy,
        createdAt: ct.createdAt.toISOString()
      }))}
    />
  );
}
