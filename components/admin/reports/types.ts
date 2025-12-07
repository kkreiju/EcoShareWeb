export type ReportStatus = "pending" | "investigating" | "resolved" | "dismissed";

interface ReportBase {
  report_id: string;
  reporter_id: string;
  reporter_email: string;
  reporter_name: string;
  reason: string;
  description: string;
  report_date: string;
  status: ReportStatus;
}

export interface ReportedUser extends ReportBase {
  type: "user";
  reported_user_id: string;
  reported_user_email: string;
  reported_user_name: string;
}

export interface ReportedListing extends ReportBase {
  type: "listing";
  reported_listing_id: string;
  reported_listing_title: string;
  reported_listing_type: string;
  reported_owner_id: string;
  reported_owner_name: string;
  reported_listing_image?: string | null;
  reported_listing_description?: string | null;
  reported_listing_price?: number | null;
  reported_listing_quantity?: number | null;
  reported_listing_unit?: string | null;
  reported_listing_pickup_instructions?: string | null;
  reported_listing_location_name?: string | null;
}

export type Report = ReportedUser | ReportedListing;
