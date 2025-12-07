"use client";

import { Button } from "@/components/ui/button";
import { RefreshCw, Package, Users } from "lucide-react";
import { TransactionFilter } from "./transaction-filter";

interface Stats {
  contributorTotal: number;
  receiverTotal: number;
  total: number;
}

interface TransactionHeaderProps {
  stats: Stats;
  isLoading: boolean;
  onRefresh: () => void;
  activeTab: "contributor" | "receiver";
  filterStatus: string;
  onFilterChange: (filter: string) => void;
}

export function TransactionHeader({
  stats,
  isLoading,
  onRefresh,
  activeTab,
  filterStatus,
  onFilterChange,
}: TransactionHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Transaction Management
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            View and manage your completed, cancelled, and deleted listings
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isLoading}
          className="border-border w-full sm:w-auto justify-center sm:justify-start"
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 flex-shrink-0 ${
              isLoading ? "animate-spin" : ""
            }`}
          />
          <span className="truncate">Refresh</span>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {!isLoading ? (
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <div className="flex items-center gap-1 px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full border border-green-200/50 dark:border-green-700/50">
              <Package className="h-3 w-3" />
              <span className="font-medium">{stats.contributorTotal} Sold</span>
            </div>
            <div className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full border border-blue-200/50 dark:border-blue-700/50">
              <Package className="h-3 w-3" />
              <span className="font-medium">{stats.receiverTotal} Bought</span>
            </div>
            <div className="flex items-center gap-1 px-3 py-1.5 bg-muted/80 text-muted-foreground rounded-full border border-border/50">
              <Users className="h-3 w-3" />
              <span className="font-medium">{stats.total} Total</span>
            </div>
          </div>
        ) : (
          <div />
        )}

        <div className="self-start sm:self-auto">
          <TransactionFilter
            activeTab={activeTab}
            selectedFilter={filterStatus}
            onFilterChange={onFilterChange}
          />
        </div>
      </div>
    </div>
  );
}
