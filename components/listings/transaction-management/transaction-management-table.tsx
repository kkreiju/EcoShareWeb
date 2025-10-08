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
  AlertCircle,
  Check,
  X,
} from "lucide-react";

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
  onComplete?: (transactionId: string) => void;
  onCancel?: (transactionId: string) => void;
}

export function TransactionManagementTable({
  transactions,
  type,
  onComplete,
  onCancel,
}: TransactionManagementTableProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "accepted":
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled":
      case "declined":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "accepted":
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "pending":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case "cancelled":
      case "declined":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "PHP",
    }).format(amount);
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
            <TableHead>{type === "contributor" ? "Buyer" : "Seller"}</TableHead>
            <TableHead className="hidden lg:table-cell">Date</TableHead>
            <TableHead className="w-16"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow
              key={transaction.tran_id}
              className="border-border hover:bg-muted/50"
            >
              <TableCell>
                <div className="flex items-center justify-center">
                  {getStatusIcon(transaction.tran_status)}
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="font-medium flex items-center gap-2">
                    <img
                      src={transaction.listing.list_imageURL}
                      alt={transaction.listing.list_title}
                      className="w-8 h-8 rounded object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder-image.jpg";
                      }}
                    />
                    <span className="line-clamp-1">
                      {transaction.listing.list_title}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Posted {formatDate(transaction.listing.list_postedDate)}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={getTypeColor(transaction.listing.list_type)}
                >
                  {transaction.listing.list_type}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={getStatusColor(transaction.tran_status)}
                >
                  {transaction.tran_status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  {transaction.tran_amount > 0 ? (
                    <span className="font-medium">
                      {formatCurrency(transaction.tran_amount)}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">Free</span>
                  )}
                  {transaction.listing.list_price > 0 && (
                    <div className="text-xs text-muted-foreground">
                      Listed: {formatCurrency(transaction.listing.list_price)}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  {type === "contributor" ? (
                    <div>
                      <div className="font-medium text-foreground">Buyer</div>
                      <div className="text-muted-foreground">
                        {transaction.buyer_name || transaction.tran_userId}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="font-medium text-foreground">Seller</div>
                      <div className="text-muted-foreground">
                        {transaction.listing.user_firstName &&
                        transaction.listing.user_lastName
                          ? `${transaction.listing.user_firstName} ${transaction.listing.user_lastName}`.trim()
                          : transaction.listing.user_id}
                      </div>
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                <div className="text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(transaction.tran_dateTime)}
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
                    {/* Show Complete button only for contributor (sold items) */}
                    {type === "contributor" && onComplete && (
                      <DropdownMenuItem
                        onClick={() => onComplete(transaction.tran_id)}
                        className="text-green-600 focus:text-green-600"
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Complete
                      </DropdownMenuItem>
                    )}

                    {/* Show Cancel button for both contributor and receiver */}
                    {onCancel && (
                      <DropdownMenuItem
                        onClick={() => onCancel(transaction.tran_id)}
                        className="text-red-600 focus:text-red-600"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </DropdownMenuItem>
                    )}

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
