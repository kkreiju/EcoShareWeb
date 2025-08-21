import { supabase } from '@/lib/supabase/api';

export async function getUserNotifications(userId: string) {
    // Get listing of user - User acts as seller
    const { data: listings, error: listingsError } = await supabase
        .from('Listing')
        .select('*')
        .eq('user_id', userId)
        .neq('list_type', 'Wanted');

    if (listingsError) {
        throw new Error(listingsError.message);
    }

    // Get transaction of user - User acts as buyer
    const { data: transactions, error: transactionsError } = await supabase
        .from('Transaction')
        .select('*')
        .eq('tran_userId', userId);

    if (transactionsError) {
        throw new Error(transactionsError.message);
    }

    // Check if listings are in transaction with status "Pending"
    const listIds = listings?.map(listing => listing.list_id) || [];
    
    const { data: pendingTransactions, error: pendingTransactionsError } = await supabase
        .from('Transaction')
        .select('*')
        .in('list_id', listIds)
        .eq('tran_status', 'Pending');

    if (pendingTransactionsError) {
        throw new Error(pendingTransactionsError.message);
    }

    // Get notification of pendingTransactions
    const { data: notifications, error: notificationsError } = await supabase
        .from('Notification')
        .select('*')
        .in('tran_id', pendingTransactions.map(transaction => transaction.tran_id))
        .ilike('notif_message', '%has requested your listing%')
        .ilike('notif_message', '%wants to offer item to your listing%');

    if (notificationsError) {
        throw new Error(notificationsError.message);
    }

    // Check if user are in transactions
    const { data: userTransactions, error: userTransactionsError } = await supabase
        .from('Transaction')
        .select('*')
        .eq('tran_userId', userId);

    if (userTransactionsError) {
        throw new Error(userTransactionsError.message);
    }

    // Get notification of userTransactions
    const { data: userNotifications, error: userNotificationsError } = await supabase
        .from('Notification')
        .select('*')
        .in('tran_id', userTransactions.map(transaction => transaction.tran_id))
        .ilike('notif_message', '%has accepted your request%')
        .ilike('notif_message', '%has rejected your request%')
        .ilike('notif_message', '%transaction is successful%');

    if (userNotificationsError) {
        throw new Error(userNotificationsError.message);
    }

    // Combine notifications and userNotifications
    const allNotifications = [...notifications, ...userNotifications];
    
    return allNotifications;
}
