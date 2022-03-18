import { HTTPError } from './entities';

export enum ERROR {
  NO_ERROR = 0,
  DATABASE = 500,
  INVALID_ENTITY = 1001,
  INVALID_EMAIL = 1002,
  EMPTY_EMAIL = 1003,
  INVALID_PASSWORD = 1004,
  EMPTY_PASSWORD = 1005,
  NOT_UNIQUE_EMAIL = 1006,
  NOT_UNIQUE_USERNAME = 1007,
}

export const errors: Record<number, string> = {
  0: 'No error.',
  500: 'Database error.',
  1001: 'Entity is not valid.',
  1002: 'Email is not valid.',
  1003: 'Email is empty.',
  1004: 'Password is not valid.',
  1005: 'Password is empty.',
  1006: 'User with given email already exists.',
  1007: 'User with given username already exists.',
};

class ErrorService {
  private readonly errors;
  constructor() {
    this.errors = errors;
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
