"use client";

import { useState } from "react";
import { NotificationHeader } from "./notification-header";
import { NotificationTable } from "./notification-table";
import { NotificationStats } from "./notification-stats";

// Mock notification data
interface Notification {
  id: string;
  type: "message" | "like" | "follow" | "listing" | "review";
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  avatar?: string;
  userName?: string;
  listingTitle?: string;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "message",
    title: "New Message",
    message: "John Doe sent you a message about your coffee grounds listing",
    timestamp: "2 minutes ago",
    isRead: false,
    avatar: "/api/placeholder/32/32",
    userName: "John Doe"
  },
  {
    id: "2",
    type: "like",
    title: "Listing Liked",
    message: "Sarah Johnson liked your 'Used Coffee Grounds' listing",
    timestamp: "15 minutes ago",
    isRead: false,
    avatar: "/api/placeholder/32/32",
    userName: "Sarah Johnson",
    listingTitle: "Used Coffee Grounds"
  },
  {
    id: "3",
    type: "follow",
    title: "New Follower",
    message: "Mike Chen started following you",
    timestamp: "1 hour ago",
    isRead: false,
    avatar: "/api/placeholder/32/32",
    userName: "Mike Chen"
  },
  {
    id: "4",
    type: "listing",
    title: "New Listing Match",
    message: "A new listing matches your search for 'compost materials'",
    timestamp: "2 hours ago",
    isRead: true,
    listingTitle: "Organic Compost Materials"
  },
  {
    id: "5",
    type: "review",
    title: "New Review",
    message: "You received a 5-star review from Lisa Park",
    timestamp: "3 hours ago",
    isRead: true,
    avatar: "/api/placeholder/32/32",
    userName: "Lisa Park"
  },
  {
    id: "6",
    type: "message",
    title: "Pickup Request",
    message: "Anna Garcia wants to arrange pickup for your vegetable scraps",
    timestamp: "5 hours ago",
    isRead: true,
    avatar: "/api/placeholder/32/32",
    userName: "Anna Garcia",
    listingTitle: "Vegetable Scraps for Compost"
  },
  {
    id: "7",
    type: "like",
    title: "Review Liked",
    message: "Your review on 'Garden Waste Collection' received 3 likes",
    timestamp: "1 day ago",
    isRead: true,
    listingTitle: "Garden Waste Collection"
  },
  {
    id: "8",
    type: "listing",
    title: "Listing Expired",
    message: "Your 'Paper Recycling Materials' listing has expired",
    timestamp: "2 days ago",
    isRead: true,
    listingTitle: "Paper Recycling Materials"
  }
];


export function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  return (
    <div className="space-y-6">
      <NotificationHeader
        unreadCount={unreadCount}
        onMarkAllAsRead={markAllAsRead}
      />

      <NotificationTable
        notifications={notifications}
        onMarkAsRead={markAsRead}
      />

      <NotificationStats
        totalCount={notifications.length}
        unreadCount={unreadCount}
      />
    </div>
  );
}
