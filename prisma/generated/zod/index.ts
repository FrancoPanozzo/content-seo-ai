import { z } from 'zod';
import { Prisma } from '@prisma/client';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////

// JSON
//------------------------------------------------------

export type NullableJsonInput = Prisma.JsonValue | null | 'JsonNull' | 'DbNull' | Prisma.NullTypes.DbNull | Prisma.NullTypes.JsonNull;

export const transformJsonNull = (v?: NullableJsonInput) => {
  if (!v || v === 'DbNull') return Prisma.NullTypes.DbNull;
  if (v === 'JsonNull') return Prisma.NullTypes.JsonNull;
  return v;
};

export const JsonValueSchema: z.ZodType<Prisma.JsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.literal(null),
    z.record(z.string(), z.lazy(() => JsonValueSchema.optional())),
    z.array(z.lazy(() => JsonValueSchema)),
  ])
);

export type JsonValueType = z.infer<typeof JsonValueSchema>;

export const NullableJsonValue = z
  .union([JsonValueSchema, z.literal('DbNull'), z.literal('JsonNull')])
  .nullable()
  .transform((v) => transformJsonNull(v));

export type NullableJsonValueType = z.infer<typeof NullableJsonValue>;

export const InputJsonValueSchema: z.ZodType<Prisma.InputJsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.object({ toJSON: z.any() }),
    z.record(z.string(), z.lazy(() => z.union([InputJsonValueSchema, z.literal(null)]))),
    z.array(z.lazy(() => z.union([InputJsonValueSchema, z.literal(null)]))),
  ])
);

export type InputJsonValueType = z.infer<typeof InputJsonValueSchema>;


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);

export const UploadScalarFieldEnumSchema = z.enum(['id','userId','description','currency','generatedAt','windowDays','createdAt']);

export const PageScalarFieldEnumSchema = z.enum(['id','uploadId','sourceId','url','title','metaDescription','targetKeyword','intent','audience','wordCount','publishedAt','lastModified','impressions','clicks','position','ctr','conversions','conversionRate']);

export const KeywordScalarFieldEnumSchema = z.enum(['id','uploadId','keyword','monthlyVolume','difficulty','cpc','intent','audience','topCompetitor','currentlyRankingPageId']);

export const CompetitorScalarFieldEnumSchema = z.enum(['id','uploadId','domain','name','positioning','estimatedMonthlyTraffic','audience','topTopics','topContentGaps']);

export const TechnicalIssueScalarFieldEnumSchema = z.enum(['id','uploadId','pageId','type','severity','details']);

export const ActionScalarFieldEnumSchema = z.enum(['id','uploadId','type','title','reason','evidence','priority','confidence','status','rejectReason','payload','createdAt']);

export const LlmLogScalarFieldEnumSchema = z.enum(['id','uploadId','agentName','prompt','contextPayload','rawOutput','latencyMs','createdAt']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const JsonNullValueInputSchema: z.ZodType<Prisma.JsonNullValueInput> = z.enum(['JsonNull',]).transform((value) => (value === 'JsonNull' ? Prisma.JsonNull : value));

export const QueryModeSchema = z.enum(['default','insensitive']);

export const NullsOrderSchema = z.enum(['first','last']);

export const JsonNullValueFilterSchema: z.ZodType<Prisma.JsonNullValueFilter> = z.enum(['DbNull','JsonNull','AnyNull',]).transform((value) => value === 'JsonNull' ? Prisma.JsonNull : value === 'DbNull' ? Prisma.DbNull : value === 'AnyNull' ? Prisma.AnyNull : value);
/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// UPLOAD SCHEMA
/////////////////////////////////////////

export const UploadSchema = z.object({
  id: z.cuid(),
  userId: z.string(),
  description: z.string().nullable(),
  currency: z.string().nullable(),
  generatedAt: z.coerce.date().nullable(),
  windowDays: z.number().int().nullable(),
  createdAt: z.coerce.date(),
})

export type Upload = z.infer<typeof UploadSchema>

/////////////////////////////////////////
// PAGE SCHEMA
/////////////////////////////////////////

export const PageSchema = z.object({
  id: z.cuid(),
  uploadId: z.string(),
  sourceId: z.string(),
  url: z.string(),
  title: z.string(),
  metaDescription: z.string().nullable(),
  targetKeyword: z.string().nullable(),
  intent: z.string().nullable(),
  audience: z.string().nullable(),
  wordCount: z.number().int().nullable(),
  publishedAt: z.coerce.date().nullable(),
  lastModified: z.coerce.date().nullable(),
  impressions: z.number().int().nullable(),
  clicks: z.number().int().nullable(),
  position: z.number().nullable(),
  ctr: z.number().nullable(),
  conversions: z.number().int().nullable(),
  conversionRate: z.number().nullable(),
})

export type Page = z.infer<typeof PageSchema>

/////////////////////////////////////////
// KEYWORD SCHEMA
/////////////////////////////////////////

export const KeywordSchema = z.object({
  id: z.cuid(),
  uploadId: z.string(),
  keyword: z.string(),
  monthlyVolume: z.number().int().nullable(),
  difficulty: z.number().int().nullable(),
  cpc: z.number().nullable(),
  intent: z.string().nullable(),
  audience: z.string().nullable(),
  topCompetitor: z.string().nullable(),
  currentlyRankingPageId: z.string().nullable(),
})

export type Keyword = z.infer<typeof KeywordSchema>

/////////////////////////////////////////
// COMPETITOR SCHEMA
/////////////////////////////////////////

export const CompetitorSchema = z.object({
  id: z.cuid(),
  uploadId: z.string(),
  domain: z.string(),
  name: z.string().nullable(),
  positioning: z.string().nullable(),
  estimatedMonthlyTraffic: z.number().int().nullable(),
  audience: z.string().nullable(),
  topTopics: z.string().array(),
  topContentGaps: z.string().array(),
})

export type Competitor = z.infer<typeof CompetitorSchema>

/////////////////////////////////////////
// TECHNICAL ISSUE SCHEMA
/////////////////////////////////////////

export const TechnicalIssueSchema = z.object({
  id: z.cuid(),
  uploadId: z.string(),
  pageId: z.string(),
  type: z.string(),
  severity: z.string(),
  details: z.string(),
})

export type TechnicalIssue = z.infer<typeof TechnicalIssueSchema>

/////////////////////////////////////////
// ACTION SCHEMA
/////////////////////////////////////////

export const ActionSchema = z.object({
  id: z.cuid(),
  uploadId: z.string(),
  type: z.string(),
  title: z.string(),
  reason: z.string(),
  evidence: z.string(),
  priority: z.string(),
  confidence: z.number().int(),
  status: z.string(),
  rejectReason: z.string().nullable(),
  payload: JsonValueSchema,
  createdAt: z.coerce.date(),
})

export type Action = z.infer<typeof ActionSchema>

/////////////////////////////////////////
// LLM LOG SCHEMA
/////////////////////////////////////////

export const LlmLogSchema = z.object({
  id: z.cuid(),
  uploadId: z.string(),
  agentName: z.string(),
  prompt: z.string(),
  contextPayload: JsonValueSchema,
  rawOutput: z.string(),
  latencyMs: z.number().int(),
  createdAt: z.coerce.date(),
})

export type LlmLog = z.infer<typeof LlmLogSchema>

/////////////////////////////////////////
// SELECT & INCLUDE
/////////////////////////////////////////

// UPLOAD
//------------------------------------------------------

export const UploadIncludeSchema: z.ZodType<Prisma.UploadInclude> = z.object({
  pages: z.union([z.boolean(),z.lazy(() => PageFindManyArgsSchema)]).optional(),
  keywords: z.union([z.boolean(),z.lazy(() => KeywordFindManyArgsSchema)]).optional(),
  competitors: z.union([z.boolean(),z.lazy(() => CompetitorFindManyArgsSchema)]).optional(),
  technicalIssues: z.union([z.boolean(),z.lazy(() => TechnicalIssueFindManyArgsSchema)]).optional(),
  actions: z.union([z.boolean(),z.lazy(() => ActionFindManyArgsSchema)]).optional(),
  llmLogs: z.union([z.boolean(),z.lazy(() => LlmLogFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UploadCountOutputTypeArgsSchema)]).optional(),
}).strict();

export const UploadArgsSchema: z.ZodType<Prisma.UploadDefaultArgs> = z.object({
  select: z.lazy(() => UploadSelectSchema).optional(),
  include: z.lazy(() => UploadIncludeSchema).optional(),
}).strict();

export const UploadCountOutputTypeArgsSchema: z.ZodType<Prisma.UploadCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => UploadCountOutputTypeSelectSchema).nullish(),
}).strict();

export const UploadCountOutputTypeSelectSchema: z.ZodType<Prisma.UploadCountOutputTypeSelect> = z.object({
  pages: z.boolean().optional(),
  keywords: z.boolean().optional(),
  competitors: z.boolean().optional(),
  technicalIssues: z.boolean().optional(),
  actions: z.boolean().optional(),
  llmLogs: z.boolean().optional(),
}).strict();

export const UploadSelectSchema: z.ZodType<Prisma.UploadSelect> = z.object({
  id: z.boolean().optional(),
  userId: z.boolean().optional(),
  description: z.boolean().optional(),
  currency: z.boolean().optional(),
  generatedAt: z.boolean().optional(),
  windowDays: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  pages: z.union([z.boolean(),z.lazy(() => PageFindManyArgsSchema)]).optional(),
  keywords: z.union([z.boolean(),z.lazy(() => KeywordFindManyArgsSchema)]).optional(),
  competitors: z.union([z.boolean(),z.lazy(() => CompetitorFindManyArgsSchema)]).optional(),
  technicalIssues: z.union([z.boolean(),z.lazy(() => TechnicalIssueFindManyArgsSchema)]).optional(),
  actions: z.union([z.boolean(),z.lazy(() => ActionFindManyArgsSchema)]).optional(),
  llmLogs: z.union([z.boolean(),z.lazy(() => LlmLogFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UploadCountOutputTypeArgsSchema)]).optional(),
}).strict()

// PAGE
//------------------------------------------------------

export const PageIncludeSchema: z.ZodType<Prisma.PageInclude> = z.object({
  upload: z.union([z.boolean(),z.lazy(() => UploadArgsSchema)]).optional(),
  technicalIssues: z.union([z.boolean(),z.lazy(() => TechnicalIssueFindManyArgsSchema)]).optional(),
  keywords: z.union([z.boolean(),z.lazy(() => KeywordFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => PageCountOutputTypeArgsSchema)]).optional(),
}).strict();

export const PageArgsSchema: z.ZodType<Prisma.PageDefaultArgs> = z.object({
  select: z.lazy(() => PageSelectSchema).optional(),
  include: z.lazy(() => PageIncludeSchema).optional(),
}).strict();

export const PageCountOutputTypeArgsSchema: z.ZodType<Prisma.PageCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => PageCountOutputTypeSelectSchema).nullish(),
}).strict();

export const PageCountOutputTypeSelectSchema: z.ZodType<Prisma.PageCountOutputTypeSelect> = z.object({
  technicalIssues: z.boolean().optional(),
  keywords: z.boolean().optional(),
}).strict();

export const PageSelectSchema: z.ZodType<Prisma.PageSelect> = z.object({
  id: z.boolean().optional(),
  uploadId: z.boolean().optional(),
  sourceId: z.boolean().optional(),
  url: z.boolean().optional(),
  title: z.boolean().optional(),
  metaDescription: z.boolean().optional(),
  targetKeyword: z.boolean().optional(),
  intent: z.boolean().optional(),
  audience: z.boolean().optional(),
  wordCount: z.boolean().optional(),
  publishedAt: z.boolean().optional(),
  lastModified: z.boolean().optional(),
  impressions: z.boolean().optional(),
  clicks: z.boolean().optional(),
  position: z.boolean().optional(),
  ctr: z.boolean().optional(),
  conversions: z.boolean().optional(),
  conversionRate: z.boolean().optional(),
  upload: z.union([z.boolean(),z.lazy(() => UploadArgsSchema)]).optional(),
  technicalIssues: z.union([z.boolean(),z.lazy(() => TechnicalIssueFindManyArgsSchema)]).optional(),
  keywords: z.union([z.boolean(),z.lazy(() => KeywordFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => PageCountOutputTypeArgsSchema)]).optional(),
}).strict()

// KEYWORD
//------------------------------------------------------

export const KeywordIncludeSchema: z.ZodType<Prisma.KeywordInclude> = z.object({
  upload: z.union([z.boolean(),z.lazy(() => UploadArgsSchema)]).optional(),
  page: z.union([z.boolean(),z.lazy(() => PageArgsSchema)]).optional(),
}).strict();

export const KeywordArgsSchema: z.ZodType<Prisma.KeywordDefaultArgs> = z.object({
  select: z.lazy(() => KeywordSelectSchema).optional(),
  include: z.lazy(() => KeywordIncludeSchema).optional(),
}).strict();

export const KeywordSelectSchema: z.ZodType<Prisma.KeywordSelect> = z.object({
  id: z.boolean().optional(),
  uploadId: z.boolean().optional(),
  keyword: z.boolean().optional(),
  monthlyVolume: z.boolean().optional(),
  difficulty: z.boolean().optional(),
  cpc: z.boolean().optional(),
  intent: z.boolean().optional(),
  audience: z.boolean().optional(),
  topCompetitor: z.boolean().optional(),
  currentlyRankingPageId: z.boolean().optional(),
  upload: z.union([z.boolean(),z.lazy(() => UploadArgsSchema)]).optional(),
  page: z.union([z.boolean(),z.lazy(() => PageArgsSchema)]).optional(),
}).strict()

// COMPETITOR
//------------------------------------------------------

export const CompetitorIncludeSchema: z.ZodType<Prisma.CompetitorInclude> = z.object({
  upload: z.union([z.boolean(),z.lazy(() => UploadArgsSchema)]).optional(),
}).strict();

export const CompetitorArgsSchema: z.ZodType<Prisma.CompetitorDefaultArgs> = z.object({
  select: z.lazy(() => CompetitorSelectSchema).optional(),
  include: z.lazy(() => CompetitorIncludeSchema).optional(),
}).strict();

export const CompetitorSelectSchema: z.ZodType<Prisma.CompetitorSelect> = z.object({
  id: z.boolean().optional(),
  uploadId: z.boolean().optional(),
  domain: z.boolean().optional(),
  name: z.boolean().optional(),
  positioning: z.boolean().optional(),
  estimatedMonthlyTraffic: z.boolean().optional(),
  audience: z.boolean().optional(),
  topTopics: z.boolean().optional(),
  topContentGaps: z.boolean().optional(),
  upload: z.union([z.boolean(),z.lazy(() => UploadArgsSchema)]).optional(),
}).strict()

// TECHNICAL ISSUE
//------------------------------------------------------

export const TechnicalIssueIncludeSchema: z.ZodType<Prisma.TechnicalIssueInclude> = z.object({
  upload: z.union([z.boolean(),z.lazy(() => UploadArgsSchema)]).optional(),
  page: z.union([z.boolean(),z.lazy(() => PageArgsSchema)]).optional(),
}).strict();

export const TechnicalIssueArgsSchema: z.ZodType<Prisma.TechnicalIssueDefaultArgs> = z.object({
  select: z.lazy(() => TechnicalIssueSelectSchema).optional(),
  include: z.lazy(() => TechnicalIssueIncludeSchema).optional(),
}).strict();

export const TechnicalIssueSelectSchema: z.ZodType<Prisma.TechnicalIssueSelect> = z.object({
  id: z.boolean().optional(),
  uploadId: z.boolean().optional(),
  pageId: z.boolean().optional(),
  type: z.boolean().optional(),
  severity: z.boolean().optional(),
  details: z.boolean().optional(),
  upload: z.union([z.boolean(),z.lazy(() => UploadArgsSchema)]).optional(),
  page: z.union([z.boolean(),z.lazy(() => PageArgsSchema)]).optional(),
}).strict()

// ACTION
//------------------------------------------------------

export const ActionIncludeSchema: z.ZodType<Prisma.ActionInclude> = z.object({
  upload: z.union([z.boolean(),z.lazy(() => UploadArgsSchema)]).optional(),
}).strict();

export const ActionArgsSchema: z.ZodType<Prisma.ActionDefaultArgs> = z.object({
  select: z.lazy(() => ActionSelectSchema).optional(),
  include: z.lazy(() => ActionIncludeSchema).optional(),
}).strict();

export const ActionSelectSchema: z.ZodType<Prisma.ActionSelect> = z.object({
  id: z.boolean().optional(),
  uploadId: z.boolean().optional(),
  type: z.boolean().optional(),
  title: z.boolean().optional(),
  reason: z.boolean().optional(),
  evidence: z.boolean().optional(),
  priority: z.boolean().optional(),
  confidence: z.boolean().optional(),
  status: z.boolean().optional(),
  rejectReason: z.boolean().optional(),
  payload: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  upload: z.union([z.boolean(),z.lazy(() => UploadArgsSchema)]).optional(),
}).strict()

// LLM LOG
//------------------------------------------------------

export const LlmLogIncludeSchema: z.ZodType<Prisma.LlmLogInclude> = z.object({
  upload: z.union([z.boolean(),z.lazy(() => UploadArgsSchema)]).optional(),
}).strict();

export const LlmLogArgsSchema: z.ZodType<Prisma.LlmLogDefaultArgs> = z.object({
  select: z.lazy(() => LlmLogSelectSchema).optional(),
  include: z.lazy(() => LlmLogIncludeSchema).optional(),
}).strict();

export const LlmLogSelectSchema: z.ZodType<Prisma.LlmLogSelect> = z.object({
  id: z.boolean().optional(),
  uploadId: z.boolean().optional(),
  agentName: z.boolean().optional(),
  prompt: z.boolean().optional(),
  contextPayload: z.boolean().optional(),
  rawOutput: z.boolean().optional(),
  latencyMs: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  upload: z.union([z.boolean(),z.lazy(() => UploadArgsSchema)]).optional(),
}).strict()


/////////////////////////////////////////
// INPUT TYPES
/////////////////////////////////////////

export const UploadWhereInputSchema: z.ZodType<Prisma.UploadWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => UploadWhereInputSchema), z.lazy(() => UploadWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UploadWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UploadWhereInputSchema), z.lazy(() => UploadWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  currency: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  generatedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date() ]).optional().nullable(),
  windowDays: z.union([ z.lazy(() => IntNullableFilterSchema), z.number() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  pages: z.lazy(() => PageListRelationFilterSchema).optional(),
  keywords: z.lazy(() => KeywordListRelationFilterSchema).optional(),
  competitors: z.lazy(() => CompetitorListRelationFilterSchema).optional(),
  technicalIssues: z.lazy(() => TechnicalIssueListRelationFilterSchema).optional(),
  actions: z.lazy(() => ActionListRelationFilterSchema).optional(),
  llmLogs: z.lazy(() => LlmLogListRelationFilterSchema).optional(),
});

export const UploadOrderByWithRelationInputSchema: z.ZodType<Prisma.UploadOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  description: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  currency: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  generatedAt: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  windowDays: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  pages: z.lazy(() => PageOrderByRelationAggregateInputSchema).optional(),
  keywords: z.lazy(() => KeywordOrderByRelationAggregateInputSchema).optional(),
  competitors: z.lazy(() => CompetitorOrderByRelationAggregateInputSchema).optional(),
  technicalIssues: z.lazy(() => TechnicalIssueOrderByRelationAggregateInputSchema).optional(),
  actions: z.lazy(() => ActionOrderByRelationAggregateInputSchema).optional(),
  llmLogs: z.lazy(() => LlmLogOrderByRelationAggregateInputSchema).optional(),
});

export const UploadWhereUniqueInputSchema: z.ZodType<Prisma.UploadWhereUniqueInput> = z.object({
  id: z.cuid(),
})
.and(z.strictObject({
  id: z.cuid().optional(),
  AND: z.union([ z.lazy(() => UploadWhereInputSchema), z.lazy(() => UploadWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UploadWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UploadWhereInputSchema), z.lazy(() => UploadWhereInputSchema).array() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  currency: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  generatedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date() ]).optional().nullable(),
  windowDays: z.union([ z.lazy(() => IntNullableFilterSchema), z.number().int() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  pages: z.lazy(() => PageListRelationFilterSchema).optional(),
  keywords: z.lazy(() => KeywordListRelationFilterSchema).optional(),
  competitors: z.lazy(() => CompetitorListRelationFilterSchema).optional(),
  technicalIssues: z.lazy(() => TechnicalIssueListRelationFilterSchema).optional(),
  actions: z.lazy(() => ActionListRelationFilterSchema).optional(),
  llmLogs: z.lazy(() => LlmLogListRelationFilterSchema).optional(),
}));

export const UploadOrderByWithAggregationInputSchema: z.ZodType<Prisma.UploadOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  description: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  currency: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  generatedAt: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  windowDays: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => UploadCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => UploadAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => UploadMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => UploadMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => UploadSumOrderByAggregateInputSchema).optional(),
});

export const UploadScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.UploadScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => UploadScalarWhereWithAggregatesInputSchema), z.lazy(() => UploadScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => UploadScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UploadScalarWhereWithAggregatesInputSchema), z.lazy(() => UploadScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  currency: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  generatedAt: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema), z.coerce.date() ]).optional().nullable(),
  windowDays: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema), z.number() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
});

export const PageWhereInputSchema: z.ZodType<Prisma.PageWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => PageWhereInputSchema), z.lazy(() => PageWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PageWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PageWhereInputSchema), z.lazy(() => PageWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  uploadId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  sourceId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  url: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  metaDescription: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  targetKeyword: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  intent: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  audience: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  wordCount: z.union([ z.lazy(() => IntNullableFilterSchema), z.number() ]).optional().nullable(),
  publishedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date() ]).optional().nullable(),
  lastModified: z.union([ z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date() ]).optional().nullable(),
  impressions: z.union([ z.lazy(() => IntNullableFilterSchema), z.number() ]).optional().nullable(),
  clicks: z.union([ z.lazy(() => IntNullableFilterSchema), z.number() ]).optional().nullable(),
  position: z.union([ z.lazy(() => FloatNullableFilterSchema), z.number() ]).optional().nullable(),
  ctr: z.union([ z.lazy(() => FloatNullableFilterSchema), z.number() ]).optional().nullable(),
  conversions: z.union([ z.lazy(() => IntNullableFilterSchema), z.number() ]).optional().nullable(),
  conversionRate: z.union([ z.lazy(() => FloatNullableFilterSchema), z.number() ]).optional().nullable(),
  upload: z.union([ z.lazy(() => UploadScalarRelationFilterSchema), z.lazy(() => UploadWhereInputSchema) ]).optional(),
  technicalIssues: z.lazy(() => TechnicalIssueListRelationFilterSchema).optional(),
  keywords: z.lazy(() => KeywordListRelationFilterSchema).optional(),
});

export const PageOrderByWithRelationInputSchema: z.ZodType<Prisma.PageOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  uploadId: z.lazy(() => SortOrderSchema).optional(),
  sourceId: z.lazy(() => SortOrderSchema).optional(),
  url: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  metaDescription: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  targetKeyword: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  intent: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  audience: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  wordCount: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  publishedAt: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  lastModified: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  impressions: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  clicks: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  position: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  ctr: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  conversions: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  conversionRate: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  upload: z.lazy(() => UploadOrderByWithRelationInputSchema).optional(),
  technicalIssues: z.lazy(() => TechnicalIssueOrderByRelationAggregateInputSchema).optional(),
  keywords: z.lazy(() => KeywordOrderByRelationAggregateInputSchema).optional(),
});

export const PageWhereUniqueInputSchema: z.ZodType<Prisma.PageWhereUniqueInput> = z.object({
  id: z.cuid(),
})
.and(z.strictObject({
  id: z.cuid().optional(),
  AND: z.union([ z.lazy(() => PageWhereInputSchema), z.lazy(() => PageWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PageWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PageWhereInputSchema), z.lazy(() => PageWhereInputSchema).array() ]).optional(),
  uploadId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  sourceId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  url: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  metaDescription: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  targetKeyword: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  intent: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  audience: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  wordCount: z.union([ z.lazy(() => IntNullableFilterSchema), z.number().int() ]).optional().nullable(),
  publishedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date() ]).optional().nullable(),
  lastModified: z.union([ z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date() ]).optional().nullable(),
  impressions: z.union([ z.lazy(() => IntNullableFilterSchema), z.number().int() ]).optional().nullable(),
  clicks: z.union([ z.lazy(() => IntNullableFilterSchema), z.number().int() ]).optional().nullable(),
  position: z.union([ z.lazy(() => FloatNullableFilterSchema), z.number() ]).optional().nullable(),
  ctr: z.union([ z.lazy(() => FloatNullableFilterSchema), z.number() ]).optional().nullable(),
  conversions: z.union([ z.lazy(() => IntNullableFilterSchema), z.number().int() ]).optional().nullable(),
  conversionRate: z.union([ z.lazy(() => FloatNullableFilterSchema), z.number() ]).optional().nullable(),
  upload: z.union([ z.lazy(() => UploadScalarRelationFilterSchema), z.lazy(() => UploadWhereInputSchema) ]).optional(),
  technicalIssues: z.lazy(() => TechnicalIssueListRelationFilterSchema).optional(),
  keywords: z.lazy(() => KeywordListRelationFilterSchema).optional(),
}));

export const PageOrderByWithAggregationInputSchema: z.ZodType<Prisma.PageOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  uploadId: z.lazy(() => SortOrderSchema).optional(),
  sourceId: z.lazy(() => SortOrderSchema).optional(),
  url: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  metaDescription: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  targetKeyword: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  intent: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  audience: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  wordCount: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  publishedAt: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  lastModified: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  impressions: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  clicks: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  position: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  ctr: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  conversions: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  conversionRate: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => PageCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => PageAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => PageMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => PageMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => PageSumOrderByAggregateInputSchema).optional(),
});

export const PageScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.PageScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => PageScalarWhereWithAggregatesInputSchema), z.lazy(() => PageScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => PageScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PageScalarWhereWithAggregatesInputSchema), z.lazy(() => PageScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  uploadId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  sourceId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  url: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  metaDescription: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  targetKeyword: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  intent: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  audience: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  wordCount: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema), z.number() ]).optional().nullable(),
  publishedAt: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema), z.coerce.date() ]).optional().nullable(),
  lastModified: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema), z.coerce.date() ]).optional().nullable(),
  impressions: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema), z.number() ]).optional().nullable(),
  clicks: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema), z.number() ]).optional().nullable(),
  position: z.union([ z.lazy(() => FloatNullableWithAggregatesFilterSchema), z.number() ]).optional().nullable(),
  ctr: z.union([ z.lazy(() => FloatNullableWithAggregatesFilterSchema), z.number() ]).optional().nullable(),
  conversions: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema), z.number() ]).optional().nullable(),
  conversionRate: z.union([ z.lazy(() => FloatNullableWithAggregatesFilterSchema), z.number() ]).optional().nullable(),
});

export const KeywordWhereInputSchema: z.ZodType<Prisma.KeywordWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => KeywordWhereInputSchema), z.lazy(() => KeywordWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => KeywordWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => KeywordWhereInputSchema), z.lazy(() => KeywordWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  uploadId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  keyword: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  monthlyVolume: z.union([ z.lazy(() => IntNullableFilterSchema), z.number() ]).optional().nullable(),
  difficulty: z.union([ z.lazy(() => IntNullableFilterSchema), z.number() ]).optional().nullable(),
  cpc: z.union([ z.lazy(() => FloatNullableFilterSchema), z.number() ]).optional().nullable(),
  intent: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  audience: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  topCompetitor: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  currentlyRankingPageId: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  upload: z.union([ z.lazy(() => UploadScalarRelationFilterSchema), z.lazy(() => UploadWhereInputSchema) ]).optional(),
  page: z.union([ z.lazy(() => PageNullableScalarRelationFilterSchema), z.lazy(() => PageWhereInputSchema) ]).optional().nullable(),
});

export const KeywordOrderByWithRelationInputSchema: z.ZodType<Prisma.KeywordOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  uploadId: z.lazy(() => SortOrderSchema).optional(),
  keyword: z.lazy(() => SortOrderSchema).optional(),
  monthlyVolume: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  difficulty: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  cpc: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  intent: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  audience: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  topCompetitor: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  currentlyRankingPageId: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  upload: z.lazy(() => UploadOrderByWithRelationInputSchema).optional(),
  page: z.lazy(() => PageOrderByWithRelationInputSchema).optional(),
});

export const KeywordWhereUniqueInputSchema: z.ZodType<Prisma.KeywordWhereUniqueInput> = z.object({
  id: z.cuid(),
})
.and(z.strictObject({
  id: z.cuid().optional(),
  AND: z.union([ z.lazy(() => KeywordWhereInputSchema), z.lazy(() => KeywordWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => KeywordWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => KeywordWhereInputSchema), z.lazy(() => KeywordWhereInputSchema).array() ]).optional(),
  uploadId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  keyword: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  monthlyVolume: z.union([ z.lazy(() => IntNullableFilterSchema), z.number().int() ]).optional().nullable(),
  difficulty: z.union([ z.lazy(() => IntNullableFilterSchema), z.number().int() ]).optional().nullable(),
  cpc: z.union([ z.lazy(() => FloatNullableFilterSchema), z.number() ]).optional().nullable(),
  intent: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  audience: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  topCompetitor: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  currentlyRankingPageId: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  upload: z.union([ z.lazy(() => UploadScalarRelationFilterSchema), z.lazy(() => UploadWhereInputSchema) ]).optional(),
  page: z.union([ z.lazy(() => PageNullableScalarRelationFilterSchema), z.lazy(() => PageWhereInputSchema) ]).optional().nullable(),
}));

export const KeywordOrderByWithAggregationInputSchema: z.ZodType<Prisma.KeywordOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  uploadId: z.lazy(() => SortOrderSchema).optional(),
  keyword: z.lazy(() => SortOrderSchema).optional(),
  monthlyVolume: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  difficulty: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  cpc: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  intent: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  audience: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  topCompetitor: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  currentlyRankingPageId: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => KeywordCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => KeywordAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => KeywordMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => KeywordMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => KeywordSumOrderByAggregateInputSchema).optional(),
});

export const KeywordScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.KeywordScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => KeywordScalarWhereWithAggregatesInputSchema), z.lazy(() => KeywordScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => KeywordScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => KeywordScalarWhereWithAggregatesInputSchema), z.lazy(() => KeywordScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  uploadId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  keyword: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  monthlyVolume: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema), z.number() ]).optional().nullable(),
  difficulty: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema), z.number() ]).optional().nullable(),
  cpc: z.union([ z.lazy(() => FloatNullableWithAggregatesFilterSchema), z.number() ]).optional().nullable(),
  intent: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  audience: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  topCompetitor: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  currentlyRankingPageId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
});

export const CompetitorWhereInputSchema: z.ZodType<Prisma.CompetitorWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => CompetitorWhereInputSchema), z.lazy(() => CompetitorWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CompetitorWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CompetitorWhereInputSchema), z.lazy(() => CompetitorWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  uploadId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  domain: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  positioning: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  estimatedMonthlyTraffic: z.union([ z.lazy(() => IntNullableFilterSchema), z.number() ]).optional().nullable(),
  audience: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  topTopics: z.lazy(() => StringNullableListFilterSchema).optional(),
  topContentGaps: z.lazy(() => StringNullableListFilterSchema).optional(),
  upload: z.union([ z.lazy(() => UploadScalarRelationFilterSchema), z.lazy(() => UploadWhereInputSchema) ]).optional(),
});

export const CompetitorOrderByWithRelationInputSchema: z.ZodType<Prisma.CompetitorOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  uploadId: z.lazy(() => SortOrderSchema).optional(),
  domain: z.lazy(() => SortOrderSchema).optional(),
  name: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  positioning: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  estimatedMonthlyTraffic: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  audience: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  topTopics: z.lazy(() => SortOrderSchema).optional(),
  topContentGaps: z.lazy(() => SortOrderSchema).optional(),
  upload: z.lazy(() => UploadOrderByWithRelationInputSchema).optional(),
});

