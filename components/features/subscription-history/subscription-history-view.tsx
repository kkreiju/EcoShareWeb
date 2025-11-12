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
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  RefreshCw,
  Receipt,
  Calendar,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Download,
  Eye,
  XCircle,
  MessageCircle,
  MapPin,
  ShoppingCart,
  Check,
} from "lucide-react";
import { stripeService, type SubscriptionHistoryItem } from "@/lib/services/stripeService";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { generateReceiptPDF } from "@/lib/services/pdfService";

interface SubscriptionHistory {
  id: string;
  plan_name: string;
  status: string;
  start_date: string;
  amount: number;
  currency: string;
  transaction_id: string;
  invoice_number: string;
  billing_details: {
    firstName: string;
    lastName: string;
    address: string;
  };
}

export function SubscriptionHistoryView() {
  const { userId, isAuthenticated } = useAuth();
  const [subscriptions, setSubscriptions] = useState<SubscriptionHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscriptionHistory = async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const historyData = await stripeService.getSubscriptionHistory(userId);
      
      // Transform backend data to display format
      const transformedSubscriptions: SubscriptionHistory[] = historyData.map((item: SubscriptionHistoryItem, index: number) => {
        // Parse sub_details if it's a string
        let billingDetails = {
          firstName: "",
          lastName: "",
          address: "",
        };

        if (item.sub_details) {
          try {
            // Handle double-encoded JSON strings
            let parsedDetails = item.sub_details;
            if (typeof parsedDetails === "string") {
              // Remove extra quotes if present
              parsedDetails = parsedDetails.replace(/^"|"$/g, "");
              parsedDetails = JSON.parse(parsedDetails);
            }
            billingDetails = parsedDetails as typeof billingDetails;
          } catch (e) {
            console.error("Error parsing sub_details:", e);
          }
        }

        // Handle date - the database field is sub_dateTime, but API might return created_at
        const subscriptionDate = item.sub_dateTime || item.created_at || new Date().toISOString();

        // Generate transaction ID and invoice number
        const transactionId = `TXN-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
        const invoiceNumber = `INV-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

        return {
          id: `sub_${index + 1}`,
          plan_name: "Premium Plan",
          status: item.sub_status || "Successful",
          start_date: subscriptionDate,
          amount: item.sub_amountDue / 100, // Convert cents to dollars
          currency: "USD",
          transaction_id: transactionId,
          invoice_number: invoiceNumber,
          billing_details: billingDetails,
        };
      });

      setSubscriptions(transformedSubscriptions);
    } catch (err) {
      console.error("Error fetching subscription history:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load subscription history"
      );
      toast.error("Failed to load subscription history");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && userId) {
      fetchSubscriptionHistory();
    }
  }, [userId, isAuthenticated]);

  const handleRefresh = () => {
    fetchSubscriptionHistory();
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "N/A";
    }
    
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
    const statusLower = status.toLowerCase();
    if (statusLower.includes("success")) {
      return "bg-green-100 text-green-800 border-green-200";
    } else if (statusLower.includes("fail") || statusLower.includes("cancel")) {
      return "bg-red-100 text-red-800 border-red-200";
    } else if (statusLower.includes("pending")) {
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    } else {
      return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes("success")) {
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    } else if (statusLower.includes("fail") || statusLower.includes("cancel")) {
      return <XCircle className="h-4 w-4 text-red-600" />;
    } else if (statusLower.includes("pending")) {
      return <Calendar className="h-4 w-4 text-yellow-600" />;
    } else {
      return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const handlePrintReceipt = async (subscription: SubscriptionHistory) => {
    try {
      await generateReceiptPDF({
        planName: subscription.plan_name,
        amount: subscription.amount,
        currency: subscription.currency,
        date: formatDate(subscription.start_date),
        status: subscription.status,
        transactionId: subscription.transaction_id,
        invoiceNumber: subscription.invoice_number,
        billingDetails: subscription.billing_details,
      });
      toast.success("Receipt downloaded successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate receipt PDF");
    }
  };

  const premiumFeatures = [
    {
      icon: MessageCircle,
      title: "Chatbot Finds Listings Faster",
      description:
        "Discover relevant food waste and compostable materials listings instantly with our smart chatbot assistant",
    },
    {
      icon: MapPin,
      title: "See Listings Nearby You",
      description:
        "Unlock access to local listings and connect with providers and beneficiaries close to your location",
    },
    {
      icon: ShoppingCart,
      title: "Can Post Sale Listings",
      description:
        "Create and manage your own sale listings to reach more customers in your area",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Subscription History
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            View your past and current subscription payments
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
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    {/* Plan Name and Status */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 bg-muted rounded-full animate-pulse" />
                        <div className="h-6 bg-muted rounded animate-pulse w-32" />
                      </div>
                      <div className="h-6 bg-muted rounded-full animate-pulse w-20" />
                    </div>

                    {/* Dates */}
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 bg-muted rounded animate-pulse" />
                      <div className="h-4 bg-muted rounded animate-pulse w-48" />
                    </div>

                    {/* Payment Details */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 bg-muted rounded animate-pulse" />
                        <div className="h-4 bg-muted rounded animate-pulse w-32" />
                      </div>
                      <div className="h-5 bg-muted rounded animate-pulse w-20" />
                    </div>

                    {/* Premium Features */}
                    <div className="mt-4 pt-4 border-t space-y-2">
                      <div className="h-4 bg-muted rounded animate-pulse w-36 mb-3" />
                      {Array.from({ length: 3 }).map((_, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div className="h-4 w-4 bg-muted rounded-full animate-pulse flex-shrink-0" />
                          <div className="h-4 bg-muted rounded animate-pulse w-48" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <div className="h-9 bg-muted rounded animate-pulse w-32" />
                    <div className="h-9 bg-muted rounded animate-pulse w-32" />
                  </div>
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
                          Subscribed on {formatDate(subscription.start_date)}
                        </span>
                      </div>
                    </div>

                    {/* Payment Details */}
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {subscription.billing_details.firstName}{" "}
                          {subscription.billing_details.lastName}
                        </span>
                      </div>
                      <div className="text-lg font-semibold text-green-600">
                        {formatCurrency(
                          subscription.amount,
                          subscription.currency
                        )}
                      </div>
                    </div>

                    {/* Premium Features */}
                    <div className="mt-4 pt-4 border-t space-y-2">
                      <h4 className="text-sm font-semibold text-muted-foreground mb-3">
                        Premium Features:
                      </h4>
                      {premiumFeatures.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <feature.icon className="h-4 w-4 text-green-600 flex-shrink-0" />
                          <span className="text-muted-foreground">
                            {feature.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Receipt
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <Receipt className="h-5 w-5 text-green-600" />
                            Subscription Receipt
                          </DialogTitle>
                          <DialogDescription>
                            Your payment receipt for EcoShare Premium
                          </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-6 py-4">
                          {/* Receipt Details */}
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">Plan</span>
                              <span className="font-semibold">
                                {subscription.plan_name}
                              </span>
                            </div>
                            
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">Amount</span>
                              <span className="font-semibold text-green-600">
                                {formatCurrency(subscription.amount, subscription.currency)}/month
                              </span>
                            </div>
                            
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">Date</span>
                              <span className="font-semibold">
                                {formatDate(subscription.start_date)}
                              </span>
                            </div>
                            
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">Status</span>
                              <Badge
                                variant="outline"
                                className={getStatusColor(subscription.status)}
                              >
                                {subscription.status}
                              </Badge>
                            </div>
                            
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">Transaction ID</span>
                              <span className="text-sm font-mono">
                                {subscription.transaction_id}
                              </span>
                            </div>
                            
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">Invoice #</span>
                              <span className="text-sm font-mono">
                                {subscription.invoice_number}
                              </span>
                            </div>
                          </div>

                          {/* Billing Information */}
                          <div className="p-4 bg-muted rounded-lg space-y-1">
                            <Label className="text-sm font-medium">
                              Billing Information
                            </Label>
                            <p className="font-medium">
                              {subscription.billing_details.firstName}{" "}
                              {subscription.billing_details.lastName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {subscription.billing_details.address}
                            </p>
                          </div>

                          {/* Thank You Message */}
                          <div className="text-center p-4 border rounded-lg">
                            <p className="text-sm font-medium mb-1">
                              Thank you for choosing EcoShare Premium!
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Your support helps us create a more sustainable future.
                            </p>
                          </div>
                        </div>

                        <DialogFooter className="gap-2">
                          <Button
                            variant="outline"
                            onClick={() => handlePrintReceipt(subscription)}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download PDF
                          </Button>
                          <DialogClose asChild>
                            <Button
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              Close
                            </Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePrintReceipt(subscription)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </Button>
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
