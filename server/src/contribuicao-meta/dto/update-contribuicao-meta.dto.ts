import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateContribuicaoMetaDto } from './create-contribuicao-meta.dto';

export class UpdateContribuicaoMetaDto extends PartialType(
  OmitType(CreateContribuicaoMetaDto, ['meta_id'] as const)
) {}
