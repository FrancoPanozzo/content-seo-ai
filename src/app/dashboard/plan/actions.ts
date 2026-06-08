"use server";

import { auth } from "@clerk/nextjs/server";
import { runPlannerAgent } from "@/agents/planner";

export async function generatePlanAction(uploadId: string) {
  try {
    const { userId: _authUserId } = await auth();
    if (!_authUserId) {
      return { success: false, error: "Unauthorized" };
    }

    const actions = await runPlannerAgent(uploadId);
    
    return { success: true, actions };
  } catch (error: unknown) {
    console.error("Planner agent failed:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error occurred while generating plan" };
  }
}
