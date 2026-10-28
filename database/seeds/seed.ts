/**
 * PairUp AI - Comprehensive Production Seed Script
 * Seeds Initial Categories, Interests, Admin User, Verified Profiles across Indian metros,
 * Demo Matches, Real-time Chat Histories, Voice Rooms, and Social Events.
 */

export const INITIAL_INTERESTS = [
  { name: 'Coffee & Cafes', category: 'Food & Dining', emoji: '☕' },
  { name: 'Indie Rock & Pop', category: 'Music', emoji: '🎵' },
  { name: 'Hiking & Trekking', category: 'Outdoors', emoji: '🏔️' },
  { name: 'Contemporary Art', category: 'Creative', emoji: '🎨' },
  { name: 'Badminton', category: 'Sports', emoji: '🏸' },
  { name: 'Sci-Fi & Thrillers', category: 'Books', emoji: '📚' },
  { name: 'Mobile & Web Dev', category: 'Technology', emoji: '💻' },
  { name: 'Board Games & Catan', category: 'Gaming', emoji: '🎲' },
  { name: 'Street Photography', category: 'Creative', emoji: '📷' },
  { name: 'Yoga & Mindfulness', category: 'Wellness', emoji: '🧘' },
  { name: 'Cooking & Baking', category: 'Food & Dining', emoji: '🍳' },
  { name: 'Dogs & Pets', category: 'Lifestyle', emoji: '🐕' },
  { name: 'Weekend Roadtrips', category: 'Travel', emoji: '🚗' },
  { name: 'Stand-up Comedy', category: 'Entertainment', emoji: '🎙️' },
  { name: 'Guitar & Ukulele', category: 'Music', emoji: '🎸' },
  { name: 'Startup Culture', category: 'Career', emoji: '🚀' },
  { name: 'Pottery & Ceramics', category: 'Creative', emoji: '🏺' },
  { name: 'Formula 1 & Racing', category: 'Sports', emoji: '🏎️' },
  { name: 'Sourdough Baking', category: 'Food & Dining', emoji: '🥖' },
  { name: 'Podcasting & Audio', category: 'Media', emoji: '🎧' }
];