export const CompetitorWhereUniqueInputSchema: z.ZodType<Prisma.CompetitorWhereUniqueInput> = z.object({
  id: z.cuid(),
})
.and(z.strictObject({
  id: z.cuid().optional(),
  AND: z.union([ z.lazy(() => CompetitorWhereInputSchema), z.lazy(() => CompetitorWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CompetitorWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CompetitorWhereInputSchema), z.lazy(() => CompetitorWhereInputSchema).array() ]).optional(),
  uploadId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  domain: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  positioning: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  estimatedMonthlyTraffic: z.union([ z.lazy(() => IntNullableFilterSchema), z.number().int() ]).optional().nullable(),
  audience: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  topTopics: z.lazy(() => StringNullableListFilterSchema).optional(),
  topContentGaps: z.lazy(() => StringNullableListFilterSchema).optional(),
  upload: z.union([ z.lazy(() => UploadScalarRelationFilterSchema), z.lazy(() => UploadWhereInputSchema) ]).optional(),
}));

export const CompetitorOrderByWithAggregationInputSchema: z.ZodType<Prisma.CompetitorOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  uploadId: z.lazy(() => SortOrderSchema).optional(),
  domain: z.lazy(() => SortOrderSchema).optional(),
  name: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  positioning: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  estimatedMonthlyTraffic: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  audience: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  topTopics: z.lazy(() => SortOrderSchema).optional(),
  topContentGaps: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => CompetitorCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => CompetitorAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => CompetitorMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => CompetitorMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => CompetitorSumOrderByAggregateInputSchema).optional(),
});

export const CompetitorScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.CompetitorScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => CompetitorScalarWhereWithAggregatesInputSchema), z.lazy(() => CompetitorScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => CompetitorScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CompetitorScalarWhereWithAggregatesInputSchema), z.lazy(() => CompetitorScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  uploadId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  domain: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  positioning: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  estimatedMonthlyTraffic: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema), z.number() ]).optional().nullable(),
  audience: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  topTopics: z.lazy(() => StringNullableListFilterSchema).optional(),
  topContentGaps: z.lazy(() => StringNullableListFilterSchema).optional(),
});

export const TechnicalIssueWhereInputSchema: z.ZodType<Prisma.TechnicalIssueWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => TechnicalIssueWhereInputSchema), z.lazy(() => TechnicalIssueWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => TechnicalIssueWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TechnicalIssueWhereInputSchema), z.lazy(() => TechnicalIssueWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  uploadId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  pageId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  type: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  severity: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  details: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  upload: z.union([ z.lazy(() => UploadScalarRelationFilterSchema), z.lazy(() => UploadWhereInputSchema) ]).optional(),
  page: z.union([ z.lazy(() => PageScalarRelationFilterSchema), z.lazy(() => PageWhereInputSchema) ]).optional(),
});

export const TechnicalIssueOrderByWithRelationInputSchema: z.ZodType<Prisma.TechnicalIssueOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  uploadId: z.lazy(() => SortOrderSchema).optional(),
  pageId: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  severity: z.lazy(() => SortOrderSchema).optional(),
  details: z.lazy(() => SortOrderSchema).optional(),
  upload: z.lazy(() => UploadOrderByWithRelationInputSchema).optional(),
  page: z.lazy(() => PageOrderByWithRelationInputSchema).optional(),
});

export const TechnicalIssueWhereUniqueInputSchema: z.ZodType<Prisma.TechnicalIssueWhereUniqueInput> = z.object({
  id: z.cuid(),
})
.and(z.strictObject({
  id: z.cuid().optional(),
  AND: z.union([ z.lazy(() => TechnicalIssueWhereInputSchema), z.lazy(() => TechnicalIssueWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => TechnicalIssueWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TechnicalIssueWhereInputSchema), z.lazy(() => TechnicalIssueWhereInputSchema).array() ]).optional(),
  uploadId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  pageId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  type: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  severity: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  details: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  upload: z.union([ z.lazy(() => UploadScalarRelationFilterSchema), z.lazy(() => UploadWhereInputSchema) ]).optional(),
  page: z.union([ z.lazy(() => PageScalarRelationFilterSchema), z.lazy(() => PageWhereInputSchema) ]).optional(),
}));

export const TechnicalIssueOrderByWithAggregationInputSchema: z.ZodType<Prisma.TechnicalIssueOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  uploadId: z.lazy(() => SortOrderSchema).optional(),
  pageId: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  severity: z.lazy(() => SortOrderSchema).optional(),
  details: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => TechnicalIssueCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => TechnicalIssueMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => TechnicalIssueMinOrderByAggregateInputSchema).optional(),
});

export const TechnicalIssueScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.TechnicalIssueScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => TechnicalIssueScalarWhereWithAggregatesInputSchema), z.lazy(() => TechnicalIssueScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => TechnicalIssueScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TechnicalIssueScalarWhereWithAggregatesInputSchema), z.lazy(() => TechnicalIssueScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  uploadId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  pageId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  type: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  severity: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  details: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
});

export const ActionWhereInputSchema: z.ZodType<Prisma.ActionWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => ActionWhereInputSchema), z.lazy(() => ActionWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ActionWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ActionWhereInputSchema), z.lazy(() => ActionWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  uploadId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  type: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  reason: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  evidence: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  priority: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  confidence: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  status: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  rejectReason: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  payload: z.lazy(() => JsonFilterSchema).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  upload: z.union([ z.lazy(() => UploadScalarRelationFilterSchema), z.lazy(() => UploadWhereInputSchema) ]).optional(),
});

export const ActionOrderByWithRelationInputSchema: z.ZodType<Prisma.ActionOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  uploadId: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  reason: z.lazy(() => SortOrderSchema).optional(),
  evidence: z.lazy(() => SortOrderSchema).optional(),
  priority: z.lazy(() => SortOrderSchema).optional(),
  confidence: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  rejectReason: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  payload: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  upload: z.lazy(() => UploadOrderByWithRelationInputSchema).optional(),
});

export const ActionWhereUniqueInputSchema: z.ZodType<Prisma.ActionWhereUniqueInput> = z.object({
  id: z.cuid(),
})
.and(z.strictObject({
  id: z.cuid().optional(),
  AND: z.union([ z.lazy(() => ActionWhereInputSchema), z.lazy(() => ActionWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ActionWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ActionWhereInputSchema), z.lazy(() => ActionWhereInputSchema).array() ]).optional(),
  uploadId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  type: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  reason: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  evidence: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  priority: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  confidence: z.union([ z.lazy(() => IntFilterSchema), z.number().int() ]).optional(),
  status: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  rejectReason: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  payload: z.lazy(() => JsonFilterSchema).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  upload: z.union([ z.lazy(() => UploadScalarRelationFilterSchema), z.lazy(() => UploadWhereInputSchema) ]).optional(),
}));

export const ActionOrderByWithAggregationInputSchema: z.ZodType<Prisma.ActionOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  uploadId: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  reason: z.lazy(() => SortOrderSchema).optional(),
  evidence: z.lazy(() => SortOrderSchema).optional(),
  priority: z.lazy(() => SortOrderSchema).optional(),
  confidence: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  rejectReason: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  payload: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => ActionCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => ActionAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ActionMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ActionMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => ActionSumOrderByAggregateInputSchema).optional(),
});

export const ActionScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ActionScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => ActionScalarWhereWithAggregatesInputSchema), z.lazy(() => ActionScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ActionScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ActionScalarWhereWithAggregatesInputSchema), z.lazy(() => ActionScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  uploadId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  type: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  reason: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  evidence: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  priority: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  confidence: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  status: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  rejectReason: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  payload: z.lazy(() => JsonWithAggregatesFilterSchema).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
});

export const LlmLogWhereInputSchema: z.ZodType<Prisma.LlmLogWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => LlmLogWhereInputSchema), z.lazy(() => LlmLogWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => LlmLogWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => LlmLogWhereInputSchema), z.lazy(() => LlmLogWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  uploadId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  agentName: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  prompt: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  contextPayload: z.lazy(() => JsonFilterSchema).optional(),
  rawOutput: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  latencyMs: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  upload: z.union([ z.lazy(() => UploadScalarRelationFilterSchema), z.lazy(() => UploadWhereInputSchema) ]).optional(),
});

export const LlmLogOrderByWithRelationInputSchema: z.ZodType<Prisma.LlmLogOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  uploadId: z.lazy(() => SortOrderSchema).optional(),
  agentName: z.lazy(() => SortOrderSchema).optional(),
  prompt: z.lazy(() => SortOrderSchema).optional(),
  contextPayload: z.lazy(() => SortOrderSchema).optional(),
  rawOutput: z.lazy(() => SortOrderSchema).optional(),
  latencyMs: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  upload: z.lazy(() => UploadOrderByWithRelationInputSchema).optional(),
});

export const LlmLogWhereUniqueInputSchema: z.ZodType<Prisma.LlmLogWhereUniqueInput> = z.object({
  id: z.cuid(),
})
.and(z.strictObject({
  id: z.cuid().optional(),
  AND: z.union([ z.lazy(() => LlmLogWhereInputSchema), z.lazy(() => LlmLogWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => LlmLogWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => LlmLogWhereInputSchema), z.lazy(() => LlmLogWhereInputSchema).array() ]).optional(),
  uploadId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  agentName: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  prompt: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  contextPayload: z.lazy(() => JsonFilterSchema).optional(),
  rawOutput: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  latencyMs: z.union([ z.lazy(() => IntFilterSchema), z.number().int() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  upload: z.union([ z.lazy(() => UploadScalarRelationFilterSchema), z.lazy(() => UploadWhereInputSchema) ]).optional(),
}));

export const LlmLogOrderByWithAggregationInputSchema: z.ZodType<Prisma.LlmLogOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  uploadId: z.lazy(() => SortOrderSchema).optional(),
  agentName: z.lazy(() => SortOrderSchema).optional(),
  prompt: z.lazy(() => SortOrderSchema).optional(),
  contextPayload: z.lazy(() => SortOrderSchema).optional(),
  rawOutput: z.lazy(() => SortOrderSchema).optional(),
  latencyMs: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => LlmLogCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => LlmLogAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => LlmLogMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => LlmLogMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => LlmLogSumOrderByAggregateInputSchema).optional(),
});

export const LlmLogScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.LlmLogScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => LlmLogScalarWhereWithAggregatesInputSchema), z.lazy(() => LlmLogScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => LlmLogScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => LlmLogScalarWhereWithAggregatesInputSchema), z.lazy(() => LlmLogScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  uploadId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  agentName: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  prompt: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  contextPayload: z.lazy(() => JsonWithAggregatesFilterSchema).optional(),
  rawOutput: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  latencyMs: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
});

export const UploadCreateInputSchema: z.ZodType<Prisma.UploadCreateInput> = z.strictObject({
  id: z.cuid().optional(),
  userId: z.string(),
  description: z.string().optional().nullable(),
  currency: z.string().optional().nullable(),
  generatedAt: z.coerce.date().optional().nullable(),
  windowDays: z.number().int().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  pages: z.lazy(() => PageCreateNestedManyWithoutUploadInputSchema).optional(),
  keywords: z.lazy(() => KeywordCreateNestedManyWithoutUploadInputSchema).optional(),
  competitors: z.lazy(() => CompetitorCreateNestedManyWithoutUploadInputSchema).optional(),
  technicalIssues: z.lazy(() => TechnicalIssueCreateNestedManyWithoutUploadInputSchema).optional(),
  actions: z.lazy(() => ActionCreateNestedManyWithoutUploadInputSchema).optional(),
  llmLogs: z.lazy(() => LlmLogCreateNestedManyWithoutUploadInputSchema).optional(),
});

export const UploadUncheckedCreateInputSchema: z.ZodType<Prisma.UploadUncheckedCreateInput> = z.strictObject({
  id: z.cuid().optional(),
  userId: z.string(),
  description: z.string().optional().nullable(),
  currency: z.string().optional().nullable(),
  generatedAt: z.coerce.date().optional().nullable(),
  windowDays: z.number().int().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  pages: z.lazy(() => PageUncheckedCreateNestedManyWithoutUploadInputSchema).optional(),
  keywords: z.lazy(() => KeywordUncheckedCreateNestedManyWithoutUploadInputSchema).optional(),
  competitors: z.lazy(() => CompetitorUncheckedCreateNestedManyWithoutUploadInputSchema).optional(),
  technicalIssues: z.lazy(() => TechnicalIssueUncheckedCreateNestedManyWithoutUploadInputSchema).optional(),
  actions: z.lazy(() => ActionUncheckedCreateNestedManyWithoutUploadInputSchema).optional(),
  llmLogs: z.lazy(() => LlmLogUncheckedCreateNestedManyWithoutUploadInputSchema).optional(),
});

export const UploadUpdateInputSchema: z.ZodType<Prisma.UploadUpdateInput> = z.strictObject({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  currency: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  generatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  windowDays: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  pages: z.lazy(() => PageUpdateManyWithoutUploadNestedInputSchema).optional(),
  keywords: z.lazy(() => KeywordUpdateManyWithoutUploadNestedInputSchema).optional(),
  competitors: z.lazy(() => CompetitorUpdateManyWithoutUploadNestedInputSchema).optional(),
  technicalIssues: z.lazy(() => TechnicalIssueUpdateManyWithoutUploadNestedInputSchema).optional(),
  actions: z.lazy(() => ActionUpdateManyWithoutUploadNestedInputSchema).optional(),
  llmLogs: z.lazy(() => LlmLogUpdateManyWithoutUploadNestedInputSchema).optional(),
});

export const UploadUncheckedUpdateInputSchema: z.ZodType<Prisma.UploadUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  currency: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  generatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  windowDays: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  pages: z.lazy(() => PageUncheckedUpdateManyWithoutUploadNestedInputSchema).optional(),
  keywords: z.lazy(() => KeywordUncheckedUpdateManyWithoutUploadNestedInputSchema).optional(),
  competitors: z.lazy(() => CompetitorUncheckedUpdateManyWithoutUploadNestedInputSchema).optional(),
  technicalIssues: z.lazy(() => TechnicalIssueUncheckedUpdateManyWithoutUploadNestedInputSchema).optional(),
  actions: z.lazy(() => ActionUncheckedUpdateManyWithoutUploadNestedInputSchema).optional(),
  llmLogs: z.lazy(() => LlmLogUncheckedUpdateManyWithoutUploadNestedInputSchema).optional(),
});

export const UploadCreateManyInputSchema: z.ZodType<Prisma.UploadCreateManyInput> = z.strictObject({
  id: z.cuid().optional(),
  userId: z.string(),
  description: z.string().optional().nullable(),
  currency: z.string().optional().nullable(),
  generatedAt: z.coerce.date().optional().nullable(),
  windowDays: z.number().int().optional().nullable(),
  createdAt: z.coerce.date().optional(),
});

export const UploadUpdateManyMutationInputSchema: z.ZodType<Prisma.UploadUpdateManyMutationInput> = z.strictObject({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  currency: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  generatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  windowDays: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const UploadUncheckedUpdateManyInputSchema: z.ZodType<Prisma.UploadUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  currency: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  generatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  windowDays: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const PageCreateInputSchema: z.ZodType<Prisma.PageCreateInput> = z.strictObject({
  id: z.cuid().optional(),
  sourceId: z.string(),
  url: z.string(),
  title: z.string(),
  metaDescription: z.string().optional().nullable(),
  targetKeyword: z.string().optional().nullable(),
  intent: z.string().optional().nullable(),
  audience: z.string().optional().nullable(),
  wordCount: z.number().int().optional().nullable(),
  publishedAt: z.coerce.date().optional().nullable(),
  lastModified: z.coerce.date().optional().nullable(),
  impressions: z.number().int().optional().nullable(),
  clicks: z.number().int().optional().nullable(),
  position: z.number().optional().nullable(),
  ctr: z.number().optional().nullable(),
  conversions: z.number().int().optional().nullable(),
  conversionRate: z.number().optional().nullable(),
  upload: z.lazy(() => UploadCreateNestedOneWithoutPagesInputSchema),
  technicalIssues: z.lazy(() => TechnicalIssueCreateNestedManyWithoutPageInputSchema).optional(),
  keywords: z.lazy(() => KeywordCreateNestedManyWithoutPageInputSchema).optional(),
});

export const PageUncheckedCreateInputSchema: z.ZodType<Prisma.PageUncheckedCreateInput> = z.strictObject({
  id: z.cuid().optional(),
  uploadId: z.string(),
  sourceId: z.string(),
  url: z.string(),
  title: z.string(),
  metaDescription: z.string().optional().nullable(),
  targetKeyword: z.string().optional().nullable(),
  intent: z.string().optional().nullable(),
  audience: z.string().optional().nullable(),
  wordCount: z.number().int().optional().nullable(),
  publishedAt: z.coerce.date().optional().nullable(),
  lastModified: z.coerce.date().optional().nullable(),
  impressions: z.number().int().optional().nullable(),
  clicks: z.number().int().optional().nullable(),
  position: z.number().optional().nullable(),
  ctr: z.number().optional().nullable(),
  conversions: z.number().int().optional().nullable(),
  conversionRate: z.number().optional().nullable(),
  technicalIssues: z.lazy(() => TechnicalIssueUncheckedCreateNestedManyWithoutPageInputSchema).optional(),
  keywords: z.lazy(() => KeywordUncheckedCreateNestedManyWithoutPageInputSchema).optional(),
});

export const PageUpdateInputSchema: z.ZodType<Prisma.PageUpdateInput> = z.strictObject({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sourceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  metaDescription: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  targetKeyword: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  intent: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  audience: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  wordCount: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  publishedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastModified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  impressions: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  clicks: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  position: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ctr: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  conversions: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  conversionRate: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  upload: z.lazy(() => UploadUpdateOneRequiredWithoutPagesNestedInputSchema).optional(),
  technicalIssues: z.lazy(() => TechnicalIssueUpdateManyWithoutPageNestedInputSchema).optional(),
  keywords: z.lazy(() => KeywordUpdateManyWithoutPageNestedInputSchema).optional(),
});

export const PageUncheckedUpdateInputSchema: z.ZodType<Prisma.PageUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  uploadId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sourceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  metaDescription: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  targetKeyword: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  intent: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  audience: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  wordCount: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  publishedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastModified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  impressions: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  clicks: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  position: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ctr: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  conversions: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  conversionRate: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  technicalIssues: z.lazy(() => TechnicalIssueUncheckedUpdateManyWithoutPageNestedInputSchema).optional(),
  keywords: z.lazy(() => KeywordUncheckedUpdateManyWithoutPageNestedInputSchema).optional(),
});

export const PageCreateManyInputSchema: z.ZodType<Prisma.PageCreateManyInput> = z.strictObject({
  id: z.cuid().optional(),
  uploadId: z.string(),
  sourceId: z.string(),
  url: z.string(),
  title: z.string(),
  metaDescription: z.string().optional().nullable(),
  targetKeyword: z.string().optional().nullable(),
  intent: z.string().optional().nullable(),
  audience: z.string().optional().nullable(),
  wordCount: z.number().int().optional().nullable(),
  publishedAt: z.coerce.date().optional().nullable(),
  lastModified: z.coerce.date().optional().nullable(),
  impressions: z.number().int().optional().nullable(),
  clicks: z.number().int().optional().nullable(),
  position: z.number().optional().nullable(),
  ctr: z.number().optional().nullable(),
  conversions: z.number().int().optional().nullable(),
  conversionRate: z.number().optional().nullable(),
});

export const PageUpdateManyMutationInputSchema: z.ZodType<Prisma.PageUpdateManyMutationInput> = z.strictObject({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sourceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  metaDescription: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  targetKeyword: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  intent: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  audience: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  wordCount: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  publishedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastModified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  impressions: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  clicks: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  position: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ctr: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  conversions: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  conversionRate: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const PageUncheckedUpdateManyInputSchema: z.ZodType<Prisma.PageUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  uploadId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sourceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  metaDescription: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  targetKeyword: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  intent: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  audience: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  wordCount: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  publishedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastModified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  impressions: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  clicks: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  position: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ctr: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  conversions: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  conversionRate: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const KeywordCreateInputSchema: z.ZodType<Prisma.KeywordCreateInput> = z.strictObject({
  id: z.cuid().optional(),
  keyword: z.string(),
  monthlyVolume: z.number().int().optional().nullable(),
  difficulty: z.number().int().optional().nullable(),
  cpc: z.number().optional().nullable(),
  intent: z.string().optional().nullable(),
  audience: z.string().optional().nullable(),
  topCompetitor: z.string().optional().nullable(),
  upload: z.lazy(() => UploadCreateNestedOneWithoutKeywordsInputSchema),
  page: z.lazy(() => PageCreateNestedOneWithoutKeywordsInputSchema).optional(),
});

export const KeywordUncheckedCreateInputSchema: z.ZodType<Prisma.KeywordUncheckedCreateInput> = z.strictObject({
  id: z.cuid().optional(),
  uploadId: z.string(),
  keyword: z.string(),
  monthlyVolume: z.number().int().optional().nullable(),
  difficulty: z.number().int().optional().nullable(),
  cpc: z.number().optional().nullable(),
  intent: z.string().optional().nullable(),
  audience: z.string().optional().nullable(),
  topCompetitor: z.string().optional().nullable(),
  currentlyRankingPageId: z.string().optional().nullable(),
});

export const KeywordUpdateInputSchema: z.ZodType<Prisma.KeywordUpdateInput> = z.strictObject({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  keyword: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  monthlyVolume: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  difficulty: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  cpc: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  intent: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  audience: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  topCompetitor: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  upload: z.lazy(() => UploadUpdateOneRequiredWithoutKeywordsNestedInputSchema).optional(),
  page: z.lazy(() => PageUpdateOneWithoutKeywordsNestedInputSchema).optional(),
});

export const KeywordUncheckedUpdateInputSchema: z.ZodType<Prisma.KeywordUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  uploadId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  keyword: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  monthlyVolume: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  difficulty: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  cpc: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  intent: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  audience: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  topCompetitor: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  currentlyRankingPageId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const KeywordCreateManyInputSchema: z.ZodType<Prisma.KeywordCreateManyInput> = z.strictObject({
  id: z.cuid().optional(),
  uploadId: z.string(),
  keyword: z.string(),
  monthlyVolume: z.number().int().optional().nullable(),
  difficulty: z.number().int().optional().nullable(),
  cpc: z.number().optional().nullable(),
  intent: z.string().optional().nullable(),
  audience: z.string().optional().nullable(),
  topCompetitor: z.string().optional().nullable(),
  currentlyRankingPageId: z.string().optional().nullable(),
});

export const KeywordUpdateManyMutationInputSchema: z.ZodType<Prisma.KeywordUpdateManyMutationInput> = z.strictObject({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  keyword: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  monthlyVolume: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  difficulty: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  cpc: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  intent: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  audience: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  topCompetitor: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const KeywordUncheckedUpdateManyInputSchema: z.ZodType<Prisma.KeywordUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  uploadId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  keyword: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  monthlyVolume: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  difficulty: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  cpc: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  intent: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  audience: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  topCompetitor: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  currentlyRankingPageId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const CompetitorCreateInputSchema: z.ZodType<Prisma.CompetitorCreateInput> = z.strictObject({
  id: z.cuid().optional(),
  domain: z.string(),
  name: z.string().optional().nullable(),
  positioning: z.string().optional().nullable(),
  estimatedMonthlyTraffic: z.number().int().optional().nullable(),
  audience: z.string().optional().nullable(),
  topTopics: z.union([ z.lazy(() => CompetitorCreatetopTopicsInputSchema), z.string().array() ]).optional(),
  topContentGaps: z.union([ z.lazy(() => CompetitorCreatetopContentGapsInputSchema), z.string().array() ]).optional(),
  upload: z.lazy(() => UploadCreateNestedOneWithoutCompetitorsInputSchema),
});

export const CompetitorUncheckedCreateInputSchema: z.ZodType<Prisma.CompetitorUncheckedCreateInput> = z.strictObject({
  id: z.cuid().optional(),
  uploadId: z.string(),
  domain: z.string(),
  name: z.string().optional().nullable(),
  positioning: z.string().optional().nullable(),
  estimatedMonthlyTraffic: z.number().int().optional().nullable(),
  audience: z.string().optional().nullable(),
  topTopics: z.union([ z.lazy(() => CompetitorCreatetopTopicsInputSchema), z.string().array() ]).optional(),
  topContentGaps: z.union([ z.lazy(() => CompetitorCreatetopContentGapsInputSchema), z.string().array() ]).optional(),
});

export const CompetitorUpdateInputSchema: z.ZodType<Prisma.CompetitorUpdateInput> = z.strictObject({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  domain: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  positioning: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  estimatedMonthlyTraffic: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  audience: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  topTopics: z.union([ z.lazy(() => CompetitorUpdatetopTopicsInputSchema), z.string().array() ]).optional(),
  topContentGaps: z.union([ z.lazy(() => CompetitorUpdatetopContentGapsInputSchema), z.string().array() ]).optional(),
  upload: z.lazy(() => UploadUpdateOneRequiredWithoutCompetitorsNestedInputSchema).optional(),
});

export const CompetitorUncheckedUpdateInputSchema: z.ZodType<Prisma.CompetitorUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  uploadId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  domain: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  positioning: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  estimatedMonthlyTraffic: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  audience: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  topTopics: z.union([ z.lazy(() => CompetitorUpdatetopTopicsInputSchema), z.string().array() ]).optional(),
  topContentGaps: z.union([ z.lazy(() => CompetitorUpdatetopContentGapsInputSchema), z.string().array() ]).optional(),
});

export const CompetitorCreateManyInputSchema: z.ZodType<Prisma.CompetitorCreateManyInput> = z.strictObject({
  id: z.cuid().optional(),
  uploadId: z.string(),
  domain: z.string(),
  name: z.string().optional().nullable(),
  positioning: z.string().optional().nullable(),
  estimatedMonthlyTraffic: z.number().int().optional().nullable(),
  audience: z.string().optional().nullable(),
  topTopics: z.union([ z.lazy(() => CompetitorCreatetopTopicsInputSchema), z.string().array() ]).optional(),
  topContentGaps: z.union([ z.lazy(() => CompetitorCreatetopContentGapsInputSchema), z.string().array() ]).optional(),
});

export const CompetitorUpdateManyMutationInputSchema: z.ZodType<Prisma.CompetitorUpdateManyMutationInput> = z.strictObject({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  domain: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  positioning: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  estimatedMonthlyTraffic: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  audience: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  topTopics: z.union([ z.lazy(() => CompetitorUpdatetopTopicsInputSchema), z.string().array() ]).optional(),
  topContentGaps: z.union([ z.lazy(() => CompetitorUpdatetopContentGapsInputSchema), z.string().array() ]).optional(),
});

export const CompetitorUncheckedUpdateManyInputSchema: z.ZodType<Prisma.CompetitorUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  uploadId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  domain: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  positioning: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  estimatedMonthlyTraffic: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  audience: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  topTopics: z.union([ z.lazy(() => CompetitorUpdatetopTopicsInputSchema), z.string().array() ]).optional(),
  topContentGaps: z.union([ z.lazy(() => CompetitorUpdatetopContentGapsInputSchema), z.string().array() ]).optional(),
});

export const TechnicalIssueCreateInputSchema: z.ZodType<Prisma.TechnicalIssueCreateInput> = z.strictObject({
  id: z.cuid().optional(),
  type: z.string(),
  severity: z.string(),
  details: z.string(),
  upload: z.lazy(() => UploadCreateNestedOneWithoutTechnicalIssuesInputSchema),
  page: z.lazy(() => PageCreateNestedOneWithoutTechnicalIssuesInputSchema),
});

export const TechnicalIssueUncheckedCreateInputSchema: z.ZodType<Prisma.TechnicalIssueUncheckedCreateInput> = z.strictObject({
  id: z.cuid().optional(),
  uploadId: z.string(),
  pageId: z.string(),
  type: z.string(),
  severity: z.string(),
  details: z.string(),
});

export const TechnicalIssueUpdateInputSchema: z.ZodType<Prisma.TechnicalIssueUpdateInput> = z.strictObject({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  severity: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  details: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  upload: z.lazy(() => UploadUpdateOneRequiredWithoutTechnicalIssuesNestedInputSchema).optional(),
  page: z.lazy(() => PageUpdateOneRequiredWithoutTechnicalIssuesNestedInputSchema).optional(),
});

export const TechnicalIssueUncheckedUpdateInputSchema: z.ZodType<Prisma.TechnicalIssueUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  uploadId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  pageId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  severity: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  details: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
});

export const TechnicalIssueCreateManyInputSchema: z.ZodType<Prisma.TechnicalIssueCreateManyInput> = z.strictObject({
  id: z.cuid().optional(),
  uploadId: z.string(),
  pageId: z.string(),
  type: z.string(),
  severity: z.string(),
  details: z.string(),
});

export const TechnicalIssueUpdateManyMutationInputSchema: z.ZodType<Prisma.TechnicalIssueUpdateManyMutationInput> = z.strictObject({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  severity: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  details: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
});

export const TechnicalIssueUncheckedUpdateManyInputSchema: z.ZodType<Prisma.TechnicalIssueUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  uploadId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  pageId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  severity: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  details: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
});

export const ActionCreateInputSchema: z.ZodType<Prisma.ActionCreateInput> = z.strictObject({
  id: z.cuid().optional(),
  type: z.string(),
  title: z.string(),
  reason: z.string(),
  evidence: z.string(),
  priority: z.string(),
  confidence: z.number().int(),
  status: z.string().optional(),
  rejectReason: z.string().optional().nullable(),
  payload: z.union([ z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema ]),
  createdAt: z.coerce.date().optional(),
  upload: z.lazy(() => UploadCreateNestedOneWithoutActionsInputSchema),
});

export const ActionUncheckedCreateInputSchema: z.ZodType<Prisma.ActionUncheckedCreateInput> = z.strictObject({
  id: z.cuid().optional(),
  uploadId: z.string(),
  type: z.string(),
  title: z.string(),
  reason: z.string(),
  evidence: z.string(),
  priority: z.string(),
  confidence: z.number().int(),
  status: z.string().optional(),
  rejectReason: z.string().optional().nullable(),
  payload: z.union([ z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema ]),
  createdAt: z.coerce.date().optional(),
});

