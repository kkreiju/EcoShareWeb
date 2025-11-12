"use client";

import { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { CreditCard, Loader2 } from "lucide-react";
import { stripeService } from "@/lib/services/stripeService";
import { useAuth } from "@/hooks/use-auth";

interface PaymentFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const CARD_ELEMENT_OPTIONS = {
  hidePostalCode: true, // Remove postal code field to match mobile app
  style: {
    base: {
      fontSize: "16px",
      color: "#424770",
      "::placeholder": {
        color: "#aab7c4",
      },
      fontFamily:
        'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    invalid: {
      color: "#9e2146",
    },
  },
};

// Subscription plan configuration
const SUBSCRIPTION_PLAN = {
  planId: "premium_monthly",
  planName: "Premium Plan",
  amount: 500, // $5.00 in cents
  currency: "usd",
  interval: "month",
};

export function PaymentForm({ onSuccess, onCancel }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { userId } = useAuth();

  const [isProcessing, setIsProcessing] = useState(false);
  const [billingInfo, setBillingInfo] = useState({
    firstName: "",
    lastName: "",
    address: "",
  });

  const handleInputChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setBillingInfo((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      toast.error("Stripe not loaded");
      return;
    }

    if (!userId) {
      toast.error("User not authenticated");
      return;
    }

    // Validate billing info
    if (
      !billingInfo.firstName.trim() ||
      !billingInfo.lastName.trim() ||
      !billingInfo.address.trim()
    ) {
      toast.error("Please fill in all billing information");
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      toast.error("Card element not found");
      return;
    }

    setIsProcessing(true);

    try {
      // Step 1: Create payment method
      const { error: paymentMethodError, paymentMethod } =
        await stripe.createPaymentMethod({
          type: "card",
          card: cardElement,
          billing_details: {
            name: `${billingInfo.firstName} ${billingInfo.lastName}`,
            address: {
              line1: billingInfo.address,
            },
          },
        });

      if (paymentMethodError) {
        toast.error(paymentMethodError.message || "Payment method creation failed");
        return;
      }

      if (!paymentMethod) {
        toast.error("Failed to create payment method");
        return;
      }

      // Step 2: Create payment intent on backend
      toast.loading("Processing payment...", { id: "payment-processing" });

      const paymentIntentResponse = await stripeService.createPaymentIntent({
        userId: userId,
        planId: SUBSCRIPTION_PLAN.planId,
        planName: SUBSCRIPTION_PLAN.planName,
        amount: SUBSCRIPTION_PLAN.amount,
        currency: SUBSCRIPTION_PLAN.currency,
        interval: SUBSCRIPTION_PLAN.interval,
        billing_information_firstName: billingInfo.firstName,
        billing_information_lastName: billingInfo.lastName,
        billing_information_address: billingInfo.address,
      });

      if (!paymentIntentResponse) {
        throw new Error("Failed to create payment intent");
      }

      // Step 3: Confirm payment with Stripe
      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
        paymentIntentResponse.client_secret,
        {
          payment_method: paymentMethod.id,
        }
      );

      if (confirmError) {
        toast.error(confirmError.message || "Payment confirmation failed", {
          id: "payment-processing",
        });
        return;
      }

      if (paymentIntent?.status === "succeeded") {
        toast.success("Payment successful! Welcome to Premium!", {
          id: "payment-processing",
          description: "Your subscription is now active.",
        });
        onSuccess();
      } else {
        toast.error("Payment was not successful. Please try again.", {
          id: "payment-processing",
        });
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(
        error instanceof Error ? error.message : "Payment failed. Please try again.",
        { id: "payment-processing" }
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Billing Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Billing Information
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">
              First Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="firstName"
              type="text"
              value={billingInfo.firstName}
              onChange={handleInputChange("firstName")}
              placeholder="John"
              required
              disabled={isProcessing}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">
              Last Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="lastName"
              type="text"
              value={billingInfo.lastName}
              onChange={handleInputChange("lastName")}
              placeholder="Doe"
              required
              disabled={isProcessing}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">
            Address <span className="text-red-500">*</span>
          </Label>
          <Input
            id="address"
            type="text"
            value={billingInfo.address}
            onChange={handleInputChange("address")}
            placeholder="123 Main St, City, State, ZIP"
            required
            disabled={isProcessing}
          />
        </div>
      </div>

      {/* Card Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Card Details</h3>

        <div className="space-y-2">
          <Label>
            Card Information <span className="text-red-500">*</span>
          </Label>
          <div className="border rounded-md p-3 bg-white">
            <CardElement options={CARD_ELEMENT_OPTIONS} className="w-full" />
          </div>
        </div>
      </div>

      {/* Subscription Summary */}
      <div className="bg-muted/30 rounded-lg p-4 space-y-2">
        <div className="flex justify-between items-center">
          <span className="font-medium">Premium Plan</span>
          <span className="font-semibold">$5.00/month</span>
        </div>
        <div className="text-sm text-muted-foreground">
          Billed monthly. Cancel anytime.
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isProcessing}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={!stripe || isProcessing}
          className="flex-1 bg-primary hover:bg-primary/90"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4 mr-2" />
              Pay $5.00
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
