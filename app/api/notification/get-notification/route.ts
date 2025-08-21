import { NextResponse, NextRequest } from "next/server";
import { getUserNotifications } from '@/lib/notification-utils';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('user_id');

        if (!userId) {
            return NextResponse.json({ error: 'Missing user ID' }, { status: 400 });
        }

        const allNotifications = await getUserNotifications(userId);

        return NextResponse.json({
            success: true,
            message: "Notifications retrieved successfully",
            data: allNotifications
        }, { status: 200 });
    } catch (error) {
        console.error('Error in get notification route:', error);
        return NextResponse.json({ error: error instanceof Error ? error.message : 'An error occurred while processing your request' }, { status: 500 });
    }
}