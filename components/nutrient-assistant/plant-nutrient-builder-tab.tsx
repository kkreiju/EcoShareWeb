"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Wrench, Sparkles, Check, X, ChevronDown } from "lucide-react";

const PLANT_NAMES = [
  "Avocado",
  "Banana",
  "Bellpepper",
  "Bittergourd",
  "Cabbage",
  "Calamansi",
  "Carrot",
  "Chayote",
  "Eggplant",
  "Mango",
  "Papapaya",
  "Pechay",
  "Pineapple",
  "Spinach",
  "Spring Onion",
  "Squash",
  "Tomato",
];

const COMPOST_NAMES = [
  "Banana Peels",
  "Coffee Grounds",
  "Crushed Eggshell",
  "Dried Leaves",
  "Mango Peels",
  "Manure",
  "Orange Peels",
  "Pineapple Peels",
  "Potato Peels",
  "Saw Dust",
  "Vegetable Scraps",
];

export function PlantNutrientBuilderTab() {
  const [selectedPlant, setSelectedPlant] = useState<string>("");
  const [selectedCompostMaterials, setSelectedCompostMaterials] = useState<
    string[]
  >([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [compostPlan, setCompostPlan] = useState<any>(null);
  const [showPlanDialog, setShowPlanDialog] = useState(false);

  const handleCompostToggle = (material: string) => {
    setSelectedCompostMaterials((prev) => {
      if (prev.includes(material)) {
        // If already selected, remove it
        return prev.filter((m) => m !== material);
      } else {
        // If not selected, only add if we haven't reached the limit of 3
        if (prev.length >= 3) {
          return prev; // Don't add if already at limit
        }
        return [...prev, material];
      }
    });
  };

  const removeCompostMaterial = (material: string) => {
    setSelectedCompostMaterials((prev) => prev.filter((m) => m !== material));
  };

  const handleGenerate = async () => {
    if (!selectedPlant || selectedCompostMaterials.length === 0) return;

    setIsGenerating(true);

    try {
      const response = await fetch("/api/ai/builder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plant: selectedPlant,
          available_materials: selectedCompostMaterials,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setCompostPlan(result.compostData);
        setShowPlanDialog(true);
      } else {
        throw new Error(result.message || "Failed to generate compost plan");
      }

      setIsGenerating(false);
    } catch (error) {
      console.error("Error generating compost plan:", error);
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-green-800 dark:text-green-200">
          Nutrient Plant Builder
        </h2>
        <p className="text-muted-foreground">
          Select your plant and available compost materials to generate a personalized nutrient plan
        </p>
      </div>

      {/* Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Plant Selection */}
        <Card className="border-2 border-dashed border-green-200 dark:border-green-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Select Plant
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Choose one plant type for your nutrient plan
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {PLANT_NAMES.map((plant) => (
                <div key={plant} className="flex items-center space-x-2">
                  <Checkbox
                    id={plant}
                    checked={selectedPlant === plant}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedPlant(plant);
                      } else {
                        setSelectedPlant("");
                      }
                    }}
                  />
                  <Label
                    htmlFor={plant}
                    className="text-sm cursor-pointer leading-tight"
                  >
                    {plant}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Materials Selection */}
        <Card className="border-2 border-dashed border-green-200 dark:border-green-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Compost Materials
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Select up to 3 materials you have available
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {COMPOST_NAMES.map((material) => (
                <div key={material} className="flex items-center space-x-2">
                  <Checkbox
                    id={material}
                    checked={selectedCompostMaterials.includes(material)}
                    disabled={
                      !selectedCompostMaterials.includes(material) &&
                      selectedCompostMaterials.length >= 3
                    }
                    onCheckedChange={() => handleCompostToggle(material)}
                  />
                  <Label
                    htmlFor={material}
                    className="text-sm cursor-pointer leading-tight"
                  >
                    {material}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Selected Items Summary */}
      {(selectedPlant || selectedCompostMaterials.length > 0) && (
        <Card className="border-green-200 bg-green-50/50 dark:bg-green-950/20">
          <CardContent className="pt-4 pb-4">
            <div className="space-y-2">
              {selectedPlant && (
                <div>
                  <h3 className="font-medium text-green-800 dark:text-green-200 mb-1">
                    Selected Plant
                  </h3>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {selectedPlant}
                  </Badge>
                </div>
              )}

              {selectedCompostMaterials.length > 0 && (
                <div>
                  <h3 className="font-medium text-green-800 dark:text-green-200 mb-1">
                    Selected Materials ({selectedCompostMaterials.length}/3)
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCompostMaterials.map((material) => (
                      <Badge
                        key={material}
                        variant="secondary"
                        className="bg-green-100 text-green-800 hover:bg-green-200"
                      >
                        {material}
                        <button
                          onClick={() => removeCompostMaterial(material)}
                          className="ml-2 hover:bg-green-300 rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Generate Button */}
      <div className="flex justify-center">
        <Button
          onClick={handleGenerate}
          disabled={
            !selectedPlant ||
            selectedCompostMaterials.length === 0 ||
            isGenerating
          }
          size="lg"
          className="px-8 py-3 text-lg font-medium"
        >
          {isGenerating ? (
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Generating Plan...
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5" />
              Generate Nutrient Plan
            </div>
          )}
        </Button>
      </div>

      {/* Compost Plan Results Dialog */}
      <Dialog open={showPlanDialog} onOpenChange={setShowPlanDialog}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-600" />
              Nutrient Plan for {selectedPlant}
            </DialogTitle>
          </DialogHeader>

          {compostPlan && (
            <div className="space-y-6">
              {/* Materials Used */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">
                  Materials Used
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedCompostMaterials.map((material) => (
                    <Badge key={material} variant="secondary">
                      {material}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">
                  Recommendations
                </h3>
                <ScrollArea className="h-96">
                  <div className="space-y-4">
                    {compostPlan?.recommendations?.map((recommendation: any, index: number) => (
                      <div key={index} className="border rounded-lg p-4 space-y-3">
                        <h4 className="font-medium text-green-700">
                          {recommendation.compostable}
                        </h4>

                        {/* Nutrient Values */}
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            N: {recommendation.nutrients?.Nitrogen || 0}
                          </Badge>
                          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                            P: {recommendation.nutrients?.Phosphorus || 0}
                          </Badge>
                          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                            K: {recommendation.nutrients?.Potassium || 0}
                          </Badge>
                        </div>

                        {/* Explanation */}
                        <p className="text-sm text-muted-foreground">
                          {recommendation.explanation}
                        </p>
                      </div>
                    )) || (
                      <div className="text-center py-8 text-muted-foreground">
                        No recommendations available
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>

              {/* Actions */}
              <div className="flex justify-end pt-4 border-t">
                <Button onClick={() => setShowPlanDialog(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
