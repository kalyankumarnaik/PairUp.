import {
  ConnectionMode,
  Conversation,
  DiscoveryCard,
  EventStatus,
  Gender,
  MatchStatus,
  MatchSummary,
  MessageStatus,
  MessageType,
  RelationshipIntention,
  SocialEvent,
  VerificationStatus,
  VoiceRoom,
  VoiceRoomRole
} from '@pairup/domain-types';

export const MOCK_DISCOVERY_CARDS: DiscoveryCard[] = [
  {
    id: 'disc_1',
    userId: 'usr_demo_1',
    displayName: 'Ananya Verma',
    age: 26,
    bio: 'Architect, plant mom, and amateur photographer. Always up for filter coffee or art gallery walks in Bandra. Let’s talk about design, vinyl records, or the best pasta in Mumbai.',
    gender: Gender.WOMAN,
    pronouns: 'she/her',
    relationshipIntention: RelationshipIntention.DATING_TO_MARRY,
    connectionMode: ConnectionMode.DATING,
    city: 'Mumbai',
    approximateDistanceKm: 3.5,
    interests: [
      { id: '1', name: 'Coffee & Cafes', category: 'Lifestyle', emoji: '☕' },
      { id: '2', name: 'Contemporary Art', category: 'Creative', emoji: '🎨' },
      { id: '3', name: 'Street Photography', category: 'Creative', emoji: '📷' }
    ],
    photos: [
      {
        id: 'p1',
        profileId: '1',
        url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800',
        order: 0,
        isPrimary: true,
        isModerated: true,
        createdAt: ''
      },
      {
        id: 'p2',
        profileId: '1',
        url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800',
        order: 1,
        isPrimary: false,
        isModerated: true,
        createdAt: ''
      }
    ],
    prompts: [
      {
        id: 'prm1',
        question: 'A perfect Sunday morning looks like',
        answer: 'Brewing pour-over coffee and listening to indie vinyl.'
      }
    ],
    verificationStatus: VerificationStatus.VERIFIED
  },
  {
    id: 'disc_2',
    userId: 'usr_demo_2',
    displayName: 'Aarav Sharma',
    age: 28,
    bio: 'Fintech product designer who balances UX wireframes with weekend hiking trips and spicy street food trails. Let’s find Mumbai’s hidden sunset viewpoints.',
    gender: Gender.MAN,
    pronouns: 'he/him',
    relationshipIntention: RelationshipIntention.LONG_TERM,
    connectionMode: ConnectionMode.BOTH,
    city: 'Mumbai',
    approximateDistanceKm: 4.2,
    interests: [
      { id: '4', name: 'Hiking & Trekking', category: 'Outdoors', emoji: '🏔️' },
      { id: '5', name: 'Badminton', category: 'Sports', emoji: '🏸' },
      { id: '6', name: 'Tech & Startups', category: 'Tech', emoji: '💻' }
    ],
    photos: [
      {
        id: 'p3',
        profileId: '2',
        url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
        order: 0,
        isPrimary: true,
        isModerated: true,
        createdAt: ''
      }
    ],
    prompts: [
      {
        id: 'prm2',
        question: 'The best way to ask me out',
        answer: 'Invite me for a badminton match or single-origin cold brew.'
      }
    ],
    verificationStatus: VerificationStatus.VERIFIED
  },
  {
    id: 'disc_3',
    userId: 'usr_demo_3',
    displayName: 'Riya Sen',
    age: 24,
    bio: 'Software engineer at a YC startup by day, live music enthusiast by night. Looking for concert buddies and coffee debates on whether tabs beat spaces.',
    gender: Gender.WOMAN,
    pronouns: 'she/her',
    relationshipIntention: RelationshipIntention.NEW_FRIENDS,
    connectionMode: ConnectionMode.FRIENDSHIP,
    city: 'Bengaluru',
    approximateDistanceKm: 5.8,
    interests: [
      { id: '7', name: 'Indie Rock', category: 'Music', emoji: '🎵' },
      { id: '8', name: 'Board Games', category: 'Gaming', emoji: '🎲' }
    ],
    photos: [
      {
        id: 'p4',
        profileId: '3',
        url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800',
        order: 0,
        isPrimary: true,
        isModerated: true,
        createdAt: ''
      }
    ],
    prompts: [],
    verificationStatus: VerificationStatus.VERIFIED
  },
  {
    id: 'disc_4',
    userId: 'usr_demo_4',
    displayName: 'Kabir Mehta',
    age: 27,
    bio: 'Filmmaker and documentarian. In search of interesting human stories, cozy rooftop chai spots, and film festival partners.',
    gender: Gender.MAN,
    pronouns: 'he/him',
    relationshipIntention: RelationshipIntention.LONG_TERM,
    connectionMode: ConnectionMode.DATING,
    city: 'Delhi',
    approximateDistanceKm: 8.1,
    interests: [
      { id: '9', name: 'Cinema & Film', category: 'Arts', emoji: '🎬' },
      { id: '10', name: 'Writing & Books', category: 'Creative', emoji: '📚' }
    ],
    photos: [
      {
        id: 'p5',
        profileId: '4',
        url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800',
        order: 0,
        isPrimary: true,
        isModerated: true,
        createdAt: ''
      }
    ],
    prompts: [],
    verificationStatus: VerificationStatus.VERIFIED
  }
];

