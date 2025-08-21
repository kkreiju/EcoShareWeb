import { NextResponse, NextRequest } from "next/server";
import { supabase } from '@/lib/supabase/api';
import { getUserNotifications } from '@/lib/notification-utils';

export async function PUT(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('user_id');

        if (!userId) {
            return NextResponse.json({ error: 'Missing user ID' }, { status: 400 });
        }

        // Get all notifications for the user
        const allNotifications = await getUserNotifications(userId);

        // Extract all notification IDs
        const notificationIds = allNotifications.map(notification => notification.notif_id);

        if (notificationIds.length === 0) {
            return NextResponse.json({
                success: true,
                message: "No notifications to mark as read",
                data: []
            }, { status: 200 });
        }

        // Update all notifications to mark as read
        const { data: updatedNotifications, error: updateError } = await supabase
            .from('Notification')
            .update({ notif_isRead: true })
            .in('notif_id', notificationIds)
            .select();

        if (updateError) {
            return NextResponse.json({ error: updateError.message }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: `Successfully marked ${notificationIds.length} notifications as read`,
            data: updatedNotifications
        }, { status: 200 });

    } catch (error) {
        console.error('Error in mark all as read route:', error);
        return NextResponse.json({ error: error instanceof Error ? error.message : 'An error occurred while processing your request' }, { status: 500 });
    }
}