"use client";

import { Package } from "lucide-react";

interface TransactionEmptyStateProps {
  type: "contributor" | "receiver";
}

export function TransactionEmptyState({ type }: TransactionEmptyStateProps) {
  const emptyStateColor = type === "contributor" ? "green" : "blue";

  return (
    <div className={`text-center py-16 rounded-xl bg-gradient-to-br from-${emptyStateColor}-50/50 to-${emptyStateColor}-100/30 dark:from-${emptyStateColor}-950/20 dark:to-${emptyStateColor}-900/10`}>
      <div className={`p-4 mx-auto w-fit bg-${emptyStateColor}-100 dark:bg-${emptyStateColor}-900/30 rounded-full border border-${emptyStateColor}-200/50 dark:border-${emptyStateColor}-800/50 mb-6`}>
        <Package className={`h-12 w-12 text-${emptyStateColor}-600 dark:text-${emptyStateColor}-400`} />
      </div>
      <h3 className={`text-lg font-semibold text-${emptyStateColor}-800 dark:text-${emptyStateColor}-300 mb-2`}>
        No {type === "contributor" ? "sold items" : "purchased items"} found
      </h3>
      <p className={`text-sm text-${emptyStateColor}-600/80 dark:text-${emptyStateColor}-400/80`}>
        {type === "contributor"
          ? "You haven't sold any items yet. Start listing items to see your sales here."
          : "You haven't purchased any items yet. Browse listings to make your first purchase."
        }
      </p>
    </div>
  );
}
