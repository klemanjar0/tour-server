import { HTTPError } from './entities';

export enum ERROR {
  NO_ERROR = 0,
  DATABASE = 500,
  UNAUTHORIZED = 501,
  NO_ACCESS = 502,
  NO_TOKEN = 503,
  TOKEN_EXPIRED = 504,
  INVALID_ENTITY = 1001,
  INVALID_EMAIL = 1002,
  EMPTY_EMAIL = 1003,
  INVALID_PASSWORD = 1004,
  EMPTY_PASSWORD = 1005,
  NOT_UNIQUE_EMAIL = 1006,
  NOT_UNIQUE_USERNAME = 1007,
  VALIDATION_ERROR = 1008,
  USER_NOT_FOUND = 1009,
  NO_PERMISSION_FOR_ROLES = 2000,
  ENTITY_DUBLICATE = 2001,
  INVITE_ALREADY_CREATED = 2002,
  NO_PERMISSION_TO_REMOVE_FROM_EVENT = 2003,
  NO_PERMISSION_FOUND = 2004,
  BALANCE_ERROR = 2005,
  INCORRECT_PASSWORD = 4001,
  ENV_ERROR = 5000,
}

export const errors: Record<number, string> = {
  0: 'No error.',
  500: 'Database error.',
  501: 'Unauthorized',
  502: 'No access with given role',
  503: 'No access token provided',
  504: 'Access token has been expired',
  1001: 'Entity is not valid.',
  1002: 'Email is not valid.',
  1003: 'Email is empty.',
  1004: 'Password is not valid.',
  1005: 'Password is empty.',
  1006: 'User with given email already exists.',
  1007: 'User with given username already exists.',
  1008: 'JSON-web-token validation failed.',
  1009: 'User with given email or username not found.',
  2000: 'User is not allowed to give roles and add users.',
  2001: 'Entity already exists.',
  2002: 'Invite to this user for this event has been already created.',
  2003: 'No permission to make this action',
  2004: 'No permission on this event',
  2005: 'Not enough money or balance error',
  4001: 'Password is incorrect.',
  5000: '.env file is not fullfiled',
};

class ErrorService {
  private readonly errors;
  constructor() {
    this.errors = errors;
  }
  getErrorCodes() {
    return errors;
  }
  getError(errorCode: number, body?: any): HTTPError {
    const error = !!this.errors[errorCode];
    if (error) {
      return {
        errorCode: errorCode,
        description: this.errors[errorCode],
        body,
      };
    } else {
      return {
        errorCode: -1,
        description: 'Unknown error.',
        body,
      };
    }
  }
}

export default new ErrorService();
