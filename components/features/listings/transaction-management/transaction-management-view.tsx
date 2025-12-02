"use client";

import { useState } from "react";
import { TransactionHeader } from "./transaction-header";
import { TransactionError } from "./transaction-error";
import { TransactionTabs } from "./transaction-tabs";
import { useTransactionManagement } from "./hooks/use-transaction-management";
import { useTransactionActions } from "./hooks/use-transaction-actions";

export function TransactionManagementView() {
  const [activeTab, setActiveTab] = useState<"contributor" | "receiver">(
    "contributor"
  );

  const {
    transactionData,
    isLoading,
    error,
    stats,
    fetchTransactions,
    updateTransactionStatus,
  } = useTransactionManagement();

  const {
    handleUploadImage,
    handleComplete,
    handleReturn,
    handleCancel,
    handleViewDetails,
  } = useTransactionActions({
    transactionData,
    updateTransactionStatus,
    onRefresh: fetchTransactions,
  });

  return (
    <div className="space-y-4">
      <TransactionHeader
        stats={stats}
        isLoading={isLoading}
        onRefresh={fetchTransactions}
      />

      <TransactionError error={error} />

      <TransactionTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        transactionData={transactionData}
        isLoading={isLoading}
        onUploadImage={handleUploadImage}
        onComplete={handleComplete}
        onReturn={handleReturn}
        onCancel={handleCancel}
        onViewDetails={handleViewDetails}
      />
    </div>
  );
}
