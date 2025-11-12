/**
 * Admin utility functions for formatting, validation, and common operations
 */

import { formatMembershipStatus, isAdminId } from "@/lib/services/adminService";

/**
 * Format date for display in admin tables
 */
export function formatAdminDate(dateString: string | null | undefined): string {
  if (!dateString) return "N/A";
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date";
    
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "Invalid Date";
  }
}

/**
 * Format relative time (e.g., "2 hours ago", "3 days ago")
 */
export function formatRelativeTime(dateString: string | null | undefined): string {
  if (!dateString) return "Unknown";
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date";
    
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInSeconds = Math.floor(diffInMs / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    
    if (diffInSeconds < 60) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`;
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`;
    if (diffInDays < 7) return `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`;
    
    return formatAdminDate(dateString);
  } catch {
    return "Invalid Date";
  }
}

/**
 * Get status badge color class
 */
export function getStatusBadgeColor(status: string): string {
  const statusLower = status.toLowerCase();
  
  if (statusLower.includes("pending")) {
    return "bg-yellow-100 text-yellow-800 border-yellow-200";
  }
  if (statusLower.includes("investigat")) {
    return "bg-blue-100 text-blue-800 border-blue-200";
  }
  if (statusLower.includes("resolve")) {
    return "bg-green-100 text-green-800 border-green-200";
  }
  if (statusLower.includes("dismiss")) {
    return "bg-gray-100 text-gray-800 border-gray-200";
  }
  if (statusLower === "active" || statusLower === "free" || statusLower === "premium") {
    return "bg-green-100 text-green-800 border-green-200";
  }
  if (statusLower === "inactive") {
    return "bg-yellow-100 text-yellow-800 border-yellow-200";
  }
  if (statusLower === "suspended" || statusLower === "suspend") {
    return "bg-red-100 text-red-800 border-red-200";
  }
  
  return "bg-gray-100 text-gray-800 border-gray-200";
}

/**
 * Get priority badge color class
 */
export function getPriorityBadgeColor(priority: "high" | "medium" | "low"): string {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-800";
    case "medium":
      return "bg-yellow-100 text-yellow-800";
    case "low":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

/**
 * Format user name from first and last name
 */
export function formatUserName(
  firstName: string | null | undefined,
  lastName: string | null | undefined,
  fallback: string = "Unknown User"
): string {
  const first = firstName?.trim() || "";
  const last = lastName?.trim() || "";
  const fullName = [first, last].filter(Boolean).join(" ");
  return fullName || fallback;
}

/**
 * Get user initials for avatar
 */
export function getUserInitials(
  firstName: string | null | undefined,
  lastName: string | null | undefined
): string {
  const first = firstName?.trim().charAt(0).toUpperCase() || "";
  const last = lastName?.trim().charAt(0).toUpperCase() || "";
  return (first + last) || "?";
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Format membership status with details
 */
export function formatUserMembershipStatus(status: string): {
  display: string;
  color: string;
  isActive: boolean;
} {
  const formatted = formatMembershipStatus(status);
  const isActive = status !== "Suspend" && !status.startsWith("Deactivate");
  
  return {
    display: formatted,
    color: getStatusBadgeColor(status),
    isActive,
  };
}

/**
 * Filter users by search query
 */
export function filterUsers<T extends { user_email: string; firstName?: string; lastName?: string }>(
  users: T[],
  searchQuery: string
): T[] {
  if (!searchQuery.trim()) return users;
  
  const query = searchQuery.toLowerCase().trim();
  
  return users.filter((user) => {
    const email = user.user_email?.toLowerCase() || "";
    const firstName = user.firstName?.toLowerCase() || "";
    const lastName = user.lastName?.toLowerCase() || "";
    const fullName = `${firstName} ${lastName}`.trim();
    
    return (
      email.includes(query) ||
      firstName.includes(query) ||
      lastName.includes(query) ||
      fullName.includes(query)
    );
  });
}

/**
 * Filter reports by search query
 */
export function filterReports<T extends { reason?: string; description?: string; report_id?: string }>(
  reports: T[],
  searchQuery: string
): T[] {
  if (!searchQuery.trim()) return reports;
  
  const query = searchQuery.toLowerCase().trim();
  
  return reports.filter((report) => {
    const reason = report.reason?.toLowerCase() || "";
    const description = report.description?.toLowerCase() || "";
    const reportId = report.report_id?.toLowerCase() || "";
    
    return (
      reason.includes(query) ||
      description.includes(query) ||
      reportId.includes(query)
    );
  });
}

/**
 * Sort array by date (newest first or oldest first)
 */
export function sortByDate<T extends { [key: string]: unknown }>(
  items: T[],
  dateField: string,
  order: "asc" | "desc" = "desc"
): T[] {
  return [...items].sort((a, b) => {
    const dateA = new Date((a[dateField] as string) || 0).getTime();
    const dateB = new Date((b[dateField] as string) || 0).getTime();
    
    return order === "desc" ? dateB - dateA : dateA - dateB;
  });
}

/**
 * Paginate array
 */
export function paginate<T>(items: T[], page: number, pageSize: number): {
  items: T[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
} {
  const totalPages = Math.ceil(items.length / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedItems = items.slice(startIndex, endIndex);
  
  return {
    items: paginatedItems,
    totalPages,
    currentPage: page,
    totalItems: items.length,
  };
}

/**
 * Export data to CSV format
 */
export function exportToCSV<T extends Record<string, unknown>>(
  data: T[],
  filename: string,
  headers?: string[]
): void {
  if (data.length === 0) {
    alert("No data to export");
    return;
  }
  
  // Get headers from first object if not provided
  const csvHeaders = headers || Object.keys(data[0]);
  
  // Create CSV content
  const csvContent = [
    csvHeaders.join(","),
    ...data.map((row) =>
      csvHeaders
        .map((header) => {
          const value = row[header];
          // Handle values that might contain commas or quotes
          if (value === null || value === undefined) return "";
          const stringValue = String(value);
          if (stringValue.includes(",") || stringValue.includes('"')) {
            return `"${stringValue.replace(/"/g, '""')}"`;
          }
          return stringValue;
        })
        .join(",")
    ),
  ].join("\n");
  
  // Create blob and download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}_${new Date().toISOString().split("T")[0]}.csv`);
  link.style.visibility = "hidden";
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

