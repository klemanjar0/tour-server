import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import User from '../user/user.model';

export interface INotification {
  id: number;
  title: string;
  body: string;
  seen: boolean;
  userId: number;
  user: User;
}

@Table({ timestamps: true })
export default class Notification extends Model<INotification> {
  @Column({
    primaryKey: true,
    type: DataType.INTEGER,
    autoIncrement: true,
    allowNull: false,
    unique: true,
  })
  id!: number;

  @Column({ type: DataType.TEXT })
  title: string;

  @Column({ type: DataType.TEXT })
  body: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  seen: boolean;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @BelongsTo(() => User)
  user: User;
}
