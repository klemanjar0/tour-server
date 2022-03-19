import {
  Table,
  Column,
  Model,
  DataType,
  BelongsToMany,
} from 'sequelize-typescript';
import { EventStatuses, IEvent } from './entity';
import EventToUser from './event_to_user.model';
import User from '../user/user.model';

@Table({ timestamps: true })
export default class Event extends Model<IEvent> {
  @Column({
    primaryKey: true,
    type: DataType.INTEGER,
    autoIncrement: true,
    allowNull: false,
    unique: true,
  })
  id!: number;

  @Column({ type: DataType.TEXT, allowNull: false })
  title!: string;

  @Column({ type: DataType.TEXT })
  type: string;

  @Column({ type: DataType.TEXT })
  description: string;

  @Column({ type: DataType.TEXT })
  country: string;

  @Column({ type: DataType.DOUBLE, allowNull: false })
  prizeFund: number;

  @Column({
    type: DataType.INTEGER,
    defaultValue: EventStatuses.CREATED,
  })
  status: EventStatuses;

  @Column({ type: DataType.TEXT })
  twitchUrl: string;

  @BelongsToMany(() => User, () => EventToUser)
  users: User[];
}
