import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';
import { LikeType } from '@prisma/client';
import { PublicProfileResponseDto } from '../../profiles/dto/profile-response.dto';

export class DiscoveryQueryDto {
  @ApiPropertyOptional({ default: 10, minimum: 1, maximum: 50, description: 'Number of candidates to fetch' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number = 10;

  @ApiPropertyOptional({ description: 'Pagination cursor (last seen user ID)' })
  @IsOptional()
  @IsString()
  cursor?: string;
}

export class LikeActionDto {
  @ApiProperty({ description: 'UUID of the target user being liked' })
  @IsUUID()
  @IsNotEmpty()
  toUserId: string;

  @ApiPropertyOptional({ enum: LikeType, default: LikeType.STANDARD })
  @IsOptional()
  @IsEnum(LikeType)
  type?: LikeType = LikeType.STANDARD;
}

export class PassActionDto {
  @ApiProperty({ description: 'UUID of the target user being passed' })
  @IsUUID()
  @IsNotEmpty()
  toUserId: string;
}

export class LikeResultDto {
  @ApiProperty({ example: true, description: 'Whether this like triggered a mutual match' })
  isMatch: boolean;

  @ApiPropertyOptional({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  matchId?: string | null;

  @ApiPropertyOptional({ type: PublicProfileResponseDto })
  matchedProfile?: PublicProfileResponseDto | null;

  @ApiProperty({ example: 'STANDARD' })
  likeType: LikeType;

  @ApiProperty({ example: '2026-10-27T05:30:00.000Z' })
  timestamp: string;
}

export class PassResultDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Candidate passed' })
  message: string;
}
