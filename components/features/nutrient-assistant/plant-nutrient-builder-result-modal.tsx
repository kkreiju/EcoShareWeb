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

interface NutrientValues {
  Nitrogen: number;
  Phosphorus: number;
  Potassium: number;
}

interface AvailableMaterial {
  compostable: string;
  grams_needed: number;
  is_recommended: boolean;
  match_score: number;
  nutrients: NutrientValues;
}

interface PlantNeeds {
  K: number;
  N: number;
  P: number;
}

interface CompostRecommendation {
  compostable: string;
  grams_needed: number;
  match_score: number;
  nutrients: NutrientValues;
  explanation?: string;
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

interface CompostData {
  available_materials: AvailableMaterial[];
  count: number;
  listings: CompostListing[];
  plant: string;
  plant_needs: PlantNeeds;
  recommendations: CompostRecommendation[];
  stage: string;
}

interface PlantNutrientBuilderResultModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  compostData: CompostData | null;
}

const getNutrientColor = (nutrient: string): string => {
  switch (nutrient.toLowerCase()) {
    case "nitrogen":
    case "n":
      return "#FF6B6B";
    case "phosphorus":
    case "p":
      return "#FFD93D";
    case "potassium":
    case "k":
      return "#6BCB77";
    default:
      return "#4D96FF";
  }
};

const formatWeight = (grams: number) => {
  if (grams >= 1000) {
    return `${(grams / 1000).toFixed(1)}kg`;
  }
  return `${grams.toFixed(1)}g`;
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
    available_materials,
    recommendations,
    listings,
    stage
  } = compostData;

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
                <Sprout className="h-5 w-5" style={{ color: "#03EF62" }} />
                Compost Analysis
              </DialogTitle>
              <DialogDescription>
                Detailed nutrient analysis and recommendations for your selected plant
              </DialogDescription>
            </DialogHeader>

            {/* Main Content Stack */}
            <div className="space-y-8">
              {/* Plant & Nutrient Target Section */}
              <div className="bg-muted/30 p-6 rounded-xl border space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Sprout className="h-4 w-4" style={{ color: "#03EF62" }} />
                      <span className="text-sm font-medium">Selected Plant</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-2xl font-bold text-foreground">{plant}</h3>
                      <Badge variant="secondary" className="text-sm">
                        {stage} Stage
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground md:justify-end">
                      <Droplets className="h-4 w-4" style={{ color: "#4D96FF" }} />
                      <span className="text-sm font-medium">Nutrient Needs</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(['N', 'P', 'K'] as const).map((nutrient) => (
                        <Badge
                          key={nutrient}
                          variant="outline"
                          className="px-3 py-1.5 gap-2 text-sm font-normal bg-background"
                          style={{
                            borderColor: `${getNutrientColor(nutrient)}40`,
                          }}
                        >
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: getNutrientColor(nutrient) }}
                          />
                          <span className="font-medium text-muted-foreground">
                            {nutrient}
                          </span>
                          <span className="font-bold text-foreground">
                            {plant_needs[nutrient]}g
                          </span>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Analysis & Recommendations Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Selected Materials Analysis */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Leaf className="h-4 w-4" style={{ color: "#6BCB77" }} />
                    <span className="text-sm font-medium">
                      Selected Materials Analysis ({available_materials.length})
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    {available_materials.map((material, idx) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-lg border space-y-3 ${
                          material.is_recommended 
                            ? "bg-muted/30" 
                            : "bg-red-50/30 border-red-100 dark:bg-red-900/10 dark:border-red-900/50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-foreground">
                            {material.compostable}
                          </h4>
                          
                          {material.is_recommended ? (
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800">
                              <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">Amount Needed</span>
                              <span className="font-mono font-bold">{formatWeight(material.grams_needed)}</span>
                            </div>
                          ) : (
                            <Badge variant="destructive">
                              Not Recommended
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-3 text-xs">
                          <span className="text-muted-foreground">Nutrients:</span>
                          <Badge variant="outline" className="bg-blue-50 dark:bg-blue-950/30">
                            N: {material.nutrients.Nitrogen}g
                          </Badge>
                          <Badge variant="outline" className="bg-green-50 dark:bg-green-950/30">
                            P: {material.nutrients.Phosphorus}g
                          </Badge>
                          <Badge variant="outline" className="bg-purple-50 dark:bg-purple-950/30">
                            K: {material.nutrients.Potassium}g
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Compost Recommendations */}
                {recommendations && recommendations.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Leaf className="h-4 w-4" style={{ color: "#6BCB77" }} />
                      <span className="text-sm font-medium">Additional Recommendations</span>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      {recommendations.map((rec, idx) => (
                        <div key={idx} className="p-4 bg-muted/30 rounded-lg border space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-foreground">{rec.compostable}</h4>
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800">
                              <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">Amount Needed</span>
                              <span className="font-mono font-bold">{formatWeight(rec.grams_needed)}</span>
                            </div>
                          </div>
                          
                          {rec.explanation && (
                            <p className="text-sm text-muted-foreground">{rec.explanation}</p>
                          )}

                          <div className="flex items-center gap-3 text-xs">
                              <span className="text-muted-foreground">Nutrients:</span>
                              <Badge variant="outline" className="bg-blue-50 dark:bg-blue-950/30">
                                N: {rec.nutrients.Nitrogen}g
                              </Badge>
                              <Badge variant="outline" className="bg-green-50 dark:bg-green-950/30">
                                P: {rec.nutrients.Phosphorus}g
                              </Badge>
                              <Badge variant="outline" className="bg-purple-50 dark:bg-purple-950/30">
                                K: {rec.nutrients.Potassium}g
                              </Badge>
                            </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {listings && listings.length > 0 && <Separator />}

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

