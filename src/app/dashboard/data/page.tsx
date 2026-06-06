import { prisma } from "@/lib/prisma";
import { Sparkles, Database, FileText, Key, Target, AlertTriangle } from "lucide-react";

import { ClearDataButton } from "./ClearDataButton";

const TableHeader = ({ title, icon: Icon, description }: { title: string, icon: any, description: string }) => (
  <div className="flex items-center gap-4 mb-6">
    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
      <Icon className="h-6 w-6 text-primary" />
    </div>
    <div>
      <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  </div>
);

export default async function DataPage() {
  const uploads = await prisma.upload.findMany({
    include: {
      _count: { select: { pages: true, keywords: true, competitors: true, technicalIssues: true } },
    },
    orderBy: { createdAt: 'desc' }
  });

  const pages = await prisma.page.findMany({
    include: {
      _count: { select: { technicalIssues: true, keywords: true } }
    }
  });

  const keywords = await prisma.keyword.findMany();
  const competitors = await prisma.competitor.findMany();
  const technicalIssues = await prisma.technicalIssue.findMany();

  return (
    <div className="min-h-screen w-full bg-background p-8 pb-20">
      <div className="max-w-7xl mx-auto space-y-16">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-8">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <Database className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-extrabold tracking-tight">Database Overview</h1>
            </div>
            <p className="text-lg text-muted-foreground">View all synchronized entities stored via Prisma.</p>
          </div>
          <ClearDataButton />
        </div>

        {/* Uploads Table */}
        <div className="space-y-4">
          <TableHeader title="Uploads" icon={Sparkles} description="Root imports created by users." />
          <div className="rounded-xl border border-border overflow-hidden bg-card/50 shadow-sm">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground uppercase text-xs tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-medium">Description</th>
                  <th className="px-6 py-4 font-medium">Currency</th>
                  <th className="px-6 py-4 font-medium">Window Days</th>
                  <th className="px-6 py-4 font-medium">Pages</th>
                  <th className="px-6 py-4 font-medium">Keywords</th>
                  <th className="px-6 py-4 font-medium">Competitors</th>
                  <th className="px-6 py-4 font-medium">Issues</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {uploads.map((u) => (
                  <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">{u.description || "—"}</td>
                    <td className="px-6 py-4">{u.currency || "—"}</td>
                    <td className="px-6 py-4">{u.windowDays || "—"}</td>
                    <td className="px-6 py-4 font-semibold text-primary">{u._count.pages}</td>
                    <td className="px-6 py-4 font-semibold text-primary">{u._count.keywords}</td>
                    <td className="px-6 py-4 font-semibold text-primary">{u._count.competitors}</td>
                    <td className="px-6 py-4 font-semibold text-primary">{u._count.technicalIssues}</td>
                  </tr>
                ))}
                {uploads.length === 0 && (
                  <tr><td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">No uploads found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pages Table */}
        <div className="space-y-4">
          <TableHeader title="Pages" icon={FileText} description="Crawled pages and their SEO metrics." />
          <div className="rounded-xl border border-border overflow-x-auto bg-card/50 shadow-sm">
            <table className="w-full text-sm text-left min-w-[1000px]">
              <thead className="bg-muted/50 text-muted-foreground uppercase text-xs tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-medium">URL</th>
                  <th className="px-6 py-4 font-medium">Title</th>
                  <th className="px-6 py-4 font-medium">Target Keyword</th>
                  <th className="px-6 py-4 font-medium">Word Count</th>
                  <th className="px-6 py-4 font-medium">Impressions</th>
                  <th className="px-6 py-4 font-medium">Keywords</th>
                  <th className="px-6 py-4 font-medium">Issues</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {pages.map((p) => (
                  <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 max-w-[200px] truncate" title={p.url}>{p.url}</td>
                    <td className="px-6 py-4 max-w-[250px] truncate" title={p.title}>{p.title}</td>
                    <td className="px-6 py-4">{p.targetKeyword || "—"}</td>
                    <td className="px-6 py-4">{p.wordCount || "—"}</td>
                    <td className="px-6 py-4">{p.impressions?.toLocaleString() || "—"}</td>
                    <td className="px-6 py-4 font-semibold text-primary">{p._count.keywords}</td>
                    <td className="px-6 py-4 font-semibold text-primary">{p._count.technicalIssues}</td>
                  </tr>
                ))}
                {pages.length === 0 && (
                  <tr><td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">No pages found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Keywords Table */}
        <div className="space-y-4">
          <TableHeader title="Keywords" icon={Key} description="Targeted keywords and ranking metrics." />
          <div className="rounded-xl border border-border overflow-hidden bg-card/50 shadow-sm">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground uppercase text-xs tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-medium">Keyword</th>
                  <th className="px-6 py-4 font-medium">Volume</th>
                  <th className="px-6 py-4 font-medium">Difficulty</th>
                  <th className="px-6 py-4 font-medium">CPC</th>
                  <th className="px-6 py-4 font-medium">Intent</th>
                  <th className="px-6 py-4 font-medium">Top Competitor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {keywords.map((k) => (
                  <tr key={k.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-medium">{k.keyword}</td>
                    <td className="px-6 py-4">{k.monthlyVolume?.toLocaleString() || "—"}</td>
                    <td className="px-6 py-4">
                      {k.difficulty && (
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 rounded-full bg-muted overflow-hidden">
                            <div className={`h-full ${k.difficulty > 60 ? 'bg-destructive' : k.difficulty > 30 ? 'bg-orange-500' : 'bg-emerald-500'}`} style={{ width: `${k.difficulty}%` }} />
                          </div>
                          <span>{k.difficulty}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">{k.cpc ? `$${k.cpc}` : "—"}</td>
                    <td className="px-6 py-4">{k.intent || "—"}</td>
                    <td className="px-6 py-4">{k.topCompetitor || "—"}</td>
                  </tr>
                ))}
                {keywords.length === 0 && (
                  <tr><td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">No keywords found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Competitors Table */}
        <div className="space-y-4">
          <TableHeader title="Competitors" icon={Target} description="Monitored competitors in the space." />
          <div className="rounded-xl border border-border overflow-hidden bg-card/50 shadow-sm">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground uppercase text-xs tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-medium">Domain</th>
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Traffic (Est.)</th>
                  <th className="px-6 py-4 font-medium">Topics</th>
                  <th className="px-6 py-4 font-medium">Content Gaps</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {competitors.map((c) => (
                  <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-blue-500">{c.domain}</td>
                    <td className="px-6 py-4">{c.name || "—"}</td>
                    <td className="px-6 py-4">{c.estimatedMonthlyTraffic?.toLocaleString() || "—"}</td>
                    <td className="px-6 py-4 font-semibold text-primary">{c.topTopics.length}</td>
                    <td className="px-6 py-4 font-semibold text-primary">{c.topContentGaps.length}</td>
                  </tr>
                ))}
                {competitors.length === 0 && (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">No competitors found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Technical Issues Table */}
        <div className="space-y-4">
          <TableHeader title="Technical Issues" icon={AlertTriangle} description="Logged technical issues for pages." />
          <div className="rounded-xl border border-border overflow-hidden bg-card/50 shadow-sm">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground uppercase text-xs tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-medium">Type</th>
                  <th className="px-6 py-4 font-medium">Severity</th>
                  <th className="px-6 py-4 font-medium">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {technicalIssues.map((t) => (
                  <tr key={t.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-medium">{t.type}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${t.severity.toLowerCase() === 'high' ? 'bg-destructive/10 text-destructive border-destructive/20' :
                          t.severity.toLowerCase() === 'medium' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                            'bg-blue-500/10 text-blue-500 border-blue-500/20'
                        }`}>
                        {t.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4 max-w-md truncate" title={t.details}>{t.details}</td>
                  </tr>
                ))}
                {technicalIssues.length === 0 && (
                  <tr><td colSpan={3} className="px-6 py-8 text-center text-muted-foreground">No technical issues found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
