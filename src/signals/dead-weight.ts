import { Page, TechnicalIssue, TechnicalIssueTypeEnum } from '../types';

export function detectDeadWeight(pages: Page[]): Omit<TechnicalIssue, 'id' | 'uploadId'>[] {
  const validPages = pages.filter(p => p.impressions != null && p.clicks != null);

  return validPages
    .filter(p => {
      const impressions = p.impressions as number;
      const clicks = p.clicks as number;
      // Dead weight: practically no visibility or traffic
      return impressions < 50 && clicks === 0;
    })
    .map(p => ({
      pageId: p.id,
      type: TechnicalIssueTypeEnum.enum.dead_weight,
      severity: 'low',
      details: `Page is dead weight (${p.impressions} impressions, 0 clicks). Consider deleting, consolidating, or completely rewriting.`
    }));
}
