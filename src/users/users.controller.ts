import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { UsersService } from "./users.service";

import { User } from "./users.model";

import { CreateUserDto } from "./dto/create-user.dto";

import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Roles } from "../auth/roles-auth.decorator";
import { RolesGuard } from "../auth/roles.guard";

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {
  }

  @ApiOperation({ summary: "Create user" })
  @ApiResponse({ status: 200, type: User })
  @Post()
  create(@Body() userDto: CreateUserDto) {
    return this.userService.createUser(userDto);
  }

  @ApiOperation({ summary: "Get all users" })
  @ApiResponse({ status: 200, type: [User] })
  @UseGuards(RolesGuard)
  @Roles("ADMIN")
  @Get()
  getAll() {
    return this.userService.getAllUsers();
  }
}
