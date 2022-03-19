import { UserRoles } from '../user/entity';

export interface HTTPError {
  errorCode: number;
  description: string;
  body?: any;
}

export interface IClientData {
  id: number;
  role: number;
  iat?: number;
  exp?: number;
}

export interface IOptions {
  expiresIn: string;
}

export interface IRequestUser {
  id: number;
  role: UserRoles;
}
