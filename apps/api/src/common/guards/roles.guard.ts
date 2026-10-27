import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@pairup/domain-types';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => {
  return (target: any, key?: string | symbol, descriptor?: TypedPropertyDescriptor<any>) => {
    Reflector.createDecorator<UserRole[]>()(roles);
    Reflect.defineMetadata(ROLES_KEY, roles, descriptor?.value ?? target);
  };
};

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass()
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user || !user.role) {
      throw new ForbiddenException('Access denied: Role authorization required');
    }

    const hasRole = requiredRoles.includes(user.role);
    if (!hasRole && user.role !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenException(`Access denied: Requires one of [${requiredRoles.join(', ')}]`);
    }

    return true;
  }
}
