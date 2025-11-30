import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateDespesaDto } from './dto/create-despesa.dto';
import { UpdateDespesaDto } from './dto/update-despesa.dto';
import { CreateDespesaExclusaoDto } from './dto/create-despesa-exclusao.dto';
import { PaginationResponse } from '../common/dto/pagination.dto';

@Injectable()
export class DespesasService {
  constructor(private databaseService: DatabaseService) {}

  async create(userId: number, createDespesaDto: CreateDespesaDto) {
    const client = await this.databaseService.getClient();
    try {
      await client.query('BEGIN');

      if (createDespesaDto.categoria_despesa_id !== undefined && createDespesaDto.categoria_despesa_id !== null) {
        const categoryExists = await client.query(
          'SELECT * FROM categoria_despesa WHERE id = $1 AND usuario_id = $2',
          [createDespesaDto.categoria_despesa_id, userId],
        );
        if (categoryExists.rows.length === 0) {
          throw new NotFoundException('Categoria não encontrada');
        }
      }

      const result = await client.query(
        `INSERT INTO despesa (nome, valor, recorrente, data, data_vencimento, categoria_despesa_id, usuario_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [
          createDespesaDto.nome,
          createDespesaDto.valor,
          createDespesaDto.recorrente,
          createDespesaDto.data,
          createDespesaDto.data_vencimento,
          createDespesaDto.categoria_despesa_id,
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
    const maxLimit = Math.min(limit, 2000);
    const offset = (page - 1) * maxLimit;

    const [dataResult, countResult] = await Promise.all([
      this.databaseService.query(
        'SELECT * FROM despesa WHERE usuario_id = $1 ORDER BY data DESC LIMIT $2 OFFSET $3',
        [userId, maxLimit, offset],
      ),
      this.databaseService.query(
        'SELECT COUNT(*) FROM despesa WHERE usuario_id = $1',
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
      'SELECT * FROM despesa WHERE id = $1 AND usuario_id = $2',
      [id, userId],
    );
    if (result.rows.length === 0) {
      throw new NotFoundException('Despesa não encontrada');
    }
    return result.rows[0];
  }

  async update(id: number, userId: number, updateDespesaDto: UpdateDespesaDto) {
    const client = await this.databaseService.getClient();
    try {
      await client.query('BEGIN');

      if (updateDespesaDto.categoria_despesa_id !== undefined && updateDespesaDto.categoria_despesa_id !== null) {
        const categoryExists = await client.query(
          'SELECT * FROM categoria_despesa WHERE id = $1 AND usuario_id = $2',
          [updateDespesaDto.categoria_despesa_id, userId],
        );
        if (categoryExists.rows.length === 0) throw new NotFoundException('Categoria não encontrada');
      }

      const fields: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      if (updateDespesaDto.nome !== undefined) {
        fields.push(`nome = $${paramIndex++}`);
        values.push(updateDespesaDto.nome);
      }
      if (updateDespesaDto.valor !== undefined) {
        fields.push(`valor = $${paramIndex++}`);
        values.push(updateDespesaDto.valor);
      }
      if (updateDespesaDto.recorrente !== undefined) {
        fields.push(`recorrente = $${paramIndex++}`);
        values.push(updateDespesaDto.recorrente);
      }
      if (updateDespesaDto.data !== undefined) {
        fields.push(`data = $${paramIndex++}`);
        values.push(updateDespesaDto.data);
      }
      if (updateDespesaDto.data_vencimento !== undefined) {
        fields.push(`data_vencimento = $${paramIndex++}`);
        values.push(updateDespesaDto.data_vencimento);
      }
      if (updateDespesaDto.categoria_despesa_id !== undefined) {
        fields.push(`categoria_despesa_id = $${paramIndex++}`);
        values.push(updateDespesaDto.categoria_despesa_id);
      }

      if (fields.length === 0) {
        const existing = await client.query('SELECT * FROM despesa WHERE id = $1 AND usuario_id = $2', [id, userId]);
        if (existing.rows.length === 0) throw new NotFoundException('Despesa não encontrada');
        await client.query('COMMIT');
        return existing.rows[0];
      }

      values.push(id, userId);
      const query = `UPDATE despesa SET ${fields.join(', ')} WHERE id = $${paramIndex++} AND usuario_id = $${paramIndex++} RETURNING *`;

      const result = await client.query(query, values);

      if (result.rows.length === 0) throw new NotFoundException('Despesa não encontrada');

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
      'DELETE FROM despesa WHERE id = $1 AND usuario_id = $2',
      [id, userId],
    );
    if (result.rowCount === 0) throw new NotFoundException('Despesa não encontrada');
    return { message: 'Despesa excluída com sucesso' };
  }

  async createExclusao(despesaId: number, userId: number, createExclusaoDto: CreateDespesaExclusaoDto) {
    const client = await this.databaseService.getClient();
    try {
      await client.query('BEGIN');

      const despesaExists = await client.query(
        'SELECT * FROM despesa WHERE id = $1 AND usuario_id = $2',
        [despesaId, userId],
      );
      if (despesaExists.rows.length === 0) {
        throw new NotFoundException('Despesa não encontrada');
      }

      const result = await client.query(
        `INSERT INTO despesa_exclusao (despesa_id, data_exclusao, usuario_id)
         VALUES ($1, $2, $3) RETURNING *`,
        [despesaId, createExclusaoDto.data_exclusao, userId],
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
      'SELECT * FROM despesa_exclusao WHERE usuario_id = $1 ORDER BY data_exclusao DESC',
      [userId],
    );
    return result.rows;
  }

  async removeExclusao(id: number, userId: number) {
    const result = await this.databaseService.query(
      'DELETE FROM despesa_exclusao WHERE id = $1 AND usuario_id = $2',
      [id, userId],
    );
    if (result.rowCount === 0) throw new NotFoundException('Exclusão não encontrada');
    return { message: 'Exclusão removida com sucesso' };
  }
}
