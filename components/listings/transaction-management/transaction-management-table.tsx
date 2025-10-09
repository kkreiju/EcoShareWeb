"use client";

import { Table, TableBody } from "@/components/ui/table";
import { TransactionEmptyState } from "./transaction-empty-state";
import { TransactionTableHeader } from "./transaction-table-header";
import { TransactionRow } from "./transaction-row";

interface Listing {
  user_id: string;
  list_title: string;
  list_type: string;
  list_imageURL: string;
  list_description: string;
  list_tags: string;
  list_price: number;
  list_quantity: number;
  list_pickupTimeAvailability: string;
  list_pickupInstructions: string;
  list_locationName: string;
  list_latitude: number;
  list_longitude: number;
  list_postedDate: string;
  list_availabilityStatus: string;
  list_id: string;
  user_firstName?: string;
  user_lastName?: string;
}

interface Transaction {
  list_id: string;
  tran_userId: string;
  tran_amount: number;
  tran_quantity: number;
  tran_dateTime: string;
  tran_status: string;
  tran_id: string;
  listing: Listing;
  buyer_name?: string;
}

interface TransactionManagementTableProps {
  transactions: Transaction[];
  type: "contributor" | "receiver";
  onComplete?: (transactionId: string, imageBase64: string) => void;
  onCancel?: (transactionId: string) => void;
}

export function TransactionManagementTable({
  transactions,
  type,
  onComplete,
  onCancel,
}: TransactionManagementTableProps) {
  if (transactions.length === 0) {
    return <TransactionEmptyState type={type} />;
  }

  return (
    <div className="border border-border/50 rounded-xl overflow-hidden bg-gradient-to-br from-card to-muted/10 shadow-sm hover:shadow-md transition-all duration-200">
      <Table>
        <TransactionTableHeader type={type} />
        <TableBody>
          {transactions.map((transaction, index) => (
            <TransactionRow
              key={transaction.tran_id}
              transaction={transaction}
              index={index}
              type={type}
              onComplete={onComplete}
              onCancel={onCancel}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
