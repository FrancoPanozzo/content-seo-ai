"use client";

import { useState } from "react";
import { updateActionStatus, applyActionDryRun } from "@/app/dashboard/queue-actions";
import { Check, X, Play, Loader2, AlertTriangle, Info, ChevronDown, ChevronUp } from "lucide-react";

export function ActionQueue({ actions: initialActions }: { actions: any[] }) {
  const [localActions, setLocalActions] = useState(initialActions || []);
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [rejectPrompt, setRejectPrompt] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const setLoading = (id: string, isLoading: boolean) => {
    setLoadingStates(prev => ({ ...prev, [id]: isLoading }));
  };

  const handleApprove = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLoading(id, true);
    await updateActionStatus(id, "approved");
    setLocalActions(prev => prev.map((a: any) => a.id === id ? { ...a, status: "approved" } : a));
    setLoading(id, false);
  };

  const handleReject = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!rejectReason.trim()) return;
    setLoading(id, true);
    await updateActionStatus(id, "rejected", rejectReason);
    setLocalActions(prev => prev.map((a: any) => a.id === id ? { ...a, status: "rejected", rejectReason } : a));
    setRejectPrompt(null);
    setRejectReason("");
    setLoading(id, false);
  };

  const handleApply = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLoading(id, true);
    const res = await applyActionDryRun(id);
    if (res.success && res.dryRunResult) {
      setLocalActions(prev => prev.map((a: any) => a.id === id ? { 
        ...a, 
        status: "applied", 
        payload: { ...(a.payload || {}), dryRunResult: res.dryRunResult } 
      } : a));
    }
    setLoading(id, false);
  };

  if (!localActions || localActions.length === 0) return null;

  return (
    <div className="space-y-4 w-full">
      <div className="flex flex-col gap-3">
        {localActions.map((action: any) => {
          const payload = action.payload || {};
          const risks = payload.risks || [];
          const isPending = action.status === "pending";
          const isApproved = action.status === "approved";
          const isApplied = action.status === "applied";
          const isRejected = action.status.startsWith("rejected");
          const isLoading = !!loadingStates[action.id];
          const isExpanded = expandedId === action.id;

          return (
            <div 
              key={action.id} 
              className={`border border-border rounded-xl bg-card shadow-sm transition-all duration-300 ${isExpanded ? 'ring-2 ring-primary/20 shadow-md' : 'hover:shadow-md'}`}
            >
              {/* Accordion Header */}
              <div 
                className="flex items-center justify-between p-4 cursor-pointer select-none"
                onClick={() => setExpandedId(isExpanded ? null : action.id)}
              >
                <div className="flex items-center gap-3">
                  {isExpanded ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
                  <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-1 rounded-md shrink-0">
                    {action.type.replace('_', ' ')}
                  </span>
                  <h4 className="font-semibold text-base line-clamp-1 truncate max-w-[200px] sm:max-w-[400px]">
                    {action.title}
                  </h4>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-md hidden sm:inline-block ${
                    isApplied ? "bg-blue-500/10 text-blue-500" :
                    isApproved ? "bg-emerald-500/10 text-emerald-500" :
                    isRejected ? "bg-red-500/10 text-red-500" :
                    "bg-amber-500/10 text-amber-500"
                  }`}>
                    {action.status}
                  </span>
                  
                  {/* Quick Action Button in Header */}
                  {isPending && !isLoading && !isExpanded && (
                    <button 
                      onClick={(e) => handleApprove(action.id, e)}
                      className="p-1.5 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white rounded-md transition-colors"
                      title="Quick Approve"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                  {isLoading && <Loader2 className="w-5 h-5 animate-spin text-primary" />}
                </div>
              </div>

              {/* Accordion Body */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-2 border-t border-border animate-in slide-in-from-top-2 duration-200">
                  <p className="text-sm text-muted-foreground mb-4">{action.reason}</p>
                  
                  {risks.length > 0 && (
                    <div className="mb-4 bg-amber-500/10 border border-amber-500/20 text-amber-600 rounded-lg p-3 text-sm">
                      <div className="flex items-center gap-2 font-semibold mb-1">
                        <AlertTriangle className="w-4 h-4" /> Guardrail Risks Detected
                      </div>
                      <ul className="list-disc list-inside">
                        {risks.map((r: string, i: number) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {action.rejectReason && (
                    <div className="mb-4 bg-red-500/10 text-red-500 rounded-lg p-3 text-sm">
                      <strong>Rejection Reason:</strong> {action.rejectReason}
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-3 mt-4">
                    {isPending && (
                      <>
                        <button 
                          onClick={(e) => handleApprove(action.id, e)}
                          disabled={isLoading}
                          className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                        >
                          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                          Approve Action
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setRejectPrompt(action.id);
                          }}
                          disabled={isLoading}
                          className="flex items-center justify-center gap-2 bg-destructive/10 hover:bg-destructive/20 text-destructive px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                        >
                          <X className="w-4 h-4" /> Reject Action
                        </button>
                      </>
                    )}
                    
                    {isApproved && (
                      <button 
                        onClick={(e) => handleApply(action.id, e)}
                        disabled={isLoading}
                        className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                      >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                        Apply Dry-Run (Generate Brief)
                      </button>
                    )}
                  </div>

                  {rejectPrompt === action.id && (
                    <div className="mt-4 p-4 bg-muted/50 rounded-lg border border-border flex items-end gap-3 animate-in fade-in">
                      <div className="flex-1 space-y-2">
                        <label className="text-sm font-medium">Reason for rejection:</label>
                        <input 
                          type="text" 
                          value={rejectReason}
                          onChange={e => setRejectReason(e.target.value)}
                          className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                          placeholder="e.g. Too generic, doesn't match audience..."
                        />
                      </div>
                      <button 
                        onClick={() => handleReject(action.id)}
                        className="bg-destructive hover:bg-destructive/90 text-white px-4 py-2 rounded-md text-sm font-medium"
                      >
                        Confirm
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setRejectPrompt(null); }}
                        className="bg-secondary text-secondary-foreground px-4 py-2 rounded-md text-sm font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  )}

                  {isApplied && payload.dryRunResult && (
                    <div className="mt-4 border-t border-border pt-4 animate-in fade-in">
                      <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-primary">
                        <Info className="w-4 h-4" /> Dry-Run Payload Generated
                      </div>
                      <pre className="p-4 bg-muted/50 rounded-lg text-xs font-mono overflow-auto max-h-[400px]">
                        {JSON.stringify(payload.dryRunResult, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
