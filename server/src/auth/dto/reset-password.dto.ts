import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({ example: 'user@example.com', description: 'Email do usuário' })
  @IsEmail({}, { message: 'Email inválido' })
  email: string;

  @ApiProperty({ example: 'ABC123', description: 'Código de verificação de 6 caracteres' })
  @IsString()
  @MinLength(6, { message: 'O código deve ter no mínimo 6 caracteres' })
  code: string;

  @ApiProperty({ example: 'newpassword123', description: 'Nova senha do usuário' })
  @IsString()
  @MinLength(8, { message: 'A senha deve ter no mínimo 8 caracteres' })
  newPassword: string;
}
