"use client";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface BasicInfoSectionProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  listingType?: "free" | "wanted" | "sale" | null;
  watchedValues?: any;
}

export function BasicInfoSection({
  register,
  errors,
  listingType,
  watchedValues,
}: BasicInfoSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Basic Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            placeholder="e.g., Used coffee grounds for composting"
            {...register("title")}
            className={errors.title ? "border-red-500" : ""}
          />
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
            className={`resize-none ${errors.description ? "border-red-500" : ""}`}
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
        {listingType === "sale" && (
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
      </CardContent>
    </Card>
  );
}
