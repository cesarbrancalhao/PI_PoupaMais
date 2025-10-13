import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateMetaDto } from './dto/create-meta.dto';
import { UpdateMetaDto } from './dto/update-meta.dto';

@Injectable()
export class MetasService {
  constructor(private databaseService: DatabaseService) {}

  async create(userId: number, data: CreateMetaDto) {
    const result = await this.databaseService.query(
      `INSERT INTO meta (nome, valor, economia_mensal, data_inicio, usuario_id)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [data.nome, data.valor, data.economia_mensal || 0, data.data_inicio || new Date(), userId],
    );
    return result.rows[0];
  }

  async findAll(userId: number) {
    const result = await this.databaseService.query(
      'SELECT * FROM meta WHERE usuario_id = $1 ORDER BY created_at DESC',
      [userId],
    );
    return result.rows;
  }

  async findOne(id: number, userId: number) {
    const result = await this.databaseService.query(
      'SELECT * FROM meta WHERE id = $1 AND usuario_id = $2',
      [id, userId],
    );
    if (result.rows.length === 0) throw new NotFoundException('Meta não encontrada');
    return result.rows[0];
  }

  async update(id: number, userId: number, data: UpdateMetaDto) {
    const result = await this.databaseService.query(
      `UPDATE meta
       SET nome = COALESCE($1, nome),
           valor = COALESCE($2, valor),
           economia_mensal = COALESCE($3, economia_mensal),
           data_inicio = COALESCE($4, data_inicio)
       WHERE id = $5 AND usuario_id = $6 RETURNING *`,
      [data.nome, data.valor, data.economia_mensal, data.data_inicio, id, userId],
    );
    if (result.rows.length === 0) throw new NotFoundException('Meta não encontrada');
    return result.rows[0];
  }

  async remove(id: number, userId: number) {
    const result = await this.databaseService.query(
      'DELETE FROM meta WHERE id = $1 AND usuario_id = $2',
      [id, userId],
    );
    if (result.rowCount === 0) throw new NotFoundException('Meta não encontrada');
    return { message: 'Meta excluída com sucesso' };
  }
}
