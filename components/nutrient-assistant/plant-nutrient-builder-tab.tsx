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
    <div className="space-y-6">
      {/* Plant Selection */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5 text-green-600" />
            Nutrient Plan Builder
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Plant Selection */}
          <div className="space-y-2">
            <Label htmlFor="plant-select">Plant Names</Label>
            <Select value={selectedPlant} onValueChange={setSelectedPlant}>
              <SelectTrigger>
                <SelectValue placeholder="Select a plant" />
              </SelectTrigger>
              <SelectContent>
                {PLANT_NAMES.map((plant) => (
                  <SelectItem key={plant} value={plant}>
                    {plant}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Compost Materials Multi-Select */}
          <div className="space-y-2">
            <Label>Compostable Materials (Select up to 3)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between text-left font-normal"
                >
                  {selectedCompostMaterials.length === 0
                    ? "Select compost materials"
                    : `${selectedCompostMaterials.length} of 3 selected`}
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <ScrollArea className="h-48">
                  <div className="p-2">
                    {COMPOST_NAMES.map((material) => (
                      <div
                        key={material}
                        className="flex items-center space-x-2 p-2 hover:bg-accent rounded-md"
                      >
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
                          className="text-sm font-normal cursor-pointer flex-1"
                        >
                          {material}
                        </Label>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </PopoverContent>
            </Popover>

            {/* Selected Materials Display */}
            {selectedCompostMaterials.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedCompostMaterials.map((material) => (
                  <Badge
                    key={material}
                    variant="secondary"
                    className="flex items-center gap-1 bg-green-100 text-green-800"
                  >
                    {material}
                    <button
                      onClick={() => removeCompostMaterial(material)}
                      className="ml-1 hover:bg-green-200 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={
              !selectedPlant ||
              selectedCompostMaterials.length === 0 ||
              isGenerating
            }
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            size="lg"
          >
            {isGenerating ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating Plan...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Generate Nutrient Plan
              </div>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Compost Plan Results Dialog */}
      <Dialog open={showPlanDialog} onOpenChange={setShowPlanDialog}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5 text-green-600" />
              Compost Building Instructions
            </DialogTitle>
          </DialogHeader>

          {compostPlan && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
              {/* Left Column - Plant Info & Materials */}
              <div className="space-y-4">
                {/* Plant Info */}
                <div className="text-center p-6 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Check className="h-8 w-8 text-green-600" />
                    <span className="text-xl font-semibold">
                      {selectedPlant}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Compost plan generated successfully
                  </p>
                </div>

                {/* Materials Used */}
                <div className="space-y-3">
                  <h4 className="font-medium flex items-center gap-2 text-base">
                    <Sparkles className="h-4 w-4 text-green-600" />
                    Materials Used ({selectedCompostMaterials.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCompostMaterials.map((material) => (
                      <Badge
                        key={material}
                        variant="outline"
                        className="text-xs bg-green-50 text-green-700 border-green-200"
                      >
                        {material}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setShowPlanDialog(false)}
                    className="w-full"
                  >
                    Close
                  </Button>
                </div>
              </div>

              {/* Right Column - Building Instructions */}
              <div className="space-y-4">
                <div className="space-y-3">
                  <h4 className="font-medium text-base flex items-center gap-2">
                    <Wrench className="h-4 w-4 text-green-600" />
                    Building Instructions
                  </h4>
                  <div className="bg-muted rounded-lg p-4 h-96 overflow-auto">
                    <pre className="text-sm whitespace-pre-wrap font-mono leading-relaxed">
                      {JSON.stringify(compostPlan, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
