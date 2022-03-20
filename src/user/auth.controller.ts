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
import {
  getAdminUser,
  isInstanceOfHTTPError,
  validateAuthData,
  validateUser,
} from './user.utils';
import JwtService from '../shared/jwt.service';
import { IAuthData, ILoginResponse } from './entity';
import ErrorService, { ERROR } from '../utils/errors';
import * as bcrypt from 'bcryptjs';

@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Post('initialize_admin')
  async defineAdmin(@Res() res: Response) {
    const entity = getAdminUser();
    if (isInstanceOfHTTPError(entity)) {
      return res.status(HttpStatus.BAD_REQUEST).json(entity);
    } else {
      const created = await this.userService.create(entity as User);
      return res.status(HttpStatus.CREATED).json(created);
    }
  }

  @Post('register')
  async create(@Res() res: Response, @Body() user: User) {
    const error = await validateUser(user, this.userService);
    if (error.errorCode) {
      return res.status(HttpStatus.BAD_REQUEST).json(error);
    } else {
      const created = await this.userService.create(user);
      return res.status(HttpStatus.CREATED).json(created);
    }
  }

  @Post('login')
  async login(@Res() res: Response, @Body() data: IAuthData) {
    const error = validateAuthData(data);
    if (error.errorCode) {
      return res.status(HttpStatus.BAD_REQUEST).json(error);
    } else {
      const user =
        (await this.userService.getByEmail(data.email)) ||
        (await this.userService.getByUsername(data.email));

      if (!user) {
        return res
          .status(HttpStatus.OK)
          .json(ErrorService.getError(ERROR.USER_NOT_FOUND));
      }

      const pwdPassed = await bcrypt.compare(data.password, user.pwdHash);
      if (!pwdPassed) {
        return res
          .status(HttpStatus.OK)
          .json(ErrorService.getError(ERROR.INCORRECT_PASSWORD));
      }

      const jwt = await JwtService.getJwt({
        id: user.id,
        role: user.role,
      });

      const response: ILoginResponse = {
        profile: user,
        authToken: jwt,
      };

      return res.status(HttpStatus.OK).json(response);
    }
  }
}
