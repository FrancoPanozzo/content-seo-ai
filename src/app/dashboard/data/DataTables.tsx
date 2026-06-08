"use client";

import { FileText, Key, Target, AlertTriangle, PlayCircle } from "lucide-react";
import { SortableTable } from "./SortableTable";

const TableHeader = ({ title, icon: Icon, description }: { title: string, icon: React.ElementType, description: string }) => (
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

const issueTypeMap: Record<string, string> = {
  url_special_characters: "URL Special Characters",
  low_ctr_high_impressions: "Low CTR / High Impressions",
  dead_weight: "Dead Weight",
  low_volume_keyword: "Low Volume Keyword",
  duplicate_topic_coverage: "Duplicate Topic Coverage",
  low_ctr_optimization_target: "Low CTR Optimization Target",
};

const intentMap: Record<string, string> = {
  commercial: "Commercial",
  commercial_comparison: "Commercial Comparison",
  transactional: "Transactional",
  informational: "Informational",
};

interface PageData {
  id: string;
  url: string | null;
  title: string | null;
  targetKeyword: string | null;
  wordCount: number | null;
  impressions: number | null;
  _count: {
    keywords: number;
    technicalIssues: number;
  };
}

interface KeywordData {
  id: string;
  keyword: string;
  monthlyVolume: number | null;
  difficulty: number | null;
  cpc: number | null;
  intent: string | null;
  topCompetitor: string | null;
}

interface CompetitorData {
  id: string;
  domain: string;
  name: string | null;
  estimatedMonthlyTraffic: number | null;
  topTopics: string[];
  topContentGaps: string[];
}

interface TechnicalIssueData {
  id: string;
  type: string;
  severity: string;
  details: string | null;
  _severityWeight: number;
}

interface ActionData {
  id: string;
  type: string;
  title: string;
  status: string;
  priority: string;
  payload: any;
}

interface DataTablesProps {
  pages: PageData[];
  keywords: KeywordData[];
  competitors: CompetitorData[];
  technicalIssues: Omit<TechnicalIssueData, '_severityWeight'>[];
  actions: ActionData[];
}

export function DataTables({ pages, keywords, competitors, technicalIssues, actions }: DataTablesProps) {
  return (
    <>
      {/* Pages Table */}
      <div className="space-y-4">
        <TableHeader title="Pages" icon={FileText} description="Crawled pages and their SEO metrics." />
        <SortableTable<PageData>
          data={pages}
          defaultSortKey="impressions"
          columns={[
            {
              header: "URL",
              accessorKey: "url",
              cell: (row) => {
                const isRelative = row.url?.startsWith('/');
                const fullUrl = isRelative ? `https://fanz.com.ar${row.url}` : row.url;
                const displayUrl = row.url?.replace(/^https?:\/\//, '') || "—";
                return (
                  <div className="max-w-[200px] truncate" title={fullUrl || undefined}>
                    {row.url ? (
                      <a href={fullUrl || undefined} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                        {displayUrl}
                      </a>
                    ) : "—"}
                  </div>
                );
              }
            },
            {
              header: "Title",
              accessorKey: "title",
              cell: (row) => <div className="max-w-[250px] truncate" title={row.title || undefined}>{row.title || "—"}</div>
            },
            { header: "Target Keyword", accessorKey: "targetKeyword" },
            { header: "Word Count", accessorKey: "wordCount", sortType: 'number' },
            {
              header: "Impressions",
              accessorKey: "impressions",
              sortType: 'number',
              cell: (row) => row.impressions?.toLocaleString() || "—"
            },
            {
              header: "Keywords",
              accessorKey: "_count.keywords",
              sortType: 'number',
              cell: (row) => <span className="font-semibold text-primary">{row._count?.keywords || 0}</span>
            },
            {
              header: "Issues",
              accessorKey: "_count.technicalIssues",
              sortType: 'number',
              cell: (row) => <span className="font-semibold text-primary">{row._count?.technicalIssues || 0}</span>
            }
          ]}
          emptyMessage="No pages found"
        />
      </div>

      {/* Keywords Table */}
      <div className="space-y-4">
        <TableHeader title="Keywords" icon={Key} description="Targeted keywords and ranking metrics." />
        <SortableTable<KeywordData>
          data={keywords}
          defaultSortKey="monthlyVolume"
          columns={[
            { header: "Keyword", accessorKey: "keyword", cell: (row) => <span className="font-medium">{row.keyword}</span> },
            {
              header: "Volume",
              accessorKey: "monthlyVolume",
              sortType: 'number',
              cell: (row) => row.monthlyVolume?.toLocaleString() || "—"
            },
            {
              header: "Difficulty",
              accessorKey: "difficulty",
              sortType: 'number',
              cell: (row) => row.difficulty ? (
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full ${row.difficulty > 60 ? 'bg-destructive' : row.difficulty > 30 ? 'bg-orange-500' : 'bg-emerald-500'}`}
                      style={{ width: `${row.difficulty}%` }}
                    />
                  </div>
                  <span>{row.difficulty}</span>
                </div>
              ) : "—"
            },
            {
              header: "CPC",
              accessorKey: "cpc",
              sortType: 'number',
              cell: (row) => row.cpc ? `$${row.cpc}` : "—"
            },
            { 
              header: "Intent", 
              accessorKey: "intent",
              cell: (row) => row.intent ? (
                <span className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium ring-1 ring-inset ring-muted-foreground/20">
                  {intentMap[row.intent] || row.intent}
                </span>
              ) : "—"
            },
            { header: "Top Competitor", accessorKey: "topCompetitor" }
          ]}
          emptyMessage="No keywords found"
        />
      </div>

      {/* Competitors Table */}
      <div className="space-y-4">
        <TableHeader title="Competitors" icon={Target} description="Monitored competitors in the space." />
        <SortableTable<CompetitorData>
          data={competitors}
          defaultSortKey="estimatedMonthlyTraffic"
          columns={[
            { header: "Name", accessorKey: "name" },
            {
              header: "Domain",
              accessorKey: "domain",
              cell: (row) => (
                row.domain ? (
                  <a href={`https://${row.domain.replace(/^https?:\/\//, '')}`} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-500 hover:underline">
                    {row.domain}
                  </a>
                ) : "—"
              )
            },
            {
              header: "Traffic (Est.)",
              accessorKey: "estimatedMonthlyTraffic",
              sortType: 'number',
              cell: (row) => row.estimatedMonthlyTraffic?.toLocaleString() || "—"
            },
            {
              header: "Topics",
              accessorKey: "topTopics",
              sortType: 'number',
              cell: (row) => <span className="font-semibold text-primary">{row.topTopics?.length || 0}</span>
            },
            {
              header: "Content Gaps",
              accessorKey: "topContentGaps",
              sortType: 'number',
              cell: (row) => <span className="font-semibold text-primary">{row.topContentGaps?.length || 0}</span>
            }
          ]}
          emptyMessage="No competitors found"
        />
      </div>

      {/* Technical Issues Table */}
      <div className="space-y-4">
        <TableHeader title="Technical Issues" icon={AlertTriangle} description="Logged technical issues for pages." />
        <SortableTable<TechnicalIssueData>
          data={technicalIssues.map(issue => ({
            ...issue,
            // Map severity to a sortable number: High=3, Medium=2, Low=1
            _severityWeight: issue.severity.toLowerCase() === 'high' ? 3 : issue.severity.toLowerCase() === 'medium' ? 2 : 1
          }))}
          defaultSortKey="_severityWeight"
          columns={[
            {
              header: "Type",
              accessorKey: "type",
              cell: (row) => <span className="font-medium">{issueTypeMap[row.type] || row.type}</span>
            },
            {
              header: "Severity",
              accessorKey: "_severityWeight",
              sortType: 'number',
              cell: (row) => (
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${row.severity.toLowerCase() === 'high' ? 'bg-destructive/10 text-destructive border-destructive/20' :
                    row.severity.toLowerCase() === 'medium' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                      'bg-blue-500/10 text-blue-500 border-blue-500/20'
                  }`}>
                  {row.severity}
                </span>
              )
            },
            {
              header: "Details",
              accessorKey: "details",
              cell: (row) => <div className="max-w-md truncate" title={row.details || undefined}>{row.details || "—"}</div>
            }
          ]}
          emptyMessage="No technical issues found"
        />
      </div>
      {/* Actions Table */}
      <div className="space-y-4">
        <TableHeader title="Actions & Dry Runs" icon={PlayCircle} description="System-generated actions and simulated execution outcomes." />
        <SortableTable<ActionData>
          data={actions}
          defaultSortKey="title"
          columns={[
            {
              header: "Title",
              accessorKey: "title",
              cell: (row) => <div className="font-medium">{row.title}</div>
            },
            {
              header: "Type",
              accessorKey: "type",
            },
            {
              header: "Priority",
              accessorKey: "priority",
              cell: (row) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  row.priority === 'high' ? 'bg-destructive/10 text-destructive' :
                  row.priority === 'medium' ? 'bg-orange-500/10 text-orange-500' :
                  'bg-emerald-500/10 text-emerald-500'
                }`}>
                  {row.priority}
                </span>
              )
            },
            {
              header: "Status",
              accessorKey: "status",
              cell: (row) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                  row.status === 'applied' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                  row.status === 'pending' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                  'bg-muted text-muted-foreground border-border'
                }`}>
                  {row.status}
                </span>
              )
            },
            {
              header: "Action Result",
              accessorKey: "payload",
              cell: (row) => {
                const dryRun = row.payload?.dryRunResult;
                if (!dryRun) return <span className="text-muted-foreground italic">None</span>;
                return (
                  <div className="max-w-md">
                    <div className="text-sm font-medium mb-1">{dryRun.status}</div>
                    {dryRun.message && <div className="text-xs text-muted-foreground truncate" title={dryRun.message}>{dryRun.message}</div>}
                  </div>
                );
              }
            }
          ]}
          emptyMessage="No actions found"
        />
      </div>
    </>
  );
}
