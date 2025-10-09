"use client";

import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertCircle } from "lucide-react";

interface TransactionTableHeaderProps {
  type: "contributor" | "receiver";
}

export function TransactionTableHeader({ type }: TransactionTableHeaderProps) {
  return (
    <TableHeader>
      <TableRow className="border-border/50 bg-gradient-to-r from-muted/30 to-muted/10 hover:from-muted/40 hover:to-muted/20 transition-all duration-200">
        <TableHead className="w-12 text-center font-semibold">
          <div className="flex items-center justify-center">
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </div>
        </TableHead>
        <TableHead className="font-semibold text-foreground">Listing Details</TableHead>
        <TableHead className="font-semibold text-foreground">Type</TableHead>
        <TableHead className="font-semibold text-foreground">Status</TableHead>
        <TableHead className="font-semibold text-foreground">Amount</TableHead>
        <TableHead className="font-semibold text-foreground">
          {type === "contributor" ? "Buyer Info" : "Seller Info"}
        </TableHead>
        <TableHead className="hidden lg:table-cell font-semibold text-foreground">Transaction Date</TableHead>
        <TableHead className="w-12 text-center font-semibold">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
}