export const ActionUpdateInputSchema: z.ZodType<Prisma.ActionUpdateInput> = z.strictObject({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  reason: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  evidence: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  priority: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  confidence: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  rejectReason: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  payload: z.union([ z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  upload: z.lazy(() => UploadUpdateOneRequiredWithoutActionsNestedInputSchema).optional(),
});

export const ActionUncheckedUpdateInputSchema: z.ZodType<Prisma.ActionUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  uploadId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  reason: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  evidence: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  priority: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  confidence: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  rejectReason: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  payload: z.union([ z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const ActionCreateManyInputSchema: z.ZodType<Prisma.ActionCreateManyInput> = z.strictObject({
  id: z.cuid().optional(),
  uploadId: z.string(),
  type: z.string(),
  title: z.string(),
  reason: z.string(),
  evidence: z.string(),
  priority: z.string(),
  confidence: z.number().int(),
  status: z.string().optional(),
  rejectReason: z.string().optional().nullable(),
  payload: z.union([ z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema ]),
  createdAt: z.coerce.date().optional(),
});

export const ActionUpdateManyMutationInputSchema: z.ZodType<Prisma.ActionUpdateManyMutationInput> = z.strictObject({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  reason: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  evidence: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  priority: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  confidence: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  rejectReason: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  payload: z.union([ z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const ActionUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ActionUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  uploadId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  reason: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  evidence: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  priority: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  confidence: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  rejectReason: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  payload: z.union([ z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const LlmLogCreateInputSchema: z.ZodType<Prisma.LlmLogCreateInput> = z.strictObject({
  id: z.cuid().optional(),
  agentName: z.string(),
  prompt: z.string(),
  contextPayload: z.union([ z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema ]),
  rawOutput: z.string(),
  latencyMs: z.number().int(),
  createdAt: z.coerce.date().optional(),
  upload: z.lazy(() => UploadCreateNestedOneWithoutLlmLogsInputSchema),
});

export const LlmLogUncheckedCreateInputSchema: z.ZodType<Prisma.LlmLogUncheckedCreateInput> = z.strictObject({
  id: z.cuid().optional(),
  uploadId: z.string(),
  agentName: z.string(),
  prompt: z.string(),
  contextPayload: z.union([ z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema ]),
  rawOutput: z.string(),
  latencyMs: z.number().int(),
  createdAt: z.coerce.date().optional(),
});

export const LlmLogUpdateInputSchema: z.ZodType<Prisma.LlmLogUpdateInput> = z.strictObject({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  agentName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  prompt: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  contextPayload: z.union([ z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
  rawOutput: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  latencyMs: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  upload: z.lazy(() => UploadUpdateOneRequiredWithoutLlmLogsNestedInputSchema).optional(),
});

export const LlmLogUncheckedUpdateInputSchema: z.ZodType<Prisma.LlmLogUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  uploadId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  agentName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  prompt: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  contextPayload: z.union([ z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
  rawOutput: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  latencyMs: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const LlmLogCreateManyInputSchema: z.ZodType<Prisma.LlmLogCreateManyInput> = z.strictObject({
  id: z.cuid().optional(),
  uploadId: z.string(),
  agentName: z.string(),
  prompt: z.string(),
  contextPayload: z.union([ z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema ]),
  rawOutput: z.string(),
  latencyMs: z.number().int(),
  createdAt: z.coerce.date().optional(),
});

export const LlmLogUpdateManyMutationInputSchema: z.ZodType<Prisma.LlmLogUpdateManyMutationInput> = z.strictObject({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  agentName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  prompt: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  contextPayload: z.union([ z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
  rawOutput: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  latencyMs: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const LlmLogUncheckedUpdateManyInputSchema: z.ZodType<Prisma.LlmLogUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  uploadId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  agentName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  prompt: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  contextPayload: z.union([ z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
  rawOutput: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  latencyMs: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const StringFilterSchema: z.ZodType<Prisma.StringFilter> = z.strictObject({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
});

export const StringNullableFilterSchema: z.ZodType<Prisma.StringNullableFilter> = z.strictObject({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
});

export const DateTimeNullableFilterSchema: z.ZodType<Prisma.DateTimeNullableFilter> = z.strictObject({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableFilterSchema) ]).optional().nullable(),
});

export const IntNullableFilterSchema: z.ZodType<Prisma.IntNullableFilter> = z.strictObject({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableFilterSchema) ]).optional().nullable(),
});

export const DateTimeFilterSchema: z.ZodType<Prisma.DateTimeFilter> = z.strictObject({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
});

export const PageListRelationFilterSchema: z.ZodType<Prisma.PageListRelationFilter> = z.strictObject({
  every: z.lazy(() => PageWhereInputSchema).optional(),
  some: z.lazy(() => PageWhereInputSchema).optional(),
  none: z.lazy(() => PageWhereInputSchema).optional(),
});

export const KeywordListRelationFilterSchema: z.ZodType<Prisma.KeywordListRelationFilter> = z.strictObject({
  every: z.lazy(() => KeywordWhereInputSchema).optional(),
  some: z.lazy(() => KeywordWhereInputSchema).optional(),
  none: z.lazy(() => KeywordWhereInputSchema).optional(),
});

export const CompetitorListRelationFilterSchema: z.ZodType<Prisma.CompetitorListRelationFilter> = z.strictObject({
  every: z.lazy(() => CompetitorWhereInputSchema).optional(),
  some: z.lazy(() => CompetitorWhereInputSchema).optional(),
  none: z.lazy(() => CompetitorWhereInputSchema).optional(),
});

export const TechnicalIssueListRelationFilterSchema: z.ZodType<Prisma.TechnicalIssueListRelationFilter> = z.strictObject({
  every: z.lazy(() => TechnicalIssueWhereInputSchema).optional(),
  some: z.lazy(() => TechnicalIssueWhereInputSchema).optional(),
  none: z.lazy(() => TechnicalIssueWhereInputSchema).optional(),
});

export const ActionListRelationFilterSchema: z.ZodType<Prisma.ActionListRelationFilter> = z.strictObject({
  every: z.lazy(() => ActionWhereInputSchema).optional(),
  some: z.lazy(() => ActionWhereInputSchema).optional(),
  none: z.lazy(() => ActionWhereInputSchema).optional(),
});

export const LlmLogListRelationFilterSchema: z.ZodType<Prisma.LlmLogListRelationFilter> = z.strictObject({
  every: z.lazy(() => LlmLogWhereInputSchema).optional(),
  some: z.lazy(() => LlmLogWhereInputSchema).optional(),
  none: z.lazy(() => LlmLogWhereInputSchema).optional(),
});

export const SortOrderInputSchema: z.ZodType<Prisma.SortOrderInput> = z.strictObject({
  sort: z.lazy(() => SortOrderSchema),
  nulls: z.lazy(() => NullsOrderSchema).optional(),
});

export const PageOrderByRelationAggregateInputSchema: z.ZodType<Prisma.PageOrderByRelationAggregateInput> = z.strictObject({
  _count: z.lazy(() => SortOrderSchema).optional(),
});

export const KeywordOrderByRelationAggregateInputSchema: z.ZodType<Prisma.KeywordOrderByRelationAggregateInput> = z.strictObject({
  _count: z.lazy(() => SortOrderSchema).optional(),
});

export const CompetitorOrderByRelationAggregateInputSchema: z.ZodType<Prisma.CompetitorOrderByRelationAggregateInput> = z.strictObject({
  _count: z.lazy(() => SortOrderSchema).optional(),
});

export const TechnicalIssueOrderByRelationAggregateInputSchema: z.ZodType<Prisma.TechnicalIssueOrderByRelationAggregateInput> = z.strictObject({
  _count: z.lazy(() => SortOrderSchema).optional(),
});

export const ActionOrderByRelationAggregateInputSchema: z.ZodType<Prisma.ActionOrderByRelationAggregateInput> = z.strictObject({
  _count: z.lazy(() => SortOrderSchema).optional(),
});

export const LlmLogOrderByRelationAggregateInputSchema: z.ZodType<Prisma.LlmLogOrderByRelationAggregateInput> = z.strictObject({
  _count: z.lazy(() => SortOrderSchema).optional(),
});

export const UploadCountOrderByAggregateInputSchema: z.ZodType<Prisma.UploadCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  currency: z.lazy(() => SortOrderSchema).optional(),
  generatedAt: z.lazy(() => SortOrderSchema).optional(),
  windowDays: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
});

export const UploadAvgOrderByAggregateInputSchema: z.ZodType<Prisma.UploadAvgOrderByAggregateInput> = z.strictObject({
  windowDays: z.lazy(() => SortOrderSchema).optional(),
});

export const UploadMaxOrderByAggregateInputSchema: z.ZodType<Prisma.UploadMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  currency: z.lazy(() => SortOrderSchema).optional(),
  generatedAt: z.lazy(() => SortOrderSchema).optional(),
  windowDays: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
});

export const UploadMinOrderByAggregateInputSchema: z.ZodType<Prisma.UploadMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  currency: z.lazy(() => SortOrderSchema).optional(),
  generatedAt: z.lazy(() => SortOrderSchema).optional(),
  windowDays: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
});

export const UploadSumOrderByAggregateInputSchema: z.ZodType<Prisma.UploadSumOrderByAggregateInput> = z.strictObject({
  windowDays: z.lazy(() => SortOrderSchema).optional(),
});

export const StringWithAggregatesFilterSchema: z.ZodType<Prisma.StringWithAggregatesFilter> = z.strictObject({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional(),
});

export const StringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.StringNullableWithAggregatesFilter> = z.strictObject({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional(),
});

export const DateTimeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeNullableWithAggregatesFilter> = z.strictObject({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
});

export const IntNullableWithAggregatesFilterSchema: z.ZodType<Prisma.IntNullableWithAggregatesFilter> = z.strictObject({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedIntNullableFilterSchema).optional(),
});

export const DateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeWithAggregatesFilter> = z.strictObject({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional(),
});

export const FloatNullableFilterSchema: z.ZodType<Prisma.FloatNullableFilter> = z.strictObject({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableFilterSchema) ]).optional().nullable(),
});

export const UploadScalarRelationFilterSchema: z.ZodType<Prisma.UploadScalarRelationFilter> = z.strictObject({
  is: z.lazy(() => UploadWhereInputSchema).optional(),
  isNot: z.lazy(() => UploadWhereInputSchema).optional(),
});

export const PageCountOrderByAggregateInputSchema: z.ZodType<Prisma.PageCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  uploadId: z.lazy(() => SortOrderSchema).optional(),
  sourceId: z.lazy(() => SortOrderSchema).optional(),
  url: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  metaDescription: z.lazy(() => SortOrderSchema).optional(),
  targetKeyword: z.lazy(() => SortOrderSchema).optional(),
  intent: z.lazy(() => SortOrderSchema).optional(),
  audience: z.lazy(() => SortOrderSchema).optional(),
  wordCount: z.lazy(() => SortOrderSchema).optional(),
  publishedAt: z.lazy(() => SortOrderSchema).optional(),
  lastModified: z.lazy(() => SortOrderSchema).optional(),
  impressions: z.lazy(() => SortOrderSchema).optional(),
  clicks: z.lazy(() => SortOrderSchema).optional(),
  position: z.lazy(() => SortOrderSchema).optional(),
  ctr: z.lazy(() => SortOrderSchema).optional(),
  conversions: z.lazy(() => SortOrderSchema).optional(),
  conversionRate: z.lazy(() => SortOrderSchema).optional(),
});

export const PageAvgOrderByAggregateInputSchema: z.ZodType<Prisma.PageAvgOrderByAggregateInput> = z.strictObject({
  wordCount: z.lazy(() => SortOrderSchema).optional(),
  impressions: z.lazy(() => SortOrderSchema).optional(),
  clicks: z.lazy(() => SortOrderSchema).optional(),
  position: z.lazy(() => SortOrderSchema).optional(),
  ctr: z.lazy(() => SortOrderSchema).optional(),
  conversions: z.lazy(() => SortOrderSchema).optional(),
  conversionRate: z.lazy(() => SortOrderSchema).optional(),
});

export const PageMaxOrderByAggregateInputSchema: z.ZodType<Prisma.PageMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  uploadId: z.lazy(() => SortOrderSchema).optional(),
  sourceId: z.lazy(() => SortOrderSchema).optional(),
  url: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  metaDescription: z.lazy(() => SortOrderSchema).optional(),
  targetKeyword: z.lazy(() => SortOrderSchema).optional(),
  intent: z.lazy(() => SortOrderSchema).optional(),
  audience: z.lazy(() => SortOrderSchema).optional(),
  wordCount: z.lazy(() => SortOrderSchema).optional(),
  publishedAt: z.lazy(() => SortOrderSchema).optional(),
  lastModified: z.lazy(() => SortOrderSchema).optional(),
  impressions: z.lazy(() => SortOrderSchema).optional(),
  clicks: z.lazy(() => SortOrderSchema).optional(),
  position: z.lazy(() => SortOrderSchema).optional(),
  ctr: z.lazy(() => SortOrderSchema).optional(),
  conversions: z.lazy(() => SortOrderSchema).optional(),
  conversionRate: z.lazy(() => SortOrderSchema).optional(),
});

export const PageMinOrderByAggregateInputSchema: z.ZodType<Prisma.PageMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  uploadId: z.lazy(() => SortOrderSchema).optional(),
  sourceId: z.lazy(() => SortOrderSchema).optional(),
  url: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  metaDescription: z.lazy(() => SortOrderSchema).optional(),
  targetKeyword: z.lazy(() => SortOrderSchema).optional(),
  intent: z.lazy(() => SortOrderSchema).optional(),
  audience: z.lazy(() => SortOrderSchema).optional(),
  wordCount: z.lazy(() => SortOrderSchema).optional(),
  publishedAt: z.lazy(() => SortOrderSchema).optional(),
  lastModified: z.lazy(() => SortOrderSchema).optional(),
  impressions: z.lazy(() => SortOrderSchema).optional(),
  clicks: z.lazy(() => SortOrderSchema).optional(),
  position: z.lazy(() => SortOrderSchema).optional(),
  ctr: z.lazy(() => SortOrderSchema).optional(),
  conversions: z.lazy(() => SortOrderSchema).optional(),
  conversionRate: z.lazy(() => SortOrderSchema).optional(),
});

export const PageSumOrderByAggregateInputSchema: z.ZodType<Prisma.PageSumOrderByAggregateInput> = z.strictObject({
  wordCount: z.lazy(() => SortOrderSchema).optional(),
  impressions: z.lazy(() => SortOrderSchema).optional(),
  clicks: z.lazy(() => SortOrderSchema).optional(),
  position: z.lazy(() => SortOrderSchema).optional(),
  ctr: z.lazy(() => SortOrderSchema).optional(),
  conversions: z.lazy(() => SortOrderSchema).optional(),
  conversionRate: z.lazy(() => SortOrderSchema).optional(),
});

export const FloatNullableWithAggregatesFilterSchema: z.ZodType<Prisma.FloatNullableWithAggregatesFilter> = z.strictObject({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
});

export const PageNullableScalarRelationFilterSchema: z.ZodType<Prisma.PageNullableScalarRelationFilter> = z.strictObject({
  is: z.lazy(() => PageWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => PageWhereInputSchema).optional().nullable(),
});

export const KeywordCountOrderByAggregateInputSchema: z.ZodType<Prisma.KeywordCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  uploadId: z.lazy(() => SortOrderSchema).optional(),
  keyword: z.lazy(() => SortOrderSchema).optional(),
  monthlyVolume: z.lazy(() => SortOrderSchema).optional(),
  difficulty: z.lazy(() => SortOrderSchema).optional(),
  cpc: z.lazy(() => SortOrderSchema).optional(),
  intent: z.lazy(() => SortOrderSchema).optional(),
  audience: z.lazy(() => SortOrderSchema).optional(),
  topCompetitor: z.lazy(() => SortOrderSchema).optional(),
  currentlyRankingPageId: z.lazy(() => SortOrderSchema).optional(),
});

export const KeywordAvgOrderByAggregateInputSchema: z.ZodType<Prisma.KeywordAvgOrderByAggregateInput> = z.strictObject({
  monthlyVolume: z.lazy(() => SortOrderSchema).optional(),
  difficulty: z.lazy(() => SortOrderSchema).optional(),
  cpc: z.lazy(() => SortOrderSchema).optional(),
});

export const KeywordMaxOrderByAggregateInputSchema: z.ZodType<Prisma.KeywordMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  uploadId: z.lazy(() => SortOrderSchema).optional(),
  keyword: z.lazy(() => SortOrderSchema).optional(),
  monthlyVolume: z.lazy(() => SortOrderSchema).optional(),
  difficulty: z.lazy(() => SortOrderSchema).optional(),
  cpc: z.lazy(() => SortOrderSchema).optional(),
  intent: z.lazy(() => SortOrderSchema).optional(),
  audience: z.lazy(() => SortOrderSchema).optional(),
  topCompetitor: z.lazy(() => SortOrderSchema).optional(),
  currentlyRankingPageId: z.lazy(() => SortOrderSchema).optional(),
});

export const KeywordMinOrderByAggregateInputSchema: z.ZodType<Prisma.KeywordMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  uploadId: z.lazy(() => SortOrderSchema).optional(),
  keyword: z.lazy(() => SortOrderSchema).optional(),
  monthlyVolume: z.lazy(() => SortOrderSchema).optional(),
  difficulty: z.lazy(() => SortOrderSchema).optional(),
  cpc: z.lazy(() => SortOrderSchema).optional(),
  intent: z.lazy(() => SortOrderSchema).optional(),
  audience: z.lazy(() => SortOrderSchema).optional(),
  topCompetitor: z.lazy(() => SortOrderSchema).optional(),
  currentlyRankingPageId: z.lazy(() => SortOrderSchema).optional(),
});

export const KeywordSumOrderByAggregateInputSchema: z.ZodType<Prisma.KeywordSumOrderByAggregateInput> = z.strictObject({
  monthlyVolume: z.lazy(() => SortOrderSchema).optional(),
  difficulty: z.lazy(() => SortOrderSchema).optional(),
  cpc: z.lazy(() => SortOrderSchema).optional(),
});

export const StringNullableListFilterSchema: z.ZodType<Prisma.StringNullableListFilter> = z.strictObject({
  equals: z.string().array().optional().nullable(),
  has: z.string().optional().nullable(),
  hasEvery: z.string().array().optional(),
  hasSome: z.string().array().optional(),
  isEmpty: z.boolean().optional(),
});

export const CompetitorCountOrderByAggregateInputSchema: z.ZodType<Prisma.CompetitorCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  uploadId: z.lazy(() => SortOrderSchema).optional(),
  domain: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  positioning: z.lazy(() => SortOrderSchema).optional(),
  estimatedMonthlyTraffic: z.lazy(() => SortOrderSchema).optional(),
  audience: z.lazy(() => SortOrderSchema).optional(),
  topTopics: z.lazy(() => SortOrderSchema).optional(),
  topContentGaps: z.lazy(() => SortOrderSchema).optional(),
});

export const CompetitorAvgOrderByAggregateInputSchema: z.ZodType<Prisma.CompetitorAvgOrderByAggregateInput> = z.strictObject({
  estimatedMonthlyTraffic: z.lazy(() => SortOrderSchema).optional(),
});

export const CompetitorMaxOrderByAggregateInputSchema: z.ZodType<Prisma.CompetitorMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  uploadId: z.lazy(() => SortOrderSchema).optional(),
  domain: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  positioning: z.lazy(() => SortOrderSchema).optional(),
  estimatedMonthlyTraffic: z.lazy(() => SortOrderSchema).optional(),
  audience: z.lazy(() => SortOrderSchema).optional(),
});

export const CompetitorMinOrderByAggregateInputSchema: z.ZodType<Prisma.CompetitorMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  uploadId: z.lazy(() => SortOrderSchema).optional(),
  domain: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  positioning: z.lazy(() => SortOrderSchema).optional(),
  estimatedMonthlyTraffic: z.lazy(() => SortOrderSchema).optional(),
  audience: z.lazy(() => SortOrderSchema).optional(),
});

export const CompetitorSumOrderByAggregateInputSchema: z.ZodType<Prisma.CompetitorSumOrderByAggregateInput> = z.strictObject({
  estimatedMonthlyTraffic: z.lazy(() => SortOrderSchema).optional(),
});

export const PageScalarRelationFilterSchema: z.ZodType<Prisma.PageScalarRelationFilter> = z.strictObject({
  is: z.lazy(() => PageWhereInputSchema).optional(),
  isNot: z.lazy(() => PageWhereInputSchema).optional(),
});

export const TechnicalIssueCountOrderByAggregateInputSchema: z.ZodType<Prisma.TechnicalIssueCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  uploadId: z.lazy(() => SortOrderSchema).optional(),
  pageId: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  severity: z.lazy(() => SortOrderSchema).optional(),
  details: z.lazy(() => SortOrderSchema).optional(),
});

export const TechnicalIssueMaxOrderByAggregateInputSchema: z.ZodType<Prisma.TechnicalIssueMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  uploadId: z.lazy(() => SortOrderSchema).optional(),
  pageId: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  severity: z.lazy(() => SortOrderSchema).optional(),
  details: z.lazy(() => SortOrderSchema).optional(),
});

export const TechnicalIssueMinOrderByAggregateInputSchema: z.ZodType<Prisma.TechnicalIssueMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  uploadId: z.lazy(() => SortOrderSchema).optional(),
  pageId: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  severity: z.lazy(() => SortOrderSchema).optional(),
  details: z.lazy(() => SortOrderSchema).optional(),
});

export const IntFilterSchema: z.ZodType<Prisma.IntFilter> = z.strictObject({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
});

export const JsonFilterSchema: z.ZodType<Prisma.JsonFilter> = z.strictObject({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional(),
});

export const ActionCountOrderByAggregateInputSchema: z.ZodType<Prisma.ActionCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  uploadId: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  reason: z.lazy(() => SortOrderSchema).optional(),
  evidence: z.lazy(() => SortOrderSchema).optional(),
  priority: z.lazy(() => SortOrderSchema).optional(),
  confidence: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  rejectReason: z.lazy(() => SortOrderSchema).optional(),
  payload: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
});

export const ActionAvgOrderByAggregateInputSchema: z.ZodType<Prisma.ActionAvgOrderByAggregateInput> = z.strictObject({
  confidence: z.lazy(() => SortOrderSchema).optional(),
});

export const ActionMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ActionMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  uploadId: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  reason: z.lazy(() => SortOrderSchema).optional(),
  evidence: z.lazy(() => SortOrderSchema).optional(),
  priority: z.lazy(() => SortOrderSchema).optional(),
  confidence: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  rejectReason: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
});

export const ActionMinOrderByAggregateInputSchema: z.ZodType<Prisma.ActionMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  uploadId: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  reason: z.lazy(() => SortOrderSchema).optional(),
  evidence: z.lazy(() => SortOrderSchema).optional(),
  priority: z.lazy(() => SortOrderSchema).optional(),
  confidence: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  rejectReason: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
});

export const ActionSumOrderByAggregateInputSchema: z.ZodType<Prisma.ActionSumOrderByAggregateInput> = z.strictObject({
  confidence: z.lazy(() => SortOrderSchema).optional(),
});

export const IntWithAggregatesFilterSchema: z.ZodType<Prisma.IntWithAggregatesFilter> = z.strictObject({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional(),
});

export const JsonWithAggregatesFilterSchema: z.ZodType<Prisma.JsonWithAggregatesFilter> = z.strictObject({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedJsonFilterSchema).optional(),
  _max: z.lazy(() => NestedJsonFilterSchema).optional(),
});

export const LlmLogCountOrderByAggregateInputSchema: z.ZodType<Prisma.LlmLogCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  uploadId: z.lazy(() => SortOrderSchema).optional(),
  agentName: z.lazy(() => SortOrderSchema).optional(),
  prompt: z.lazy(() => SortOrderSchema).optional(),
  contextPayload: z.lazy(() => SortOrderSchema).optional(),
  rawOutput: z.lazy(() => SortOrderSchema).optional(),
  latencyMs: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
});

export const LlmLogAvgOrderByAggregateInputSchema: z.ZodType<Prisma.LlmLogAvgOrderByAggregateInput> = z.strictObject({
  latencyMs: z.lazy(() => SortOrderSchema).optional(),
});

export const LlmLogMaxOrderByAggregateInputSchema: z.ZodType<Prisma.LlmLogMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  uploadId: z.lazy(() => SortOrderSchema).optional(),
  agentName: z.lazy(() => SortOrderSchema).optional(),
  prompt: z.lazy(() => SortOrderSchema).optional(),
  rawOutput: z.lazy(() => SortOrderSchema).optional(),
  latencyMs: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
});

export const LlmLogMinOrderByAggregateInputSchema: z.ZodType<Prisma.LlmLogMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  uploadId: z.lazy(() => SortOrderSchema).optional(),
  agentName: z.lazy(() => SortOrderSchema).optional(),
  prompt: z.lazy(() => SortOrderSchema).optional(),
  rawOutput: z.lazy(() => SortOrderSchema).optional(),
  latencyMs: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
});

export const LlmLogSumOrderByAggregateInputSchema: z.ZodType<Prisma.LlmLogSumOrderByAggregateInput> = z.strictObject({
  latencyMs: z.lazy(() => SortOrderSchema).optional(),
});

export const PageCreateNestedManyWithoutUploadInputSchema: z.ZodType<Prisma.PageCreateNestedManyWithoutUploadInput> = z.strictObject({
  create: z.union([ z.lazy(() => PageCreateWithoutUploadInputSchema), z.lazy(() => PageCreateWithoutUploadInputSchema).array(), z.lazy(() => PageUncheckedCreateWithoutUploadInputSchema), z.lazy(() => PageUncheckedCreateWithoutUploadInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PageCreateOrConnectWithoutUploadInputSchema), z.lazy(() => PageCreateOrConnectWithoutUploadInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PageCreateManyUploadInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => PageWhereUniqueInputSchema), z.lazy(() => PageWhereUniqueInputSchema).array() ]).optional(),
});

export const KeywordCreateNestedManyWithoutUploadInputSchema: z.ZodType<Prisma.KeywordCreateNestedManyWithoutUploadInput> = z.strictObject({
  create: z.union([ z.lazy(() => KeywordCreateWithoutUploadInputSchema), z.lazy(() => KeywordCreateWithoutUploadInputSchema).array(), z.lazy(() => KeywordUncheckedCreateWithoutUploadInputSchema), z.lazy(() => KeywordUncheckedCreateWithoutUploadInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => KeywordCreateOrConnectWithoutUploadInputSchema), z.lazy(() => KeywordCreateOrConnectWithoutUploadInputSchema).array() ]).optional(),
  createMany: z.lazy(() => KeywordCreateManyUploadInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => KeywordWhereUniqueInputSchema), z.lazy(() => KeywordWhereUniqueInputSchema).array() ]).optional(),
});

export const CompetitorCreateNestedManyWithoutUploadInputSchema: z.ZodType<Prisma.CompetitorCreateNestedManyWithoutUploadInput> = z.strictObject({
  create: z.union([ z.lazy(() => CompetitorCreateWithoutUploadInputSchema), z.lazy(() => CompetitorCreateWithoutUploadInputSchema).array(), z.lazy(() => CompetitorUncheckedCreateWithoutUploadInputSchema), z.lazy(() => CompetitorUncheckedCreateWithoutUploadInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CompetitorCreateOrConnectWithoutUploadInputSchema), z.lazy(() => CompetitorCreateOrConnectWithoutUploadInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CompetitorCreateManyUploadInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => CompetitorWhereUniqueInputSchema), z.lazy(() => CompetitorWhereUniqueInputSchema).array() ]).optional(),
});

export const TechnicalIssueCreateNestedManyWithoutUploadInputSchema: z.ZodType<Prisma.TechnicalIssueCreateNestedManyWithoutUploadInput> = z.strictObject({
  create: z.union([ z.lazy(() => TechnicalIssueCreateWithoutUploadInputSchema), z.lazy(() => TechnicalIssueCreateWithoutUploadInputSchema).array(), z.lazy(() => TechnicalIssueUncheckedCreateWithoutUploadInputSchema), z.lazy(() => TechnicalIssueUncheckedCreateWithoutUploadInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TechnicalIssueCreateOrConnectWithoutUploadInputSchema), z.lazy(() => TechnicalIssueCreateOrConnectWithoutUploadInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TechnicalIssueCreateManyUploadInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => TechnicalIssueWhereUniqueInputSchema), z.lazy(() => TechnicalIssueWhereUniqueInputSchema).array() ]).optional(),
});

export const ActionCreateNestedManyWithoutUploadInputSchema: z.ZodType<Prisma.ActionCreateNestedManyWithoutUploadInput> = z.strictObject({
  create: z.union([ z.lazy(() => ActionCreateWithoutUploadInputSchema), z.lazy(() => ActionCreateWithoutUploadInputSchema).array(), z.lazy(() => ActionUncheckedCreateWithoutUploadInputSchema), z.lazy(() => ActionUncheckedCreateWithoutUploadInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ActionCreateOrConnectWithoutUploadInputSchema), z.lazy(() => ActionCreateOrConnectWithoutUploadInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ActionCreateManyUploadInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ActionWhereUniqueInputSchema), z.lazy(() => ActionWhereUniqueInputSchema).array() ]).optional(),
});

export const LlmLogCreateNestedManyWithoutUploadInputSchema: z.ZodType<Prisma.LlmLogCreateNestedManyWithoutUploadInput> = z.strictObject({
  create: z.union([ z.lazy(() => LlmLogCreateWithoutUploadInputSchema), z.lazy(() => LlmLogCreateWithoutUploadInputSchema).array(), z.lazy(() => LlmLogUncheckedCreateWithoutUploadInputSchema), z.lazy(() => LlmLogUncheckedCreateWithoutUploadInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => LlmLogCreateOrConnectWithoutUploadInputSchema), z.lazy(() => LlmLogCreateOrConnectWithoutUploadInputSchema).array() ]).optional(),
  createMany: z.lazy(() => LlmLogCreateManyUploadInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => LlmLogWhereUniqueInputSchema), z.lazy(() => LlmLogWhereUniqueInputSchema).array() ]).optional(),
});

export const PageUncheckedCreateNestedManyWithoutUploadInputSchema: z.ZodType<Prisma.PageUncheckedCreateNestedManyWithoutUploadInput> = z.strictObject({
  create: z.union([ z.lazy(() => PageCreateWithoutUploadInputSchema), z.lazy(() => PageCreateWithoutUploadInputSchema).array(), z.lazy(() => PageUncheckedCreateWithoutUploadInputSchema), z.lazy(() => PageUncheckedCreateWithoutUploadInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PageCreateOrConnectWithoutUploadInputSchema), z.lazy(() => PageCreateOrConnectWithoutUploadInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PageCreateManyUploadInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => PageWhereUniqueInputSchema), z.lazy(() => PageWhereUniqueInputSchema).array() ]).optional(),
});

export const KeywordUncheckedCreateNestedManyWithoutUploadInputSchema: z.ZodType<Prisma.KeywordUncheckedCreateNestedManyWithoutUploadInput> = z.strictObject({
  create: z.union([ z.lazy(() => KeywordCreateWithoutUploadInputSchema), z.lazy(() => KeywordCreateWithoutUploadInputSchema).array(), z.lazy(() => KeywordUncheckedCreateWithoutUploadInputSchema), z.lazy(() => KeywordUncheckedCreateWithoutUploadInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => KeywordCreateOrConnectWithoutUploadInputSchema), z.lazy(() => KeywordCreateOrConnectWithoutUploadInputSchema).array() ]).optional(),
  createMany: z.lazy(() => KeywordCreateManyUploadInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => KeywordWhereUniqueInputSchema), z.lazy(() => KeywordWhereUniqueInputSchema).array() ]).optional(),
});

export const CompetitorUncheckedCreateNestedManyWithoutUploadInputSchema: z.ZodType<Prisma.CompetitorUncheckedCreateNestedManyWithoutUploadInput> = z.strictObject({
  create: z.union([ z.lazy(() => CompetitorCreateWithoutUploadInputSchema), z.lazy(() => CompetitorCreateWithoutUploadInputSchema).array(), z.lazy(() => CompetitorUncheckedCreateWithoutUploadInputSchema), z.lazy(() => CompetitorUncheckedCreateWithoutUploadInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CompetitorCreateOrConnectWithoutUploadInputSchema), z.lazy(() => CompetitorCreateOrConnectWithoutUploadInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CompetitorCreateManyUploadInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => CompetitorWhereUniqueInputSchema), z.lazy(() => CompetitorWhereUniqueInputSchema).array() ]).optional(),
});

export const TechnicalIssueUncheckedCreateNestedManyWithoutUploadInputSchema: z.ZodType<Prisma.TechnicalIssueUncheckedCreateNestedManyWithoutUploadInput> = z.strictObject({
  create: z.union([ z.lazy(() => TechnicalIssueCreateWithoutUploadInputSchema), z.lazy(() => TechnicalIssueCreateWithoutUploadInputSchema).array(), z.lazy(() => TechnicalIssueUncheckedCreateWithoutUploadInputSchema), z.lazy(() => TechnicalIssueUncheckedCreateWithoutUploadInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TechnicalIssueCreateOrConnectWithoutUploadInputSchema), z.lazy(() => TechnicalIssueCreateOrConnectWithoutUploadInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TechnicalIssueCreateManyUploadInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => TechnicalIssueWhereUniqueInputSchema), z.lazy(() => TechnicalIssueWhereUniqueInputSchema).array() ]).optional(),
});

export const ActionUncheckedCreateNestedManyWithoutUploadInputSchema: z.ZodType<Prisma.ActionUncheckedCreateNestedManyWithoutUploadInput> = z.strictObject({
  create: z.union([ z.lazy(() => ActionCreateWithoutUploadInputSchema), z.lazy(() => ActionCreateWithoutUploadInputSchema).array(), z.lazy(() => ActionUncheckedCreateWithoutUploadInputSchema), z.lazy(() => ActionUncheckedCreateWithoutUploadInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ActionCreateOrConnectWithoutUploadInputSchema), z.lazy(() => ActionCreateOrConnectWithoutUploadInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ActionCreateManyUploadInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ActionWhereUniqueInputSchema), z.lazy(() => ActionWhereUniqueInputSchema).array() ]).optional(),
});

