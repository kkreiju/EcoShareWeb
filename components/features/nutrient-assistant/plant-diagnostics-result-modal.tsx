"use client";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Leaf,
  Target,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  MapPin,
  Clock,
  DollarSign,
  Sparkles
} from "lucide-react";

const severityStyles = {
  severe: {
    iconColor: "#FF6B6B",
    background: "rgba(255, 107, 107, 0.2)",
    text: "#FF6B6B",
  },
  healthy: {
    iconColor: "#6BCB77",
    background: "rgba(107, 203, 119, 0.2)",
    text: "#6BCB77",
  },
  warning: {
    iconColor: "#FFD93D",
    background: "rgba(255, 217, 61, 0.2)",
    text: "#FFD93D",
  },
} as const;

interface NutrientMatch {
  nitrogen: boolean;
  phosphorus: boolean;
  potassium: boolean;
}

interface NutrientMix {
  nitrogen: number;
  phosphorus: number;
  potassium: number;
}

interface PlantNeeds {
  nitrogen: string;
  phosphorus: string;
  potassium: string;
}

interface CompostRecommendation {
  material: string;
  score?: number;
  summary?: string;
  nutrients: {
    Nitrogen: number;
    Phosphorus: number;
    Potassium: number;
  };
}

interface CompostListing {
  list_availabilityStatus: string;
  list_description: string;
  list_id: string;
  list_imageURL: string;
  list_latitude: number;
  list_locationName: string;
  list_longitude: number;
  list_pickupInstructions: string;
  list_pickupTimeAvailability: string;
  list_postedDate: string;
  list_price: number;
  list_quantity: number;
  list_unit?: string;
  list_tags: string;
  list_title: string;
  list_type: string;
  user_id?: string;
  user_firstName: string;
  user_lastName: string;
  user_profileURL?: string;
  user_ratings?: string;
}

export interface DiagnosisResult {
  plantName: string;
  confidence: number;
  plantNeeds?: PlantNeeds;
  finalMix?: NutrientMix;
  matchQuality?: string;
  matchesPlantNeeds?: NutrientMatch;
  assessment?: string;
  recommendations?: CompostRecommendation[];
  listings?: CompostListing[];
  nutrientNeeds?: string;
  compostSuggestions?: string;
  capturedImage?: string;
  status?: string;
  diagnosis?: {
    severity?: string;
    status?: string;
    description?: string;
    recommended_action?: string;
  };
}

interface PlantDiagnosticsResultModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  result: DiagnosisResult | null;
}

