import { NextResponse, NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase/api'

export async function POST(request: NextRequest) {
    try{
        const body = await request.json();

        // Extract validated fields
        const { id, url } = body;

        // Check if url is provided
        if (!url || !id) {
            return NextResponse.json({
                success: false,
                message: "URL or ID is required"
            }, { status: 400 });
        }

        // Query the ngrok table to check if url exists
        const { data: ngrokData } = await supabase
            .from('ngrok')
            .select('*')
            .eq('ngrok_id', id)
            .single();

        if (!ngrokData) {
            return NextResponse.json({
                success: false,
                message: "ID not verified or not found"
            }, { status: 500 });
        }

        // Update the ngrok URL
        const { data, error } = await supabase
            .from('ngrok')
            .update({ ngrok_url: url })
            .eq('ngrok_id', id);

        if (error) {
            console.error('Error updating ngrok URL:', error);
            return NextResponse.json({
                success: false,
                message: "Failed to update ngrok URL",
                error: error.message
            }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: "Ngrok URL updated successfully",
            data: data
        }, { status: 200 });
    }
    catch (error) {
        console.error('Error in forgot password route:', error);
        return NextResponse.json({
            success: false,
            message: "An error occurred while processing your request",
            error: typeof error === "object" && error !== null && "message" in error ? (error as { message: string }).message : String(error)
        }, { status: 500 });
    }
}