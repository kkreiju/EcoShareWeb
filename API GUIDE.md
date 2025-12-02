
This is my backend — I just uploaded it to Vercel. Don’t create any new API files; fix this in my frontend instead. If there’s a problem with my API, just let me know so I can manually fix it.


import { NextResponse, NextRequest } from "next/server";
import { supabase } from '@/lib/supabase/api';

/**
 * @swagger
 * /api/transaction/complete-transaction:
 *   post:
 *     summary: Complete an ongoing transaction
 *     description: Complete an ongoing transaction by validating ownership and quantity, updating transaction status to 'Completed', and incrementing user transaction counts.
 *     tags:
 *       - Transactions
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tran_id
 *               - user_id
 *               - quantity
 *             properties:
 *               tran_id:
 *                 type: string
 *                 description: The ID of the transaction to complete
 *                 example: "T00010"
 *               user_id:
 *                 type: string
 *                 description: The ID of the user completing the transaction (must be the listing owner)
 *                 example: "U00010"
 *               quantity:
 *                 type: integer
 *                 description: The quantity of items being transacted (must not exceed available listing quantity)
 *                 example: 2
 *     responses:
 *       200:
 *         description: Transaction completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Transaction completed successfully"
 *                 transactionData:
 *                   type: object
 *                   description: Updated transaction data
 *       400:
 *         description: Bad request - missing required fields, invalid ownership, or insufficient quantity
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   examples:
 *                     missing_fields: "Missing required fields"
 *                     invalid_ownership: "Listing is not available, not owned by user"
 *                     insufficient_quantity: "Quantity is more than listing quantity"
 *       404:
 *         description: Transaction not found or not in ongoing status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   examples:
 *                     transaction_not_found: "Failed to find transaction"
 *                     listing_not_found: "Failed to find listing"
 *                 error:
 *                   type: string
 *                   description: Detailed error message
 *       500:
 *         description: Internal server error - failed to update records
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   examples:
 *                     update_transaction_failed: "Failed to update transaction status"
 *                 error:
 *                   type: string
 *                   description: Detailed error message
 */

export async function POST(req: NextRequest) {
    try{
        const body = await req.json();
        const { tran_id, user_id, quantity, status, image } = body;

        // Find transaction
        const { data: transactionData, error: transactionError } = await supabase
            .from('Transaction')
            .select('*')
            .eq('tran_id', tran_id)
            .eq('tran_status', 'Ongoing')
            .single();
        
        if(transactionError){
            return NextResponse.json({
                success: false,
                message: "Failed to find transaction",
                error: transactionError.message
            }, { status: 500 });
        }

        // Find listing id of transaction
        const { data: listingData, error: listingError } = await supabase
            .from('Listing')
            .select('list_id, list_availabilityStatus, user_id, list_quantity')
            .eq('list_id', transactionData.list_id)
            .single();
        
        if(listingError){
            return NextResponse.json({
                success: false,
                message: "Failed to find listing",
                error: listingError.message
            }, { status: 500 });
        }

        // Verify if listing is available, is owned by user_id, and has enough quantity
        if(listingData.list_availabilityStatus !== 'Active' || listingData.user_id !== user_id){
            return NextResponse.json({
                success: false,
                message: "Listing is not available, not owned by user",
            }, { status: 400 });
        }

        // Verify if quantity is enough to listing quantity
        if(quantity > listingData.list_quantity){
            return NextResponse.json({
                success: false,
                message: "Quantity is more than listing quantity",
            }, { status: 400 });
        }

        // Update transaction status
        const { data: updatedTransactionData, error: updatedTransactionError } = await supabase
            .from('Transaction')
            .update({ tran_status: 'Completed' })
            .eq('tran_id', tran_id)
            .select()
            .single();
        
        if(updatedTransactionError){
            return NextResponse.json({
                success: false,
                message: "Failed to update transaction status",
                error: updatedTransactionError.message
            }, { status: 500 });
        }

        // Update transaction count
        const { data: transactionCount, error: transactionCountError } = await supabase
            .from('User')
            .select('user_transactionCount')
            .eq('user_id', transactionData.tran_userId)
            .single();
        
        const { data: sellerTransactionCount, error: sellerTransactionCountError } = await supabase
            .from('User')
            .select('user_transactionCount')
            .eq('user_id', listingData.user_id)
            .single();

        const newBuyerTransactionCount = (transactionCount?.user_transactionCount || 0) + 1;
        const newSellerTransactionCount = (sellerTransactionCount?.user_transactionCount || 0) + 1;

        const { error: updateBuyerError } = await supabase
            .from('User')
            .update({ user_transactionCount: newBuyerTransactionCount })
            .eq('user_id', transactionData.tran_userId);

        const { error: updateSellerError } = await supabase
            .from('User')
            .update({ user_transactionCount: newSellerTransactionCount })
            .eq('user_id', listingData.user_id);

        //get n8n url from ngrok table
        const { data: n8nData, error: n8nError } = await supabase
            .from('ngrok')
            .select('n8n_url')
            .eq('ngrok_id', process.env.NGROK_ID)
            .single();

        let n8nUrl = n8nData.n8n_url + '/webhook/notification-trigger';

        await fetch(n8nUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "trigger": "complete_transaction",
                "transactionId": tran_id
            }),
        });

        return NextResponse.json({
            success: true,
            message: "Transaction completed successfully",
            transactionData: updatedTransactionData
        }, { status: 200 });
    }
    catch(error){
        console.error('Error in complete transaction route:', error);
        return NextResponse.json({
            success: false,
            message: "An error occurred while processing your request",
            error: typeof error === "object" && error !== null && "message" in error ? (error as { message: string }).message : String(error)
        }, { status: 500 });
    }
}




