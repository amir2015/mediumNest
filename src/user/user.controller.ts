import {
  Controller,
  Post,
  Body,
  Get,
  Req,
  UseGuards,
  Put,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserResponse } from './types/userResponse.interface';
import { hash } from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { ExpressRequest } from 'src/types/expressRequest.interface';
import { User } from './decorators/user.decorators';
import { AuthGuard } from './dto/guards/auth.guard';
import { UpdateUserDto } from './dto/updateUser.dto';

@Controller("users")
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
  @UseGuards(AuthGuard)
  @Get('users/me')
  async currentUser(
    @Req() request: ExpressRequest,
    @User() user: any,
  ): Promise<any> {
    console.log(user);
    return this.userService.buildResponse(request.user);
  }
  @Put('user')
  async updateCurrentUser(
    @User('id') currentUserId: number,
    @Body('user') updateUserDto: UpdateUserDto,
  ): Promise<UserResponse> {
    const user = await this.userService.updateUser(
      currentUserId,
      updateUserDto,
    );
    return this.userService.buildResponse(user);
  }
}