export const LlmLogUncheckedCreateNestedManyWithoutUploadInputSchema: z.ZodType<Prisma.LlmLogUncheckedCreateNestedManyWithoutUploadInput> = z.strictObject({
  create: z.union([ z.lazy(() => LlmLogCreateWithoutUploadInputSchema), z.lazy(() => LlmLogCreateWithoutUploadInputSchema).array(), z.lazy(() => LlmLogUncheckedCreateWithoutUploadInputSchema), z.lazy(() => LlmLogUncheckedCreateWithoutUploadInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => LlmLogCreateOrConnectWithoutUploadInputSchema), z.lazy(() => LlmLogCreateOrConnectWithoutUploadInputSchema).array() ]).optional(),
  createMany: z.lazy(() => LlmLogCreateManyUploadInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => LlmLogWhereUniqueInputSchema), z.lazy(() => LlmLogWhereUniqueInputSchema).array() ]).optional(),
});

export const StringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.StringFieldUpdateOperationsInput> = z.strictObject({
  set: z.string().optional(),
});

export const NullableStringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableStringFieldUpdateOperationsInput> = z.strictObject({
  set: z.string().optional().nullable(),
});

export const NullableDateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableDateTimeFieldUpdateOperationsInput> = z.strictObject({
  set: z.coerce.date().optional().nullable(),
});

export const NullableIntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableIntFieldUpdateOperationsInput> = z.strictObject({
  set: z.number().optional().nullable(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional(),
});

export const DateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput> = z.strictObject({
  set: z.coerce.date().optional(),
});

export const PageUpdateManyWithoutUploadNestedInputSchema: z.ZodType<Prisma.PageUpdateManyWithoutUploadNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => PageCreateWithoutUploadInputSchema), z.lazy(() => PageCreateWithoutUploadInputSchema).array(), z.lazy(() => PageUncheckedCreateWithoutUploadInputSchema), z.lazy(() => PageUncheckedCreateWithoutUploadInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PageCreateOrConnectWithoutUploadInputSchema), z.lazy(() => PageCreateOrConnectWithoutUploadInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => PageUpsertWithWhereUniqueWithoutUploadInputSchema), z.lazy(() => PageUpsertWithWhereUniqueWithoutUploadInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PageCreateManyUploadInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => PageWhereUniqueInputSchema), z.lazy(() => PageWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => PageWhereUniqueInputSchema), z.lazy(() => PageWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => PageWhereUniqueInputSchema), z.lazy(() => PageWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => PageWhereUniqueInputSchema), z.lazy(() => PageWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => PageUpdateWithWhereUniqueWithoutUploadInputSchema), z.lazy(() => PageUpdateWithWhereUniqueWithoutUploadInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => PageUpdateManyWithWhereWithoutUploadInputSchema), z.lazy(() => PageUpdateManyWithWhereWithoutUploadInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => PageScalarWhereInputSchema), z.lazy(() => PageScalarWhereInputSchema).array() ]).optional(),
});

export const KeywordUpdateManyWithoutUploadNestedInputSchema: z.ZodType<Prisma.KeywordUpdateManyWithoutUploadNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => KeywordCreateWithoutUploadInputSchema), z.lazy(() => KeywordCreateWithoutUploadInputSchema).array(), z.lazy(() => KeywordUncheckedCreateWithoutUploadInputSchema), z.lazy(() => KeywordUncheckedCreateWithoutUploadInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => KeywordCreateOrConnectWithoutUploadInputSchema), z.lazy(() => KeywordCreateOrConnectWithoutUploadInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => KeywordUpsertWithWhereUniqueWithoutUploadInputSchema), z.lazy(() => KeywordUpsertWithWhereUniqueWithoutUploadInputSchema).array() ]).optional(),
  createMany: z.lazy(() => KeywordCreateManyUploadInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => KeywordWhereUniqueInputSchema), z.lazy(() => KeywordWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => KeywordWhereUniqueInputSchema), z.lazy(() => KeywordWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => KeywordWhereUniqueInputSchema), z.lazy(() => KeywordWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => KeywordWhereUniqueInputSchema), z.lazy(() => KeywordWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => KeywordUpdateWithWhereUniqueWithoutUploadInputSchema), z.lazy(() => KeywordUpdateWithWhereUniqueWithoutUploadInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => KeywordUpdateManyWithWhereWithoutUploadInputSchema), z.lazy(() => KeywordUpdateManyWithWhereWithoutUploadInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => KeywordScalarWhereInputSchema), z.lazy(() => KeywordScalarWhereInputSchema).array() ]).optional(),
});

export const CompetitorUpdateManyWithoutUploadNestedInputSchema: z.ZodType<Prisma.CompetitorUpdateManyWithoutUploadNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => CompetitorCreateWithoutUploadInputSchema), z.lazy(() => CompetitorCreateWithoutUploadInputSchema).array(), z.lazy(() => CompetitorUncheckedCreateWithoutUploadInputSchema), z.lazy(() => CompetitorUncheckedCreateWithoutUploadInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CompetitorCreateOrConnectWithoutUploadInputSchema), z.lazy(() => CompetitorCreateOrConnectWithoutUploadInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => CompetitorUpsertWithWhereUniqueWithoutUploadInputSchema), z.lazy(() => CompetitorUpsertWithWhereUniqueWithoutUploadInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CompetitorCreateManyUploadInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => CompetitorWhereUniqueInputSchema), z.lazy(() => CompetitorWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => CompetitorWhereUniqueInputSchema), z.lazy(() => CompetitorWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => CompetitorWhereUniqueInputSchema), z.lazy(() => CompetitorWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => CompetitorWhereUniqueInputSchema), z.lazy(() => CompetitorWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => CompetitorUpdateWithWhereUniqueWithoutUploadInputSchema), z.lazy(() => CompetitorUpdateWithWhereUniqueWithoutUploadInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => CompetitorUpdateManyWithWhereWithoutUploadInputSchema), z.lazy(() => CompetitorUpdateManyWithWhereWithoutUploadInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => CompetitorScalarWhereInputSchema), z.lazy(() => CompetitorScalarWhereInputSchema).array() ]).optional(),
});

export const TechnicalIssueUpdateManyWithoutUploadNestedInputSchema: z.ZodType<Prisma.TechnicalIssueUpdateManyWithoutUploadNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => TechnicalIssueCreateWithoutUploadInputSchema), z.lazy(() => TechnicalIssueCreateWithoutUploadInputSchema).array(), z.lazy(() => TechnicalIssueUncheckedCreateWithoutUploadInputSchema), z.lazy(() => TechnicalIssueUncheckedCreateWithoutUploadInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TechnicalIssueCreateOrConnectWithoutUploadInputSchema), z.lazy(() => TechnicalIssueCreateOrConnectWithoutUploadInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => TechnicalIssueUpsertWithWhereUniqueWithoutUploadInputSchema), z.lazy(() => TechnicalIssueUpsertWithWhereUniqueWithoutUploadInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TechnicalIssueCreateManyUploadInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => TechnicalIssueWhereUniqueInputSchema), z.lazy(() => TechnicalIssueWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => TechnicalIssueWhereUniqueInputSchema), z.lazy(() => TechnicalIssueWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => TechnicalIssueWhereUniqueInputSchema), z.lazy(() => TechnicalIssueWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TechnicalIssueWhereUniqueInputSchema), z.lazy(() => TechnicalIssueWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => TechnicalIssueUpdateWithWhereUniqueWithoutUploadInputSchema), z.lazy(() => TechnicalIssueUpdateWithWhereUniqueWithoutUploadInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => TechnicalIssueUpdateManyWithWhereWithoutUploadInputSchema), z.lazy(() => TechnicalIssueUpdateManyWithWhereWithoutUploadInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => TechnicalIssueScalarWhereInputSchema), z.lazy(() => TechnicalIssueScalarWhereInputSchema).array() ]).optional(),
});

export const ActionUpdateManyWithoutUploadNestedInputSchema: z.ZodType<Prisma.ActionUpdateManyWithoutUploadNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => ActionCreateWithoutUploadInputSchema), z.lazy(() => ActionCreateWithoutUploadInputSchema).array(), z.lazy(() => ActionUncheckedCreateWithoutUploadInputSchema), z.lazy(() => ActionUncheckedCreateWithoutUploadInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ActionCreateOrConnectWithoutUploadInputSchema), z.lazy(() => ActionCreateOrConnectWithoutUploadInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ActionUpsertWithWhereUniqueWithoutUploadInputSchema), z.lazy(() => ActionUpsertWithWhereUniqueWithoutUploadInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ActionCreateManyUploadInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ActionWhereUniqueInputSchema), z.lazy(() => ActionWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ActionWhereUniqueInputSchema), z.lazy(() => ActionWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ActionWhereUniqueInputSchema), z.lazy(() => ActionWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ActionWhereUniqueInputSchema), z.lazy(() => ActionWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ActionUpdateWithWhereUniqueWithoutUploadInputSchema), z.lazy(() => ActionUpdateWithWhereUniqueWithoutUploadInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ActionUpdateManyWithWhereWithoutUploadInputSchema), z.lazy(() => ActionUpdateManyWithWhereWithoutUploadInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ActionScalarWhereInputSchema), z.lazy(() => ActionScalarWhereInputSchema).array() ]).optional(),
});

export const LlmLogUpdateManyWithoutUploadNestedInputSchema: z.ZodType<Prisma.LlmLogUpdateManyWithoutUploadNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => LlmLogCreateWithoutUploadInputSchema), z.lazy(() => LlmLogCreateWithoutUploadInputSchema).array(), z.lazy(() => LlmLogUncheckedCreateWithoutUploadInputSchema), z.lazy(() => LlmLogUncheckedCreateWithoutUploadInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => LlmLogCreateOrConnectWithoutUploadInputSchema), z.lazy(() => LlmLogCreateOrConnectWithoutUploadInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => LlmLogUpsertWithWhereUniqueWithoutUploadInputSchema), z.lazy(() => LlmLogUpsertWithWhereUniqueWithoutUploadInputSchema).array() ]).optional(),
  createMany: z.lazy(() => LlmLogCreateManyUploadInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => LlmLogWhereUniqueInputSchema), z.lazy(() => LlmLogWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => LlmLogWhereUniqueInputSchema), z.lazy(() => LlmLogWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => LlmLogWhereUniqueInputSchema), z.lazy(() => LlmLogWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => LlmLogWhereUniqueInputSchema), z.lazy(() => LlmLogWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => LlmLogUpdateWithWhereUniqueWithoutUploadInputSchema), z.lazy(() => LlmLogUpdateWithWhereUniqueWithoutUploadInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => LlmLogUpdateManyWithWhereWithoutUploadInputSchema), z.lazy(() => LlmLogUpdateManyWithWhereWithoutUploadInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => LlmLogScalarWhereInputSchema), z.lazy(() => LlmLogScalarWhereInputSchema).array() ]).optional(),
});

export const PageUncheckedUpdateManyWithoutUploadNestedInputSchema: z.ZodType<Prisma.PageUncheckedUpdateManyWithoutUploadNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => PageCreateWithoutUploadInputSchema), z.lazy(() => PageCreateWithoutUploadInputSchema).array(), z.lazy(() => PageUncheckedCreateWithoutUploadInputSchema), z.lazy(() => PageUncheckedCreateWithoutUploadInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PageCreateOrConnectWithoutUploadInputSchema), z.lazy(() => PageCreateOrConnectWithoutUploadInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => PageUpsertWithWhereUniqueWithoutUploadInputSchema), z.lazy(() => PageUpsertWithWhereUniqueWithoutUploadInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PageCreateManyUploadInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => PageWhereUniqueInputSchema), z.lazy(() => PageWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => PageWhereUniqueInputSchema), z.lazy(() => PageWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => PageWhereUniqueInputSchema), z.lazy(() => PageWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => PageWhereUniqueInputSchema), z.lazy(() => PageWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => PageUpdateWithWhereUniqueWithoutUploadInputSchema), z.lazy(() => PageUpdateWithWhereUniqueWithoutUploadInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => PageUpdateManyWithWhereWithoutUploadInputSchema), z.lazy(() => PageUpdateManyWithWhereWithoutUploadInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => PageScalarWhereInputSchema), z.lazy(() => PageScalarWhereInputSchema).array() ]).optional(),
});

export const KeywordUncheckedUpdateManyWithoutUploadNestedInputSchema: z.ZodType<Prisma.KeywordUncheckedUpdateManyWithoutUploadNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => KeywordCreateWithoutUploadInputSchema), z.lazy(() => KeywordCreateWithoutUploadInputSchema).array(), z.lazy(() => KeywordUncheckedCreateWithoutUploadInputSchema), z.lazy(() => KeywordUncheckedCreateWithoutUploadInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => KeywordCreateOrConnectWithoutUploadInputSchema), z.lazy(() => KeywordCreateOrConnectWithoutUploadInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => KeywordUpsertWithWhereUniqueWithoutUploadInputSchema), z.lazy(() => KeywordUpsertWithWhereUniqueWithoutUploadInputSchema).array() ]).optional(),
  createMany: z.lazy(() => KeywordCreateManyUploadInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => KeywordWhereUniqueInputSchema), z.lazy(() => KeywordWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => KeywordWhereUniqueInputSchema), z.lazy(() => KeywordWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => KeywordWhereUniqueInputSchema), z.lazy(() => KeywordWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => KeywordWhereUniqueInputSchema), z.lazy(() => KeywordWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => KeywordUpdateWithWhereUniqueWithoutUploadInputSchema), z.lazy(() => KeywordUpdateWithWhereUniqueWithoutUploadInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => KeywordUpdateManyWithWhereWithoutUploadInputSchema), z.lazy(() => KeywordUpdateManyWithWhereWithoutUploadInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => KeywordScalarWhereInputSchema), z.lazy(() => KeywordScalarWhereInputSchema).array() ]).optional(),
});

export const CompetitorUncheckedUpdateManyWithoutUploadNestedInputSchema: z.ZodType<Prisma.CompetitorUncheckedUpdateManyWithoutUploadNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => CompetitorCreateWithoutUploadInputSchema), z.lazy(() => CompetitorCreateWithoutUploadInputSchema).array(), z.lazy(() => CompetitorUncheckedCreateWithoutUploadInputSchema), z.lazy(() => CompetitorUncheckedCreateWithoutUploadInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CompetitorCreateOrConnectWithoutUploadInputSchema), z.lazy(() => CompetitorCreateOrConnectWithoutUploadInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => CompetitorUpsertWithWhereUniqueWithoutUploadInputSchema), z.lazy(() => CompetitorUpsertWithWhereUniqueWithoutUploadInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CompetitorCreateManyUploadInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => CompetitorWhereUniqueInputSchema), z.lazy(() => CompetitorWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => CompetitorWhereUniqueInputSchema), z.lazy(() => CompetitorWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => CompetitorWhereUniqueInputSchema), z.lazy(() => CompetitorWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => CompetitorWhereUniqueInputSchema), z.lazy(() => CompetitorWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => CompetitorUpdateWithWhereUniqueWithoutUploadInputSchema), z.lazy(() => CompetitorUpdateWithWhereUniqueWithoutUploadInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => CompetitorUpdateManyWithWhereWithoutUploadInputSchema), z.lazy(() => CompetitorUpdateManyWithWhereWithoutUploadInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => CompetitorScalarWhereInputSchema), z.lazy(() => CompetitorScalarWhereInputSchema).array() ]).optional(),
});

export const TechnicalIssueUncheckedUpdateManyWithoutUploadNestedInputSchema: z.ZodType<Prisma.TechnicalIssueUncheckedUpdateManyWithoutUploadNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => TechnicalIssueCreateWithoutUploadInputSchema), z.lazy(() => TechnicalIssueCreateWithoutUploadInputSchema).array(), z.lazy(() => TechnicalIssueUncheckedCreateWithoutUploadInputSchema), z.lazy(() => TechnicalIssueUncheckedCreateWithoutUploadInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TechnicalIssueCreateOrConnectWithoutUploadInputSchema), z.lazy(() => TechnicalIssueCreateOrConnectWithoutUploadInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => TechnicalIssueUpsertWithWhereUniqueWithoutUploadInputSchema), z.lazy(() => TechnicalIssueUpsertWithWhereUniqueWithoutUploadInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TechnicalIssueCreateManyUploadInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => TechnicalIssueWhereUniqueInputSchema), z.lazy(() => TechnicalIssueWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => TechnicalIssueWhereUniqueInputSchema), z.lazy(() => TechnicalIssueWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => TechnicalIssueWhereUniqueInputSchema), z.lazy(() => TechnicalIssueWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TechnicalIssueWhereUniqueInputSchema), z.lazy(() => TechnicalIssueWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => TechnicalIssueUpdateWithWhereUniqueWithoutUploadInputSchema), z.lazy(() => TechnicalIssueUpdateWithWhereUniqueWithoutUploadInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => TechnicalIssueUpdateManyWithWhereWithoutUploadInputSchema), z.lazy(() => TechnicalIssueUpdateManyWithWhereWithoutUploadInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => TechnicalIssueScalarWhereInputSchema), z.lazy(() => TechnicalIssueScalarWhereInputSchema).array() ]).optional(),
});

export const ActionUncheckedUpdateManyWithoutUploadNestedInputSchema: z.ZodType<Prisma.ActionUncheckedUpdateManyWithoutUploadNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => ActionCreateWithoutUploadInputSchema), z.lazy(() => ActionCreateWithoutUploadInputSchema).array(), z.lazy(() => ActionUncheckedCreateWithoutUploadInputSchema), z.lazy(() => ActionUncheckedCreateWithoutUploadInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ActionCreateOrConnectWithoutUploadInputSchema), z.lazy(() => ActionCreateOrConnectWithoutUploadInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ActionUpsertWithWhereUniqueWithoutUploadInputSchema), z.lazy(() => ActionUpsertWithWhereUniqueWithoutUploadInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ActionCreateManyUploadInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ActionWhereUniqueInputSchema), z.lazy(() => ActionWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ActionWhereUniqueInputSchema), z.lazy(() => ActionWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ActionWhereUniqueInputSchema), z.lazy(() => ActionWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ActionWhereUniqueInputSchema), z.lazy(() => ActionWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ActionUpdateWithWhereUniqueWithoutUploadInputSchema), z.lazy(() => ActionUpdateWithWhereUniqueWithoutUploadInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ActionUpdateManyWithWhereWithoutUploadInputSchema), z.lazy(() => ActionUpdateManyWithWhereWithoutUploadInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ActionScalarWhereInputSchema), z.lazy(() => ActionScalarWhereInputSchema).array() ]).optional(),
});

export const LlmLogUncheckedUpdateManyWithoutUploadNestedInputSchema: z.ZodType<Prisma.LlmLogUncheckedUpdateManyWithoutUploadNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => LlmLogCreateWithoutUploadInputSchema), z.lazy(() => LlmLogCreateWithoutUploadInputSchema).array(), z.lazy(() => LlmLogUncheckedCreateWithoutUploadInputSchema), z.lazy(() => LlmLogUncheckedCreateWithoutUploadInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => LlmLogCreateOrConnectWithoutUploadInputSchema), z.lazy(() => LlmLogCreateOrConnectWithoutUploadInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => LlmLogUpsertWithWhereUniqueWithoutUploadInputSchema), z.lazy(() => LlmLogUpsertWithWhereUniqueWithoutUploadInputSchema).array() ]).optional(),
  createMany: z.lazy(() => LlmLogCreateManyUploadInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => LlmLogWhereUniqueInputSchema), z.lazy(() => LlmLogWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => LlmLogWhereUniqueInputSchema), z.lazy(() => LlmLogWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => LlmLogWhereUniqueInputSchema), z.lazy(() => LlmLogWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => LlmLogWhereUniqueInputSchema), z.lazy(() => LlmLogWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => LlmLogUpdateWithWhereUniqueWithoutUploadInputSchema), z.lazy(() => LlmLogUpdateWithWhereUniqueWithoutUploadInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => LlmLogUpdateManyWithWhereWithoutUploadInputSchema), z.lazy(() => LlmLogUpdateManyWithWhereWithoutUploadInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => LlmLogScalarWhereInputSchema), z.lazy(() => LlmLogScalarWhereInputSchema).array() ]).optional(),
});

export const UploadCreateNestedOneWithoutPagesInputSchema: z.ZodType<Prisma.UploadCreateNestedOneWithoutPagesInput> = z.strictObject({
  create: z.union([ z.lazy(() => UploadCreateWithoutPagesInputSchema), z.lazy(() => UploadUncheckedCreateWithoutPagesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UploadCreateOrConnectWithoutPagesInputSchema).optional(),
  connect: z.lazy(() => UploadWhereUniqueInputSchema).optional(),
});

export const TechnicalIssueCreateNestedManyWithoutPageInputSchema: z.ZodType<Prisma.TechnicalIssueCreateNestedManyWithoutPageInput> = z.strictObject({
  create: z.union([ z.lazy(() => TechnicalIssueCreateWithoutPageInputSchema), z.lazy(() => TechnicalIssueCreateWithoutPageInputSchema).array(), z.lazy(() => TechnicalIssueUncheckedCreateWithoutPageInputSchema), z.lazy(() => TechnicalIssueUncheckedCreateWithoutPageInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TechnicalIssueCreateOrConnectWithoutPageInputSchema), z.lazy(() => TechnicalIssueCreateOrConnectWithoutPageInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TechnicalIssueCreateManyPageInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => TechnicalIssueWhereUniqueInputSchema), z.lazy(() => TechnicalIssueWhereUniqueInputSchema).array() ]).optional(),
});

export const KeywordCreateNestedManyWithoutPageInputSchema: z.ZodType<Prisma.KeywordCreateNestedManyWithoutPageInput> = z.strictObject({
  create: z.union([ z.lazy(() => KeywordCreateWithoutPageInputSchema), z.lazy(() => KeywordCreateWithoutPageInputSchema).array(), z.lazy(() => KeywordUncheckedCreateWithoutPageInputSchema), z.lazy(() => KeywordUncheckedCreateWithoutPageInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => KeywordCreateOrConnectWithoutPageInputSchema), z.lazy(() => KeywordCreateOrConnectWithoutPageInputSchema).array() ]).optional(),
  createMany: z.lazy(() => KeywordCreateManyPageInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => KeywordWhereUniqueInputSchema), z.lazy(() => KeywordWhereUniqueInputSchema).array() ]).optional(),
});

export const TechnicalIssueUncheckedCreateNestedManyWithoutPageInputSchema: z.ZodType<Prisma.TechnicalIssueUncheckedCreateNestedManyWithoutPageInput> = z.strictObject({
  create: z.union([ z.lazy(() => TechnicalIssueCreateWithoutPageInputSchema), z.lazy(() => TechnicalIssueCreateWithoutPageInputSchema).array(), z.lazy(() => TechnicalIssueUncheckedCreateWithoutPageInputSchema), z.lazy(() => TechnicalIssueUncheckedCreateWithoutPageInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TechnicalIssueCreateOrConnectWithoutPageInputSchema), z.lazy(() => TechnicalIssueCreateOrConnectWithoutPageInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TechnicalIssueCreateManyPageInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => TechnicalIssueWhereUniqueInputSchema), z.lazy(() => TechnicalIssueWhereUniqueInputSchema).array() ]).optional(),
});

export const KeywordUncheckedCreateNestedManyWithoutPageInputSchema: z.ZodType<Prisma.KeywordUncheckedCreateNestedManyWithoutPageInput> = z.strictObject({
  create: z.union([ z.lazy(() => KeywordCreateWithoutPageInputSchema), z.lazy(() => KeywordCreateWithoutPageInputSchema).array(), z.lazy(() => KeywordUncheckedCreateWithoutPageInputSchema), z.lazy(() => KeywordUncheckedCreateWithoutPageInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => KeywordCreateOrConnectWithoutPageInputSchema), z.lazy(() => KeywordCreateOrConnectWithoutPageInputSchema).array() ]).optional(),
  createMany: z.lazy(() => KeywordCreateManyPageInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => KeywordWhereUniqueInputSchema), z.lazy(() => KeywordWhereUniqueInputSchema).array() ]).optional(),
});

export const NullableFloatFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableFloatFieldUpdateOperationsInput> = z.strictObject({
  set: z.number().optional().nullable(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional(),
});

export const UploadUpdateOneRequiredWithoutPagesNestedInputSchema: z.ZodType<Prisma.UploadUpdateOneRequiredWithoutPagesNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => UploadCreateWithoutPagesInputSchema), z.lazy(() => UploadUncheckedCreateWithoutPagesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UploadCreateOrConnectWithoutPagesInputSchema).optional(),
  upsert: z.lazy(() => UploadUpsertWithoutPagesInputSchema).optional(),
  connect: z.lazy(() => UploadWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UploadUpdateToOneWithWhereWithoutPagesInputSchema), z.lazy(() => UploadUpdateWithoutPagesInputSchema), z.lazy(() => UploadUncheckedUpdateWithoutPagesInputSchema) ]).optional(),
});

export const TechnicalIssueUpdateManyWithoutPageNestedInputSchema: z.ZodType<Prisma.TechnicalIssueUpdateManyWithoutPageNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => TechnicalIssueCreateWithoutPageInputSchema), z.lazy(() => TechnicalIssueCreateWithoutPageInputSchema).array(), z.lazy(() => TechnicalIssueUncheckedCreateWithoutPageInputSchema), z.lazy(() => TechnicalIssueUncheckedCreateWithoutPageInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TechnicalIssueCreateOrConnectWithoutPageInputSchema), z.lazy(() => TechnicalIssueCreateOrConnectWithoutPageInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => TechnicalIssueUpsertWithWhereUniqueWithoutPageInputSchema), z.lazy(() => TechnicalIssueUpsertWithWhereUniqueWithoutPageInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TechnicalIssueCreateManyPageInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => TechnicalIssueWhereUniqueInputSchema), z.lazy(() => TechnicalIssueWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => TechnicalIssueWhereUniqueInputSchema), z.lazy(() => TechnicalIssueWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => TechnicalIssueWhereUniqueInputSchema), z.lazy(() => TechnicalIssueWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TechnicalIssueWhereUniqueInputSchema), z.lazy(() => TechnicalIssueWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => TechnicalIssueUpdateWithWhereUniqueWithoutPageInputSchema), z.lazy(() => TechnicalIssueUpdateWithWhereUniqueWithoutPageInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => TechnicalIssueUpdateManyWithWhereWithoutPageInputSchema), z.lazy(() => TechnicalIssueUpdateManyWithWhereWithoutPageInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => TechnicalIssueScalarWhereInputSchema), z.lazy(() => TechnicalIssueScalarWhereInputSchema).array() ]).optional(),
});

export const KeywordUpdateManyWithoutPageNestedInputSchema: z.ZodType<Prisma.KeywordUpdateManyWithoutPageNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => KeywordCreateWithoutPageInputSchema), z.lazy(() => KeywordCreateWithoutPageInputSchema).array(), z.lazy(() => KeywordUncheckedCreateWithoutPageInputSchema), z.lazy(() => KeywordUncheckedCreateWithoutPageInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => KeywordCreateOrConnectWithoutPageInputSchema), z.lazy(() => KeywordCreateOrConnectWithoutPageInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => KeywordUpsertWithWhereUniqueWithoutPageInputSchema), z.lazy(() => KeywordUpsertWithWhereUniqueWithoutPageInputSchema).array() ]).optional(),
  createMany: z.lazy(() => KeywordCreateManyPageInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => KeywordWhereUniqueInputSchema), z.lazy(() => KeywordWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => KeywordWhereUniqueInputSchema), z.lazy(() => KeywordWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => KeywordWhereUniqueInputSchema), z.lazy(() => KeywordWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => KeywordWhereUniqueInputSchema), z.lazy(() => KeywordWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => KeywordUpdateWithWhereUniqueWithoutPageInputSchema), z.lazy(() => KeywordUpdateWithWhereUniqueWithoutPageInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => KeywordUpdateManyWithWhereWithoutPageInputSchema), z.lazy(() => KeywordUpdateManyWithWhereWithoutPageInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => KeywordScalarWhereInputSchema), z.lazy(() => KeywordScalarWhereInputSchema).array() ]).optional(),
});

export const TechnicalIssueUncheckedUpdateManyWithoutPageNestedInputSchema: z.ZodType<Prisma.TechnicalIssueUncheckedUpdateManyWithoutPageNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => TechnicalIssueCreateWithoutPageInputSchema), z.lazy(() => TechnicalIssueCreateWithoutPageInputSchema).array(), z.lazy(() => TechnicalIssueUncheckedCreateWithoutPageInputSchema), z.lazy(() => TechnicalIssueUncheckedCreateWithoutPageInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TechnicalIssueCreateOrConnectWithoutPageInputSchema), z.lazy(() => TechnicalIssueCreateOrConnectWithoutPageInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => TechnicalIssueUpsertWithWhereUniqueWithoutPageInputSchema), z.lazy(() => TechnicalIssueUpsertWithWhereUniqueWithoutPageInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TechnicalIssueCreateManyPageInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => TechnicalIssueWhereUniqueInputSchema), z.lazy(() => TechnicalIssueWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => TechnicalIssueWhereUniqueInputSchema), z.lazy(() => TechnicalIssueWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => TechnicalIssueWhereUniqueInputSchema), z.lazy(() => TechnicalIssueWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TechnicalIssueWhereUniqueInputSchema), z.lazy(() => TechnicalIssueWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => TechnicalIssueUpdateWithWhereUniqueWithoutPageInputSchema), z.lazy(() => TechnicalIssueUpdateWithWhereUniqueWithoutPageInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => TechnicalIssueUpdateManyWithWhereWithoutPageInputSchema), z.lazy(() => TechnicalIssueUpdateManyWithWhereWithoutPageInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => TechnicalIssueScalarWhereInputSchema), z.lazy(() => TechnicalIssueScalarWhereInputSchema).array() ]).optional(),
});

export const KeywordUncheckedUpdateManyWithoutPageNestedInputSchema: z.ZodType<Prisma.KeywordUncheckedUpdateManyWithoutPageNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => KeywordCreateWithoutPageInputSchema), z.lazy(() => KeywordCreateWithoutPageInputSchema).array(), z.lazy(() => KeywordUncheckedCreateWithoutPageInputSchema), z.lazy(() => KeywordUncheckedCreateWithoutPageInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => KeywordCreateOrConnectWithoutPageInputSchema), z.lazy(() => KeywordCreateOrConnectWithoutPageInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => KeywordUpsertWithWhereUniqueWithoutPageInputSchema), z.lazy(() => KeywordUpsertWithWhereUniqueWithoutPageInputSchema).array() ]).optional(),
  createMany: z.lazy(() => KeywordCreateManyPageInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => KeywordWhereUniqueInputSchema), z.lazy(() => KeywordWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => KeywordWhereUniqueInputSchema), z.lazy(() => KeywordWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => KeywordWhereUniqueInputSchema), z.lazy(() => KeywordWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => KeywordWhereUniqueInputSchema), z.lazy(() => KeywordWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => KeywordUpdateWithWhereUniqueWithoutPageInputSchema), z.lazy(() => KeywordUpdateWithWhereUniqueWithoutPageInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => KeywordUpdateManyWithWhereWithoutPageInputSchema), z.lazy(() => KeywordUpdateManyWithWhereWithoutPageInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => KeywordScalarWhereInputSchema), z.lazy(() => KeywordScalarWhereInputSchema).array() ]).optional(),
});

