import { Injectable } from '@nestjs/common';
import Event from './event.model';
import EventToUser from './event_to_user.model';
import sequelize from '../database';
import { Transaction } from 'sequelize';
import User from '../user/user.model';
import ErrorService, { ERROR } from '../utils/errors';
import { EventRoles } from './entity';

@Injectable()
export class EventService {
  async create(event: Event, userId: number) {
    try {
      return (
        (await sequelize.transaction(async (t: Transaction) => {
          const createdEvent = await Event.create(event, { transaction: t });
          const relation = {
            userId: userId,
            eventId: createdEvent.id,
            role: EventRoles.OWNER,
          };
          await EventToUser.create(relation, {
            transaction: t,
          });

          return await Event.findOne({
            where: { id: createdEvent.id },
            include: User,
            transaction: t,
          });
        })) || ([] as Event[])
      );
    } catch (e: any) {
      return ErrorService.getError(ERROR.DATABASE);
    }
  }

  async getAllUserEvents(userId: number, start: number, limit: number) {
    return (
      (await Event.findAll({
        include: [
          {
            model: User,
            where: { id: userId },
          },
        ],
        offset: start || 0,
        limit: limit === -1 ? undefined : limit,
      })) || ([] as Event[])
    );
  }

  async checkUserCanAddGivenRole(ownerId: number, eventId: number) {
    const relation = await EventToUser.findOne({
      where: {
        userId: ownerId,
        eventId: eventId,
      },
    });

    if (relation.role >= EventRoles.OWNER) {
      return true;
    }

    return false;
  }

  async addUserToEvent(eventId: number, userId: number, role: EventRoles) {
    try {
      return await sequelize.transaction(async (t: Transaction) => {
        const relation = {
          userId: userId,
          eventId: eventId,
          role: role,
        };

        const relationExists = await EventToUser.findOne({
          where: {
            userId: userId,
            eventId: eventId,
          },
        });

        if (relationExists) {
          throw new Error('relationExists');
        }

        await EventToUser.create(relation, {
          transaction: t,
        });

        return await Event.findOne({
          where: { id: eventId },
          include: User,
          transaction: t,
        });
      });
    } catch (e: any) {
      if (e.message === 'relationExists') {
        return ErrorService.getError(ERROR.ENTITY_DUBLICATE);
      }
      return ErrorService.getError(ERROR.DATABASE);
    }
  }

  async deleteEvent(id: number, ownerId: number) {
    const relation = await EventToUser.findOne({
      where: {
        userId: ownerId,
        eventId: id,
      },
    });
    if (relation.role >= EventRoles.OWNER) {
      return await Event.destroy({ where: { id: id } });
    } else {
      return ErrorService.getError(ERROR.NO_ACCESS);
    }
  }
}
