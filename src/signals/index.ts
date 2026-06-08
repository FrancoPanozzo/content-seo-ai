import { Page, Keyword, Competitor, TechnicalIssue } from '../types';
import { detectLowCtrHighImpressions } from './low-ctr';
import { detectStrikingDistance } from './striking-distance';

export function runAllSignals(
  pages: Page[],
  keywords: Keyword[] = [],
  competitors: Competitor[] = []
): Omit<TechnicalIssue, 'id' | 'uploadId'>[] {
  const issues: Omit<TechnicalIssue, 'id' | 'uploadId'>[] = [];
  issues.push(...detectLowCtrHighImpressions(pages));
  issues.push(...detectStrikingDistance(pages));
  // Add future signals here
  return issues;
}
