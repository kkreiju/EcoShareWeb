"use client";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BasicInfoSectionProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  listingType?: "free" | "wanted" | "sale" | null;
  mode?: "add" | "edit";
  titleDisabled?: boolean;
}

export function BasicInfoSection({
  register,
  errors,
  listingType,
  mode = "add",
  titleDisabled = false,
}: BasicInfoSectionProps) {
  const useCard = mode === "edit";
  const isTitleDisabled = titleDisabled || mode === "edit";

  const content = (
    <div className="space-y-4">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Title {mode === "add" ? "*" : ""}</Label>
        <Input
          id="title"
          placeholder="e.g., Used coffee grounds for composting"
          {...register("title")}
          className={errors.title ? "border-red-500" : ""}
          disabled={isTitleDisabled}
          readOnly={isTitleDisabled}
        />
        {isTitleDisabled && (
          <p className="text-sm text-gray-500 italic">Title cannot be modified</p>
        )}
        {errors.title && (
          <p className="text-sm text-red-500">{errors.title.message as string}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          placeholder="Describe your item in detail..."
          rows={3}
          className={`resize-none break-words whitespace-pre-wrap overflow-x-hidden ${errors.description ? "border-red-500" : ""}`}
          {...register("description")}
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message as string}</p>
        )}
      </div>

      {/* Quantity */}
      <div className="space-y-2">
        <Label htmlFor="quantity">Quantity *</Label>
        <Input
          id="quantity"
          type="number"
          min="1"
          placeholder="e.g., 5 bags"
          {...register("quantity", { valueAsNumber: true })}
          className={errors.quantity ? "border-red-500" : ""}
        />
        {errors.quantity && (
          <p className="text-sm text-red-500">{errors.quantity.message as string}</p>
        )}
      </div>

      {/* Price - Only show for sale listings */}
      {(listingType === "sale" || listingType?.toLowerCase() === "sale") && (
        <div className="space-y-2">
          <Label htmlFor="price">Price (₱) *</Label>
          <Input
            id="price"
            type="number"
            min="0.01"
            step="0.01"
            placeholder="e.g., 150.00"
            {...register("price", { valueAsNumber: true })}
            className={errors.price ? "border-red-500" : ""}
          />
          {errors.price && (
            <p className="text-sm text-red-500">{errors.price.message as string}</p>
          )}
        </div>
      )}
    </div>
  );

  if (useCard) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Basic Information</CardTitle>
        </CardHeader>
        <CardContent>{content}</CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Package className="h-4 w-4" style={{ color: "#4D96FF" }} />
          <span className="text-sm font-medium">Basic Information</span>
        </div>
        {content}
      </div>
    </div>
  );
}

