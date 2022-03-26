import { Table, Column, Model, DataType } from 'sequelize-typescript';

export interface IFile {
  id: number;
  url?: string;
  mimetype: string;
  data: ArrayBuffer;
}

@Table({ timestamps: true })
export default class File extends Model {
  @Column({
    primaryKey: true,
    type: DataType.INTEGER,
    autoIncrement: true,
    allowNull: false,
    unique: true,
  })
  id!: number;

  @Column({ type: DataType.TEXT })
  filename: string;

  @Column({ type: DataType.TEXT })
  mimetype: string;

  @Column({ type: DataType.BLOB })
  data: ArrayBuffer;
}
