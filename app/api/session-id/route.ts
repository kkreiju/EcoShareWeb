import { NextResponse, NextRequest } from "next/server";
import { cookies } from 'next/headers';
import { supabase } from '@/lib/supabase/api'

export async function POST(request: NextRequest) {
    const body: { accessToken: string; refreshToken: string; expiresAt: number } = await request.json();

    const { accessToken, refreshToken, expiresAt } = body;

    // Check if session is expired
    const now = Math.floor(Date.now() / 1000); // current Unix time in seconds
    if (expiresAt && expiresAt < now) {
        refreshSession(refreshToken);
    }

    return setSession(accessToken, refreshToken);
}

async function setSession(accessToken: string, refreshToken?: string) {
    await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken ?? ""
    }).catch(() => {
        refreshSession(refreshToken ?? "");
    });

    return getSession();
}

async function refreshSession(refreshToken: string) {
    await supabase.auth.refreshSession({
        refresh_token: refreshToken
    }).catch((error) => {
        console.error("Error refreshing session:", error);
        return NextResponse.json({
            success: false,
            message: "Error refreshing session"
        }, { status: 500 });
    });

    return getSession();
}

async function getSession() {

    // Get the current session
    const { data: { session } } = await supabase.auth.getSession();

    // Get cookies
    const cookieStore = await cookies();

    // Store cookies in name value
    const authToken0 = cookieStore.get('sb-jjcljbppcduxdbtysxtg-auth-token.0')?.value;
    const authToken1 = cookieStore.get('sb-jjcljbppcduxdbtysxtg-auth-token.1')?.value;

    // Query the User table to check if email exists and is verified
    const { data: userData } = await supabase
    .from('User')
    .select('user_id, user_email, user_isVerified, user_firstName, user_middleName, user_lastName, user_ratings, user_transactionCount, user_profileURL')
    .eq('user_email', session?.user.email)
    .single()

    // Return success response with auth data
    return NextResponse.json({
    success: true,
    message: "Login successful",
    data: {
        user: {
            id: userData?.user_id,
            email: session?.user.email,
            firstName: userData?.user_firstName,
            middleName: userData?.user_middleName,
            lastName: userData?.user_lastName,
            emailVerified: !!userData?.user_isVerified,
            profileURL: userData?.user_profileURL || null,
            ratings: (userData?.user_ratings || 0).toFixed(1),
            transactionCount: userData?.user_transactionCount || 0
        },
        session: {
            accessToken: session?.access_token,
            refreshToken: session?.refresh_token,
            expiresAt: session?.expires_at,
            expiresIn: session?.expires_in,
        },
        cookies: {
            authToken0,
            authToken1
        }
    }
    }, { status: 200 })
}