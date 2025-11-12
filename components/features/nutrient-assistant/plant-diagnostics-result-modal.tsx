"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Leaf,
  Droplets,
  Target,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  MapPin,
  Clock,
  DollarSign,
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

  // Parse nutrient needs data
  const nutrientNeeds = result.nutrientNeeds
    ? result.nutrientNeeds.split(",").map((item) => item.trim()).filter((item) => item.length > 0)
    : [];

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
                {/* Plant Detection */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Leaf className="h-4 w-4" />
                    <span className="text-sm font-medium">Detected Plant</span>
                  </div>
                  <h3 className="text-2xl font-bold text-green-800 dark:text-green-200">
                    {result.plantName}
                  </h3>
                </div>

                {/* Compost Suggestions */}
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

            {/* Main Content - Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Plant Analysis */}
              <div className="space-y-6">
                {/* Assessment Summary */}
            {result.assessment && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Target className="h-4 w-4" style={{ color: "#4D96FF" }} />
                      <span className="text-sm font-medium">Assessment Summary</span>
                    </div>
                    <p className="text-base leading-relaxed text-foreground">{result.assessment}</p>
                  </div>
                )}

                {/* Nutrient Needs */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Droplets className="h-4 w-4" style={{ color: "#4D96FF" }} />
                    <span className="text-sm font-medium">Nutrient Needs</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {nutrientNeeds.map((nutrient, idx) => (
                      <Badge
                        key={idx}
                        variant="outline"
                        className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-800"
                      >
                        {nutrient}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Plant Needs vs Current Mix */}
            {result.plantNeeds && result.finalMix && result.matchesPlantNeeds && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <TrendingUp className="h-4 w-4" style={{ color: "#6BCB77" }} />
                      <span className="text-sm font-medium">Plant Needs vs Current Mix</span>
                    </div>

                    <div className="space-y-3">
                      {/* Nitrogen */}
                      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Nitrogen</p>
                          <p className="text-xs text-muted-foreground">{result.plantNeeds.nitrogen}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-lg font-bold ${
                              result.matchesPlantNeeds.nitrogen ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {result.finalMix.nitrogen.toFixed(1)}
                          </span>
                          {result.matchesPlantNeeds.nitrogen ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                          )}
                        </div>
                      </div>

                      {/* Phosphorus */}
                      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Phosphorus</p>
                          <p className="text-xs text-muted-foreground">{result.plantNeeds.phosphorus}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-lg font-bold ${
                              result.matchesPlantNeeds.phosphorus ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {result.finalMix.phosphorus.toFixed(1)}
                          </span>
                          {result.matchesPlantNeeds.phosphorus ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                          )}
                        </div>
                      </div>

                      {/* Potassium */}
                      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Potassium</p>
                          <p className="text-xs text-muted-foreground">{result.plantNeeds.potassium}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-lg font-bold ${
                              result.matchesPlantNeeds.potassium ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {result.finalMix.potassium.toFixed(1)}
                          </span>
                          {result.matchesPlantNeeds.potassium ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                          )}
                        </div>
                      </div>
                    </div>

                    {result.matchQuality && (
                      <p className="text-xs text-muted-foreground">Match Quality: {result.matchQuality}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Right Column - Recommendations */}
              <div className="space-y-6">
                {/* Compost Recommendations */}
            {result.recommendations && result.recommendations.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Leaf className="h-4 w-4" style={{ color: "#6BCB77" }} />
                      <span className="text-sm font-medium">Compost Recommendations</span>
                    </div>

                    <div className="space-y-3">
                      {result.recommendations.map((rec, idx) => (
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
                    </div>
                  </div>


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

