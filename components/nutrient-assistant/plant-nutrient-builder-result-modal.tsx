"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Leaf,
  Droplets,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  MapPin,
  Clock,
  DollarSign,
  Sprout,
  X
} from "lucide-react";

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

interface CombinedAnalysis {
  assessment: string;
  match_quality: string;
  matches_plant_needs: NutrientMatch;
  final_mix: NutrientMix;
}

interface CompostRecommendation {
  compostable: string;
  explanation: string;
  nutrient_score: number;
  nutrients: {
    Nitrogen: number;
    Phosphorus: number;
    Potassium: number;
  };
  score: number;
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
  list_tags: string;
  list_title: string;
  list_type: string;
  user_id?: string;
  user_firstName: string;
  user_lastName: string;
  user_profileURL?: string;
  user_ratings?: string;
}

interface CompostData {
  plant: string;
  plant_needs: PlantNeeds;
  available_materials_provided: string[];
  count: number;
  combined_analysis: CombinedAnalysis;
  recommendations: CompostRecommendation[];
  listings: CompostListing[];
}

interface PlantNutrientBuilderResultModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  compostData: CompostData | null;
}

const getNutrientColor = (nutrient: string): string => {
  switch (nutrient.toLowerCase()) {
    case "nitrogen":
      return "#FF6B6B";
    case "phosphorus":
      return "#FFD93D";
    case "potassium":
      return "#6BCB77";
    default:
      return "#4D96FF";
  }
};

const getQualityColor = (quality: string) => {
  switch (quality.toLowerCase()) {
    case "perfect match":
      return "#6BCB77";
    case "good match":
      return "#FFD93D";
    case "partial match":
    case "needs adjustment":
      return "#FF9F4D";
    default:
      return "#9CA3AF";
  }
};

export function PlantNutrientBuilderResultModal({
  open,
  onOpenChange,
  compostData,
}: PlantNutrientBuilderResultModalProps) {
  const router = useRouter();

  if (!compostData) return null;

  const {
    plant,
    plant_needs,
    available_materials_provided,
    combined_analysis,
    recommendations,
    listings,
  } = compostData;

  const { matches_plant_needs, final_mix, match_quality, assessment } = combined_analysis;

  const handleListingClick = (listing: CompostListing) => {
    router.push(`/user/listing?id=${listing.list_id}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-5xl max-h-[90vh] p-0">
        <ScrollArea className="max-h-[80vh] px-6">
          <div className="space-y-6 py-6">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Sprout className="h-5 w-5" style={{ color: "#03EF62" }} />
                Compost Analysis
              </DialogTitle>
              <DialogDescription>
                Detailed nutrient analysis and recommendations for your selected plant
              </DialogDescription>
            </DialogHeader>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Selected Plant */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Sprout className="h-4 w-4" style={{ color: "#03EF62" }} />
                    <span className="text-sm font-medium">Selected Plant</span>
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">{plant}</h3>
                </div>

                <Separator />

                {/* Plant Nutrient Needs */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Droplets className="h-4 w-4" style={{ color: "#4D96FF" }} />
                    <span className="text-sm font-medium">Plant Nutrient Needs</span>
                  </div>
                  <div className="space-y-2">
                    {["nitrogen", "phosphorus", "potassium"].map((nutrient) => (
                      <div key={nutrient} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: getNutrientColor(nutrient) }}
                          />
                          <span className="text-sm font-medium capitalize">{nutrient} ({nutrient[0].toUpperCase()})</span>
                        </div>
                        <span className="text-sm font-semibold">
                          {plant_needs[nutrient as keyof PlantNeeds]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Selected Materials */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Leaf className="h-4 w-4" style={{ color: "#6BCB77" }} />
                    <span className="text-sm font-medium">
                      Selected Materials ({available_materials_provided.length})
                    </span>
                  </div>
                  <div className="space-y-2">
                    {available_materials_provided.map((material, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 p-2 rounded-lg"
                        style={{ backgroundColor: "rgba(3, 239, 98, 0.1)" }}
                      >
                        <div
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: "#03EF62" }}
                        />
                        <span className="text-sm text-foreground">{material}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Final Mix Analysis */}
                <div
                  className="space-y-4 p-4 rounded-lg border-2"
                  style={{ borderColor: getQualityColor(match_quality) }}
                >
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <TrendingUp className="h-4 w-4" style={{ color: getQualityColor(match_quality) }} />
                    <span className="text-sm font-medium">Final Mix Analysis</span>
                  </div>

                  {/* Match Quality */}
                  <div className="space-y-2">
                    <span className="text-xs font-medium text-muted-foreground uppercase">Match Quality</span>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span
                        className="font-semibold capitalize"
                        style={{ color: getQualityColor(match_quality) }}
                      >
                        {match_quality}
                      </span>
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: getQualityColor(match_quality) }}
                      />
                    </div>
                  </div>

                  {/* Assessment */}
                  <div className="space-y-2">
                    <span className="text-xs font-medium text-muted-foreground uppercase">Assessment</span>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm leading-relaxed text-foreground">{assessment}</p>
                    </div>
                  </div>

                  {/* Nutrient Match */}
                  <div className="space-y-2">
                    <span className="text-xs font-medium text-muted-foreground uppercase">Nutrient Match</span>
                    <div className="space-y-2">
                      {["nitrogen", "phosphorus", "potassium"].map((nutrient) => (
                        <div key={nutrient} className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                          {matches_plant_needs[nutrient as keyof NutrientMatch] ? (
                            <CheckCircle className="h-4 w-4" style={{ color: "#6BCB77" }} />
                          ) : (
                            <AlertCircle className="h-4 w-4" style={{ color: "#FF6B6B" }} />
                          )}
                          <span className="text-sm font-medium capitalize">
                            {nutrient}: {final_mix[nutrient as keyof NutrientMix].toFixed(1)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Compost Recommendations */}
            {recommendations && recommendations.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Leaf className="h-4 w-4" style={{ color: "#6BCB77" }} />
                  <span className="text-sm font-medium">Compost Recommendations</span>
                </div>

                <div className="space-y-3">
                  {recommendations.map((rec, idx) => (
                    <div key={idx} className="p-4 bg-muted/30 rounded-lg border">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-base">{rec.compostable}</h4>
                          <Badge
                            variant={rec.score > 0.5 ? "default" : "secondary"}
                            className={rec.score > 0.5 ? "bg-green-600" : ""}
                          >
                            Score: {(rec.score * 100).toFixed(0)}%
                          </Badge>
                        </div>

                        <p className="text-sm text-muted-foreground">{rec.explanation}</p>

                        <div className="flex items-center gap-3 text-xs">
                          <span className="text-muted-foreground">Nutrients:</span>
                          <Badge variant="outline" className="bg-blue-50 dark:bg-blue-950/30">
                            N: {rec.nutrients.Nitrogen}
                          </Badge>
                          <Badge variant="outline" className="bg-green-50 dark:bg-green-950/30">
                            P: {rec.nutrients.Phosphorus}
                          </Badge>
                          <Badge variant="outline" className="bg-purple-50 dark:bg-purple-950/30">
                            K: {rec.nutrients.Potassium}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Available Compost Listings */}
            {listings && listings.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" style={{ color: "#FF6B6B" }} />
                  <span className="text-sm font-medium">Available Compost Listings</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {listings.map((listing, idx) => (
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
                              Qty: {listing.list_quantity}
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

