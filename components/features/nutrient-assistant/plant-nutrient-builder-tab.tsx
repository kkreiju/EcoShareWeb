"use client";

import { Button } from "@/components/ui/button";
import { Sparkles, Check } from "lucide-react";
import { PlantNutrientBuilderResultModal } from "./plant-nutrient-builder-result-modal";
import { useNutrientBuilder, PLANT_OPTIONS, COMPOSTABLE_MATERIALS, PLANT_STAGES } from "./plant-nutrient-builder/hooks/use-nutrient-builder";

export function PlantNutrientBuilderTab() {
  const {
    selectedPlant,
    selectedStage,
    selectedCompostMaterials,
    isGenerating,
    compostPlan,
    showPlanDialog,
    setSelectedPlant,
    setSelectedStage,
    handleCompostToggle,
    handleGenerate,
    setShowPlanDialog,
  } = useNutrientBuilder();

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full mb-4">
          <Sparkles className="h-8 w-8 text-blue-600" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            Nutrient Builder
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Create personalized compost plans by selecting your plant type and available materials
          </p>
        </div>
      </div>

      {/* Form Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Plant Selection Card */}
        <div className="bg-card border rounded-lg p-6 shadow-sm">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-full">
                <span className="text-sm font-semibold text-green-600">1</span>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">Choose Your Plant</h2>
                <p className="text-sm text-muted-foreground">Select the plant you want to create nutrients for</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {PLANT_OPTIONS.map((plant) => (
                <button
                  key={plant}
                  onClick={() => setSelectedPlant(plant)}
                  disabled={isGenerating}
                  className={`px-4 py-2 rounded-full border flex items-center gap-2 transition-all duration-200 ${
                    selectedPlant === plant
                      ? "bg-green-500 border-green-500 text-white shadow-md"
                      : "bg-muted border-border text-foreground hover:bg-muted/80 hover:shadow-sm"
                  }`}
                >
                  <span className="text-sm font-medium">{plant}</span>
                  {selectedPlant === plant && <Check className="h-3.5 w-3.5" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stage Selection Card */}
        <div className="bg-card border rounded-lg p-6 shadow-sm">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                <span className="text-sm font-semibold text-purple-600">2</span>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">Select Stage</h2>
                <p className="text-sm text-muted-foreground">Select the growth stage of your plant</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {PLANT_STAGES.map((stage) => (
                <button
                  key={stage}
                  onClick={() => setSelectedStage(stage)}
                  disabled={isGenerating}
                  className={`px-4 py-2 rounded-full border flex items-center gap-2 transition-all duration-200 ${
                    selectedStage === stage
                      ? "bg-purple-500 border-purple-500 text-white shadow-md"
                      : "bg-muted border-border text-foreground hover:bg-muted/80 hover:shadow-sm"
                  }`}
                >
                  <span className="text-sm font-medium">{stage}</span>
                  {selectedStage === stage && <Check className="h-3.5 w-3.5" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Materials Selection Card */}
        <div className="bg-card border rounded-lg p-6 shadow-sm">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                <span className="text-sm font-semibold text-blue-600">3</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-foreground">Available Materials</h2>
                  <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded-full">
                    {selectedCompostMaterials.length}/3 selected
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">Choose up to 3 compostable materials you have</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {COMPOSTABLE_MATERIALS.map((material) => (
                <button
                  key={material}
                  onClick={() => handleCompostToggle(material)}
                    disabled={
                    isGenerating ||
                    (!selectedCompostMaterials.includes(material) &&
                      selectedCompostMaterials.length >= 3)
                  }
                  style={{
                    opacity:
                      !selectedCompostMaterials.includes(material) &&
                      selectedCompostMaterials.length >= 3
                        ? 0.5
                        : 1,
                  }}
                  className={`px-4 py-2 rounded-full border flex items-center gap-2 transition-all duration-200 ${
                    selectedCompostMaterials.includes(material)
                      ? "bg-blue-500 border-blue-500 text-white shadow-md"
                      : "bg-muted border-border text-foreground hover:bg-muted/80 hover:shadow-sm"
                  }`}
                >
                  <span className="text-sm font-medium">{material}</span>
                  {selectedCompostMaterials.includes(material) && (
                    <Check className="h-3.5 w-3.5" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Generate Button */}
      <div className="text-center py-8">
        <Button
          onClick={handleGenerate}
          disabled={!selectedPlant || isGenerating}
          size="lg"
          className="px-12 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {isGenerating ? (
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Generating Analysis...
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5" />
              Create Nutrient Plan
            </div>
          )}
        </Button>
      </div>

      {/* Instructions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-full">
            <span className="text-sm font-semibold text-green-600">1</span>
                </div>
          <h3 className="font-semibold">Select Plant</h3>
          <p className="text-sm text-muted-foreground">
            Choose the specific plant you want to create nutrients for
          </p>
              </div>

        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full">
            <span className="text-sm font-semibold text-blue-600">2</span>
                        </div>
          <h3 className="font-semibold">Pick Materials</h3>
                        <p className="text-sm text-muted-foreground">
            Select compostable materials you currently have available
                        </p>
                      </div>

        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-full">
            <span className="text-sm font-semibold text-purple-600">3</span>
                      </div>
          <h3 className="font-semibold">Get Results</h3>
          <p className="text-sm text-muted-foreground">
            Receive AI-powered analysis and personalized recommendations
          </p>
                  </div>
              </div>

      {/* Result Modal */}
      <PlantNutrientBuilderResultModal
        open={showPlanDialog}
        onOpenChange={setShowPlanDialog}
        compostData={compostPlan}
      />
    </div>
  );
}
