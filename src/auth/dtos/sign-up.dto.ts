import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

export default class SignUpDto {
  @IsString()
  displayName!: string;

  @IsEmail()
  email!: string;

  @IsStrongPassword()
  password!: string;
}