export const UploadCreateNestedOneWithoutKeywordsInputSchema: z.ZodType<Prisma.UploadCreateNestedOneWithoutKeywordsInput> = z.strictObject({
  create: z.union([ z.lazy(() => UploadCreateWithoutKeywordsInputSchema), z.lazy(() => UploadUncheckedCreateWithoutKeywordsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UploadCreateOrConnectWithoutKeywordsInputSchema).optional(),
  connect: z.lazy(() => UploadWhereUniqueInputSchema).optional(),
});

export const PageCreateNestedOneWithoutKeywordsInputSchema: z.ZodType<Prisma.PageCreateNestedOneWithoutKeywordsInput> = z.strictObject({
  create: z.union([ z.lazy(() => PageCreateWithoutKeywordsInputSchema), z.lazy(() => PageUncheckedCreateWithoutKeywordsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PageCreateOrConnectWithoutKeywordsInputSchema).optional(),
  connect: z.lazy(() => PageWhereUniqueInputSchema).optional(),
});

export const UploadUpdateOneRequiredWithoutKeywordsNestedInputSchema: z.ZodType<Prisma.UploadUpdateOneRequiredWithoutKeywordsNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => UploadCreateWithoutKeywordsInputSchema), z.lazy(() => UploadUncheckedCreateWithoutKeywordsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UploadCreateOrConnectWithoutKeywordsInputSchema).optional(),
  upsert: z.lazy(() => UploadUpsertWithoutKeywordsInputSchema).optional(),
  connect: z.lazy(() => UploadWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UploadUpdateToOneWithWhereWithoutKeywordsInputSchema), z.lazy(() => UploadUpdateWithoutKeywordsInputSchema), z.lazy(() => UploadUncheckedUpdateWithoutKeywordsInputSchema) ]).optional(),
});

export const PageUpdateOneWithoutKeywordsNestedInputSchema: z.ZodType<Prisma.PageUpdateOneWithoutKeywordsNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => PageCreateWithoutKeywordsInputSchema), z.lazy(() => PageUncheckedCreateWithoutKeywordsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PageCreateOrConnectWithoutKeywordsInputSchema).optional(),
  upsert: z.lazy(() => PageUpsertWithoutKeywordsInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => PageWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => PageWhereInputSchema) ]).optional(),
  connect: z.lazy(() => PageWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => PageUpdateToOneWithWhereWithoutKeywordsInputSchema), z.lazy(() => PageUpdateWithoutKeywordsInputSchema), z.lazy(() => PageUncheckedUpdateWithoutKeywordsInputSchema) ]).optional(),
});

export const CompetitorCreatetopTopicsInputSchema: z.ZodType<Prisma.CompetitorCreatetopTopicsInput> = z.strictObject({
  set: z.string().array(),
});

export const CompetitorCreatetopContentGapsInputSchema: z.ZodType<Prisma.CompetitorCreatetopContentGapsInput> = z.strictObject({
  set: z.string().array(),
});

export const UploadCreateNestedOneWithoutCompetitorsInputSchema: z.ZodType<Prisma.UploadCreateNestedOneWithoutCompetitorsInput> = z.strictObject({
  create: z.union([ z.lazy(() => UploadCreateWithoutCompetitorsInputSchema), z.lazy(() => UploadUncheckedCreateWithoutCompetitorsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UploadCreateOrConnectWithoutCompetitorsInputSchema).optional(),
  connect: z.lazy(() => UploadWhereUniqueInputSchema).optional(),
});

export const CompetitorUpdatetopTopicsInputSchema: z.ZodType<Prisma.CompetitorUpdatetopTopicsInput> = z.strictObject({
  set: z.string().array().optional(),
  push: z.union([ z.string(),z.string().array() ]).optional(),
});

export const CompetitorUpdatetopContentGapsInputSchema: z.ZodType<Prisma.CompetitorUpdatetopContentGapsInput> = z.strictObject({
  set: z.string().array().optional(),
  push: z.union([ z.string(),z.string().array() ]).optional(),
});

export const UploadUpdateOneRequiredWithoutCompetitorsNestedInputSchema: z.ZodType<Prisma.UploadUpdateOneRequiredWithoutCompetitorsNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => UploadCreateWithoutCompetitorsInputSchema), z.lazy(() => UploadUncheckedCreateWithoutCompetitorsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UploadCreateOrConnectWithoutCompetitorsInputSchema).optional(),
  upsert: z.lazy(() => UploadUpsertWithoutCompetitorsInputSchema).optional(),
  connect: z.lazy(() => UploadWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UploadUpdateToOneWithWhereWithoutCompetitorsInputSchema), z.lazy(() => UploadUpdateWithoutCompetitorsInputSchema), z.lazy(() => UploadUncheckedUpdateWithoutCompetitorsInputSchema) ]).optional(),
});

export const UploadCreateNestedOneWithoutTechnicalIssuesInputSchema: z.ZodType<Prisma.UploadCreateNestedOneWithoutTechnicalIssuesInput> = z.strictObject({
  create: z.union([ z.lazy(() => UploadCreateWithoutTechnicalIssuesInputSchema), z.lazy(() => UploadUncheckedCreateWithoutTechnicalIssuesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UploadCreateOrConnectWithoutTechnicalIssuesInputSchema).optional(),
  connect: z.lazy(() => UploadWhereUniqueInputSchema).optional(),
});

export const PageCreateNestedOneWithoutTechnicalIssuesInputSchema: z.ZodType<Prisma.PageCreateNestedOneWithoutTechnicalIssuesInput> = z.strictObject({
  create: z.union([ z.lazy(() => PageCreateWithoutTechnicalIssuesInputSchema), z.lazy(() => PageUncheckedCreateWithoutTechnicalIssuesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PageCreateOrConnectWithoutTechnicalIssuesInputSchema).optional(),
  connect: z.lazy(() => PageWhereUniqueInputSchema).optional(),
});

export const UploadUpdateOneRequiredWithoutTechnicalIssuesNestedInputSchema: z.ZodType<Prisma.UploadUpdateOneRequiredWithoutTechnicalIssuesNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => UploadCreateWithoutTechnicalIssuesInputSchema), z.lazy(() => UploadUncheckedCreateWithoutTechnicalIssuesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UploadCreateOrConnectWithoutTechnicalIssuesInputSchema).optional(),
  upsert: z.lazy(() => UploadUpsertWithoutTechnicalIssuesInputSchema).optional(),
  connect: z.lazy(() => UploadWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UploadUpdateToOneWithWhereWithoutTechnicalIssuesInputSchema), z.lazy(() => UploadUpdateWithoutTechnicalIssuesInputSchema), z.lazy(() => UploadUncheckedUpdateWithoutTechnicalIssuesInputSchema) ]).optional(),
});

export const PageUpdateOneRequiredWithoutTechnicalIssuesNestedInputSchema: z.ZodType<Prisma.PageUpdateOneRequiredWithoutTechnicalIssuesNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => PageCreateWithoutTechnicalIssuesInputSchema), z.lazy(() => PageUncheckedCreateWithoutTechnicalIssuesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PageCreateOrConnectWithoutTechnicalIssuesInputSchema).optional(),
  upsert: z.lazy(() => PageUpsertWithoutTechnicalIssuesInputSchema).optional(),
  connect: z.lazy(() => PageWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => PageUpdateToOneWithWhereWithoutTechnicalIssuesInputSchema), z.lazy(() => PageUpdateWithoutTechnicalIssuesInputSchema), z.lazy(() => PageUncheckedUpdateWithoutTechnicalIssuesInputSchema) ]).optional(),
});

export const UploadCreateNestedOneWithoutActionsInputSchema: z.ZodType<Prisma.UploadCreateNestedOneWithoutActionsInput> = z.strictObject({
  create: z.union([ z.lazy(() => UploadCreateWithoutActionsInputSchema), z.lazy(() => UploadUncheckedCreateWithoutActionsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UploadCreateOrConnectWithoutActionsInputSchema).optional(),
  connect: z.lazy(() => UploadWhereUniqueInputSchema).optional(),
});

export const IntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.IntFieldUpdateOperationsInput> = z.strictObject({
  set: z.number().optional(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional(),
});

export const UploadUpdateOneRequiredWithoutActionsNestedInputSchema: z.ZodType<Prisma.UploadUpdateOneRequiredWithoutActionsNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => UploadCreateWithoutActionsInputSchema), z.lazy(() => UploadUncheckedCreateWithoutActionsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UploadCreateOrConnectWithoutActionsInputSchema).optional(),
  upsert: z.lazy(() => UploadUpsertWithoutActionsInputSchema).optional(),
  connect: z.lazy(() => UploadWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UploadUpdateToOneWithWhereWithoutActionsInputSchema), z.lazy(() => UploadUpdateWithoutActionsInputSchema), z.lazy(() => UploadUncheckedUpdateWithoutActionsInputSchema) ]).optional(),
});

export const UploadCreateNestedOneWithoutLlmLogsInputSchema: z.ZodType<Prisma.UploadCreateNestedOneWithoutLlmLogsInput> = z.strictObject({
  create: z.union([ z.lazy(() => UploadCreateWithoutLlmLogsInputSchema), z.lazy(() => UploadUncheckedCreateWithoutLlmLogsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UploadCreateOrConnectWithoutLlmLogsInputSchema).optional(),
  connect: z.lazy(() => UploadWhereUniqueInputSchema).optional(),
});

export const UploadUpdateOneRequiredWithoutLlmLogsNestedInputSchema: z.ZodType<Prisma.UploadUpdateOneRequiredWithoutLlmLogsNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => UploadCreateWithoutLlmLogsInputSchema), z.lazy(() => UploadUncheckedCreateWithoutLlmLogsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UploadCreateOrConnectWithoutLlmLogsInputSchema).optional(),
  upsert: z.lazy(() => UploadUpsertWithoutLlmLogsInputSchema).optional(),
  connect: z.lazy(() => UploadWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UploadUpdateToOneWithWhereWithoutLlmLogsInputSchema), z.lazy(() => UploadUpdateWithoutLlmLogsInputSchema), z.lazy(() => UploadUncheckedUpdateWithoutLlmLogsInputSchema) ]).optional(),
});

export const NestedStringFilterSchema: z.ZodType<Prisma.NestedStringFilter> = z.strictObject({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
});

export const NestedStringNullableFilterSchema: z.ZodType<Prisma.NestedStringNullableFilter> = z.strictObject({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
});

export const NestedDateTimeNullableFilterSchema: z.ZodType<Prisma.NestedDateTimeNullableFilter> = z.strictObject({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableFilterSchema) ]).optional().nullable(),
});

export const NestedIntNullableFilterSchema: z.ZodType<Prisma.NestedIntNullableFilter> = z.strictObject({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableFilterSchema) ]).optional().nullable(),
});

export const NestedDateTimeFilterSchema: z.ZodType<Prisma.NestedDateTimeFilter> = z.strictObject({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
});

export const NestedStringWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringWithAggregatesFilter> = z.strictObject({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional(),
});

export const NestedIntFilterSchema: z.ZodType<Prisma.NestedIntFilter> = z.strictObject({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
});

export const NestedStringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringNullableWithAggregatesFilter> = z.strictObject({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional(),
});

export const NestedDateTimeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeNullableWithAggregatesFilter> = z.strictObject({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
});

export const NestedIntNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedIntNullableWithAggregatesFilter> = z.strictObject({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedIntNullableFilterSchema).optional(),
});

export const NestedFloatNullableFilterSchema: z.ZodType<Prisma.NestedFloatNullableFilter> = z.strictObject({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableFilterSchema) ]).optional().nullable(),
});

export const NestedDateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeWithAggregatesFilter> = z.strictObject({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional(),
});

export const NestedFloatNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedFloatNullableWithAggregatesFilter> = z.strictObject({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
});

export const NestedIntWithAggregatesFilterSchema: z.ZodType<Prisma.NestedIntWithAggregatesFilter> = z.strictObject({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional(),
});

export const NestedFloatFilterSchema: z.ZodType<Prisma.NestedFloatFilter> = z.strictObject({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatFilterSchema) ]).optional(),
});

export const NestedJsonFilterSchema: z.ZodType<Prisma.NestedJsonFilter> = z.strictObject({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional(),
});

export const PageCreateWithoutUploadInputSchema: z.ZodType<Prisma.PageCreateWithoutUploadInput> = z.strictObject({
  id: z.cuid().optional(),
  sourceId: z.string(),
  url: z.string(),
  title: z.string(),
  metaDescription: z.string().optional().nullable(),
  targetKeyword: z.string().optional().nullable(),
  intent: z.string().optional().nullable(),
  audience: z.string().optional().nullable(),
  wordCount: z.number().int().optional().nullable(),
  publishedAt: z.coerce.date().optional().nullable(),
  lastModified: z.coerce.date().optional().nullable(),
  impressions: z.number().int().optional().nullable(),
  clicks: z.number().int().optional().nullable(),
  position: z.number().optional().nullable(),
  ctr: z.number().optional().nullable(),
  conversions: z.number().int().optional().nullable(),
  conversionRate: z.number().optional().nullable(),
  technicalIssues: z.lazy(() => TechnicalIssueCreateNestedManyWithoutPageInputSchema).optional(),
  keywords: z.lazy(() => KeywordCreateNestedManyWithoutPageInputSchema).optional(),
});

export const PageUncheckedCreateWithoutUploadInputSchema: z.ZodType<Prisma.PageUncheckedCreateWithoutUploadInput> = z.strictObject({
  id: z.cuid().optional(),
  sourceId: z.string(),
  url: z.string(),
  title: z.string(),
  metaDescription: z.string().optional().nullable(),
  targetKeyword: z.string().optional().nullable(),
  intent: z.string().optional().nullable(),
  audience: z.string().optional().nullable(),
  wordCount: z.number().int().optional().nullable(),
  publishedAt: z.coerce.date().optional().nullable(),
  lastModified: z.coerce.date().optional().nullable(),
  impressions: z.number().int().optional().nullable(),
  clicks: z.number().int().optional().nullable(),
  position: z.number().optional().nullable(),
  ctr: z.number().optional().nullable(),
  conversions: z.number().int().optional().nullable(),
  conversionRate: z.number().optional().nullable(),
  technicalIssues: z.lazy(() => TechnicalIssueUncheckedCreateNestedManyWithoutPageInputSchema).optional(),
  keywords: z.lazy(() => KeywordUncheckedCreateNestedManyWithoutPageInputSchema).optional(),
});

export const PageCreateOrConnectWithoutUploadInputSchema: z.ZodType<Prisma.PageCreateOrConnectWithoutUploadInput> = z.strictObject({
  where: z.lazy(() => PageWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => PageCreateWithoutUploadInputSchema), z.lazy(() => PageUncheckedCreateWithoutUploadInputSchema) ]),
});

export const PageCreateManyUploadInputEnvelopeSchema: z.ZodType<Prisma.PageCreateManyUploadInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => PageCreateManyUploadInputSchema), z.lazy(() => PageCreateManyUploadInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
});

export const KeywordCreateWithoutUploadInputSchema: z.ZodType<Prisma.KeywordCreateWithoutUploadInput> = z.strictObject({
  id: z.cuid().optional(),
  keyword: z.string(),
  monthlyVolume: z.number().int().optional().nullable(),
  difficulty: z.number().int().optional().nullable(),
  cpc: z.number().optional().nullable(),
  intent: z.string().optional().nullable(),
  audience: z.string().optional().nullable(),
  topCompetitor: z.string().optional().nullable(),
  page: z.lazy(() => PageCreateNestedOneWithoutKeywordsInputSchema).optional(),
});

export const KeywordUncheckedCreateWithoutUploadInputSchema: z.ZodType<Prisma.KeywordUncheckedCreateWithoutUploadInput> = z.strictObject({
  id: z.cuid().optional(),
  keyword: z.string(),
  monthlyVolume: z.number().int().optional().nullable(),
  difficulty: z.number().int().optional().nullable(),
  cpc: z.number().optional().nullable(),
  intent: z.string().optional().nullable(),
  audience: z.string().optional().nullable(),
  topCompetitor: z.string().optional().nullable(),
  currentlyRankingPageId: z.string().optional().nullable(),
});

export const KeywordCreateOrConnectWithoutUploadInputSchema: z.ZodType<Prisma.KeywordCreateOrConnectWithoutUploadInput> = z.strictObject({
  where: z.lazy(() => KeywordWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => KeywordCreateWithoutUploadInputSchema), z.lazy(() => KeywordUncheckedCreateWithoutUploadInputSchema) ]),
});

export const KeywordCreateManyUploadInputEnvelopeSchema: z.ZodType<Prisma.KeywordCreateManyUploadInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => KeywordCreateManyUploadInputSchema), z.lazy(() => KeywordCreateManyUploadInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
});

export const CompetitorCreateWithoutUploadInputSchema: z.ZodType<Prisma.CompetitorCreateWithoutUploadInput> = z.strictObject({
  id: z.cuid().optional(),
  domain: z.string(),
  name: z.string().optional().nullable(),
  positioning: z.string().optional().nullable(),
  estimatedMonthlyTraffic: z.number().int().optional().nullable(),
  audience: z.string().optional().nullable(),
  topTopics: z.union([ z.lazy(() => CompetitorCreatetopTopicsInputSchema), z.string().array() ]).optional(),
  topContentGaps: z.union([ z.lazy(() => CompetitorCreatetopContentGapsInputSchema), z.string().array() ]).optional(),
});

export const CompetitorUncheckedCreateWithoutUploadInputSchema: z.ZodType<Prisma.CompetitorUncheckedCreateWithoutUploadInput> = z.strictObject({
  id: z.cuid().optional(),
  domain: z.string(),
  name: z.string().optional().nullable(),
  positioning: z.string().optional().nullable(),
  estimatedMonthlyTraffic: z.number().int().optional().nullable(),
  audience: z.string().optional().nullable(),
  topTopics: z.union([ z.lazy(() => CompetitorCreatetopTopicsInputSchema), z.string().array() ]).optional(),
  topContentGaps: z.union([ z.lazy(() => CompetitorCreatetopContentGapsInputSchema), z.string().array() ]).optional(),
});

export const CompetitorCreateOrConnectWithoutUploadInputSchema: z.ZodType<Prisma.CompetitorCreateOrConnectWithoutUploadInput> = z.strictObject({
  where: z.lazy(() => CompetitorWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CompetitorCreateWithoutUploadInputSchema), z.lazy(() => CompetitorUncheckedCreateWithoutUploadInputSchema) ]),
});

export const CompetitorCreateManyUploadInputEnvelopeSchema: z.ZodType<Prisma.CompetitorCreateManyUploadInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => CompetitorCreateManyUploadInputSchema), z.lazy(() => CompetitorCreateManyUploadInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
});

export const TechnicalIssueCreateWithoutUploadInputSchema: z.ZodType<Prisma.TechnicalIssueCreateWithoutUploadInput> = z.strictObject({
  id: z.cuid().optional(),
  type: z.string(),
  severity: z.string(),
  details: z.string(),
  page: z.lazy(() => PageCreateNestedOneWithoutTechnicalIssuesInputSchema),
});

export const TechnicalIssueUncheckedCreateWithoutUploadInputSchema: z.ZodType<Prisma.TechnicalIssueUncheckedCreateWithoutUploadInput> = z.strictObject({
  id: z.cuid().optional(),
  pageId: z.string(),
  type: z.string(),
  severity: z.string(),
  details: z.string(),
});

export const TechnicalIssueCreateOrConnectWithoutUploadInputSchema: z.ZodType<Prisma.TechnicalIssueCreateOrConnectWithoutUploadInput> = z.strictObject({
  where: z.lazy(() => TechnicalIssueWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => TechnicalIssueCreateWithoutUploadInputSchema), z.lazy(() => TechnicalIssueUncheckedCreateWithoutUploadInputSchema) ]),
});

export const TechnicalIssueCreateManyUploadInputEnvelopeSchema: z.ZodType<Prisma.TechnicalIssueCreateManyUploadInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => TechnicalIssueCreateManyUploadInputSchema), z.lazy(() => TechnicalIssueCreateManyUploadInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
});

export const ActionCreateWithoutUploadInputSchema: z.ZodType<Prisma.ActionCreateWithoutUploadInput> = z.strictObject({
  id: z.cuid().optional(),
  type: z.string(),
  title: z.string(),
  reason: z.string(),
  evidence: z.string(),
  priority: z.string(),
  confidence: z.number().int(),
  status: z.string().optional(),
  rejectReason: z.string().optional().nullable(),
  payload: z.union([ z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema ]),
  createdAt: z.coerce.date().optional(),
});

export const ActionUncheckedCreateWithoutUploadInputSchema: z.ZodType<Prisma.ActionUncheckedCreateWithoutUploadInput> = z.strictObject({
  id: z.cuid().optional(),
  type: z.string(),
  title: z.string(),
  reason: z.string(),
  evidence: z.string(),
  priority: z.string(),
  confidence: z.number().int(),
  status: z.string().optional(),
  rejectReason: z.string().optional().nullable(),
  payload: z.union([ z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema ]),
  createdAt: z.coerce.date().optional(),
});

export const ActionCreateOrConnectWithoutUploadInputSchema: z.ZodType<Prisma.ActionCreateOrConnectWithoutUploadInput> = z.strictObject({
  where: z.lazy(() => ActionWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ActionCreateWithoutUploadInputSchema), z.lazy(() => ActionUncheckedCreateWithoutUploadInputSchema) ]),
});

export const ActionCreateManyUploadInputEnvelopeSchema: z.ZodType<Prisma.ActionCreateManyUploadInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => ActionCreateManyUploadInputSchema), z.lazy(() => ActionCreateManyUploadInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
});

export const LlmLogCreateWithoutUploadInputSchema: z.ZodType<Prisma.LlmLogCreateWithoutUploadInput> = z.strictObject({
  id: z.cuid().optional(),
  agentName: z.string(),
  prompt: z.string(),
  contextPayload: z.union([ z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema ]),
  rawOutput: z.string(),
  latencyMs: z.number().int(),
  createdAt: z.coerce.date().optional(),
});

export const LlmLogUncheckedCreateWithoutUploadInputSchema: z.ZodType<Prisma.LlmLogUncheckedCreateWithoutUploadInput> = z.strictObject({
  id: z.cuid().optional(),
  agentName: z.string(),
  prompt: z.string(),
  contextPayload: z.union([ z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema ]),
  rawOutput: z.string(),
  latencyMs: z.number().int(),
  createdAt: z.coerce.date().optional(),
});

export const LlmLogCreateOrConnectWithoutUploadInputSchema: z.ZodType<Prisma.LlmLogCreateOrConnectWithoutUploadInput> = z.strictObject({
  where: z.lazy(() => LlmLogWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => LlmLogCreateWithoutUploadInputSchema), z.lazy(() => LlmLogUncheckedCreateWithoutUploadInputSchema) ]),
});

export const LlmLogCreateManyUploadInputEnvelopeSchema: z.ZodType<Prisma.LlmLogCreateManyUploadInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => LlmLogCreateManyUploadInputSchema), z.lazy(() => LlmLogCreateManyUploadInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
});

export const PageUpsertWithWhereUniqueWithoutUploadInputSchema: z.ZodType<Prisma.PageUpsertWithWhereUniqueWithoutUploadInput> = z.strictObject({
  where: z.lazy(() => PageWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => PageUpdateWithoutUploadInputSchema), z.lazy(() => PageUncheckedUpdateWithoutUploadInputSchema) ]),
  create: z.union([ z.lazy(() => PageCreateWithoutUploadInputSchema), z.lazy(() => PageUncheckedCreateWithoutUploadInputSchema) ]),
});

export const PageUpdateWithWhereUniqueWithoutUploadInputSchema: z.ZodType<Prisma.PageUpdateWithWhereUniqueWithoutUploadInput> = z.strictObject({
  where: z.lazy(() => PageWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => PageUpdateWithoutUploadInputSchema), z.lazy(() => PageUncheckedUpdateWithoutUploadInputSchema) ]),
});

export const PageUpdateManyWithWhereWithoutUploadInputSchema: z.ZodType<Prisma.PageUpdateManyWithWhereWithoutUploadInput> = z.strictObject({
  where: z.lazy(() => PageScalarWhereInputSchema),
  data: z.union([ z.lazy(() => PageUpdateManyMutationInputSchema), z.lazy(() => PageUncheckedUpdateManyWithoutUploadInputSchema) ]),
});

export const PageScalarWhereInputSchema: z.ZodType<Prisma.PageScalarWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => PageScalarWhereInputSchema), z.lazy(() => PageScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PageScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PageScalarWhereInputSchema), z.lazy(() => PageScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  uploadId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  sourceId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  url: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  metaDescription: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  targetKeyword: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  intent: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  audience: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  wordCount: z.union([ z.lazy(() => IntNullableFilterSchema), z.number() ]).optional().nullable(),
  publishedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date() ]).optional().nullable(),
  lastModified: z.union([ z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date() ]).optional().nullable(),
  impressions: z.union([ z.lazy(() => IntNullableFilterSchema), z.number() ]).optional().nullable(),
  clicks: z.union([ z.lazy(() => IntNullableFilterSchema), z.number() ]).optional().nullable(),
  position: z.union([ z.lazy(() => FloatNullableFilterSchema), z.number() ]).optional().nullable(),
  ctr: z.union([ z.lazy(() => FloatNullableFilterSchema), z.number() ]).optional().nullable(),
  conversions: z.union([ z.lazy(() => IntNullableFilterSchema), z.number() ]).optional().nullable(),
  conversionRate: z.union([ z.lazy(() => FloatNullableFilterSchema), z.number() ]).optional().nullable(),
});

export const KeywordUpsertWithWhereUniqueWithoutUploadInputSchema: z.ZodType<Prisma.KeywordUpsertWithWhereUniqueWithoutUploadInput> = z.strictObject({
  where: z.lazy(() => KeywordWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => KeywordUpdateWithoutUploadInputSchema), z.lazy(() => KeywordUncheckedUpdateWithoutUploadInputSchema) ]),
  create: z.union([ z.lazy(() => KeywordCreateWithoutUploadInputSchema), z.lazy(() => KeywordUncheckedCreateWithoutUploadInputSchema) ]),
});

export const KeywordUpdateWithWhereUniqueWithoutUploadInputSchema: z.ZodType<Prisma.KeywordUpdateWithWhereUniqueWithoutUploadInput> = z.strictObject({
  where: z.lazy(() => KeywordWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => KeywordUpdateWithoutUploadInputSchema), z.lazy(() => KeywordUncheckedUpdateWithoutUploadInputSchema) ]),
});

export const KeywordUpdateManyWithWhereWithoutUploadInputSchema: z.ZodType<Prisma.KeywordUpdateManyWithWhereWithoutUploadInput> = z.strictObject({
  where: z.lazy(() => KeywordScalarWhereInputSchema),
  data: z.union([ z.lazy(() => KeywordUpdateManyMutationInputSchema), z.lazy(() => KeywordUncheckedUpdateManyWithoutUploadInputSchema) ]),
});

export const KeywordScalarWhereInputSchema: z.ZodType<Prisma.KeywordScalarWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => KeywordScalarWhereInputSchema), z.lazy(() => KeywordScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => KeywordScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => KeywordScalarWhereInputSchema), z.lazy(() => KeywordScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  uploadId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  keyword: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  monthlyVolume: z.union([ z.lazy(() => IntNullableFilterSchema), z.number() ]).optional().nullable(),
  difficulty: z.union([ z.lazy(() => IntNullableFilterSchema), z.number() ]).optional().nullable(),
  cpc: z.union([ z.lazy(() => FloatNullableFilterSchema), z.number() ]).optional().nullable(),
  intent: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  audience: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  topCompetitor: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  currentlyRankingPageId: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
});

export const CompetitorUpsertWithWhereUniqueWithoutUploadInputSchema: z.ZodType<Prisma.CompetitorUpsertWithWhereUniqueWithoutUploadInput> = z.strictObject({
  where: z.lazy(() => CompetitorWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => CompetitorUpdateWithoutUploadInputSchema), z.lazy(() => CompetitorUncheckedUpdateWithoutUploadInputSchema) ]),
  create: z.union([ z.lazy(() => CompetitorCreateWithoutUploadInputSchema), z.lazy(() => CompetitorUncheckedCreateWithoutUploadInputSchema) ]),
});

export const CompetitorUpdateWithWhereUniqueWithoutUploadInputSchema: z.ZodType<Prisma.CompetitorUpdateWithWhereUniqueWithoutUploadInput> = z.strictObject({
  where: z.lazy(() => CompetitorWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => CompetitorUpdateWithoutUploadInputSchema), z.lazy(() => CompetitorUncheckedUpdateWithoutUploadInputSchema) ]),
});

export const CompetitorUpdateManyWithWhereWithoutUploadInputSchema: z.ZodType<Prisma.CompetitorUpdateManyWithWhereWithoutUploadInput> = z.strictObject({
  where: z.lazy(() => CompetitorScalarWhereInputSchema),
  data: z.union([ z.lazy(() => CompetitorUpdateManyMutationInputSchema), z.lazy(() => CompetitorUncheckedUpdateManyWithoutUploadInputSchema) ]),
});

export const CompetitorScalarWhereInputSchema: z.ZodType<Prisma.CompetitorScalarWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => CompetitorScalarWhereInputSchema), z.lazy(() => CompetitorScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CompetitorScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CompetitorScalarWhereInputSchema), z.lazy(() => CompetitorScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  uploadId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  domain: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  positioning: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  estimatedMonthlyTraffic: z.union([ z.lazy(() => IntNullableFilterSchema), z.number() ]).optional().nullable(),
  audience: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  topTopics: z.lazy(() => StringNullableListFilterSchema).optional(),
  topContentGaps: z.lazy(() => StringNullableListFilterSchema).optional(),
});

export const TechnicalIssueUpsertWithWhereUniqueWithoutUploadInputSchema: z.ZodType<Prisma.TechnicalIssueUpsertWithWhereUniqueWithoutUploadInput> = z.strictObject({
  where: z.lazy(() => TechnicalIssueWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => TechnicalIssueUpdateWithoutUploadInputSchema), z.lazy(() => TechnicalIssueUncheckedUpdateWithoutUploadInputSchema) ]),
  create: z.union([ z.lazy(() => TechnicalIssueCreateWithoutUploadInputSchema), z.lazy(() => TechnicalIssueUncheckedCreateWithoutUploadInputSchema) ]),
});

export const TechnicalIssueUpdateWithWhereUniqueWithoutUploadInputSchema: z.ZodType<Prisma.TechnicalIssueUpdateWithWhereUniqueWithoutUploadInput> = z.strictObject({
  where: z.lazy(() => TechnicalIssueWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => TechnicalIssueUpdateWithoutUploadInputSchema), z.lazy(() => TechnicalIssueUncheckedUpdateWithoutUploadInputSchema) ]),
});

export const TechnicalIssueUpdateManyWithWhereWithoutUploadInputSchema: z.ZodType<Prisma.TechnicalIssueUpdateManyWithWhereWithoutUploadInput> = z.strictObject({
  where: z.lazy(() => TechnicalIssueScalarWhereInputSchema),
  data: z.union([ z.lazy(() => TechnicalIssueUpdateManyMutationInputSchema), z.lazy(() => TechnicalIssueUncheckedUpdateManyWithoutUploadInputSchema) ]),
});

export const TechnicalIssueScalarWhereInputSchema: z.ZodType<Prisma.TechnicalIssueScalarWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => TechnicalIssueScalarWhereInputSchema), z.lazy(() => TechnicalIssueScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => TechnicalIssueScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TechnicalIssueScalarWhereInputSchema), z.lazy(() => TechnicalIssueScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  uploadId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  pageId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  type: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  severity: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  details: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
});

export const ActionUpsertWithWhereUniqueWithoutUploadInputSchema: z.ZodType<Prisma.ActionUpsertWithWhereUniqueWithoutUploadInput> = z.strictObject({
  where: z.lazy(() => ActionWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ActionUpdateWithoutUploadInputSchema), z.lazy(() => ActionUncheckedUpdateWithoutUploadInputSchema) ]),
  create: z.union([ z.lazy(() => ActionCreateWithoutUploadInputSchema), z.lazy(() => ActionUncheckedCreateWithoutUploadInputSchema) ]),
});

export const ActionUpdateWithWhereUniqueWithoutUploadInputSchema: z.ZodType<Prisma.ActionUpdateWithWhereUniqueWithoutUploadInput> = z.strictObject({
  where: z.lazy(() => ActionWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ActionUpdateWithoutUploadInputSchema), z.lazy(() => ActionUncheckedUpdateWithoutUploadInputSchema) ]),
});

