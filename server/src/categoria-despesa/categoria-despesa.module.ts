import { Module } from '@nestjs/common';
import { CategoriaDespesaService } from './categoria-despesa.service';
import { CategoriaDespesaController } from './categoria-despesa.controller';

@Module({
  controllers: [CategoriaDespesaController],
  providers: [CategoriaDespesaService],
})
export class CategoriaDespesaModule {}
