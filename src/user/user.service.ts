import { Injectable } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { sign } from 'jsonwebtoken';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  async registerUser(registerUserDto: RegisterUserDto) {
    const user = new User();
    Object.assign(user, registerUserDto);
    return await this.userRepository.save(user);

  }
  generateJwtToken(user: User): string {
    return sign(
      {
        id: user.id,
        email: user.email,
        username: user.username,
        image: user.image,
      },
      "secret",
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
