import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ContribuicaoMetaService } from './contribuicao-meta.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateContribuicaoMetaDto } from './dto/create-contribuicao-meta.dto';
import { UpdateContribuicaoMetaDto } from './dto/update-contribuicao-meta.dto';
import { PaginationQueryDto } from '../common/dto/pagination.dto';

@ApiTags('contribuicao-meta')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('contribuicao-meta')
export class ContribuicaoMetaController {
  constructor(private service: ContribuicaoMetaService) {}

  @Post()
  create(@Request() req, @Body() body: CreateContribuicaoMetaDto) {
    return this.service.create(req.user.userId, body);
  }

  @Get()
  findAll(@Request() req, @Query() paginationQuery: PaginationQueryDto) {
    return this.service.findAll(req.user.userId, paginationQuery.page, paginationQuery.limit);
  }

  @Get('meta/:metaId')
  findAllByMeta(@Param('metaId') metaId: string, @Request() req, @Query() paginationQuery: PaginationQueryDto) {
    return this.service.findAllByMeta(+metaId, req.user.userId, paginationQuery.page, paginationQuery.limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.service.findOne(+id, req.user.userId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Request() req, @Body() body: UpdateContribuicaoMetaDto) {
    return this.service.update(+id, req.user.userId, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.service.remove(+id, req.user.userId);
  }
}
