"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Trash2,
  Eye,
  Package,
  DollarSign,
  Calendar,
} from "lucide-react";

interface TransactionListing {
  list_id: string;
  title: string;
  type: string;
  imageURL: string;
  status: "completed" | "cancelled" | "deleted";
  price: number;
  postedDate: string;
  completedDate?: string;
  cancelledDate?: string;
  deletedDate?: string;
  transaction_amount?: number;
  buyer_info?: {
    name: string;
    email: string;
  };
}

interface TransactionManagementTableProps {
  transactions: TransactionListing[];
}

export function TransactionManagementTable({
  transactions,
}: TransactionManagementTableProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      case "deleted":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "deleted":
        return <Trash2 className="h-4 w-4 text-gray-600" />;
      default:
        return <CheckCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTypeIcon = (type: string) => {
    return type === "donation" ? (
      <Package className="h-4 w-4 text-blue-600" />
    ) : (
      <DollarSign className="h-4 w-4 text-green-600" />
    );
  };

  const getTypeColor = (type: string) => {
    return type === "donation"
      ? "bg-blue-100 text-blue-800 border-blue-200"
      : "bg-green-100 text-green-800 border-green-200";
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getTransactionDate = (transaction: TransactionListing) => {
    switch (transaction.status) {
      case "completed":
        return transaction.completedDate;
      case "cancelled":
        return transaction.cancelledDate;
      case "deleted":
        return transaction.deletedDate;
      default:
        return transaction.postedDate;
    }
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-muted-foreground mb-2">
          No transactions found
        </h3>
        <p className="text-sm text-muted-foreground">
          There are no transactions matching your current filter.
        </p>
      </div>
    );
  }

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-card">
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-muted/50">
            <TableHead className="w-16"></TableHead>
            <TableHead>Listing</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Buyer</TableHead>
            <TableHead className="hidden lg:table-cell">Date</TableHead>
            <TableHead className="w-16"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow
              key={transaction.list_id}
              className="border-border hover:bg-muted/50"
            >
              <TableCell>
                <div className="flex items-center justify-center">
                  {getStatusIcon(transaction.status)}
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="font-medium flex items-center gap-2">
                    <img
                      src={transaction.imageURL}
                      alt={transaction.title}
                      className="w-8 h-8 rounded object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder-image.jpg";
                      }}
                    />
                    <span className="line-clamp-1">{transaction.title}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Posted {formatDate(transaction.postedDate)}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={getTypeColor(transaction.type)}
                >
                  {transaction.type}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={getStatusColor(transaction.status)}
                >
                  {transaction.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  {transaction.transaction_amount !== undefined ? (
                    <span className="font-medium">
                      {formatCurrency(transaction.transaction_amount)}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                  {transaction.price > 0 && (
                    <div className="text-xs text-muted-foreground">
                      Listed: {formatCurrency(transaction.price)}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {transaction.buyer_info ? (
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">
                        {getInitials(transaction.buyer_info.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden sm:block">
                      <div className="text-sm font-medium">
                        {transaction.buyer_info.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {transaction.buyer_info.email}
                      </div>
                    </div>
                  </div>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                <div className="text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(
                      getTransactionDate(transaction) || transaction.postedDate
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
