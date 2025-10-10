import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigsModule } from './configs/configs.module';
import { CategoriaDespesaModule } from './categoria-despesa/categoria-despesa.module';
import { FonteReceitaModule } from './fonte-receita/fonte-receita.module';
import { DespesasModule } from './despesas/despesas.module';
import { ReceitasModule } from './receitas/receitas.module';
import { MetasModule } from './metas/metas.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    ConfigsModule,
    CategoriaDespesaModule,
    FonteReceitaModule,
    DespesasModule,
    ReceitasModule,
    MetasModule,
  ],
})
export class AppModule {}
