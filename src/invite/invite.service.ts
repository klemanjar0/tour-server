import { Injectable } from '@nestjs/common';
import Invite from './invite.model';
import { InviteStatus } from './entity';

@Injectable()
export class InviteService {
  async createInvite(invite: Invite) {
    return await Invite.create(invite);
  }
  async getInviteCollision(invitedUserId: number, eventId: number) {
    return await Invite.findOne({
      where: {
        invitedUserId: invitedUserId,
        eventId: eventId,
      },
    });
  }
  async changeInviteStatus(id: number, status: InviteStatus) {
    return await Invite.update(
      { status: status },
      {
        where: { id: id },
      },
    );
  }
  async deleteInvite(id: number) {
    return await Invite.destroy({ where: { id: id } });
  }
}
