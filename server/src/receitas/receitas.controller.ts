import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ReceitasService } from './receitas.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateReceitaDto } from './dto/create-receita.dto';
import { UpdateReceitaDto } from './dto/update-receita.dto';
import { CreateReceitaExclusaoDto } from './dto/create-receita-exclusao.dto';
import { PaginationQueryDto } from '../common/dto/pagination.dto';

@ApiTags('receitas')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('receitas')
export class ReceitasController {
  constructor(private service: ReceitasService) {}

  @Post()
  create(@Request() req, @Body() body: CreateReceitaDto) {
    return this.service.create(req.user.userId, body);
  }

  @Get()
  findAll(@Request() req, @Query() paginationQuery: PaginationQueryDto) {
    return this.service.findAll(req.user.userId, paginationQuery.page, paginationQuery.limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.service.findOne(+id, req.user.userId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Request() req, @Body() body: UpdateReceitaDto) {
    return this.service.update(+id, req.user.userId, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.service.remove(+id, req.user.userId);
  }

  @Post(':id/exclusoes')
  createExclusao(@Param('id') id: string, @Request() req, @Body() createExclusaoDto: CreateReceitaExclusaoDto) {
    return this.service.createExclusao(+id, req.user.userId, createExclusaoDto);
  }

  @Get('exclusoes/all')
  findAllExclusoes(@Request() req) {
    return this.service.findAllExclusoes(req.user.userId);
  }

  @Delete('exclusoes/:id')
  removeExclusao(@Param('id') id: string, @Request() req) {
    return this.service.removeExclusao(+id, req.user.userId);
  }
}
