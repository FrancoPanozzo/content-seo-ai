import { Page, TechnicalIssue, TechnicalIssueTypeEnum } from '../types';

export function detectLowCtrHighImpressions(pages: Page[]): Omit<TechnicalIssue, 'id' | 'uploadId'>[] {
  const validPages = pages.filter(p => p.impressions != null && p.ctr != null);
  if (validPages.length === 0) return [];

  const impressions = validPages.map(p => p.impressions as number).sort((a, b) => a - b);
  const ctrs = validPages.map(p => p.ctr as number).sort((a, b) => a - b);

  const medianImpressions = getMedian(impressions);
  const medianCtr = getMedian(ctrs);

  return validPages
    .filter(p => (p.impressions as number) > medianImpressions && (p.ctr as number) < medianCtr)
    .map(p => ({
      pageId: p.id,
      type: TechnicalIssueTypeEnum.enum.low_ctr_high_impressions,
      severity: 'high',
      details: `Page has high impressions (${p.impressions}) but low CTR (${p.ctr}%). Median impressions: ${medianImpressions}, Median CTR: ${medianCtr}%`
    }));
}

function getMedian(values: number[]) {
  if (values.length === 0) return 0;
  const half = Math.floor(values.length / 2);
  if (values.length % 2 === 0) {
    return (values[half - 1] + values[half]) / 2.0;
  }
  return values[half];
}
