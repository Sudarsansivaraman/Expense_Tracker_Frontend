export interface Users {
  userId: number;
  email: string;
  passwordHash: string;
  fullName: string;
  role: UserRole;
}

export enum UserRole {
  User = 'User',
  Admin = 'Admin'
}