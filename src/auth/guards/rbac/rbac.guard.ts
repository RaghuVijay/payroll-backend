import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { REQUEST_USER_KEY } from 'src/auth/constants/auth.constants';
import { Userroles } from 'src/auth/enums/userroles.enum';
import { RoleCodeMapping } from 'src/auth/objects/roleCodeMapping';
import { RoleHierarchy } from 'src/auth/objects/Rolehiearchy';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.get<Userroles[]>(
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
      throw new UnauthorizedException('User roles not found');
    }

    // Log user object and role_codes for debugging
    this.logger.debug(`User object: ${JSON.stringify(user)}`);
    this.logger.debug(`User role_codes: ${user.role_codes.join(', ')}`);

    // Map JWT role_codes to Userroles enum
    const userRoles = user.role_codes.map((code) => {
      const role = RoleCodeMapping[code];
      if (!role) {
        throw new UnauthorizedException(`Invalid role code: ${code}`);
      }
      return role;
    });

    this.logger.debug(`Mapped user roles: ${userRoles.join(', ')}`);

    // If the user is a SUPERUSER, grant access immediately
    if (userRoles.includes(Userroles.SUPERUSER)) {
      this.logger.debug('User is a SUPERUSER; access granted');
      return true;
    }

    // Check if the user has at least one of the required roles or a higher role
    const hasRole = requiredRoles.some((role) =>
      this.checkRoleHierarchy(userRoles, role),
    );

    if (!hasRole) {
      this.logger.warn('Insufficient permissions');
      throw new UnauthorizedException('Insufficient permissions');
    }

    this.logger.debug('Access granted');
    return true;
  }

  private checkRoleHierarchy(
    userRoles: Userroles[],
    requiredRole: Userroles,
  ): boolean {
    // Check if the user has the required role or a higher role in the hierarchy
    return userRoles.some(
      (role) =>
        role === requiredRole || RoleHierarchy[role]?.includes(requiredRole),
    );
  }
}
