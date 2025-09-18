"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface GoogleMapsContextType {
  isLoaded: boolean;
  loadError: string | null;
}

const GoogleMapsContext = createContext<GoogleMapsContextType>({
  isLoaded: false,
  loadError: null,
});

export const useGoogleMaps = () => {
  const context = useContext(GoogleMapsContext);
  if (!context) {
    throw new Error("useGoogleMaps must be used within a GoogleMapsProvider");
  }
  return context;
};

interface GoogleMapsProviderProps {
  children: ReactNode;
  apiKey: string;
}

export function GoogleMapsProvider({ children, apiKey }: GoogleMapsProviderProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (window.google && window.google.maps) {
      setIsLoaded(true);
      return;
    }

    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      const checkGoogleLoaded = () => {
        if (window.google && window.google.maps) {
          setIsLoaded(true);
        } else {
          setTimeout(checkGoogleLoaded, 100);
        }
      };
      checkGoogleLoaded();
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.id = "google-maps-script";

    script.onload = () => setIsLoaded(true);
    script.onerror = () => setLoadError("Failed to load Google Maps");

    document.head.appendChild(script);
  }, [apiKey]);

  return (
    <GoogleMapsContext.Provider value={{ isLoaded, loadError }}>
      {children}
    </GoogleMapsContext.Provider>
  );
}
