import { Module } from '@nestjs/common';
import { ContribuicaoMetaController } from './contribuicao-meta.controller';
import { ContribuicaoMetaService } from './contribuicao-meta.service';

@Module({
  controllers: [ContribuicaoMetaController],
  providers: [ContribuicaoMetaService],
})
export class ContribuicaoMetaModule {}
