import * as z from "zod";

/**
 * Base validation schema for listing forms
 */
export const baseListingSchema = {
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  pickupTimes: z.string().min(1, "Please specify pickup times"),
  pickupInstructions: z.string().min(1, "Please provide pickup instructions"),
  tags: z.array(z.string()).min(1, "Please select at least one tag"),
  location: z.string().min(1, "Please select a location"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  image: z.any().optional(),
};

/**
 * Base validation schema for edit listing forms (title is optional/read-only)
 */
export const baseEditListingSchema = {
  title: z.string().optional(), // Read-only field, no validation needed
  description: z.string().min(1, "Description is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  pickupTimes: z.string().min(1, "Please specify pickup times"),
  pickupInstructions: z.string().min(1, "Please provide pickup instructions"),
  tags: z.array(z.string()).optional(),
  location: z.string().min(1, "Please select a location"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  image: z.any().optional(),
};

/**
 * Create listing schema with conditional price validation
 */
export function createListingSchema(listingType: "free" | "wanted" | "sale" | null, requireImage: boolean = true) {
  const schema = listingType === "sale"
    ? z.object({
        ...baseListingSchema,
        price: z.number().min(0.01, "Price must be greater than 0"),
      })
    : z.object({
        ...baseListingSchema,
        price: z.number().optional(),
      });

  if (requireImage) {
    return schema.refine((data) => data.image !== null && data.image !== undefined, {
      message: "Please upload a photo",
      path: ["image"],
    });
  }

  return schema;
}

/**
 * Create edit listing schema with conditional price validation
 */
export function createEditListingSchema(listingType?: string) {
  return listingType?.toLowerCase() === "sale"
    ? z.object({
        ...baseEditListingSchema,
        price: z.number().min(0.01, "Price must be greater than 0"),
      })
    : z.object({
        ...baseEditListingSchema,
        price: z.number().optional(),
      });
}

