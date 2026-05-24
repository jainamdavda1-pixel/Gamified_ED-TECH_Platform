import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import FacultyDashboardClient from "./FacultyDashboardClient";

export const dynamic = "force-dynamic";

export default async function FacultyDashboardPage() {
  const user = await currentUser();
  if (!user) redirect("/login");

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
  });

  // Authorization check
  if (dbUser?.role !== "TEACHER" && dbUser?.role !== "ADMIN") {
    redirect("/dashboard/student");
  }

  const students = await prisma.user.findMany({
    where: { role: "STUDENT" },
    orderBy: { xp: "desc" },
  });

  const customTopics = await prisma.customTopic.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <FacultyDashboardClient
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
