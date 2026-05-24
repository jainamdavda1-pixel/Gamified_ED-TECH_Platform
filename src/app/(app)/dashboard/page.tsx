import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DashboardRouterPage() {
  const user = await currentUser();
  if (!user) redirect("/login");

  let dbUser = null;
  try {
    dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
    });
  } catch (error) {
    console.error("Failed to query user role:", error);
  }

  const role = dbUser?.role || "STUDENT";

  if (role === "ADMIN") {
    redirect("/dashboard/admin");
  } else if (role === "TEACHER") {
    redirect("/dashboard/faculty");
  } else {
    redirect("/dashboard/student");
  }
}
