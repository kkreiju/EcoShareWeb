"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package } from "lucide-react";
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

interface TransactionTabsProps {
  activeTab: "contributor" | "receiver";
  onTabChange: (value: "contributor" | "receiver") => void;
  transactionData: TransactionData | null;
  isLoading: boolean;
  onComplete: (transactionId: string, imageBase64: string) => void;
  onCancel: (transactionId: string) => void;
}

export function TransactionTabs({
  activeTab,
  onTabChange,
  transactionData,
  isLoading,
  onComplete,
  onCancel,
}: TransactionTabsProps) {
  return (
    <Card className="border border-border/50 bg-gradient-to-br from-background to-muted/20 shadow-lg hover:shadow-xl transition-all duration-200">
      <CardHeader className="border-b border-border/50 bg-gradient-to-r from-muted/30 to-muted/10">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
            <Package className="h-6 w-6 text-primary" />
          </div>
          Transaction History
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs
          value={activeTab}
          onValueChange={(value) =>
            onTabChange(value as "contributor" | "receiver")
          }
        >
          <TabsList className="grid w-full grid-cols-2 h-11 p-1 bg-muted/50 border border-border/50">
            <TabsTrigger
              value="contributor"
              className="flex items-center gap-2 h-9 text-sm font-medium data-[state=active]:bg-green-100 data-[state=active]:text-green-700 data-[state=active]:border data-[state=active]:border-green-200 dark:data-[state=active]:bg-green-900/30 dark:data-[state=active]:text-green-300 transition-all duration-200"
            >
              <div className="p-1 bg-green-500/10 rounded border border-green-200/50 dark:border-green-700/50">
                <Package className="h-3 w-3 text-green-600 dark:text-green-400" />
              </div>
              Items Sold
            </TabsTrigger>
            <TabsTrigger 
              value="receiver" 
              className="flex items-center gap-2 h-9 text-sm font-medium data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 data-[state=active]:border data-[state=active]:border-blue-200 dark:data-[state=active]:bg-blue-900/30 dark:data-[state=active]:text-blue-300 transition-all duration-200"
            >
              <div className="p-1 bg-blue-500/10 rounded border border-blue-200/50 dark:border-blue-700/50">
                <Package className="h-3 w-3 text-blue-600 dark:text-blue-400" />
              </div>
              Items Bought
            </TabsTrigger>
          </TabsList>

          <TabsContent value="contributor" className="mt-4 space-y-3">
            <div className="flex items-center gap-2 p-2.5 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200/50 dark:border-green-800/50">
              <div className="p-1 bg-green-500/10 rounded">
                <Package className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
              </div>
              <span className="text-sm font-medium text-green-700 dark:text-green-300">
                Items you have sold to other users
              </span>
            </div>
            {isLoading ? (
              <TransactionManagementSkeleton />
            ) : (
              <TransactionManagementTable
                transactions={transactionData?.contributor || []}
                type="contributor"
                onComplete={onComplete}
                onCancel={onCancel}
              />
            )}
          </TabsContent>

          <TabsContent value="receiver" className="mt-4 space-y-3">
            <div className="flex items-center gap-2 p-2.5 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200/50 dark:border-blue-800/50">
              <div className="p-1 bg-blue-500/10 rounded">
                <Package className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Items you have purchased from other users
              </span>
            </div>
            {isLoading ? (
              <TransactionManagementSkeleton />
            ) : (
              <TransactionManagementTable
                transactions={transactionData?.receiver || []}
                type="receiver"
                onCancel={onCancel}
              />
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
