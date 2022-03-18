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
import { validateUser } from './user.utils';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('all')
  getAllUsers(): Promise<Array<User> | []> {
    return this.userService.getAll();
  }

  @Post()
  async create(@Res() res: Response, @Body() user: User) {
    const error = await validateUser(user, this.userService);
    if (error.errorCode) {
      return res.status(HttpStatus.BAD_REQUEST).json(error);
    } else {
      const created = await this.userService.create(user);
      return res.status(HttpStatus.CREATED).json(created);
    }
  }
}
