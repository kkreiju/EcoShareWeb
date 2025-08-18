import { NextResponse, NextRequest } from "next/server";
import { supabase } from '@/lib/supabase/api';

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
                        "content": "You are a nutrient analytics assistant. Provide a concise summary of nutrients in the prediction in exactly 20 words or less. Be direct and focus on key insights only."
                    },
                    {
                        "role": "user",
                        "content": body.findings
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