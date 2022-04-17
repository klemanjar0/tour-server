import { Response } from 'express';
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Res,
  Param,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { UserService } from './user.service';
import User from './user.model';
import { validatePassword, validateUserForUpdate } from './user.utils';
import { getLocalUser } from '../event/event.utils';
import { FindUsersOptions } from './entity';

@Controller('user-manage')
export class UserManageController {
  constructor(private readonly userService: UserService) {}

  @Post('findUsers')
  async findUsers(@Res() res: Response, @Body() options: FindUsersOptions) {
    const users = await this.userService.findUsers(options);
    return res.status(HttpStatus.OK).json(users);
  }

  @Post('findUserNames')
  async findUserNames(
    @Res() res: Response,
    @Body() { query }: { query: string },
  ) {
    const userId = getLocalUser(res).id;
    const users = await this.userService.findUserNames(query, userId);
    return res.status(HttpStatus.OK).json(users);
  }

  @Put('update-metadata')
  async updateMetadata(@Res() res: Response, @Body() user: User) {
    const userId = getLocalUser(res).id;
    const error = await validateUserForUpdate(user, userId, this.userService);
    if (error.errorCode) {
      return res.status(HttpStatus.OK).json(error);
    } else {
      const updated = await this.userService.update(userId, user);
      return res.status(HttpStatus.OK).json(updated);
    }
  }

  @Put('update-password')
  async updatePassword(
    @Res() res: Response,
    @Body() body: { newPassword: string; oldPassword: string },
  ) {
    const userId = getLocalUser(res).id;
    const error = await validatePassword(
      body.newPassword,
      body.oldPassword,
      userId,
      this.userService,
    );
    if (error.errorCode) {
      return res.status(HttpStatus.OK).json(error);
    } else {
      const created = await this.userService.updatePassword(
        userId,
        body.newPassword,
      );
      return res.status(HttpStatus.OK).json(created);
    }
  }
}
