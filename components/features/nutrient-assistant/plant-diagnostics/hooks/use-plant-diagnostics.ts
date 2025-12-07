"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabase/api";

export interface DiagnosisResult {
  plantName: string;
  confidence: number;
  plantNeeds?: any;
  finalMix?: any;
  matchQuality?: any;
  matchesPlantNeeds?: any;
  assessment?: any;
  recommendations?: any;
  listings?: any;
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

interface UsePlantDiagnosticsReturn {
  userData: any;
  isLoading: boolean;
  error: string | null;
  diagnosisResult: DiagnosisResult | null;
  showResultsDialog: boolean;
  showNonPlantDialog: boolean;
  analyzeImage: (imageBase64: string) => Promise<void>;
  setShowResultsDialog: (show: boolean) => void;
  setShowNonPlantDialog: (show: boolean) => void;
  resetDiagnosis: () => void;
}

/**
 * Custom hook for managing plant diagnostics analysis
 */
export function usePlantDiagnostics(): UsePlantDiagnosticsReturn {
  const { user } = useAuth();
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisResult | null>(null);
  const [showResultsDialog, setShowResultsDialog] = useState(false);
  const [showNonPlantDialog, setShowNonPlantDialog] = useState(false);

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

  const analyzeImage = useCallback(async (imageBase64: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Send to API for analysis
      const response = await fetch("/api/ai/diagnostics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: imageBase64,
          userId: userData?.user_id || "",
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        // Check if the result is "others" (not a plant)
        if (
          result.data.prediction?.toLowerCase() === 'others' ||
          result.data.prediction?.toLowerCase() === 'other' ||
          result.data.prediction?.toLowerCase() === 'unknown'
        ) {
          // Show non-plant modal
          setShowNonPlantDialog(true);
        } else {
          // Set comprehensive diagnosis results
          setDiagnosisResult({
            plantName: result.data.prediction,
            confidence: result.data.confidence,
            plantNeeds: result.data.plant_needs || result.data.nutrient_targets,
            finalMix: result.data.combined_analysis?.final_mix,
            matchQuality: result.data.combined_analysis?.match_quality,
            matchesPlantNeeds: result.data.combined_analysis?.matches_plant_needs,
            assessment: result.exg_analysis?.description || result.data.combined_analysis?.assessment,
            status: result.data?.diagnosis?.status || result.exg_analysis?.status,
            recommendations: result.data.recommendations,
            listings: result.data.listings,
            nutrientNeeds: result.diagnosis?.nutrientNeeds || '',
            compostSuggestions: result.diagnosis?.compostSuggestions || '',
            capturedImage: imageBase64,
            diagnosis: {
              severity: result.data?.diagnosis?.severity || result.exg_analysis?.severity || result.data?.combined_analysis?.severity,
              status: result.data?.diagnosis?.status || result.exg_analysis?.status,
              description: result.data?.diagnosis?.description || result.exg_analysis?.description || result.data?.combined_analysis?.summary,
              recommended_action:
                result.data?.diagnosis?.recommended_action ||
                result.exg_analysis?.recommended_action ||
                result.exg_analysis?.recommendation ||
                result.data?.combined_analysis?.recommended_action,
            },
          });

          // Show results dialog
          setShowResultsDialog(true);
        }
      } else {
        throw new Error(result.message || "Analysis failed");
      }

      setIsLoading(false);
    } catch (err) {
      console.error("Error analyzing image:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to analyze image. Please try again."
      );
      setIsLoading(false);
      throw err;
    }
  }, [userData?.user_id]);

  const resetDiagnosis = useCallback(() => {
    setDiagnosisResult(null);
    setShowResultsDialog(false);
    setShowNonPlantDialog(false);
    setError(null);
  }, []);

  return {
    userData,
    isLoading,
    error,
    diagnosisResult,
    showResultsDialog,
    showNonPlantDialog,
    analyzeImage,
    setShowResultsDialog,
    setShowNonPlantDialog,
    resetDiagnosis,
  };
}
