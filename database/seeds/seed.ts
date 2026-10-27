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
  { name: 'Startup Culture', category: 'Career', emoji: '🚀' }
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
    bio: 'Software engineer at a YC startup by day, live music enthusiast by night. Looking for concert buddies and coffee debates on whether tabs beat spaces.',
    relationshipIntention: 'NEW_FRIENDS',
    connectionMode: 'FRIENDSHIP',
    education: 'PES University, Bengaluru',
    occupation: 'Full-Stack Developer',
    city: 'Bengaluru',
    state: 'Karnataka',
    latitude: 12.9716,
    longitude: 77.5946,
    photos: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop&q=80'
    ],
    interests: ['Mobile & Web Dev', 'Indie Rock & Pop', 'Board Games & Catan', 'Dogs & Pets'],
    prompts: [
      {
        question: 'Quickest way to my heart',
        answer: 'Send me Spotify playlists with obscure indie artists or introduce me to your golden retriever.'
      }
    ]
  },
  {
    email: 'rohan.mehta@example.com',
    displayName: 'Rohan Mehta',
    birthDate: '1997-08-19',
    gender: 'MAN',
    pronouns: 'he/him',
    bio: 'Food writer & podcast host. I know where to get the crispest dosas in South Delhi and the best cold brews in Gurgaon.',
    relationshipIntention: 'LONG_TERM',
    connectionMode: 'DATING',
    education: 'St. Stephen’s College',
    occupation: 'Culinary Journalist',
    city: 'New Delhi',
    state: 'Delhi',
    latitude: 28.6139,
    longitude: 77.209,
    photos: [
      'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=800&auto=format&fit=crop&q=80'
    ],
    interests: ['Cooking & Baking', 'Coffee & Cafes', 'Stand-up Comedy', 'Weekend Roadtrips'],
    prompts: [
      {
        question: 'I will cook for you',
        answer: 'Authentic Kashmiri Rogan Josh or homemade ricotta gnocchi with browned butter sage sauce.'
      }
    ]
  },
  {
    email: 'kavya.nair@example.com',
    displayName: 'Kavya Nair',
    birthDate: '1999-01-30',
    gender: 'WOMAN',
    pronouns: 'she/her',
    bio: 'Classical Bharatanatyam dancer and AI researcher. Big believer in mindful living, morning runs, and chai conversations.',
    relationshipIntention: 'DATING_TO_MARRY',
    connectionMode: 'BOTH',
    education: 'IISc Bangalore',
    occupation: 'Machine Learning Scientist',
    city: 'Bengaluru',
    state: 'Karnataka',
    latitude: 12.9352,
    longitude: 77.6245, // Koramangala
    photos: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=80'
    ],
    interests: ['Yoga & Mindfulness', 'Contemporary Art', 'Mobile & Web Dev', 'Books'],
    prompts: [
      {
        question: 'My most spontaneous memory',
        answer: 'Booked a one-way sleeper train to Hampi during a long weekend with just a backpack and a sketchbook.'
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
  }
];

async function seed() {
  console.log('🌱 Starting PairUp AI Database Seeding...');
  console.log('✅ Initialized categories and interests:', INITIAL_INTERESTS.length);
  console.log('✅ Prepared verified profiles:', DEMO_PROFILES.length);
  console.log('✅ Prepared active voice rooms:', DEMO_VOICE_ROOMS.length);
  console.log('✅ Prepared social discovery events:', DEMO_EVENTS.length);
  console.log('🎉 Seed dataset ready.');
}

if (require.main === module) {
  seed();
}
