import { z } from 'zod';
import { generateObject } from 'ai';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { prisma } from '@/lib/prisma';
import { runBriefGuardrails } from '@/guardrails';

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY || '',
});

export const BriefSchema = z.object({
  targetKeyword: z.string(),
  intent: z.string().describe("Search intent (e.g., informational, transactional)"),
  audience: z.string().describe("Target audience (e.g., B2B SaaS founders, beginners)"),
  title: z.string().describe("SEO optimized title following the blog pattern"),
  metaDescription: z.string().max(160).describe("Meta description under 160 chars"),
  outline: z.array(z.object({
    heading: z.string().describe("H2 heading"),
    subheadings: z.array(z.string()).describe("H3 subheadings")
  })),
  faqs: z.array(z.object({
    question: z.string(),
    answer: z.string()
  })),
  commercialAngle: z.string().describe("How to weave the product/service naturally"),
  internalLinks: z.array(z.string()).describe("URLs or slugs of existing dataset pages to link to"),
  wordCount: z.number().describe("Recommended word count")
});

export async function runBriefGeneratorAgent(actionId: string) {
  const action = await prisma.action.findUnique({
    where: { id: actionId },
    include: {
      upload: {
        include: { pages: true, competitors: true, keywords: true }
      }
    }
  });

  if (!action) throw new Error("Action not found");

  const payloadContext = action.payload as any;
  const targetKeyword = payloadContext?.targetKeyword || action.title;

  const contextStr = JSON.stringify({
    targetKeyword,
    reason: action.reason,
    evidence: action.evidence,
    existingPages: action.upload.pages.map(p => ({ title: p.title, url: p.url, intent: p.intent })),
    competitors: action.upload.competitors.map(c => ({ domain: c.domain, topics: c.topTopics }))
  });

  console.log(`Running Brief Generator for Action ${actionId} (Keyword: ${targetKeyword})`);

  const { object } = await generateObject({
    model: openrouter('deepseek/deepseek-v4-flash'),
    schema: BriefSchema,
    prompt: `You are an expert SEO Editor and Content Strategist.
Create a highly detailed, publishable content brief for a writer.
It must be so specific that a human editor can write the article without thinking much.
Maintain a cohesive, professional but engaging tone ("Fanz" tone).

CONTEXT:
${contextStr}

REQUIREMENTS:
1. Target keyword: ${targetKeyword}
2. Define exact intent and audience.
3. Outline must be deep and specific (H2s and H3s). No generic headers like "Conclusion".
4. Include FAQs people actually ask about this.
5. Provide a strong commercial angle.
6. Suggest internal links to our existing pages listed in the context.`
  });

  const guardedBrief = runBriefGuardrails(object as any, action.upload as any);

  if (guardedBrief.guardrailRejected) {
    throw new Error(guardedBrief.rejectReason || "Brief was rejected by guardrails.");
  }

  return guardedBrief;
}