import { NextResponse, NextRequest } from "next/server";
import { supabase } from '@/lib/supabase/api';

/**
 * @swagger
 * /api/transaction/upload-image:
 *   post:
 *     summary: Upload transaction verification image
 *     description: Upload a verification image for a transaction. This validates the transaction and listing details but does not complete the transaction.
 *     tags:
 *       - Transactions
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tran_id
 *               - user_id
 *               - quantity
 *               - status
 *               - image
 *             properties:
 *               tran_id:
 *                 type: string
 *                 description: The ID of the transaction
 *                 example: "T00010"
 *               user_id:
 *                 type: string
 *                 description: The ID of the user uploading the image (must be the listing owner)
 *                 example: "U00010"
 *               quantity:
 *                 type: integer
 *                 description: The quantity of items involved
 *                 example: 2
 *               status:
 *                 type: string
 *                 description: The status of the transaction
 *                 example: "Ongoing"
 *               image:
 *                 type: string
 *                 description: Base64 encoded image for transaction verification
 *                 example: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Image uploaded successfully"
 *       400:
 *         description: Bad request - missing required fields, invalid ownership, or insufficient quantity
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   examples:
 *                     missing_fields: "Missing required fields"
 *                     invalid_ownership: "Listing is not available, not owned by user"
 *                     insufficient_quantity: "Quantity is more than listing quantity"
 *       404:
 *         description: Transaction or listing not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   examples:
 *                     transaction_not_found: "Failed to find transaction"
 *                     listing_not_found: "Failed to find listing"
 *                 error:
 *                   type: string
 *                   description: Detailed error message
 *       500:
 *         description: Internal server error - failed to upload image
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   examples:
 *                     upload_failed: "Failed to upload image"
 *                 error:
 *                   type: string
 *                   description: Detailed error message
 */

