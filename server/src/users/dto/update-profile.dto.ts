import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiProperty({ example: 'Usuario da Silva' })
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiProperty({ example: 'usuario@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
