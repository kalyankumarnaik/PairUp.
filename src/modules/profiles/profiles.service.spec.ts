import { Test, TestingModule } from '@nestjs/testing';
import { Gender, HabitFrequency, RelationshipIntent, SexualOrientation, VisibilityLevel } from '@prisma/client';
import { ProfilesService } from './profiles.service';
import { PrismaService } from '../../prisma/prisma.service';
import { DomainException } from '../../common/exceptions/domain.exception';

describe('ProfilesService', () => {
  let service: ProfilesService;
  let prisma: any;

  const mockProfile = {
    id: 'profile-1',
    userId: 'user-1',
    displayName: 'Alex Rivera',
    birthDate: new Date('1996-05-14'), // ~30 years old
    gender: Gender.FEMALE,
    sexualOrientation: SexualOrientation.HETEROSEXUAL,
    bio: 'Product Designer who loves hiking and coffee.',
    occupation: 'Product Designer',
    education: 'RISD',
    heightCm: 168,
    drinkingHabit: HabitFrequency.SOCIALLY,
    smokingHabit: HabitFrequency.NEVER,
    workoutHabit: HabitFrequency.REGULARLY,
    relationshipIntent: RelationshipIntent.LONG_TERM,
    latitude: 37.7749,
    longitude: -122.4194,
    city: 'San Francisco',
    country: 'United States',
    completionScore: 90,
    isProfileComplete: true,
    photos: [
      {
        id: 'photo-1',
        url: 'https://images.example.com/1.jpg',
        thumbnailUrl: null,
        displayOrder: 0,
        isPrimary: true,
        status: 'APPROVED',
      },
      {
        id: 'photo-2',
        url: 'https://images.example.com/2.jpg',
        thumbnailUrl: null,
        displayOrder: 1,
        isPrimary: false,
        status: 'APPROVED',
      },
    ],
    interests: [
      { interest: { id: 'int-1', name: 'Hiking', category: 'Sports', icon: 'mountain' } },
      { interest: { id: 'int-2', name: 'Coffee', category: 'Food', icon: 'coffee' } },
      { interest: { id: 'int-3', name: 'Art', category: 'Creativity', icon: 'palette' } },
    ],
    prompts: [
      {
        id: 'prompt-1',
        promptQuestion: 'Together we could...',
        promptAnswer: 'Explore national parks.',
        displayOrder: 0,
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    prisma = {
      profile: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      profilePhoto: {
        create: jest.fn(),
        delete: jest.fn(),
        update: jest.fn(),
        updateMany: jest.fn(),
      },
      profilePrompt: {
        deleteMany: jest.fn(),
        createMany: jest.fn(),
      },
      profileInterest: {
        deleteMany: jest.fn(),
        createMany: jest.fn(),
      },
      interest: {
        findMany: jest.fn(),
      },
      userBlock: {
        findFirst: jest.fn(),
      },
      user: {
        findUnique: jest.fn(),
      },
      match: {
        findUnique: jest.fn(),
      },
      $transaction: jest.fn(async (arg) => {
        if (typeof arg === 'function') {
          return arg(prisma);
        }
        return Promise.all(arg);
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfilesService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<ProfilesService>(ProfilesService);
  });

  describe('createProfile', () => {
    it('should reject under-age users (under 18)', async () => {
      prisma.profile.findUnique.mockResolvedValue(null);

      const recentDate = new Date();
      recentDate.setFullYear(recentDate.getFullYear() - 16); // 16 years old

      await expect(
        service.createProfile('user-1', {
          displayName: 'Minor User',
          birthDate: recentDate,
          gender: Gender.MALE,
          sexualOrientation: SexualOrientation.HETEROSEXUAL,
        }),
      ).rejects.toThrow(DomainException);
    });

    it('should create profile for eligible 18+ user', async () => {
      prisma.profile.findUnique.mockResolvedValueOnce(null).mockResolvedValueOnce(mockProfile);
      prisma.profile.create.mockResolvedValue(mockProfile);
      prisma.profile.update.mockResolvedValue(mockProfile);

      const result = await service.createProfile('user-1', {
        displayName: 'Alex Rivera',
        birthDate: new Date('1996-05-14'),
        gender: Gender.FEMALE,
        sexualOrientation: SexualOrientation.HETEROSEXUAL,
      });

      expect(result.displayName).toBe('Alex Rivera');
      expect(result.age).toBeGreaterThanOrEqual(18);
    });
  });

  describe('getPublicProfile', () => {
    it('should throw DomainException if users have blocked each other', async () => {
      prisma.userBlock.findFirst.mockResolvedValue({ id: 'block-1' });

      await expect(
        service.getPublicProfile('target-user-2', 'requester-user-1'),
      ).rejects.toThrow(DomainException);
    });

    it('should return public profile without private account details', async () => {
      prisma.userBlock.findFirst.mockResolvedValue(null);
      prisma.user.findUnique.mockResolvedValue({
        id: 'target-user-2',
        status: 'ACTIVE',
        profile: mockProfile,
        privacySetting: {
          visibility: VisibilityLevel.PUBLIC,
          showAge: true,
          showDistance: true,
        },
      });

      const publicProfile = await service.getPublicProfile('target-user-2', 'requester-user-1');

      expect(publicProfile.displayName).toBe('Alex Rivera');
      expect(publicProfile.age).toBeDefined();
      expect((publicProfile as any).email).toBeUndefined(); // Private field must never leak
    });
  });

  describe('addPhoto', () => {
    it('should enforce maximum photo limit of 6', async () => {
      prisma.profile.findUnique.mockResolvedValue({
        ...mockProfile,
        photos: new Array(6).fill({ id: 'photo-x' }),
      });

      await expect(
        service.addPhoto('user-1', { url: 'https://images.example.com/7.jpg' }),
      ).rejects.toThrow(DomainException);
    });
  });
});
