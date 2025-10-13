import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CategoriaDespesaService } from './categoria-despesa.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateCategoriaDespesaDto } from './dto/create-categoria-despesa.dto';
import { UpdateCategoriaDespesaDto } from './dto/update-categoria-despesa.dto';

@ApiTags('categoria-despesa')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('categoria-despesa')
export class CategoriaDespesaController {
  constructor(private service: CategoriaDespesaService) {}

  @Post()
  create(@Request() req, @Body() body: CreateCategoriaDespesaDto) {
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
  update(@Param('id') id: string, @Request() req, @Body() body: UpdateCategoriaDespesaDto) {
    return this.service.update(+id, req.user.userId, body.nome, body.cor);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.service.remove(+id, req.user.userId);
  }
}
