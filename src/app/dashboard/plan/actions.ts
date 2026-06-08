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
  } catch (error: any) {
    console.error("Planner agent failed:", error);
    
    let structuredError = "Unknown error occurred while generating plan";
    let code = "UNKNOWN_ERROR";

    try {
      const parsedError = JSON.parse(error.message);
      if (parsedError.code) {
        code = parsedError.code;
        structuredError = parsedError.message;
      }
    } catch {
      structuredError = error.message || structuredError;
    }

    return { success: false, error: { code, message: structuredError } };
  }
}
