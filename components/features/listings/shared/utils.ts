/**
 * Utility functions for listing components
 */

/**
 * Format price based on listing type
 * @param price - Price in number format
 * @param type - Listing type ("free", "wanted", "sale")
 * @returns Formatted price string
 */
export function formatPrice(price: number, type: string): string {
  if (type.toLowerCase() === "free") return "Free";
  if (type.toLowerCase() === "wanted") return "Wanted";
  return `₱${price?.toFixed(2) || "0.00"}`;
}

/**
 * Format date as relative time (Today, Yesterday, X days ago, or date)
 * @param dateString - ISO date string
 * @returns Formatted date string
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) return "Today";
  if (diffDays === 2) return "Yesterday";
  if (diffDays <= 7) return `${diffDays - 1} days ago`;
  return date.toLocaleDateString();
}

/**
 * Get CSS color classes for listing type badge
 * @param type - Listing type ("free", "wanted", "sale")
 * @returns Tailwind CSS classes for badge styling
 */
export function getTypeColor(type: string): string {
  switch (type.toLowerCase()) {
    case "free":
      return "bg-green-500 text-white";
    case "wanted":
      return "bg-yellow-500 text-white";
    case "sale":
      return "bg-red-500 text-white";
    default:
      return "bg-muted text-muted-foreground";
  }
}

/**
 * Get CSS color classes for listing status badge
 * @param status - Listing status ("active", "inactive", "sold", "unavailable")
 * @returns Tailwind CSS classes for badge styling
 */
export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case "active":
      return "bg-green-500 text-white";
    case "inactive":
      return "bg-gray-500 text-white";
    case "sold":
      return "bg-gray-500 text-white";
    case "unavailable":
      return "bg-red-500 text-white";
    default:
      return "bg-muted text-muted-foreground";
  }
}

