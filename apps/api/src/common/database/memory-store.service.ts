import {
  CallSession,
  ChatMessage,
  Community,
  Conversation,
  DiscoveryCard,
  Gender,
  MatchStatus,
  MatchSummary,
  MessageStatus,
  MessageType,
  RelationshipIntention,
  SocialEvent,
  User,
  UserProfile,
  UserRole,
  VerificationStatus,
  VoiceRoom,
  VoiceRoomRole
} from '@pairup/domain-types';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { DEMO_EVENTS, DEMO_PROFILES, DEMO_VOICE_ROOMS, INITIAL_INTERESTS } from '@pairup/database';

@Injectable()
export class MemoryStoreService implements OnModuleInit {
  // Store collections
  public users: Map<string, User & { passwordHash: string; rawPassword?: string }> = new Map();
  public profiles: Map<string, UserProfile> = new Map();
  public locations: Map<string, { latitude: number; longitude: number; city: string; state: string; isPaused: boolean }> = new Map();
  public swipes: Map<string, { userId: string; targetUserId: string; action: string; mode: string; createdAt: Date }> = new Map();
  public matches: Map<string, { id: string; user1Id: string; user2Id: string; mode: string; status: MatchStatus; conversationId: string; createdAt: Date }> = new Map();
  public conversations: Map<string, Conversation> = new Map();
  public messages: Map<string, ChatMessage[]> = new Map();
  public rooms: Map<string, VoiceRoom> = new Map();
  public events: Map<string, SocialEvent> = new Map();
  public eventRegistrations: Map<string, Set<string>> = new Map(); // eventId -> Set(userIds)
  public reports: Map<string, any> = new Map();
  public blockedUsers: Map<string, Set<string>> = new Map(); // userId -> Set(blockedUserIds)
  public auditLogs: any[] = [];
  public otpStore: Map<string, { code: string; expiresAt: number }> = new Map();

  onModuleInit() {
    this.seedInitialData();
  }

