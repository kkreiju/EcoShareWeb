"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabase/api";

interface Listing {
  user_id: string;
  list_title: string;
  list_type: string;
  list_imageURL: string;
  list_description: string;
  list_tags: string;
  list_price: number;
  list_quantity: number;
  list_unit?: string;
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

export interface Transaction {
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

export interface TransactionData {
  contributor: Transaction[];
  receiver: Transaction[];
  contributor_count: number;
  receiver_count: number;
}

interface UseTransactionManagementReturn {
  transactionData: TransactionData | null;
  isLoading: boolean;
  error: string | null;
  stats: {
    contributorTotal: number;
    receiverTotal: number;
    total: number;
  };
  fetchTransactions: () => Promise<void>;
  updateTransactionStatus: (transactionId: string, status: string, type?: "contributor" | "receiver") => void;
}

/**
 * Custom hook for managing transaction data fetching and state
 */
export function useTransactionManagement(): UseTransactionManagementReturn {
  const { userId, isAuthenticated, loading: authLoading } = useAuth();
  const [transactionData, setTransactionData] = useState<TransactionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBuyerNames = useCallback(async (
    transactions: Transaction[],
    currentUserId: string
  ): Promise<Transaction[]> => {
    // Get unique buyer IDs from transactions
    const buyerIds = [
      ...new Set(
        transactions
          .filter((t) => t.tran_userId !== currentUserId)
          .map((t) => t.tran_userId)
      ),
    ];

    if (buyerIds.length === 0) return transactions;

    try {
      const { data: buyers, error } = await supabase
        .from("User")
        .select("user_id, user_firstName, user_lastName")
        .in("user_id", buyerIds);

      if (error) {
        console.error("Error fetching buyer names:", error);
        return transactions;
      }

      // Create a map of user_id to full name
      const buyerNameMap = new Map<string, string>();
      buyers?.forEach((buyer) => {
        const fullName = `${buyer.user_firstName || ""} ${buyer.user_lastName || ""}`.trim();
        buyerNameMap.set(buyer.user_id, fullName || buyer.user_id);
      });

      // Update transactions with buyer names
      return transactions.map((transaction) => ({
        ...transaction,
        buyer_name: buyerNameMap.get(transaction.tran_userId) || transaction.tran_userId,
      }));
    } catch (err) {
      console.error("Error in fetchBuyerNames:", err);
      return transactions;
    }
  }, []);

  const fetchTransactions = useCallback(async () => {
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
        // Fetch buyer names for transactions
        const contributorWithNames = await fetchBuyerNames(
          data.contributor || [],
          userId
        );
        const receiverWithNames = await fetchBuyerNames(
          data.receiver || [],
          userId
        );

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
  }, [userId, fetchBuyerNames]);

  useEffect(() => {
    if (!authLoading && isAuthenticated && userId) {
      fetchTransactions();
    } else if (!authLoading && !isAuthenticated) {
      setError("Please log in to view transactions");
      setIsLoading(false);
    }
  }, [authLoading, isAuthenticated, userId, fetchTransactions]);

  const updateTransactionStatus = useCallback((
    transactionId: string,
    status: string,
    type?: "contributor" | "receiver"
  ) => {
    setTransactionData((prev) => {
      if (!prev) return null;

      const updateTransaction = (t: Transaction) =>
        t.tran_id === transactionId ? { ...t, tran_status: status } : t;

      if (type === "contributor") {
        return {
          ...prev,
          contributor: prev.contributor.map(updateTransaction),
        };
      } else if (type === "receiver") {
        return {
          ...prev,
          receiver: prev.receiver.map(updateTransaction),
        };
      } else {
        // Update in both if type not specified
        return {
          ...prev,
          contributor: prev.contributor.map(updateTransaction),
          receiver: prev.receiver.map(updateTransaction),
        };
      }
    });
  }, []);

  // Calculate stats
  const stats = transactionData
    ? {
        contributorTotal: transactionData.contributor_count,
        receiverTotal: transactionData.receiver_count,
        total: transactionData.contributor_count + transactionData.receiver_count,
      }
    : {
        contributorTotal: 0,
        receiverTotal: 0,
        total: 0,
      };

  return {
    transactionData,
    isLoading,
    error,
    stats,
    fetchTransactions,
    updateTransactionStatus,
  };
}

