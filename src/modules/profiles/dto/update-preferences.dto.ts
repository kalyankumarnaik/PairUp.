import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  Max,
  Min,
} from 'class-validator';
import { Gender, RelationshipIntent, VisibilityLevel } from '@prisma/client';

export class UpdatePreferencesDto {
  @ApiPropertyOptional({ example: 21, minimum: 18, maximum: 100 })
  @IsOptional()
  @IsInt()
  @Min(18)
  @Max(100)
  minAge?: number;

  @ApiPropertyOptional({ example: 35, minimum: 18, maximum: 100 })
  @IsOptional()
  @IsInt()
  @Min(18)
  @Max(100)
  maxAge?: number;

  @ApiPropertyOptional({ enum: Gender, isArray: true, example: [Gender.MALE, Gender.FEMALE] })
  @IsOptional()
  @IsArray()
  @IsEnum(Gender, { each: true })
  genderPreferences?: Gender[];

  @ApiPropertyOptional({ example: 50, minimum: 1, maximum: 500, description: 'Maximum radius in km' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(500)
  maxDistanceKm?: number;

  @ApiPropertyOptional({ enum: RelationshipIntent, isArray: true })
  @IsOptional()
  @IsArray()
  @IsEnum(RelationshipIntent, { each: true })
  intentPreferences?: RelationshipIntent[];

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  globalDiscovery?: boolean;
}

export class UpdatePrivacyDto {
  @ApiPropertyOptional({ enum: VisibilityLevel, example: VisibilityLevel.PUBLIC })
  @IsOptional()
  @IsEnum(VisibilityLevel)
  visibility?: VisibilityLevel;

  @ApiPropertyOptional({ example: true, description: 'Whether to show calculated distance in discovery' })
  @IsOptional()
  @IsBoolean()
  showDistance?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  showOnlineStatus?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  showReadReceipts?: boolean;

  @ApiPropertyOptional({ example: true, description: 'Whether to reveal chronological age to others' })
  @IsOptional()
  @IsBoolean()
  showAge?: boolean;
}
