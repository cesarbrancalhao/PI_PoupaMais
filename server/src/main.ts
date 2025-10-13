import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3001',
    credentials: true,
  });

  // Prefixo global
  app.setGlobalPrefix('api/v1');

  // Pipe de validação
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Filtro de exceções
  app.useGlobalFilters(new AllExceptionsFilter());

  // Documentação Swagger
  const config = new DocumentBuilder()
    .setTitle('PoupaMais API')
    .setDescription('API de Gerenciamento de Finanças Pessoais')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const requiredEnvs = ['JWT_SECRET', 'DB_HOST', 'DB_PASSWORD'];
  requiredEnvs.forEach(variable => {
    if (!process.env[variable]) {
      throw new Error(`Variável de ambiente ${variable} não definida`);
    }
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Aplicação rodando em: http://localhost:${port}`);
  console.log(`Documentação Swagger disponível em: http://localhost:${port}/api/docs`);
}
bootstrap();
