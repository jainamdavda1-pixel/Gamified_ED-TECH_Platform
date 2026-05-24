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
    const { moduleId, title, type, durationMinutes, videoId, ebookContent, simulationUrl } = body;

    if (!moduleId || !title || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const creatorName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.emailAddresses[0]?.emailAddress || "Faculty Member";

    const customTopic = await prisma.customTopic.create({
      data: {
        moduleId,
        title,
        type,
        durationMinutes: parseInt(durationMinutes) || 15,
        videoId: videoId || null,
        ebookContent: ebookContent || null,
        simulationUrl: simulationUrl || null,
        createdBy: creatorName,
      },
    });

    return NextResponse.json({ success: true, topic: customTopic });
  } catch (error: any) {
    console.error("Error creating custom topic:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing topic ID" }, { status: 400 });
    }

    await prisma.customTopic.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting custom topic:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
