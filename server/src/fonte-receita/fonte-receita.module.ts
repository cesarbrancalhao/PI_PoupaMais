import { Module } from '@nestjs/common';
import { FonteReceitaService } from './fonte-receita.service';
import { FonteReceitaController } from './fonte-receita.controller';

@Module({
  controllers: [FonteReceitaController],
  providers: [FonteReceitaService],
})
export class FonteReceitaModule {}
