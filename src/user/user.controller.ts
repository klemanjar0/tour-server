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

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('all')
  getAllUsers(): Promise<Array<User> | []> {
    return this.userService.getAll();
  }

  @Delete(':id')
  async delete(@Res() res: Response, @Param('id') id: number) {
    const rowsAffected = await this.userService.delete(id);
    return res.status(HttpStatus.NO_CONTENT).json(rowsAffected);
  }
}
