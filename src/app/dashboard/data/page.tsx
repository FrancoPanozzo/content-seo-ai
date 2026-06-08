import { prisma } from "@/lib/prisma";
import { Database, FileText, Key, Target, AlertTriangle } from "lucide-react";
import { ClearDataButton } from "./ClearDataButton";
import { DataTables } from "./DataTables";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DataPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  const uploads = await prisma.upload.findMany({
    where: { userId },
    include: {
      _count: { select: { pages: true, keywords: true, competitors: true, technicalIssues: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 1, // Only need the most recent for the MVP metrics header
  });

  const pages = await prisma.page.findMany({
    where: { upload: { userId } },
    include: {
      _count: { select: { technicalIssues: true, keywords: true } }
    }
  });

  const keywords = await prisma.keyword.findMany({ where: { upload: { userId } } });
  const competitors = await prisma.competitor.findMany({ where: { upload: { userId } } });
  const technicalIssues = await prisma.technicalIssue.findMany({ where: { upload: { userId } } });
  const actions = await prisma.action.findMany({ where: { upload: { userId } } });
  const llmLogs = await prisma.llmLog.findMany({ where: { upload: { userId } }, orderBy: { createdAt: 'desc' } });

  const recentUpload = uploads[0];

  return (
    <div className="min-h-screen w-full  p-8 pb-20">
      <div className="max-w-7xl mx-auto space-y-16">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <Database className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-extrabold tracking-tight">Debug Panel</h1>
            </div>
            <p className="text-lg text-muted-foreground">View all synchronized entities and LLM execution logs.</p>
          </div>
          <ClearDataButton />
        </div>

        {/* Upload Metrics Header */}
        {recentUpload ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="col-span-1 md:col-span-2 lg:col-span-4 bg-card/50 border border-border rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Latest Upload</h3>
                <p className="text-xl font-semibold">{recentUpload.description || "No description provided"}</p>
              </div>
              <div className="flex gap-8">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Currency</h3>
                  <p className="text-lg font-medium">{recentUpload.currency || "—"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Window Days</h3>
                  <p className="text-lg font-medium">{recentUpload.windowDays || "—"}</p>
                </div>
              </div>
            </div>

            <div className="bg-card/50 border border-border rounded-xl p-6 shadow-sm">
              <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-2"><FileText className="w-4 h-4" /> Pages</h3>
              <p className="text-3xl font-bold text-primary">{recentUpload._count.pages}</p>
            </div>
            <div className="bg-card/50 border border-border rounded-xl p-6 shadow-sm">
              <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-2"><Key className="w-4 h-4" /> Keywords</h3>
              <p className="text-3xl font-bold text-primary">{recentUpload._count.keywords}</p>
            </div>
            <div className="bg-card/50 border border-border rounded-xl p-6 shadow-sm">
              <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-2"><Target className="w-4 h-4" /> Competitors</h3>
              <p className="text-3xl font-bold text-primary">{recentUpload._count.competitors}</p>
            </div>
            <div className="bg-card/50 border border-border rounded-xl p-6 shadow-sm">
              <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-2"><AlertTriangle className="w-4 h-4" /> Issues</h3>
              <p className="text-3xl font-bold text-primary">{recentUpload._count.technicalIssues}</p>
            </div>
          </div>
        ) : (
          <div className="bg-card/50 border border-border rounded-xl p-8 text-center text-muted-foreground shadow-sm">
            No data uploaded yet.
          </div>
        )}

        <DataTables
          pages={pages}
          keywords={keywords}
          competitors={competitors}
          technicalIssues={technicalIssues}
          actions={actions}
          llmLogs={llmLogs}
        />

      </div>
    </div>
  );
}

