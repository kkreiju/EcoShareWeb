// Core Response and Data Interfaces
export interface HTTPResponse {
  success: boolean;
  message: string;
  errors: string[];
  data?: Data;
}

export interface Data {
  session?: Session;
  user?: User;
  listings?: Listing[];
  listing?: Listing;
}

// User and Session Interfaces
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  middleName?: string;
  profileURL?: string;
  contactNumber?: string;
  bio?: string;
  ratings?: string;
  transactionCount?: number;
  emailVerified?: boolean;
  membershipStatus?: string;
}

export interface Session {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  expiresIn: number;
}

// Authentication Interfaces
export interface Login {
  email: string;
  password: string;
}

export interface Register {
  email: string;
  password: string;
  firstName: string;
  middleName?: string;
  lastName: string;
}

export interface ForgotPassword {
  email: string;
}

export interface IDToken {
  idToken: string;
}

export interface VerifySession {
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
}

// Unit Types
export type QuantityUnit = "kg" | "g" | "bgs" | "sks";

export const QUANTITY_UNITS: { value: QuantityUnit; label: string; fullName: string }[] = [
  { value: "kg", label: "kg", fullName: "kilogram" },
  { value: "g", label: "g", fullName: "gram" },
  { value: "bgs", label: "bgs", fullName: "bags" },
  { value: "sks", label: "sks", fullName: "sacks" },
];

// Listing Interfaces
export interface Listing {
  user_id: string;
  list_id: string;
  title: string;
  type: string;
  imageURL: string;
  description: string;
  tags?: string[];
  price?: number;
  quantity: number;
  unit: QuantityUnit;
  pickupTimeAvailability: string;
  instructions?: string;
  locationName: string;
  latitude: number;
  longitude: number;
  status: "Active" | "Inactive" | "Sold" | "Unavailable";
  category: "Free" | "Wanted" | "Sale";
  postedDate: string;
  User?: User;
  // UI-specific properties
  id?: string;
  priceDisplay?: string; // For UI display (e.g., "$25.00" or "Free")
  location?: string;
  rating?: number;
  isAvailable?: boolean;
  owner?: { name: string; avatar: string };
  images?: string[];
}

export interface ListingsResponse {
  data: Listing[];
  filters_applied: {
    list_type?: string;
    price_range?: string;
    status?: string;
    sort_by?: string;
  };
  total_count: number;
}

// Filter and Search Interfaces
export interface ListingFilters {
  type?: "Free" | "Wanted" | "Sale" | "all";
  price?: "under25" | "25-50" | "50-100" | "over100" | "all";
  availabilityStatus?: "Active" | "Inactive" | "Sold" | "Unavailable" | "all";
  sort_by?: "newest" | "oldest" | "price_high" | "price_low";
  search?: string;
}

// Conversation and Message interfaces have been moved to lib/services/conversationService.ts
// Import them from: @/lib/services/conversationService

