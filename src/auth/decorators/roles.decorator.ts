import { SetMetadata } from '@nestjs/common';
import { Userroles } from '../enums/userroles.enum';

export const Roles = (...roles: Userroles[]) => SetMetadata('roles', roles);
