import { NextResponse, NextRequest } from "next/server";
import { supabase } from '@/lib/supabase/api'
import { OAuth2Client } from 'google-auth-library';

export async function POST(request: NextRequest) {
    try {

        const body = await request.json()

        // Extract validated fields
        const { idToken } = body

        const client = new OAuth2Client();

        const ticket = await client.verifyIdToken({
            idToken: idToken,
            audience: process.env.WEB_CLIENT_ID
        });

        const payload = ticket.getPayload();

        const { data, error } = await supabase.auth.signInWithIdToken({
            provider: 'google',
            token: idToken
        });

        if(data && !error) {
            // Query the User table to check if email exists and is verified
            const { data: userData } = await supabase
            .from('User')
            .select('user_id, user_email, user_firstName, user_middleName, user_lastName, user_isVerified, user_ratings, user_transactionCount, user_profileURL')
            .eq('user_email', payload?.email)
            .single()
            
            // Return success response with auth data
            return NextResponse.json({
            success: true,
            message: "Login successful",
            data: {
                user: {
                id: userData?.user_id,
                email: userData?.user_email,
                firstName: userData?.user_firstName,
                middleName: userData?.user_middleName,
                lastName: userData?.user_lastName,
                email_verified: !!userData?.user_isVerified,
                profileURL: userData?.user_profileURL || null,
                ratings: (userData?.user_ratings || 0).toFixed(1),
                transactionCount: userData?.user_transactionCount || 0
                }
            }
            }, { status: 200 })
        }

        return NextResponse.json({
            success: false,
            message: "Supabase authentication failed",
            error: typeof error === "object" && error !== null && "message" in error ? (error as { message: string }).message : String(error)
        }, { status: 401 });
    }
    catch (error) {
        console.error('Google authentication error:', error);
        return NextResponse.json({
            success: false,
            message: "Google authentication failed",
            error: typeof error === "object" && error !== null && "message" in error ? (error as { message: string }).message : String(error)
        }, { status: 500 });
    }
}
