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
    handleUploadImage: (transactionId: string, imageBase64: string) => Promise<void>;
    handleComplete: (transactionId: string) => Promise<void>;
    handleReturn: (transactionId: string) => Promise<void>;
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
}: UseTransactionActionsProps) {
    const { userId } = useAuth();

    const handleUploadImage = useCallback(async (transactionId: string, imageBase64: string) => {
        if (!userId) {
            toast.error("User not authenticated");
            return;
        }

        try {
            const transaction = transactionData?.contributor.find(
                (t) => t.tran_id === transactionId
            );
            if (!transaction) {
                toast.error("Transaction not found");
                return;
            }

            const response = await fetch("/api/transaction/upload-image", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    tran_id: transactionId,
                    user_id: userId,
                    quantity: transaction.tran_quantity,
                    status: "Ongoing",
                    image: imageBase64,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || "Failed to upload image");
            }

            const data = await response.json();
            if (data.success) {
                toast.success("Verification image uploaded successfully");
                onRefresh?.();
            } else {
                throw new Error(data.message || "Failed to upload image");
            }
        } catch (error) {
            console.error("Error uploading image:", error);
            toast.error("Failed to upload verification image");
            throw error;
        }
    }, [userId, transactionData, onRefresh]);

    const handleComplete = useCallback(async (transactionId: string) => {
        if (!userId) {
            toast.error("User not authenticated");
            return;
        }

        try {
            // For completion, we need to find the transaction in either list since buyers trigger this now
            const transaction =
                transactionData?.contributor.find((t) => t.tran_id === transactionId) ||
                transactionData?.receiver.find((t) => t.tran_id === transactionId);

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
                    user_id: userId, // Now the buyer's ID
                    quantity: transaction.tran_quantity,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || "Failed to complete transaction");
            }

            const data = await response.json();

            if (data.success) {
                updateTransactionStatus(transactionId, "Completed");
                onRefresh?.();
                toast.success("Transaction completed successfully");
            } else {
                throw new Error(data.message || "Failed to complete transaction");
            }
        } catch (error) {
            console.error("Error completing transaction:", error);
            toast.error(error instanceof Error ? error.message : "Failed to complete transaction");
            throw error;
        }
    }, [userId, transactionData, updateTransactionStatus, onRefresh]);

    const handleReturn = useCallback(async (transactionId: string) => {
        if (!userId) {
            toast.error("User not authenticated");
            return;
        }

        try {
            const response = await fetch("/api/transaction/return-item", {
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
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || "Failed to return item");
            }

            const data = await response.json();

            if (data.success) {
                updateTransactionStatus(transactionId, "Returned");
                onRefresh?.();
                toast.success("Item returned successfully");
            } else {
                throw new Error(data.message || "Failed to return item");
            }
        } catch (error) {
            console.error("Error returning item:", error);
            toast.error(error instanceof Error ? error.message : "Failed to return item");
            throw error;
        }
    }, [userId, updateTransactionStatus, onRefresh]);

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
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || "Failed to cancel transaction");
            }

            const data = await response.json();

            if (data.success) {
                updateTransactionStatus(transactionId, "Cancelled");
                toast.success("Transaction cancelled successfully");
                onRefresh?.();
            } else {
                throw new Error(data.message || "Failed to cancel transaction");
            }
        } catch (error) {
            console.error("Error cancelling transaction:", error);
            toast.error("Failed to cancel transaction");
            throw error;
        }
    }, [userId, updateTransactionStatus, onRefresh]);

    const handleViewDetails = useCallback((listingId: string) => {
        window.open(`/user/listing/${listingId}`, '_blank');
    }, []);

    return {
        handleUploadImage,
        handleComplete,
        handleReturn,
        handleCancel,
        handleViewDetails,
    };
}

