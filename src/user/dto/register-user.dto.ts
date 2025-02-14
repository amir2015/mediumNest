export class RegisterUserDto {
@IsNotEmpty()
  username: string;
  email: string;
  password: string;
}
