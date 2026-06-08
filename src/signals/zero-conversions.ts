import { Page, TechnicalIssue, TechnicalIssueTypeEnum } from '../types';

export function detectZeroConversions(pages: Page[]): Omit<TechnicalIssue, 'id' | 'uploadId'>[] {
  const validPages = pages.filter(p => p.clicks != null && p.conversions != null);

  return validPages
    .filter(p => {
      const clicks = p.clicks as number;
      const conversions = p.conversions as number;
      // High traffic but 0 conversions
      return clicks > 10 && conversions === 0;
    })
    .map(p => ({
      pageId: p.id,
      type: TechnicalIssueTypeEnum.enum.clicks_without_conversions,
      severity: 'high',
      details: `Page receives traffic (${p.clicks} clicks) but generates 0 conversions. Content might not match intent or lacks a strong CTA.`
    }));
}
