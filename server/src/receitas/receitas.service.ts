import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateReceitaDto } from './dto/create-receita.dto';
import { UpdateReceitaDto } from './dto/update-receita.dto';
import { CreateReceitaExclusaoDto } from './dto/create-receita-exclusao.dto';
import { PaginationResponse } from '../common/dto/pagination.dto';

@Injectable()
export class ReceitasService {
  constructor(private databaseService: DatabaseService) {}

  async create(userId: number, data: CreateReceitaDto) {
    const client = await this.databaseService.getClient();
    try {
      await client.query('BEGIN');

      if (data.fonte_receita_id !== undefined && data.fonte_receita_id !== null) {
        const fonteExists = await client.query(
          'SELECT * FROM fonte_receita WHERE id = $1 AND usuario_id = $2',
          [data.fonte_receita_id, userId],
        );
        if (fonteExists.rows.length === 0) {
          throw new NotFoundException('Fonte de receita não encontrada');
        }
      }

      const result = await client.query(
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

      await client.query('COMMIT');
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async findAll(userId: number, page: number = 1, limit: number = 20): Promise<PaginationResponse<any>> {
    const maxLimit = Math.min(limit, 100);
    const offset = (page - 1) * maxLimit;

    const [dataResult, countResult] = await Promise.all([
      this.databaseService.query(
        'SELECT * FROM receita WHERE usuario_id = $1 ORDER BY data DESC LIMIT $2 OFFSET $3',
        [userId, maxLimit, offset],
      ),
      this.databaseService.query(
        'SELECT COUNT(*) FROM receita WHERE usuario_id = $1',
        [userId],
      ),
    ]);

    const total = parseInt(countResult.rows[0].count);

    return {
      data: dataResult.rows,
      pagination: {
        page,
        limit: maxLimit,
        total,
        totalPages: Math.ceil(total / maxLimit),
      },
    };
  }

  async findOne(id: number, userId: number) {
    const result = await this.databaseService.query(
      'SELECT * FROM receita WHERE id = $1 AND usuario_id = $2',
      [id, userId],
    );
    if (result.rows.length === 0) throw new NotFoundException('Receita não encontrada');
    return result.rows[0];
  }

  async update(id: number, userId: number, data: UpdateReceitaDto) {
    const client = await this.databaseService.getClient();
    try {
      await client.query('BEGIN');

      // Only validate fonte if it's provided and not null
      if (data.fonte_receita_id !== undefined && data.fonte_receita_id !== null) {
        const fonteExists = await client.query(
          'SELECT * FROM fonte_receita WHERE id = $1 AND usuario_id = $2',
          [data.fonte_receita_id, userId],
        );
        if (fonteExists.rows.length === 0) throw new NotFoundException('Fonte de receita não encontrada');
      }

      const result = await client.query(
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

      await client.query('COMMIT');
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async remove(id: number, userId: number) {
    const result = await this.databaseService.query(
      'DELETE FROM receita WHERE id = $1 AND usuario_id = $2',
      [id, userId],
    );
    if (result.rowCount === 0) throw new NotFoundException('Receita não encontrada');
    return { message: 'Receita excluída com sucesso' };
  }

  async createExclusao(receitaId: number, userId: number, createExclusaoDto: CreateReceitaExclusaoDto) {
    const client = await this.databaseService.getClient();
    try {
      await client.query('BEGIN');
      
      const receitaExists = await client.query(
        'SELECT * FROM receita WHERE id = $1 AND usuario_id = $2',
        [receitaId, userId],
      );
      if (receitaExists.rows.length === 0) {
        throw new NotFoundException('Receita não encontrada');
      }

      const result = await client.query(
        `INSERT INTO receita_exclusao (receita_id, data_exclusao, usuario_id)
         VALUES ($1, $2, $3) RETURNING *`,
        [receitaId, createExclusaoDto.data_exclusao, userId],
      );

      await client.query('COMMIT');
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async findAllExclusoes(userId: number) {
    const result = await this.databaseService.query(
      'SELECT * FROM receita_exclusao WHERE usuario_id = $1 ORDER BY data_exclusao DESC',
      [userId],
    );
    return result.rows;
  }

  async removeExclusao(id: number, userId: number) {
    const result = await this.databaseService.query(
      'DELETE FROM receita_exclusao WHERE id = $1 AND usuario_id = $2',
      [id, userId],
    );
    if (result.rowCount === 0) throw new NotFoundException('Exclusão não encontrada');
    return { message: 'Exclusão removida com sucesso' };
  }
}
