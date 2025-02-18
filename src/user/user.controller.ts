import { Controller, Post, Body, Get, Req } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserResponse } from './types/userResponse.interface';
import { hash } from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { request } from 'http';
import { ExpressRequest } from 'src/types/expressRequest.interface';

@Controller()
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
  @Post('login')
  async loginUser(
    @Body('user') loginUserDto: LoginUserDto,
  ): Promise<UserResponse> {
    const user = await this.userService.loginUser(loginUserDto);
    return this.userService.buildResponse(user);
  }
  @Get('users/me')
  async currentUser(@Req() request: ExpressRequest): Promise<any> {
    return this.userService.buildResponse(request.user);
  }
}
