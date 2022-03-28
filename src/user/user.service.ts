import { Injectable } from '@nestjs/common';
import User from './user.model';
import { omit } from 'lodash';
import { FindUsersOptions, IUser } from './entity';
import { Op } from '@sequelize/core';

@Injectable()
export class UserService {
  async create(user: User): Promise<User | null> {
    return await User.create(user);
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
