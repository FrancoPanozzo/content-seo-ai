import { Keyword, TechnicalIssue, TechnicalIssueTypeEnum } from '../types';

export function detectKeywordGaps(keywords: Keyword[]): Omit<TechnicalIssue, 'id' | 'uploadId'>[] {
  return keywords
    .filter(k => {
      // Keyword exists but we don't have a page ranking for it.
      // Additionally, only flag it if there is some search volume so it's worth creating.
      return !k.currentlyRankingPageId && (k.monthlyVolume == null || k.monthlyVolume > 50);
    })
    .map(k => ({
      pageId: 'N/A', // Signal is not tied to a specific page
      type: TechnicalIssueTypeEnum.enum.keyword_gap,
      severity: 'medium',
      details: `Missing content for keyword: '${k.keyword}' (Volume: ${k.monthlyVolume || 'Unknown'}). Consider creating a new brief to target this gap.`
    }));
}
