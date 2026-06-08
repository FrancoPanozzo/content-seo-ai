import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-muted/20">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto w-full flex h-16 items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-6 md:gap-8">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              <span className="font-bold hidden sm:inline-block">Content SEO AI</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              <Link href="/dashboard" className="transition-colors hover:text-foreground text-foreground">
                Dashboard
              </Link>
              <Link href="/dashboard/data" className="transition-colors hover:text-foreground text-muted-foreground">
                Data
              </Link>
              <Link href="/dashboard/settings" className="transition-colors hover:text-foreground text-muted-foreground">
                Settings
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <UserButton />
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col py-8 px-4 md:px-8 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
