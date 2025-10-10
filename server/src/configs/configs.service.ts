import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class ConfigsService {
  constructor(private databaseService: DatabaseService) {}

  async getConfig(userId: number) {
    const result = await this.databaseService.query(
      'SELECT * FROM config WHERE usuario_id = $1',
      [userId],
    );

    if (result.rows.length === 0) {
      throw new NotFoundException('Configuração não encontrada');
    }

    return result.rows[0];
  }

  async updateConfig(userId: number, tema: boolean, idioma: string, moeda: string) {
    const result = await this.databaseService.query(
      'UPDATE config SET tema = $1, idioma = $2, moeda = $3 WHERE usuario_id = $4 RETURNING *',
      [tema, idioma, moeda, userId],
    );

    return result.rows[0];
  }
}
