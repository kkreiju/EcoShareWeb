import { NextResponse, NextRequest } from "next/server";
import { supabase } from '@/lib/supabase/api';
import { imageUrlToBase64 } from "@/lib/base64img";

export async function POST(request: NextRequest) {
    try{
        const body = await request.json();

        // Extract validated fields
        const { user_id, title, type, imageURL,
             description, tags, price, quantity, pickupTimeAvailability,
              instructions, locationName, latitude, longitude } = body;

        // Check if all required fields are provided
        if (!user_id || !title || !type || !imageURL || !description || !quantity ||
             !pickupTimeAvailability || !locationName || latitude === undefined || longitude === undefined) {
            return NextResponse.json({
                success: false,
                message: "All required fields must be provided"
            }, { status: 400 });
        }

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

        // Insert the listing into the database
        const { data, error } = await supabase
            .from('Listing')
            .insert({
                user_id,
                list_title: title,
                list_type: type,
                list_imageURL: imageURL,
                list_description: description,
                list_tags: tags || [],
                list_price: price || 0,
                list_quantity: quantity,
                list_pickupTimeAvailability: pickupTimeAvailability,
                list_pickupInstructions: instructions || "",
                list_locationName: locationName,
                list_latitude: latitude,
                list_longitude: longitude,
                list_availabilityStatus: "Active"
            })
            .select('*')
            .single();

        console.log('Listing added:', data);

        if (error) {
            console.error('Error adding listing:', error);
            return NextResponse.json({
                success: false,
                message: "Failed to add listing",
                error: error.message
            }, { status: 500 });
        }

        // Convert imageURL to base64
        const base64Image = await imageUrlToBase64(imageURL);

        // Construct the ngrok URL and pass image to POST
        ngrokUrl = `${ngrokData.ngrok_url}/api/listing`;

        console.log('Ngrok URL for listing:', ngrokUrl);
        const response = await fetch(ngrokUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                image: base64Image
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

        // Add the ngrok response to the analytics database
        const { error: analyticsError } = await supabase
            .from('Analytics')
            .insert({
                list_id: data.list_id,
                analytics_finding: ngrokResponse,
            });

        if (analyticsError) {
            console.error('Error adding analytics data:', analyticsError);
            return NextResponse.json({
                success: false,
                message: "Failed to add analytics data",
                error: analyticsError.message
            }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: "Listing added successfully",
            data: data,
            analytics: ngrokResponse
        }, { status: 201 });
    }
    catch (error) {
        console.error('Error in add listing route:', error);
        return NextResponse.json({
            success: false,
            message: "An error occurred while processing your request",
            error: typeof error === "object" && error !== null && "message" in error ? (error as { message: string }).message : String(error)
        }, { status: 500 });
    }
}