export async function POST(req: NextRequest) {
    try{
        const body = await req.json();
        const { tran_id, user_id, quantity, status, image } = body;

        if(!tran_id || !user_id || !quantity || !status || !image){
            return NextResponse.json({
                success: false,
                message: "Missing required fields"
            }, { status: 400 });
        }

        // Find transaction
        const { data: transactionData, error: transactionError } = await supabase
            .from('Transaction')
            .select('*')
            .eq('tran_id', tran_id)
            .eq('tran_status', 'Ongoing')
            .single();
        
        if(transactionError){
            return NextResponse.json({
                success: false,
                message: "Failed to find transaction",
                error: transactionError.message
            }, { status: 500 });
        }

        // Find listing id of transaction
        const { data: listingData, error: listingError } = await supabase
            .from('Listing')
            .select('list_id, list_availabilityStatus, user_id, list_quantity')
            .eq('list_id', transactionData.list_id)
            .single();
        
        if(listingError){
            return NextResponse.json({
                success: false,
                message: "Failed to find listing",
                error: listingError.message
            }, { status: 500 });
        }

        // Verify if listing is available, is owned by user_id, and has enough quantity
        if(listingData.list_availabilityStatus !== 'Active' || listingData.user_id !== user_id){
            return NextResponse.json({
                success: false,
                message: "Listing is not available, not owned by user",
            }, { status: 400 });
        }

        // Verify if quantity is enough to listing quantity
        if(quantity > listingData.list_quantity){
            return NextResponse.json({
                success: false,
                message: "Quantity is more than listing quantity",
            }, { status: 400 });
        }

        // Convert base64 imageURL to img and upload to supabase storage
        let imageBuffer: Buffer;

        const base64Data = image.split(',')[1];
        imageBuffer = Buffer.from(base64Data, 'base64');

        const { data: uploadData, error: uploadError } = await supabase
            .storage
            .from('transaction')
            .upload(`${tran_id}_${Date.now()}.png`, imageBuffer, {
                contentType: 'image/png'
            });

        if (uploadError) {
            console.error('Error uploading image:', uploadError);
            return NextResponse.json({
                success: false,
                message: "Failed to upload image",
                error: uploadError.message
            }, { status: 500 });
        }

        //get n8n url from ngrok table
        const { data: n8nData, error: n8nError } = await supabase
            .from('ngrok')
            .select('n8n_url')
            .eq('ngrok_id', process.env.NGROK_ID)
            .single();

        let n8nUrl = n8nData.n8n_url + '/webhook/notification-trigger';

        await fetch(n8nUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "trigger": "complete_transaction",
                "transactionId": tran_id
            }),
        });

        return NextResponse.json({
            success: true,
            message: "Image uploaded successfully",
        }, { status: 200 });
    }
    catch(error){
        console.error('Error in complete transaction route:', error);
        return NextResponse.json({
            success: false,
            message: "An error occurred while processing your request",
            error: typeof error === "object" && error !== null && "message" in error ? (error as { message: string }).message : String(error)
        }, { status: 500 });
    }
}

import { NextResponse, NextRequest } from "next/server";
import { supabase } from '@/lib/supabase/api';

/**
 * @swagger
 * /api/transaction/transaction-image:
 *   get:
 *     summary: Get transaction image URL
 *     description: Searches for and returns the image URL for a transaction by querying the storage bucket for files matching the transaction ID pattern (TXXXXX_*).
 *     tags:
 *       - Transactions
 *     parameters:
 *       - in: query
 *         name: transactionId
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^T\d{5}$'
 *         description: Transaction ID (must start with 'T' followed by 5 digits)
 *         example: "T00064"
 *     responses:
 *       200:
 *         description: Transaction image URL retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Transaction image URL retrieved successfully"
 *                 imageUrl:
 *                   type: string
 *                   example: "https://tdwjnuzvjisbitbbwxju.supabase.co/storage/v1/object/public/transaction/T00064_1760176076374.png"
 *       400:
 *         description: Bad request - missing transactionId parameter
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Missing required fields"
 *       404:
 *         description: No image found for the transaction
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "No image found for this transaction"
 *       500:
 *         description: Internal server error or storage access failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Failed to search for transaction images"
 */
export async function GET(req: NextRequest) {
    try{
        const { searchParams } = new URL(req.url);
        const transactionId = searchParams.get('transactionId');

        if(!transactionId){
            return NextResponse.json({
                success: false,
                message: "Missing required fields"
            }, { status: 400 });
        }

        // List files in transaction storage bucket that match the transaction ID
        const { data: files, error: listError } = await supabase.storage
            .from('transaction')
            .list('', {
                search: `${transactionId}_`
            });

        if (listError) {
            return NextResponse.json({
                success: false,
                message: "Failed to search for transaction images",
                error: listError.message
            }, { status: 500 });
        }

        if (!files || files.length === 0) {
            return NextResponse.json({
                success: false,
                message: "No image found for this transaction",
                transactionId: transactionId
            }, { status: 404 });
        }

        // Get the first matching file (assuming one image per transaction)
        const imageFile = files[0];
        const imageUrl = `https://tdwjnuzvjisbitbbwxju.supabase.co/storage/v1/object/public/transaction/${imageFile.name}`;

        return NextResponse.json({
            success: true,
            message: "Transaction image URL retrieved successfully",
            imageUrl: imageUrl
        }, { status: 200 });

    }
    catch(error){
        return NextResponse.json({
            success: false,
            message: "Failed to get transaction details",
            error: error.message
        }, { status: 500 });
    }
}


