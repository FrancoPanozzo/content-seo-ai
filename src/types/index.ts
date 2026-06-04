import { z } from 'zod';
import {
  UploadSchema,
  PageSchema,
  MetricsSchema,
  KeywordSchema,
  CompetitorSchema,
  TechnicalIssueSchema,
} from '@prisma/generated/zod';

export type Upload = z.infer<typeof UploadSchema>;
export type Page = z.infer<typeof PageSchema>;
export type Metrics = z.infer<typeof MetricsSchema>;
export type Keyword = z.infer<typeof KeywordSchema>;
export type Competitor = z.infer<typeof CompetitorSchema>;
export type TechnicalIssue = z.infer<typeof TechnicalIssueSchema>;
