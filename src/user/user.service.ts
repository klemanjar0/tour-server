import { Injectable } from '@nestjs/common';
import User from './user.model';

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
    return await User.update(user, {
      where: { id: id },
    });
  }
}
