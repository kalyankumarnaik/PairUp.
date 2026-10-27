import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { AuditActionType } from '@prisma/client';
import { ReportReason } from '../contracts/moderation.interface';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';

export class BlockUserDto {
  @ApiPropertyOptional({ example: 'Inappropriate or unwanted behavior' })
  @IsOptional()
  @IsString()
  reason?: string;
}

export class BlockedUserResponseDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  blockedUserId: string;

  @ApiProperty({ example: 'Alex Rivera' })
  displayName: string;

  @ApiPropertyOptional({ example: 'Inappropriate messages' })
  reason?: string | null;

  @ApiProperty({ example: '2026-10-27T05:30:00.000Z' })
  blockedAt: Date;
}

export class SubmitReportDto {
  @ApiProperty({ description: 'UUID of the user being reported' })
  @IsUUID()
  @IsNotEmpty()
  reportedUserId: string;

  @ApiProperty({ enum: ReportReason, example: ReportReason.HARASSMENT })
  @IsEnum(ReportReason)
  @IsNotEmpty()
  reason: ReportReason;

  @ApiPropertyOptional({ example: 'User sent offensive messages during conversation' })
  @IsOptional()
  @IsString()
  description?: string;
}

export class AuditQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ enum: AuditActionType })
  @IsOptional()
  @IsEnum(AuditActionType)
  action?: AuditActionType;

  @ApiPropertyOptional({ description: 'Filter by user UUID' })
  @IsOptional()
  @IsUUID()
  userId?: string;
}

export class AuditLogResponseDto {
  @ApiProperty()
  id: string;

  @ApiPropertyOptional()
  userId?: string | null;

  @ApiProperty({ enum: AuditActionType })
  action: AuditActionType;

  @ApiPropertyOptional()
  ipAddress?: string | null;

  @ApiPropertyOptional()
  userAgent?: string | null;

  @ApiPropertyOptional()
  details?: Record<string, unknown> | null;

  @ApiProperty()
  createdAt: Date;
}
