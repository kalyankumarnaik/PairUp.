import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { VoiceRoom, VoiceRoomMember, VoiceRoomRole } from '@pairup/domain-types';
import { MemoryStoreService } from '../../common/database/memory-store.service';

@Injectable()
export class RoomsService {
  constructor(private readonly store: MemoryStoreService) {}

  getAllRooms(): VoiceRoom[] {
    return Array.from(this.store.rooms.values());
  }

  getRoomById(roomId: string): VoiceRoom {
    const room = this.store.rooms.get(roomId);
    if (!room) {
      throw new NotFoundException('Voice room not found');
    }
    return room;
  }

  createRoom(
    userId: string,
    title: string,
    category: string,
    emoji: string,
    isPrivate: boolean = false,
    capacity: number = 50
  ): VoiceRoom {
    const profile = this.store.profiles.get(userId);
    const roomId = `room_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    const hostMember: VoiceRoomMember = {
      userId,
      displayName: profile?.displayName || 'Host',
      avatarUrl: profile?.photos[0]?.url || null,
      role: VoiceRoomRole.HOST,
      isMuted: false,
      hasRaisedHand: false,
      joinedAt: new Date().toISOString()
    };

    const room: VoiceRoom = {
      id: roomId,
      title,
      description: 'Live voice room on PairUp AI',
      category,
      emoji,
      hostId: userId,
      hostName: hostMember.displayName,
      isPrivate,
      capacity,
      activeCount: 1,
      speakers: [hostMember],
      listeners: [],
      createdAt: new Date().toISOString()
    };

    this.store.rooms.set(roomId, room);
    return room;
  }

  joinRoom(userId: string, roomId: string): VoiceRoom {
    const room = this.getRoomById(roomId);
    const profile = this.store.profiles.get(userId);

    const isAlreadyMember =
      room.speakers.some((s) => s.userId === userId) ||
      room.listeners.some((l) => l.userId === userId);

    if (!isAlreadyMember) {
      if (room.activeCount >= room.capacity) {
        throw new BadRequestException('Voice room is at full capacity');
      }

      const newMember: VoiceRoomMember = {
        userId,
        displayName: profile?.displayName || 'Member',
        avatarUrl: profile?.photos[0]?.url || null,
        role: VoiceRoomRole.LISTENER,
        isMuted: true,
        hasRaisedHand: false,
        joinedAt: new Date().toISOString()
      };

      room.listeners.push(newMember);
      room.activeCount = room.speakers.length + room.listeners.length;
      this.store.rooms.set(roomId, room);
    }

    return room;
  }

  leaveRoom(userId: string, roomId: string): { left: boolean } {
    const room = this.store.rooms.get(roomId);
    if (!room) return { left: true };

    room.speakers = room.speakers.filter((s) => s.userId !== userId);
    room.listeners = room.listeners.filter((l) => l.userId !== userId);
    room.activeCount = room.speakers.length + room.listeners.length;

    // If host leaves and no speakers left, close room
    if (room.hostId === userId && room.speakers.length === 0) {
      this.store.rooms.delete(roomId);
    } else {
      this.store.rooms.set(roomId, room);
    }

    return { left: true };
  }

  raiseHand(userId: string, roomId: string): VoiceRoomMember {
    const room = this.getRoomById(roomId);
    const listener = room.listeners.find((l) => l.userId === userId);
    if (!listener) {
      throw new BadRequestException('You must be a listener in the room to raise your hand');
    }

    listener.hasRaisedHand = !listener.hasRaisedHand;
    this.store.rooms.set(roomId, room);
    return listener;
  }

  promoteToSpeaker(hostId: string, roomId: string, targetUserId: string): VoiceRoom {
    const room = this.getRoomById(roomId);
    if (room.hostId !== hostId) {
      throw new BadRequestException('Only the host or moderator can promote listeners');
    }

    const listenerIndex = room.listeners.findIndex((l) => l.userId === targetUserId);
    if (listenerIndex >= 0) {
      const promoted = room.listeners.splice(listenerIndex, 1)[0];
      promoted.role = VoiceRoomRole.SPEAKER;
      promoted.hasRaisedHand = false;
      promoted.isMuted = false;
      room.speakers.push(promoted);
      this.store.rooms.set(roomId, room);
    }

    return room;
  }
}
