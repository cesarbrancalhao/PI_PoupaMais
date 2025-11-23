import { IsEmail, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyPasswordResetDto {
  @ApiProperty({ example: 'user@example.com', description: 'Email do usuário' })
  @IsEmail({}, { message: 'Email inválido' })
  email: string;

  @ApiProperty({ example: 'ABC123', description: 'Código de verificação de 6 caracteres' })
  @IsString()
  @Length(6, 6, { message: 'O código deve ter 6 caracteres' })
  code: string;
}
