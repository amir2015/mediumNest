import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { sign } from 'jsonwebtoken';
import { LoginUserDto } from './dto/login-user.dto';
import { compare } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  async registerUser(registerUserDto: RegisterUserDto) {
    const userExist = await this.userRepository.findOne({
      where: { email: registerUserDto.email },
    });
    if (userExist) {
      throw new HttpException(
        'Email already exist',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const user = new User();
    Object.assign(user, registerUserDto);
    return await this.userRepository.save(user);
  }
  async loginUser(loginUserDto: LoginUserDto): Promise<User> {
    const { email, password } = loginUserDto;
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'username', 'password', 'image'],
    });
    if (!user) {
      throw new NotFoundException('User Not found');
    }
    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      throw new NotFoundException('Credentials not valid, please try again');
    }
    delete user.password;
    return user;
  }
  generateJwtToken(user: User): string {
    return sign(
      {
        id: user.id,
        email: user.email,
        username: user.username,
        image: user.image,
      },
      'secret',
      { expiresIn: '2d' },
    );
  }
  buildResponse(user: User) {
    return {
      user: {
        ...user,
        token: this.generateJwtToken(user),
      },
    };
  }
}