export const ActionUpdateManyWithWhereWithoutUploadInputSchema: z.ZodType<Prisma.ActionUpdateManyWithWhereWithoutUploadInput> = z.strictObject({
  where: z.lazy(() => ActionScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ActionUpdateManyMutationInputSchema), z.lazy(() => ActionUncheckedUpdateManyWithoutUploadInputSchema) ]),
});

export const ActionScalarWhereInputSchema: z.ZodType<Prisma.ActionScalarWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => ActionScalarWhereInputSchema), z.lazy(() => ActionScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ActionScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ActionScalarWhereInputSchema), z.lazy(() => ActionScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  uploadId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  type: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  reason: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  evidence: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  priority: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  confidence: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  status: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  rejectReason: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  payload: z.lazy(() => JsonFilterSchema).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
});

export const LlmLogUpsertWithWhereUniqueWithoutUploadInputSchema: z.ZodType<Prisma.LlmLogUpsertWithWhereUniqueWithoutUploadInput> = z.strictObject({
  where: z.lazy(() => LlmLogWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => LlmLogUpdateWithoutUploadInputSchema), z.lazy(() => LlmLogUncheckedUpdateWithoutUploadInputSchema) ]),
  create: z.union([ z.lazy(() => LlmLogCreateWithoutUploadInputSchema), z.lazy(() => LlmLogUncheckedCreateWithoutUploadInputSchema) ]),
});

export const LlmLogUpdateWithWhereUniqueWithoutUploadInputSchema: z.ZodType<Prisma.LlmLogUpdateWithWhereUniqueWithoutUploadInput> = z.strictObject({
  where: z.lazy(() => LlmLogWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => LlmLogUpdateWithoutUploadInputSchema), z.lazy(() => LlmLogUncheckedUpdateWithoutUploadInputSchema) ]),
});

export const LlmLogUpdateManyWithWhereWithoutUploadInputSchema: z.ZodType<Prisma.LlmLogUpdateManyWithWhereWithoutUploadInput> = z.strictObject({
  where: z.lazy(() => LlmLogScalarWhereInputSchema),
  data: z.union([ z.lazy(() => LlmLogUpdateManyMutationInputSchema), z.lazy(() => LlmLogUncheckedUpdateManyWithoutUploadInputSchema) ]),
});

export const LlmLogScalarWhereInputSchema: z.ZodType<Prisma.LlmLogScalarWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => LlmLogScalarWhereInputSchema), z.lazy(() => LlmLogScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => LlmLogScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => LlmLogScalarWhereInputSchema), z.lazy(() => LlmLogScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  uploadId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  agentName: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  prompt: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  contextPayload: z.lazy(() => JsonFilterSchema).optional(),
  rawOutput: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  latencyMs: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
});

export const UploadCreateWithoutPagesInputSchema: z.ZodType<Prisma.UploadCreateWithoutPagesInput> = z.strictObject({
  id: z.cuid().optional(),
  userId: z.string(),
  description: z.string().optional().nullable(),
  currency: z.string().optional().nullable(),
  generatedAt: z.coerce.date().optional().nullable(),
  windowDays: z.number().int().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  keywords: z.lazy(() => KeywordCreateNestedManyWithoutUploadInputSchema).optional(),
  competitors: z.lazy(() => CompetitorCreateNestedManyWithoutUploadInputSchema).optional(),
  technicalIssues: z.lazy(() => TechnicalIssueCreateNestedManyWithoutUploadInputSchema).optional(),
  actions: z.lazy(() => ActionCreateNestedManyWithoutUploadInputSchema).optional(),
  llmLogs: z.lazy(() => LlmLogCreateNestedManyWithoutUploadInputSchema).optional(),
});

export const UploadUncheckedCreateWithoutPagesInputSchema: z.ZodType<Prisma.UploadUncheckedCreateWithoutPagesInput> = z.strictObject({
  id: z.cuid().optional(),
  userId: z.string(),
  description: z.string().optional().nullable(),
  currency: z.string().optional().nullable(),
  generatedAt: z.coerce.date().optional().nullable(),
  windowDays: z.number().int().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  keywords: z.lazy(() => KeywordUncheckedCreateNestedManyWithoutUploadInputSchema).optional(),
  competitors: z.lazy(() => CompetitorUncheckedCreateNestedManyWithoutUploadInputSchema).optional(),
  technicalIssues: z.lazy(() => TechnicalIssueUncheckedCreateNestedManyWithoutUploadInputSchema).optional(),
  actions: z.lazy(() => ActionUncheckedCreateNestedManyWithoutUploadInputSchema).optional(),
  llmLogs: z.lazy(() => LlmLogUncheckedCreateNestedManyWithoutUploadInputSchema).optional(),
});

export const UploadCreateOrConnectWithoutPagesInputSchema: z.ZodType<Prisma.UploadCreateOrConnectWithoutPagesInput> = z.strictObject({
  where: z.lazy(() => UploadWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UploadCreateWithoutPagesInputSchema), z.lazy(() => UploadUncheckedCreateWithoutPagesInputSchema) ]),
});

export const TechnicalIssueCreateWithoutPageInputSchema: z.ZodType<Prisma.TechnicalIssueCreateWithoutPageInput> = z.strictObject({
  id: z.cuid().optional(),
  type: z.string(),
  severity: z.string(),
  details: z.string(),
  upload: z.lazy(() => UploadCreateNestedOneWithoutTechnicalIssuesInputSchema),
});

export const TechnicalIssueUncheckedCreateWithoutPageInputSchema: z.ZodType<Prisma.TechnicalIssueUncheckedCreateWithoutPageInput> = z.strictObject({
  id: z.cuid().optional(),
  uploadId: z.string(),
  type: z.string(),
  severity: z.string(),
  details: z.string(),
});

export const TechnicalIssueCreateOrConnectWithoutPageInputSchema: z.ZodType<Prisma.TechnicalIssueCreateOrConnectWithoutPageInput> = z.strictObject({
  where: z.lazy(() => TechnicalIssueWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => TechnicalIssueCreateWithoutPageInputSchema), z.lazy(() => TechnicalIssueUncheckedCreateWithoutPageInputSchema) ]),
});

export const TechnicalIssueCreateManyPageInputEnvelopeSchema: z.ZodType<Prisma.TechnicalIssueCreateManyPageInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => TechnicalIssueCreateManyPageInputSchema), z.lazy(() => TechnicalIssueCreateManyPageInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
});

export const KeywordCreateWithoutPageInputSchema: z.ZodType<Prisma.KeywordCreateWithoutPageInput> = z.strictObject({
  id: z.cuid().optional(),
  keyword: z.string(),
  monthlyVolume: z.number().int().optional().nullable(),
  difficulty: z.number().int().optional().nullable(),
  cpc: z.number().optional().nullable(),
  intent: z.string().optional().nullable(),
  audience: z.string().optional().nullable(),
  topCompetitor: z.string().optional().nullable(),
  upload: z.lazy(() => UploadCreateNestedOneWithoutKeywordsInputSchema),
});

export const KeywordUncheckedCreateWithoutPageInputSchema: z.ZodType<Prisma.KeywordUncheckedCreateWithoutPageInput> = z.strictObject({
  id: z.cuid().optional(),
  uploadId: z.string(),
  keyword: z.string(),
  monthlyVolume: z.number().int().optional().nullable(),
  difficulty: z.number().int().optional().nullable(),
  cpc: z.number().optional().nullable(),
  intent: z.string().optional().nullable(),
  audience: z.string().optional().nullable(),
  topCompetitor: z.string().optional().nullable(),
});

export const KeywordCreateOrConnectWithoutPageInputSchema: z.ZodType<Prisma.KeywordCreateOrConnectWithoutPageInput> = z.strictObject({
  where: z.lazy(() => KeywordWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => KeywordCreateWithoutPageInputSchema), z.lazy(() => KeywordUncheckedCreateWithoutPageInputSchema) ]),
});

export const KeywordCreateManyPageInputEnvelopeSchema: z.ZodType<Prisma.KeywordCreateManyPageInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => KeywordCreateManyPageInputSchema), z.lazy(() => KeywordCreateManyPageInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
});

export const UploadUpsertWithoutPagesInputSchema: z.ZodType<Prisma.UploadUpsertWithoutPagesInput> = z.strictObject({
  update: z.union([ z.lazy(() => UploadUpdateWithoutPagesInputSchema), z.lazy(() => UploadUncheckedUpdateWithoutPagesInputSchema) ]),
  create: z.union([ z.lazy(() => UploadCreateWithoutPagesInputSchema), z.lazy(() => UploadUncheckedCreateWithoutPagesInputSchema) ]),
  where: z.lazy(() => UploadWhereInputSchema).optional(),
});

export const UploadUpdateToOneWithWhereWithoutPagesInputSchema: z.ZodType<Prisma.UploadUpdateToOneWithWhereWithoutPagesInput> = z.strictObject({
  where: z.lazy(() => UploadWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UploadUpdateWithoutPagesInputSchema), z.lazy(() => UploadUncheckedUpdateWithoutPagesInputSchema) ]),
});

export const UploadUpdateWithoutPagesInputSchema: z.ZodType<Prisma.UploadUpdateWithoutPagesInput> = z.strictObject({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  currency: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  generatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  windowDays: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  keywords: z.lazy(() => KeywordUpdateManyWithoutUploadNestedInputSchema).optional(),
  competitors: z.lazy(() => CompetitorUpdateManyWithoutUploadNestedInputSchema).optional(),
  technicalIssues: z.lazy(() => TechnicalIssueUpdateManyWithoutUploadNestedInputSchema).optional(),
  actions: z.lazy(() => ActionUpdateManyWithoutUploadNestedInputSchema).optional(),
  llmLogs: z.lazy(() => LlmLogUpdateManyWithoutUploadNestedInputSchema).optional(),
});

export const UploadUncheckedUpdateWithoutPagesInputSchema: z.ZodType<Prisma.UploadUncheckedUpdateWithoutPagesInput> = z.strictObject({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  currency: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  generatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  windowDays: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  keywords: z.lazy(() => KeywordUncheckedUpdateManyWithoutUploadNestedInputSchema).optional(),
  competitors: z.lazy(() => CompetitorUncheckedUpdateManyWithoutUploadNestedInputSchema).optional(),
  technicalIssues: z.lazy(() => TechnicalIssueUncheckedUpdateManyWithoutUploadNestedInputSchema).optional(),
  actions: z.lazy(() => ActionUncheckedUpdateManyWithoutUploadNestedInputSchema).optional(),
  llmLogs: z.lazy(() => LlmLogUncheckedUpdateManyWithoutUploadNestedInputSchema).optional(),
});

export const TechnicalIssueUpsertWithWhereUniqueWithoutPageInputSchema: z.ZodType<Prisma.TechnicalIssueUpsertWithWhereUniqueWithoutPageInput> = z.strictObject({
  where: z.lazy(() => TechnicalIssueWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => TechnicalIssueUpdateWithoutPageInputSchema), z.lazy(() => TechnicalIssueUncheckedUpdateWithoutPageInputSchema) ]),
  create: z.union([ z.lazy(() => TechnicalIssueCreateWithoutPageInputSchema), z.lazy(() => TechnicalIssueUncheckedCreateWithoutPageInputSchema) ]),
});

export const TechnicalIssueUpdateWithWhereUniqueWithoutPageInputSchema: z.ZodType<Prisma.TechnicalIssueUpdateWithWhereUniqueWithoutPageInput> = z.strictObject({
  where: z.lazy(() => TechnicalIssueWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => TechnicalIssueUpdateWithoutPageInputSchema), z.lazy(() => TechnicalIssueUncheckedUpdateWithoutPageInputSchema) ]),
});

export const TechnicalIssueUpdateManyWithWhereWithoutPageInputSchema: z.ZodType<Prisma.TechnicalIssueUpdateManyWithWhereWithoutPageInput> = z.strictObject({
  where: z.lazy(() => TechnicalIssueScalarWhereInputSchema),
  data: z.union([ z.lazy(() => TechnicalIssueUpdateManyMutationInputSchema), z.lazy(() => TechnicalIssueUncheckedUpdateManyWithoutPageInputSchema) ]),
});

export const KeywordUpsertWithWhereUniqueWithoutPageInputSchema: z.ZodType<Prisma.KeywordUpsertWithWhereUniqueWithoutPageInput> = z.strictObject({
  where: z.lazy(() => KeywordWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => KeywordUpdateWithoutPageInputSchema), z.lazy(() => KeywordUncheckedUpdateWithoutPageInputSchema) ]),
  create: z.union([ z.lazy(() => KeywordCreateWithoutPageInputSchema), z.lazy(() => KeywordUncheckedCreateWithoutPageInputSchema) ]),
});

export const KeywordUpdateWithWhereUniqueWithoutPageInputSchema: z.ZodType<Prisma.KeywordUpdateWithWhereUniqueWithoutPageInput> = z.strictObject({
  where: z.lazy(() => KeywordWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => KeywordUpdateWithoutPageInputSchema), z.lazy(() => KeywordUncheckedUpdateWithoutPageInputSchema) ]),
});

export const KeywordUpdateManyWithWhereWithoutPageInputSchema: z.ZodType<Prisma.KeywordUpdateManyWithWhereWithoutPageInput> = z.strictObject({
  where: z.lazy(() => KeywordScalarWhereInputSchema),
  data: z.union([ z.lazy(() => KeywordUpdateManyMutationInputSchema), z.lazy(() => KeywordUncheckedUpdateManyWithoutPageInputSchema) ]),
});

export const UploadCreateWithoutKeywordsInputSchema: z.ZodType<Prisma.UploadCreateWithoutKeywordsInput> = z.strictObject({
  id: z.cuid().optional(),
  userId: z.string(),
  description: z.string().optional().nullable(),
  currency: z.string().optional().nullable(),
  generatedAt: z.coerce.date().optional().nullable(),
  windowDays: z.number().int().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  pages: z.lazy(() => PageCreateNestedManyWithoutUploadInputSchema).optional(),
  competitors: z.lazy(() => CompetitorCreateNestedManyWithoutUploadInputSchema).optional(),
  technicalIssues: z.lazy(() => TechnicalIssueCreateNestedManyWithoutUploadInputSchema).optional(),
  actions: z.lazy(() => ActionCreateNestedManyWithoutUploadInputSchema).optional(),
  llmLogs: z.lazy(() => LlmLogCreateNestedManyWithoutUploadInputSchema).optional(),
});

export const UploadUncheckedCreateWithoutKeywordsInputSchema: z.ZodType<Prisma.UploadUncheckedCreateWithoutKeywordsInput> = z.strictObject({
  id: z.cuid().optional(),
  userId: z.string(),
  description: z.string().optional().nullable(),
  currency: z.string().optional().nullable(),
  generatedAt: z.coerce.date().optional().nullable(),
  windowDays: z.number().int().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  pages: z.lazy(() => PageUncheckedCreateNestedManyWithoutUploadInputSchema).optional(),
  competitors: z.lazy(() => CompetitorUncheckedCreateNestedManyWithoutUploadInputSchema).optional(),
  technicalIssues: z.lazy(() => TechnicalIssueUncheckedCreateNestedManyWithoutUploadInputSchema).optional(),
  actions: z.lazy(() => ActionUncheckedCreateNestedManyWithoutUploadInputSchema).optional(),
  llmLogs: z.lazy(() => LlmLogUncheckedCreateNestedManyWithoutUploadInputSchema).optional(),
});

export const UploadCreateOrConnectWithoutKeywordsInputSchema: z.ZodType<Prisma.UploadCreateOrConnectWithoutKeywordsInput> = z.strictObject({
  where: z.lazy(() => UploadWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UploadCreateWithoutKeywordsInputSchema), z.lazy(() => UploadUncheckedCreateWithoutKeywordsInputSchema) ]),
});

export const PageCreateWithoutKeywordsInputSchema: z.ZodType<Prisma.PageCreateWithoutKeywordsInput> = z.strictObject({
  id: z.cuid().optional(),
  sourceId: z.string(),
  url: z.string(),
  title: z.string(),
  metaDescription: z.string().optional().nullable(),
  targetKeyword: z.string().optional().nullable(),
  intent: z.string().optional().nullable(),
  audience: z.string().optional().nullable(),
  wordCount: z.number().int().optional().nullable(),
  publishedAt: z.coerce.date().optional().nullable(),
  lastModified: z.coerce.date().optional().nullable(),
  impressions: z.number().int().optional().nullable(),
  clicks: z.number().int().optional().nullable(),
  position: z.number().optional().nullable(),
  ctr: z.number().optional().nullable(),
  conversions: z.number().int().optional().nullable(),
  conversionRate: z.number().optional().nullable(),
  upload: z.lazy(() => UploadCreateNestedOneWithoutPagesInputSchema),
  technicalIssues: z.lazy(() => TechnicalIssueCreateNestedManyWithoutPageInputSchema).optional(),
});

export const PageUncheckedCreateWithoutKeywordsInputSchema: z.ZodType<Prisma.PageUncheckedCreateWithoutKeywordsInput> = z.strictObject({
  id: z.cuid().optional(),
  uploadId: z.string(),
  sourceId: z.string(),
  url: z.string(),
  title: z.string(),
  metaDescription: z.string().optional().nullable(),
  targetKeyword: z.string().optional().nullable(),
  intent: z.string().optional().nullable(),
  audience: z.string().optional().nullable(),
  wordCount: z.number().int().optional().nullable(),
  publishedAt: z.coerce.date().optional().nullable(),
  lastModified: z.coerce.date().optional().nullable(),
  impressions: z.number().int().optional().nullable(),
  clicks: z.number().int().optional().nullable(),
  position: z.number().optional().nullable(),
  ctr: z.number().optional().nullable(),
  conversions: z.number().int().optional().nullable(),
  conversionRate: z.number().optional().nullable(),
  technicalIssues: z.lazy(() => TechnicalIssueUncheckedCreateNestedManyWithoutPageInputSchema).optional(),
});

export const PageCreateOrConnectWithoutKeywordsInputSchema: z.ZodType<Prisma.PageCreateOrConnectWithoutKeywordsInput> = z.strictObject({
  where: z.lazy(() => PageWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => PageCreateWithoutKeywordsInputSchema), z.lazy(() => PageUncheckedCreateWithoutKeywordsInputSchema) ]),
});

export const UploadUpsertWithoutKeywordsInputSchema: z.ZodType<Prisma.UploadUpsertWithoutKeywordsInput> = z.strictObject({
  update: z.union([ z.lazy(() => UploadUpdateWithoutKeywordsInputSchema), z.lazy(() => UploadUncheckedUpdateWithoutKeywordsInputSchema) ]),
  create: z.union([ z.lazy(() => UploadCreateWithoutKeywordsInputSchema), z.lazy(() => UploadUncheckedCreateWithoutKeywordsInputSchema) ]),
  where: z.lazy(() => UploadWhereInputSchema).optional(),
});

export const UploadUpdateToOneWithWhereWithoutKeywordsInputSchema: z.ZodType<Prisma.UploadUpdateToOneWithWhereWithoutKeywordsInput> = z.strictObject({
  where: z.lazy(() => UploadWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UploadUpdateWithoutKeywordsInputSchema), z.lazy(() => UploadUncheckedUpdateWithoutKeywordsInputSchema) ]),
});

export const UploadUpdateWithoutKeywordsInputSchema: z.ZodType<Prisma.UploadUpdateWithoutKeywordsInput> = z.strictObject({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  currency: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  generatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  windowDays: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  pages: z.lazy(() => PageUpdateManyWithoutUploadNestedInputSchema).optional(),
  competitors: z.lazy(() => CompetitorUpdateManyWithoutUploadNestedInputSchema).optional(),
  technicalIssues: z.lazy(() => TechnicalIssueUpdateManyWithoutUploadNestedInputSchema).optional(),
  actions: z.lazy(() => ActionUpdateManyWithoutUploadNestedInputSchema).optional(),
  llmLogs: z.lazy(() => LlmLogUpdateManyWithoutUploadNestedInputSchema).optional(),
});

export const UploadUncheckedUpdateWithoutKeywordsInputSchema: z.ZodType<Prisma.UploadUncheckedUpdateWithoutKeywordsInput> = z.strictObject({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  currency: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  generatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  windowDays: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  pages: z.lazy(() => PageUncheckedUpdateManyWithoutUploadNestedInputSchema).optional(),
  competitors: z.lazy(() => CompetitorUncheckedUpdateManyWithoutUploadNestedInputSchema).optional(),
  technicalIssues: z.lazy(() => TechnicalIssueUncheckedUpdateManyWithoutUploadNestedInputSchema).optional(),
  actions: z.lazy(() => ActionUncheckedUpdateManyWithoutUploadNestedInputSchema).optional(),
  llmLogs: z.lazy(() => LlmLogUncheckedUpdateManyWithoutUploadNestedInputSchema).optional(),
});

export const PageUpsertWithoutKeywordsInputSchema: z.ZodType<Prisma.PageUpsertWithoutKeywordsInput> = z.strictObject({
  update: z.union([ z.lazy(() => PageUpdateWithoutKeywordsInputSchema), z.lazy(() => PageUncheckedUpdateWithoutKeywordsInputSchema) ]),
  create: z.union([ z.lazy(() => PageCreateWithoutKeywordsInputSchema), z.lazy(() => PageUncheckedCreateWithoutKeywordsInputSchema) ]),
  where: z.lazy(() => PageWhereInputSchema).optional(),
});

export const PageUpdateToOneWithWhereWithoutKeywordsInputSchema: z.ZodType<Prisma.PageUpdateToOneWithWhereWithoutKeywordsInput> = z.strictObject({
  where: z.lazy(() => PageWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => PageUpdateWithoutKeywordsInputSchema), z.lazy(() => PageUncheckedUpdateWithoutKeywordsInputSchema) ]),
});

export const PageUpdateWithoutKeywordsInputSchema: z.ZodType<Prisma.PageUpdateWithoutKeywordsInput> = z.strictObject({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sourceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  metaDescription: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  targetKeyword: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  intent: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  audience: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  wordCount: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  publishedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastModified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  impressions: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  clicks: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  position: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ctr: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  conversions: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  conversionRate: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  upload: z.lazy(() => UploadUpdateOneRequiredWithoutPagesNestedInputSchema).optional(),
  technicalIssues: z.lazy(() => TechnicalIssueUpdateManyWithoutPageNestedInputSchema).optional(),
});

export const PageUncheckedUpdateWithoutKeywordsInputSchema: z.ZodType<Prisma.PageUncheckedUpdateWithoutKeywordsInput> = z.strictObject({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  uploadId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sourceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  metaDescription: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  targetKeyword: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  intent: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  audience: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  wordCount: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  publishedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastModified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  impressions: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  clicks: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  position: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ctr: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  conversions: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  conversionRate: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  technicalIssues: z.lazy(() => TechnicalIssueUncheckedUpdateManyWithoutPageNestedInputSchema).optional(),
});

export const UploadCreateWithoutCompetitorsInputSchema: z.ZodType<Prisma.UploadCreateWithoutCompetitorsInput> = z.strictObject({
  id: z.cuid().optional(),
  userId: z.string(),
  description: z.string().optional().nullable(),
  currency: z.string().optional().nullable(),
  generatedAt: z.coerce.date().optional().nullable(),
  windowDays: z.number().int().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  pages: z.lazy(() => PageCreateNestedManyWithoutUploadInputSchema).optional(),
  keywords: z.lazy(() => KeywordCreateNestedManyWithoutUploadInputSchema).optional(),
  technicalIssues: z.lazy(() => TechnicalIssueCreateNestedManyWithoutUploadInputSchema).optional(),
  actions: z.lazy(() => ActionCreateNestedManyWithoutUploadInputSchema).optional(),
  llmLogs: z.lazy(() => LlmLogCreateNestedManyWithoutUploadInputSchema).optional(),
});

export const UploadUncheckedCreateWithoutCompetitorsInputSchema: z.ZodType<Prisma.UploadUncheckedCreateWithoutCompetitorsInput> = z.strictObject({
  id: z.cuid().optional(),
  userId: z.string(),
  description: z.string().optional().nullable(),
  currency: z.string().optional().nullable(),
  generatedAt: z.coerce.date().optional().nullable(),
  windowDays: z.number().int().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  pages: z.lazy(() => PageUncheckedCreateNestedManyWithoutUploadInputSchema).optional(),
  keywords: z.lazy(() => KeywordUncheckedCreateNestedManyWithoutUploadInputSchema).optional(),
  technicalIssues: z.lazy(() => TechnicalIssueUncheckedCreateNestedManyWithoutUploadInputSchema).optional(),
  actions: z.lazy(() => ActionUncheckedCreateNestedManyWithoutUploadInputSchema).optional(),
  llmLogs: z.lazy(() => LlmLogUncheckedCreateNestedManyWithoutUploadInputSchema).optional(),
});

export const UploadCreateOrConnectWithoutCompetitorsInputSchema: z.ZodType<Prisma.UploadCreateOrConnectWithoutCompetitorsInput> = z.strictObject({
  where: z.lazy(() => UploadWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UploadCreateWithoutCompetitorsInputSchema), z.lazy(() => UploadUncheckedCreateWithoutCompetitorsInputSchema) ]),
});

export const UploadUpsertWithoutCompetitorsInputSchema: z.ZodType<Prisma.UploadUpsertWithoutCompetitorsInput> = z.strictObject({
  update: z.union([ z.lazy(() => UploadUpdateWithoutCompetitorsInputSchema), z.lazy(() => UploadUncheckedUpdateWithoutCompetitorsInputSchema) ]),
  create: z.union([ z.lazy(() => UploadCreateWithoutCompetitorsInputSchema), z.lazy(() => UploadUncheckedCreateWithoutCompetitorsInputSchema) ]),
  where: z.lazy(() => UploadWhereInputSchema).optional(),
});

export const UploadUpdateToOneWithWhereWithoutCompetitorsInputSchema: z.ZodType<Prisma.UploadUpdateToOneWithWhereWithoutCompetitorsInput> = z.strictObject({
  where: z.lazy(() => UploadWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UploadUpdateWithoutCompetitorsInputSchema), z.lazy(() => UploadUncheckedUpdateWithoutCompetitorsInputSchema) ]),
});

export const UploadUpdateWithoutCompetitorsInputSchema: z.ZodType<Prisma.UploadUpdateWithoutCompetitorsInput> = z.strictObject({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  currency: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  generatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  windowDays: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  pages: z.lazy(() => PageUpdateManyWithoutUploadNestedInputSchema).optional(),
  keywords: z.lazy(() => KeywordUpdateManyWithoutUploadNestedInputSchema).optional(),
  technicalIssues: z.lazy(() => TechnicalIssueUpdateManyWithoutUploadNestedInputSchema).optional(),
  actions: z.lazy(() => ActionUpdateManyWithoutUploadNestedInputSchema).optional(),
  llmLogs: z.lazy(() => LlmLogUpdateManyWithoutUploadNestedInputSchema).optional(),
});

export const UploadUncheckedUpdateWithoutCompetitorsInputSchema: z.ZodType<Prisma.UploadUncheckedUpdateWithoutCompetitorsInput> = z.strictObject({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  currency: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  generatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  windowDays: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  pages: z.lazy(() => PageUncheckedUpdateManyWithoutUploadNestedInputSchema).optional(),
  keywords: z.lazy(() => KeywordUncheckedUpdateManyWithoutUploadNestedInputSchema).optional(),
  technicalIssues: z.lazy(() => TechnicalIssueUncheckedUpdateManyWithoutUploadNestedInputSchema).optional(),
  actions: z.lazy(() => ActionUncheckedUpdateManyWithoutUploadNestedInputSchema).optional(),
  llmLogs: z.lazy(() => LlmLogUncheckedUpdateManyWithoutUploadNestedInputSchema).optional(),
});

export const UploadCreateWithoutTechnicalIssuesInputSchema: z.ZodType<Prisma.UploadCreateWithoutTechnicalIssuesInput> = z.strictObject({
  id: z.cuid().optional(),
  userId: z.string(),
  description: z.string().optional().nullable(),
  currency: z.string().optional().nullable(),
  generatedAt: z.coerce.date().optional().nullable(),
  windowDays: z.number().int().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  pages: z.lazy(() => PageCreateNestedManyWithoutUploadInputSchema).optional(),
  keywords: z.lazy(() => KeywordCreateNestedManyWithoutUploadInputSchema).optional(),
  competitors: z.lazy(() => CompetitorCreateNestedManyWithoutUploadInputSchema).optional(),
  actions: z.lazy(() => ActionCreateNestedManyWithoutUploadInputSchema).optional(),
  llmLogs: z.lazy(() => LlmLogCreateNestedManyWithoutUploadInputSchema).optional(),
});

export const UploadUncheckedCreateWithoutTechnicalIssuesInputSchema: z.ZodType<Prisma.UploadUncheckedCreateWithoutTechnicalIssuesInput> = z.strictObject({
  id: z.cuid().optional(),
  userId: z.string(),
  description: z.string().optional().nullable(),
  currency: z.string().optional().nullable(),
  generatedAt: z.coerce.date().optional().nullable(),
  windowDays: z.number().int().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  pages: z.lazy(() => PageUncheckedCreateNestedManyWithoutUploadInputSchema).optional(),
  keywords: z.lazy(() => KeywordUncheckedCreateNestedManyWithoutUploadInputSchema).optional(),
  competitors: z.lazy(() => CompetitorUncheckedCreateNestedManyWithoutUploadInputSchema).optional(),
  actions: z.lazy(() => ActionUncheckedCreateNestedManyWithoutUploadInputSchema).optional(),
  llmLogs: z.lazy(() => LlmLogUncheckedCreateNestedManyWithoutUploadInputSchema).optional(),
});

export const UploadCreateOrConnectWithoutTechnicalIssuesInputSchema: z.ZodType<Prisma.UploadCreateOrConnectWithoutTechnicalIssuesInput> = z.strictObject({
  where: z.lazy(() => UploadWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UploadCreateWithoutTechnicalIssuesInputSchema), z.lazy(() => UploadUncheckedCreateWithoutTechnicalIssuesInputSchema) ]),
});

export const PageCreateWithoutTechnicalIssuesInputSchema: z.ZodType<Prisma.PageCreateWithoutTechnicalIssuesInput> = z.strictObject({
  id: z.cuid().optional(),
  sourceId: z.string(),
  url: z.string(),
  title: z.string(),
  metaDescription: z.string().optional().nullable(),
  targetKeyword: z.string().optional().nullable(),
  intent: z.string().optional().nullable(),
  audience: z.string().optional().nullable(),
  wordCount: z.number().int().optional().nullable(),
  publishedAt: z.coerce.date().optional().nullable(),
  lastModified: z.coerce.date().optional().nullable(),
  impressions: z.number().int().optional().nullable(),
  clicks: z.number().int().optional().nullable(),
  position: z.number().optional().nullable(),
  ctr: z.number().optional().nullable(),
  conversions: z.number().int().optional().nullable(),
  conversionRate: z.number().optional().nullable(),
  upload: z.lazy(() => UploadCreateNestedOneWithoutPagesInputSchema),
  keywords: z.lazy(() => KeywordCreateNestedManyWithoutPageInputSchema).optional(),
});

export const PageUncheckedCreateWithoutTechnicalIssuesInputSchema: z.ZodType<Prisma.PageUncheckedCreateWithoutTechnicalIssuesInput> = z.strictObject({
  id: z.cuid().optional(),
  uploadId: z.string(),
  sourceId: z.string(),
  url: z.string(),
  title: z.string(),
  metaDescription: z.string().optional().nullable(),
  targetKeyword: z.string().optional().nullable(),
  intent: z.string().optional().nullable(),
  audience: z.string().optional().nullable(),
  wordCount: z.number().int().optional().nullable(),
  publishedAt: z.coerce.date().optional().nullable(),
  lastModified: z.coerce.date().optional().nullable(),
  impressions: z.number().int().optional().nullable(),
  clicks: z.number().int().optional().nullable(),
  position: z.number().optional().nullable(),
  ctr: z.number().optional().nullable(),
  conversions: z.number().int().optional().nullable(),
  conversionRate: z.number().optional().nullable(),
  keywords: z.lazy(() => KeywordUncheckedCreateNestedManyWithoutPageInputSchema).optional(),
});

