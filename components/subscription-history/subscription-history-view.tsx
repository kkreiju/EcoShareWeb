"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  RefreshCw,
  Receipt,
  Calendar,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Download,
  Eye,
} from "lucide-react";

interface SubscriptionHistory {
  id: string;
  plan_name: string;
  status: "active" | "expired" | "cancelled" | "pending";
  start_date: string;
  end_date: string;
  amount: number;
  currency: string;
  payment_method: string;
  receipt_url?: string;
}

export function SubscriptionHistoryView() {
  const [subscriptions, setSubscriptions] = useState<SubscriptionHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReceipt, setSelectedReceipt] =
    useState<SubscriptionHistory | null>(null);

  const fetchSubscriptionHistory = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // TODO: Replace with actual API call
      // const response = await fetch('/api/user/subscription-history');
      // const data = await response.json();

      // Mock data for now
      const mockSubscriptions: SubscriptionHistory[] = [
        {
          id: "sub_1",
          plan_name: "EcoShare Pro Monthly",
          status: "active",
          start_date: "2024-01-15T00:00:00Z",
          end_date: "2024-02-15T00:00:00Z",
          amount: 9.99,
          currency: "USD",
          payment_method: "**** **** **** 4242",
          receipt_url: "#",
        },
        {
          id: "sub_2",
          plan_name: "EcoShare Pro Yearly",
          status: "expired",
          start_date: "2023-12-15T00:00:00Z",
          end_date: "2024-01-15T00:00:00Z",
          amount: 99.99,
          currency: "USD",
          payment_method: "**** **** **** 4242",
          receipt_url: "#",
        },
        {
          id: "sub_3",
          plan_name: "EcoShare Pro Monthly",
          status: "cancelled",
          start_date: "2023-11-15T00:00:00Z",
          end_date: "2023-12-15T00:00:00Z",
          amount: 9.99,
          currency: "USD",
          payment_method: "**** **** **** 4242",
          receipt_url: "#",
        },
      ];

      setSubscriptions(mockSubscriptions);
    } catch (err) {
      console.error("Error fetching subscription history:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load subscription history"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptionHistory();
  }, []);

  const handleRefresh = () => {
    fetchSubscriptionHistory();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "expired":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "expired":
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
      case "cancelled":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case "pending":
        return <Calendar className="h-4 w-4 text-yellow-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const handleViewReceipt = (subscription: SubscriptionHistory) => {
    setSelectedReceipt(subscription);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Subscription History
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            View your past and current subscription plans and receipts
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

      {/* Error Alert */}
      {error && (
        <Alert className="border-destructive/50 text-destructive dark:border-destructive dark:text-destructive">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Subscription History */}
      <div className="space-y-4">
        {isLoading ? (
          // Loading skeleton
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="h-5 bg-muted rounded animate-pulse w-48" />
                    <div className="h-4 bg-muted rounded animate-pulse w-32" />
                    <div className="h-4 bg-muted rounded animate-pulse w-40" />
                  </div>
                  <div className="h-6 bg-muted rounded animate-pulse w-20" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : subscriptions.length === 0 ? (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                No subscription history
              </h3>
              <p className="text-sm text-muted-foreground">
                You haven't had any subscriptions yet.
              </p>
            </CardContent>
          </Card>
        ) : (
          subscriptions.map((subscription) => (
            <Card key={subscription.id} className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    {/* Plan Name and Status */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(subscription.status)}
                        <h3 className="text-lg font-semibold">
                          {subscription.plan_name}
                        </h3>
                      </div>
                      <Badge
                        variant="outline"
                        className={getStatusColor(subscription.status)}
                      >
                        {subscription.status}
                      </Badge>
                    </div>

                    {/* Dates */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {formatDate(subscription.start_date)} -{" "}
                          {formatDate(subscription.end_date)}
                        </span>
                      </div>
                    </div>

                    {/* Payment Details */}
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                        <span>{subscription.payment_method}</span>
                      </div>
                      <div className="text-lg font-semibold text-green-600">
                        {formatCurrency(
                          subscription.amount,
                          subscription.currency
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewReceipt(subscription)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Receipt
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <Receipt className="h-5 w-5 text-green-600" />
                            Receipt - {subscription.plan_name}
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="border rounded-lg p-4 space-y-3">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Plan:
                              </span>
                              <span className="font-medium">
                                {subscription.plan_name}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Period:
                              </span>
                              <span className="font-medium">
                                {formatDate(subscription.start_date)} -{" "}
                                {formatDate(subscription.end_date)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Amount:
                              </span>
                              <span className="font-medium text-green-600">
                                {formatCurrency(
                                  subscription.amount,
                                  subscription.currency
                                )}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Payment Method:
                              </span>
                              <span className="font-medium">
                                {subscription.payment_method}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Status:
                              </span>
                              <Badge
                                variant="outline"
                                className={getStatusColor(subscription.status)}
                              >
                                {subscription.status}
                              </Badge>
                            </div>
                          </div>

                          <div className="flex gap-2 pt-4">
                            <Button
                              variant="outline"
                              className="flex-1"
                              onClick={() => setSelectedReceipt(null)}
                            >
                              Close
                            </Button>
                            <Button className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                              <Download className="h-4 w-4 mr-2" />
                              Download PDF
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
