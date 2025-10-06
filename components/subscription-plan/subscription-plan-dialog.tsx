"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  MessageCircle,
  MapPin,
  ShoppingCart,
  Check,
} from "lucide-react";
import { PaymentDialog } from "./payment-dialog";

interface SubscriptionPlanDialogProps {
  children: React.ReactNode;
}

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
    title: "Can post Sale Listing",
    description:
      "Create and manage your own sale listings to reach more customers in your area",
  },
];

export function SubscriptionPlanDialog({
  children,
}: SubscriptionPlanDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  const handleSubscribe = () => {
    setIsOpen(false);
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    // TODO: Handle successful payment (update user status, redirect, etc.)
    console.log("Payment successful - user is now premium");
  };

  const handlePaymentClose = () => {
    setShowPayment(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Upgrade to Premium
          </DialogTitle>
          <DialogDescription>
            Unlock advanced features to enhance your EcoShare experience
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Premium Plan Info */}
          <div className="text-center space-y-3">
            <Badge
              variant="default"
              className="bg-primary text-primary-foreground"
            >
              Most Popular
            </Badge>
            <div>
              <h3 className="text-2xl font-bold text-primary">Premium</h3>
              <div className="flex items-baseline justify-center gap-1 mt-1">
                <span className="text-3xl font-bold">$5</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </div>
          </div>

          {/* Features List */}
          <div className="space-y-4">
            {premiumFeatures.map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <feature.icon className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm leading-tight mb-1">
                    {feature.title}
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
                <Check className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
              </div>
            ))}
          </div>

          {/* Additional Info */}
          <div className="text-center text-sm text-muted-foreground">
            <p>Cancel anytime. No setup fees.</p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubscribe}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Subscribe to Premium
          </Button>
        </DialogFooter>
      </DialogContent>

      <PaymentDialog
        isOpen={showPayment}
        onClose={handlePaymentClose}
        onSuccess={handlePaymentSuccess}
      />
    </Dialog>
  );
}
