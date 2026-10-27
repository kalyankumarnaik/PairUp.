import {
  PrismaClient,
  AccountStatus,
  UserRole,
  Gender,
  SexualOrientation,
  RelationshipIntent,
  HabitFrequency,
  PhotoStatus,
  VisibilityLevel,
  LikeType,
  MatchStatus,
  MatchEventType,
  AuditActionType,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding for PairUp Core Backend...');

  // Clean existing records in reverse dependency order
  await prisma.auditLog.deleteMany({});
  await prisma.accountStatusHistory.deleteMany({});
  await prisma.userBlock.deleteMany({});
  await prisma.matchEvent.deleteMany({});
  await prisma.match.deleteMany({});
  await prisma.userPass.deleteMany({});
  await prisma.userLike.deleteMany({});
  await prisma.notificationPreference.deleteMany({});
  await prisma.privacySetting.deleteMany({});
  await prisma.datingPreference.deleteMany({});
  await prisma.profilePrompt.deleteMany({});
  await prisma.profileInterest.deleteMany({});
  await prisma.interest.deleteMany({});
  await prisma.profilePhoto.deleteMany({});
  await prisma.profile.deleteMany({});
  await prisma.verificationToken.deleteMany({});
  await prisma.userSession.deleteMany({});
  await prisma.userCredential.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('🧹 Existing database records purged.');

  // 1. Seed Interests Taxonomy
  const interestsData = [
    { name: 'Photography', category: 'Creativity', icon: 'camera' },
    { name: 'Travel & Backpacking', category: 'Lifestyle', icon: 'plane' },
    { name: 'Coffee & Cafes', category: 'Food & Drink', icon: 'coffee' },
    { name: 'Hiking & Outdoors', category: 'Sports', icon: 'mountain' },
    { name: 'Live Music & Concerts', category: 'Entertainment', icon: 'music' },
    { name: 'Cooking & Baking', category: 'Food & Drink', icon: 'chef-hat' },
    { name: 'Reading & Literature', category: 'Creativity', icon: 'book' },
    { name: 'Yoga & Mindfulness', category: 'Wellness', icon: 'heart' },
    { name: 'Sci-Fi & Gaming', category: 'Entertainment', icon: 'gamepad' },
    { name: 'Art & Museums', category: 'Creativity', icon: 'palette' },
    { name: 'Fitness & Gym', category: 'Sports', icon: 'dumbbell' },
    { name: 'Startups & Tech', category: 'Career', icon: 'code' },
    { name: 'Wine Tasting', category: 'Food & Drink', icon: 'wine' },
    { name: 'Dog Lover', category: 'Pets', icon: 'dog' },
    { name: 'Board Games', category: 'Entertainment', icon: 'dice' },
  ];

  const createdInterests: Record<string, string> = {};
  for (const item of interestsData) {
    const interest = await prisma.interest.create({ data: item });
    createdInterests[interest.name] = interest.id;
  }
  console.log(`✅ Seeded ${Object.keys(createdInterests).length} interests.`);

  // Default hashed password for all seed test accounts: "Password123!"
  const salt = await bcrypt.genSalt(10);
  const commonPasswordHash = await bcrypt.hash('Password123!', salt);

  // 2. Define Seed Users with rich profiles
  const seedUsers = [
    {
      email: 'alex.rivera@example.com',
      role: UserRole.USER,
      status: AccountStatus.ACTIVE,
      isEmailVerified: true,
      profile: {
        displayName: 'Alex Rivera',
        birthDate: new Date('1996-05-14'), // 29-30 years old
        gender: Gender.FEMALE,
        sexualOrientation: SexualOrientation.HETEROSEXUAL,
        bio: 'Product Designer in the city. Always down for spontaneous weekend hikes, pour-over coffee, and indie concerts.',
        occupation: 'Product Designer',
        education: 'B.Des, Rhode Island School of Design',
        heightCm: 168,
        drinkingHabit: HabitFrequency.SOCIALLY,
        smokingHabit: HabitFrequency.NEVER,
        workoutHabit: HabitFrequency.REGULARLY,
        relationshipIntent: RelationshipIntent.LONG_TERM,
        latitude: 37.7749,
        longitude: -122.4194, // San Francisco
        city: 'San Francisco',
        country: 'United States',
        completionScore: 95,
        isProfileComplete: true,
        photos: [
          { url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb', displayOrder: 0, isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9', displayOrder: 1, isPrimary: false },
        ],
        interests: ['Coffee & Cafes', 'Hiking & Outdoors', 'Photography', 'Art & Museums'],
        prompts: [
          { promptQuestion: 'A life goal of mine is...', promptAnswer: 'To design a solar-powered tiny cabin in the Pacific Northwest.' },
          { promptQuestion: 'The key to my heart is...', promptAnswer: 'Finding an amazing hole-in-the-wall taco spot.' },
        ],
      },
      preferences: {
        minAge: 26,
        maxAge: 36,
        genderPreferences: [Gender.MALE],
        maxDistanceKm: 40,
        intentPreferences: [RelationshipIntent.LONG_TERM, RelationshipIntent.LONG_TERM_OPEN_TO_SHORT],
      },
    },
    {
      email: 'liam.chen@example.com',
      role: UserRole.USER,
      status: AccountStatus.ACTIVE,
      isEmailVerified: true,
      profile: {
        displayName: 'Liam Chen',
        birthDate: new Date('1994-11-20'), // ~31 years old
        gender: Gender.MALE,
        sexualOrientation: SexualOrientation.HETEROSEXUAL,
        bio: 'Backend architect who loves rock climbing, sourdough baking, and sci-fi books. Looking for my partner in crime.',
        occupation: 'Software Architect',
        education: 'M.S. in Computer Science, UC Berkeley',
        heightCm: 182,
        drinkingHabit: HabitFrequency.SOCIALLY,
        smokingHabit: HabitFrequency.NEVER,
        workoutHabit: HabitFrequency.REGULARLY,
        relationshipIntent: RelationshipIntent.LONG_TERM,
        latitude: 37.7833,
        longitude: -122.4167, // SF Downtown
        city: 'San Francisco',
        country: 'United States',
        completionScore: 100,
        isProfileComplete: true,
        photos: [
          { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d', displayOrder: 0, isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e', displayOrder: 1, isPrimary: false },
        ],
        interests: ['Hiking & Outdoors', 'Startups & Tech', 'Cooking & Baking', 'Coffee & Cafes'],
        prompts: [
          { promptQuestion: 'Together we could...', promptAnswer: 'Plan our next road trip along Highway 1 and debate the best playlists.' },
          { promptQuestion: 'Two truths and a lie...', promptAnswer: 'I bake sourdough weekly, I climbed El Capitan, I have never seen Star Wars.' },
        ],
      },
      preferences: {
        minAge: 24,
        maxAge: 34,
        genderPreferences: [Gender.FEMALE],
        maxDistanceKm: 50,
        intentPreferences: [RelationshipIntent.LONG_TERM],
      },
    },
    {
      email: 'sophia.taylor@example.com',
      role: UserRole.USER,
      status: AccountStatus.ACTIVE,
      isEmailVerified: true,
      profile: {
        displayName: 'Sophia Taylor',
        birthDate: new Date('1998-03-08'),
        gender: Gender.FEMALE,
        sexualOrientation: SexualOrientation.BISEXUAL,
        bio: 'Veterinary medicine resident & weekend pottery enthusiast. My golden retriever named Barnaby will judge you (lovingly).',
        occupation: 'Veterinary Resident',
        education: 'DVM, UC Davis',
        heightCm: 165,
        drinkingHabit: HabitFrequency.SOCIALLY,
        smokingHabit: HabitFrequency.NEVER,
        workoutHabit: HabitFrequency.SOCIALLY,
        relationshipIntent: RelationshipIntent.LONG_TERM_OPEN_TO_SHORT,
        latitude: 37.7699,
        longitude: -122.4469, // The Haight / SF
        city: 'San Francisco',
        country: 'United States',
        completionScore: 92,
        isProfileComplete: true,
        photos: [
          { url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330', displayOrder: 0, isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1', displayOrder: 1, isPrimary: false },
        ],
        interests: ['Dog Lover', 'Art & Museums', 'Reading & Literature', 'Yoga & Mindfulness'],
        prompts: [
          { promptQuestion: 'The fastest way to my heart is...', promptAnswer: 'Being nice to dogs and making me laugh when I am stressed.' },
        ],
      },
      preferences: {
        minAge: 24,
        maxAge: 35,
        genderPreferences: [Gender.MALE, Gender.FEMALE],
        maxDistanceKm: 30,
        intentPreferences: [RelationshipIntent.LONG_TERM, RelationshipIntent.LONG_TERM_OPEN_TO_SHORT],
      },
    },
    {
      email: 'marcus.vance@example.com',
      role: UserRole.USER,
      status: AccountStatus.ACTIVE,
      isEmailVerified: true,
      profile: {
        displayName: 'Marcus Vance',
        birthDate: new Date('1992-08-15'),
        gender: Gender.MALE,
        sexualOrientation: SexualOrientation.HETEROSEXUAL,
        bio: 'Landscape architect by day, amateur chef by night. Looking for someone genuine to explore local farmer markets with.',
        occupation: 'Landscape Architect',
        education: 'B.Arch, Cal Poly',
        heightCm: 178,
        drinkingHabit: HabitFrequency.SOCIALLY,
        smokingHabit: HabitFrequency.NEVER,
        workoutHabit: HabitFrequency.REGULARLY,
        relationshipIntent: RelationshipIntent.LONG_TERM,
        latitude: 37.8044,
        longitude: -122.2711, // Oakland
        city: 'Oakland',
        country: 'United States',
        completionScore: 88,
        isProfileComplete: true,
        photos: [
          { url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d', displayOrder: 0, isPrimary: true },
        ],
        interests: ['Cooking & Baking', 'Wine Tasting', 'Hiking & Outdoors', 'Photography'],
        prompts: [
          { promptQuestion: 'My favorite Sunday looks like...', promptAnswer: 'Fresh sourdough, hot coffee, and a 5-mile trail run.' },
        ],
      },
      preferences: {
        minAge: 25,
        maxAge: 35,
        genderPreferences: [Gender.FEMALE],
        maxDistanceKm: 35,
        intentPreferences: [RelationshipIntent.LONG_TERM],
      },
    },
    {
      email: 'admin@pairup.internal',
      role: UserRole.ADMIN,
      status: AccountStatus.ACTIVE,
      isEmailVerified: true,
      profile: {
        displayName: 'PairUp Admin',
        birthDate: new Date('1990-01-01'),
        gender: Gender.OTHER,
        sexualOrientation: SexualOrientation.QUEER,
        bio: 'PairUp System Administrator & Safety Guardian.',
        occupation: 'Platform Engineer',
        city: 'San Francisco',
        country: 'United States',
        completionScore: 70,
        isProfileComplete: true,
        photos: [
          { url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde', displayOrder: 0, isPrimary: true },
        ],
        interests: ['Startups & Tech'],
        prompts: [],
      },
      preferences: {
        minAge: 18,
        maxAge: 99,
        genderPreferences: [Gender.MALE, Gender.FEMALE, Gender.NON_BINARY, Gender.OTHER],
        maxDistanceKm: 100,
        intentPreferences: [RelationshipIntent.LONG_TERM],
      },
    },
  ];

  const userRecordMap: Record<string, string> = {};

  for (const u of seedUsers) {
    const user = await prisma.user.create({
      data: {
        email: u.email,
        role: u.role,
        status: u.status,
        isEmailVerified: u.isEmailVerified,
        credential: {
          create: {
            passwordHash: commonPasswordHash,
          },
        },
        privacySetting: {
          create: {
            visibility: VisibilityLevel.PUBLIC,
            showDistance: true,
            showOnlineStatus: true,
            showReadReceipts: true,
            showAge: true,
          },
        },
        notificationPreference: {
          create: {
            emailOnMatch: true,
            emailOnMessage: true,
            pushOnMatch: true,
            pushOnMessage: true,
            pushOnLike: false,
          },
        },
        datingPreference: {
          create: {
            minAge: u.preferences.minAge,
            maxAge: u.preferences.maxAge,
            genderPreferences: u.preferences.genderPreferences,
            maxDistanceKm: u.preferences.maxDistanceKm,
            intentPreferences: u.preferences.intentPreferences,
          },
        },
        profile: {
          create: {
            displayName: u.profile.displayName,
            birthDate: u.profile.birthDate,
            gender: u.profile.gender,
            sexualOrientation: u.profile.sexualOrientation,
            bio: u.profile.bio,
            occupation: u.profile.occupation,
            education: u.profile.education,
            heightCm: u.profile.heightCm,
            drinkingHabit: u.profile.drinkingHabit,
            smokingHabit: u.profile.smokingHabit,
            workoutHabit: u.profile.workoutHabit,
            relationshipIntent: u.profile.relationshipIntent,
            latitude: u.profile.latitude,
            longitude: u.profile.longitude,
            city: u.profile.city,
            country: u.profile.country,
            completionScore: u.profile.completionScore,
            isProfileComplete: u.profile.isProfileComplete,
            photos: {
              create: u.profile.photos.map((p) => ({
                url: p.url,
                displayOrder: p.displayOrder,
                isPrimary: p.isPrimary,
                status: PhotoStatus.APPROVED,
              })),
            },
            prompts: {
              create: u.profile.prompts.map((p, idx) => ({
                promptQuestion: p.promptQuestion,
                promptAnswer: p.promptAnswer,
                displayOrder: idx,
              })),
            },
          },
        },
      },
      include: {
        profile: true,
      },
    });

    userRecordMap[u.email] = user.id;

    // Connect interests
    if (u.profile.interests && u.profile.interests.length > 0 && user.profile) {
      for (const interestName of u.profile.interests) {
        const interestId = createdInterests[interestName];
        if (interestId) {
          await prisma.profileInterest.create({
            data: {
              profileId: user.profile.id,
              interestId,
            },
          });
        }
      }
    }
  }

  console.log(`✅ Seeded ${seedUsers.length} users with credentials, profiles and preferences.`);

  // 3. Seed Mutual Likes & Create a Canonical Match between Alex and Liam
  const alexId = userRecordMap['alex.rivera@example.com'];
  const liamId = userRecordMap['liam.chen@example.com'];
  const sophiaId = userRecordMap['sophia.taylor@example.com'];
  const marcusId = userRecordMap['marcus.vance@example.com'];

  // Alex likes Liam
  await prisma.userLike.create({
    data: {
      fromUserId: alexId,
      toUserId: liamId,
      type: LikeType.STANDARD,
    },
  });

  // Liam likes Alex -> mutual like!
  await prisma.userLike.create({
    data: {
      fromUserId: liamId,
      toUserId: alexId,
      type: LikeType.SUPERLIKE,
    },
  });

  // Canonical ordering: userOneId < userTwoId
  const [userOneId, userTwoId] = [alexId, liamId].sort();
  const match = await prisma.match.create({
    data: {
      userOneId,
      userTwoId,
      status: MatchStatus.ACTIVE,
      events: {
        create: {
          eventType: MatchEventType.SUPERMATCH,
          triggeredById: liamId,
          metadata: { note: 'Matched via mutual likes with Superlike' },
        },
      },
    },
  });
  console.log(`❤️ Seeded mutual match between Alex and Liam (Match ID: ${match.id})`);

  // Sophia liked Liam (pending reciprocal like)
  await prisma.userLike.create({
    data: {
      fromUserId: sophiaId,
      toUserId: liamId,
      type: LikeType.STANDARD,
    },
  });

  // Liam passed on Marcus (discovery pass)
  await prisma.userPass.create({
    data: {
      fromUserId: liamId,
      toUserId: marcusId,
    },
  });

  // Audit Log seed
  await prisma.auditLog.create({
    data: {
      userId: alexId,
      action: AuditActionType.LOGIN_SUCCESS,
      ipAddress: '127.0.0.1',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      details: { client: 'PairUp iOS App v1.0.0' },
    },
  });

  console.log('🎉 Seeding successfully completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
