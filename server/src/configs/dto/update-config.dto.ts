import { IsBoolean, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateConfigDto {
  @ApiProperty({ example: false })
  @IsBoolean()
  tema: boolean;

  @ApiProperty({ example: 'portugues', enum: ['portugues', 'ingles', 'espanhol'] })
  @IsEnum(['portugues', 'ingles', 'espanhol'])
  idioma: string;

  @ApiProperty({ example: 'real', enum: ['real', 'dolar', 'euro'] })
  @IsEnum(['real', 'dolar', 'euro'])
  moeda: string;
}
