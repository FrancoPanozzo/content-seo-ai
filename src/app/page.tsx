import { Button } from "@/components/ui/button";
import { SignUpButton, SignInButton, Show } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { Sparkles, ArrowRight, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const { userId } = await auth();
  
  if (userId) {
    redirect("/dashboard");
  }
  return (
    <div className="w-screen h-[100dvh] flex flex-col justify-center items-center relative overflow-hidden bg-background">
      {/* Background decorations */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] opacity-50 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-chart-1/10 rounded-full blur-[100px] opacity-40 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-chart-2/10 rounded-full blur-[100px] opacity-30 pointer-events-none" />
      
      <div className="container relative z-10 px-4 md:px-6 flex flex-col items-center text-center space-y-8 py-24 md:py-32">
        <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-4 backdrop-blur-sm shadow-sm transition-colors hover:bg-primary/10">
          <Sparkles className="h-4 w-4 mr-2" />
          <span>The future of SEO is here</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground max-w-4xl">
          Supercharge your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-chart-1">Content SEO</span> with AI
        </h1>
        
        <p className="mt-6 text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Analyze your CMS and marketing data instantly. Generate actionable SEO optimization plans, briefs, and insights to outrank the competition.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 mt-10">
          <Show when="signed-out">
            <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
              <Button size="lg" className="gap-2">
                Get Started for Free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </SignUpButton>
            
            <SignInButton mode="modal" forceRedirectUrl="/dashboard">
              <Button variant="outline" size="lg">
                Log In
              </Button>
            </SignInButton>
          </Show>
          
          <Show when="signed-in">
            <Button asChild size="lg" className="gap-2">
              <Link href="/dashboard">
                Go to Dashboard
                <LayoutDashboard className="h-4 w-4" />
              </Link>
            </Button>
          </Show>
        </div>
      </div>
    </div>
  );
}
