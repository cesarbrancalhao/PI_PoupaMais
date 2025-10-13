import { PartialType } from '@nestjs/swagger';
import { CreateCategoriaDespesaDto } from './create-categoria-despesa.dto';

export class UpdateCategoriaDespesaDto extends PartialType(CreateCategoriaDespesaDto) {}
