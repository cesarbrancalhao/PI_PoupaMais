import { Controller, Get, Put, Delete, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Obter perfil do usuário atual' })
  @ApiResponse({ status: 200, description: 'Perfil recuperado com sucesso' })
  async getProfile(@Request() req) {
    return this.usersService.findById(req.user.userId);
  }

  @Put('profile')
  @ApiOperation({ summary: 'Atualizar perfil do usuário' })
  @ApiResponse({ status: 200, description: 'Perfil atualizado com sucesso' })
  async updateProfile(@Request() req, @Body() updateProfileDto: UpdateProfileDto) {
    return this.usersService.updateProfile(
      req.user.userId,
      updateProfileDto.nome,
      updateProfileDto.email,
    );
  }

  @Delete('account')
  @ApiOperation({ summary: 'Excluir conta do usuário' })
  @ApiResponse({ status: 200, description: 'Conta excluída com sucesso' })
  async deleteAccount(@Request() req) {
    return this.usersService.deleteAccount(req.user.userId);
  }
}
