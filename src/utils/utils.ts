import { UserService } from '../user/user.service';

export const userExists = async (
  userId: number,
  userService: UserService,
): Promise<boolean> => {
  return !!(await userService.getById(userId));
};
