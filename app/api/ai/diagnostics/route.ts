import { NextResponse, NextRequest } from "next/server";
import { supabase } from '@/lib/supabase/api';

export async function POST(request: NextRequest) {
    try{
        const body = await request.json();

        let image = body.image;

        // Read ngrok from database where ngrok_id = .env NGROK_ID
        const { data: ngrokData, error: ngrokError } = await supabase
            .from('ngrok')
            .select('ngrok_url')
            .eq('ngrok_id', process.env.NGROK_ID)
            .single();

        // Check if ngrok data is found
        if (ngrokError || !ngrokData) {
            console.error('Error fetching ngrok data:', ngrokError);
            return NextResponse.json({
                success: false,
                message: "Contact Arjay to turn on ngrok server in his phone",
                error: ngrokError.message
            }, { status: 500 });
        }

        console.log('Ngrok URL:', ngrokData.ngrok_url);

        // Verify if ngrok server is running
        let ngrokUrl = `${ngrokData.ngrok_url}/api/status`;
        const getNgrokStatus = await fetch(ngrokUrl, {
            method: 'GET',
        });

        // Check method and status of ngrok server
        if (!getNgrokStatus.ok) {
            console.error('Error fetching ngrok status:', getNgrokStatus.statusText);
            return NextResponse.json({
                success: false,
                message: "Send a direct message to Arjay to turn on ngrok server in his phone"
            }, { status: 500 });
        }

        // Construct the ngrok URL and pass image to POST
        ngrokUrl = `${ngrokData.ngrok_url}/api/plant`;

        const response = await fetch(ngrokUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                image: image
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error uploading image to ngrok:', errorText);
            return NextResponse.json({
                success: false,
                message: "Failed to upload image to Analytics Server",
                error: errorText
            }, { status: response.status });
        }

        const ngrokResponse = await response.json();

        console.log('Ngrok response:', ngrokResponse);

        let health;

        // Check if ngrokResponse.data.prediction has "Unhealthy" or "Healthy"
        if (ngrokResponse.prediction.includes("Unhealthy")) {
            // Remove the word unhealthy
            ngrokResponse.prediction = ngrokResponse.prediction.replace(" Unhealthy", "");
            health = "Unhealthy";
        }

        if (ngrokResponse.prediction.includes("Healthy")) {
            // Remove the word healthy
            ngrokResponse.prediction = ngrokResponse.prediction.replace(" Healthy", "");
            health = "Healthy";
        }

        // Multiline string
        let diagnosis = `What nutrients could you suggest with a ${health} ${ngrokResponse.prediction} plant?
            Response should be in json format, limiting to 20 words or less.
            Response should be in the following format:
            {
                "nutrientNeeds": "nutrient1, nutrient2, nutrient3",
                "compostSuggestions": "compost1, compost2, compost3"
            }
        `;

        const diagnosisResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
              "Authorization": "Bearer " + process.env.OPENROUTER_API_KEY,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              "model": "deepseek/deepseek-r1-0528-qwen3-8b:free",
              "stream": false,
              "messages": [
                {
                  "role": "user",
                  "content": diagnosis
                }
              ]
            })
          });

          const diagnosisData = await diagnosisResponse.json();
          let diagnosisMessage = diagnosisData?.choices?.[0]?.message?.content ?? "";

          // Remove ```json ... ```
          diagnosisMessage = diagnosisMessage.replace(/```json\n?|\n?```/g, "");

          // Now parse
          let diagnosisObj;
          try {
            diagnosisObj = JSON.parse(diagnosisMessage);
            } catch (e) {
            console.error("Failed to parse JSON:", e);
            }

        return NextResponse.json({
            success: true,
            message: "Image uploaded successfully",
            data: ngrokResponse,
            diagnosis: diagnosisObj
        });
    }
    catch (error) {
        console.error('Error fetching diagnostics:', error);
        return NextResponse.json({
            error: "An error occurred while fetching diagnostics"
        }, { status: 500 });
    }   
}