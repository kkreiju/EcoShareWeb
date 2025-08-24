import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "deepseek/deepseek-r1-0528-qwen3-8b:free",
                "messages": [
                    {
                        "role": "system",
                        "content": `
                        You are a chatbot assistant. You will provide information of this application EcoShare.
                        You will answer the user's questions about the application.
                        
                        You can also entertain questions about plants, gardening, and other topics related to the application.
                        You will never provide information when the user is not asking about plants, gardening, and other topics related to the application.

                         In the application, we have 5 main features:
                         1. Home - This is the main page of the application.
                         2. Listing - This is where you can find listings of plants for sale.
                         3. Plant Care - This is where you can scan your plants to get recommendations on listings.
                         4. Messages - This is where you can chat with other users.
                         5. Profile - This is where you can manage your profile.
                        `
                    },
                    {
                        "role": "user",
                        "content": body.message
                    }
                ]
            })
        });

        if (!response.ok) {
            throw new Error(`OpenRouter API error: ${response.status}`);
        }

        const data = await response.json();
        
        return NextResponse.json({ 
            success: true, 
            message: data.choices[0]?.message?.content || "No response generated, API Token Expired."
        }, { status: 200 });

    } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json({ 
            error: "An error occurred while processing the request" 
        }, { status: 500 });
    }
}