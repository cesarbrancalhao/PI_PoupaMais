import { IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReceitaExclusaoDto {
  @ApiProperty({ example: '2025-11-01', description: 'Data da exclusão (mês que não deve aparecer)' })
  @IsDateString()
  data_exclusao: string;
}

