import { Page, Competitor, TechnicalIssue, TechnicalIssueTypeEnum } from '../types';

export function detectCompetitorGaps(pages: Page[], competitors: Competitor[]): Omit<TechnicalIssue, 'id' | 'uploadId'>[] {
  const issues: Omit<TechnicalIssue, 'id' | 'uploadId'>[] = [];
  
  // Collect all our covered topics (rudimentary check using titles and targetKeywords)
  const ourContent = pages.map(p => `${p.title} ${p.targetKeyword || ''}`.toLowerCase());

  for (const competitor of competitors) {
    if (!competitor.topTopics) continue;

    for (const topic of competitor.topTopics) {
      const topicLower = topic.toLowerCase();
      // If none of our pages seem to cover this topic
      const isCovered = ourContent.some(content => content.includes(topicLower));
      
      if (!isCovered) {
        issues.push({
          pageId: 'N/A', // Not tied to a specific page
          type: TechnicalIssueTypeEnum.enum.competitor_gap,
          severity: 'medium',
          details: `Competitor gap: '${competitor.domain}' ranks for topic '${topic}', but we have no content covering it. Consider creating a new brief.`
        });
      }
    }
  }

  return issues;
}
