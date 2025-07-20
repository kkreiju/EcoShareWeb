import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md mx-auto">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Oops! Something went wrong
            </h1>
            <p className="text-muted-foreground">
              We encountered an error while processing your request
            </p>
          </div>

          {/* Content */}
          <div className="space-y-6">
            {params?.error ? (
              <div className="space-y-4">
                <div className="rounded-lg bg-muted/50 p-3 border border-border/50">
                  <p className="text-xs font-mono text-muted-foreground">
                    Error: {params.error}
                  </p>
                </div>
              </div>
            ) : (
              <div className="rounded-lg bg-muted/50 p-4 border border-border/50">
                <p className="text-sm text-muted-foreground text-center">
                  An unexpected error occurred. Please try again later.
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                asChild
                className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
              >
                <Link href="/auth/login">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to login
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full h-11">
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Go home
                </Link>
              </Button>
            </div>

            {/* Help Text */}
            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                If this problem persists, please contact support.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
