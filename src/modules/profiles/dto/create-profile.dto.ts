import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { Gender, HabitFrequency, RelationshipIntent, SexualOrientation } from '@prisma/client';

export class CreateProfileDto {
  @ApiProperty({ example: 'Alex Rivera' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  displayName: string;

  @ApiProperty({ example: '1996-05-14T00:00:00.000Z', description: 'ISO date string. Must be 18+ years old' })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  birthDate: Date;

  @ApiProperty({ enum: Gender, example: Gender.FEMALE })
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({ enum: SexualOrientation, example: SexualOrientation.HETEROSEXUAL })
  @IsEnum(SexualOrientation)
  sexualOrientation: SexualOrientation;

  @ApiPropertyOptional({ example: 'Product Designer who loves espresso, hiking, and indie concerts.' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  bio?: string;

  @ApiPropertyOptional({ example: 'Product Designer' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  occupation?: string;

  @ApiPropertyOptional({ example: 'Rhode Island School of Design' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  education?: string;

  @ApiPropertyOptional({ example: 168, description: 'Height in centimeters' })
  @IsOptional()
  @IsInt()
  @Min(100)
  @Max(250)
  heightCm?: number;

  @ApiPropertyOptional({ enum: HabitFrequency })
  @IsOptional()
  @IsEnum(HabitFrequency)
  drinkingHabit?: HabitFrequency;

  @ApiPropertyOptional({ enum: HabitFrequency })
  @IsOptional()
  @IsEnum(HabitFrequency)
  smokingHabit?: HabitFrequency;

  @ApiPropertyOptional({ enum: HabitFrequency })
  @IsOptional()
  @IsEnum(HabitFrequency)
  workoutHabit?: HabitFrequency;

  @ApiPropertyOptional({ enum: RelationshipIntent, default: RelationshipIntent.LONG_TERM })
  @IsOptional()
  @IsEnum(RelationshipIntent)
  relationshipIntent?: RelationshipIntent;

  @ApiPropertyOptional({ example: 37.7749 })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiPropertyOptional({ example: -122.4194 })
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @ApiPropertyOptional({ example: 'San Francisco' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ example: 'United States' })
  @IsOptional()
  @IsString()
  country?: string;
}

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'Alex Rivera' })
  @IsOptional()
  @IsString()
  @MaxLength(60)
  displayName?: string;

  @ApiPropertyOptional({ enum: SexualOrientation })
  @IsOptional()
  @IsEnum(SexualOrientation)
  sexualOrientation?: SexualOrientation;

  @ApiPropertyOptional({ example: 'Product Designer who loves espresso, hiking, and indie concerts.' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  bio?: string;

  @ApiPropertyOptional({ example: 'Senior Product Designer' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  occupation?: string;

  @ApiPropertyOptional({ example: 'RISD' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  education?: string;

  @ApiPropertyOptional({ example: 168 })
  @IsOptional()
  @IsInt()
  @Min(100)
  @Max(250)
  heightCm?: number;

  @ApiPropertyOptional({ enum: HabitFrequency })
  @IsOptional()
  @IsEnum(HabitFrequency)
  drinkingHabit?: HabitFrequency;

  @ApiPropertyOptional({ enum: HabitFrequency })
  @IsOptional()
  @IsEnum(HabitFrequency)
  smokingHabit?: HabitFrequency;

  @ApiPropertyOptional({ enum: HabitFrequency })
  @IsOptional()
  @IsEnum(HabitFrequency)
  workoutHabit?: HabitFrequency;

  @ApiPropertyOptional({ enum: RelationshipIntent })
  @IsOptional()
  @IsEnum(RelationshipIntent)
  relationshipIntent?: RelationshipIntent;

  @ApiPropertyOptional({ example: 37.7749 })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiPropertyOptional({ example: -122.4194 })
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @ApiPropertyOptional({ example: 'San Francisco' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ example: 'United States' })
  @IsOptional()
  @IsString()
  country?: string;
}
