import {
  Table,
  Column,
  Model,
  DataType,
  BeforeCreate,
  BeforeUpdate,
} from 'sequelize-typescript';
import { IUser, UserRoles } from './entity';
import * as bcrypt from 'bcryptjs';

@Table({ timestamps: true })
export default class User extends Model<IUser> {
  @Column({
    primaryKey: true,
    type: DataType.INTEGER,
    autoIncrement: true,
    allowNull: false,
    unique: true,
  })
  id!: number;

  @Column({ type: DataType.TEXT })
  username!: string;

  @Column({ type: DataType.TEXT })
  email!: string;

  @Column({ type: DataType.TEXT })
  pwdHash!: string;

  @Column({ type: DataType.INTEGER, defaultValue: UserRoles.USER })
  role!: UserRoles;

  private static hash(data: string) {
    return new Promise<string>((resolve, reject) => {
      bcrypt.hash(data, 10, (err, hash) => {
        if (err) {
          reject(err);
        } else {
          resolve(hash);
        }
      });
    });
  }

  @BeforeUpdate
  @BeforeCreate
  static async hashPassword(instance: User) {
    instance.pwdHash = await this.hash(instance.pwdHash);
  }
}
