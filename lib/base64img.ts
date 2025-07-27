/**
 * Converts an image URL to base64 string with data URL prefix
 * @param imageUrl - The URL of the image to convert
 * @returns Promise<string> - Base64 encoded string with data URL prefix
 */
export async function imageUrlToBase64(imageUrl: string): Promise<string> {
  try {
    // Fetch the image
    const response = await fetch(imageUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
    }

    // Get the image as array buffer
    const arrayBuffer = await response.arrayBuffer();
    
    // Convert to base64
    const base64String = Buffer.from(arrayBuffer).toString('base64');
    
    // Get content type from response headers
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    
    // Return with data URL prefix
    return `data:${contentType};base64,${base64String}`;
    
  } catch (error) {
    throw new Error(`Failed to convert image to base64: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// Example usage:
// const base64Image = await imageUrlToBase64('https://example.com/image.jpg');
// console.log(base64Image);