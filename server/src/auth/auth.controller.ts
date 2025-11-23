import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { VerificationService } from './verification.service';
import { PasswordResetService } from './password-reset.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyCodeDto } from './dto/verify-code.dto';
import { RequestPasswordResetDto } from './dto/request-password-reset.dto';
import { VerifyPasswordResetDto } from './dto/verify-password-reset.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private verificationService: VerificationService,
    private passwordResetService: PasswordResetService,
  ) {}

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('register')
  @ApiOperation({ summary: 'Iniciar registro - envia código de verificação por email' })
  @ApiResponse({ status: 201, description: 'Código de verificação enviado' })
  @ApiResponse({ status: 400, description: 'Requisição inválida' })
  async register(@Body() registerDto: RegisterDto) {
    await this.verificationService.createVerification(
      registerDto.nome,
      registerDto.email,
      registerDto.password,
      registerDto.idioma,
    );
    return { message: 'Código de verificação enviado para o email' };
  }

  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Post('verify')
  @ApiOperation({ summary: 'Verificar código e completar registro' })
  @ApiResponse({ status: 200, description: 'Usuário verificado e registrado com sucesso' })
  @ApiResponse({ status: 400, description: 'Código inválido ou expirado' })
  async verifyCode(@Body() verifyCodeDto: VerifyCodeDto) {
    const user = await this.verificationService.verifyCode(
      verifyCodeDto.email,
      verifyCodeDto.code,
    );
    return this.authService.login(user);
  }

  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'Login de usuário' })
  @ApiResponse({ status: 200, description: 'Login realizado com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async login(@Body() loginDto: LoginDto, @Request() req) {
    return this.authService.login(req.user);
  }

  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Post('request-password-reset')
  @ApiOperation({ summary: 'Solicitar recuperação de senha - envia código por email' })
  @ApiResponse({ status: 201, description: 'Código de recuperação enviado' })
  @ApiResponse({ status: 400, description: 'Email não encontrado' })
  async requestPasswordReset(@Body() requestPasswordResetDto: RequestPasswordResetDto) {
    await this.passwordResetService.requestPasswordReset(requestPasswordResetDto.email);
    return { message: 'Código de recuperação enviado para o email' };
  }

  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Post('verify-reset-code')
  @ApiOperation({ summary: 'Verificar código de recuperação de senha' })
  @ApiResponse({ status: 200, description: 'Código válido' })
  @ApiResponse({ status: 400, description: 'Código inválido ou expirado' })
  async verifyResetCode(@Body() verifyPasswordResetDto: VerifyPasswordResetDto) {
    await this.passwordResetService.verifyResetCode(
      verifyPasswordResetDto.email,
      verifyPasswordResetDto.code,
    );
    return { message: 'Código válido' };
  }

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('reset-password')
  @ApiOperation({ summary: 'Redefinir senha com código de verificação' })
  @ApiResponse({ status: 200, description: 'Senha redefinida com sucesso' })
  @ApiResponse({ status: 400, description: 'Código inválido ou expirado' })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    await this.passwordResetService.resetPassword(
      resetPasswordDto.email,
      resetPasswordDto.code,
      resetPasswordDto.newPassword,
    );
    return { message: 'Senha redefinida com sucesso' };
  }
}
