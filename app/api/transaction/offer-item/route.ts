import { NextResponse, NextRequest } from "next/server";
import { supabase } from '@/lib/supabase/api';

export async function POST(req: NextRequest) {
    try{
        const body = await req.json();
        const { list_id, user_id, quantity } = body;
        let message = body.message;

        if(!list_id || !user_id || !quantity ){
            return NextResponse.json({
                success: false,
                message: "Missing required fields"
            }, { status: 400 });
        }

        const amount = await supabase
            .from('Listing')
            .select('list_price')
            .eq('list_id', list_id)
            .single();

        // Validate if there are no pending transaction for the listing
        const { data: existingTransaction } = await supabase
            .from('Transaction')
            .select('tran_id')
            .eq('list_id', list_id)
            .eq('tran_userId', user_id)
            .eq('tran_status', 'Pending')
            .single();

        if (existingTransaction) {
            return NextResponse.json({
                success: false,
                message: "You already have a pending transaction for this listing"
            }, { status: 409 });
        }

        // Create transaction json
        const transaction = {
            list_id,
            tran_userId: user_id,
            tran_amount: amount.data?.list_price * quantity,
            tran_quantity: quantity,
            tran_status: "Pending"
        }

        // Insert transaction into the Transaction table
        const { data: transactionData, error: transactionError } = await supabase
            .from('Transaction')
            .insert(transaction)
            .select()
            .single();

        if (transactionError) {
            return NextResponse.json({
                success: false,
                message: "Failed to create transaction",
                error: transactionError.message
            }, { status: 500 });
        }

        // Get transaction id
        const { data: transactionID } = await supabase
            .from('Transaction')
            .select('tran_id')
            .eq('list_id', list_id)
            .eq('tran_userId', user_id)
            .eq('tran_status', 'Pending')
            .single();

        if (!transactionID) {
            return NextResponse.json({
                success: false,
                message: "Failed to get transaction id"
            }, { status: 500 });
        }

        // Get user id
        const { data: userData } = await supabase
            .from('User')
            .select('user_firstName, user_lastName')
            .eq('user_id', user_id)
            .single();

        if (!userData) {
            return NextResponse.json({
                success: false,
                message: "Failed to get user id"
            }, { status: 500 });
        }

        // Get listing name
        const { data: listingData } = await supabase
            .from('Listing')
            .select('list_title')
            .eq('list_id', list_id)
            .single();

        if (!listingData) {
            return NextResponse.json({
                success: false,
                message: "Failed to get listing name"
            }, { status: 500 });
        }

        if(message == null){
            message = "";
        }
        else{
            message = ` ${message}`;
        }

        // Create notification json
        const notification = {
            tran_id: transactionID.tran_id,
            notif_message: `${userData.user_firstName} ${userData.user_lastName} wants to offer item to your listing: ${listingData.list_title}.${message}`,
        }

        // Insert notification
        const { data: notificationData, error: notificationError } = await supabase
            .from('Notification')
            .insert(notification)
            .select()
            .single();

        if (notificationError) {
            return NextResponse.json({
                success: false,
                message: "Failed to create notification",
                error: notificationError.message
            }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: "Transaction created successfully",
            transactionData,
            notificationData
        }, { status: 201 });
    }
    catch(error){
        console.error('Error in request transaction route:', error);
        return NextResponse.json({
            success: false,
            message: "An error occurred while processing your request",
            error: typeof error === "object" && error !== null && "message" in error ? (error as { message: string }).message : String(error)
        }, { status: 500 });
    }
}