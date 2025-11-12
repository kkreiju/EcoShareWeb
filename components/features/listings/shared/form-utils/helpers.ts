/**
 * Shared helper functions for listing forms
 */

/**
 * Parse tags from string or array format
 */
export function parseTags(tagsString: string | string[] | undefined): string[] {
  if (Array.isArray(tagsString)) {
    return tagsString;
  }
  if (typeof tagsString === "string") {
    try {
      return JSON.parse(tagsString) || [];
    } catch {
      return [];
    }
  }
  return [];
}

/**
 * Convert file to base64 string
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}

/**
 * Reverse geocode coordinates to address using Google Maps API
 */
export async function reverseGeocode(latitude: number, longitude: number, apiKey: string): Promise<string> {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === "OK" && data.results && data.results.length > 0) {
      return data.results[0].formatted_address;
    } else {
      console.error("Geocoding failed:", data.status, data.error_message);
      return `Location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
    }
  } catch (error) {
    console.error("Error fetching address:", error);
    return `Location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
  }
}

/**
 * Map listing type to API format
 */
export function mapListingType(type: "free" | "wanted" | "sale" | null): string {
  const typeMapping = {
    free: "Free",
    wanted: "Wanted",
    sale: "Sale"
  };
  return typeMapping[type as keyof typeof typeMapping] || "Free";
}

/**
 * Get user-friendly geolocation error message
 */
export function getGeolocationErrorMessage(error: GeolocationPositionError): string {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      return "Location access denied. Please enable location permissions and try again.";
    case error.POSITION_UNAVAILABLE:
      return "Location information is unavailable. Please try again later.";
    case error.TIMEOUT:
      return "Location request timed out. Please try again.";
    default:
      return "An unknown error occurred while retrieving location.";
  }
}