  private seedInitialData() {
    // 1. Seed Admin User
    const adminId = 'usr_admin_master';
    this.users.set(adminId, {
      id: adminId,
      email: 'admin@pairup.ai',
      phone: '+919999900000',
      passwordHash: '$2a$10$wK1b8B/qJ8u8fO05v1Hw7OzY3wV9kCcm/J30r7o0Uf82F7nQ6.yC6', // AdminSecurePairUp2026!
      rawPassword: 'AdminSecurePairUp2026!',
      isEmailVerified: true,
      isPhoneVerified: true,
      isAdultVerified: true,
      role: UserRole.SUPER_ADMIN,
      status: 'ACTIVE' as any,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    // 2. Seed Demo Profiles
    DEMO_PROFILES.forEach((demo, idx) => {
      const userId = `usr_demo_${idx + 1}`;
      const profileId = `prf_demo_${idx + 1}`;

      this.users.set(userId, {
        id: userId,
        email: demo.email,
        phone: `+91980000000${idx + 1}`,
        passwordHash: '$2a$10$wK1b8B/qJ8u8fO05v1Hw7OzY3wV9kCcm/J30r7o0Uf82F7nQ6.yC6', // Password123!
        rawPassword: 'Password123!',
        isEmailVerified: true,
        isPhoneVerified: true,
        isAdultVerified: true,
        role: UserRole.USER,
        status: 'ACTIVE' as any,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      const profile: UserProfile = {
        id: profileId,
        userId: userId,
        displayName: demo.displayName,
        birthDate: demo.birthDate,
        age: this.calculateAge(demo.birthDate),
        bio: demo.bio,
        gender: demo.gender as Gender,
        pronouns: demo.pronouns,
        relationshipIntention: demo.relationshipIntention as RelationshipIntention,
        connectionMode: demo.connectionMode as any,
        city: demo.city,
        state: demo.state,
        country: 'India',
        education: demo.education,
        occupation: demo.occupation,
        languages: ['English', 'Hindi'],
        interests: demo.interests.map((intName, i) => ({
          id: `int_${i + 1}`,
          name: intName,
          category: 'Lifestyle',
          emoji: '✨'
        })),
        photos: demo.photos.map((url, i) => ({
          id: `pht_${profileId}_${i + 1}`,
          profileId: profileId,
          url: url,
          order: i,
          isPrimary: i === 0,
          isModerated: true,
          createdAt: new Date().toISOString()
        })),
        prompts: demo.prompts.map((p, i) => ({
          id: `prm_${profileId}_${i + 1}`,
          question: p.question,
          answer: p.answer
        })),
        verificationStatus: VerificationStatus.VERIFIED,
        completenessScore: 90,
        isIncognito: false,
        isVisible: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      this.profiles.set(userId, profile);

      this.locations.set(userId, {
        latitude: demo.latitude,
        longitude: demo.longitude,
        city: demo.city,
        state: demo.state,
        isPaused: false
      });
    });

    // 3. Seed Demo Voice Rooms
    DEMO_VOICE_ROOMS.forEach((r, idx) => {
      const roomId = `room_demo_${idx + 1}`;
      this.rooms.set(roomId, {
        id: roomId,
        title: r.title,
        description: 'Open audio community room for chill conversations and vibe.',
        category: r.category,
        emoji: r.emoji,
        hostId: 'usr_demo_1',
        hostName: r.hostName,
        isPrivate: r.isPrivate,
        capacity: r.capacity,
        activeCount: r.activeCount,
        speakers: [
          {
            userId: 'usr_demo_1',
            displayName: r.hostName,
            role: VoiceRoomRole.HOST,
            isMuted: false,
            hasRaisedHand: false,
            joinedAt: new Date().toISOString()
          }
        ],
        listeners: [],
        createdAt: new Date().toISOString()
      });
    });

    // 4. Seed Demo Events
    DEMO_EVENTS.forEach((e, idx) => {
      const eventId = `evt_demo_${idx + 1}`;
      this.events.set(eventId, {
        id: eventId,
        title: e.title,
        description: e.description,
        category: e.category,
        emoji: e.emoji,
        venueName: e.venueName,
        approximateLocation: e.approximateLocation,
        city: e.city,
        startTime: e.startTime,
        endTime: e.endTime,
        capacity: e.capacity,
        registeredCount: e.registeredCount,
        isRegistered: false,
        organizer: {
          id: 'usr_demo_1',
          displayName: 'Ananya Verma',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'
        },
        status: 'SCHEDULED' as any,
        createdAt: new Date().toISOString()
      });
      this.eventRegistrations.set(eventId, new Set());
    });

    // 5. Seed Mutual Match & Conversation between Demo User 1 (Ananya) and Demo User 2 (Aarav)
    const matchId = 'match_demo_1_2';
    const convId = 'conv_demo_1_2';
    this.matches.set(matchId, {
      id: matchId,
      user1Id: 'usr_demo_1',
      user2Id: 'usr_demo_2',
      mode: 'DATING',
      status: MatchStatus.ACTIVE,
      conversationId: convId,
      createdAt: new Date()
    });

    this.conversations.set(convId, {
      id: convId,
      matchId: matchId,
      participants: [
        {
          userId: 'usr_demo_1',
          displayName: 'Ananya Verma',
          primaryPhotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
          isOnline: true,
          lastSeenAt: new Date().toISOString()
        },
        {
          userId: 'usr_demo_2',
          displayName: 'Aarav Sharma',
          primaryPhotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
          isOnline: true,
          lastSeenAt: new Date().toISOString()
        }
      ],
      unreadCount: 0,
      isMuted: false,
      updatedAt: new Date().toISOString()
    });

    this.messages.set(convId, [
      {
        id: 'msg_init_1',
        conversationId: convId,
        senderId: 'usr_demo_2',
        senderName: 'Aarav Sharma',
        type: MessageType.TEXT,
        content: 'Hey Ananya! Loved your photo by Marine Drive ✨ Are you into filter coffee?',
        status: MessageStatus.READ,
        attachments: [],
        reactions: [{ id: 'rc_1', messageId: 'msg_init_1', userId: 'usr_demo_1', emoji: '❤️', createdAt: new Date() }],
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
      },
      {
        id: 'msg_init_2',
        conversationId: convId,
        senderId: 'usr_demo_1',
        senderName: 'Ananya Verma',
        type: MessageType.TEXT,
        content: 'Hi Aarav! Absolutely, filter coffee is a non-negotiable morning ritual for me ☕ Have you been to Subko in Bandra?',
        status: MessageStatus.READ,
        attachments: [],
        reactions: [{ id: 'rc_2', messageId: 'msg_init_2', userId: 'usr_demo_2', emoji: '🔥', createdAt: new Date() }],
        createdAt: new Date(Date.now() - 3600000).toISOString()
      }
    ]);
  }

  private calculateAge(birthDateStr: string): number {
    const birthDate = new Date(birthDateStr);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }
}
