"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User, Package, Ban } from "lucide-react";
import type { Report, ReportedListing } from "./types";

interface AdminReportsTableProps {
  reports: Report[];
  onAction: (report: Report, action: "ban" | "dismiss") => Promise<void> | void;
}

const getReportTypeIcon = (type: Report["type"]) =>
  type === "user" ? (
    <User className="h-4 w-4 text-blue-600" />
  ) : (
    <Package className="h-4 w-4 text-green-600" />
  );

const placeholderListingImage = "/images/stock_veges.jpg";

const getReportedItemTitle = (report: Report) =>
  report.type === "listing"
    ? report.reported_listing_title
    : report.reported_user_name;

const getReportedItemSubtitle = (report: Report) =>
  report.type === "listing"
    ? `${report.reported_listing_type} • ${report.reported_owner_name}`
    : report.reported_user_email;

const getStatusColor = (status: Report["status"]) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "investigating":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "resolved":
      return "bg-green-100 text-green-800 border-green-200";
    case "dismissed":
      return "bg-gray-100 text-gray-800 border-gray-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};

const formatCurrency = (value?: number | null) => {
  if (typeof value !== "number") {
    return "Not provided";
  }

  try {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(value);
  } catch {
    return value.toString();
  }
};

export function AdminReportsTable({ reports, onAction }: AdminReportsTableProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [previewAlt, setPreviewAlt] = useState<string>("");

  const handleReview = (report: Report) => {
    setSelectedReport(report);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedReport(null);
    setPreviewImage(null);
    setIsImagePreviewOpen(false);
  };

  const handleAction = async (action: "ban" | "dismiss") => {
    if (!selectedReport) return;
    try {
      await onAction(selectedReport, action);
      closeDialog();
    } catch (error) {
      console.error("Report action failed", error);
    }
  };

  const listingDetails: ReportedListing | null =
    selectedReport?.type === "listing" ? selectedReport : null;

  const openImagePreview = (src?: string | null, alt?: string) => {
    const safeSrc = src || placeholderListingImage;
    setPreviewImage(safeSrc);
    setPreviewAlt(alt || "Listing preview");
    setIsImagePreviewOpen(true);
  };

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-gradient-to-br from-card to-muted/10 shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="border-border/50 bg-muted/30">
            <TableHead className="w-16"></TableHead>
            <TableHead>Reported Item</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead className="w-24">Status</TableHead>
            <TableHead className="hidden lg:table-cell">Date</TableHead>
            <TableHead className="w-24 text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.map((report, index) => (
            <TableRow
              key={report.report_id ?? `${report.type}-${index}`}
              className={`border-border/50 hover:bg-muted/30 transition-all duration-200 ${
                index % 2 === 0 ? "bg-background/50" : "bg-muted/5"
              }`}
            >
              <TableCell className="text-center">
                <div className="flex items-center justify-center">
                  <div className="p-1 rounded-full bg-background border border-border/30">
                    {getReportTypeIcon(report.type)}
                  </div>
                </div>
              </TableCell>
              <TableCell className="py-4">
                <div className="flex items-start gap-3">
                  {report.type === "listing" ? (
                    <div className="relative flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border border-border/30 shadow-sm bg-muted/10">
                      <img
                        src={report.reported_listing_image || placeholderListingImage}
                        alt={getReportedItemTitle(report)}
                        className="w-full h-full object-cover"
                        onError={(event) => {
                          const target = event.target as HTMLImageElement;
                          target.src = placeholderListingImage;
                        }}
                      />
                    </div>
                  ) : (
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg border border-border/30 bg-muted/10 flex items-center justify-center text-xs text-muted-foreground uppercase tracking-wide">
                      User
                    </div>
                  )}
                  <div className="space-y-1 flex-1 min-w-0">
                    <h4 className="font-semibold text-foreground line-clamp-1 text-sm">
                      {getReportedItemTitle(report)}
                    </h4>
                    <div className="text-xs text-muted-foreground line-clamp-1">
                      {getReportedItemSubtitle(report)}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="font-medium text-sm text-foreground">
                    {report.reason}
                  </div>
                  <div className="text-xs text-muted-foreground line-clamp-2">
                    {report.description || "No additional details provided"}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={getStatusColor(report.status)}>
                  {report.status}
                </Badge>
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                <div className="text-sm text-muted-foreground">
                  {formatDate(report.report_date)}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <Button size="sm" onClick={() => handleReview(report)}>
                  Review
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isDialogOpen} onOpenChange={(open) => (open ? setIsDialogOpen(true) : closeDialog())}>
        <DialogContent className="max-w-2xl">
          {selectedReport && (
            <>
              <DialogHeader>
                <DialogTitle>
                  {selectedReport.type === "listing"
                    ? "Review Reported Listing"
                    : "Review Reported User"}
                </DialogTitle>
                <DialogDescription className="text-left">
                  Review the submitted details before taking an action on this report.
                </DialogDescription>
              </DialogHeader>

              <ScrollArea className="max-h-[60vh] pr-2">
                <div className="space-y-6">
                  <section className="space-y-3">
                    <div className="flex flex-col gap-4 sm:flex-row">
                      <div className="flex-shrink-0">
                        {selectedReport.type === "listing" ? (
                          <button
                            type="button"
                            onClick={() =>
                              openImagePreview(
                                listingDetails?.reported_listing_image,
                                getReportedItemTitle(selectedReport)
                              )
                            }
                            className="group relative h-32 w-32 overflow-hidden rounded-lg border border-border/30 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            <img
                              src={listingDetails?.reported_listing_image || placeholderListingImage}
                              alt={getReportedItemTitle(selectedReport)}
                              className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                              onError={(event) => {
                                const target = event.target as HTMLImageElement;
                                target.src = placeholderListingImage;
                              }}
                            />
                            <span className="absolute inset-0 grid place-items-center bg-black/40 text-xs font-medium uppercase tracking-wide text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                              Click to expand
                            </span>
                          </button>
                        ) : (
                          <div className="h-32 w-32 rounded-lg border border-border/30 bg-muted/10 flex items-center justify-center">
                            <User className="h-10 w-10 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 space-y-2">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            Title
                          </p>
                          <p className="font-semibold text-base text-foreground">
                            {getReportedItemTitle(selectedReport)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            Report Type
                          </p>
                          <p className="text-sm text-foreground capitalize">
                            {selectedReport.type}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            Status
                          </p>
                          <Badge variant="outline" className={getStatusColor(selectedReport.status)}>
                            {selectedReport.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Report Reason
                      </p>
                      <p className="text-sm text-foreground">{selectedReport.reason}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Reporter Notes
                      </p>
                      <p className="text-sm text-muted-foreground whitespace-pre-line">
                        {selectedReport.description || "No additional details provided."}
                      </p>
                    </div>
                  </section>

                  {listingDetails && (
                    <section className="space-y-3">
                      <h4 className="text-sm font-semibold text-foreground">
                        Listing Details
                      </h4>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            Description
                          </p>
                          <p className="text-sm text-muted-foreground whitespace-pre-line">
                            {listingDetails.reported_listing_description || "No description provided."}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            Listing Type
                          </p>
                          <p className="text-sm text-foreground capitalize">
                            {listingDetails.reported_listing_type || "Not provided"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            Price
                          </p>
                          <p className="text-sm text-foreground">
                            {formatCurrency(listingDetails.reported_listing_price)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            Quantity
                          </p>
                          <p className="text-sm text-foreground">
                            {typeof listingDetails.reported_listing_quantity === "number"
                              ? `${listingDetails.reported_listing_quantity} ${listingDetails.reported_listing_unit || "units"}`
                              : "Not provided"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            Pickup Instructions
                          </p>
                          <p className="text-sm text-muted-foreground whitespace-pre-line">
                            {listingDetails.reported_listing_pickup_instructions || "Not provided"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            Location
                          </p>
                          <p className="text-sm text-foreground">
                            {listingDetails.reported_listing_location_name || "Not provided"}
                          </p>
                        </div>
                      </div>
                    </section>
                  )}
                </div>
              </ScrollArea>

              <DialogFooter className="gap-2 sm:gap-3">
                <Button
                  variant="outline"
                  onClick={() => handleAction("dismiss")}
                  disabled={selectedReport.status === "dismissed"}
                >
                  Dismiss Report
                </Button>
                {selectedReport.type === "listing" && (
                  <Button
                    variant="destructive"
                    onClick={() => handleAction("ban")}
                    disabled={selectedReport.status === "resolved"}
                  >
                    <Ban className="mr-2 h-4 w-4" /> Mark Listing Unavailable
                  </Button>
                )}
                <Button variant="ghost" onClick={closeDialog}>
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={isImagePreviewOpen}
        onOpenChange={(open) => {
          setIsImagePreviewOpen(open);
          if (!open) {
            setPreviewImage(null);
            setPreviewAlt("");
          }
        }}
      >
        <DialogContent className="max-w-4xl border-0 bg-transparent shadow-none p-0">
          <DialogHeader className="sr-only">
            <DialogTitle>Listing image preview</DialogTitle>
            <DialogDescription>Expanded view of the reported listing image.</DialogDescription>
          </DialogHeader>
          <div className="overflow-hidden rounded-xl bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <img
              src={previewImage || placeholderListingImage}
              alt={previewAlt || "Listing preview"}
              className="max-h-[80vh] w-full object-contain"
              onError={(event) => {
                const target = event.target as HTMLImageElement;
                target.src = placeholderListingImage;
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
