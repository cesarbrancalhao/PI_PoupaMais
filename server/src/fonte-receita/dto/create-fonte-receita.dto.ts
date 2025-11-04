import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFonteReceitaDto {
  @ApiProperty({ example: 'Salário' })
  @IsString()
  nome: string;

  @ApiProperty({ example: 'DollarSign', required: false })
  @IsString()
  @IsOptional()
  icone?: string;
}
