import { NextResponse, NextRequest } from "next/server";
import { supabase } from '@/lib/supabase/api';

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();

        // Extract validated fields
        let { user_id, email, contactNumber, firstName, middleName, lastName, bio, profileURL } = body;

        // Check if all required fields are provided
        if (!user_id) {
            return NextResponse.json({
                success: false,
                message: "User ID must be provided"
            }, { status: 400 });
        }

        // Validate if email and user_id are valid in the database
        const { data: user } = await supabase
            .from('User')
            .select('user_email')
            .eq('user_id', user_id)
            .single();

        // Compare data.email with the provided email
        if (user?.user_email !== email) {
            return NextResponse.json({
                success: false,
                message: "Email does not match"
            }, { status: 400 });
        }

        // If profile URL is provided (already base64), upload it to avatars
        if (profileURL) {
            try {
                // Create buffer from the base64 string (no conversion needed)
                const base64Data = profileURL.split(',')[1];
                const imageBuffer = Buffer.from(base64Data, 'base64');

                // Upload to supabase storage in avatars bucket
                const { data: uploadData, error: uploadError } = await supabase
                    .storage
                    .from('avatar')
                    .upload(`${user_id}/profile_${Date.now()}.png`, imageBuffer, {
                        contentType: 'image/png'
                    });

                if (uploadError) {
                    console.error('Error uploading profile image:', uploadError);
                    return NextResponse.json({
                        success: false,
                        message: "Failed to upload profile image",
                        error: uploadError.message
                    }, { status: 500 });
                }

                // Get the public URL
                profileURL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatar/${uploadData.path}`;
            } catch (imageError) {
                console.error('Error processing profile image:', imageError);
                return NextResponse.json({
                    success: false,
                    message: "Failed to process profile image"
                }, { status: 500 });
            }
        }

        // Update user profile in the database
        const { data: updatedUser, error: updateError } = await supabase
            .from('User')
            .update({
                user_firstName: firstName ? firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase() : null,
                user_middleName: middleName ? middleName.charAt(0).toUpperCase() + middleName.slice(1).toLowerCase() : null,
                user_lastName: lastName ? lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase() : null,
                user_bio: bio,
                user_phoneNumber: contactNumber,
                user_profileURL: profileURL
            })
            .eq('user_id', user_id)
            .select()
            .single();

        if (updateError) {
            return NextResponse.json({data: updatedUser, error: updateError.message }, { status: 200 });
        }

        return NextResponse.json({ success: true, message: "User profile updated successfully", data: updatedUser }, { status: 200 });
    } catch (error) {
        console.error("Error updating user profile:", error);
        return NextResponse.json({ error: "Error updating user profile" }, { status: 500 });
    }
}