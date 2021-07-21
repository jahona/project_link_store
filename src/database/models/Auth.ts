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
  tableName: 'Auth',
  underscored: true,
  paranoid: true,
})
export class Auth extends Model {
  @PrimaryKey
  @AllowNull(false)
  @Column(DataType.STRING)
  userKey: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  secret: string;

  @AllowNull(false)
  @Column(DataType.DATE)
  lastLoginTimestamp: Date;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.BOOLEAN)
  expired: boolean;

  @CreatedAt
  createDate: Date;

  @UpdatedAt
  updateDate: Date;

  @DeletedAt
  deleteDate: Date;
}

