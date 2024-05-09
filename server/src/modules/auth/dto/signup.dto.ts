import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
export class SignupDto {
  @IsString()
  @IsOptional()
  readonly user_id: string;

  @IsString()
  @IsOptional()
  readonly team: string;

  @IsString()
  @IsOptional()
  readonly name: string;

  @IsEmail()
  @IsOptional()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  readonly password: string;

  @IsNotEmpty()
  @IsString()
  readonly role: string;
}
