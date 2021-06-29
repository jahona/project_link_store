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
} from 'sequelize-typescript';

@Table({
  tableName: 'Page',
  underscored: true,
  paranoid: true,
})
export class Page extends Model {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column(DataType.INTEGER({ scale: 11 }).UNSIGNED)
  id: number;

  @AllowNull
  @Column(DataType.STRING)
  link: string;

  @AllowNull
  @Column(DataType.STRING)
  title: string;

  @AllowNull
  @Column(DataType.STRING)
  content: string;

  @AllowNull
  @Column(DataType.STRING)
  words: string;

  @CreatedAt
  createDate: Date;

  @UpdatedAt
  updateDate: Date;

  @DeletedAt
  deleteDate: Date;
}