export const PageCreateOrConnectWithoutTechnicalIssuesInputSchema: z.ZodType<Prisma.PageCreateOrConnectWithoutTechnicalIssuesInput> = z.strictObject({
  where: z.lazy(() => PageWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => PageCreateWithoutTechnicalIssuesInputSchema), z.lazy(() => PageUncheckedCreateWithoutTechnicalIssuesInputSchema) ]),
});

export const UploadUpsertWithoutTechnicalIssuesInputSchema: z.ZodType<Prisma.UploadUpsertWithoutTechnicalIssuesInput> = z.strictObject({
  update: z.union([ z.lazy(() => UploadUpdateWithoutTechnicalIssuesInputSchema), z.lazy(() => UploadUncheckedUpdateWithoutTechnicalIssuesInputSchema) ]),
  create: z.union([ z.lazy(() => UploadCreateWithoutTechnicalIssuesInputSchema), z.lazy(() => UploadUncheckedCreateWithoutTechnicalIssuesInputSchema) ]),
  where: z.lazy(() => UploadWhereInputSchema).optional(),
});

export const UploadUpdateToOneWithWhereWithoutTechnicalIssuesInputSchema: z.ZodType<Prisma.UploadUpdateToOneWithWhereWithoutTechnicalIssuesInput> = z.strictObject({
  where: z.lazy(() => UploadWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UploadUpdateWithoutTechnicalIssuesInputSchema), z.lazy(() => UploadUncheckedUpdateWithoutTechnicalIssuesInputSchema) ]),
});

export const UploadUpdateWithoutTechnicalIssuesInputSchema: z.ZodType<Prisma.UploadUpdateWithoutTechnicalIssuesInput> = z.strictObject({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  currency: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  generatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  windowDays: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  pages: z.lazy(() => PageUpdateManyWithoutUploadNestedInputSchema).optional(),
  keywords: z.lazy(() => KeywordUpdateManyWithoutUploadNestedInputSchema).optional(),
  competitors: z.lazy(() => CompetitorUpdateManyWithoutUploadNestedInputSchema).optional(),
  actions: z.lazy(() => ActionUpdateManyWithoutUploadNestedInputSchema).optional(),
  llmLogs: z.lazy(() => LlmLogUpdateManyWithoutUploadNestedInputSchema).optional(),
});

export const UploadUncheckedUpdateWithoutTechnicalIssuesInputSchema: z.ZodType<Prisma.UploadUncheckedUpdateWithoutTechnicalIssuesInput> = z.strictObject({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  currency: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  generatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  windowDays: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  pages: z.lazy(() => PageUncheckedUpdateManyWithoutUploadNestedInputSchema).optional(),
  keywords: z.lazy(() => KeywordUncheckedUpdateManyWithoutUploadNestedInputSchema).optional(),
  competitors: z.lazy(() => CompetitorUncheckedUpdateManyWithoutUploadNestedInputSchema).optional(),
  actions: z.lazy(() => ActionUncheckedUpdateManyWithoutUploadNestedInputSchema).optional(),
  llmLogs: z.lazy(() => LlmLogUncheckedUpdateManyWithoutUploadNestedInputSchema).optional(),
});

export const PageUpsertWithoutTechnicalIssuesInputSchema: z.ZodType<Prisma.PageUpsertWithoutTechnicalIssuesInput> = z.strictObject({
  update: z.union([ z.lazy(() => PageUpdateWithoutTechnicalIssuesInputSchema), z.lazy(() => PageUncheckedUpdateWithoutTechnicalIssuesInputSchema) ]),
  create: z.union([ z.lazy(() => PageCreateWithoutTechnicalIssuesInputSchema), z.lazy(() => PageUncheckedCreateWithoutTechnicalIssuesInputSchema) ]),
  where: z.lazy(() => PageWhereInputSchema).optional(),
});

export const PageUpdateToOneWithWhereWithoutTechnicalIssuesInputSchema: z.ZodType<Prisma.PageUpdateToOneWithWhereWithoutTechnicalIssuesInput> = z.strictObject({
  where: z.lazy(() => PageWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => PageUpdateWithoutTechnicalIssuesInputSchema), z.lazy(() => PageUncheckedUpdateWithoutTechnicalIssuesInputSchema) ]),
});

export const PageUpdateWithoutTechnicalIssuesInputSchema: z.ZodType<Prisma.PageUpdateWithoutTechnicalIssuesInput> = z.strictObject({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sourceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  metaDescription: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  targetKeyword: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  intent: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  audience: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  wordCount: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  publishedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastModified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  impressions: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  clicks: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  position: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ctr: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  conversions: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  conversionRate: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  upload: z.lazy(() => UploadUpdateOneRequiredWithoutPagesNestedInputSchema).optional(),
  keywords: z.lazy(() => KeywordUpdateManyWithoutPageNestedInputSchema).optional(),
});

export const PageUncheckedUpdateWithoutTechnicalIssuesInputSchema: z.ZodType<Prisma.PageUncheckedUpdateWithoutTechnicalIssuesInput> = z.strictObject({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  uploadId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sourceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  metaDescription: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  targetKeyword: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  intent: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  audience: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  wordCount: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  publishedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastModified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  impressions: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  clicks: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  position: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ctr: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  conversions: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  conversionRate: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  keywords: z.lazy(() => KeywordUncheckedUpdateManyWithoutPageNestedInputSchema).optional(),
});

export const UploadCreateWithoutActionsInputSchema: z.ZodType<Prisma.UploadCreateWithoutActionsInput> = z.strictObject({
  id: z.cuid().optional(),
  userId: z.string(),
  description: z.string().optional().nullable(),
  currency: z.string().optional().nullable(),
  generatedAt: z.coerce.date().optional().nullable(),
  windowDays: z.number().int().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  pages: z.lazy(() => PageCreateNestedManyWithoutUploadInputSchema).optional(),
  keywords: z.lazy(() => KeywordCreateNestedManyWithoutUploadInputSchema).optional(),
  competitors: z.lazy(() => CompetitorCreateNestedManyWithoutUploadInputSchema).optional(),
  technicalIssues: z.lazy(() => TechnicalIssueCreateNestedManyWithoutUploadInputSchema).optional(),
  llmLogs: z.lazy(() => LlmLogCreateNestedManyWithoutUploadInputSchema).optional(),
});

export const UploadUncheckedCreateWithoutActionsInputSchema: z.ZodType<Prisma.UploadUncheckedCreateWithoutActionsInput> = z.strictObject({
  id: z.cuid().optional(),
  userId: z.string(),
  description: z.string().optional().nullable(),
  currency: z.string().optional().nullable(),
  generatedAt: z.coerce.date().optional().nullable(),
  windowDays: z.number().int().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  pages: z.lazy(() => PageUncheckedCreateNestedManyWithoutUploadInputSchema).optional(),
  keywords: z.lazy(() => KeywordUncheckedCreateNestedManyWithoutUploadInputSchema).optional(),
  competitors: z.lazy(() => CompetitorUncheckedCreateNestedManyWithoutUploadInputSchema).optional(),
  technicalIssues: z.lazy(() => TechnicalIssueUncheckedCreateNestedManyWithoutUploadInputSchema).optional(),
  llmLogs: z.lazy(() => LlmLogUncheckedCreateNestedManyWithoutUploadInputSchema).optional(),
});

export const UploadCreateOrConnectWithoutActionsInputSchema: z.ZodType<Prisma.UploadCreateOrConnectWithoutActionsInput> = z.strictObject({
  where: z.lazy(() => UploadWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UploadCreateWithoutActionsInputSchema), z.lazy(() => UploadUncheckedCreateWithoutActionsInputSchema) ]),
});

export const UploadUpsertWithoutActionsInputSchema: z.ZodType<Prisma.UploadUpsertWithoutActionsInput> = z.strictObject({
  update: z.union([ z.lazy(() => UploadUpdateWithoutActionsInputSchema), z.lazy(() => UploadUncheckedUpdateWithoutActionsInputSchema) ]),
  create: z.union([ z.lazy(() => UploadCreateWithoutActionsInputSchema), z.lazy(() => UploadUncheckedCreateWithoutActionsInputSchema) ]),
  where: z.lazy(() => UploadWhereInputSchema).optional(),
});

export const UploadUpdateToOneWithWhereWithoutActionsInputSchema: z.ZodType<Prisma.UploadUpdateToOneWithWhereWithoutActionsInput> = z.strictObject({
  where: z.lazy(() => UploadWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UploadUpdateWithoutActionsInputSchema), z.lazy(() => UploadUncheckedUpdateWithoutActionsInputSchema) ]),
});

export const UploadUpdateWithoutActionsInputSchema: z.ZodType<Prisma.UploadUpdateWithoutActionsInput> = z.strictObject({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  currency: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  generatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  windowDays: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  pages: z.lazy(() => PageUpdateManyWithoutUploadNestedInputSchema).optional(),
  keywords: z.lazy(() => KeywordUpdateManyWithoutUploadNestedInputSchema).optional(),
  competitors: z.lazy(() => CompetitorUpdateManyWithoutUploadNestedInputSchema).optional(),
  technicalIssues: z.lazy(() => TechnicalIssueUpdateManyWithoutUploadNestedInputSchema).optional(),
  llmLogs: z.lazy(() => LlmLogUpdateManyWithoutUploadNestedInputSchema).optional(),
});

export const UploadUncheckedUpdateWithoutActionsInputSchema: z.ZodType<Prisma.UploadUncheckedUpdateWithoutActionsInput> = z.strictObject({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  currency: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  generatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  windowDays: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  pages: z.lazy(() => PageUncheckedUpdateManyWithoutUploadNestedInputSchema).optional(),
  keywords: z.lazy(() => KeywordUncheckedUpdateManyWithoutUploadNestedInputSchema).optional(),
  competitors: z.lazy(() => CompetitorUncheckedUpdateManyWithoutUploadNestedInputSchema).optional(),
  technicalIssues: z.lazy(() => TechnicalIssueUncheckedUpdateManyWithoutUploadNestedInputSchema).optional(),
  llmLogs: z.lazy(() => LlmLogUncheckedUpdateManyWithoutUploadNestedInputSchema).optional(),
});

export const UploadCreateWithoutLlmLogsInputSchema: z.ZodType<Prisma.UploadCreateWithoutLlmLogsInput> = z.strictObject({
  id: z.cuid().optional(),
  userId: z.string(),
  description: z.string().optional().nullable(),
  currency: z.string().optional().nullable(),
  generatedAt: z.coerce.date().optional().nullable(),
  windowDays: z.number().int().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  pages: z.lazy(() => PageCreateNestedManyWithoutUploadInputSchema).optional(),
  keywords: z.lazy(() => KeywordCreateNestedManyWithoutUploadInputSchema).optional(),
  competitors: z.lazy(() => CompetitorCreateNestedManyWithoutUploadInputSchema).optional(),
  technicalIssues: z.lazy(() => TechnicalIssueCreateNestedManyWithoutUploadInputSchema).optional(),
  actions: z.lazy(() => ActionCreateNestedManyWithoutUploadInputSchema).optional(),
});

export const UploadUncheckedCreateWithoutLlmLogsInputSchema: z.ZodType<Prisma.UploadUncheckedCreateWithoutLlmLogsInput> = z.strictObject({
  id: z.cuid().optional(),
  userId: z.string(),
  description: z.string().optional().nullable(),
  currency: z.string().optional().nullable(),
  generatedAt: z.coerce.date().optional().nullable(),
  windowDays: z.number().int().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  pages: z.lazy(() => PageUncheckedCreateNestedManyWithoutUploadInputSchema).optional(),
  keywords: z.lazy(() => KeywordUncheckedCreateNestedManyWithoutUploadInputSchema).optional(),
  competitors: z.lazy(() => CompetitorUncheckedCreateNestedManyWithoutUploadInputSchema).optional(),
  technicalIssues: z.lazy(() => TechnicalIssueUncheckedCreateNestedManyWithoutUploadInputSchema).optional(),
  actions: z.lazy(() => ActionUncheckedCreateNestedManyWithoutUploadInputSchema).optional(),
});

export const UploadCreateOrConnectWithoutLlmLogsInputSchema: z.ZodType<Prisma.UploadCreateOrConnectWithoutLlmLogsInput> = z.strictObject({
  where: z.lazy(() => UploadWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UploadCreateWithoutLlmLogsInputSchema), z.lazy(() => UploadUncheckedCreateWithoutLlmLogsInputSchema) ]),
});

export const UploadUpsertWithoutLlmLogsInputSchema: z.ZodType<Prisma.UploadUpsertWithoutLlmLogsInput> = z.strictObject({
  update: z.union([ z.lazy(() => UploadUpdateWithoutLlmLogsInputSchema), z.lazy(() => UploadUncheckedUpdateWithoutLlmLogsInputSchema) ]),
  create: z.union([ z.lazy(() => UploadCreateWithoutLlmLogsInputSchema), z.lazy(() => UploadUncheckedCreateWithoutLlmLogsInputSchema) ]),
  where: z.lazy(() => UploadWhereInputSchema).optional(),
});

export const UploadUpdateToOneWithWhereWithoutLlmLogsInputSchema: z.ZodType<Prisma.UploadUpdateToOneWithWhereWithoutLlmLogsInput> = z.strictObject({
  where: z.lazy(() => UploadWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UploadUpdateWithoutLlmLogsInputSchema), z.lazy(() => UploadUncheckedUpdateWithoutLlmLogsInputSchema) ]),
});

export const UploadUpdateWithoutLlmLogsInputSchema: z.ZodType<Prisma.UploadUpdateWithoutLlmLogsInput> = z.strictObject({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  currency: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  generatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  windowDays: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  pages: z.lazy(() => PageUpdateManyWithoutUploadNestedInputSchema).optional(),
  keywords: z.lazy(() => KeywordUpdateManyWithoutUploadNestedInputSchema).optional(),
  competitors: z.lazy(() => CompetitorUpdateManyWithoutUploadNestedInputSchema).optional(),
  technicalIssues: z.lazy(() => TechnicalIssueUpdateManyWithoutUploadNestedInputSchema).optional(),
  actions: z.lazy(() => ActionUpdateManyWithoutUploadNestedInputSchema).optional(),
});

export const UploadUncheckedUpdateWithoutLlmLogsInputSchema: z.ZodType<Prisma.UploadUncheckedUpdateWithoutLlmLogsInput> = z.strictObject({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  currency: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  generatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  windowDays: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  pages: z.lazy(() => PageUncheckedUpdateManyWithoutUploadNestedInputSchema).optional(),
  keywords: z.lazy(() => KeywordUncheckedUpdateManyWithoutUploadNestedInputSchema).optional(),
  competitors: z.lazy(() => CompetitorUncheckedUpdateManyWithoutUploadNestedInputSchema).optional(),
  technicalIssues: z.lazy(() => TechnicalIssueUncheckedUpdateManyWithoutUploadNestedInputSchema).optional(),
  actions: z.lazy(() => ActionUncheckedUpdateManyWithoutUploadNestedInputSchema).optional(),
});

export const PageCreateManyUploadInputSchema: z.ZodType<Prisma.PageCreateManyUploadInput> = z.strictObject({
  id: z.cuid().optional(),
  sourceId: z.string(),
  url: z.string(),
  title: z.string(),
  metaDescription: z.string().optional().nullable(),
  targetKeyword: z.string().optional().nullable(),
  intent: z.string().optional().nullable(),
  audience: z.string().optional().nullable(),
  wordCount: z.number().int().optional().nullable(),
  publishedAt: z.coerce.date().optional().nullable(),
  lastModified: z.coerce.date().optional().nullable(),
  impressions: z.number().int().optional().nullable(),
  clicks: z.number().int().optional().nullable(),
  position: z.number().optional().nullable(),
  ctr: z.number().optional().nullable(),
  conversions: z.number().int().optional().nullable(),
  conversionRate: z.number().optional().nullable(),
});

export const KeywordCreateManyUploadInputSchema: z.ZodType<Prisma.KeywordCreateManyUploadInput> = z.strictObject({
  id: z.cuid().optional(),
  keyword: z.string(),
  monthlyVolume: z.number().int().optional().nullable(),
  difficulty: z.number().int().optional().nullable(),
  cpc: z.number().optional().nullable(),
  intent: z.string().optional().nullable(),
  audience: z.string().optional().nullable(),
  topCompetitor: z.string().optional().nullable(),
  currentlyRankingPageId: z.string().optional().nullable(),
});

export const CompetitorCreateManyUploadInputSchema: z.ZodType<Prisma.CompetitorCreateManyUploadInput> = z.strictObject({
  id: z.cuid().optional(),
  domain: z.string(),
  name: z.string().optional().nullable(),
  positioning: z.string().optional().nullable(),
  estimatedMonthlyTraffic: z.number().int().optional().nullable(),
  audience: z.string().optional().nullable(),
  topTopics: z.union([ z.lazy(() => CompetitorCreatetopTopicsInputSchema), z.string().array() ]).optional(),
  topContentGaps: z.union([ z.lazy(() => CompetitorCreatetopContentGapsInputSchema), z.string().array() ]).optional(),
});

export const TechnicalIssueCreateManyUploadInputSchema: z.ZodType<Prisma.TechnicalIssueCreateManyUploadInput> = z.strictObject({
  id: z.cuid().optional(),
  pageId: z.string(),
  type: z.string(),
  severity: z.string(),
  details: z.string(),
});

export const ActionCreateManyUploadInputSchema: z.ZodType<Prisma.ActionCreateManyUploadInput> = z.strictObject({
  id: z.cuid().optional(),
  type: z.string(),
  title: z.string(),
  reason: z.string(),
  evidence: z.string(),
  priority: z.string(),
  confidence: z.number().int(),
  status: z.string().optional(),
  rejectReason: z.string().optional().nullable(),
  payload: z.union([ z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema ]),
  createdAt: z.coerce.date().optional(),
});

export const LlmLogCreateManyUploadInputSchema: z.ZodType<Prisma.LlmLogCreateManyUploadInput> = z.strictObject({
  id: z.cuid().optional(),
  agentName: z.string(),
  prompt: z.string(),
  contextPayload: z.union([ z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema ]),
  rawOutput: z.string(),
  latencyMs: z.number().int(),
  createdAt: z.coerce.date().optional(),
});

export const PageUpdateWithoutUploadInputSchema: z.ZodType<Prisma.PageUpdateWithoutUploadInput> = z.strictObject({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sourceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  metaDescription: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  targetKeyword: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  intent: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  audience: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  wordCount: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  publishedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastModified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  impressions: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  clicks: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  position: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ctr: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  conversions: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  conversionRate: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  technicalIssues: z.lazy(() => TechnicalIssueUpdateManyWithoutPageNestedInputSchema).optional(),
  keywords: z.lazy(() => KeywordUpdateManyWithoutPageNestedInputSchema).optional(),
});

export const PageUncheckedUpdateWithoutUploadInputSchema: z.ZodType<Prisma.PageUncheckedUpdateWithoutUploadInput> = z.strictObject({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sourceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  metaDescription: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  targetKeyword: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  intent: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  audience: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  wordCount: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  publishedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastModified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  impressions: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  clicks: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  position: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ctr: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  conversions: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  conversionRate: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  technicalIssues: z.lazy(() => TechnicalIssueUncheckedUpdateManyWithoutPageNestedInputSchema).optional(),
  keywords: z.lazy(() => KeywordUncheckedUpdateManyWithoutPageNestedInputSchema).optional(),
});

