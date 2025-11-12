"use client";

import { useCallback } from "react";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { Transaction, TransactionData } from "./use-transaction-management";

interface UseTransactionActionsProps {
  transactionData: TransactionData | null;
  updateTransactionStatus: (transactionId: string, status: string, type?: "contributor" | "receiver") => void;
  onRefresh?: () => void;
}

interface UseTransactionActionsReturn {
  handleComplete: (transactionId: string, imageBase64: string) => Promise<void>;
  handleCancel: (transactionId: string) => Promise<void>;
  handleViewDetails: (listingId: string) => void;
}

/**
 * Custom hook for transaction actions (complete, cancel, view details)
 */
export function useTransactionActions({
  transactionData,
  updateTransactionStatus,
  onRefresh,
}: UseTransactionActionsProps): UseTransactionActionsReturn {
  const { userId } = useAuth();

  const handleComplete = useCallback(async (transactionId: string, imageBase64: string) => {
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

      // API now properly expects seller's ID (current user) to authorize completion
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
          image: imageBase64,
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
        });
        
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
        updateTransactionStatus(transactionId, "Completed", "contributor");
        onRefresh?.();

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
      throw error;
    }
  }, [userId, transactionData, updateTransactionStatus, onRefresh]);

  const handleCancel = useCallback(async (transactionId: string) => {
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
        updateTransactionStatus(transactionId, "Cancelled");

        toast.success("Transaction cancelled", {
          description: `Transaction ${transactionId} has been cancelled successfully.`,
          duration: 4000,
        });
        onRefresh?.();
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
      throw error;
    }
  }, [userId, updateTransactionStatus, onRefresh]);

  const handleViewDetails = useCallback((listingId: string) => {
    window.open(`/user/listing/${listingId}`, '_blank');
  }, []);

  return {
    handleComplete,
    handleCancel,
    handleViewDetails,
  };
}

