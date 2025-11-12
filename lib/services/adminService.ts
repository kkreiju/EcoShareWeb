/**
 * AdminService - Frontend service to interact with Admin backend APIs
 * Handles admin operations: reports, user management, etc.
 */

import { createClient } from "@/lib/supabase/client";

// API base URL - uses Next.js proxy which rewrites to backend
const API_BASE = "";

export interface BackendReport {
  report_id: string;
  report_type?: string;
  report_description?: string;
  report_status?: string;
  report_date?: string;
  reporter_id?: string;
  reported_user_id?: string;
  reported_listing_id?: string;
  // Fields from Report table
  rep_reason?: string;
  rep_status?: string;
  rep_otherComments?: string;
  list_id?: string; // For listing reports
  user_id?: string; // Reporter user ID
  created_at?: string;
  [key: string]: unknown;
}

export interface BackendUser {
  user_id: string;
  user_email: string;
  user_firstName: string;
  user_middleName?: string | null;
  user_lastName: string;
  user_profileURL?: string | null;
  user_membershipStatus: string;
  user_ratings?: number;
  user_transactionCount?: number;
  user_isVerified?: boolean;
  user_bio?: string | null;
  user_phoneNumber?: string | null;
  [key: string]: unknown;
}

export interface GetReportsResponse {
  success: boolean;
  reports_count: number;
  reports: BackendReport[];
}

export interface GetUsersResponse {
  success: boolean;
  users_count: number;
  users: BackendUser[];
}

export interface ManageUserRequest {
  user_id: string;
  action: "ActivatePremium" | "ActivateFree" | "DeactivatePremium" | "DeactivateFree" | "Suspend";
  admin_id: string;
  deactivate_period?: number;
}

export interface ManageUserResponse {
  success: boolean;
  message: string;
}

/**
 * Get the admin ID from the current authenticated user
 */
export async function getAdminId(): Promise<string | null> {
  try {
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user?.email) {
      return null;
    }

    const { data: userData, error } = await supabase
      .from("User")
      .select("user_id")
      .eq("user_email", session.user.email)
      .single();

    if (error || !userData?.user_id) {
      return null;
    }

    // Verify it's an admin ID (starts with 'A' followed by 5 digits)
    const userId = userData.user_id;
    if (/^A\d{5}$/.test(userId)) {
      return userId;
    }

    return null;
  } catch (error) {
    console.error("Error getting admin ID:", error);
    return null;
  }
}

/**
 * Get all reports from the backend
 */
export async function getReports(adminId: string): Promise<GetReportsResponse> {
  try {
    const response = await fetch(
      `${API_BASE}/api/admin/get-reports?admin_id=${encodeURIComponent(adminId)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Handle network errors
    if (!response.ok) {
      let errorMessage = `Failed to fetch reports: ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch {
        // If response is not JSON, use default error message
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();

    // Validate response structure
    if (!data.success || !Array.isArray(data.reports)) {
      throw new Error("Invalid response format from server");
    }

    return data;
  } catch (error) {
    console.error("Error fetching reports:", error);
    // Re-throw with more context if it's not already an Error
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An unexpected error occurred while fetching reports");
  }
}

/**
 * Get all users from the backend (excluding admins)
 */
export async function getUsers(adminId: string): Promise<GetUsersResponse> {
  try {
    const response = await fetch(
      `${API_BASE}/api/admin/user-management/get-users?admin_id=${encodeURIComponent(adminId)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Handle network errors
    if (!response.ok) {
      let errorMessage = `Failed to fetch users: ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch {
        // If response is not JSON, use default error message
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();

    // Validate response structure
    if (!data.success || !Array.isArray(data.users)) {
      throw new Error("Invalid response format from server");
    }

    return data;
  } catch (error) {
    console.error("Error fetching users:", error);
    // Re-throw with more context if it's not already an Error
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An unexpected error occurred while fetching users");
  }
}

/**
 * Manage a user account (activate, deactivate, suspend)
 */
export async function manageUser(
  adminId: string,
  userId: string,
  action: ManageUserRequest["action"],
  deactivatePeriod?: number
): Promise<ManageUserResponse> {
  try {
    const requestBody: ManageUserRequest = {
      user_id: userId,
      action,
      admin_id: adminId,
    };

    if (deactivatePeriod !== undefined) {
      requestBody.deactivate_period = deactivatePeriod;
    }

    const response = await fetch(`${API_BASE}/api/admin/user-management/manage-users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    // Handle network errors
    if (!response.ok) {
      let errorMessage = `Failed to manage user: ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch {
        // If response is not JSON, use default error message
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();

    // Validate response structure
    if (!data.success) {
      throw new Error(data.message || "Failed to manage user");
    }

    return data;
  } catch (error) {
    console.error("Error managing user:", error);
    // Re-throw with more context if it's not already an Error
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An unexpected error occurred while managing user");
  }
}

/**
 * Map backend membership status to frontend user status
 */
export function mapMembershipStatusToUserStatus(
  membershipStatus: string
): "active" | "inactive" | "suspended" {
  if (membershipStatus === "Suspend") {
    return "suspended";
  }
  if (membershipStatus.startsWith("Deactivate")) {
    return "inactive";
  }
  // "Free", "Premium", or any other active status
  return "active";
}

/**
 * Determine the appropriate action based on current status and desired status
 */
export function getActionForStatusChange(
  currentMembershipStatus: string,
  desiredStatus: "active" | "inactive" | "suspended"
): ManageUserRequest["action"] | null {
  if (desiredStatus === "suspended") {
    return "Suspend";
  }

  if (desiredStatus === "inactive") {
    // Determine if current status is Premium or Free
    if (currentMembershipStatus === "Premium") {
      return "DeactivatePremium";
    } else {
      return "DeactivateFree";
    }
  }

  if (desiredStatus === "active") {
    // Determine if we should activate as Premium or Free
    // Check if the user was previously Premium (either currently Premium or was deactivated from Premium)
    if (currentMembershipStatus === "Premium" || currentMembershipStatus.startsWith("DeactivatePremium")) {
      return "ActivatePremium";
    } else {
      return "ActivateFree";
    }
  }

  return null;
}

/**
 * Check if a user ID is an admin ID
 */
export function isAdminId(userId: string): boolean {
  return /^A\d{5}$/.test(userId);
}

/**
 * Format membership status for display
 */
export function formatMembershipStatus(status: string): string {
  if (status === "Suspend") {
    return "Suspended";
  }
  if (status.startsWith("Deactivate")) {
    // Extract date if present (format: DeactivatePremiumMMDDYYYY)
    const match = status.match(/Deactivate(Free|Premium)(\d{8})/);
    if (match) {
      const [, type, dateStr] = match;
      const month = dateStr.substring(0, 2);
      const day = dateStr.substring(2, 4);
      const year = dateStr.substring(4, 8);
      return `Deactivated ${type} (until ${month}/${day}/${year})`;
    }
    return `Deactivated ${status.replace("Deactivate", "")}`;
  }
  return status; // "Free" or "Premium"
}

