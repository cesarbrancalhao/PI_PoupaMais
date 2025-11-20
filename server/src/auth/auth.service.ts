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

  async validateUser(email: string, password: string): Promise<Omit<Usuario, 'senha'> | null> {
    const result = await this.databaseService.query(
      'SELECT * FROM usuario WHERE email = $1',
      [email],
    );

    if (result.rows.length === 0) {
      return null;
    }

    const user = result.rows[0] as Usuario;
    const isPasswordValid = await bcrypt.compare(password, user.senha);

    if (!isPasswordValid) {
      return null;
    }

    const { senha, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async login(user: Omit<Usuario, 'senha'>) {
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
    const existingUser = await this.databaseService.query(
      'SELECT id FROM usuario WHERE email = $1',
      [email],
    );

    if (existingUser.rows.length > 0) {
      throw new UnauthorizedException('Email já cadastrado');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const client = await this.databaseService.getClient();
    try {
      await client.query('BEGIN');

      const result = await client.query(
        'INSERT INTO usuario (nome, email, senha) VALUES ($1, $2, $3) RETURNING id, nome, email, created_at',
        [nome, email, hashedPassword],
      );

      const newUser = result.rows[0];
      
      await client.query('INSERT INTO config (usuario_id) VALUES ($1)', [newUser.id]);

      const categorias = [
        { nome: 'Moradia', icone: 'Home' },
        { nome: 'Eletrônicos', icone: 'Plug' },
        { nome: 'Transporte', icone: 'Car' },
        { nome: 'Alimentação', icone: 'Utensils' },
        { nome: 'Saúde', icone: 'Heart' },
        { nome: 'Lazer', icone: 'Gamepad-2' },
      ];
      for (const categoria of categorias) {
        await client.query(
          'INSERT INTO categoria_despesa (nome, icone, usuario_id) VALUES ($1, $2, $3)',
          [categoria.nome, categoria.icone, newUser.id],
        );
      }

      const fontes = [
        { nome: 'Salário', icone: 'Briefcase' },
        { nome: 'Renda Fixa', icone: 'DollarSign' },
        { nome: 'Renda Variável', icone: 'Apple' },
        { nome: 'Extra', icone: 'Gift' },
      ];
      for (const fonte of fontes) {
        await client.query(
          'INSERT INTO fonte_receita (nome, icone, usuario_id) VALUES ($1, $2, $3)',
          [fonte.nome, fonte.icone, newUser.id],
        );
      }

      await client.query('COMMIT');

      return this.login(newUser);
    } catch (error) {
      await client.query('ROLLBACK');
      throw new UnauthorizedException('Houve um erro ao registrar o usuário');
    }
    finally {
      await client.release();
    }
  }
}
