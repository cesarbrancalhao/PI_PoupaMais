import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { DatabaseService } from '../database/database.service';
import { Usuario } from '../common/interfaces/user.interface';

@Injectable()
export class AuthService {
  constructor(
    private databaseService: DatabaseService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const result = await this.databaseService.query(
      'SELECT * FROM usuario WHERE email = $1',
      [email],
    );

    if (result.rows.length === 0) {
      return null;
    }

    const user = result.rows[0] as Usuario;
    const isPasswordValid = await bcrypt.compare(password + user.salt, user.senha);

    if (!isPasswordValid) {
      return null;
    }

    const { senha, salt, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
      },
    };
  }

  async register(nome: string, email: string, password: string) {
    // Verificar se o usuário já existe
    const existingUser = await this.databaseService.query(
      'SELECT id FROM usuario WHERE email = $1',
      [email],
    );

    if (existingUser.rows.length > 0) {
      throw new UnauthorizedException('Email já cadastrado');
    }

    // Gerar salt e hash da senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password + salt, 10);

    // Inserir usuário
    const result = await this.databaseService.query(
      'INSERT INTO usuario (nome, email, senha, salt) VALUES ($1, $2, $3, $4) RETURNING id, nome, email, created_at',
      [nome, email, hashedPassword, salt],
    );

    const newUser = result.rows[0];

    // Criar configuração padrão para o usuário
    await this.databaseService.query(
      'INSERT INTO config (usuario_id) VALUES ($1)',
      [newUser.id],
    );

    return this.login(newUser);
  }
}
