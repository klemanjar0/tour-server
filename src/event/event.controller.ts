import {
  Controller,
  Post,
  Delete,
  Get,
  HttpStatus,
  Param,
  Res,
  Body,
} from '@nestjs/common';
import { Response } from 'express';
import { EventService } from './event.service';
import Event from './event.model';
import { getLocalUser } from './event.utils';
import { isInstanceOfHTTPError } from '../user/user.utils';
import { UserService } from '../user/user.service';
import { userExists } from '../utils/utils';
import ErrorService, { ERROR } from '../utils/errors';

@Controller('events')
export class EventController {
  constructor(
    private readonly eventService: EventService,
    private readonly userService: UserService,
  ) {}

  @Post('create')
  async createEvent(@Res() res: Response, @Body() event: Event) {
    const userId = getLocalUser(res).id;
    if (!(await userExists(userId, this.userService))) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json(ErrorService.getError(ERROR.USER_NOT_FOUND));
    }
    const entity = await this.eventService.create(event, userId);
    if (isInstanceOfHTTPError(entity)) {
      return res.status(HttpStatus.BAD_REQUEST).json(entity);
    }
    return res.status(HttpStatus.OK).json(entity);
  }
}
