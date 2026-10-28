import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Gender,
  HabitFrequency,
  RelationshipIntent,
  SexualOrientation,
  VisibilityLevel,
} from '@prisma/client';

export class PhotoResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  url: string;

  @ApiPropertyOptional()
  thumbnailUrl?: string | null;

  @ApiProperty()
  displayOrder: number;

  @ApiProperty()
  isPrimary: boolean;
}

export class InterestResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  category: string;

  @ApiPropertyOptional()
  icon?: string | null;
}

export class PromptResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  promptQuestion: string;

  @ApiProperty()
  promptAnswer: string;

  @ApiProperty()
  displayOrder: number;
}

export class ProfileCompletionDto {
  @ApiProperty({ example: 85, description: 'Percentage completion (0-100)' })
  score: number;

  @ApiProperty({ example: true })
  isComplete: boolean;

  @ApiProperty({ example: ['Add at least 2 more photos', 'Select your workout habit'] })
  missingItems: string[];
}

export class ProfileResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  displayName: string;

  @ApiProperty()
  birthDate: Date;

  @ApiProperty()
  age: number;

  @ApiProperty({ enum: Gender })
  gender: Gender;

  @ApiProperty({ enum: SexualOrientation })
  sexualOrientation: SexualOrientation;

  @ApiPropertyOptional()
  bio?: string | null;

  @ApiPropertyOptional()
  occupation?: string | null;

  @ApiPropertyOptional()
  education?: string | null;

  @ApiPropertyOptional()
  heightCm?: number | null;

  @ApiPropertyOptional({ enum: HabitFrequency })
  drinkingHabit?: HabitFrequency | null;

  @ApiPropertyOptional({ enum: HabitFrequency })
  smokingHabit?: HabitFrequency | null;

  @ApiPropertyOptional({ enum: HabitFrequency })
  workoutHabit?: HabitFrequency | null;

  @ApiProperty({ enum: RelationshipIntent })
  relationshipIntent: RelationshipIntent;

  @ApiPropertyOptional()
  latitude?: number | null;

  @ApiPropertyOptional()
  longitude?: number | null;

  @ApiPropertyOptional()
  city?: string | null;

  @ApiPropertyOptional()
  country?: string | null;

  @ApiProperty({ type: [PhotoResponseDto] })
  photos: PhotoResponseDto[];

  @ApiProperty({ type: [InterestResponseDto] })
  interests: InterestResponseDto[];

  @ApiProperty({ type: [PromptResponseDto] })
  prompts: PromptResponseDto[];

  @ApiProperty({ type: ProfileCompletionDto })
  completion: ProfileCompletionDto;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class PublicProfileResponseDto {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  displayName: string;

  @ApiPropertyOptional({ description: 'Age in years (null if hidden by privacy setting)' })
  age?: number | null;

  @ApiProperty({ enum: Gender })
  gender: Gender;

  @ApiProperty({ enum: SexualOrientation })
  sexualOrientation: SexualOrientation;

  @ApiPropertyOptional()
  bio?: string | null;

  @ApiPropertyOptional()
  occupation?: string | null;

  @ApiPropertyOptional()
  education?: string | null;

  @ApiPropertyOptional()
  heightCm?: number | null;

  @ApiPropertyOptional({ enum: HabitFrequency })
  drinkingHabit?: HabitFrequency | null;

  @ApiPropertyOptional({ enum: HabitFrequency })
  smokingHabit?: HabitFrequency | null;

  @ApiPropertyOptional({ enum: HabitFrequency })
  workoutHabit?: HabitFrequency | null;

  @ApiProperty({ enum: RelationshipIntent })
  relationshipIntent: RelationshipIntent;

  @ApiPropertyOptional()
  city?: string | null;

  @ApiPropertyOptional({ description: 'Calculated distance in km (null if hidden by privacy setting)' })
  distanceKm?: number | null;

  @ApiProperty({ type: [PhotoResponseDto] })
  photos: PhotoResponseDto[];

  @ApiProperty({ type: [InterestResponseDto] })
  interests: InterestResponseDto[];

  @ApiProperty({ type: [PromptResponseDto] })
  prompts: PromptResponseDto[];
}

export class DatingPreferenceResponseDto {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  minAge: number;

  @ApiProperty()
  maxAge: number;

  @ApiProperty({ enum: Gender, isArray: true })
  genderPreferences: Gender[];

  @ApiProperty()
  maxDistanceKm: number;

  @ApiProperty({ enum: RelationshipIntent, isArray: true })
  intentPreferences: RelationshipIntent[];

  @ApiProperty()
  globalDiscovery: boolean;
}

export class PrivacySettingResponseDto {
  @ApiProperty()
  userId: string;

  @ApiProperty({ enum: VisibilityLevel })
  visibility: VisibilityLevel;

  @ApiProperty()
  showDistance: boolean;

  @ApiProperty()
  showOnlineStatus: boolean;

  @ApiProperty()
  showReadReceipts: boolean;

  @ApiProperty()
  showAge: boolean;
}
