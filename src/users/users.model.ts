import { BelongsToMany, Column, DataType, Model, Table } from "sequelize-typescript";
import { ApiProperty } from "@nestjs/swagger";
import { Role } from "../roles/roles.model";
import { UserRoles } from "../roles/user-roles.model";

interface UserCreationAttrs {
  email: string;
  password: string;
}

@Table({tableName: "users"})
export class User extends Model<User,UserCreationAttrs >{
  @ApiProperty({example: 1, description: "unique ID"})
  @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
  id: number;

  @ApiProperty({example: "test@gmail.com", description: "User email"})
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  email: string;

  @ApiProperty({example: "qwerty123", description: "User password"})
  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @ApiProperty({example: "true", description: "User banned status"})
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  banned: boolean;

  @ApiProperty({example: "some reason", description: "User banned reason"})
  @Column({ type: DataType.STRING, allowNull: true })
  banReason: string;

  @BelongsToMany(() => Role, () => UserRoles)
  roles: Role[]
}