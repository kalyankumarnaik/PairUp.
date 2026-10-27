import { SetMetadata } from '@nestjs/common';
import { ROLES_KEY } from '../constants/system.constant';
import { UserRole } from '@prisma/client';

export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
