import { HttpException, HttpStatus, Injectable, Post, UnauthorizedException } from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import * as bcryptjs from "bcryptjs";

import { CreateUserDto } from "../users/dto/create-user.dto";
import { UsersService } from "../users/users.service";
import { User } from "../users/users.model";

@Injectable()
export class AuthService {
  constructor(private userService: UsersService, private jwtService: JwtService) {
  }
  async login(userDto: CreateUserDto) {
    const user = await this.validateUser(userDto);

    return this.generateToken(user);
  }

  async registration(userDto: CreateUserDto) {
    const candidate = await this.userService.getUserByEmail(userDto.email);

    if(candidate) {
      throw new HttpException('User with this email is already exist', HttpStatus.BAD_REQUEST)
    }
    const hashPassword = await bcryptjs.hash(userDto.password, 5);
    const user = await this.userService.createUser({...userDto, password: hashPassword});

    return this.generateToken(user);
  }

  private async generateToken(user: User) {
    const payload = {email: user.email, id: user.id, roles: user.roles }

    return {
      token: this.jwtService.sign(payload)
    }
  }

  private async validateUser(userDto: CreateUserDto) {
    const user = await this.userService.getUserByEmail(userDto.email);

    const passwordEquals = await bcryptjs.compare(userDto.password, user.password);

    if(user && passwordEquals) {
      return user
    }
    throw new UnauthorizedException({
      message: "Incorrect password or email"
    })
  }
}
