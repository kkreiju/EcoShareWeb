"use client";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PickupInfoSectionProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  mode?: "add" | "edit";
}

export function PickupInfoSection({
  register,
  errors,
  mode = "add",
}: PickupInfoSectionProps) {
  const useCard = mode === "edit";

  const content = (
    <div className="space-y-4">
      {/* Pickup Times */}
      <div className="space-y-2">
        <Label htmlFor="pickupTimes">Available Pickup Times *</Label>
        <Textarea
          id="pickupTimes"
          placeholder="e.g., Weekdays 9 AM - 5 PM, Weekends by appointment only, or Flexible - please call to arrange"
          rows={3}
          className={`resize-none ${errors.pickupTimes ? "border-red-500" : ""}`}
          {...register("pickupTimes")}
        />
        {errors.pickupTimes && (
          <p className="text-sm text-red-500">{errors.pickupTimes.message as string}</p>
        )}
      </div>

      {/* Pickup Instructions */}
      <div className="space-y-2">
        <Label htmlFor="pickupInstructions">Pickup Instructions *</Label>
        <Textarea
          id="pickupInstructions"
          placeholder="e.g., Items are located at the front door. Please call when arriving."
          rows={3}
          className={`resize-none ${errors.pickupInstructions ? "border-red-500" : ""}`}
          {...register("pickupInstructions")}
        />
        {errors.pickupInstructions && (
          <p className="text-sm text-red-500">{errors.pickupInstructions.message as string}</p>
        )}
      </div>
    </div>
  );

  if (useCard) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Pickup Information
          </CardTitle>
        </CardHeader>
        <CardContent>{content}</CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="h-4 w-4" style={{ color: "#FFD93D" }} />
          <span className="text-sm font-medium">Pickup Information</span>
        </div>
        {content}
      </div>
    </div>
  );
}

