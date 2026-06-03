import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="w-screen h-[100dvh] flex flex-col justify-center items-center relative bg-background text-center px-4">
      <div className="flex flex-col items-center justify-center space-y-6">
        <div className="rounded-full bg-primary/10 p-6 mb-2">
          <FileQuestion className="h-12 w-12 text-primary" />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">404 - Page Not Found</h1>
        
        <p className="text-muted-foreground text-lg max-w-md">
          Oops! It looks like the page you are looking for doesn&apos;t exist or has been moved.
        </p>
        
        <div className="pt-4">
          <Button asChild size="lg" className="px-8">
            <Link href="/">
              Go Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
