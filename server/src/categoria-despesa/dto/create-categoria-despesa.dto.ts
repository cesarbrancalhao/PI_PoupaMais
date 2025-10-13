import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoriaDespesaDto {
  @ApiProperty({ example: 'Alimentação' })
  @IsString()
  nome: string;

  @ApiProperty({ example: '#FF5733', required: false })
  @IsString()
  @IsOptional()
  cor?: string;
}
