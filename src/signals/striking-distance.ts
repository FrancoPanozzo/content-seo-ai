import { Page, TechnicalIssue, TechnicalIssueTypeEnum } from '../types';

export function detectStrikingDistance(pages: Page[]): Omit<TechnicalIssue, 'id' | 'uploadId'>[] {
  const validPages = pages.filter(p => p.position != null && p.impressions != null);

  return validPages
    .filter(p => {
      const pos = p.position as number;
      const imp = p.impressions as number;
      // Posición 4-15 y un mínimo de impresiones para que valga la pena
      return pos >= 4 && pos <= 15 && imp > 50;
    })
    .map(p => ({
      pageId: p.id,
      type: TechnicalIssueTypeEnum.enum.striking_distance,
      severity: 'high',
      details: `Page is in striking distance (Position: ${p.position}). Optimizing could push it to top 3. Current impressions: ${p.impressions}.`
    }));
}