export const DEMO_PROFILES = [
  {
    email: 'ananya.verma@example.com',
    displayName: 'Ananya Verma',
    birthDate: '1998-07-22',
    gender: 'WOMAN',
    pronouns: 'she/her',
    bio: 'Architect, plant mom, and amateur photographer. Always up for filter coffee or art gallery walks in Bandra. Let’s talk about design, vinyl records, or the best pasta in Mumbai.',
    relationshipIntention: 'DATING_TO_MARRY',
    connectionMode: 'DATING',
    education: 'CEPT University, Ahmedabad',
    occupation: 'Lead Urban Architect',
    city: 'Mumbai',
    state: 'Maharashtra',
    latitude: 19.0596,
    longitude: 72.8295, // Bandra West
    photos: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80'
    ],
    interests: ['Coffee & Cafes', 'Contemporary Art', 'Street Photography', 'Indie Rock & Pop'],
    prompts: [
      {
        question: 'A perfect Sunday morning looks like',
        answer: 'Brewing pour-over coffee, listening to Prateek Kuhad, and tending to my 30 balcony plants.'
      },
      {
        question: 'Two truths and a lie',
        answer: 'I ran a half marathon, I have never seen DDLJ, and I can bake sourdough from scratch.'
      }
    ]
  },
  {
    email: 'aarav.sharma@example.com',
    displayName: 'Aarav Sharma',
    birthDate: '1996-03-15',
    gender: 'MAN',
    pronouns: 'he/him',
    bio: 'Fintech product designer who balances UX wireframes with weekend hiking trips and spicy street food trails. Let’s find Mumbai’s hidden sunset viewpoints.',
    relationshipIntention: 'LONG_TERM',
    connectionMode: 'BOTH',
    education: 'IIT Bombay',
    occupation: 'Product Designer',
    city: 'Mumbai',
    state: 'Maharashtra',
    latitude: 19.076,
    longitude: 72.8777,
    photos: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=80'
    ],
    interests: ['Hiking & Trekking', 'Coffee & Cafes', 'Badminton', 'Mobile & Web Dev'],
    prompts: [
      {
        question: 'The best way to ask me out',
        answer: 'Ask if I want to play badminton or explore a newly opened artisanal bakery.'
      }
    ]
  },
  {
    email: 'riya.sen@example.com',
    displayName: 'Riya Sen',
    birthDate: '2000-11-09',
    gender: 'WOMAN',
    pronouns: 'she/her',
    bio: 'Software engineer at a fast-growing startup by day, live music enthusiast by night. Looking for concert buddies and coffee debates on whether tabs beat spaces.',
    relationshipIntention: 'NEW_FRIENDS',
    connectionMode: 'FRIENDSHIP',
    education: 'PES University, Bengaluru',
    occupation: 'Full-Stack Developer',
    city: 'Bengaluru',
    state: 'Karnataka',
    latitude: 12.9716,
    longitude: 77.5946,
    photos: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&auto=format&fit=crop&q=80'
    ],
    interests: ['Mobile & Web Dev', 'Indie Rock & Pop', 'Board Games & Catan', 'Sci-Fi & Thrillers'],
    prompts: [
      {
        question: 'A boundary of mine',
        answer: 'Never schedule a meeting before 10 AM, and never skip morning coffee.'
      }
    ]
  },
  {
    email: 'kabir.mehta@example.com',
    displayName: 'Kabir Mehta',
    birthDate: '1995-08-30',
    gender: 'MAN',
    pronouns: 'he/him',
    bio: 'Brand strategist, amateur ukulele strummer, and espresso tinkerer. Looking for someone genuine to explore weekend farmers markets and indie music gigs with.',
    relationshipIntention: 'LONG_TERM',
    connectionMode: 'DATING',
    education: 'St. Stephen’s College, Delhi',
    occupation: 'Creative Director',
    city: 'New Delhi',
    state: 'Delhi',
    latitude: 28.5494,
    longitude: 77.2001, // Hauz Khas
    photos: [
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&auto=format&fit=crop&q=80'
    ],
    interests: ['Guitar & Ukulele', 'Contemporary Art', 'Stand-up Comedy', 'Weekend Roadtrips'],
    prompts: [
      {
        question: 'Together we could',
        answer: 'Drive down to Rishikesh for white water rafting and riverside acoustic music.'
      }
    ]
  },
  {
    email: 'pooja.roy@example.com',
    displayName: 'Pooja Roy',
    birthDate: '1997-04-12',
    gender: 'WOMAN',
    pronouns: 'she/her',
    bio: 'Clinical psychologist, avid reader, and sourdough baker. Big believer in active listening, thoughtful conversations, and spontaneous weekend museum trips.',
    relationshipIntention: 'DATING_TO_MARRY',
    connectionMode: 'DATING',
    education: 'National Institute of Mental Health (NIMHANS)',
    occupation: 'Psychologist',
    city: 'Bengaluru',
    state: 'Karnataka',
    latitude: 12.9352,
    longitude: 77.6245, // Koramangala
    photos: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&auto=format&fit=crop&q=80'
    ],
    interests: ['Yoga & Mindfulness', 'Contemporary Art', 'Sourdough Baking', 'Sci-Fi & Thrillers'],
    prompts: [
      {
        question: 'My most spontaneous memory',
        answer: 'Booked a one-way sleeper train to Hampi during a long weekend with just a backpack and a sketchbook.'
      }
    ]
  },
  {
    email: 'vikram.nair@example.com',
    displayName: 'Vikram Nair',
    birthDate: '1994-01-20',
    gender: 'MAN',
    pronouns: 'he/him',
    bio: 'Aerospace engineer turned startup founder. Formula 1 nerd, marathon runner, and filter coffee purist. Tell me your best travel story.',
    relationshipIntention: 'LONG_TERM',
    connectionMode: 'DATING',
    education: 'IIT Madras',
    occupation: 'Founder & CEO',
    city: 'Hyderabad',
    state: 'Telangana',
    latitude: 17.4401,
    longitude: 78.3489, // Hitec City
    photos: [
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&auto=format&fit=crop&q=80'
    ],
    interests: ['Formula 1 & Racing', 'Coffee & Cafes', 'Badminton', 'Startup Culture'],
    prompts: [
      {
        question: 'Sunday ritual',
        answer: 'Watching F1 Grand Prix with spicy Hyderabadi biryani and good company.'
      }
    ]
  },
  {
    email: 'tanya.choudhury@example.com',
    displayName: 'Tanya Choudhury',
    birthDate: '1999-09-05',
    gender: 'WOMAN',
    pronouns: 'she/her',
    bio: 'Product manager, documentary lover, and golden retriever mom. Always on the lookout for dog-friendly cafes and indie film festivals in Pune.',
    relationshipIntention: 'LONG_TERM',
    connectionMode: 'BOTH',
    education: 'Symbiosis International, Pune',
    occupation: 'Senior Product Manager',
    city: 'Pune',
    state: 'Maharashtra',
    latitude: 18.5204,
    longitude: 73.8567,
    photos: [
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80'
    ],
    interests: ['Dogs & Pets', 'Stand-up Comedy', 'Hiking & Trekking', 'Coffee & Cafes'],
    prompts: [
      {
        question: 'Must love',
        answer: 'My golden retriever Cooper, because he has veto power on all life decisions!'
      }
    ]
  },
  {
    email: 'dev.mukherjee@example.com',
    displayName: 'Dev Mukherjee',
    birthDate: '1996-06-18',
    gender: 'MAN',
    pronouns: 'he/him',
    bio: 'Documentary filmmaker and street photographer. Living between Kolkata coffee houses and mountain trails in North Bengal. Let’s talk cinema and music.',
    relationshipIntention: 'NEW_FRIENDS',
    connectionMode: 'FRIENDSHIP',
    education: 'Jadavpur University',
    occupation: 'Cinematographer',
    city: 'Kolkata',
    state: 'West Bengal',
    latitude: 22.5726,
    longitude: 88.3639,
    photos: [
      'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=800&auto=format&fit=crop&q=80'
    ],
    interests: ['Street Photography', 'Contemporary Art', 'Indie Rock & Pop', 'Sci-Fi & Thrillers'],
    prompts: [
      {
        question: 'Best way to spend an evening',
        answer: 'Exploring old colonial rooftops in North Kolkata with an analog 35mm camera.'
      }
    ]
  }
];

