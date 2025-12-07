"use client";

import { useState, useEffect } from "react";
import { TransactionHeader } from "./transaction-header";
import { TransactionError } from "./transaction-error";
import { TransactionTabs } from "./transaction-tabs";
import { useTransactionManagement } from "./hooks/use-transaction-management";
import { useTransactionActions } from "./hooks/use-transaction-actions";

export function TransactionManagementView() {
  const [activeTab, setActiveTab] = useState<"contributor" | "receiver">(
    "contributor"
  );
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Reset filters when tab changes
  useEffect(() => {
    setFilterStatus("all");
  }, [activeTab]);

  const {
    transactionData,
    isLoading,
    error,
    stats,
    fetchTransactions,
    updateTransactionStatus,
  } = useTransactionManagement();

  // Filter data based on selected status filters
  const filteredData = transactionData
    ? {
        ...transactionData,
        contributor: transactionData.contributor.filter(
          (t) =>
            filterStatus === "all" || t.tran_status === filterStatus
        ),
        receiver: transactionData.receiver.filter(
          (t) =>
            filterStatus === "all" || t.tran_status === filterStatus
        ),
      }
    : null;

  const {
    handleUploadImage,
    handleComplete,
    handleReturn,
    handleCancel,
    handleViewDetails,
  } = useTransactionActions({
    transactionData: filteredData,
    updateTransactionStatus,
    onRefresh: fetchTransactions,
  });

  return (
    <div className="space-y-4">
      <TransactionHeader
        stats={stats}
        isLoading={isLoading}
        onRefresh={fetchTransactions}
        activeTab={activeTab}
        filterStatus={filterStatus}
        onFilterChange={setFilterStatus}
      />

      <TransactionError error={error} />

      <TransactionTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        transactionData={filteredData}
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
