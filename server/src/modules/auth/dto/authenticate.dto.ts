import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AuthenticateDto {
  @IsOptional()
  @IsString()
  readonly user_id: string;

  @IsNotEmpty()
  @IsString()
  readonly password: string;
}
