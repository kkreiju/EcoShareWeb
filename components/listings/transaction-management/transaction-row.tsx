"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { Calendar, MapPin, User } from "lucide-react";
import { StatusBadge, TypeBadge, getStatusIcon, getTypeIcon } from "./transaction-badges";
import { TransactionActions } from "./transaction-actions";

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

interface TransactionRowProps {
  transaction: Transaction;
  index: number;
  type: "contributor" | "receiver";
  onComplete?: (transactionId: string, imageBase64: string) => void;
  onCancel?: (transactionId: string) => void;
  onViewDetails?: (listingId: string) => void;
}

export function TransactionRow({
  transaction,
  index,
  type,
  onComplete,
  onCancel,
  onViewDetails,
}: TransactionRowProps) {
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
      currency: "PHP",
    }).format(amount);
  };

  return (
    <TableRow
      className={`border-border/50 hover:bg-muted/30 transition-all duration-200 ${
        index % 2 === 0 ? 'bg-background/50' : 'bg-muted/5'
      }`}
    >
      <TableCell className="text-center">
        <div className="flex items-center justify-center">
          <div className="p-1 rounded-full bg-background border border-border/30">
            {getStatusIcon(transaction.tran_status)}
          </div>
        </div>
      </TableCell>
      <TableCell className="py-4">
        <div className="flex items-start gap-3">
          <div className="relative">
            <img
              src={transaction.listing.list_imageURL}
              alt={transaction.listing.list_title}
              className="w-12 h-12 rounded-lg object-cover border border-border/30 shadow-sm"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/placeholder-image.jpg";
              }}
            />
            <div className="absolute -top-1 -right-1 p-0.5 bg-background border border-border/50 rounded-full shadow-sm">
              {getTypeIcon(transaction.listing.list_type)}
            </div>
          </div>
          <div className="space-y-1 flex-1 min-w-0">
            <h4 className="font-semibold text-foreground line-clamp-1 text-sm">
              {transaction.listing.list_title}
            </h4>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3 flex-shrink-0" />
              <span>Posted {formatDate(transaction.listing.list_postedDate)}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground line-clamp-1">
              <MapPin className="h-3 w-3 flex-shrink-0" />
              <span className="line-clamp-1">{transaction.listing.list_locationName?.replace(/^[A-Z0-9+]+\+\w+,?\s*/, '')}</span>
            </div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <TypeBadge type={transaction.listing.list_type} />
      </TableCell>
      <TableCell>
        <StatusBadge status={transaction.tran_status} />
      </TableCell>
      <TableCell>
        <div className="space-y-1">
          {transaction.tran_amount > 0 ? (
            <div className="font-semibold text-foreground text-sm">
              {formatCurrency(transaction.tran_amount)}
            </div>
          ) : (
            <div className="font-semibold text-green-600 text-sm">Free</div>
          )}
          <div className="text-xs text-muted-foreground">
            Qty: {transaction.tran_quantity}
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
            <User className="h-4 w-4 text-primary" />
          </div>
          <div className="space-y-1">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {type === "contributor" ? "Buyer" : "Seller"}
            </div>
            <div className="font-medium text-foreground text-sm line-clamp-1">
              {type === "contributor" ? (
                transaction.buyer_name || transaction.tran_userId
              ) : (
                transaction.listing.user_firstName &&
                transaction.listing.user_lastName
                  ? `${transaction.listing.user_firstName} ${transaction.listing.user_lastName}`.trim()
                  : transaction.listing.user_id
              )}
            </div>
          </div>
        </div>
      </TableCell>
      <TableCell className="hidden lg:table-cell">
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Calendar className="h-3 w-3 flex-shrink-0" />
            <span>{formatDate(transaction.tran_dateTime)}</span>
          </div>
          <div className="text-xs text-muted-foreground">
            {new Date(transaction.tran_dateTime).toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        </div>
      </TableCell>
      <TableCell className="text-center">
        <TransactionActions
          type={type}
          transactionId={transaction.tran_id}
          transactionStatus={transaction.tran_status}
          listingTitle={transaction.listing.list_title}
          listingId={transaction.list_id}
          onComplete={onComplete}
          onCancel={onCancel}
          onViewDetails={onViewDetails}
        />
      </TableCell>
    </TableRow>
  );
}
