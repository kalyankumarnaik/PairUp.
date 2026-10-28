import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, Matches, MinLength } from 'class-validator';
import { AccountStatus, UserRole } from '@prisma/client';

export class ChangePasswordDto {
  @ApiProperty({ description: 'Current password for verification' })
  @IsString()
  @IsNotEmpty()
  currentPassword: string;

  @ApiProperty({ example: 'BrandNewSecurePass123!' })
  @IsString()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password must contain uppercase, lowercase, and a number or special character',
  })
  newPassword: string;
}

export class UpdateAccountStatusDto {
  @ApiProperty({ enum: AccountStatus, example: AccountStatus.SUSPENDED })
  @IsEnum(AccountStatus)
  @IsNotEmpty()
  status: AccountStatus;

  @ApiPropertyOptional({ example: 'Violating community guidelines regarding harassment' })
  @IsOptional()
  @IsString()
  reason?: string;
}

export class UserAccountResponseDto {
  @ApiProperty({ example: '8f0a3421-4822-4d56-a19e-e31b816ef881' })
  id: string;

  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiPropertyOptional({ example: '+14155552671' })
  phoneNumber?: string | null;

  @ApiProperty({ enum: UserRole, example: UserRole.USER })
  role: UserRole;

  @ApiProperty({ enum: AccountStatus, example: AccountStatus.ACTIVE })
  status: AccountStatus;

  @ApiProperty({ example: true })
  isEmailVerified: boolean;

  @ApiProperty({ example: false })
  isPhoneVerified: boolean;

  @ApiPropertyOptional({ example: '2026-10-27T05:30:00.000Z' })
  lastLoginAt?: Date | null;

  @ApiProperty({ example: '2026-10-27T05:30:00.000Z' })
  createdAt: Date;
}