export const MOCK_MATCHES: MatchSummary[] = [
  {
    id: 'match_1',
    conversationId: 'conv_1',
    matchedUserId: 'usr_demo_1',
    matchedProfile: {
      displayName: 'Ananya Verma',
      age: 26,
      city: 'Mumbai',
      primaryPhotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800',
      isVerified: true
    },
    connectionMode: ConnectionMode.DATING,
    status: MatchStatus.ACTIVE,
    lastMessageSnippet: 'Hey! Loved your photo from the Marine Drive run 🏃‍♀️',
    lastMessageAt: new Date(Date.now() - 1800000).toISOString(),
    unreadCount: 0,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 'match_2',
    conversationId: 'conv_2',
    matchedUserId: 'usr_demo_3',
    matchedProfile: {
      displayName: 'Riya Sen',
      age: 24,
      city: 'Bengaluru',
      primaryPhotoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800',
      isVerified: true
    },
    connectionMode: ConnectionMode.FRIENDSHIP,
    status: MatchStatus.ACTIVE,
    lastMessageSnippet: 'Are you attending the indie live gig this Saturday?',
    lastMessageAt: new Date(Date.now() - 7200000).toISOString(),
    unreadCount: 1,
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
];

export const MOCK_ROOMS: VoiceRoom[] = [
  {
    id: 'room_1',
    title: 'Late Night Chill & Chai ☕',
    description: 'Casual open voice space talking about music, life in Mumbai, and indie playlists.',
    category: 'Casual Chill',
    emoji: '☕',
    hostId: 'usr_demo_1',
    hostName: 'Ananya Verma',
    isPrivate: false,
    capacity: 50,
    activeCount: 18,
    speakers: [
      {
        userId: 'usr_demo_1',
        displayName: 'Ananya Verma',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800',
        role: VoiceRoomRole.HOST,
        isMuted: false,
        hasRaisedHand: false,
        joinedAt: new Date().toISOString()
      },
      {
        userId: 'usr_demo_2',
        displayName: 'Aarav Sharma',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
        role: VoiceRoomRole.SPEAKER,
        isMuted: false,
        hasRaisedHand: false,
        joinedAt: new Date().toISOString()
      }
    ],
    listeners: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'room_2',
    title: 'Startup Founders & Builders Hub 🚀',
    description: 'Networking session on early-stage pitching, tech stacks, and team building.',
    category: 'Tech & Career',
    emoji: '🚀',
    hostId: 'usr_demo_2',
    hostName: 'Aarav Sharma',
    isPrivate: false,
    capacity: 100,
    activeCount: 42,
    speakers: [
      {
        userId: 'usr_demo_2',
        displayName: 'Aarav Sharma',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
        role: VoiceRoomRole.HOST,
        isMuted: false,
        hasRaisedHand: false,
        joinedAt: new Date().toISOString()
      }
    ],
    listeners: [],
    createdAt: new Date().toISOString()
  }
];

export const MOCK_EVENTS: SocialEvent[] = [
  {
    id: 'event_1',
    title: 'Sunrise Coastal Cycling & Filter Coffee 🚲',
    description: 'Join friendly locals for an early morning 15km ride along Bandstand and Carter Road, followed by fresh South Indian filter coffee.',
    category: 'Fitness & Outdoors',
    emoji: '🚲',
    venueName: 'Bandra Bandstand Promenade',
    approximateLocation: 'Bandra West, Mumbai',
    city: 'Mumbai',
    startTime: '2026-11-08T06:30:00Z',
    endTime: '2026-11-08T09:00:00Z',
    capacity: 25,
    registeredCount: 19,
    isRegistered: true,
    organizer: {
      id: 'usr_demo_1',
      displayName: 'Ananya Verma',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800'
    },
    status: EventStatus.SCHEDULED,
    createdAt: new Date().toISOString()
  },
  {
    id: 'event_2',
    title: 'Indie Board Game & Acoustic Music Night 🎲',
    description: 'An evening of Catan, Ticket to Ride, and acoustic open-mic sessions. Perfect icebreaker for new friends!',
    category: 'Social Meetup',
    emoji: '🎲',
    venueName: 'The Hive Cafe, Khar',
    approximateLocation: 'Khar West, Mumbai',
    city: 'Mumbai',
    startTime: '2026-11-14T18:00:00Z',
    endTime: '2026-11-14T21:30:00Z',
    capacity: 35,
    registeredCount: 28,
    isRegistered: false,
    organizer: {
      id: 'usr_demo_2',
      displayName: 'Aarav Sharma',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800'
    },
    status: EventStatus.SCHEDULED,
    createdAt: new Date().toISOString()
  }
];

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv_1',
    matchId: 'match_1',
    participants: [
      {
        userId: 'usr_demo_current',
        displayName: 'You',
        isOnline: true
      },
      {
        userId: 'usr_demo_1',
        displayName: 'Ananya Verma',
        primaryPhotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800',
        isOnline: true
      }
    ],
    lastMessage: {
      id: 'msg_1',
      conversationId: 'conv_1',
      senderId: 'usr_demo_1',
      type: MessageType.TEXT,
      content: 'Hey! Loved your photo from the Marine Drive run 🏃‍♀️',
      status: MessageStatus.DELIVERED,
      attachments: [],
      reactions: [
        {
          id: 'rx_1',
          messageId: 'msg_1',
          userId: 'usr_demo_current',
          emoji: '❤️',
          createdAt: new Date().toISOString()
        }
      ],
      createdAt: new Date(Date.now() - 1800000).toISOString()
    },
    unreadCount: 0,
    isMuted: false,
    updatedAt: new Date(Date.now() - 1800000).toISOString()
  },
  {
    id: 'conv_2',
    matchId: 'match_2',
    participants: [
      {
        userId: 'usr_demo_current',
        displayName: 'You',
        isOnline: true
      },
      {
        userId: 'usr_demo_3',
        displayName: 'Riya Sen',
        primaryPhotoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800',
        isOnline: true
      }
    ],
    lastMessage: {
      id: 'msg_2',
      conversationId: 'conv_2',
      senderId: 'usr_demo_3',
      type: MessageType.TEXT,
      content: 'Are you attending the indie live gig this Saturday?',
      status: MessageStatus.READ,
      attachments: [],
      reactions: [],
      createdAt: new Date(Date.now() - 7200000).toISOString()
    },
    unreadCount: 1,
    isMuted: false,
    updatedAt: new Date(Date.now() - 7200000).toISOString()
  }
];
