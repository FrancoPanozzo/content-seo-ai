import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { runBriefGeneratorAgent } from "@/agents/brief-generator";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { actionId, type, rejectReason } = body;

    if (!actionId) return NextResponse.json({ success: false, error: "actionId required" }, { status: 400 });

    if (type === "reject") {
      await prisma.action.update({
        where: { id: actionId },
        data: {
          status: "rejected",
          ...(rejectReason ? { rejectReason } : {})
        }
      });
      return NextResponse.json({ success: true });
    }

    if (type === "apply") {
      const action = await prisma.action.findUnique({ where: { id: actionId } });
      if (!action) return NextResponse.json({ success: false, error: "Action not found" }, { status: 404 });

      let dryRunResult = null;

      if (action.type === "create_brief") {
        dryRunResult = await runBriefGeneratorAgent(actionId);
      } else {
        dryRunResult = { status: "simulated_success", message: "Action executed successfully." };
      }

      const currentPayload = (action.payload as Record<string, any>) || {};
      
      await prisma.action.update({
        where: { id: actionId },
        data: {
          status: "applied",
          payload: {
            ...currentPayload,
            dryRunResult
          }
        }
      });

      return NextResponse.json({ success: true, dryRunResult });
    }

    return NextResponse.json({ success: false, error: "Invalid type" }, { status: 400 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
