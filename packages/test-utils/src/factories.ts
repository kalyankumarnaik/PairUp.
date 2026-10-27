import {
  AccountStatus,
  ChatMessage,
  ConnectionMode,
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

export function createUserMock(overrides?: Partial<User>): User {
  return {
    id: 'usr_' + Math.random().toString(36).substring(2, 9),
    email: 'testuser@pairup.ai',
    phone: '+919876543210',
    isEmailVerified: true,
    isPhoneVerified: true,
    isAdultVerified: true,
    role: UserRole.USER,
    status: AccountStatus.ACTIVE,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides
  };
}

export function createProfileMock(overrides?: Partial<UserProfile>): UserProfile {
  return {
    id: 'prf_' + Math.random().toString(36).substring(2, 9),
    userId: 'usr_test',
    displayName: 'Aarav Sharma',
    birthDate: '1998-05-14',
    age: 28,
    bio: 'Software engineer who loves exploring rooftop cafes, live indie gigs, and weekend badminton matches.',
    gender: Gender.MAN,
    pronouns: 'he/him',
    relationshipIntention: RelationshipIntention.LONG_TERM,
    connectionMode: ConnectionMode.BOTH,
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    education: 'IIT Bombay',
    occupation: 'Lead Engineer',
    languages: ['English', 'Hindi', 'Marathi'],
    interests: [
      { id: 'int_1', name: 'Music', category: 'Creative', emoji: '🎵' },
      { id: 'int_2', name: 'Badminton', category: 'Sports', emoji: '🏸' },
      { id: 'int_3', name: 'Cafes', category: 'Lifestyle', emoji: '☕' }
    ],
    photos: [
      {
        id: 'pht_1',
        profileId: 'prf_test',
        url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800',
        order: 0,
        isPrimary: true,
        isModerated: true,
        createdAt: new Date().toISOString()
      }
    ],
    prompts: [
      {
        id: 'prm_1',
        question: 'A perfect Sunday looks like',
        answer: 'Brewing artisanal coffee, walking by Marine Drive, and catching sunset with good music.'
      }
    ],
    verificationStatus: VerificationStatus.VERIFIED,
    completenessScore: 92,
    isIncognito: false,
    isVisible: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides
  };
}

export function createDiscoveryCardMock(overrides?: Partial<DiscoveryCard>): DiscoveryCard {
  return {
    id: 'prf_disc_' + Math.random().toString(36).substring(2, 9),
    userId: 'usr_target_' + Math.random().toString(36).substring(2, 9),
    displayName: 'Ananya Verma',
    age: 26,
    bio: 'Architect, plant mom, and amateur photographer. Always up for filter coffee or art gallery walks.',
    gender: Gender.WOMAN,
    pronouns: 'she/her',
    relationshipIntention: RelationshipIntention.DATING_TO_MARRY,
    connectionMode: ConnectionMode.DATING,
    city: 'Mumbai',
    approximateDistanceKm: 3.5,
    interests: [
      { id: 'int_art', name: 'Art', category: 'Creative', emoji: '🎨' },
      { id: 'int_coffee', name: 'Coffee', category: 'Lifestyle', emoji: '☕' },
      { id: 'int_photo', name: 'Photography', category: 'Creative', emoji: '📷' }
    ],
    photos: [
      {
        id: 'pht_ananya',
        profileId: 'prf_ananya',
        url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800',
        order: 0,
        isPrimary: true,
        isModerated: true,
        createdAt: new Date().toISOString()
      }
    ],
    prompts: [
      {
        id: 'prm_ananya',
        question: 'Two truths and a lie',
        answer: 'I run half-marathons, I have 42 house plants, and I have never seen Dilwale Dulhania Le Jayenge.'
      }
    ],
    verificationStatus: VerificationStatus.VERIFIED,
    compatibilityScore: 88,
    compatibilityReasons: ['Both love cafes & photography', 'Both looking for long-term connection'],
    ...overrides
  };
}

export function createMessageMock(overrides?: Partial<ChatMessage>): ChatMessage {
  return {
    id: 'msg_' + Math.random().toString(36).substring(2, 9),
    conversationId: 'conv_1',
    senderId: 'usr_1',
    senderName: 'Aarav',
    type: MessageType.TEXT,
    content: 'Hey Ananya! Loved your photo by Marine Drive ✨',
    status: MessageStatus.SENT,
    attachments: [],
    reactions: [],
    createdAt: new Date().toISOString(),
    ...overrides
  };
}

export function createVoiceRoomMock(overrides?: Partial<VoiceRoom>): VoiceRoom {
  return {
    id: 'room_' + Math.random().toString(36).substring(2, 9),
    title: 'Late Night Chai & Indie Music Vibe ☕🎶',
    category: 'Music & Hobbies',
    emoji: '🎧',
    hostId: 'usr_host',
    hostName: 'Kabir & Riya',
    isPrivate: false,
    capacity: 100,
    activeCount: 24,
    speakers: [
      {
        userId: 'usr_host',
        displayName: 'Kabir',
        role: VoiceRoomRole.HOST,
        isMuted: false,
        hasRaisedHand: false,
        joinedAt: new Date().toISOString()
      }
    ],
    listeners: [],
    createdAt: new Date().toISOString(),
    ...overrides
  };
}
