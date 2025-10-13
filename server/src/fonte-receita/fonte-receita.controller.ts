import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { FonteReceitaService } from './fonte-receita.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateFonteReceitaDto } from './dto/create-fonte-receita.dto';
import { UpdateFonteReceitaDto } from './dto/update-fonte-receita.dto';

@ApiTags('fonte-receita')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('fonte-receita')
export class FonteReceitaController {
  constructor(private service: FonteReceitaService) {}

  @Post()
  create(@Request() req, @Body() body: CreateFonteReceitaDto) {
    return this.service.create(req.user.userId, body.nome, body.cor);
  }

  @Get()
  findAll(@Request() req) {
    return this.service.findAll(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.service.findOne(+id, req.user.userId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Request() req, @Body() body: UpdateFonteReceitaDto) {
    return this.service.update(+id, req.user.userId, body.nome, body.cor);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.service.remove(+id, req.user.userId);
  }
}
