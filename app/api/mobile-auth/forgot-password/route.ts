import { NextResponse, NextRequest } from "next/server";
import { supabase } from '@/lib/supabase/api'

export async function POST(request: NextRequest) {
    try{
        const body = await request.json();

        // Extract validated fields
        const { email } = body;

        // Check if email is provided
        if (!email) {
            return NextResponse.json({
                success: false,
                message: "Email is required"
            }, { status: 400 });
        }

        // Query the User table to check if email exists
        const { data: userData } = await supabase
            .from('User')
            .select('user_id, user_email, user_firstName, user_middleName, user_lastName, user_isVerified, user_ratings, user_transactionCount, user_profileURL')
            .eq('user_email', email)
            .single();

        if (!userData) {
            return NextResponse.json({
                success: false,
                message: "User not found or email not verified"
            }, { status: 200 });
        }

        // Generate a password reset token
        const { data } = await supabase.auth.resetPasswordForEmail(email,{
            redirectTo: `${process.env.HOST_URL}/auth/update-password`
        })

        if(data){
            return NextResponse.json({
                success: true,
                message: "Password reset email sent successfully"
            }, { status: 200 });
        }
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