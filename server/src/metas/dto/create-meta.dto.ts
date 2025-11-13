import { IsString, IsNumber, IsDateString, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMetaDto {
  @ApiProperty({ example: 'Viagem para Europa' })
  @IsString()
  nome: string;

  @ApiProperty({ example: 'Planejando uma viagem para conhecer a Europa', required: false })
  @IsString()
  @IsOptional()
  descricao?: string;

  @ApiProperty({ example: 5000.00 })
  @IsNumber()
  @Min(0.01)
  valor: number;

  @ApiProperty({ example: 500.00, required: false })
  @IsNumber()
  @IsOptional()
  @Min(0)
  economia_mensal?: number;

  @ApiProperty({ example: '2025-10-09', required: false })
  @IsDateString()
  @IsOptional()
  data_inicio?: string;

  @ApiProperty({ example: '2026-12-31', required: false })
  @IsDateString()
  @IsOptional()
  data_alvo?: string;
}
