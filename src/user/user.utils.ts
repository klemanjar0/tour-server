import User from './user.model';
import { HTTPError } from '../utils/entities';
import ErrorService, { ERROR } from '../utils/errors';
import { UserService } from './user.service';

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
