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

export const UploadInputSchema = UploadSchema.omit({ id: true, createdAt: true }).partial().extend({
  pages: z.array(PageSchema.omit({ id: true, uploadId: true, sourceId: true }).partial()).optional(),
  keywords: z.array(KeywordSchema.omit({ id: true, uploadId: true }).partial()).optional(),
  competitors: z.array(CompetitorSchema.omit({ id: true, uploadId: true }).partial()).optional(),
  technicalIssues: z.array(TechnicalIssueSchema.omit({ id: true, uploadId: true }).partial()).optional(),
});

export type UploadInput = z.infer<typeof UploadInputSchema>;
