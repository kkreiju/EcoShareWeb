"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RefreshCw, Flag, Users, Package, AlertCircle } from "lucide-react";
import { AdminReportsTable } from "./admin-reports-table";
import { AdminReportsSkeleton } from "./loading-skeleton";
import { getAdminId, getReports, type BackendReport } from "@/lib/services/adminService";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import type { Report } from "./types";

// Map backend report status to frontend status
function mapReportStatus(status: string): "pending" | "investigating" | "resolved" | "dismissed" {
  const statusLower = status.toLowerCase();
  if (statusLower.includes("pending")) return "pending";
  if (statusLower.includes("investigat")) return "investigating";
  if (statusLower.includes("resolve")) return "resolved";
  if (statusLower.includes("dismiss")) return "dismissed";
  return "pending"; // default
}

// Fetch user details by ID
async function fetchUserDetails(userId: string): Promise<{ name: string; email: string } | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("User")
      .select("user_firstName, user_lastName, user_email")
      .eq("user_id", userId)
      .single();

    if (error || !data) return null;

    return {
      name: `${data.user_firstName || ""} ${data.user_lastName || ""}`.trim() || "Unknown User",
      email: data.user_email || "",
    };
  } catch (error) {
    console.error("Error fetching user details:", error);
    return null;
  }
}

// Fetch listing details by ID
async function fetchListingDetails(
  listingId: string
): Promise<{
  title: string;
  type: string;
  ownerId: string;
  imageURL?: string | null;
  description?: string | null;
  price?: number | null;
  quantity?: number | null;
  unit?: string | null;
  pickupInstructions?: string | null;
  locationName?: string | null;
} | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("Listing")
      .select(
        "list_title, list_type, user_id, list_imageURL, list_description, list_price, list_quantity, list_unit, list_pickupInstructions, list_locationName"
      )
      .eq("list_id", listingId)
      .single();

    if (error || !data) return null;

    return {
      title: data.list_title || "Unknown Listing",
      type: data.list_type || "unknown",
      ownerId: data.user_id || "",
      imageURL: data.list_imageURL || null,
      description: data.list_description || null,
      price: typeof data.list_price === "number" ? data.list_price : null,
      quantity: typeof data.list_quantity === "number" ? data.list_quantity : null,
      unit: data.list_unit || null,
      pickupInstructions: data.list_pickupInstructions || null,
      locationName: data.list_locationName || null,
    };
  } catch (error) {
    console.error("Error fetching listing details:", error);
    return null;
  }
}

// Map backend report to frontend report
async function mapBackendReportToFrontend(report: BackendReport): Promise<Report> {
  const rawRepId = (report as Record<string, unknown>).rep_id;
  const rawId = (report as Record<string, unknown>).id;
  const normalizedReportId =
    (typeof report.report_id === "string" && report.report_id.length > 0
      ? report.report_id
      : rawRepId !== undefined && rawRepId !== null
      ? String(rawRepId)
      : rawId !== undefined && rawId !== null
      ? String(rawId)
      : "").trim();

  const hasListId = report.list_id || report.reported_listing_id;
  const type: "user" | "listing" = hasListId ? "listing" : "user";

  const reason = report.rep_reason || report.report_description || "No reason provided";
  const description = report.rep_otherComments || report.report_description || "";
  const report_date = report.report_date || report.created_at || new Date().toISOString();
  const status = mapReportStatus(report.rep_status || report.report_status || "Pending");

  const reporterId = report.reporter_id || report.user_id || "";
  const reporterDetails = reporterId ? await fetchUserDetails(reporterId) : null;

  if (type === "listing") {
    const listingId = report.list_id || report.reported_listing_id || "";
    const listingDetails = listingId ? await fetchListingDetails(listingId) : null;
    const ownerDetails = listingDetails?.ownerId ? await fetchUserDetails(listingDetails.ownerId) : null;

    return {
      report_id: normalizedReportId,
      reported_listing_id: listingId,
      reported_listing_title: listingDetails?.title || "Unknown Listing",
      reported_listing_type: listingDetails?.type || "unknown",
      reported_owner_id: listingDetails?.ownerId || "",
      reported_owner_name: ownerDetails?.name || "Unknown Owner",
      reporter_id: reporterId,
      reporter_email: reporterDetails?.email || "",
      reporter_name: reporterDetails?.name || "Unknown Reporter",
      reason,
      description,
      report_date,
      status,
      type: "listing",
      reported_listing_image: listingDetails?.imageURL || null,
      reported_listing_description: listingDetails?.description || null,
      reported_listing_price: listingDetails?.price ?? null,
      reported_listing_quantity: listingDetails?.quantity ?? null,
      reported_listing_unit: listingDetails?.unit || null,
      reported_listing_pickup_instructions: listingDetails?.pickupInstructions || null,
      reported_listing_location_name: listingDetails?.locationName || null,
    };
  } else {
    const reportedUserId = report.reported_user_id || "";
    const reportedUserDetails = reportedUserId ? await fetchUserDetails(reportedUserId) : null;

    return {
      report_id: normalizedReportId,
      reported_user_id: reportedUserId,
      reported_user_email: reportedUserDetails?.email || "",
      reported_user_name: reportedUserDetails?.name || "Unknown User",
      reporter_id: reporterId,
      reporter_email: reporterDetails?.email || "",
      reporter_name: reporterDetails?.name || "Unknown Reporter",
      reason,
      description,
      report_date,
      status,
      type: "user",
    };
  }
}

