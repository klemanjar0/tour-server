import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import User from '../user/user.model';

export interface IBalance {
  id: number;
  account: number;
  userId: number;
  user: User;
}

@Table({ timestamps: true })
export default class Balance extends Model<IBalance> {
  @Column({
    primaryKey: true,
    type: DataType.INTEGER,
    autoIncrement: true,
    allowNull: false,
    unique: true,
  })
  id!: number;

  @Column({
    type: DataType.DOUBLE,
    allowNull: false,
    defaultValue: 0.0,
  })
  account!: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  userId: number;
  @BelongsTo(() => User)
  user: User[];
}
