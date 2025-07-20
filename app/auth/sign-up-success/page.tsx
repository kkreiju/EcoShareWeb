import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md mx-auto">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Thank you for signing up!
            </h1>
            <p className="text-muted-foreground">
              Check your email to confirm your account
            </p>
          </div>

          {/* Content */}
          <div className="space-y-6">
            <div className="rounded-lg bg-muted/50 p-4 border border-border/50">
              <p className="text-sm text-muted-foreground text-center">
                You&apos;ve successfully signed up. Please check your email to
                confirm your account before signing in.
              </p>
            </div>

            <Button
              asChild
              className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
            >
              <Link href="/auth/login">Back to login</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