export const PageUncheckedUpdateManyWithoutUploadInputSchema: z.ZodType<Prisma.PageUncheckedUpdateManyWithoutUploadInput> = z.strictObject({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sourceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  metaDescription: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  targetKeyword: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  intent: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  audience: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  wordCount: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  publishedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastModified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  impressions: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  clicks: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  position: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ctr: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  conversions: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  conversionRate: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const KeywordUpdateWithoutUploadInputSchema: z.ZodType<Prisma.KeywordUpdateWithoutUploadInput> = z.strictObject({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  keyword: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  monthlyVolume: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  difficulty: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  cpc: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  intent: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  audience: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  topCompetitor: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  page: z.lazy(() => PageUpdateOneWithoutKeywordsNestedInputSchema).optional(),
});

export const KeywordUncheckedUpdateWithoutUploadInputSchema: z.ZodType<Prisma.KeywordUncheckedUpdateWithoutUploadInput> = z.strictObject({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  keyword: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  monthlyVolume: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  difficulty: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  cpc: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  intent: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  audience: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  topCompetitor: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  currentlyRankingPageId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const KeywordUncheckedUpdateManyWithoutUploadInputSchema: z.ZodType<Prisma.KeywordUncheckedUpdateManyWithoutUploadInput> = z.strictObject({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  keyword: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  monthlyVolume: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  difficulty: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  cpc: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  intent: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  audience: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  topCompetitor: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  currentlyRankingPageId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const CompetitorUpdateWithoutUploadInputSchema: z.ZodType<Prisma.CompetitorUpdateWithoutUploadInput> = z.strictObject({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  domain: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  positioning: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  estimatedMonthlyTraffic: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  audience: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  topTopics: z.union([ z.lazy(() => CompetitorUpdatetopTopicsInputSchema), z.string().array() ]).optional(),
  topContentGaps: z.union([ z.lazy(() => CompetitorUpdatetopContentGapsInputSchema), z.string().array() ]).optional(),
});

export const CompetitorUncheckedUpdateWithoutUploadInputSchema: z.ZodType<Prisma.CompetitorUncheckedUpdateWithoutUploadInput> = z.strictObject({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  domain: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  positioning: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  estimatedMonthlyTraffic: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  audience: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  topTopics: z.union([ z.lazy(() => CompetitorUpdatetopTopicsInputSchema), z.string().array() ]).optional(),
  topContentGaps: z.union([ z.lazy(() => CompetitorUpdatetopContentGapsInputSchema), z.string().array() ]).optional(),
});

export const CompetitorUncheckedUpdateManyWithoutUploadInputSchema: z.ZodType<Prisma.CompetitorUncheckedUpdateManyWithoutUploadInput> = z.strictObject({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  domain: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  positioning: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  estimatedMonthlyTraffic: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  audience: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  topTopics: z.union([ z.lazy(() => CompetitorUpdatetopTopicsInputSchema), z.string().array() ]).optional(),
  topContentGaps: z.union([ z.lazy(() => CompetitorUpdatetopContentGapsInputSchema), z.string().array() ]).optional(),
});

export const TechnicalIssueUpdateWithoutUploadInputSchema: z.ZodType<Prisma.TechnicalIssueUpdateWithoutUploadInput> = z.strictObject({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  severity: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  details: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  page: z.lazy(() => PageUpdateOneRequiredWithoutTechnicalIssuesNestedInputSchema).optional(),
});

export const TechnicalIssueUncheckedUpdateWithoutUploadInputSchema: z.ZodType<Prisma.TechnicalIssueUncheckedUpdateWithoutUploadInput> = z.strictObject({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  pageId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  severity: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  details: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
});

export const TechnicalIssueUncheckedUpdateManyWithoutUploadInputSchema: z.ZodType<Prisma.TechnicalIssueUncheckedUpdateManyWithoutUploadInput> = z.strictObject({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  pageId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  severity: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  details: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
});

export const ActionUpdateWithoutUploadInputSchema: z.ZodType<Prisma.ActionUpdateWithoutUploadInput> = z.strictObject({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  reason: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  evidence: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  priority: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  confidence: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  rejectReason: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  payload: z.union([ z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const ActionUncheckedUpdateWithoutUploadInputSchema: z.ZodType<Prisma.ActionUncheckedUpdateWithoutUploadInput> = z.strictObject({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  reason: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  evidence: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  priority: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  confidence: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  rejectReason: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  payload: z.union([ z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const ActionUncheckedUpdateManyWithoutUploadInputSchema: z.ZodType<Prisma.ActionUncheckedUpdateManyWithoutUploadInput> = z.strictObject({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  reason: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  evidence: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  priority: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  confidence: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  rejectReason: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  payload: z.union([ z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const LlmLogUpdateWithoutUploadInputSchema: z.ZodType<Prisma.LlmLogUpdateWithoutUploadInput> = z.strictObject({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  agentName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  prompt: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  contextPayload: z.union([ z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
  rawOutput: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  latencyMs: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const LlmLogUncheckedUpdateWithoutUploadInputSchema: z.ZodType<Prisma.LlmLogUncheckedUpdateWithoutUploadInput> = z.strictObject({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  agentName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  prompt: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  contextPayload: z.union([ z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
  rawOutput: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  latencyMs: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const LlmLogUncheckedUpdateManyWithoutUploadInputSchema: z.ZodType<Prisma.LlmLogUncheckedUpdateManyWithoutUploadInput> = z.strictObject({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  agentName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  prompt: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  contextPayload: z.union([ z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
  rawOutput: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  latencyMs: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const TechnicalIssueCreateManyPageInputSchema: z.ZodType<Prisma.TechnicalIssueCreateManyPageInput> = z.strictObject({
  id: z.cuid().optional(),
  uploadId: z.string(),
  type: z.string(),
  severity: z.string(),
  details: z.string(),
});

export const KeywordCreateManyPageInputSchema: z.ZodType<Prisma.KeywordCreateManyPageInput> = z.strictObject({
  id: z.cuid().optional(),
  uploadId: z.string(),
  keyword: z.string(),
  monthlyVolume: z.number().int().optional().nullable(),
  difficulty: z.number().int().optional().nullable(),
  cpc: z.number().optional().nullable(),
  intent: z.string().optional().nullable(),
  audience: z.string().optional().nullable(),
  topCompetitor: z.string().optional().nullable(),
});

export const TechnicalIssueUpdateWithoutPageInputSchema: z.ZodType<Prisma.TechnicalIssueUpdateWithoutPageInput> = z.strictObject({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  severity: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  details: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  upload: z.lazy(() => UploadUpdateOneRequiredWithoutTechnicalIssuesNestedInputSchema).optional(),
});

export const TechnicalIssueUncheckedUpdateWithoutPageInputSchema: z.ZodType<Prisma.TechnicalIssueUncheckedUpdateWithoutPageInput> = z.strictObject({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  uploadId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  severity: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  details: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
});

export const TechnicalIssueUncheckedUpdateManyWithoutPageInputSchema: z.ZodType<Prisma.TechnicalIssueUncheckedUpdateManyWithoutPageInput> = z.strictObject({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  uploadId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  severity: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  details: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
});

export const KeywordUpdateWithoutPageInputSchema: z.ZodType<Prisma.KeywordUpdateWithoutPageInput> = z.strictObject({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  keyword: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  monthlyVolume: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  difficulty: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  cpc: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  intent: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  audience: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  topCompetitor: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  upload: z.lazy(() => UploadUpdateOneRequiredWithoutKeywordsNestedInputSchema).optional(),
});

export const KeywordUncheckedUpdateWithoutPageInputSchema: z.ZodType<Prisma.KeywordUncheckedUpdateWithoutPageInput> = z.strictObject({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  uploadId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  keyword: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  monthlyVolume: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  difficulty: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  cpc: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  intent: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  audience: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  topCompetitor: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const KeywordUncheckedUpdateManyWithoutPageInputSchema: z.ZodType<Prisma.KeywordUncheckedUpdateManyWithoutPageInput> = z.strictObject({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  uploadId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  keyword: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  monthlyVolume: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  difficulty: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  cpc: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  intent: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  audience: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  topCompetitor: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

/////////////////////////////////////////
// ARGS
/////////////////////////////////////////

export const UploadFindFirstArgsSchema: z.ZodType<Prisma.UploadFindFirstArgs> = z.object({
  select: UploadSelectSchema.optional(),
  include: UploadIncludeSchema.optional(),
  where: UploadWhereInputSchema.optional(), 
  orderBy: z.union([ UploadOrderByWithRelationInputSchema.array(), UploadOrderByWithRelationInputSchema ]).optional(),
  cursor: UploadWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UploadScalarFieldEnumSchema, UploadScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const UploadFindFirstOrThrowArgsSchema: z.ZodType<Prisma.UploadFindFirstOrThrowArgs> = z.object({
  select: UploadSelectSchema.optional(),
  include: UploadIncludeSchema.optional(),
  where: UploadWhereInputSchema.optional(), 
  orderBy: z.union([ UploadOrderByWithRelationInputSchema.array(), UploadOrderByWithRelationInputSchema ]).optional(),
  cursor: UploadWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UploadScalarFieldEnumSchema, UploadScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const UploadFindManyArgsSchema: z.ZodType<Prisma.UploadFindManyArgs> = z.object({
  select: UploadSelectSchema.optional(),
  include: UploadIncludeSchema.optional(),
  where: UploadWhereInputSchema.optional(), 
  orderBy: z.union([ UploadOrderByWithRelationInputSchema.array(), UploadOrderByWithRelationInputSchema ]).optional(),
  cursor: UploadWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UploadScalarFieldEnumSchema, UploadScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const UploadAggregateArgsSchema: z.ZodType<Prisma.UploadAggregateArgs> = z.object({
  where: UploadWhereInputSchema.optional(), 
  orderBy: z.union([ UploadOrderByWithRelationInputSchema.array(), UploadOrderByWithRelationInputSchema ]).optional(),
  cursor: UploadWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const UploadGroupByArgsSchema: z.ZodType<Prisma.UploadGroupByArgs> = z.object({
  where: UploadWhereInputSchema.optional(), 
  orderBy: z.union([ UploadOrderByWithAggregationInputSchema.array(), UploadOrderByWithAggregationInputSchema ]).optional(),
  by: UploadScalarFieldEnumSchema.array(), 
  having: UploadScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const UploadFindUniqueArgsSchema: z.ZodType<Prisma.UploadFindUniqueArgs> = z.object({
  select: UploadSelectSchema.optional(),
  include: UploadIncludeSchema.optional(),
  where: UploadWhereUniqueInputSchema, 
}).strict();

export const UploadFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.UploadFindUniqueOrThrowArgs> = z.object({
  select: UploadSelectSchema.optional(),
  include: UploadIncludeSchema.optional(),
  where: UploadWhereUniqueInputSchema, 
}).strict();

export const PageFindFirstArgsSchema: z.ZodType<Prisma.PageFindFirstArgs> = z.object({
  select: PageSelectSchema.optional(),
  include: PageIncludeSchema.optional(),
  where: PageWhereInputSchema.optional(), 
  orderBy: z.union([ PageOrderByWithRelationInputSchema.array(), PageOrderByWithRelationInputSchema ]).optional(),
  cursor: PageWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PageScalarFieldEnumSchema, PageScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const PageFindFirstOrThrowArgsSchema: z.ZodType<Prisma.PageFindFirstOrThrowArgs> = z.object({
  select: PageSelectSchema.optional(),
  include: PageIncludeSchema.optional(),
  where: PageWhereInputSchema.optional(), 
  orderBy: z.union([ PageOrderByWithRelationInputSchema.array(), PageOrderByWithRelationInputSchema ]).optional(),
  cursor: PageWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PageScalarFieldEnumSchema, PageScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const PageFindManyArgsSchema: z.ZodType<Prisma.PageFindManyArgs> = z.object({
  select: PageSelectSchema.optional(),
  include: PageIncludeSchema.optional(),
  where: PageWhereInputSchema.optional(), 
  orderBy: z.union([ PageOrderByWithRelationInputSchema.array(), PageOrderByWithRelationInputSchema ]).optional(),
  cursor: PageWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PageScalarFieldEnumSchema, PageScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const PageAggregateArgsSchema: z.ZodType<Prisma.PageAggregateArgs> = z.object({
  where: PageWhereInputSchema.optional(), 
  orderBy: z.union([ PageOrderByWithRelationInputSchema.array(), PageOrderByWithRelationInputSchema ]).optional(),
  cursor: PageWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const PageGroupByArgsSchema: z.ZodType<Prisma.PageGroupByArgs> = z.object({
  where: PageWhereInputSchema.optional(), 
  orderBy: z.union([ PageOrderByWithAggregationInputSchema.array(), PageOrderByWithAggregationInputSchema ]).optional(),
  by: PageScalarFieldEnumSchema.array(), 
  having: PageScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const PageFindUniqueArgsSchema: z.ZodType<Prisma.PageFindUniqueArgs> = z.object({
  select: PageSelectSchema.optional(),
  include: PageIncludeSchema.optional(),
  where: PageWhereUniqueInputSchema, 
}).strict();

export const PageFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.PageFindUniqueOrThrowArgs> = z.object({
  select: PageSelectSchema.optional(),
  include: PageIncludeSchema.optional(),
  where: PageWhereUniqueInputSchema, 
}).strict();

export const KeywordFindFirstArgsSchema: z.ZodType<Prisma.KeywordFindFirstArgs> = z.object({
  select: KeywordSelectSchema.optional(),
  include: KeywordIncludeSchema.optional(),
  where: KeywordWhereInputSchema.optional(), 
  orderBy: z.union([ KeywordOrderByWithRelationInputSchema.array(), KeywordOrderByWithRelationInputSchema ]).optional(),
  cursor: KeywordWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ KeywordScalarFieldEnumSchema, KeywordScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const KeywordFindFirstOrThrowArgsSchema: z.ZodType<Prisma.KeywordFindFirstOrThrowArgs> = z.object({
  select: KeywordSelectSchema.optional(),
  include: KeywordIncludeSchema.optional(),
  where: KeywordWhereInputSchema.optional(), 
  orderBy: z.union([ KeywordOrderByWithRelationInputSchema.array(), KeywordOrderByWithRelationInputSchema ]).optional(),
  cursor: KeywordWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ KeywordScalarFieldEnumSchema, KeywordScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const KeywordFindManyArgsSchema: z.ZodType<Prisma.KeywordFindManyArgs> = z.object({
  select: KeywordSelectSchema.optional(),
  include: KeywordIncludeSchema.optional(),
  where: KeywordWhereInputSchema.optional(), 
  orderBy: z.union([ KeywordOrderByWithRelationInputSchema.array(), KeywordOrderByWithRelationInputSchema ]).optional(),
  cursor: KeywordWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ KeywordScalarFieldEnumSchema, KeywordScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const KeywordAggregateArgsSchema: z.ZodType<Prisma.KeywordAggregateArgs> = z.object({
  where: KeywordWhereInputSchema.optional(), 
  orderBy: z.union([ KeywordOrderByWithRelationInputSchema.array(), KeywordOrderByWithRelationInputSchema ]).optional(),
  cursor: KeywordWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const KeywordGroupByArgsSchema: z.ZodType<Prisma.KeywordGroupByArgs> = z.object({
  where: KeywordWhereInputSchema.optional(), 
  orderBy: z.union([ KeywordOrderByWithAggregationInputSchema.array(), KeywordOrderByWithAggregationInputSchema ]).optional(),
  by: KeywordScalarFieldEnumSchema.array(), 
  having: KeywordScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const KeywordFindUniqueArgsSchema: z.ZodType<Prisma.KeywordFindUniqueArgs> = z.object({
  select: KeywordSelectSchema.optional(),
  include: KeywordIncludeSchema.optional(),
  where: KeywordWhereUniqueInputSchema, 
}).strict();

export const KeywordFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.KeywordFindUniqueOrThrowArgs> = z.object({
  select: KeywordSelectSchema.optional(),
  include: KeywordIncludeSchema.optional(),
  where: KeywordWhereUniqueInputSchema, 
}).strict();

export const CompetitorFindFirstArgsSchema: z.ZodType<Prisma.CompetitorFindFirstArgs> = z.object({
  select: CompetitorSelectSchema.optional(),
  include: CompetitorIncludeSchema.optional(),
  where: CompetitorWhereInputSchema.optional(), 
  orderBy: z.union([ CompetitorOrderByWithRelationInputSchema.array(), CompetitorOrderByWithRelationInputSchema ]).optional(),
  cursor: CompetitorWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CompetitorScalarFieldEnumSchema, CompetitorScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const CompetitorFindFirstOrThrowArgsSchema: z.ZodType<Prisma.CompetitorFindFirstOrThrowArgs> = z.object({
  select: CompetitorSelectSchema.optional(),
  include: CompetitorIncludeSchema.optional(),
  where: CompetitorWhereInputSchema.optional(), 
  orderBy: z.union([ CompetitorOrderByWithRelationInputSchema.array(), CompetitorOrderByWithRelationInputSchema ]).optional(),
  cursor: CompetitorWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CompetitorScalarFieldEnumSchema, CompetitorScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const CompetitorFindManyArgsSchema: z.ZodType<Prisma.CompetitorFindManyArgs> = z.object({
  select: CompetitorSelectSchema.optional(),
  include: CompetitorIncludeSchema.optional(),
  where: CompetitorWhereInputSchema.optional(), 
  orderBy: z.union([ CompetitorOrderByWithRelationInputSchema.array(), CompetitorOrderByWithRelationInputSchema ]).optional(),
  cursor: CompetitorWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CompetitorScalarFieldEnumSchema, CompetitorScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const CompetitorAggregateArgsSchema: z.ZodType<Prisma.CompetitorAggregateArgs> = z.object({
  where: CompetitorWhereInputSchema.optional(), 
  orderBy: z.union([ CompetitorOrderByWithRelationInputSchema.array(), CompetitorOrderByWithRelationInputSchema ]).optional(),
  cursor: CompetitorWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const CompetitorGroupByArgsSchema: z.ZodType<Prisma.CompetitorGroupByArgs> = z.object({
  where: CompetitorWhereInputSchema.optional(), 
  orderBy: z.union([ CompetitorOrderByWithAggregationInputSchema.array(), CompetitorOrderByWithAggregationInputSchema ]).optional(),
  by: CompetitorScalarFieldEnumSchema.array(), 
  having: CompetitorScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const CompetitorFindUniqueArgsSchema: z.ZodType<Prisma.CompetitorFindUniqueArgs> = z.object({
  select: CompetitorSelectSchema.optional(),
  include: CompetitorIncludeSchema.optional(),
  where: CompetitorWhereUniqueInputSchema, 
}).strict();

export const CompetitorFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.CompetitorFindUniqueOrThrowArgs> = z.object({
  select: CompetitorSelectSchema.optional(),
  include: CompetitorIncludeSchema.optional(),
  where: CompetitorWhereUniqueInputSchema, 
}).strict();

export const TechnicalIssueFindFirstArgsSchema: z.ZodType<Prisma.TechnicalIssueFindFirstArgs> = z.object({
  select: TechnicalIssueSelectSchema.optional(),
  include: TechnicalIssueIncludeSchema.optional(),
  where: TechnicalIssueWhereInputSchema.optional(), 
  orderBy: z.union([ TechnicalIssueOrderByWithRelationInputSchema.array(), TechnicalIssueOrderByWithRelationInputSchema ]).optional(),
  cursor: TechnicalIssueWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TechnicalIssueScalarFieldEnumSchema, TechnicalIssueScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const TechnicalIssueFindFirstOrThrowArgsSchema: z.ZodType<Prisma.TechnicalIssueFindFirstOrThrowArgs> = z.object({
  select: TechnicalIssueSelectSchema.optional(),
  include: TechnicalIssueIncludeSchema.optional(),
  where: TechnicalIssueWhereInputSchema.optional(), 
  orderBy: z.union([ TechnicalIssueOrderByWithRelationInputSchema.array(), TechnicalIssueOrderByWithRelationInputSchema ]).optional(),
  cursor: TechnicalIssueWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TechnicalIssueScalarFieldEnumSchema, TechnicalIssueScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const TechnicalIssueFindManyArgsSchema: z.ZodType<Prisma.TechnicalIssueFindManyArgs> = z.object({
  select: TechnicalIssueSelectSchema.optional(),
  include: TechnicalIssueIncludeSchema.optional(),
  where: TechnicalIssueWhereInputSchema.optional(), 
  orderBy: z.union([ TechnicalIssueOrderByWithRelationInputSchema.array(), TechnicalIssueOrderByWithRelationInputSchema ]).optional(),
  cursor: TechnicalIssueWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TechnicalIssueScalarFieldEnumSchema, TechnicalIssueScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const TechnicalIssueAggregateArgsSchema: z.ZodType<Prisma.TechnicalIssueAggregateArgs> = z.object({
  where: TechnicalIssueWhereInputSchema.optional(), 
  orderBy: z.union([ TechnicalIssueOrderByWithRelationInputSchema.array(), TechnicalIssueOrderByWithRelationInputSchema ]).optional(),
  cursor: TechnicalIssueWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const TechnicalIssueGroupByArgsSchema: z.ZodType<Prisma.TechnicalIssueGroupByArgs> = z.object({
  where: TechnicalIssueWhereInputSchema.optional(), 
  orderBy: z.union([ TechnicalIssueOrderByWithAggregationInputSchema.array(), TechnicalIssueOrderByWithAggregationInputSchema ]).optional(),
  by: TechnicalIssueScalarFieldEnumSchema.array(), 
  having: TechnicalIssueScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const TechnicalIssueFindUniqueArgsSchema: z.ZodType<Prisma.TechnicalIssueFindUniqueArgs> = z.object({
  select: TechnicalIssueSelectSchema.optional(),
  include: TechnicalIssueIncludeSchema.optional(),
  where: TechnicalIssueWhereUniqueInputSchema, 
}).strict();

export const TechnicalIssueFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.TechnicalIssueFindUniqueOrThrowArgs> = z.object({
  select: TechnicalIssueSelectSchema.optional(),
  include: TechnicalIssueIncludeSchema.optional(),
  where: TechnicalIssueWhereUniqueInputSchema, 
}).strict();

export const ActionFindFirstArgsSchema: z.ZodType<Prisma.ActionFindFirstArgs> = z.object({
  select: ActionSelectSchema.optional(),
  include: ActionIncludeSchema.optional(),
  where: ActionWhereInputSchema.optional(), 
  orderBy: z.union([ ActionOrderByWithRelationInputSchema.array(), ActionOrderByWithRelationInputSchema ]).optional(),
  cursor: ActionWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ActionScalarFieldEnumSchema, ActionScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const ActionFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ActionFindFirstOrThrowArgs> = z.object({
  select: ActionSelectSchema.optional(),
  include: ActionIncludeSchema.optional(),
  where: ActionWhereInputSchema.optional(), 
  orderBy: z.union([ ActionOrderByWithRelationInputSchema.array(), ActionOrderByWithRelationInputSchema ]).optional(),
  cursor: ActionWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ActionScalarFieldEnumSchema, ActionScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const ActionFindManyArgsSchema: z.ZodType<Prisma.ActionFindManyArgs> = z.object({
  select: ActionSelectSchema.optional(),
  include: ActionIncludeSchema.optional(),
  where: ActionWhereInputSchema.optional(), 
  orderBy: z.union([ ActionOrderByWithRelationInputSchema.array(), ActionOrderByWithRelationInputSchema ]).optional(),
  cursor: ActionWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ActionScalarFieldEnumSchema, ActionScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const ActionAggregateArgsSchema: z.ZodType<Prisma.ActionAggregateArgs> = z.object({
  where: ActionWhereInputSchema.optional(), 
  orderBy: z.union([ ActionOrderByWithRelationInputSchema.array(), ActionOrderByWithRelationInputSchema ]).optional(),
  cursor: ActionWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const ActionGroupByArgsSchema: z.ZodType<Prisma.ActionGroupByArgs> = z.object({
  where: ActionWhereInputSchema.optional(), 
  orderBy: z.union([ ActionOrderByWithAggregationInputSchema.array(), ActionOrderByWithAggregationInputSchema ]).optional(),
  by: ActionScalarFieldEnumSchema.array(), 
  having: ActionScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const ActionFindUniqueArgsSchema: z.ZodType<Prisma.ActionFindUniqueArgs> = z.object({
  select: ActionSelectSchema.optional(),
  include: ActionIncludeSchema.optional(),
  where: ActionWhereUniqueInputSchema, 
}).strict();

export const ActionFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ActionFindUniqueOrThrowArgs> = z.object({
  select: ActionSelectSchema.optional(),
  include: ActionIncludeSchema.optional(),
  where: ActionWhereUniqueInputSchema, 
}).strict();

export const LlmLogFindFirstArgsSchema: z.ZodType<Prisma.LlmLogFindFirstArgs> = z.object({
  select: LlmLogSelectSchema.optional(),
  include: LlmLogIncludeSchema.optional(),
  where: LlmLogWhereInputSchema.optional(), 
  orderBy: z.union([ LlmLogOrderByWithRelationInputSchema.array(), LlmLogOrderByWithRelationInputSchema ]).optional(),
  cursor: LlmLogWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ LlmLogScalarFieldEnumSchema, LlmLogScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const LlmLogFindFirstOrThrowArgsSchema: z.ZodType<Prisma.LlmLogFindFirstOrThrowArgs> = z.object({
  select: LlmLogSelectSchema.optional(),
  include: LlmLogIncludeSchema.optional(),
  where: LlmLogWhereInputSchema.optional(), 
  orderBy: z.union([ LlmLogOrderByWithRelationInputSchema.array(), LlmLogOrderByWithRelationInputSchema ]).optional(),
  cursor: LlmLogWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ LlmLogScalarFieldEnumSchema, LlmLogScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const LlmLogFindManyArgsSchema: z.ZodType<Prisma.LlmLogFindManyArgs> = z.object({
  select: LlmLogSelectSchema.optional(),
  include: LlmLogIncludeSchema.optional(),
  where: LlmLogWhereInputSchema.optional(), 
  orderBy: z.union([ LlmLogOrderByWithRelationInputSchema.array(), LlmLogOrderByWithRelationInputSchema ]).optional(),
  cursor: LlmLogWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ LlmLogScalarFieldEnumSchema, LlmLogScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const LlmLogAggregateArgsSchema: z.ZodType<Prisma.LlmLogAggregateArgs> = z.object({
  where: LlmLogWhereInputSchema.optional(), 
  orderBy: z.union([ LlmLogOrderByWithRelationInputSchema.array(), LlmLogOrderByWithRelationInputSchema ]).optional(),
  cursor: LlmLogWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const LlmLogGroupByArgsSchema: z.ZodType<Prisma.LlmLogGroupByArgs> = z.object({
  where: LlmLogWhereInputSchema.optional(), 
  orderBy: z.union([ LlmLogOrderByWithAggregationInputSchema.array(), LlmLogOrderByWithAggregationInputSchema ]).optional(),
  by: LlmLogScalarFieldEnumSchema.array(), 
  having: LlmLogScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const LlmLogFindUniqueArgsSchema: z.ZodType<Prisma.LlmLogFindUniqueArgs> = z.object({
  select: LlmLogSelectSchema.optional(),
  include: LlmLogIncludeSchema.optional(),
  where: LlmLogWhereUniqueInputSchema, 
}).strict();

export const LlmLogFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.LlmLogFindUniqueOrThrowArgs> = z.object({
  select: LlmLogSelectSchema.optional(),
  include: LlmLogIncludeSchema.optional(),
  where: LlmLogWhereUniqueInputSchema, 
}).strict();

export const UploadCreateArgsSchema: z.ZodType<Prisma.UploadCreateArgs> = z.object({
  select: UploadSelectSchema.optional(),
  include: UploadIncludeSchema.optional(),
  data: z.union([ UploadCreateInputSchema, UploadUncheckedCreateInputSchema ]),
}).strict();

export const UploadUpsertArgsSchema: z.ZodType<Prisma.UploadUpsertArgs> = z.object({
  select: UploadSelectSchema.optional(),
  include: UploadIncludeSchema.optional(),
  where: UploadWhereUniqueInputSchema, 
  create: z.union([ UploadCreateInputSchema, UploadUncheckedCreateInputSchema ]),
  update: z.union([ UploadUpdateInputSchema, UploadUncheckedUpdateInputSchema ]),
}).strict();

export const UploadCreateManyArgsSchema: z.ZodType<Prisma.UploadCreateManyArgs> = z.object({
  data: z.union([ UploadCreateManyInputSchema, UploadCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const UploadCreateManyAndReturnArgsSchema: z.ZodType<Prisma.UploadCreateManyAndReturnArgs> = z.object({
  data: z.union([ UploadCreateManyInputSchema, UploadCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const UploadDeleteArgsSchema: z.ZodType<Prisma.UploadDeleteArgs> = z.object({
  select: UploadSelectSchema.optional(),
  include: UploadIncludeSchema.optional(),
  where: UploadWhereUniqueInputSchema, 
}).strict();

export const UploadUpdateArgsSchema: z.ZodType<Prisma.UploadUpdateArgs> = z.object({
  select: UploadSelectSchema.optional(),
  include: UploadIncludeSchema.optional(),
  data: z.union([ UploadUpdateInputSchema, UploadUncheckedUpdateInputSchema ]),
  where: UploadWhereUniqueInputSchema, 
}).strict();

export const UploadUpdateManyArgsSchema: z.ZodType<Prisma.UploadUpdateManyArgs> = z.object({
  data: z.union([ UploadUpdateManyMutationInputSchema, UploadUncheckedUpdateManyInputSchema ]),
  where: UploadWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const UploadUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.UploadUpdateManyAndReturnArgs> = z.object({
  data: z.union([ UploadUpdateManyMutationInputSchema, UploadUncheckedUpdateManyInputSchema ]),
  where: UploadWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const UploadDeleteManyArgsSchema: z.ZodType<Prisma.UploadDeleteManyArgs> = z.object({
  where: UploadWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const PageCreateArgsSchema: z.ZodType<Prisma.PageCreateArgs> = z.object({
  select: PageSelectSchema.optional(),
  include: PageIncludeSchema.optional(),
  data: z.union([ PageCreateInputSchema, PageUncheckedCreateInputSchema ]),
}).strict();

export const PageUpsertArgsSchema: z.ZodType<Prisma.PageUpsertArgs> = z.object({
  select: PageSelectSchema.optional(),
  include: PageIncludeSchema.optional(),
  where: PageWhereUniqueInputSchema, 
  create: z.union([ PageCreateInputSchema, PageUncheckedCreateInputSchema ]),
  update: z.union([ PageUpdateInputSchema, PageUncheckedUpdateInputSchema ]),
}).strict();

export const PageCreateManyArgsSchema: z.ZodType<Prisma.PageCreateManyArgs> = z.object({
  data: z.union([ PageCreateManyInputSchema, PageCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const PageCreateManyAndReturnArgsSchema: z.ZodType<Prisma.PageCreateManyAndReturnArgs> = z.object({
  data: z.union([ PageCreateManyInputSchema, PageCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const PageDeleteArgsSchema: z.ZodType<Prisma.PageDeleteArgs> = z.object({
  select: PageSelectSchema.optional(),
  include: PageIncludeSchema.optional(),
  where: PageWhereUniqueInputSchema, 
}).strict();

export const PageUpdateArgsSchema: z.ZodType<Prisma.PageUpdateArgs> = z.object({
  select: PageSelectSchema.optional(),
  include: PageIncludeSchema.optional(),
  data: z.union([ PageUpdateInputSchema, PageUncheckedUpdateInputSchema ]),
  where: PageWhereUniqueInputSchema, 
}).strict();

export const PageUpdateManyArgsSchema: z.ZodType<Prisma.PageUpdateManyArgs> = z.object({
  data: z.union([ PageUpdateManyMutationInputSchema, PageUncheckedUpdateManyInputSchema ]),
  where: PageWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const PageUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.PageUpdateManyAndReturnArgs> = z.object({
  data: z.union([ PageUpdateManyMutationInputSchema, PageUncheckedUpdateManyInputSchema ]),
  where: PageWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const PageDeleteManyArgsSchema: z.ZodType<Prisma.PageDeleteManyArgs> = z.object({
  where: PageWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const KeywordCreateArgsSchema: z.ZodType<Prisma.KeywordCreateArgs> = z.object({
  select: KeywordSelectSchema.optional(),
  include: KeywordIncludeSchema.optional(),
  data: z.union([ KeywordCreateInputSchema, KeywordUncheckedCreateInputSchema ]),
}).strict();

export const KeywordUpsertArgsSchema: z.ZodType<Prisma.KeywordUpsertArgs> = z.object({
  select: KeywordSelectSchema.optional(),
  include: KeywordIncludeSchema.optional(),
  where: KeywordWhereUniqueInputSchema, 
  create: z.union([ KeywordCreateInputSchema, KeywordUncheckedCreateInputSchema ]),
  update: z.union([ KeywordUpdateInputSchema, KeywordUncheckedUpdateInputSchema ]),
}).strict();

export const KeywordCreateManyArgsSchema: z.ZodType<Prisma.KeywordCreateManyArgs> = z.object({
  data: z.union([ KeywordCreateManyInputSchema, KeywordCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const KeywordCreateManyAndReturnArgsSchema: z.ZodType<Prisma.KeywordCreateManyAndReturnArgs> = z.object({
  data: z.union([ KeywordCreateManyInputSchema, KeywordCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const KeywordDeleteArgsSchema: z.ZodType<Prisma.KeywordDeleteArgs> = z.object({
  select: KeywordSelectSchema.optional(),
  include: KeywordIncludeSchema.optional(),
  where: KeywordWhereUniqueInputSchema, 
}).strict();

export const KeywordUpdateArgsSchema: z.ZodType<Prisma.KeywordUpdateArgs> = z.object({
  select: KeywordSelectSchema.optional(),
  include: KeywordIncludeSchema.optional(),
  data: z.union([ KeywordUpdateInputSchema, KeywordUncheckedUpdateInputSchema ]),
  where: KeywordWhereUniqueInputSchema, 
}).strict();

export const KeywordUpdateManyArgsSchema: z.ZodType<Prisma.KeywordUpdateManyArgs> = z.object({
  data: z.union([ KeywordUpdateManyMutationInputSchema, KeywordUncheckedUpdateManyInputSchema ]),
  where: KeywordWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const KeywordUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.KeywordUpdateManyAndReturnArgs> = z.object({
  data: z.union([ KeywordUpdateManyMutationInputSchema, KeywordUncheckedUpdateManyInputSchema ]),
  where: KeywordWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const KeywordDeleteManyArgsSchema: z.ZodType<Prisma.KeywordDeleteManyArgs> = z.object({
  where: KeywordWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const CompetitorCreateArgsSchema: z.ZodType<Prisma.CompetitorCreateArgs> = z.object({
  select: CompetitorSelectSchema.optional(),
  include: CompetitorIncludeSchema.optional(),
  data: z.union([ CompetitorCreateInputSchema, CompetitorUncheckedCreateInputSchema ]),
}).strict();

export const CompetitorUpsertArgsSchema: z.ZodType<Prisma.CompetitorUpsertArgs> = z.object({
  select: CompetitorSelectSchema.optional(),
  include: CompetitorIncludeSchema.optional(),
  where: CompetitorWhereUniqueInputSchema, 
  create: z.union([ CompetitorCreateInputSchema, CompetitorUncheckedCreateInputSchema ]),
  update: z.union([ CompetitorUpdateInputSchema, CompetitorUncheckedUpdateInputSchema ]),
}).strict();

export const CompetitorCreateManyArgsSchema: z.ZodType<Prisma.CompetitorCreateManyArgs> = z.object({
  data: z.union([ CompetitorCreateManyInputSchema, CompetitorCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const CompetitorCreateManyAndReturnArgsSchema: z.ZodType<Prisma.CompetitorCreateManyAndReturnArgs> = z.object({
  data: z.union([ CompetitorCreateManyInputSchema, CompetitorCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const CompetitorDeleteArgsSchema: z.ZodType<Prisma.CompetitorDeleteArgs> = z.object({
  select: CompetitorSelectSchema.optional(),
  include: CompetitorIncludeSchema.optional(),
  where: CompetitorWhereUniqueInputSchema, 
}).strict();

export const CompetitorUpdateArgsSchema: z.ZodType<Prisma.CompetitorUpdateArgs> = z.object({
  select: CompetitorSelectSchema.optional(),
  include: CompetitorIncludeSchema.optional(),
  data: z.union([ CompetitorUpdateInputSchema, CompetitorUncheckedUpdateInputSchema ]),
  where: CompetitorWhereUniqueInputSchema, 
}).strict();

export const CompetitorUpdateManyArgsSchema: z.ZodType<Prisma.CompetitorUpdateManyArgs> = z.object({
  data: z.union([ CompetitorUpdateManyMutationInputSchema, CompetitorUncheckedUpdateManyInputSchema ]),
  where: CompetitorWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const CompetitorUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.CompetitorUpdateManyAndReturnArgs> = z.object({
  data: z.union([ CompetitorUpdateManyMutationInputSchema, CompetitorUncheckedUpdateManyInputSchema ]),
  where: CompetitorWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const CompetitorDeleteManyArgsSchema: z.ZodType<Prisma.CompetitorDeleteManyArgs> = z.object({
  where: CompetitorWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const TechnicalIssueCreateArgsSchema: z.ZodType<Prisma.TechnicalIssueCreateArgs> = z.object({
  select: TechnicalIssueSelectSchema.optional(),
  include: TechnicalIssueIncludeSchema.optional(),
  data: z.union([ TechnicalIssueCreateInputSchema, TechnicalIssueUncheckedCreateInputSchema ]),
}).strict();

export const TechnicalIssueUpsertArgsSchema: z.ZodType<Prisma.TechnicalIssueUpsertArgs> = z.object({
  select: TechnicalIssueSelectSchema.optional(),
  include: TechnicalIssueIncludeSchema.optional(),
  where: TechnicalIssueWhereUniqueInputSchema, 
  create: z.union([ TechnicalIssueCreateInputSchema, TechnicalIssueUncheckedCreateInputSchema ]),
  update: z.union([ TechnicalIssueUpdateInputSchema, TechnicalIssueUncheckedUpdateInputSchema ]),
}).strict();

export const TechnicalIssueCreateManyArgsSchema: z.ZodType<Prisma.TechnicalIssueCreateManyArgs> = z.object({
  data: z.union([ TechnicalIssueCreateManyInputSchema, TechnicalIssueCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const TechnicalIssueCreateManyAndReturnArgsSchema: z.ZodType<Prisma.TechnicalIssueCreateManyAndReturnArgs> = z.object({
  data: z.union([ TechnicalIssueCreateManyInputSchema, TechnicalIssueCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const TechnicalIssueDeleteArgsSchema: z.ZodType<Prisma.TechnicalIssueDeleteArgs> = z.object({
  select: TechnicalIssueSelectSchema.optional(),
  include: TechnicalIssueIncludeSchema.optional(),
  where: TechnicalIssueWhereUniqueInputSchema, 
}).strict();

export const TechnicalIssueUpdateArgsSchema: z.ZodType<Prisma.TechnicalIssueUpdateArgs> = z.object({
  select: TechnicalIssueSelectSchema.optional(),
  include: TechnicalIssueIncludeSchema.optional(),
  data: z.union([ TechnicalIssueUpdateInputSchema, TechnicalIssueUncheckedUpdateInputSchema ]),
  where: TechnicalIssueWhereUniqueInputSchema, 
}).strict();

export const TechnicalIssueUpdateManyArgsSchema: z.ZodType<Prisma.TechnicalIssueUpdateManyArgs> = z.object({
  data: z.union([ TechnicalIssueUpdateManyMutationInputSchema, TechnicalIssueUncheckedUpdateManyInputSchema ]),
  where: TechnicalIssueWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const TechnicalIssueUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.TechnicalIssueUpdateManyAndReturnArgs> = z.object({
  data: z.union([ TechnicalIssueUpdateManyMutationInputSchema, TechnicalIssueUncheckedUpdateManyInputSchema ]),
  where: TechnicalIssueWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const TechnicalIssueDeleteManyArgsSchema: z.ZodType<Prisma.TechnicalIssueDeleteManyArgs> = z.object({
  where: TechnicalIssueWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const ActionCreateArgsSchema: z.ZodType<Prisma.ActionCreateArgs> = z.object({
  select: ActionSelectSchema.optional(),
  include: ActionIncludeSchema.optional(),
  data: z.union([ ActionCreateInputSchema, ActionUncheckedCreateInputSchema ]),
}).strict();

export const ActionUpsertArgsSchema: z.ZodType<Prisma.ActionUpsertArgs> = z.object({
  select: ActionSelectSchema.optional(),
  include: ActionIncludeSchema.optional(),
  where: ActionWhereUniqueInputSchema, 
  create: z.union([ ActionCreateInputSchema, ActionUncheckedCreateInputSchema ]),
  update: z.union([ ActionUpdateInputSchema, ActionUncheckedUpdateInputSchema ]),
}).strict();

export const ActionCreateManyArgsSchema: z.ZodType<Prisma.ActionCreateManyArgs> = z.object({
  data: z.union([ ActionCreateManyInputSchema, ActionCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const ActionCreateManyAndReturnArgsSchema: z.ZodType<Prisma.ActionCreateManyAndReturnArgs> = z.object({
  data: z.union([ ActionCreateManyInputSchema, ActionCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const ActionDeleteArgsSchema: z.ZodType<Prisma.ActionDeleteArgs> = z.object({
  select: ActionSelectSchema.optional(),
  include: ActionIncludeSchema.optional(),
  where: ActionWhereUniqueInputSchema, 
}).strict();

export const ActionUpdateArgsSchema: z.ZodType<Prisma.ActionUpdateArgs> = z.object({
  select: ActionSelectSchema.optional(),
  include: ActionIncludeSchema.optional(),
  data: z.union([ ActionUpdateInputSchema, ActionUncheckedUpdateInputSchema ]),
  where: ActionWhereUniqueInputSchema, 
}).strict();

export const ActionUpdateManyArgsSchema: z.ZodType<Prisma.ActionUpdateManyArgs> = z.object({
  data: z.union([ ActionUpdateManyMutationInputSchema, ActionUncheckedUpdateManyInputSchema ]),
  where: ActionWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const ActionUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.ActionUpdateManyAndReturnArgs> = z.object({
  data: z.union([ ActionUpdateManyMutationInputSchema, ActionUncheckedUpdateManyInputSchema ]),
  where: ActionWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const ActionDeleteManyArgsSchema: z.ZodType<Prisma.ActionDeleteManyArgs> = z.object({
  where: ActionWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const LlmLogCreateArgsSchema: z.ZodType<Prisma.LlmLogCreateArgs> = z.object({
  select: LlmLogSelectSchema.optional(),
  include: LlmLogIncludeSchema.optional(),
  data: z.union([ LlmLogCreateInputSchema, LlmLogUncheckedCreateInputSchema ]),
}).strict();

export const LlmLogUpsertArgsSchema: z.ZodType<Prisma.LlmLogUpsertArgs> = z.object({
  select: LlmLogSelectSchema.optional(),
  include: LlmLogIncludeSchema.optional(),
  where: LlmLogWhereUniqueInputSchema, 
  create: z.union([ LlmLogCreateInputSchema, LlmLogUncheckedCreateInputSchema ]),
  update: z.union([ LlmLogUpdateInputSchema, LlmLogUncheckedUpdateInputSchema ]),
}).strict();

export const LlmLogCreateManyArgsSchema: z.ZodType<Prisma.LlmLogCreateManyArgs> = z.object({
  data: z.union([ LlmLogCreateManyInputSchema, LlmLogCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const LlmLogCreateManyAndReturnArgsSchema: z.ZodType<Prisma.LlmLogCreateManyAndReturnArgs> = z.object({
  data: z.union([ LlmLogCreateManyInputSchema, LlmLogCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const LlmLogDeleteArgsSchema: z.ZodType<Prisma.LlmLogDeleteArgs> = z.object({
  select: LlmLogSelectSchema.optional(),
  include: LlmLogIncludeSchema.optional(),
  where: LlmLogWhereUniqueInputSchema, 
}).strict();

export const LlmLogUpdateArgsSchema: z.ZodType<Prisma.LlmLogUpdateArgs> = z.object({
  select: LlmLogSelectSchema.optional(),
  include: LlmLogIncludeSchema.optional(),
  data: z.union([ LlmLogUpdateInputSchema, LlmLogUncheckedUpdateInputSchema ]),
  where: LlmLogWhereUniqueInputSchema, 
}).strict();

export const LlmLogUpdateManyArgsSchema: z.ZodType<Prisma.LlmLogUpdateManyArgs> = z.object({
  data: z.union([ LlmLogUpdateManyMutationInputSchema, LlmLogUncheckedUpdateManyInputSchema ]),
  where: LlmLogWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const LlmLogUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.LlmLogUpdateManyAndReturnArgs> = z.object({
  data: z.union([ LlmLogUpdateManyMutationInputSchema, LlmLogUncheckedUpdateManyInputSchema ]),
  where: LlmLogWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const LlmLogDeleteManyArgsSchema: z.ZodType<Prisma.LlmLogDeleteManyArgs> = z.object({
  where: LlmLogWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();