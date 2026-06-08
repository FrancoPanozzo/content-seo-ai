import { Page, Keyword, Competitor, TechnicalIssue } from '../types';
import { detectLowCtrHighImpressions } from './low-ctr';
import { detectStrikingDistance } from './striking-distance';
import { detectZeroConversions } from './zero-conversions';
import { detectDeadWeight } from './dead-weight';
import { detectKeywordGaps } from './keyword-gaps';

export function runAllSignals(
  pages: Page[],
  keywords: Keyword[] = [],
  competitors: Competitor[] = []
): Omit<TechnicalIssue, 'id' | 'uploadId'>[] {
  const issues: Omit<TechnicalIssue, 'id' | 'uploadId'>[] = [];
  issues.push(...detectLowCtrHighImpressions(pages));
  issues.push(...detectStrikingDistance(pages));
  issues.push(...detectZeroConversions(pages));
  issues.push(...detectDeadWeight(pages));
  issues.push(...detectKeywordGaps(keywords));
  // Add future signals here
  return issues;
}
