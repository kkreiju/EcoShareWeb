import { NextResponse, NextRequest } from "next/server";
import { supabase } from '@/lib/supabase/api';

export async function POST(req: NextRequest) {
    try{
        const body = await req.json();
        const { user_id } = body;

        if(!user_id){
            return NextResponse.json({
                success: false,
                message: "Missing required fields"
            }, { status: 400 });
        }

        //Get active listing of user
        const { data: listings, error: listingsError } = await supabase
            .from('Listing')
            .select('*')
            .eq('user_id', user_id)
            .eq('list_availabilityStatus', 'Active');

        if (listingsError) {
            return NextResponse.json({
                success: false,
                message: "An error occurred while processing your request",
                error: listingsError.message
            }, { status: 500 });
        }

        //Get transaction of user
        const { data: transactions, error: transactionsError } = await supabase
            .from('Transaction')
            .select('*')
            .eq('list_id', listings.map(listing => listing.list_id))
            .neq('tran_status', 'Completed');

        if (transactionsError) {
            return NextResponse.json({
                success: false,
                message: "An error occurred while processing your request",
                error: transactionsError.message
            }, { status: 500 });
        }

        //Get user_profileURL in user using tran_userId
        const { data: users, error: usersError } = await supabase
            .from('User')
            .select('user_id, user_profileURL, user_firstName, user_lastName')
            .in('user_id', transactions.map(transaction => transaction.tran_userId));

        if (usersError) {
            return NextResponse.json({
                success: false,
                message: "An error occurred while processing your request",
                error: usersError.message
            }, { status: 500 });
        }

        //Get notification using tran_id
        const { data: notifications, error: notificationsError } = await supabase
            .from('Notification')
            .select('*')
            .eq('tran_id', transactions.map(transaction => transaction.tran_id));

        if (notificationsError) {
            return NextResponse.json({
                success: false,
                message: "An error occurred while processing your request",
                error: notificationsError.message
            }, { status: 500 });
        }

        //Create requests in json format with id, tran_userId, user_id, list_id, tran_amount, tran_quantity, tran_status
        const requests = transactions.map(transaction => {
            let message = notifications.find(notification => notification.tran_id === transaction.tran_id)?.notif_message;
            if(message == null){
                message = "";
            }
            else{
                //Split to "." and remove whitespace
                message = message.split(".").slice(1).join(".").trim();
            }

            return {
                id: transaction.tran_id,
                userName: users.find(user => user.user_id === transaction.tran_userId)?.user_firstName + " " + users.find(user => user.user_id === transaction.tran_userId)?.user_lastName,
                user_profileURL: users.find(user => user.user_id === transaction.tran_userId)?.user_profileURL,
                listingTitle: listings.find(listing => listing.list_id === transaction.list_id)?.list_title,
                listingType: listings.find(listing => listing.list_id === transaction.list_id)?.list_type,
                requestDate: transaction.tran_date,
                message: message,
                status: transaction.tran_status
            }
        })

        return NextResponse.json({
            success: true,
            message: "Requests retrieved successfully",
            requests
        }, { status: 200 });
    }
    catch(error){
        return NextResponse.json({
            success: false,
            message: "An error occurred while processing your request",
            error: typeof error === "object" && error !== null && "message" in error ? (error as { message: string }).message : String(error)
        }, { status: 500 });
    }
}