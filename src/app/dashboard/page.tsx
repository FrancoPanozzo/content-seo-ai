import { UploadArea } from "@/components/UploadArea";
import { ActionQueue } from "@/components/ActionQueue";
import { CheckCircle2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const latestUpload = await prisma.upload.findFirst({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: { actions: true }
  });

  const hasData = latestUpload && latestUpload.actions.length > 0;

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full max-w-3xl mx-auto px-4 py-12">
      {!hasData ? (
        <UploadArea />
      ) : (
        <div className="w-full animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.6)] animate-pulse" />
              <h2 className="text-3xl font-extrabold tracking-tight text-foreground">Strategy Ready</h2>
            </div>
            <div className="flex items-center gap-2 text-emerald-500 bg-emerald-500/10 px-5 py-2.5 rounded-full border border-emerald-500/20 shadow-sm">
              <CheckCircle2 className="h-5 w-5" />
              <span className="text-sm font-semibold">{latestUpload.actions.length} Actions Planned</span>
            </div>
          </div>
          <div className="relative rounded-2xl overflow-hidden border border-border bg-card shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-500 via-primary to-emerald-500 bg-[length:200%_auto] animate-gradient" />
            <div className="p-8">
              <p className="text-muted-foreground mb-6">
                Your data has been successfully imported and our AI has generated a complete SEO strategy plan. 
                You can now review and manage these actions in your queue.
              </p>
              
              <ActionQueue actions={latestUpload.actions} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
