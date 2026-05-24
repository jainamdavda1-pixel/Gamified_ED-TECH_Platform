import { MOCK_MODULES } from "@/lib/mockData";
import { prisma } from "@/lib/prisma";
import type { Topic, Module } from "@/types";

export async function getModulesWithCustomTopics(): Promise<Module[]> {
  try {
    const customTopics = await prisma.customTopic.findMany({
      orderBy: { createdAt: "asc" },
    });

    // Deep clone the mock modules to avoid mutating the in-memory cache
    const modules = JSON.parse(JSON.stringify(MOCK_MODULES)) as typeof MOCK_MODULES;

    customTopics.forEach((ct) => {
      const mod = modules.find((m) => m.id === ct.moduleId);
      if (mod) {
        mod.topics.push({
          id: ct.id,
          moduleId: ct.moduleId,
          title: ct.title,
          type: ct.type as any,
          durationMinutes: ct.durationMinutes,
          isCompleted: false, // Will resolve completed topics dynamically
          order: mod.topics.length + 1,
          videoId: ct.videoId || undefined,
          ebookContent: ct.ebookContent || undefined,
          simulationUrl: ct.simulationUrl || undefined,
        });
      }
    });

    return modules;
  } catch (error) {
    console.error("Failed to load custom topics:", error);
    return MOCK_MODULES;
  }
}

export async function getTopic(moduleId: string, topicId: string): Promise<Topic | undefined> {
  // First check mock data
  const modules = MOCK_MODULES;
  const mod = modules.find((m) => m.id === moduleId);
  const mockTopic = mod?.topics.find((t) => t.id === topicId);
  if (mockTopic) return mockTopic;

  // Otherwise, query database for custom topic
  try {
    const custom = await prisma.customTopic.findUnique({
      where: { id: topicId },
    });
    if (custom && custom.moduleId === moduleId) {
      return {
        id: custom.id,
        moduleId: custom.moduleId,
        title: custom.title,
        type: custom.type as any,
        durationMinutes: custom.durationMinutes,
        isCompleted: false,
        order: 999, // default placeholder order
        videoId: custom.videoId || undefined,
        ebookContent: custom.ebookContent || undefined,
        simulationUrl: custom.simulationUrl || undefined,
      };
    }
  } catch (error) {
    console.error("Failed to fetch custom topic from DB:", error);
  }
  return undefined;
}
