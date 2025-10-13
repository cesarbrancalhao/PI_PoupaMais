import { PartialType } from '@nestjs/swagger';
import { CreateFonteReceitaDto } from './create-fonte-receita.dto';

export class UpdateFonteReceitaDto extends PartialType(CreateFonteReceitaDto) {}
