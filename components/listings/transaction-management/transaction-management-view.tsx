"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  RefreshCw,
  CheckCircle,
  XCircle,
  Trash2,
  AlertCircle,
  Package,
  Calendar,
  DollarSign,
} from "lucide-react";
import { TransactionManagementTable } from "./transaction-management-table";
import { TransactionManagementSkeleton } from "./loading-skeleton";

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

export function TransactionManagementView() {
  const [transactions, setTransactions] = useState<TransactionListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<
    "all" | "completed" | "cancelled" | "deleted"
  >("all");

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // TODO: Replace with actual API call
      // const response = await fetch('/api/user/transaction-history');
      // const data = await response.json();

      // Mock data for now
      const mockTransactions: TransactionListing[] = [
        {
          list_id: "1",
          title: "Organic Tomatoes",
          type: "donation",
          imageURL: "/images/tomatoes.jpg",
          status: "completed",
          price: 0,
          postedDate: "2024-01-15T10:30:00Z",
          completedDate: "2024-01-20T14:30:00Z",
          transaction_amount: 0,
          buyer_info: {
            name: "John Doe",
            email: "john@example.com",
          },
        },
        {
          list_id: "2",
          title: "Used Bicycle",
          type: "sale",
          imageURL: "/images/bicycle.jpg",
          status: "completed",
          price: 150,
          postedDate: "2024-01-10T09:00:00Z",
          completedDate: "2024-01-18T16:45:00Z",
          transaction_amount: 150,
          buyer_info: {
            name: "Jane Smith",
            email: "jane@example.com",
          },
        },
        {
          list_id: "3",
          title: "Garden Tools Set",
          type: "sale",
          imageURL: "/images/tools.jpg",
          status: "cancelled",
          price: 75,
          postedDate: "2024-01-12T11:15:00Z",
          cancelledDate: "2024-01-16T13:20:00Z",
          transaction_amount: 0,
        },
        {
          list_id: "4",
          title: "Old Furniture",
          type: "donation",
          imageURL: "/images/furniture.jpg",
          status: "deleted",
          price: 0,
          postedDate: "2024-01-08T08:30:00Z",
          deletedDate: "2024-01-14T10:00:00Z",
        },
        {
          list_id: "5",
          title: "Composting Materials",
          type: "sale",
          imageURL: "/images/compost.jpg",
          status: "completed",
          price: 25,
          postedDate: "2024-01-05T15:45:00Z",
          completedDate: "2024-01-12T12:30:00Z",
          transaction_amount: 25,
          buyer_info: {
            name: "Bob Johnson",
            email: "bob@example.com",
          },
        },
      ];

      setTransactions(mockTransactions);
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load transactions"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleRefresh = () => {
    fetchTransactions();
  };

  // Filter transactions based on active filter
  const filteredTransactions = transactions.filter((transaction) => {
    if (activeFilter === "all") return true;
    return transaction.status === activeFilter;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "deleted":
        return <Trash2 className="h-4 w-4 text-gray-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
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

  // Calculate stats
  const stats = {
    completed: transactions.filter((t) => t.status === "completed").length,
    cancelled: transactions.filter((t) => t.status === "cancelled").length,
    deleted: transactions.filter((t) => t.status === "deleted").length,
    total: transactions.length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Transaction Management
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            View and manage your completed, cancelled, and deleted listings
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
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
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Completed
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {isLoading ? "..." : stats.completed}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Cancelled
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {isLoading ? "..." : stats.cancelled}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gray-100 rounded-lg">
                <Trash2 className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Deleted
                </p>
                <p className="text-2xl font-bold text-gray-600">
                  {isLoading ? "..." : stats.deleted}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Transactions
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {isLoading ? "..." : stats.total}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert className="border-destructive/50 text-destructive dark:border-destructive dark:text-destructive">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Filter Buttons */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-green-600" />
            Transaction History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            <Button
              variant={activeFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter("all")}
              className="flex items-center gap-2"
            >
              <Package className="h-4 w-4" />
              All ({stats.total})
            </Button>
            <Button
              variant={activeFilter === "completed" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter("completed")}
              className="flex items-center gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              Completed ({stats.completed})
            </Button>
            <Button
              variant={activeFilter === "cancelled" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter("cancelled")}
              className="flex items-center gap-2"
            >
              <XCircle className="h-4 w-4" />
              Cancelled ({stats.cancelled})
            </Button>
            <Button
              variant={activeFilter === "deleted" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter("deleted")}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Deleted ({stats.deleted})
            </Button>
          </div>

          {/* Transaction Table */}
          {isLoading ? (
            <TransactionManagementSkeleton />
          ) : (
            <TransactionManagementTable transactions={filteredTransactions} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
