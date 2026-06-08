"use server";

import { UploadInputSchema } from "@/types";
import { prisma } from "@/lib/prisma";
import { Page } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";
import { runAllSignals } from "@/signals";


export async function uploadDataAction(data: unknown) {
  try {
    // If the JSON payload has a _meta object, hoist its properties to the root level
    // so it matches the Zod schema expectation.
    if (typeof data === 'object' && data !== null && '_meta' in data) {
      Object.assign(data, (data as { _meta?: unknown })._meta);
    }

    const parsed = UploadInputSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: "Validation failed: " + JSON.stringify(parsed.error.issues) };
    }

    const { userId: _authUserId } = await auth();
    if (!_authUserId) {
      return { success: false, error: "Unauthorized" };
    }

    const { pages, keywords, competitors, technicalIssues, ...uploadFields } = parsed.data;

    const createdUploadId = await prisma.$transaction(async (tx) => {
      // 1. Create Upload
      const upload = await tx.upload.create({
        data: {
          userId: _authUserId,
          description: uploadFields.description || null,
          currency: uploadFields.currency || null,
          generatedAt: uploadFields.generatedAt || null,
          windowDays: uploadFields.windowDays || null,
        }
      });

      // 2. Create Pages
      const pageRecords: Page[] = [];
      if (pages && pages.length > 0) {
        for (let i = 0; i < pages.length; i++) {
          const p = pages[i];
          const record = await tx.page.create({
            data: {
              uploadId: upload.id,
              sourceId: (p as { id?: string }).id || `page_${i}`,
              url: p.url || `https://example.com/page_${i}`,
              title: p.title || "Untitled Page",
              metaDescription: p.metaDescription || null,
              targetKeyword: p.targetKeyword || null,
              intent: p.intent || null,
              audience: p.audience || null,
              wordCount: p.wordCount || null,
              publishedAt: p.publishedAt || null,
              lastModified: p.lastModified || null,
              impressions: p.metrics?.impressions ?? null,
              clicks: p.metrics?.clicks ?? null,
              position: p.metrics?.position ?? null,
              ctr: p.metrics?.ctr ?? null,
              conversions: p.metrics?.conversions ?? null,
              conversionRate: p.metrics?.conversionRate ?? null,
            }
          });
          pageRecords.push(record);
        }
      }

      // 3. Create Keywords
      if (keywords && keywords.length > 0) {
        const keywordData = keywords.map(k => {
          let dbPageId = null;
          if (k.currentlyRankingPageId) {
            const targetId = k.currentlyRankingPageId.trim();
            let matched = pageRecords.find(pr => pr.sourceId === targetId || pr.id === targetId);
            
            // Fallback: if id was stripped, parse "page_001" to index 0
            if (!matched && targetId.startsWith('page_')) {
              const idx = parseInt(targetId.replace('page_', ''), 10) - 1;
              if (!isNaN(idx) && idx >= 0 && idx < pageRecords.length) {
                matched = pageRecords[idx];
              }
            }
            
            if (matched) dbPageId = matched.id;
          }
          return {
            uploadId: upload.id,
            keyword: k.keyword || "Unknown Keyword",
            monthlyVolume: k.monthlyVolume || null,
            difficulty: k.difficulty || null,
            cpc: k.cpc || null,
            intent: k.intent || null,
            audience: k.audience || null,
            topCompetitor: k.topCompetitor || null,
            currentlyRankingPageId: dbPageId,
          };
        });
        await tx.keyword.createMany({ data: keywordData });
      }

      // 4. Create Competitors
      if (competitors && competitors.length > 0) {
        const competitorData = competitors.map(c => ({
          uploadId: upload.id,
          domain: c.domain || "example.com",
          name: c.name || null,
          positioning: c.positioning || null,
          estimatedMonthlyTraffic: c.estimatedMonthlyTraffic || null,
          audience: c.audience || null,
          topTopics: c.topTopics || [],
          topContentGaps: c.topContentGaps || []
        }));
        await tx.competitor.createMany({ data: competitorData });
      }

      // 5. Run signals & Create Technical Issues
      const generatedIssues = runAllSignals(pageRecords);
      const allIssues = [...(technicalIssues || []), ...generatedIssues];

      if (allIssues && allIssues.length > 0) {
        const issueData = [];
        for (const issue of allIssues) {
          let dbPageId = null;
          if (issue.pageId) {
            const targetId = issue.pageId.trim();
            let matched = pageRecords.find(pr => pr.sourceId === targetId || pr.id === targetId);
            
            // Fallback: if id was stripped, parse "page_001" to index 0
            if (!matched && targetId.startsWith('page_')) {
              const idx = parseInt(targetId.replace('page_', ''), 10) - 1;
              if (!isNaN(idx) && idx >= 0 && idx < pageRecords.length) {
                matched = pageRecords[idx];
              }
            }
            
            if (matched) dbPageId = matched.id;
          }
          
          if (!dbPageId && pageRecords.length > 0) {
            dbPageId = pageRecords[0].id; // Fallback to first page
          }
          
          if (dbPageId) {
            issueData.push({
              uploadId: upload.id,
              pageId: dbPageId,
              type: issue.type || "Unknown Issue",
              severity: issue.severity || "Medium",
              details: issue.details || ""
            });
          }
        }
        if (issueData.length > 0) {
          await tx.technicalIssue.createMany({ data: issueData });
        }
      }

      return upload.id;
    });

    return { success: true, uploadId: createdUploadId };
  } catch (error: unknown) {
    console.error(error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

export async function deleteAllDataAction() {
  try {
    const { userId: _authUserId } = await auth();
    if (!_authUserId) {
      return { success: false, error: "Unauthorized" };
    }

    // Since Upload is the root and relations have onDelete: Cascade,
    // deleting all uploads will cascade to pages, keywords, etc.
    // However, to be safe, we delete them all.
    await prisma.$transaction([
      prisma.technicalIssue.deleteMany(),
      prisma.keyword.deleteMany(),
      prisma.competitor.deleteMany(),
      prisma.page.deleteMany(),
      prisma.upload.deleteMany(),
    ]);

    return { success: true };
  } catch (error: unknown) {
    console.error(error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}
