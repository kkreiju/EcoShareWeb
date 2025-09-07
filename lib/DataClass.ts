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

export interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unreadCount?: number;
  avatar?: string;
}

export interface Message {
  id: string;
  text: string;
  timestamp: string;
  isSent: boolean;
  senderName?: string;
}
