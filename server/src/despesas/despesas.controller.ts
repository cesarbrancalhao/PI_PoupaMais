import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { DespesasService } from './despesas.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateDespesaDto } from './dto/create-despesa.dto';
import { UpdateDespesaDto } from './dto/update-despesa.dto';
import { CreateDespesaExclusaoDto } from './dto/create-despesa-exclusao.dto';
import { PaginationQueryDto } from '../common/dto/pagination.dto';

@ApiTags('despesas')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('despesas')
export class DespesasController {
  constructor(private despesasService: DespesasService) {}

  @Post()
  create(@Request() req, @Body() createDespesaDto: CreateDespesaDto) {
    return this.despesasService.create(req.user.userId, createDespesaDto);
  }

  @Get()
  findAll(@Request() req, @Query() paginationQuery: PaginationQueryDto) {
    return this.despesasService.findAll(req.user.userId, paginationQuery.page, paginationQuery.limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.despesasService.findOne(+id, req.user.userId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Request() req, @Body() updateDespesaDto: UpdateDespesaDto) {
    return this.despesasService.update(+id, req.user.userId, updateDespesaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.despesasService.remove(+id, req.user.userId);
  }

  @Post(':id/exclusoes')
  createExclusao(@Param('id') id: string, @Request() req, @Body() createExclusaoDto: CreateDespesaExclusaoDto) {
    return this.despesasService.createExclusao(+id, req.user.userId, createExclusaoDto);
  }

  @Get('exclusoes/all')
  findAllExclusoes(@Request() req) {
    return this.despesasService.findAllExclusoes(req.user.userId);
  }

  @Delete('exclusoes/:id')
  removeExclusao(@Param('id') id: string, @Request() req) {
    return this.despesasService.removeExclusao(+id, req.user.userId);
  }
}
