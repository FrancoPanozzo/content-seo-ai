import { z } from 'zod';
import { ActionProposalSchema } from '../agents/planner';
import { Prisma } from '@prisma/client';

type ActionProposal = z.infer<typeof ActionProposalSchema>;

type UploadContext = Prisma.UploadGetPayload<{
  include: {
    pages: true;
    keywords: true;
    competitors: true;
    technicalIssues: true;
  };
}>;

export interface GuardrailResult extends ActionProposal {
  status: string;
  rejectReason?: string;
}

export function runPlannerGuardrails(
  actions: ActionProposal[],
  context: UploadContext
): GuardrailResult[] {
  const existingKeywords = new Set(context.keywords.map((k) => k.keyword.toLowerCase()));
  
  // existing targetKeywords on pages
  const coveredKeywords = new Set(
    context.pages
      .map((p) => p.targetKeyword?.toLowerCase())
      .filter(Boolean)
  );

  return actions.map((action) => {
    let status = "pending";
    let rejectReason = undefined;
    const risks: string[] = [];

    const targetKeyword = action.payload?.targetKeyword?.toLowerCase();

    // HARD RULE: Duplicate keywords already covered by another page
    if (targetKeyword && coveredKeywords.has(targetKeyword)) {
      status = "rejected_by_guardrail";
      rejectReason = `Keyword '${targetKeyword}' is already covered by an existing page.`;
    }

    // SOFT RULE: Keyword doesn't exist in dataset
    if (targetKeyword && !existingKeywords.has(targetKeyword)) {
      risks.push(`Keyword '${targetKeyword}' does not exist in the dataset.`);
    }

    // SOFT RULE: Pushing B2C content when audience might be B2B
    const combinedText = `${action.title} ${action.reason}`.toLowerCase();
    if (combinedText.includes("b2c")) {
      risks.push("Pushing B2C content without dataset justification.");
    }

    // Inject risks into payload
    const updatedPayload = {
      ...action.payload,
      ...(risks.length > 0 ? { risks } : {})
    };

    return {
      ...action,
      payload: updatedPayload,
      status,
      rejectReason
    };
  });
}
