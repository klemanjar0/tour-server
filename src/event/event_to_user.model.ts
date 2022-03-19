import {
  Column,
  DataType,
  Model,
  Table,
  ForeignKey,
} from 'sequelize-typescript';
import User from '../user/user.model';
import Event from './event.model';
import { IUserToEvent } from './entity';

@Table({ timestamps: true })
export default class EventToUser extends Model<IUserToEvent> {
  @Column({
    primaryKey: true,
    type: DataType.INTEGER,
    autoIncrement: true,
    allowNull: false,
    unique: true,
  })
  id!: number;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @ForeignKey(() => Event)
  @Column
  eventId: number;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  isActive: boolean;
}
