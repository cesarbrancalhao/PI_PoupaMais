import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { MetasService } from './metas.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('metas')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('metas')
export class MetasController {
  constructor(private service: MetasService) {}

  @Post()
  create(@Request() req, @Body() body: any) {
    return this.service.create(req.user.userId, body);
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
  update(@Param('id') id: string, @Request() req, @Body() body: any) {
    return this.service.update(+id, req.user.userId, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.service.remove(+id, req.user.userId);
  }
}
