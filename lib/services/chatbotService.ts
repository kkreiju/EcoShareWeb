export interface ChatbotResponse {
  success: string | boolean;
  message: string;
  listings?: string; // JSON string containing array of listing IDs
  error?: string;
}

export interface ChatbotRequest {
  sessionId: string;
  message: string;
  userId: string | null;
}

export class ChatbotService {
  private static readonly API_ENDPOINT = "/api/ai/chatbot";

  static async sendMessage(
    message: string,
    sessionId: string,
    userId: string | null
  ): Promise<ChatbotResponse> {
    try {
      const response = await fetch(this.API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          message,
          sessionId,
          userId,
        } as ChatbotRequest),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP ${response.status}: ${response.statusText}. ${errorText}`
        );
      }

      const data = await response.json();

      // Handle array response (API may return array with single object)
      const responseData = Array.isArray(data) ? data[0] : data;

      if (responseData.success === "false" || responseData.error) {
        throw new Error(
          responseData.error || 
          responseData.message || 
          "Failed to get response from chatbot"
        );
      }

      return responseData;
    } catch (error) {
      console.error("Error calling chatbot API:", error);
      throw error;
    }
  }
}

