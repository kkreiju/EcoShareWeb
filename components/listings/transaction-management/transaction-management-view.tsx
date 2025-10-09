"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabase/api";
import { toast } from "sonner";
import { TransactionHeader } from "./transaction-header";
import { TransactionError } from "./transaction-error";
import { TransactionTabs } from "./transaction-tabs";

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

  const handleComplete = async (transactionId: string, imageBase64: string) => {
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

      // Verify the current user owns the listing (security check on frontend)
      if (transaction.listing.user_id !== userId) {
        toast.error("You are not authorized to complete this transaction");
        return;
      }

      console.log("Completing transaction:", {
        tran_id: transactionId,
        current_user: userId,
        listing_owner: transaction.listing.user_id,
        buyer: transaction.tran_userId,
        status: transaction.tran_status
      });

      // API now properly expects seller's ID (current user) to authorize completion
      const response = await fetch("/api/transaction/complete-transaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          tran_id: transactionId,
          user_id: userId, // Use seller's ID (current authenticated user)
          quantity: transaction.tran_quantity,
          status: "Completed",
          image: imageBase64, // Use captured base64 image data
        }),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Unknown error" }));
        
        console.error("API Error Details:", {
          status: response.status,
          statusText: response.statusText,
          errorData,
          transactionStatus: transaction.tran_status,
          userId,
          transactionId,
          requestPayload: {
            tran_id: transactionId,
            user_id: userId,
            quantity: transaction.tran_quantity,
            status: "Completed"
          }
        });
        
        // Provide more specific error messages
        if (errorData.message === "Failed to find transaction") {
          throw new Error(
            `Transaction not found. Check that transaction ${transactionId} exists and has status '${transaction.tran_status}'.`
          );
        }
        
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
    <div className="space-y-4">
      <TransactionHeader 
        stats={stats}
        isLoading={isLoading}
        onRefresh={handleRefresh}
      />

      <TransactionError error={error} />

      <TransactionTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        transactionData={transactionData}
        isLoading={isLoading}
        onComplete={handleComplete}
        onCancel={handleCancel}
      />
    </div>
  );
}
