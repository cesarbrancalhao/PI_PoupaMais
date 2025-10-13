import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFonteReceitaDto {
  @ApiProperty({ example: 'Salário' })
  @IsString()
  nome: string;

  @ApiProperty({ example: '#4CAF50', required: false })
  @IsString()
  @IsOptional()
  cor?: string;
}
