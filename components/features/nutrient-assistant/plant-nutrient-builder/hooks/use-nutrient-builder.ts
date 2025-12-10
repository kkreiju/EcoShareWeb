"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabase/api";
import { toast } from "sonner";

export const PLANT_OPTIONS = [
  "Avocado",
  "Banana",
  "Bell Pepper",
  "Bitter Gourd",
  "Cabbage",
  "Calamansi",
  "Carrot",
  "Chayote",
  "Eggplant",
  "Mango",
  "Papaya",
  "Pechay",
  "Pineapple",
  "Spinach",
  "Spring Onion",
  "Squash",
  "Tomato",
] as const;

export const COMPOSTABLE_MATERIALS = [
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
] as const;

export const PLANT_STAGES = [
  "Seedling",
  "Vegetative",
  "Flowering",
  "Fruiting",
] as const;

interface UseNutrientBuilderReturn {
  userData: any;
  selectedPlant: string;
  selectedStage: string;
  selectedCompostMaterials: string[];
  isGenerating: boolean;
  compostPlan: any;
  showPlanDialog: boolean;
  setSelectedPlant: (plant: string) => void;
  setSelectedStage: (stage: string) => void;
  handleCompostToggle: (material: string) => void;
  removeCompostMaterial: (material: string) => void;
  handleGenerate: () => Promise<void>;
  setShowPlanDialog: (show: boolean) => void;
}

/**
 * Custom hook for managing nutrient builder state and API calls
 */
export function useNutrientBuilder(): UseNutrientBuilderReturn {
  const { user } = useAuth();
  const [userData, setUserData] = useState<any>(null);
  const [selectedPlant, setSelectedPlant] = useState<string>("");
  const [selectedStage, setSelectedStage] = useState<string>("");
  const [selectedCompostMaterials, setSelectedCompostMaterials] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [compostPlan, setCompostPlan] = useState<any>(null);
  const [showPlanDialog, setShowPlanDialog] = useState(false);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.email) return;

      try {
        const { data, error } = await supabase
          .from("User")
          .select("user_id")
          .eq("user_email", user.email)
          .single();

        if (!error && data) {
          setUserData(data);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    fetchUserData();
  }, [user?.email]);

  const handleCompostToggle = useCallback((material: string) => {
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
  }, []);

  const removeCompostMaterial = useCallback((material: string) => {
    setSelectedCompostMaterials((prev) => prev.filter((m) => m !== material));
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!selectedPlant) {
      toast.error("Please select a plant");
      return;
    }
    if (!selectedStage) {
      toast.error("Please select a growth stage");
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch("/api/ai/builder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plant: selectedPlant,
          stage: selectedStage,
          available_materials: selectedCompostMaterials.length === 0 ? ["N/A"] : selectedCompostMaterials,
          userId: userData?.user_id || "",
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const result = await response.json();

      if (result.success && result.compostData) {
        setCompostPlan(result.compostData);
        setShowPlanDialog(true);
      } else {
        toast.error("Failed to generate analysis. Please try again.");
      }
    } catch (error) {
      console.error("Error generating compost plan:", error);
      toast.error("Action failed. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  }, [selectedPlant, selectedCompostMaterials, userData?.user_id]);

  return {
    userData,
    selectedPlant,
    selectedStage,
    selectedCompostMaterials,
    isGenerating,
    compostPlan,
    showPlanDialog,
    setSelectedPlant,
    setSelectedStage,
    handleCompostToggle,
    removeCompostMaterial,
    handleGenerate,
    setShowPlanDialog,
  };
}

