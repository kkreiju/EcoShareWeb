import { NextResponse, NextRequest } from "next/server";
import { supabase } from '@/lib/supabase/api'

export async function POST(request: NextRequest) {
    const body: { accessToken: string; refreshToken: string; expiresAt: number } = await request.json();

    const { accessToken, refreshToken, expiresAt } = body;

    // Check if session is expired
    const now = Math.floor(Date.now() / 1000); // current Unix time in seconds

    if (expiresAt && expiresAt < now) {
        return refreshSession(refreshToken);
    }

    return setSession(accessToken, refreshToken);
}

async function setSession(accessToken: string, refreshToken?: string) {
    const { error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken ?? ""
    });

    if (error) {
        return refreshSession(refreshToken ?? "");
    }

    return getSession();
}

async function refreshSession(refreshToken: string) {
    const { data, error } = await supabase.auth.refreshSession({
        refresh_token: refreshToken
    });

    if (error || !data.session) {
        return NextResponse.json({
            success: false,
            message: "Failed to refresh session"
        }, { status: 401 });
    }

    return getSession();
}

async function getSession() {
    try {
        // Get the current session from cookies
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error || !session) {
            return NextResponse.json({
                success: false,
                message: "No valid session found"
            }, { status: 401 });
        }

        // Query the User table
        const { data: userData } = await supabase
            .from('User')
            .select('user_id, user_email, user_isVerified, user_firstName, user_middleName, user_lastName, user_ratings, user_transactionCount, user_profileURL')
            .eq('user_email', session.user.email)
            .single();

        // Return success response with auth data
        return NextResponse.json({
            success: true,
            message: "Session retrieved successfully",
            data: {
                user: {
                    id: userData?.user_id,
                    email: session.user.email,
                    firstName: userData?.user_firstName,
                    middleName: userData?.user_middleName,
                    lastName: userData?.user_lastName,
                    emailVerified: !!userData?.user_isVerified,
                    profileURL: userData?.user_profileURL || null,
                    ratings: (userData?.user_ratings || 0).toFixed(1),
                    transactionCount: userData?.user_transactionCount || 0
                },
                session: {
                    accessToken: session.access_token,
                    refreshToken: session.refresh_token,
                    expiresAt: session.expires_at,
                    expiresIn: session.expires_in,
                }
            }
        }, { status: 200 });

    } catch (error) {
        console.error('Error in getSession:', error);
        return NextResponse.json({
            success: false,
            message: "Error retrieving session"
        }, { status: 500 });
    }
}