import { NextResponse, NextRequest } from "next/server";
import { supabase } from '@/lib/supabase/api';

/**
 * @swagger
 * /api/transaction/return-item:
 *   post:
 *     summary: Return a completed transaction item
 *     description: Process a return for a completed transaction. This updates the status to 'Returned', restores the listing quantity, and decrements the transaction counts for both users.
 *     tags:
 *       - Transactions
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tran_id
 *               - user_id
 *             properties:
 *               tran_id:
 *                 type: string
 *                 description: The ID of the transaction to return
 *                 example: "T00010"
 *               user_id:
 *                 type: string
 *                 description: The ID of the user requesting the return
 *                 example: "U00010"
 *     responses:
 *       200:
 *         description: Item returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Item returned successfully"
 *                 transactionData:
 *                   type: object
 *                   description: Updated transaction data
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Missing required fields"
 *       404:
 *         description: Transaction not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Failed to find transaction"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "An error occurred while processing your request"
 */

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { tran_id, user_id } = body;

        if (!tran_id || !user_id) {
            return NextResponse.json({
                success: false,
                message: "Missing required fields"
            }, { status: 400 });
        }

        // Find transaction
        const { data: transactionData, error: transactionError } = await supabase
            .from('Transaction')
            .select('*')
            .eq('tran_id', tran_id)
            .eq('tran_status', 'Ongoing')
            .single();

        if (transactionError || !transactionData) {
            return NextResponse.json({
                success: false,
                message: "Failed to find ongoing transaction",
                error: transactionError?.message
            }, { status: 404 });
        }

        // Find listing
        const { data: listingData, error: listingError } = await supabase
            .from('Listing')
            .select('list_id, list_quantity, user_id')
            .eq('list_id', transactionData.list_id)
            .single();

        if (listingError) {
            return NextResponse.json({
                success: false,
                message: "Failed to find listing",
                error: listingError.message
            }, { status: 500 });
        }

        // Update transaction status to 'Returned'
        const { data: updatedTransactionData, error: updatedTransactionError } = await supabase
            .from('Transaction')
            .update({ tran_status: 'Returned' })
            .eq('tran_id', tran_id)
            .select()
            .single();

        if (updatedTransactionError) {
            return NextResponse.json({
                success: false,
                message: "Failed to update transaction status",
                error: updatedTransactionError.message
            }, { status: 500 });
        }

        // Restore listing quantity
        const newQuantity = listingData.list_quantity + transactionData.tran_quantity;
        const { error: updatedListingError } = await supabase
            .from('Listing')
            .update({ list_quantity: newQuantity })
            .eq('list_id', listingData.list_id);

        if (updatedListingError) {
            return NextResponse.json({
                success: false,
                message: "Failed to update listing quantity",
                error: updatedListingError.message
            }, { status: 500 });
        }

        // Trigger notification
        // const { data: n8nData } = await supabase
        //     .from('ngrok')
        //     .select('n8n_url')
        //     .eq('ngrok_id', process.env.NGROK_ID)
        //     .single();

        // if (n8nData) {
        //     const n8nUrl = n8nData.n8n_url + '/webhook/notification-trigger';
        //     await fetch(n8nUrl, {
        //         method: "POST",
        //         headers: { "Content-Type": "application/json" },
        //         body: JSON.stringify({
        //             "trigger": "return_item",
        //             "transactionId": tran_id,
        //             "userId": user_id
        //         }),
        //     }).catch(err => console.error("Notification trigger failed", err));
        // }

        return NextResponse.json({
            success: true,
            message: "Item returned successfully",
            transactionData: updatedTransactionData
        }, { status: 200 });

    } catch (error) {
        console.error('Error in return item route:', error);
        return NextResponse.json({
            success: false,
            message: "An error occurred while processing your request",
            error: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}
