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
import { InviteService } from './invite.service';
import { getLocalUser } from '../event/event.utils';
import Invite from './invite.model';
import { UserService } from '../user/user.service';
import { SocketGateway } from '../socket/notification.gateway';
import ErrorService, { ERROR } from '../utils/errors';

@Controller('invites')
export class InviteController {
  constructor(
    private readonly inviteService: InviteService,
    private readonly userService: UserService,
    private readonly socketService: SocketGateway,
  ) {}

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
