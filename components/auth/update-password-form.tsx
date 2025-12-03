"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export function UpdatePasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    // 1. Check for an existing session (mobile or already authenticated)
    supabase.auth.getSession().then(async ({ data }: { data: any }) => {
      if (data.session) {
        setSessionReady(true);
      } else {
        // 2. Check for session info in hash fragment (Supabase recovery flow)
        const hash = window.location.hash.substring(1); // Remove the '#'
        const params = new URLSearchParams(hash);

        const access_token = params.get("access_token");
        const refresh_token = params.get("refresh_token");
        const expires_at = params.get("expires_at");

        if (access_token && refresh_token && expires_at) {
          try {
            await supabase.auth.setSession({
              access_token,
              refresh_token,
            });
            setSessionReady(true);
          } catch (err) {
            console.error(err);
            setError("Failed to establish session. Please try the link again.");
          }
          return;
        }

        // 3. If no session, check for PKCE code in URL (web flow)
        const url = window.location.href;
        const hasCode = url.includes("code=");
        if (hasCode) {
          supabase.auth.exchangeCodeForSession(url).then(({ error }: { error: any }) => {
            if (error) {
              setError(
                "Invalid or expired link. Please request a new password reset."
              );
            } else {
              setSessionReady(true);
            }
          });
        } else {
          // 4. No session and no code: show error
          setError("No active session found. Please log in again.");
        }
      }
    });
  }, []);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      router.push("/user/dashboard");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (!sessionReady) {
    return (
      <div className={cn("w-full max-w-md mx-auto", className)} {...props}>
        <div className="text-center py-8">
          {error ? (
            <p className="text-destructive">{error}</p>
          ) : (
            <p>Verifying session...</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("w-full max-w-md mx-auto", className)} {...props}>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Reset password</h1>
          <p className="text-muted-foreground">
            Enter your new password below to complete the reset
          </p>
        </div>

        {/* Form */}
        <div className="space-y-6">
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                New password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your new password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11"
              />
              <p className="text-xs text-muted-foreground">
                Make sure your password is at least 8 characters long and
                includes a mix of letters, numbers, and symbols.
              </p>
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
              {isLoading ? "Updating password..." : "Update password"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
