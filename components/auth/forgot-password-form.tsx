"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });
      if (error) throw error;
      setSuccess(true);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("w-full max-w-md mx-auto", className)} {...props}>
      {success ? (
        <div className="space-y-8">
          {/* Success State */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Check your email
            </h1>
            <p className="text-muted-foreground">
              Password reset instructions sent
            </p>
          </div>

          <div className="space-y-6">
            <div className="rounded-lg bg-muted/50 p-4 border border-border/50">
              <p className="text-sm text-muted-foreground text-center">
                If you registered using your email and password, you will
                receive a password reset email with a link to reset your
                password.
              </p>
            </div>

            <Button asChild variant="outline" className="w-full h-11">
              <Link href="/auth/login">Back to login</Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Reset password
            </h1>
            <p className="text-muted-foreground">
              Enter your email and we&apos;ll send you a link to reset your
              password
            </p>
          </div>

          {/* Form */}
          <div className="space-y-6">
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11"
                />
              </div>

              {error && (
                <div className="rounded-lg bg-destructive/10 p-3 border border-destructive/20">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send reset email"}
              </Button>
            </form>

            {/* Footer */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Remember your password?{" "}
                <Link
                  href="/auth/login"
                  className="font-medium text-primary hover:text-primary/80 underline-offset-4 hover:underline"
                >
                  Back to login
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
