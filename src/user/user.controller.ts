import {
  Controller,
  Post,
  Body,
  } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserResponse } from './types/userResponse.interface';
import { hash } from 'bcrypt';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()

  async registerUser(
    @Body('user') registerUserDto: RegisterUserDto,
  ): Promise<UserResponse> {
    const user = await this.userService.registerUser(registerUserDto);
    user.hashPassword = async function () {
      this.password = await hash(this.password, 10);
    };
    return this.userService.buildResponse(user);
  }
}
