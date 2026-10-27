import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { MatchStatus } from '@prisma/client';
import { PublicProfileResponseDto } from '../../profiles/dto/profile-response.dto';

export class MatchQueryDto {
  @ApiPropertyOptional({ default: 20, minimum: 1, maximum: 50 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number = 20;

  @ApiPropertyOptional({ description: 'Cursor for pagination (last seen match ID)' })
  @IsOptional()
  @IsString()
  cursor?: string;

  @ApiPropertyOptional({ enum: MatchStatus, default: MatchStatus.ACTIVE })
  @IsOptional()
  @IsEnum(MatchStatus)
  status?: MatchStatus = MatchStatus.ACTIVE;
}

export class UnmatchDto {
  @ApiPropertyOptional({ example: 'Found someone else' })
  @IsOptional()
  @IsString()
  reason?: string;
}

export class MatchResponseDto {
  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  id: string;

  @ApiProperty({ enum: MatchStatus, example: MatchStatus.ACTIVE })
  status: MatchStatus;

  @ApiProperty({ example: '2026-10-27T05:30:00.000Z' })
  matchedAt: Date;

  @ApiProperty({ example: '2026-10-27T05:30:00.000Z' })
  lastInteractionAt: Date;

  @ApiProperty({ type: PublicProfileResponseDto })
  partner: PublicProfileResponseDto;

  @ApiPropertyOptional({ example: false, description: 'Flag reserved for Member 3 messaging integration' })
  hasUnreadMessages?: boolean;
}
