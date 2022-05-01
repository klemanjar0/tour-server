import { Injectable } from '@nestjs/common';
import User from './user.model';
import { omit, map, filter } from 'lodash';
import { FindUsersOptions } from './entity';
import { Op } from '@sequelize/core';
import sequelize from '../database';
import { Transaction } from 'sequelize';
import ErrorService, { ERROR } from '../utils/errors';
import { HTTPError } from '../utils/entities';
import Balance from '../balance/balance.model';

@Injectable()
export class UserService {
  async create(user: User): Promise<User | HTTPError | null> {
    try {
      return await sequelize.transaction(async (t: Transaction) => {
        const data = await User.create(user, { transaction: t });
        await Balance.create({ userId: data.id }, { transaction: t });
        return data;
      });
    } catch (e: any) {
      return ErrorService.getError(ERROR.DATABASE);
    }
  }
  async getAll(): Promise<Array<User> | []> {
    return await User.findAll();
  }
  async getById(id: number): Promise<User | null> {
    return await User.findByPk(id);
  }
  async getByUsername(username: string): Promise<User | null> {
    return await User.findOne({ where: { username: username } });
  }
  async findUserNames(query: string, userId: number): Promise<string[]> {
    const users = await User.findAll({
      where: {
        username: {
          [Op.like as unknown as string]: `%${query}%`,
        },
      },
      limit: 10,
    });

    return map(
      filter(users, (user) => user.id !== userId),
      (user) => user.username,
    );
  }
  async findUsers(options: FindUsersOptions): Promise<Array<User> | []> {
    const { searchQuery, fieldName, limit = undefined } = options;
    return await User.findAll({
      where: {
        [fieldName]: {
          [Op.iLike as unknown as string]: `%${searchQuery}%` as string,
        },
      },
      limit: limit,
    });
  }
  async getByEmail(email: string): Promise<User | null> {
    return await User.findOne({ where: { email: email } });
  }
  async delete(id: number): Promise<number | null> {
    return await User.destroy({
      where: {
        id: id,
      },
    });
  }
  async update(id: number, user: User): Promise<[affectedCount: number]> {
    const userButPassword = omit(user, ['pwdHash']);
    return await User.update(userButPassword, {
      where: { id: id },
    });
  }
  async updatePassword(
    id: number,
    newPassword: string,
  ): Promise<[affectedCount: number]> {
    return await User.update(
      { pwdHash: newPassword },
      {
        where: { id: id },
        individualHooks: true,
      },
    );
  }
}
