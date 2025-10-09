"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface TransactionErrorProps {
  error: string | null;
}

export function TransactionError({ error }: TransactionErrorProps) {
  if (!error) return null;

  return (
    <Alert className="border-destructive/50 text-destructive dark:border-destructive dark:text-destructive">
      <AlertCircle className="h-4 w-4 flex-shrink-0" />
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  );
}
