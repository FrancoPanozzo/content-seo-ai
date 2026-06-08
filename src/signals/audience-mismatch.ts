import { Page, Keyword, TechnicalIssue, TechnicalIssueTypeEnum } from '../types';

export function detectAudienceMismatch(pages: Page[], keywords: Keyword[]): Omit<TechnicalIssue, 'id' | 'uploadId'>[] {
  const issues: Omit<TechnicalIssue, 'id' | 'uploadId'>[] = [];

  const checkAudience = (audienceStr: string | null) => {
    if (!audienceStr) return false;
    const lower = audienceStr.toLowerCase();
    return lower.includes('b2c') || lower.includes('consumidor') || lower.includes('buyer') || lower.includes('end user');
  };

  for (const p of pages) {
    if (checkAudience(p.audience)) {
      issues.push({
        pageId: p.id,
        type: TechnicalIssueTypeEnum.enum.b2c_audience_mismatch,
        severity: 'high',
        details: `Audience mismatch: Page targets '${p.audience}', but Fanz is strictly B2B. Content should be revised to target event organizers and producers.`
      });
    }
  }

  for (const k of keywords) {
    if (checkAudience(k.audience)) {
      issues.push({
        pageId: k.currentlyRankingPageId || 'N/A', // Attach to page if it ranks, else N/A
        type: TechnicalIssueTypeEnum.enum.b2c_audience_mismatch,
        severity: 'high',
        details: `Audience mismatch: Keyword '${k.keyword}' attracts '${k.audience}'. This traffic is likely unqualified for Fanz (B2B).`
      });
    }
  }

  return issues;
}
