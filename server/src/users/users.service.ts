import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private databaseService: DatabaseService) {}

  async findById(id: number) {
    const result = await this.databaseService.query(
      'SELECT id, nome, email, tema, idioma, moeda, created_at FROM usuario WHERE id = $1',
      [id],
    );

    if (result.rows.length === 0) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return result.rows[0];
  }

  async updateProfile(userId: number, nome: string, email: string) {
    const existingMail = await this.databaseService.query(
      'SELECT id FROM usuario WHERE email = $1 AND id != $2',
      [email, userId],
    );

    if (existingMail.rows.length > 0) {
      throw new UnauthorizedException('Email já existe');
    }

    const result = await this.databaseService.query(
      'UPDATE usuario SET nome = $1, email = $2 WHERE id = $3 RETURNING id, nome, email, tema, idioma, moeda, created_at',
      [nome, email, userId],
    );

    if (result.rows.length === 0) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return result.rows[0];
  }

  async updateSettings(userId: number, tema: boolean, idioma: string, moeda: string) {
    const result = await this.databaseService.query(
      'UPDATE usuario SET tema = $1, idioma = $2, moeda = $3 WHERE id = $4 RETURNING id, nome, email, tema, idioma, moeda, created_at',
      [tema, idioma, moeda, userId],
    );

    if (result.rows.length === 0) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return result.rows[0];
  }

  async changePassword(userId: number, currentPassword: string, newPassword: string) {
    const result = await this.databaseService.query(
      'SELECT senha FROM usuario WHERE id = $1',
      [userId],
    );

    if (result.rows.length === 0) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(currentPassword, user.senha);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Senha atual incorreta');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.databaseService.query(
      'UPDATE usuario SET senha = $1 WHERE id = $2',
      [hashedPassword, userId],
    );

    return { message: 'Senha alterada com sucesso' };
  }

  async deleteAccount(userId: number) {
    const client = await this.databaseService.getClient();
    try {
      await client.query('BEGIN');

      const result = await client.query(
        'DELETE FROM usuario WHERE id = $1',
        [userId],
      );
      if (result.rowCount === 0) throw new NotFoundException('Usuário não encontrado');

      await client.query('COMMIT');
      return { message: 'Conta excluída com sucesso' };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}
