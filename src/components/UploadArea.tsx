"use client";

import { useState, useEffect } from "react";
import { uploadDataAction } from "@/app/dashboard/actions";
import { generatePlanAction } from "@/app/dashboard/plan/actions";
import { UploadCloud, CheckCircle2, AlertCircle, Sparkles, Loader2, Database, BrainCircuit } from "lucide-react";
import { useRouter } from "next/navigation";

type UploadStep = 'idle' | 'storing' | 'planning' | 'success' | 'error';

export function UploadArea() {
  const router = useRouter();
  const [step, setStep] = useState<UploadStep>('idle');
  const [message, setMessage] = useState("");
  const [errorDetails, setErrorDetails] = useState<{code: string, message: string} | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (step === 'idle' || step === 'error') {
      setProgress(0);
      return;
    }
    
    if (step === 'success') {
      setProgress(100);
      return;
    }

    if (step === 'storing') {
      setProgress(p => Math.max(p, 5));
    } else if (step === 'planning') {
      setProgress(p => Math.max(p, 20));
    }

    const interval = setInterval(() => {
      setProgress(prev => {
        const max = step === 'storing' ? 19 : 99;
        if (prev >= max) return prev;
        return prev + 1.2;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [step]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setStep('storing');
    setMessage("");

    try {
      const text = await file.text();
      const json = JSON.parse(text);
      
      const result = await uploadDataAction(json);
      if (result.success && result.uploadId) {
        setStep('planning');
        const planResult = await generatePlanAction(result.uploadId);
        
        if (planResult.success) {
           setStep('success');
           setMessage("Data loaded and plan generated successfully!");
           router.refresh(); // Tells Next.js to re-fetch Server Components (like the DashboardPage)
        } else {
           setStep('error');
           if (typeof planResult.error === 'object' && planResult.error !== null) {
             setErrorDetails(planResult.error as any);
             setMessage("Planning Failed.");
           } else {
             setMessage(`Planning Failed: ${planResult.error}`);
           }
        }
      } else {
        setStep('error');
        setMessage(`Validation Failed: ${result.error}`);
      }
    } catch (error) {
      console.error(error);
      setStep('error');
      setMessage("Error reading or parsing the JSON file.");
    } finally {
      event.target.value = '';
    }
  };

  const isProcessing = step === 'storing' || step === 'planning';
  const isSuccess = step === 'success';

  if (isSuccess) return null; // Server component will render the queue after router.refresh()

  return (
    <>
      <div className="flex flex-col items-center text-center space-y-6 mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20 shadow-[0_0_40px_rgba(var(--primary),0.2)]">
          <Sparkles className="h-10 w-10 text-primary" />
        </div>
        <div className="space-y-3">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
            Welcome to Content SEO AI
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            It looks like you don&apos;t have any data yet. Let&apos;s get started by importing your previous JSON backup.
          </p>
        </div>
      </div>
      
      <div className="w-full relative group animate-in fade-in zoom-in-95 duration-500">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 rounded-3xl blur-xl opacity-50 transition-opacity duration-500" />
        
        <div className="relative bg-card/40 backdrop-blur-xl border border-border shadow-2xl rounded-3xl p-8 sm:p-12 w-full overflow-hidden transition-all duration-300 hover:border-primary/30">
          <div className="flex flex-col items-center justify-center w-full space-y-8">
            
            <label className={`
              flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-2xl
              transition-all duration-300 ease-in-out
              ${isProcessing ? 'border-primary/50 bg-primary/5 cursor-default' : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-primary/5 cursor-pointer'}
            `}>
              <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center w-full">
                {isProcessing ? (
                  <div className="flex flex-col w-full max-w-sm px-6 animate-in fade-in zoom-in duration-500 space-y-6">
                    <div className="w-full space-y-5 text-left">
                      <div className="flex items-center gap-4">
                        <div className={`p-2.5 rounded-full shadow-sm ${step === 'storing' ? 'bg-primary/20 text-primary animate-pulse' : 'bg-emerald-500/20 text-emerald-500'}`}>
                          {step === 'storing' ? <Database className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                        </div>
                        <div className="flex-1">
                          <p className={`font-semibold ${step === 'storing' ? 'text-primary' : 'text-emerald-500'}`}>Storing Data</p>
                          <p className="text-xs text-muted-foreground">Parsing & saving records</p>
                        </div>
                        {step === 'storing' && <Loader2 className="w-5 h-5 text-primary animate-spin" />}
                      </div>

                      <div className="flex items-center gap-4">
                        <div className={`p-2.5 rounded-full shadow-sm ${step === 'planning' ? 'bg-primary/20 text-primary animate-pulse' : 'bg-muted text-muted-foreground'}`}>
                          <BrainCircuit className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <p className={`font-semibold ${step === 'planning' ? 'text-primary' : 'text-muted-foreground'}`}>AI Planning</p>
                          <p className="text-xs text-muted-foreground">Generating SEO strategy</p>
                          {step === 'planning' && <p className="text-[11px] text-muted-foreground/70 mt-1 animate-pulse italic">This may take a minute or two...</p>}
                        </div>
                        {step === 'planning' && <Loader2 className="w-5 h-5 text-primary animate-spin" />}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2.5 bg-muted/50 rounded-full overflow-hidden shadow-inner">
                      <div 
                        className="h-full bg-primary transition-all duration-1000 ease-linear rounded-full" 
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
                    <UploadCloud className="w-12 h-12 mb-4 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold text-foreground">Click to upload</span>
                    </p>
                    <p className="text-xs text-muted-foreground">JSON files only (UploadSchema format)</p>
                  </div>
                )}
              </div>
              <input 
                type="file" 
                className="hidden" 
                accept=".json"
                onChange={handleFileUpload}
                disabled={isProcessing}
              />
            </label>

            {step === 'error' && (
              <div className="flex flex-col gap-2 p-5 rounded-xl w-full border animate-in fade-in slide-in-from-bottom-4 bg-destructive/5 border-destructive/20 mt-6">
                <div className="flex items-center gap-3 font-semibold text-destructive">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  <p>{message || "An error occurred"}</p>
                </div>
                {errorDetails && (
                  <div className="mt-2 text-sm bg-background border border-border p-4 rounded-lg text-left">
                    <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground mb-2">
                      <span className="bg-destructive/10 text-destructive px-2 py-0.5 rounded font-bold">{errorDetails.code}</span>
                    </div>
                    <p className="text-foreground">{errorDetails.message}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
