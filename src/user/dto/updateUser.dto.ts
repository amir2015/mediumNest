import { IsEmail } from 'class-validator';

export class UpdateUserDto {
  username: string;
  
  email: string;
  password: string;
  bio: string;
  image: string;
}
