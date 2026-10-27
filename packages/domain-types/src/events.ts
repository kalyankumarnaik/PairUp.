export enum EventStatus {
  SCHEDULED = 'SCHEDULED',
  ONGOING = 'ONGOING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface SocialEvent {
  id: string;
  title: string;
  description: string;
  category: string;
  emoji: string;
  venueName: string;
  approximateLocation: string; // "Bandra West, Mumbai"
  city: string;
  startTime: Date | string;
  endTime: Date | string;
  capacity: number;
  registeredCount: number;
  isRegistered?: boolean;
  organizer: {
    id: string;
    displayName: string;
    avatarUrl?: string | null;
  };
  status: EventStatus;
  createdAt: Date | string;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  userId: string;
  registeredAt: Date | string;
}
