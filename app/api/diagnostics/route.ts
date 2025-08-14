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

        return NextResponse.json({
            success: true,
            message: "Image uploaded successfully",
            data: ngrokResponse
        });
    }
    catch (error) {
        console.error('Error fetching diagnostics:', error);
        return NextResponse.json({
            error: "An error occurred while fetching diagnostics"
        }, { status: 500 });
    }   
}