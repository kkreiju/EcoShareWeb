"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ListingForm } from "./add-listing";
import { Gift, DollarSign, Plus, Search, Lock } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { createClient } from "@/lib/supabase/client";

interface AddListingDialogProps {
  children: React.ReactNode;
  onListingCreated?: () => void;
}

export function AddListingDialog({ children, onListingCreated }: AddListingDialogProps) {
  const [open, setOpen] = useState(false);
  const [showListingForm, setShowListingForm] = useState(false);
  const [listingType, setListingType] = useState<"free" | "wanted" | "sale" | null>(null);
  const [membershipStatus, setMembershipStatus] = useState<string>("Free");
  const { user } = useAuth();

  // Fetch membership status
  useEffect(() => {
    const fetchMembershipStatus = async () => {
      if (!user?.email) return;

      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("User")
          .select("user_membershipStatus")
          .eq("user_email", user.email)
          .single();

        if (data && !error) {
          setMembershipStatus(data.user_membershipStatus || "Free");
        }
      } catch (error) {
        console.error("Error fetching membership status:", error);
      }
    };

    fetchMembershipStatus();
  }, [user?.email]);

  const handleSelectType = (type: "free" | "wanted" | "sale") => {
    // Check if sale listing is premium feature
    if (type === "sale" && membershipStatus?.toLowerCase() !== "premium") {
      // Could show a premium upgrade prompt here
      return;
    }

    setOpen(false);

    // All valid listing types are handled above
    if (type === "free" || type === "sale" || type === "wanted") {
      setListingType(type);
      setShowListingForm(true);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-xl sm:text-2xl font-bold">Create New Listing</DialogTitle>
          <DialogDescription className="text-sm sm:text-base text-muted-foreground">
            Choose the type of listing you'd like to create
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 py-4">
          {/* Free Listing Card */}
          <Card
            className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-primary/50 active:scale-95 touch-manipulation min-h-[200px] sm:min-h-[180px]"
            onClick={() => handleSelectType("free")}
          >
            <CardHeader className="text-center pb-1 sm:pb-2">
              <div className="mx-auto mb-2 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400">
                <Gift className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <CardTitle className="text-base sm:text-lg">Free</CardTitle>
              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 text-xs mx-auto block w-fit">
                Give away items
              </Badge>
            </CardHeader>
            <CardContent className="text-center px-3 sm:px-4 pt-1">
              <CardDescription className="text-xs sm:text-sm leading-relaxed">
                Share items you no longer need with the community. Perfect for gently used items,
                samples, or items you want to give to someone who will appreciate them.
              </CardDescription>
            </CardContent>
          </Card>

          {/* Sale Listing Card */}
          <Card
            className={`transition-all duration-200 min-h-[200px] sm:min-h-[180px] ${
              membershipStatus?.toLowerCase() === "premium"
                ? "cursor-pointer hover:shadow-lg hover:border-primary/50 active:scale-95 touch-manipulation"
                : "opacity-60 cursor-not-allowed"
            }`}
            onClick={() => membershipStatus?.toLowerCase() === "premium" && handleSelectType("sale")}
          >
            <CardHeader className="text-center pb-1 sm:pb-2">
              <div className="relative mx-auto mb-2">
                <div className={`flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full ${
                  membershipStatus?.toLowerCase() === "premium"
                    ? "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                    : "bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500"
                }`}>
                  <DollarSign className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                {membershipStatus?.toLowerCase() !== "premium" && (
                  <div className="absolute -top-1 -right-1 bg-amber-500 text-white rounded-full p-1">
                    <Lock className="h-3 w-3" />
                  </div>
                )}
              </div>
              <CardTitle className="text-base sm:text-lg flex items-center justify-center gap-2">
                Sale
                {membershipStatus?.toLowerCase() !== "premium" && (
                  <Badge variant="secondary" className="bg-amber-100 text-amber-800 text-xs">
                    Premium
                  </Badge>
                )}
              </CardTitle>
              <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 text-xs mx-auto block w-fit">
                Sell your items
              </Badge>
            </CardHeader>
            <CardContent className="text-center px-3 sm:px-4 pt-1">
              <CardDescription className="text-xs sm:text-sm leading-relaxed">
                {membershipStatus?.toLowerCase() === "premium" ? (
                  "Sell your eco-friendly items and services. Set your price and connect with buyers interested in sustainable products and services."
                ) : (
                  <>
                    Sell your eco-friendly items and services.{" "}
                    <span className="text-amber-600 font-medium">Premium feature required.</span>
                  </>
                )}
              </CardDescription>
            </CardContent>
          </Card>

          {/* Wanted Listing Card */}
          <Card
            className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-primary/50 active:scale-95 touch-manipulation min-h-[200px] sm:min-h-[180px]"
            onClick={() => handleSelectType("wanted")}
          >
            <CardHeader className="text-center pb-1 sm:pb-2">
              <div className="mx-auto mb-2 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400">
                <Search className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <CardTitle className="text-base sm:text-lg">Wanted</CardTitle>
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 text-xs mx-auto block w-fit">
                Looking for items
              </Badge>
            </CardHeader>
            <CardContent className="text-center px-3 sm:px-4 pt-1">
              <CardDescription className="text-xs sm:text-sm leading-relaxed">
                Post what you're looking for. Let the community know about items or services
                you need, and connect with people who might be able to help you.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => setOpen(false)} className="w-full sm:w-auto order-2 sm:order-1">
            Cancel
          </Button>
        </div>
      </DialogContent>

      {/* Listing Form */}
      <ListingForm
        open={showListingForm}
        onOpenChange={setShowListingForm}
        listingType={listingType}
        onListingCreated={onListingCreated}
      />
    </Dialog>
  );
}
