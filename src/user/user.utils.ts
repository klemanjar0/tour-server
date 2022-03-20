import User from './user.model';
import { HTTPError } from '../utils/entities';
import ErrorService, { ERROR } from '../utils/errors';
import { UserService } from './user.service';
import { IAuthData, UserRoles } from './entity';

const validEmail =
  /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/;
const validPassword = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z]).{8,}$/;

export const isValidEmail = (email: string) => {
  return validEmail.test(email);
};

export const isValidPassword = (password: string) => {
  return validPassword.test(password);
};

export const validateUser = async (
  user: User,
  userService: UserService,
): Promise<HTTPError> => {
  if (!user) {
    return ErrorService.getError(ERROR.INVALID_ENTITY);
  }

  if (user.email) {
    if (!isValidEmail(user.email)) {
      return ErrorService.getError(ERROR.INVALID_EMAIL);
    }
  } else {
    return ErrorService.getError(ERROR.EMPTY_EMAIL);
  }

  if (user.pwdHash) {
    if (!isValidPassword(user.pwdHash)) {
      return ErrorService.getError(ERROR.INVALID_PASSWORD);
    }
  } else {
    return ErrorService.getError(ERROR.EMPTY_PASSWORD);
  }

  const isNotUniqueEmail = await userService.getByEmail(user.email);
  if (isNotUniqueEmail) {
    return ErrorService.getError(ERROR.NOT_UNIQUE_EMAIL);
  }
  const isNotUniqueUsername = await userService.getByUsername(user.username);
  if (isNotUniqueUsername) {
    return ErrorService.getError(ERROR.NOT_UNIQUE_USERNAME);
  }

  return ErrorService.getError(ERROR.NO_ERROR);
};

export const validateAuthData = (data: IAuthData) => {
  if (data) {
    if (!data.email) {
      ErrorService.getError(ERROR.EMPTY_EMAIL);
    }
    if (!data.password) {
      ErrorService.getError(ERROR.EMPTY_PASSWORD);
    }
  } else {
    return ErrorService.getError(ERROR.INVALID_ENTITY);
  }

  return ErrorService.getError(ERROR.NO_ERROR);
};

export const isInstanceOfHTTPError = (object: any): object is HTTPError => {
  try {
    return 'errorCode' in object;
  } catch (e) {
    return false;
  }
};

export const getAdminUser = (): Partial<User> | HTTPError => {
  const username = process.env.SUPER_ADMIN_LOGIN;
  const email = process.env.SUPER_ADMIN_EMAIL;
  const password = process.env.SUPER_ADMIN_PASSWORD;

  if (!username || !email || !password) {
    return ErrorService.getError(ERROR.ENV_ERROR);
  }

  const user: Partial<User> = {
    email: email,
    username: username,
    pwdHash: password,
    role: UserRoles.SUPER_ADMIN,
  };

  return user;
};
