import { z } from 'zod';
import {
  UploadSchema,
  PageSchema,
  KeywordSchema,
  CompetitorSchema,
  TechnicalIssueSchema,
  ActionSchema,
} from '@prisma/generated/zod';

export type Upload = z.infer<typeof UploadSchema>;
export type Page = z.infer<typeof PageSchema>;
export type Keyword = z.infer<typeof KeywordSchema>;
export type Competitor = z.infer<typeof CompetitorSchema>;
export type TechnicalIssue = z.infer<typeof TechnicalIssueSchema>;
export type Action = z.infer<typeof ActionSchema>;

export const TechnicalIssueTypeEnum = z.enum([
  'url_special_characters',
  'low_ctr_high_impressions',
  'dead_weight',
  'low_volume_keyword',
  'duplicate_topic_coverage',
  'low_ctr_optimization_target'
]);

export type TechnicalIssueType = z.infer<typeof TechnicalIssueTypeEnum>;

export const KeywordIntentEnum = z.enum([
  'commercial',
  'commercial_comparison',
  'transactional',
  'informational'
]);

export type KeywordIntentType = z.infer<typeof KeywordIntentEnum>;

export const UploadInputSchema = UploadSchema.omit({ id: true, createdAt: true }).partial().extend({
  pages: z.array(PageSchema.omit({ id: true, uploadId: true, sourceId: true, intent: true }).extend({
    id: z.string().optional(),
    intent: KeywordIntentEnum.nullable().optional(),
    metrics: z.object({
      impressions: z.number().nullable().optional(),
      clicks: z.number().nullable().optional(),
      position: z.number().nullable().optional(),
      ctr: z.number().nullable().optional(),
      conversions: z.number().nullable().optional(),
      conversionRate: z.number().nullable().optional(),
    }).optional()
  }).partial()).optional(),
  keywords: z.array(KeywordSchema.omit({ id: true, uploadId: true, intent: true }).extend({
    intent: KeywordIntentEnum.nullable().optional()
  }).partial()).optional(),
  competitors: z.array(CompetitorSchema.omit({ id: true, uploadId: true }).partial()).optional(),
  technicalIssues: z.array(TechnicalIssueSchema.omit({ id: true, uploadId: true, type: true }).extend({
    type: TechnicalIssueTypeEnum
  }).partial()).optional(),
});

export type UploadInput = z.infer<typeof UploadInputSchema>;

