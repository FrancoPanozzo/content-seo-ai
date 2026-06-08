"use server";

import { prisma } from "@/lib/prisma";
import { runBriefGeneratorAgent } from "@/agents/brief-generator";
import { revalidatePath } from "next/cache";

export async function updateActionStatus(actionId: string, status: string, rejectReason?: string) {
  try {
    await prisma.action.update({
      where: { id: actionId },
      data: {
        status,
        ...(rejectReason ? { rejectReason } : {})
      }
    });
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    console.error(error);
    return { success: false, error: error.message };
  }
}

export async function applyActionDryRun(actionId: string) {
  try {
    const action = await prisma.action.findUnique({ where: { id: actionId } });
    if (!action) throw new Error("Action not found");

    let dryRunResult = null;

    if (action.type === "create_brief") {
      dryRunResult = await runBriefGeneratorAgent(actionId);
    } else {
      // Mock result for other types for now
      dryRunResult = { status: "simulated_success", message: "Action dry-run executed successfully." };
    }

    const currentPayload = (action.payload as Record<string, any>) || {};
    
    await prisma.action.update({
      where: { id: actionId },
      data: {
        status: "applied",
        payload: {
          ...currentPayload,
          dryRunResult
        } as any
      }
    });

    revalidatePath("/dashboard");
    return { success: true, dryRunResult };
  } catch (error: any) {
    console.error(error);
    return { success: false, error: error.message };
  }
}
