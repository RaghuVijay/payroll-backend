import { SetMetadata } from '@nestjs/common';

export const AllRoles = (...args: string[]) => SetMetadata('all-roles', args);