export function AdminReportsView() {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adminId, setAdminId] = useState<string | null>(null);

  const fetchReports = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get admin ID
      const adminIdentifier = await getAdminId();
      if (!adminIdentifier) {
        throw new Error("Admin access required. Please log in as an admin.");
      }
      setAdminId(adminIdentifier);

      // Fetch reports from API
      const response = await getReports(adminIdentifier);

      // Map backend reports to frontend format (with user/listing details)
      const mappedReports = await Promise.all(
        (response.reports || []).map(mapBackendReportToFrontend)
      );

      setReports(mappedReports);
    } catch (err) {
      console.error("Error fetching reports:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to load reports";
      setError(errorMessage);
      toast.error("Failed to load reports", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleRefresh = () => {
    fetchReports();
  };

  const updateReportStatus = async (
    reportId: string,
    status: Report["status"]
  ): Promise<void> => {
    if (!adminId) {
      throw new Error("Admin session expired. Refresh and sign in again.");
    }

    const response = await fetch("/api/admin/update-report-status", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        admin_id: adminId,
        report_id: reportId,
        status,
      }),
    });

    const rawBody = await response.text();

    if (!response.ok) {
      let message = `Failed to update report status (HTTP ${response.status}).`;
      if (rawBody) {
        try {
          const data = JSON.parse(rawBody);
          message = data.error || message;
        } catch (parseError) {
          console.error("Failed to parse report status response:", parseError);
        }
      }
      throw new Error(message);
    }

    if (rawBody) {
      try {
        const data = JSON.parse(rawBody);
        if (!data?.success) {
          throw new Error("Unexpected response while updating report status.");
        }
      } catch (parseError) {
        console.error("Failed to parse successful report status response:", parseError);
      }
    }
  };

  const handleReportAction = async (
    report: Report,
    action: "ban" | "dismiss"
  ) => {
    try {
      if (!adminId) {
        throw new Error("Admin session required. Please refresh and sign in again.");
      }

      if (!report.report_id) {
        throw new Error("Report identifier is missing. Please refresh the reports list and try again.");
      }

      if (action === "ban") {
        if (report.type !== "listing") {
          toast.error("Unable to mark listing as unavailable.", {
            description: "This action is only available for listing reports.",
          });
          return;
        }

        const response = await fetch("/api/admin/mark-unavailable", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            admin_id: adminId,
            report_id: report.report_id,
          }),
        });

        if (!response.ok) {
          let errorMessage = "Failed to mark listing as unavailable.";
          try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorMessage;
          } catch (parseError) {
            console.error("Error parsing ban response:", parseError);
          }
          throw new Error(errorMessage);
        }

        toast.success("Listing marked as unavailable", {
          description: "The report has been resolved and transactions cancelled.",
        });

        setReports((prev) =>
          prev.map((item) =>
            item.report_id === report.report_id
              ? { ...item, status: "resolved" }
              : item
          )
        );
      } else {
        await updateReportStatus(report.report_id, "dismissed");

        setReports((prev) =>
          prev.map((item) =>
            item.report_id === report.report_id
              ? { ...item, status: "dismissed" }
              : item
          )
        );

        toast.success("Report dismissed", {
          description: "The report has been archived.",
        });
      }
    } catch (err) {
      console.error("Error handling report action:", err);
      setError("Failed to process report action");
      toast.error("Unable to complete request", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
      throw err instanceof Error ? err : new Error("Failed to process report action");
    }
  };

  const userReports = reports.filter((r) => r.type === "user");
  const listingReports = reports.filter((r) => r.type === "listing");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Reports Management
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Review and manage reported users and listings
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
            className="border-border w-full sm:w-auto justify-center sm:justify-start"
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 flex-shrink-0 ${
                isLoading ? "animate-spin" : ""
              }`}
            />
            <span className="truncate">Refresh</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <Flag className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Reports
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {isLoading ? "..." : reports.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Users className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  User Reports
                </p>
                <p className="text-2xl font-bold text-yellow-600">
                  {isLoading ? "..." : userReports.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Listing Reports
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {isLoading ? "..." : listingReports.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <AlertCircle className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Pending Review
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  {isLoading
                    ? "..."
                    : reports.filter((r) => r.status === "pending").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Error State */}
      {error && (
        <Alert className="border-destructive/50 text-destructive dark:border-destructive dark:text-destructive">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <AlertDescription className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="flex-1">{error}</span>
            <Button
              variant="link"
              size="sm"
              onClick={handleRefresh}
              className="p-0 h-auto hover:text-destructive self-start sm:self-center"
            >
              Try again
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Reports Table */}
      {isLoading ? (
        <AdminReportsSkeleton />
      ) : (
        <AdminReportsTable
          reports={reports}
          onAction={handleReportAction}
        />
      )}
    </div>
  );
}
