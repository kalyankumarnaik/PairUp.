import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../../prisma/prisma.service';
import { AccountStatus } from '@prisma/client';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  sessionId: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.accessSecret', 'pairup_dev_jwt_access_secret_super_secure_key_12345'),
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        isEmailVerified: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User account no longer exists');
    }

    if (user.status === AccountStatus.DELETED || user.status === AccountStatus.BANNED) {
      throw new UnauthorizedException('Account has been deactivated');
    }

    // Verify session is still valid and not revoked
    const session = await this.prisma.userSession.findUnique({
      where: { id: payload.sessionId },
      select: { isRevoked: true, expiresAt: true },
    });

    if (!session || session.isRevoked || session.expiresAt < new Date()) {
      throw new UnauthorizedException('Session has been revoked or expired');
    }

    return {
      userId: user.id,
      email: user.email,
      role: user.role,
      status: user.status,
      sessionId: payload.sessionId,
    };
  }
}
