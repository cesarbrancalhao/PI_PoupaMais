import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class ReceitasService {
  constructor(private databaseService: DatabaseService) {}

  async create(userId: number, data: any) {
    const result = await this.databaseService.query(
      `INSERT INTO receita (nome, valor, recorrente, data, data_vencimento, fonte_receita_id, usuario_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [
        data.nome,
        data.valor,
        data.recorrente,
        data.data,
        data.data_vencimento,
        data.fonte_receita_id,
        userId,
      ],
    );
    return result.rows[0];
  }

  async findAll(userId: number) {
    const result = await this.databaseService.query(
      'SELECT * FROM receita WHERE usuario_id = $1 ORDER BY data DESC',
      [userId],
    );
    return result.rows;
  }

  async findOne(id: number, userId: number) {
    const result = await this.databaseService.query(
      'SELECT * FROM receita WHERE id = $1 AND usuario_id = $2',
      [id, userId],
    );
    if (result.rows.length === 0) throw new NotFoundException('Receita não encontrada');
    return result.rows[0];
  }

  async update(id: number, userId: number, data: any) {
    const result = await this.databaseService.query(
      `UPDATE receita
       SET nome = COALESCE($1, nome),
           valor = COALESCE($2, valor),
           recorrente = COALESCE($3, recorrente),
           data = COALESCE($4, data),
           data_vencimento = COALESCE($5, data_vencimento),
           fonte_receita_id = COALESCE($6, fonte_receita_id)
       WHERE id = $7 AND usuario_id = $8 RETURNING *`,
      [
        data.nome,
        data.valor,
        data.recorrente,
        data.data,
        data.data_vencimento,
        data.fonte_receita_id,
        id,
        userId,
      ],
    );
    if (result.rows.length === 0) throw new NotFoundException('Receita não encontrada');
    return result.rows[0];
  }

  async remove(id: number, userId: number) {
    const result = await this.databaseService.query(
      'DELETE FROM receita WHERE id = $1 AND usuario_id = $2',
      [id, userId],
    );
    if (result.rowCount === 0) throw new NotFoundException('Receita não encontrada');
    return { message: 'Receita excluída com sucesso' };
  }
}
