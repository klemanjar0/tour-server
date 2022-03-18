export enum UserRoles {
  SUPER_ADMIN = 500,
  ADMIN = 400,
  EDITOR = 200,
  USER = 100,
  NO_ACCESS = 1,
}

export interface IUser {
  id: number;
  username: string;
  email: string;
  pwdHash: string;
  role: UserRoles;
  createdAt: string;
  updatedAt: string;
}
