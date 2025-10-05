export interface ChatbotResponse {
  success: boolean;
  message: string;
}

export interface ChatbotRequest {
  message: string;
}

export class ChatbotService {
  private static readonly API_ENDPOINT = "/api/ai/chatbot";

  static async sendMessage(message: string): Promise<ChatbotResponse> {
    try {
      const response = await fetch(this.API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP ${response.status}: ${response.statusText}. ${errorText}`
        );
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to get response from chatbot");
      }

      return data;
    } catch (error) {
      console.error("Error calling chatbot API:", error);
      throw error;
    }
  }
}
