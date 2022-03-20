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
import { EventRoles } from './entity';

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

  @Delete('deleteEvent/:id')
  async deleteEvent(@Res() res: Response, @Param() params: { id: number }) {
    const userId = getLocalUser(res).id;
    if (!(await userExists(userId, this.userService))) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json(ErrorService.getError(ERROR.USER_NOT_FOUND));
    }
    const entity = await this.eventService.deleteEvent(params.id, userId);
    if (isInstanceOfHTTPError(entity)) {
      return res.status(HttpStatus.BAD_REQUEST).json(entity);
    }
    return res.status(HttpStatus.OK).json(entity);
  }

  @Post('addUserToEvent')
  async addUserToEvent(
    @Res() res: Response,
    @Body() body: { eventId: number; userId: number; role: EventRoles },
  ) {
    const userId = getLocalUser(res).id;
    if (!(await userExists(userId, this.userService))) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json(ErrorService.getError(ERROR.USER_NOT_FOUND));
    }

    const hasPermissionToChangeRoles =
      await this.eventService.checkUserCanAddGivenRole(userId, body.eventId);

    if (!hasPermissionToChangeRoles) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json(ErrorService.getError(ERROR.NO_PERMISSION_FOR_ROLES));
    }

    const response = await this.eventService.addUserToEvent(
      body.eventId,
      body.userId,
      body.role,
    );

    if (isInstanceOfHTTPError(response)) {
      return res.status(HttpStatus.BAD_REQUEST).json(response);
    }

    return res.status(HttpStatus.OK).json(response);
  }

  @Get('myEvents')
  async getEventsByUserId(@Res() res: Response) {
    const userId = getLocalUser(res).id;
    if (!(await userExists(userId, this.userService))) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json(ErrorService.getError(ERROR.USER_NOT_FOUND));
    }
    const response = await this.eventService.getAllUserEvents(userId);
    return res.status(HttpStatus.OK).json(response);
  }
}
