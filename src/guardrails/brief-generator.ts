import { z } from 'zod';
import { BriefSchema } from '../agents/brief-generator';
import { Prisma } from '@prisma/client';

type Brief = z.infer<typeof BriefSchema>;

type UploadContext = Prisma.UploadGetPayload<{
  include: {
    pages: true;
    keywords: true;
    competitors: true;
  };
}>;

export interface BriefGuardrailResult extends Brief {
  risks?: string[];
  guardrailRejected?: boolean;
  rejectReason?: string;
}

export function runBriefGuardrails(brief: Brief, context: UploadContext): BriefGuardrailResult {
  const risks: string[] = [];
  
  // Hard Rule: Check if the brief clearly targets B2C when Fanz is strictly B2B.
  const audienceLower = brief.audience.toLowerCase();
  if (audienceLower.includes('b2c') || audienceLower.includes('consumidor final')) {
    return {
      ...brief,
      guardrailRejected: true,
      rejectReason: 'Brief rejected: Target audience explicitly targets B2C, but Fanz is strictly B2B.'
    };
  }

  // Soft Rule: Check if internal links are provided
  if (!brief.internalLinks || brief.internalLinks.length === 0) {
    risks.push("No internal links provided in the brief. SEO articles should interlink to existing content.");
  } else {
    // Validate that the suggested internal links actually exist in the dataset
    const validUrls = new Set(context.pages.map(p => p.url));
    const invalidLinks = brief.internalLinks.filter(link => !validUrls.has(link) && !validUrls.has(`https://fanz.com.ar${link}`));
    if (invalidLinks.length > 0) {
      risks.push(`Brief suggests internal links that don't exist in the uploaded dataset: ${invalidLinks.join(', ')}`);
    }
  }

  // Soft Rule: Check if outline is deep enough
  const totalSubheadings = brief.outline.reduce((count, section) => count + section.subheadings.length, 0);
  if (totalSubheadings < 2) {
    risks.push("Outline lacks depth. Consider adding more H3 subheadings to ensure a comprehensive article.");
  }

  // Soft Rule: Word count check
  if (brief.wordCount < 500) {
    risks.push(`Recommended word count (${brief.wordCount}) is too low for a standard SEO pillar/article.`);
  }

  return {
    ...brief,
    ...(risks.length > 0 ? { risks } : {})
  };
}
