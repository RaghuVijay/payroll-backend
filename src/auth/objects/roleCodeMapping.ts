import { Userroles } from '../enums/userRoles.enum';

export const RoleCodeMapping: Record<string, Userroles> = {
  ROLE0001: Userroles.SUPERUSER,
  ROLE0002: Userroles.ADMIN,
  ROLE0003: Userroles.HR,
  ROLE0004: Userroles.EMPLOYEE,
  ROLE0005: Userroles.GUEST,
};
