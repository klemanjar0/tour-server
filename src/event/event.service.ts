import { Injectable } from '@nestjs/common';
import Event from './event.model';
import EventToUser from './event_to_user.model';
import sequelize from '../database';
import Sequelize, { Transaction } from 'sequelize';
import User from '../user/user.model';
import ErrorService, { ERROR } from '../utils/errors';
import { EventParams, EventRoles, EventStatuses } from './entity';
import { maxBy } from 'lodash';
import Balance from '../balance/balance.model';
import { HTTPError } from '../utils/entities';

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

          const prizeValue = createdEvent.prizeFund;
          const balance = await Balance.findOne({
            where: { userId: userId },
            transaction: t,
          });
          const initialBalance = Number(balance.account);
          balance.account = initialBalance - Number(prizeValue);
          if (balance.account < 0) throw new Error();
          await balance.save({ transaction: t });

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

  async getById(id: number, userId: number) {
    const event = await Event.findOne({ where: { id: id } });
    const relation = await EventToUser.findOne({
      where: { eventId: id, userId: userId },
    });
    return {
      ...event.toJSON(),
      myRole: relation.role,
      isActive: relation.isActive,
    };
  }

  async isAdminOnEvent(userId: number, eventId: number) {
    const relation = await EventToUser.findOne({
      where: { userId: userId, eventId: eventId },
    });

    return relation.role >= EventRoles.OWNER;
  }

  async updateStatus(
    eventId: number,
    status: EventStatuses,
  ): Promise<Event | HTTPError> {
    try {
      return await sequelize.transaction(async (t: Transaction) => {
        await Event.update(
          {
            status: status,
          },
          {
            where: {
              id: eventId,
            },
            transaction: t,
          },
        );
        if (status === EventStatuses.CLOSED) {
          const event = await Event.findByPk(eventId, { transaction: t });
          const balance = await Balance.findOne({
            where: { userId: event.winnerId },
            transaction: t,
          });
          const initialBalance = Number(balance.account);
          balance.account = initialBalance + Number(event.prizeFund);
          await balance.save({ transaction: t });
        }

        return await Event.findByPk(eventId);
      });
    } catch (e) {
      return ErrorService.getError(ERROR.DATABASE);
    }
  }

  async setWinner(userId: number, eventId: number) {
    return await Event.update(
      {
        winnerId: userId,
      },
      {
        where: {
          id: eventId,
        },
      },
    );
  }

  async getAllUserEvents(
    userId: number,
    start: number,
    limit: number,
    searchParams?: EventParams,
  ) {
    const { onlyMy = false, prizeMin = null, prizeMax = null } = searchParams;

    const searchOnlyMy = onlyMy
      ? {
          role: EventRoles.OWNER,
        }
      : undefined;

    return (
      (await Event.findAll({
        include: [
          {
            model: User,
            where: { id: userId },
            through: {
              attributes: ['role'],
              where: searchOnlyMy,
            },
          },
        ],
        offset: start || 0,
        limit: limit === -1 ? undefined : limit,
        where: {
          prizeFund: {
            [Sequelize.Op.gte]: prizeMin || 0,
            [Sequelize.Op.lte]: prizeMax || Number.MAX_SAFE_INTEGER,
          },
        },
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
    try {
      return await sequelize.transaction(async (t: Transaction) => {
        const relation = await EventToUser.findOne({
          where: {
            userId: ownerId,
            eventId: id,
          },
          transaction: t,
        });
        if (relation.role >= EventRoles.OWNER) {
          const event = await Event.findByPk(id, { transaction: t });
          if (event.status < EventStatuses.CLOSED) {
            const balance = await Balance.findOne({
              where: { userId: ownerId },
              transaction: t,
            });
            const initialBalance = Number(balance.account);
            balance.account = initialBalance + Number(event.prizeFund);
            await balance.save({ transaction: t });
          }
          await Event.destroy({ where: { id: id }, transaction: t });
          return event;
        } else {
          return ErrorService.getError(ERROR.NO_ACCESS);
        }
      });
    } catch (e) {
      return ErrorService.getError(ERROR.DATABASE);
    }
  }

  async getMyMaxPrize(userId: number) {
    const events = await Event.findAll({
      include: [
        {
          model: User,
          where: { id: userId },
        },
      ],
    }); // issue, investigate how to use max in many-to-many assotiations
    return maxBy(events, 'prizeFund')?.prizeFund;
  }

  async getEventUsers(id: number) {
    return (await Event.findOne({ include: User, where: { id: id } })).users;
  }

  async canUserBeRemoved(
    userId: number,
    idToRemove: number,
    eventId: number,
  ): Promise<boolean> {
    const userRoleInEvent = await EventToUser.findOne({
      where: { userId: userId, eventId: eventId },
    });

    return userRoleInEvent.role >= EventRoles.OWNER || userId === idToRemove;
  }

  async removeUserFromEvent(userId: number, eventId: number) {
    return await EventToUser.destroy({
      where: {
        userId: userId,
        eventId: eventId,
      },
    });
  }
}
