import { Userroles } from '../enums/userroles.enum';

export const RoleHierarchy: Record<Userroles, Userroles[]> = {
  [Userroles.SUPERUSER]: [
    Userroles.ADMIN,
    Userroles.HR,
    Userroles.EMPLOYEE,
    Userroles.GUEST,
  ], // Superuser can access all roles
  [Userroles.ADMIN]: [Userroles.HR, Userroles.EMPLOYEE, Userroles.GUEST], // Admin can access HR, Employee, and Guest
  [Userroles.HR]: [Userroles.EMPLOYEE, Userroles.GUEST], // HR can access Employee and Guest
  [Userroles.EMPLOYEE]: [Userroles.GUEST], // Employee can access Guest
  [Userroles.GUEST]: [], // Guest has no lower roles
};
