"use client";

import { useState } from "react";
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
import { Gift, DollarSign, Plus, Search } from "lucide-react";

interface AddListingDialogProps {
  children: React.ReactNode;
  onListingCreated?: () => void;
}

export function AddListingDialog({ children, onListingCreated }: AddListingDialogProps) {
  const [open, setOpen] = useState(false);
  const [showListingForm, setShowListingForm] = useState(false);
  const [listingType, setListingType] = useState<"free" | "wanted" | "sale" | null>(null);

  const handleSelectType = (type: "free" | "wanted" | "sale") => {
    console.log("Selected listing type:", type);
    setOpen(false);

    if (type === "free" || type === "sale" || type === "wanted") {
      setListingType(type);
      setShowListingForm(true);
    } else {
      // TODO: Navigate to appropriate form based on type
      // For example: router.push(`/user/add-listing?type=${type}`)
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
            className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-primary/50 active:scale-95 touch-manipulation min-h-[200px] sm:min-h-[180px]"
            onClick={() => handleSelectType("sale")}
          >
            <CardHeader className="text-center pb-1 sm:pb-2">
              <div className="mx-auto mb-2 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400">
                <DollarSign className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <CardTitle className="text-base sm:text-lg">Sale</CardTitle>
              <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 text-xs mx-auto block w-fit">
                Sell your items
              </Badge>
            </CardHeader>
            <CardContent className="text-center px-3 sm:px-4 pt-1">
              <CardDescription className="text-xs sm:text-sm leading-relaxed">
                Sell your eco-friendly items and services. Set your price and connect with
                buyers interested in sustainable products and services.
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
