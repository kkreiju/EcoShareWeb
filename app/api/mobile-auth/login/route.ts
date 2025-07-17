import { NextResponse, NextRequest } from 'next/server'
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

      // Query the User table to check if email exists and is verified
      const { data: userData } = await supabase
        .from('User')
        .select('user_email, user_isVerified, user_ratings, user_transactionCount, user_profileURL')
        .eq('user_email', email)
        .single()

      console.log('Supabase query result:', userData)

      // Return success response with auth data
      return NextResponse.json({
        success: true,
        message: "Login successful",
        data: {
          user: {
            id: authData.user.id,
            email: authData.user.email,
            email_verified: !!authData.user.email_confirmed_at,
            profileURL: userData?.user_profileURL || null,
            last_sign_in: authData.user.last_sign_in_at,
            ratings: (userData?.user_ratings || 0).toFixed(1),
            transactionCount: userData?.user_transactionCount || 0
          },
          session: {
            access_token: authData.session.access_token,
            refresh_token: authData.session.refresh_token,
            expires_at: authData.session.expires_at,
            expires_in: authData.session.expires_in
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