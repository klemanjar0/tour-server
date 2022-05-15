import {
  Controller,
  Post,
  Delete,
  Get,
  HttpStatus,
  Param,
  Res,
  Body,
  Patch,
  Put,
} from '@nestjs/common';
import { Response } from 'express';
import { EventService } from './event.service';
import Event from './event.model';
import { getLocalUser } from './event.utils';
import { isInstanceOfHTTPError } from '../user/user.utils';
import { UserService } from '../user/user.service';
import { userExists } from '../utils/utils';
import ErrorService, { ERROR } from '../utils/errors';
import { EventParams, EventRoles, EventStatuses } from './entity';
import { SocketGateway } from '../socket/notification.gateway';

@Controller('events')
export class EventController {
  constructor(
    private readonly eventService: EventService,
    private readonly userService: UserService,
    private readonly socketService: SocketGateway,
  ) {}

  @Post('create')
  async createEvent(@Res() res: Response, @Body() event: Event) {
    const userId = getLocalUser(res).id;
    if (!(await userExists(userId, this.userService))) {
      return res
        .status(HttpStatus.OK)
        .json(ErrorService.getError(ERROR.USER_NOT_FOUND));
    }
    const entity = await this.eventService.create(event, userId);
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
    if ((entity as Event).id) {
      await this.socketService.emitBalanceUpdate(userId);
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
        .status(HttpStatus.OK)
        .json(ErrorService.getError(ERROR.USER_NOT_FOUND));
    }

    const hasPermissionToChangeRoles =
      await this.eventService.checkUserCanAddGivenRole(userId, body.eventId);

    if (!hasPermissionToChangeRoles) {
      return res
        .status(HttpStatus.OK)
        .json(ErrorService.getError(ERROR.NO_PERMISSION_FOR_ROLES));
    }

    const response = await this.eventService.addUserToEvent(
      body.eventId,
      body.userId,
      body.role,
    );

    return res.status(HttpStatus.OK).json(response);
  }

  @Get('get/:id')
  async getById(@Res() res: Response, @Param() params: { id: number }) {
    const userId = getLocalUser(res).id;
    const response = await this.eventService.getById(params.id, userId);
    return res.status(HttpStatus.OK).json(response);
  }

  @Patch('updateStatus')
  async updateStatus(
    @Res() res: Response,
    @Body() body: { eventId: number; status: EventStatuses },
  ) {
    const userId = getLocalUser(res).id;
    const isAdmin = await this.eventService.isAdminOnEvent(
      userId,
      body.eventId,
    );
    if (isAdmin) {
      const response = await this.eventService.updateStatus(
        body.eventId,
        body.status,
      );
      if ((response as Event).winnerId) {
        await this.socketService.emitBalanceUpdate(
          (response as Event).winnerId,
        );
      }
      return res.status(HttpStatus.OK).json(response);
    } else {
      return res
        .status(HttpStatus.OK)
        .json(ErrorService.getError(ERROR.NO_PERMISSION_TO_REMOVE_FROM_EVENT));
    }
  }

  @Put('setWinner')
  async setWinner(
    @Res() res: Response,
    @Body() body: { eventId: number; userId: number },
  ) {
    const userId = getLocalUser(res).id;
    const isAdmin = await this.eventService.isAdminOnEvent(
      userId,
      body.eventId,
    );
    if (isAdmin) {
      const response = await this.eventService.setWinner(
        body.userId,
        body.eventId,
      );
      return res.status(HttpStatus.OK).json(response);
    } else {
      return res
        .status(HttpStatus.OK)
        .json(ErrorService.getError(ERROR.NO_PERMISSION_TO_REMOVE_FROM_EVENT));
    }
  }

  @Post('myEvents')
  async getEventsByUserId(
    @Res() res: Response,
    @Body()
    body: { start?: number; limit?: number; searchParams?: EventParams },
  ) {
    const userId = getLocalUser(res).id;
    if (!(await userExists(userId, this.userService))) {
      return res
        .status(HttpStatus.OK)
        .json(ErrorService.getError(ERROR.USER_NOT_FOUND));
    }
    const response = await this.eventService.getAllUserEvents(
      userId,
      body?.start,
      body?.limit,
      body?.searchParams,
    );
    return res.status(HttpStatus.OK).json(response);
  }

  @Post('getMaxPrize')
  async getMaxPrize(@Res() res: Response) {
    const userId = getLocalUser(res).id;
    const response = await this.eventService.getMyMaxPrize(userId);
    return res.status(HttpStatus.OK).json(response);
  }

  @Post('getEventUsers')
  async getEventUsers(@Res() res: Response, @Body() body: { eventId: number }) {
    const response = await this.eventService.getEventUsers(body.eventId);
    return res.status(HttpStatus.OK).json(response);
  }

  @Post('removeUserFromEvent')
  async removeUserFromEvent(
    @Res() res: Response,
    @Body() body: { eventId: number; userId: number },
  ) {
    const myId = getLocalUser(res).id;
    const canBeRemoved = await this.eventService.canUserBeRemoved(
      myId,
      body.userId,
      body.eventId,
    );

    if (canBeRemoved) {
      const response = await this.eventService.removeUserFromEvent(
        body.userId,
        body.eventId,
      );
      return res.status(HttpStatus.OK).json(response);
    } else {
      return res
        .status(HttpStatus.OK)
        .json(ErrorService.getError(ERROR.NO_PERMISSION_TO_REMOVE_FROM_EVENT));
    }
  }
}
