import { Injectable, Logger } from '@nestjs/common';
import { AccountStatus, AuditActionType } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { SYSTEM_CONSTANTS } from '../../common/constants/system.constant';
import { DomainErrorCode, DomainException } from '../../common/exceptions/domain.exception';
import { ChangePasswordDto, UpdateAccountStatusDto, UserAccountResponseDto } from './dto/user-account-response.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Retrieves private account details for current user.
   */
  async getAccount(userId: string): Promise<UserAccountResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new DomainException('User not found', DomainErrorCode.RESOURCE_NOT_FOUND, 404);
    }

    return {
      id: user.id,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      status: user.status,
      isEmailVerified: user.isEmailVerified,
      isPhoneVerified: user.isPhoneVerified,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
    };
  }

  /**
   * Changes account password after verifying current credentials.
   */
  async changePassword(
    userId: string,
    dto: ChangePasswordDto,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<{ message: string }> {
    const credential = await this.prisma.userCredential.findUnique({
      where: { userId },
    });

    if (!credential) {
      throw new DomainException('User credentials not configured', DomainErrorCode.INVALID_CREDENTIALS, 400);
    }

    const isValid = await bcrypt.compare(dto.currentPassword, credential.passwordHash);
    if (!isValid) {
      throw new DomainException('Current password does not match', DomainErrorCode.INVALID_CREDENTIALS, 400);
    }

    const salt = await bcrypt.genSalt(SYSTEM_CONSTANTS.BCRYPT_SALT_ROUNDS);
    const passwordHash = await bcrypt.hash(dto.newPassword, salt);

    await this.prisma.$transaction([
      this.prisma.userCredential.update({
        where: { userId },
        data: {
          passwordHash,
          passwordChangedAt: new Date(),
          failedLoginAttempts: 0,
          lockoutUntil: null,
        },
      }),
      // Revoke all existing sessions
      this.prisma.userSession.updateMany({
        where: { userId, isRevoked: false },
        data: {
          isRevoked: true,
          revokedAt: new Date(),
          revocationReason: 'PASSWORD_CHANGED',
        },
      }),
      this.prisma.auditLog.create({
        data: {
          userId,
          action: AuditActionType.PASSWORD_RESET_SUCCESS,
          ipAddress,
          userAgent,
          details: { method: 'USER_SETTINGS_CHANGE' },
        },
      }),
    ]);

    return { message: 'Password changed successfully. Please log in with your new password.' };
  }

  /**
   * Soft deletes an account, revokes sessions, and marks status as DELETED.
   */
  async deleteAccount(
    userId: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<{ message: string }> {
    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: userId },
        data: {
          status: AccountStatus.DELETED,
          deletedAt: new Date(),
        },
      }),
      this.prisma.userSession.updateMany({
        where: { userId, isRevoked: false },
        data: {
          isRevoked: true,
          revokedAt: new Date(),
          revocationReason: 'ACCOUNT_DELETED',
        },
      }),
      this.prisma.accountStatusHistory.create({
        data: {
          userId,
          previousStatus: AccountStatus.ACTIVE,
          newStatus: AccountStatus.DELETED,
          reason: 'User self-requested account deletion',
          changedById: userId,
        },
      }),
      this.prisma.auditLog.create({
        data: {
          userId,
          action: AuditActionType.ACCOUNT_DELETED,
          ipAddress,
          userAgent,
        },
      }),
    ]);

    return { message: 'Your account has been deleted. We are sorry to see you go!' };
  }

  /**
   * Administrative status change (e.g. suspend or restore).
   */
  async updateStatusByAdmin(
    targetUserId: string,
    dto: UpdateAccountStatusDto,
    adminId: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<UserAccountResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: targetUserId },
    });

    if (!user) {
      throw new DomainException('Target user not found', DomainErrorCode.RESOURCE_NOT_FOUND, 404);
    }

    const previousStatus = user.status;
    const newStatus = dto.status;

    const [updatedUser] = await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: targetUserId },
        data: { status: newStatus },
      }),
      this.prisma.accountStatusHistory.create({
        data: {
          userId: targetUserId,
          previousStatus,
          newStatus,
          reason: dto.reason || 'Administrative action',
          changedById: adminId,
        },
      }),
      ...(newStatus === AccountStatus.SUSPENDED || newStatus === AccountStatus.BANNED
        ? [
            this.prisma.userSession.updateMany({
              where: { userId: targetUserId, isRevoked: false },
              data: {
                isRevoked: true,
                revokedAt: new Date(),
                revocationReason: `ADMIN_${newStatus}`,
              },
            }),
          ]
        : []),
      this.prisma.auditLog.create({
        data: {
          userId: targetUserId,
          action:
            newStatus === AccountStatus.SUSPENDED
              ? AuditActionType.ACCOUNT_SUSPENDED
              : AuditActionType.ACCOUNT_RESTORED,
          ipAddress,
          userAgent,
          details: { adminId, previousStatus, newStatus, reason: dto.reason },
        },
      }),
    ]);

    return {
      id: updatedUser.id,
      email: updatedUser.email,
      phoneNumber: updatedUser.phoneNumber,
      role: updatedUser.role,
      status: updatedUser.status,
      isEmailVerified: updatedUser.isEmailVerified,
      isPhoneVerified: updatedUser.isPhoneVerified,
      lastLoginAt: updatedUser.lastLoginAt,
      createdAt: updatedUser.createdAt,
    };
  }
}
