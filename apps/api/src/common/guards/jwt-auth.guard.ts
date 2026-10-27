import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MemoryStoreService } from '../database/memory-store.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly store: MemoryStoreService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Authentication token missing or invalid');
    }

    const token = authHeader.split(' ')[1];
    try {
      const payload = this.jwtService.verify(token);
      const user = this.store.users.get(payload.sub);

      if (!user) {
        throw new UnauthorizedException('User account not found');
      }

      if (user.status === 'SUSPENDED') {
        throw new UnauthorizedException('This account has been suspended for policy violations');
      }

      request.user = user;
      return true;
    } catch (err: any) {
      throw new UnauthorizedException(err.message || 'Token verification failed');
    }
  }
}
