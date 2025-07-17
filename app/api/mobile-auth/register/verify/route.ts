import { supabase } from "@/lib/supabase/api";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Extract email from query parameters
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    // Validate email parameter
    if (!email) {
      return NextResponse.json({
        success: false,
        message: "Email parameter is required"
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

    console.log('Checking verification status for email:', email)

    // Query the User table to check if email exists and is verified
    const { data: userData, error: queryError } = await supabase
      .from('User')
      .select('user_email, user_isVerified')
      .eq('user_email', email)
      .single()

    console.log('Supabase query result:', userData)

    if (queryError) {
      // Check if it's a "not found" error
      if (queryError.code === 'PGRST116') {
        return NextResponse.json({
          success: false,
          verified: false,
          message: "User not found"
        }, { status: 404 })
      }

      console.error('Database query error:', queryError)
      return NextResponse.json({
        success: false,
        message: "Database query failed",
        error: queryError.message
      }, { status: 500 })
    }

    // Check verification status
    if (userData) {
      return NextResponse.json({
        success: true,
        verified: userData.user_isVerified,
        message: userData.user_isVerified ? "User is verified" : "User exists but not verified",
      }, { status: 200 })
    }

    // This shouldn't happen due to .single() but just in case
    return NextResponse.json({
      success: false,
      message: "User not found",
      verified: false,
      exists: false
    }, { status: 404 })

  } catch (error) {
    console.error('Verification check error:', error)
    return NextResponse.json({
      success: false,
      message: "Internal server error",
      error: typeof error === "object" && error !== null && "message" in error ? (error as { message: string }).message : String(error)
    }, { status: 500 })
  }
}