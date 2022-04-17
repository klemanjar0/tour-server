import { Response } from 'express';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { InviteService } from './invite.service';
import { getLocalUser } from '../event/event.utils';
import Invite from './invite.model';
import { UserService } from '../user/user.service';
import { SocketGateway } from '../socket/notification.gateway';
import ErrorService, { ERROR } from '../utils/errors';
import { EventService } from '../event/event.service';
import { EventRoles } from '../event/entity';

@Controller('invites')
export class InviteController {
  constructor(
    private readonly inviteService: InviteService,
    private readonly userService: UserService,
    private readonly eventService: EventService,
    private readonly socketService: SocketGateway,
  ) {}

  @Get('myInvites')
  async getInvites(@Res() res: Response) {
    const userId = getLocalUser(res).id;
    const invites = await this.inviteService.getInvites(userId);

    return res.status(HttpStatus.OK).json(invites);
  }

  @Delete('decline')
  async deleteInvite(@Res() res: Response, @Body() body: { inviteId: number }) {
    const invites = await this.inviteService.deleteInvite(body.inviteId);

    return res.status(HttpStatus.OK).json(invites);
  }

  @Post('accept')
  async acceptInvite(@Res() res: Response, @Body() body: { inviteId: number }) {
    const invite = await this.inviteService.getById(body.inviteId);
    const eventId = invite.eventId;
    const userId = invite.invitedUserId;

    const response = await this.eventService.addUserToEvent(
      eventId,
      userId,
      EventRoles.MEMBER,
    );
    await this.inviteService.deleteInvite(body.inviteId);

    return res.status(HttpStatus.OK).json(response);
  }

  @Post('inviteUserToEvent')
  async createInvite(
    @Res() res: Response,
    @Body() body: { username: string; eventId: number },
  ) {
    const userId = getLocalUser(res).id;
    const invitedUserId = (await this.userService.getByUsername(body.username))
      .id;

    const invite = {
      userId: userId,
      invitedUserId: invitedUserId,
      eventId: body.eventId,
    };

    const isCollision = Boolean(
      await this.inviteService.getInviteCollision(invitedUserId, body.eventId),
    );

    if (isCollision) {
      return res
        .status(HttpStatus.OK)
        .json(ErrorService.getError(ERROR.INVITE_ALREADY_CREATED));
    }

    const invites = await this.inviteService.createInvite(invite as Invite);
    await this.socketService.emitInvitation(invitedUserId, {
      invite: invites,
    });
    return res.status(HttpStatus.OK).json(invites);
  }
}
