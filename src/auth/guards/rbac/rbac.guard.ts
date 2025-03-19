import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { REQUEST_USER_KEY } from 'src/auth/constants/auth.constants';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Fetch required roles from the @Roles decorator
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );

    this.logger.debug(`Required roles: ${requiredRoles?.join(', ') || 'None'}`);

    // If no roles are required, allow access
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request[REQUEST_USER_KEY];

    if (!user || !user.role_codes) {
      this.logger.warn('User roles not found');
      throw new ForbiddenException('User roles not found');
    }

    // Log user object and role_codes for debugging
    this.logger.debug(`User object: ${JSON.stringify(user)}`);
    this.logger.debug(`User role_codes: ${user.role_codes.join(', ')}`);

    // Check if the user has at least one of the required roles
    const hasRequiredRole = requiredRoles.some((role) =>
      user.role_codes.includes(role),
    );

    if (!hasRequiredRole) {
      this.logger.warn('Insufficient permissions');
      throw new ForbiddenException('Insufficient permissions');
    }

    this.logger.debug('Access granted');
    return true;
  }
}
