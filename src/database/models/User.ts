import {
  Model,
  Table,
  Column,
  Index,
  DataType,
  PrimaryKey,
  AllowNull,
  AutoIncrement,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  BeforeCreate,
  BeforeUpdate,
  BeforeSave,
  BeforeUpsert,
  Default,
} from 'sequelize-typescript';

@Table({
  tableName: 'User',
  underscored: true,
  paranoid: true,
})
export class User extends Model {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column(DataType.INTEGER({ scale: 11 }).UNSIGNED)
  id: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  userKey: string;

  @CreatedAt
  createDate: Date;

  @UpdatedAt
  updateDate: Date;

  @DeletedAt
  deleteDate: Date;
}

