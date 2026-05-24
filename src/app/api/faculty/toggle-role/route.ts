import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { role } = body;

    if (!role || !["STUDENT", "TEACHER", "ADMIN"].includes(role)) {
      return NextResponse.json({ error: "Invalid role value" }, { status: 400 });
    }

    // Update user role in the database
    await prisma.user.upsert({
      where: { clerkId: user.id },
      update: {
        role: role as any,
      },
      create: {
        clerkId: user.id,
        name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Learner",
        email: user.emailAddresses[0]?.emailAddress || "",
        role: role as any,
        xp: 1200, // Seed some initial values for demo
        coins: 400,
        level: 3,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error toggling user role:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
