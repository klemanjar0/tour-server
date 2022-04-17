import { Injectable } from '@nestjs/common';
import Invite from './invite.model';
import { InviteStatus } from './entity';
import Event from '../event/event.model';
import EventToUser from '../event/event_to_user.model';

@Injectable()
export class InviteService {
  async createInvite(invite: Invite) {
    return await Invite.create(invite);
  }
  async getInviteCollision(invitedUserId: number, eventId: number) {
    const existsActiveInvite = await Invite.findOne({
      where: {
        invitedUserId: invitedUserId,
        eventId: eventId,
      },
    });
    const userAlreadyInEvent = await EventToUser.findOne({
      where: {
        userId: invitedUserId,
        eventId: eventId,
      },
    });
    return existsActiveInvite || userAlreadyInEvent;
  }
  async getInvites(userId: number) {
    const invites = await Invite.findAll({
      include: Event,
      where: { invitedUserId: userId },
    });
    return invites;
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
  async getById(id: number) {
    return await Invite.findOne({ where: { id: id } });
  }
}
