import { IsEmail, IsIn, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'Usuario da Silva' })
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiProperty({ example: 'usuario@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'senha123', minLength: 8 })
  @IsString()
  @MinLength(8, { message: 'A senha deve ter no mínimo 8 caracteres' })
  password: string;

  @ApiProperty({
    example: 'ingles',
    required: false,
    enum: ['portugues', 'ingles', 'espanhol'],
    description: 'Idioma selecionado para os dados iniciais do usuário',
  })
  @IsOptional()
  @IsIn(['portugues', 'ingles', 'espanhol'])
  idioma?: 'portugues' | 'ingles' | 'espanhol';
}
