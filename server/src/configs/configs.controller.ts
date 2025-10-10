import { Controller, Get, Put, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ConfigsService } from './configs.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateConfigDto } from './dto/update-config.dto';

@ApiTags('configs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('configs')
export class ConfigsController {
  constructor(private configsService: ConfigsService) {}

  @Get()
  async getConfig(@Request() req) {
    return this.configsService.getConfig(req.user.userId);
  }

  @Put()
  async updateConfig(@Request() req, @Body() updateConfigDto: UpdateConfigDto) {
    return this.configsService.updateConfig(
      req.user.userId,
      updateConfigDto.tema,
      updateConfigDto.idioma,
      updateConfigDto.moeda,
    );
  }
}
