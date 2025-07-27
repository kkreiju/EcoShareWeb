import { NextResponse, NextRequest } from 'next/server'
import { cookies } from 'next/headers';
import { supabase } from '@/lib/supabase/api'

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body: { email?: string; password?: string } = await request.json()
    // Extract email and password
    const { email, password } = body

    // Basic validation
    if (!email || !password) {
      return NextResponse.json({
        success: false,
        message: "Email and password are required"
      }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({
        success: false,
        message: "Invalid email format"
      }, { status: 400 })
    }

    console.log('Processing login for email:', email)

    // Authenticate user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    })

    if (authError) {
      console.log('Supabase auth error:', authError)
      return NextResponse.json({
        success: false,
        message: "Invalid email or password",
        error: authError.message
      }, { status: 401 })
    }

    // Check if user exists and email is verified
    if (authData.user) {
      if (!authData.user.email_confirmed_at) {
        return NextResponse.json({
          success: false,
          message: "Please verify your email before logging in"
        }, { status: 403 })
      }

    // Get cookies
        const cookieStore = await cookies();
    
        // Store cookies in name value
        const authToken0 = cookieStore.get('sb-jjcljbppcduxdbtysxtg-auth-token.0')?.value;
        const authToken1 = cookieStore.get('sb-jjcljbppcduxdbtysxtg-auth-token.1')?.value;

      // Query the User table to check if email exists and is verified
      const { data: userData } = await supabase
        .from('User')
        .select('user_email, user_isVerified, user_firstName, user_middleName, user_lastName, user_ratings, user_transactionCount, user_profileURL')
        .eq('user_email', email)
        .single()

      // Return success response with auth data
      return NextResponse.json({
        success: true,
        message: "Login successful",
        data: {
          user: {
            id: authData.user.id,
            email: authData.user.email,
            firstName: userData?.user_firstName,
            middleName: userData?.user_middleName,
            lastName: userData?.user_lastName,
            emailVerified: !!userData?.user_isVerified,
            profileURL: userData?.user_profileURL || null,
            ratings: (userData?.user_ratings || 0).toFixed(1),
            transactionCount: userData?.user_transactionCount || 0
          },
          session: {
            accessToken: authData.session.access_token,
            refreshToken: authData.session.refresh_token,
            expiresAt: authData.session.expires_at,
            expiresIn: authData.session.expires_in
          },
          cookies: {
            authToken0,
            authToken1
          }
        }
      }, { status: 200 })
    }

    return NextResponse.json({
      success: false,
      message: "Login failed"
    }, { status: 500 })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({
      success: false,
      message: "Internal server error",
      error: typeof error === "object" && error !== null && "message" in error ? (error as { message: string }).message : String(error)
    }, { status: 500 })
  }
}