export function PlantDiagnosticsResultModal({
  open,
  onOpenChange,
  result,
}: PlantDiagnosticsResultModalProps) {
  const router = useRouter();

  if (!result) return null;

  const severityKey = (result.diagnosis?.severity || "warning").toLowerCase();
  const severityVariant =
    severityStyles[severityKey as keyof typeof severityStyles] ?? severityStyles.warning;
  const hasDiagnosisContent =
    Boolean(result.diagnosis?.description || result.diagnosis?.recommended_action || result.status || result.assessment);
  const StatusIcon = severityKey === "severe" ? AlertTriangle : CheckCircle;
  const diagnosisStatus = result.diagnosis?.status || result.status || "Unknown";
  const recommendationNames =
    result.recommendations?.map((rec) => rec.material).filter(Boolean) ?? [];
  const showRecommendationList = recommendationNames.length > 0;



  // Parse compost suggestions
  const compostSuggestions = result.compostSuggestions
    ? result.compostSuggestions.split(",").map((item) => item.trim()).filter((item) => item.length > 0)
    : [];

  const handleListingClick = (listing: CompostListing) => {
    window.open(`/user/listing/${listing.list_id}`, '_blank');
  };


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-5xl max-h-[90vh] p-0">
        <ScrollArea className="max-h-[80vh] px-6">
          <div className="space-y-6 py-6">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Leaf className="h-5 w-5 text-green-600" />
                Plant Analysis Results
              </DialogTitle>
              <DialogDescription>
                Detailed analysis of your plant's health and nutrient requirements
              </DialogDescription>
            </DialogHeader>

            {/* Hero Section - Image and Plant Info */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Plant Image */}
              <div className="lg:col-span-1">
                {result.capturedImage ? (
                  <div className="rounded-lg overflow-hidden border h-48 lg:h-full">
                    <img
                      src={result.capturedImage}
                      alt="Captured plant"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="rounded-lg border h-48 lg:h-full bg-muted flex items-center justify-center">
                    <Leaf className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
              </div>

              {/* Plant Info and Confidence */}
              <div className="lg:col-span-2 space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Leaf className="h-4 w-4" />
                    <span className="text-sm font-medium">Detected Plant</span>
                  </div>
                  <h3 className="text-2xl font-bold text-green-800 dark:text-green-200">
                    {result.plantName}
                  </h3>
                </div>

                {showRecommendationList && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Leaf className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">Compost Recommendations</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recommendationNames.map((name, idx) => (
                        <div key={idx} className="text-sm font-medium px-3 py-1 rounded-full bg-muted/70 border border-border/50">
                          {name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {compostSuggestions.length > 0 && compostSuggestions[0] !== "" && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Leaf className="h-4 w-4" style={{ color: "#6BCB77" }} />
                      <span className="text-sm font-medium">Compost Suggestions</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {compostSuggestions.map((item, idx) => (
                        <Badge
                          key={idx}
                          variant="secondary"
                          className="bg-green-100 text-green-800 dark:bg-green-950/30 dark:text-green-300"
                        >
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {hasDiagnosisContent && (
              <div className="rounded-2xl border border-border/60 bg-card/90 p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                    <TrendingUp size={18} />
                    Deficiency Overview
                  </div>
                  <span
                    className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold"
                    style={{
                      backgroundColor: severityVariant.background,
                      color: severityVariant.text,
                      borderColor: severityVariant.background,
                    }}
                  >
                    <StatusIcon size={14} color={severityVariant.iconColor} />
                    {diagnosisStatus}
                  </span>
                </div>

                {result.status && (
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <Sparkles className="h-4 w-4 text-sky-300" />
                    <span>Health: {result.status}</span>
                  </div>
                )}

                {result.diagnosis?.description && (
                  <p className="text-sm text-muted-foreground">
                    {result.diagnosis.description}
                  </p>
                )}

                {result.assessment && (
                  <div className="flex items-start gap-2 text-sm text-foreground">
                    <Target className="h-4 w-4 text-muted-foreground" />
                    <span>{result.assessment}</span>
                  </div>
                )}

                {result.diagnosis?.recommended_action && (
                  <div className="rounded-xl border border-border/50 bg-muted/60 p-3">
                    <div className="flex items-center gap-2 text-[0.625rem] font-semibold uppercase tracking-wider text-muted-foreground">
                      <StatusIcon size={12} color={severityVariant.iconColor} />
                      Recommended Action
                    </div>
                    <p className="mt-1 text-sm text-foreground">
                      {result.diagnosis.recommended_action}
                    </p>
                  </div>
                )}
              </div>
            )}



            {/* Available Compost Listings */}
            {result.listings && result.listings.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" style={{ color: "#FF6B6B" }} />
                  <span className="text-sm font-medium">Available Compost Listings</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {result.listings.map((listing, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleListingClick(listing)}
                      className="p-4 rounded-lg border bg-muted/30 hover:bg-muted/50 cursor-pointer transition-colors h-full"
                    >
                      <div className="space-y-3">
                        {/* Listing Image */}
                        {listing.list_imageURL && (
                          <div className="rounded-lg overflow-hidden border h-32">
                            <img
                              src={listing.list_imageURL}
                              alt={listing.list_title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}

                        {/* Title and Price */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 space-y-1">
                            <h4 className="font-semibold text-base text-foreground">
                              {listing.list_title}
                            </h4>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">
                                by {listing.user_firstName} {listing.user_lastName}
                              </span>
                            </div>
                          </div>
                          <div className="text-right space-y-1">
                            <div className="flex items-center gap-1">
                              {listing.list_price === 0 ? (
                                <span className="text-sm font-semibold text-green-600">
                                  FREE
                                </span>
                              ) : (
                                <>
                                  <DollarSign className="h-3.5 w-3.5" style={{ color: "#FFD93D" }} />
                                  <span className="text-sm font-semibold text-yellow-600">
                                    {listing.list_price}
                                  </span>
                                </>
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              Qty: {listing.list_quantity} {listing.list_unit || 'kg'}
                            </span>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-muted-foreground">
                          {listing.list_description}
                        </p>

                        {/* Location */}
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3.5 w-3.5" style={{ color: "#94a3b8" }} />
                          <span className="text-xs text-muted-foreground flex-1">
                            {listing.list_locationName}
                          </span>
                        </div>

                        {/* Pickup Time */}
                        <div className="flex items-center gap-2">
                          <Clock className="h-3.5 w-3.5" style={{ color: "#94a3b8" }} />
                          <span className="text-xs text-muted-foreground">
                            {listing.list_pickupTimeAvailability}
                          </span>
                        </div>

                        {/* Pickup Instructions */}
                        <p className="text-xs text-muted-foreground">
                          {listing.list_pickupInstructions}
                        </p>

                        {/* Status */}
                        <span className="text-xs font-medium text-green-600">
                          Status: {listing.list_availabilityStatus}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </ScrollArea>

        <DialogFooter className="gap-2 px-6 py-4 border-t">
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
