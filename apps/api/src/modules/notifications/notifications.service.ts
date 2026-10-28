import { Injectable } from '@nestjs/common';
import { MemoryStoreService } from '../../common/database/memory-store.service';

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  body: string;
  category: 'MATCH' | 'MESSAGE' | 'LIKE' | 'SURGE' | 'SAFETY' | 'EVENT' | 'ROOM';
  emoji: string;
  actionUrl?: string;
  isRead: boolean;
  createdAt: string;
}

@Injectable()
export class NotificationsService {
  private notifications: Map<string, NotificationItem[]> = new Map();

  constructor(private readonly store: MemoryStoreService) {
    this.seedDefaultNotifications();
  }

  private seedDefaultNotifications() {
    const defaultList: NotificationItem[] = [
      {
        id: 'notif_1',
        userId: 'usr_demo_1',
        title: 'New Match Alert! 💖',
        body: 'You and Aarav Sharma matched! Send an icebreaker before the spark fades.',
        category: 'MATCH',
        emoji: '💖',
        actionUrl: '/messages',
        isRead: false,
        createdAt: new Date(Date.now() - 1800000).toISOString()
      },
      {
        id: 'notif_2',
        userId: 'usr_demo_1',
        title: 'Neighborhood Activity Surge 🔥',
        body: 'Activity is up 2.4x around Indiranagar! Open radar to wave to people nearby.',
        category: 'SURGE',
        emoji: '⚡',
        actionUrl: '/nearby',
        isRead: false,
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
      },
      {
        id: 'notif_3',
        userId: 'usr_demo_1',
        title: 'Date Guard Safety Check-In 🛡️',
        body: 'Your safe check-in reminder for tonight is scheduled. Your emergency contacts are primed.',
        category: 'SAFETY',
        emoji: '🛡️',
        actionUrl: '/safety',
        isRead: true,
        createdAt: new Date(Date.now() - 86400000).toISOString()
      }
    ];

    this.notifications.set('usr_demo_1', defaultList);
  }

  getNotifications(userId: string): { items: NotificationItem[]; unreadCount: number } {
    const list = this.notifications.get(userId) || [];
    const unreadCount = list.filter((n) => !n.isRead).length;
    return { items: list, unreadCount };
  }

  markAsRead(userId: string, notificationId: string): { success: boolean } {
    const list = this.notifications.get(userId) || [];
    const item = list.find((n) => n.id === notificationId);
    if (item) {
      item.isRead = true;
    }
    return { success: true };
  }

  markAllAsRead(userId: string): { markedCount: number } {
    const list = this.notifications.get(userId) || [];
    let markedCount = 0;
    list.forEach((n) => {
      if (!n.isRead) {
        n.isRead = true;
        markedCount++;
      }
    });
    return { markedCount };
  }

  pushNotification(
    userId: string,
    title: string,
    body: string,
    category: NotificationItem['category'],
    emoji: string = '🔔',
    actionUrl?: string
  ): NotificationItem {
    const newItem: NotificationItem = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId,
      title,
      body,
      category,
      emoji,
      actionUrl,
      isRead: false,
      createdAt: new Date().toISOString()
    };

    const list = this.notifications.get(userId) || [];
    list.unshift(newItem);
    this.notifications.set(userId, list);

    return newItem;
  }
}
