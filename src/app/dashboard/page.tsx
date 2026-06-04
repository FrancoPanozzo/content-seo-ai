"use client";

import { useState } from "react";
import { uploadDataAction } from "./actions";

export default function DashboardPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [uploadedData, setUploadedData] = useState<any>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setMessage("");
    setUploadedData(null);

    try {
      const text = await file.text();
      const json = JSON.parse(text);
      
      const result = await uploadDataAction(json);
      if (result.success) {
        setMessage("Data loaded and logged to server console!" + (result.warning ? ` (${result.warning})` : ""));
        setUploadedData(json);
      } else {
        setMessage(`Failed: ${result.error}`);
      }
    } catch (error) {
      console.error(error);
      setMessage("Error reading or parsing the JSON file.");
    } finally {
      setLoading(false);
      // Reset input so the same file can be selected again if needed
      event.target.value = '';
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Upload your JSON data below.
        </p>
      </div>
      
      <div className="flex flex-col gap-4 max-w-sm">
        <label className="text-sm font-medium">
          Load data (.json)
        </label>
        <input 
          type="file" 
          accept=".json" 
          onChange={handleFileUpload} 
          disabled={loading}
          className="border p-2 rounded-md cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
        />
        {message && <p className="text-sm text-muted-foreground">{message}</p>}
      </div>

      {uploadedData && (
        <div className="mt-4 w-full">
          <h2 className="text-xl font-bold tracking-tight mb-4">Preview</h2>
          <pre className="bg-muted p-4 rounded-xl overflow-auto max-h-[600px] text-xs font-mono shadow-inner border">
            {JSON.stringify(uploadedData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
