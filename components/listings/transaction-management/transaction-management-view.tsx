"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  Package,
  User,
  Users,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabase/api";
import { toast } from "sonner";
import { TransactionManagementTable } from "./transaction-management-table";
import { TransactionManagementSkeleton } from "./loading-skeleton";

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

interface TransactionData {
  contributor: Transaction[];
  receiver: Transaction[];
  contributor_count: number;
  receiver_count: number;
}

export function TransactionManagementView() {
  const { userId, isAuthenticated, loading: authLoading } = useAuth();
  const [transactionData, setTransactionData] =
    useState<TransactionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"contributor" | "receiver">(
    "contributor"
  );

  const fetchBuyerNames = async (
    transactions: Transaction[]
  ): Promise<Transaction[]> => {
    // Get unique buyer IDs from contributor transactions
    const buyerIds = [
      ...new Set(
        transactions
          .filter((t) => t.tran_userId !== userId) // Only fetch names for other users
          .map((t) => t.tran_userId)
      ),
    ];

    if (buyerIds.length === 0) return transactions;

    try {
      // Fetch buyer information
      const { data: buyers, error } = await supabase
        .from("User")
        .select("user_id, user_firstName, user_lastName")
        .in("user_id", buyerIds);

      if (error) {
        console.error("Error fetching buyer names:", error);
        return transactions; // Return original transactions if fetch fails
      }

      // Create a map of user_id to full name
      const buyerNameMap = new Map();
      buyers?.forEach((buyer) => {
        const fullName = `${buyer.user_firstName || ""} ${
          buyer.user_lastName || ""
        }`.trim();
        buyerNameMap.set(buyer.user_id, fullName || buyer.user_id);
      });

      // Update transactions with buyer names
      return transactions.map((transaction) => ({
        ...transaction,
        buyer_name:
          buyerNameMap.get(transaction.tran_userId) || transaction.tran_userId,
      }));
    } catch (err) {
      console.error("Error in fetchBuyerNames:", err);
      return transactions;
    }
  };

  const fetchTransactions = async () => {
    if (!userId) {
      setError("User not authenticated");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        `/api/transaction/manage-transaction?user_id=${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch transactions: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success) {
        // Fetch buyer names for contributor transactions
        const contributorWithNames = await fetchBuyerNames(
          data.contributor || []
        );
        const receiverWithNames = await fetchBuyerNames(data.receiver || []);

        setTransactionData({
          contributor: contributorWithNames,
          receiver: receiverWithNames,
          contributor_count: data.contributor_count || 0,
          receiver_count: data.receiver_count || 0,
        });
      } else {
        throw new Error(data.message || "Failed to load transactions");
      }
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
    if (!authLoading && isAuthenticated && userId) {
      fetchTransactions();
    } else if (!authLoading && !isAuthenticated) {
      setError("Please log in to view transactions");
      setIsLoading(false);
    }
  }, [authLoading, isAuthenticated, userId]);

  const handleRefresh = () => {
    fetchTransactions();
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

  // Calculate stats
  const stats = transactionData
    ? {
        contributorTotal: transactionData.contributor_count,
        receiverTotal: transactionData.receiver_count,
        total:
          transactionData.contributor_count + transactionData.receiver_count,
      }
    : {
        contributorTotal: 0,
        receiverTotal: 0,
        total: 0,
      };

  const handleComplete = async (transactionId: string) => {
    if (!userId) {
      toast.error("User not authenticated");
      return;
    }

    try {
      // Find the transaction to get details for the API call
      const transaction = transactionData?.contributor.find(
        (t) => t.tran_id === transactionId
      );
      if (!transaction) {
        toast.error("Transaction not found");
        return;
      }

      const response = await fetch("/api/transaction/complete-transaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          tran_id: transactionId,
          user_id: userId,
          quantity: transaction.tran_quantity,
          status: "Completed",
          image: transaction.listing.list_imageURL, // Use listing image as transaction image
        }),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Unknown error" }));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();

      if (data.success) {
        // Update local state to reflect the completion
        setTransactionData((prev) =>
          prev
            ? {
                ...prev,
                contributor: prev.contributor.map((t) =>
                  t.tran_id === transactionId
                    ? { ...t, tran_status: "Completed" }
                    : t
                ),
              }
            : null
        );

        toast.success("Transaction completed!", {
          description: `Transaction ${transactionId} has been completed successfully.`,
          duration: 4000,
        });
      } else {
        throw new Error(data.message || "Failed to complete transaction");
      }
    } catch (error) {
      console.error("Error completing transaction:", error);
      toast.error("Failed to complete transaction", {
        description:
          error instanceof Error
            ? error.message
            : "Please check your connection and try again.",
        duration: 4000,
      });
    }
  };

  const handleCancel = async (transactionId: string) => {
    if (!userId) {
      toast.error("User not authenticated");
      return;
    }

    try {
      const response = await fetch("/api/transaction/cancel-transaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          tran_id: transactionId,
          user_id: userId,
        }),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Unknown error" }));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();

      if (data.success) {
        // Update local state to reflect the cancellation
        setTransactionData((prev) =>
          prev
            ? {
                ...prev,
                contributor: prev.contributor.map((t) =>
                  t.tran_id === transactionId
                    ? { ...t, tran_status: "Cancelled" }
                    : t
                ),
                receiver: prev.receiver.map((t) =>
                  t.tran_id === transactionId
                    ? { ...t, tran_status: "Cancelled" }
                    : t
                ),
              }
            : null
        );

        toast.success("Transaction cancelled", {
          description: `Transaction ${transactionId} has been cancelled successfully.`,
          duration: 4000,
        });
      } else {
        throw new Error(data.message || "Failed to cancel transaction");
      }
    } catch (error) {
      console.error("Error cancelling transaction:", error);
      toast.error("Failed to cancel transaction", {
        description:
          error instanceof Error
            ? error.message
            : "Please check your connection and try again.",
        duration: 4000,
      });
    }
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Items Sold
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {isLoading ? "..." : stats.contributorTotal}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Items Bought
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {isLoading ? "..." : stats.receiverTotal}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Package className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Transactions
                </p>
                <p className="text-2xl font-bold text-purple-600">
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

      {/* Transaction Tabs */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-green-600" />
            Transaction History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={(value) =>
              setActiveTab(value as "contributor" | "receiver")
            }
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger
                value="contributor"
                className="flex items-center gap-2"
              >
                <Users className="h-4 w-4" />
                Items Sold ({stats.contributorTotal})
              </TabsTrigger>
              <TabsTrigger value="receiver" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Items Bought ({stats.receiverTotal})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="contributor" className="mt-6">
              {isLoading ? (
                <TransactionManagementSkeleton />
              ) : (
                <TransactionManagementTable
                  transactions={transactionData?.contributor || []}
                  type="contributor"
                  onComplete={handleComplete}
                  onCancel={handleCancel}
                />
              )}
            </TabsContent>

            <TabsContent value="receiver" className="mt-6">
              {isLoading ? (
                <TransactionManagementSkeleton />
              ) : (
                <TransactionManagementTable
                  transactions={transactionData?.receiver || []}
                  type="receiver"
                  onCancel={handleCancel}
                />
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
