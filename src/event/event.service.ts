import { Injectable } from '@nestjs/common';
import Event from './event.model';
import EventToUser from './event_to_user.model';
import sequelize from '../database';
import { Transaction } from 'sequelize';
import User from '../user/user.model';
import ErrorService, { ERROR } from '../utils/errors';

@Injectable()
export class EventService {
  async create(event: Event, userId: number) {
    try {
      return await sequelize.transaction(async (t: Transaction) => {
        const createdEvent = await Event.create(event, { transaction: t });
        const relation = {
          userId: userId,
          eventId: createdEvent.id,
        };
        await EventToUser.create(relation, {
          transaction: t,
        });

        return await Event.findOne({
          where: { id: createdEvent.id },
          include: User,
          transaction: t,
        });
      });
    } catch (e: any) {
      return ErrorService.getError(ERROR.DATABASE);
    }
  }
}
