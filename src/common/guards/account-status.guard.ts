import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { AccountStatus } from '@prisma/client';
import { DomainErrorCode, DomainException } from '../exceptions/domain.exception';

@Injectable()
export class AccountStatusGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      return true; // JwtAuthGuard will handle unauthenticated requests
    }

    if (user.status === AccountStatus.SUSPENDED) {
      throw new DomainException(
        'Your account has been suspended due to violations of our community safety guidelines.',
        DomainErrorCode.ACCOUNT_SUSPENDED,
        403,
      );
    }

    if (user.status === AccountStatus.DELETED || user.status === AccountStatus.BANNED) {
      throw new DomainException(
        'This account is no longer active.',
        DomainErrorCode.ACCOUNT_DELETED,
        403,
      );
    }

    return true;
  }
}
