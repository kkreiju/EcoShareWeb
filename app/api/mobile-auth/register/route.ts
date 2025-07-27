import { NextResponse, NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase/api'
import { validateUserData } from '@/lib/validation'

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json()
    
    // Validate the user data
    const validation = validateUserData(body)
    if (!validation.isValid) {
      return NextResponse.json({
        success: false,
        message: "Validation failed",
        errors: validation.errors
      }, { status: 400 })
    }
    
    // Extract validated fields
    const { email, password, firstName, middleName, lastName } = body
    
    const { data: existingUser} = await supabase
      .from('User')
      .select('user_email')
      .eq('user_email', email)
      .single()

    if (existingUser) {
      return NextResponse.json({
        success: false,
        message: "Email already registered"
      }, { status: 409 })
    }

    console.log('Processing registration for email:', email)

    // Create user account with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          first_name: firstName,
          middle_name: middleName,
          last_name: lastName,
        },
        emailRedirectTo: `${process.env.ORIGIN_URL}/dashboard`
      }
    })

    if (authError) {
      console.log('Supabase auth error:', authError)
      return NextResponse.json({
        success: false,
        message: "Failed to create user account",
        error: authError.message
      }, { status: 400 })
    }

    // Return success response - trigger will handle User table insertion after email verification
    if (authData.user) {
      return NextResponse.json({
        success: true,
        message: "Registration successful. Please check your email to verify your account.",
        data: {
          user_id: authData.user.id,
          email: email,
          email_confirmed: !!authData.user.email_confirmed_at,
          confirmation_sent: !authData.user.email_confirmed_at
        }
      }, { status: 201 })
    }

    return NextResponse.json({
      success: false,
      message: "Failed to create user account"
    }, { status: 500 })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({
      success: false,
      message: "Internal server error",
      error: typeof error === "object" && error !== null && "message" in error ? (error as { message: string }).message : String(error)
    }, { status: 500 })
  }
}