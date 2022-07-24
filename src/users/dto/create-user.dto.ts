import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Length } from "class-validator";

export class CreateUserDto {
  @ApiProperty({example: "test@gmail.com", description: "User email"})
  @IsString({message: 'Must be string'})
  @IsEmail({}, {message: 'Incorrect email'})
  readonly email: string;

  @ApiProperty({example: "qwerty123", description: "User password"})
  @IsString({message: 'Must be string'})
  @Length(8, 12, {message: 'Min length 8 and max 12'})
  readonly password: string;
}
