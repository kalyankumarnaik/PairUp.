import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { SocialEvent } from '@pairup/domain-types';
import { MemoryStoreService } from '../../common/database/memory-store.service';
import { CreateEventInput } from '@pairup/validation';

@Injectable()
export class EventsService {
  constructor(private readonly store: MemoryStoreService) {}

  getAllEvents(userId?: string, city?: string, category?: string): SocialEvent[] {
    const list = Array.from(this.store.events.values());

    return list
      .filter((e) => {
        if (city && city !== 'All' && !e.city.toLowerCase().includes(city.toLowerCase())) {
          return false;
        }
        if (category && category !== 'All' && !e.category.toLowerCase().includes(category.toLowerCase())) {
          return false;
        }
        return true;
      })
      .map((e) => {
        const userRegistrations = this.store.eventRegistrations.get(e.id);
        const isRegistered = userId && userRegistrations ? userRegistrations.has(userId) : false;
        return {
          ...e,
          isRegistered
        };
      })
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  }

  getEventById(eventId: string, userId?: string): SocialEvent {
    const event = this.store.events.get(eventId);
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    const regs = this.store.eventRegistrations.get(eventId);
    const isRegistered = userId && regs ? regs.has(userId) : false;

    return {
      ...event,
      isRegistered
    };
  }

  createEvent(organizerId: string, input: CreateEventInput): SocialEvent {
    const profile = this.store.profiles.get(organizerId);
    const eventId = `evt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    const event: SocialEvent = {
      id: eventId,
      title: input.title,
      description: input.description,
      category: input.category,
      emoji: input.emoji,
      venueName: input.venueName,
      approximateLocation: input.approximateLocation,
      city: input.city,
      startTime: input.startTime,
      endTime: input.endTime,
      capacity: input.capacity,
      registeredCount: 1, // Organizer registered by default
      isRegistered: true,
      organizer: {
        id: organizerId,
        displayName: profile?.displayName || 'Organizer',
        avatarUrl: profile?.photos[0]?.url || null
      },
      status: 'SCHEDULED' as any,
      createdAt: new Date().toISOString()
    };

    this.store.events.set(eventId, event);
    this.store.eventRegistrations.set(eventId, new Set([organizerId]));

    return event;
  }

  registerForEvent(userId: string, eventId: string): { registered: boolean; count: number } {
    const event = this.store.events.get(eventId);
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    let regs = this.store.eventRegistrations.get(eventId);
    if (!regs) {
      regs = new Set();
      this.store.eventRegistrations.set(eventId, regs);
    }

    if (regs.has(userId)) {
      throw new ConflictException('You are already registered for this event');
    }

    if (regs.size >= event.capacity) {
      throw new BadRequestException('This event is already at maximum capacity');
    }

    regs.add(userId);
    event.registeredCount = regs.size;
    this.store.events.set(eventId, event);

    return { registered: true, count: event.registeredCount };
  }

  cancelRegistration(userId: string, eventId: string): { registered: boolean; count: number } {
    const event = this.store.events.get(eventId);
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    const regs = this.store.eventRegistrations.get(eventId);
    if (regs && regs.has(userId)) {
      regs.delete(userId);
      event.registeredCount = regs.size;
      this.store.events.set(eventId, event);
    }

    return { registered: false, count: event.registeredCount };
  }
}
