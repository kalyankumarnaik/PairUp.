import { ApiProperty } from '@nestjs/swagger';
import { AccountStatus, UserRole } from '@prisma/client';

export class UserSummaryDto {
  @ApiProperty({ example: '8f0a3421-4822-4d56-a19e-e31b816ef881' })
  id: string;

  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ enum: UserRole, example: UserRole.USER })
  role: UserRole;

  @ApiProperty({ enum: AccountStatus, example: AccountStatus.ACTIVE })
  status: AccountStatus;

  @ApiProperty({ example: false })
  isEmailVerified: boolean;

  @ApiProperty({ example: false })
  hasProfile: boolean;
}

export class AuthResponseDto {
  @ApiProperty({ type: UserSummaryDto })
  user: UserSummaryDto;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  accessToken: string;

  @ApiProperty({ example: '9f81a7b1-4f32-4d2b-92ea-2a81fa3d1e1c...' })
  refreshToken: string;

  @ApiProperty({ example: 900, description: 'Access token expiration in seconds (15 minutes)' })
  expiresIn: number;
}

export class SessionResponseDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  id: string;

  @ApiProperty({ example: 'iPhone 15 Pro, iOS 17.4' })
  deviceInfo?: string | null;

  @ApiProperty({ example: '127.0.0.1' })
  ipAddress?: string | null;

  @ApiProperty({ example: '2026-10-27T05:30:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-11-03T05:30:00.000Z' })
  expiresAt: Date;

  @ApiProperty({ example: true })
  isCurrent: boolean;
}
