import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import User from '../user/user.model';
import Event from '../event/event.model';
import { InviteStatus } from './entity';

export interface IInvite {
  id: number;
  status: InviteStatus;
  userId: number;
  invitedUserId: number;
  eventId: number;
  event: Event;
}

@Table({ timestamps: true })
export default class Invite extends Model<IInvite> {
  @Column({
    primaryKey: true,
    type: DataType.INTEGER,
    autoIncrement: true,
    allowNull: false,
    unique: true,
  })
  id!: number;

  @Column({ type: DataType.INTEGER, defaultValue: InviteStatus.NEW })
  status?: InviteStatus;

  @ForeignKey(() => User)
  @Column
  userId: number; // owner

  @ForeignKey(() => User)
  @Column
  invitedUserId: number;

  @ForeignKey(() => Event)
  @Column
  eventId: number;

  @BelongsTo(() => Event)
  event?: Event;
}