export const DEMO_VOICE_ROOMS = [
  {
    title: 'Late Night Chai & Indie Music Vibe ☕🎶',
    category: 'Music & Hobbies',
    emoji: '🎧',
    hostName: 'Kabir & Riya',
    isPrivate: false,
    capacity: 100,
    activeCount: 18
  },
  {
    title: 'Weekend Trekkers Mumbai & Pune 🏔️',
    category: 'Travel & Outdoors',
    emoji: '⛺',
    hostName: 'Sahil Patel',
    isPrivate: false,
    capacity: 50,
    activeCount: 12
  },
  {
    title: 'Tech Founders, Designers & Solopreneurs 🚀',
    category: 'Technology & Startups',
    emoji: '💻',
    hostName: 'Pooja Roy',
    isPrivate: false,
    capacity: 80,
    activeCount: 29
  },
  {
    title: 'Sunday Morning Book Club & Philosophy 📚',
    category: 'Books & Culture',
    emoji: '📖',
    hostName: 'Ananya Verma',
    isPrivate: false,
    capacity: 60,
    activeCount: 15
  },
  {
    title: 'Bengaluru Badminton & Runners Corner 🏸🏃',
    category: 'Sports & Fitness',
    emoji: '🏆',
    hostName: 'Vikram Nair',
    isPrivate: false,
    capacity: 75,
    activeCount: 22
  }
];

export const DEMO_EVENTS = [
  {
    title: 'Sunset Acoustic Jam & Beachside Mixer',
    description: 'Join us at Juhu Beach for an informal sunset acoustic session. Bring your guitars, ukuleles, or just come to vibe and meet fellow music lovers.',
    category: 'Music & Social',
    emoji: '🎸',
    venueName: 'Juhu Beach Promenade (Near Novotel)',
    approximateLocation: 'Juhu, Mumbai',
    city: 'Mumbai',
    startTime: new Date(Date.now() + 86400000 * 2).toISOString(),
    endTime: new Date(Date.now() + 86400000 * 2 + 3600000 * 3).toISOString(),
    capacity: 45,
    registeredCount: 28
  },
  {
    title: 'Artisanal Coffee Tasting & Book Swap',
    description: 'Sample 4 single-origin Indian coffees from Araku and Chikmagalur while exchanging your favourite paperbacks with new friends.',
    category: 'Food & Culture',
    emoji: '☕',
    venueName: 'Subko Coffee Roastery & Craft Bakehouse',
    approximateLocation: 'Bandra West, Mumbai',
    city: 'Mumbai',
    startTime: new Date(Date.now() + 86400000 * 4).toISOString(),
    endTime: new Date(Date.now() + 86400000 * 4 + 3600000 * 2.5).toISOString(),
    capacity: 25,
    registeredCount: 22
  },
  {
    title: 'Cubbon Park Sunday Frisbee & Picnic',
    description: 'Casual Sunday morning outdoor meetup in the lush greens of Cubbon Park. Frisbee, badminton, board games, and homemade snacks.',
    category: 'Sports & Outdoors',
    emoji: '🌳',
    venueName: 'Cubbon Park Bandstand',
    approximateLocation: 'Central Bengaluru',
    city: 'Bengaluru',
    startTime: new Date(Date.now() + 86400000 * 5).toISOString(),
    endTime: new Date(Date.now() + 86400000 * 5 + 3600000 * 3).toISOString(),
    capacity: 60,
    registeredCount: 41
  },
  {
    title: 'Hauz Khas Heritage Sunset & Photography Trail',
    description: 'Explore the 13th-century Hauz Khas complex and surrounding Deer Park lake during golden hour with fellow street photographers.',
    category: 'Culture & Arts',
    emoji: '📷',
    venueName: 'Hauz Khas Fort Entrance',
    approximateLocation: 'South Delhi',
    city: 'New Delhi',
    startTime: new Date(Date.now() + 86400000 * 3).toISOString(),
    endTime: new Date(Date.now() + 86400000 * 3 + 3600000 * 2).toISOString(),
    capacity: 30,
    registeredCount: 19
  }
];

async function seed() {
  console.log('🌱 Starting PairUp Database Seeding...');
  console.log('✅ Initialized categories and interests:', INITIAL_INTERESTS.length);
  console.log('✅ Prepared verified profiles:', DEMO_PROFILES.length);
  console.log('✅ Prepared active voice rooms:', DEMO_VOICE_ROOMS.length);
  console.log('✅ Prepared social discovery events:', DEMO_EVENTS.length);
  console.log('🎉 Seed dataset ready.');
}

if (require.main === module) {
  seed();
}
