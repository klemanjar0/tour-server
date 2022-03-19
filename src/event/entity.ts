import User from '../user/user.model';

export enum EventRoles {
  SUPER_ADMIN = 500,
  OWNER = 400,
  EDITOR = 200,
  MEMBER = 100,
  NO_ACCESS = 1,
}

export enum EventStatuses {
  CLOSED = 16,
  FINISHED = 8,
  ACTIVE = 4,
  REGISTRATION_CLOSED = 2,
  REGISTRATION_PENDING = 1,
  CREATED = 0,
}

export interface IEvent {
  id: number;
  title: string;
  type: string;
  description: string;
  country: string;
  prizeFund: number;
  status: EventStatuses;
  createdAt: string;
  updatedAt: string;
  users: User[];
}

export interface IUserToEvent {
  userId: number;
  eventId: number;
  userRole: EventRoles;
  isActive: boolean;
}
