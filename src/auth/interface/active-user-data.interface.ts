export interface ActiveUserData {
  sub: string; // Subject (usually the user ID)
  email: string; // User's email
  role_codes: string[]; // Array of Role codes from Rbac
  feature_codes: string[]; // Array of Feature codes from Rbac
}
