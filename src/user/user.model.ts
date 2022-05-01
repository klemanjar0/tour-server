import {
  Table,
  Column,
  Model,
  DataType,
  BeforeCreate,
  BeforeUpdate,
  BelongsToMany,
  HasMany,
  ForeignKey,
  HasOne,
} from 'sequelize-typescript';
import { IUser, UserRoles } from './entity';
import * as bcrypt from 'bcryptjs';
import Event from '../event/event.model';
import EventToUser from '../event/event_to_user.model';
import File from '../database/file.model';
import Notification from '../notifications/notification.model';
import Balance from '../balance/balance.model';

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

  @ForeignKey(() => File)
  @Column({ type: DataType.INTEGER, allowNull: true })
  fileId: number;

  @BelongsToMany(() => Event, () => EventToUser)
  events: Event[];

  @HasMany(() => Notification)
  notifications: Notification[];

  @HasOne(() => Balance)
  balance: Balance;

  public static hash(data: string) {
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
    if (instance?.pwdHash) {
      instance.pwdHash = await this.hash(instance.pwdHash);
    }
  }
}
