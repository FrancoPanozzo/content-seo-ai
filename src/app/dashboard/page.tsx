"use client";

import { useState } from "react";
import { uploadDataAction } from "./actions";
import { UploadCloud, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";

export default function DashboardPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [uploadedData, setUploadedData] = useState<any>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setMessage("");
    setIsSuccess(false);
    setUploadedData(null);

    try {
      const text = await file.text();
      const json = JSON.parse(text);
      
      // Fake a 2 second loading time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const result = await uploadDataAction(json);
      if (result.success) {
        setIsSuccess(true);
        setMessage("Data loaded successfully!");
        setUploadedData(json);
      } else {
        setIsSuccess(false);
        setMessage(`Validation Failed: ${result.error}`);
      }
    } catch (error) {
      console.error(error);
      setIsSuccess(false);
      setMessage("Error reading or parsing the JSON file.");
    } finally {
      setLoading(false);
      event.target.value = '';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full max-w-3xl mx-auto px-4 py-12">
      
      {!isSuccess && (
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
                It looks like you don't have any data yet. Let's get started by importing your previous JSON backup.
              </p>
            </div>
          </div>
          
          <div className="w-full relative group animate-in fade-in zoom-in-95 duration-500">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 rounded-3xl blur-xl opacity-50 transition-opacity duration-500" />
            
            <div className="relative bg-card/40 backdrop-blur-xl border border-border shadow-2xl rounded-3xl p-8 sm:p-12 w-full overflow-hidden transition-all duration-300 hover:border-primary/30">
              <div className="flex flex-col items-center justify-center w-full space-y-8">
                
                <label className={`
                  flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-2xl cursor-pointer
                  transition-all duration-300 ease-in-out
                  ${loading ? 'border-primary/50 bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-primary/5'}
                `}>
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                    {loading ? (
                      <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
                        <Sparkles className="w-12 h-12 mb-4 text-primary animate-pulse" />
                        <p className="text-sm font-semibold text-primary animate-pulse">
                          Parsing and storing data, this may take a while... ✨
                        </p>
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
                    disabled={loading}
                  />
                </label>

                {message && !isSuccess && (
                  <div className="flex items-center gap-3 p-4 rounded-xl w-full text-sm font-medium border animate-in fade-in slide-in-from-bottom-4 bg-destructive/10 text-destructive border-destructive/20">
                    <AlertCircle className="h-5 w-5 shrink-0" />
                    <p className="break-words w-full">{message}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {isSuccess && uploadedData && (
        <div className="w-full animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
              <h2 className="text-2xl font-bold tracking-tight text-foreground">Live Data Preview</h2>
            </div>
            <div className="flex items-center gap-2 text-emerald-500 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-sm font-medium">Successfully Processed</span>
            </div>
          </div>
          <div className="relative rounded-2xl overflow-hidden border border-border bg-card shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-primary" />
            <pre className="p-6 overflow-auto max-h-[600px] text-xs font-mono text-muted-foreground leading-relaxed">
              {JSON.stringify(uploadedData, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
