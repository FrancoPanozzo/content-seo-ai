import { z } from 'zod';
import { generateText, Output } from 'ai';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { prisma } from '@/lib/prisma';
import { runPlannerGuardrails } from '@/guardrails';

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY || '',
});

export const ActionTypeEnum = z.enum([
  'create_brief',
  'optimize_page',
  'resolve_issue',
  'add_internal_links'
]);

export const ActionProposalSchema = z.object({
  type: ActionTypeEnum,
  title: z.string().describe("A concise title for the action"),
  reason: z.string().describe("The reasoning behind proposing this action"),
  evidence: z.string().describe("Data from the dataset that supports this action"),
  priority: z.enum(['high', 'medium', 'low']),
  confidence: z.number().min(0).max(100).describe("Confidence level 0-100"),
  payload: z.object({
    targetKeyword: z.string().optional(),
    pageId: z.string().optional(),
    issueId: z.string().optional(),
    internalLinks: z.array(z.string()).optional()
  }).describe("Action-specific payload")
});

export async function runPlannerAgent(uploadId: string) {
  // 1. Fetch data
  const upload = await prisma.upload.findUnique({
    where: { id: uploadId },
    include: {
      pages: true,
      keywords: true,
      competitors: true,
      technicalIssues: true
    }
  });

  if (!upload) throw new Error("Upload not found");

  // 2. Prepare summary (don't send raw dataset to save tokens)
  const context = {
    totalPages: upload.pages.length,
    pagesSummary: upload.pages.map(p => ({ id: p.id, url: p.url, title: p.title, intent: p.intent, impressions: p.impressions, ctr: p.ctr })),
    totalKeywords: upload.keywords.length,
    keywordsSummary: upload.keywords.map(k => ({ id: k.id, keyword: k.keyword, volume: k.monthlyVolume, difficulty: k.difficulty })),
    technicalIssues: upload.technicalIssues.map(i => ({ type: i.type, severity: i.severity, details: i.details, pageId: i.pageId })),
    competitors: upload.competitors.map(c => ({ domain: c.domain, topTopics: c.topTopics }))
  };

  // 3. Call LLM
  console.log("Calling OpenRouter with deepseek-v4-flash...");
  const startTime = Date.now();
  let output;
  let modelUsed = 'deepseek/deepseek-v4-flash';
  
  try {
    const response = await generateText({
      model: openrouter('deepseek/deepseek-v4-flash'),
      output: Output.object({
        schema: z.object({
          actions: z.array(ActionProposalSchema)
        })
      }),
      prompt: `You are an expert SEO Strategist.
Your goal is to analyze the provided dataset summary and generate a prioritized list of actions to improve the site's SEO performance.

DATASET SUMMARY:
${JSON.stringify(context, null, 2)}

REQUIREMENTS:
1. Generate actions across these types: create_brief, optimize_page, resolve_issue, add_internal_links.
2. Rely only on the evidence provided in the JSON.
3. Do not invent metrics or keywords that are not in the dataset.
4. Output a structured plan.`
    });
    output = response.output;
  } catch (error) {
    console.warn("Primary LLM (deepseek) failed, attempting fallback to gpt-4o-mini...", error);
    try {
      modelUsed = 'openai/gpt-4o-mini';
      const fallbackResponse = await generateText({
        model: openrouter('openai/gpt-4o-mini'),
        output: Output.object({
          schema: z.object({
            actions: z.array(ActionProposalSchema)
          })
        }),
        prompt: `You are an expert SEO Strategist.
Your goal is to analyze the provided dataset summary and generate a prioritized list of actions to improve the site's SEO performance.

DATASET SUMMARY:
${JSON.stringify(context, null, 2)}

REQUIREMENTS:
1. Generate actions across these types: create_brief, optimize_page, resolve_issue, add_internal_links.
2. Rely only on the evidence provided in the JSON.
3. Do not invent metrics or keywords that are not in the dataset.
4. Output a structured plan.`
      });
      output = fallbackResponse.output;
    } catch (fallbackError) {
      console.error("Fallback LLM also failed:", fallbackError);
      throw new Error(JSON.stringify({
        code: "LLM_PROVIDER_DOWN",
        message: "AI providers are currently unreachable. Please try again later."
      }));
    }
  }
  
  const endTime = Date.now();
  const latencyMs = endTime - startTime;
  console.log(`LLM call took ${latencyMs / 1000} seconds`);

  // Log LLM interaction
  await prisma.llmLog.create({
    data: {
      uploadId: upload.id,
      agentName: `Planner (${modelUsed})`,
      prompt: `You are an expert SEO Strategist... [Truncated for DB]`,
      contextPayload: context as any,
      rawOutput: JSON.stringify(output),
      latencyMs: latencyMs
    }
  });

  console.log("LLM returned actions:", output.actions.length);

  // 4. Run Guardrails
  const guardedActions = runPlannerGuardrails(output.actions, upload as any);

  // 5. Save actions to DB
  const actionsData = guardedActions.map(action => ({
    uploadId: upload.id,
    type: action.type,
    title: action.title,
    reason: action.reason,
    evidence: action.evidence,
    priority: action.priority,
    confidence: action.confidence,
    payload: action.payload as any,
    status: action.status,
    rejectReason: action.rejectReason
  }));

  const createdActions = await prisma.$transaction(
    actionsData.map(data => prisma.action.create({ data }))
  );

  console.log("Actions saved to DB successfully");
  return createdActions;
}
