import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateDespesaDto } from './dto/create-despesa.dto';
import { UpdateDespesaDto } from './dto/update-despesa.dto';
import { PaginationResponse } from '../common/dto/pagination.dto';

@Injectable()
export class DespesasService {
  constructor(private databaseService: DatabaseService) {}

  async create(userId: number, createDespesaDto: CreateDespesaDto) {
    const client = await this.databaseService.getClient();
    try {
      await client.query('BEGIN');

      // Only validate categoria if it's provided
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
    const maxLimit = Math.min(limit, 100);
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

      // Only validate categoria if it's provided and not null
      if (updateDespesaDto.categoria_despesa_id !== undefined && updateDespesaDto.categoria_despesa_id !== null) {
        const categoryExists = await client.query(
          'SELECT * FROM categoria_despesa WHERE id = $1 AND usuario_id = $2',
          [updateDespesaDto.categoria_despesa_id, userId],
        );
        if (categoryExists.rows.length === 0) throw new NotFoundException('Categoria não encontrada');
      }

      const result = await client.query(
        `UPDATE despesa
         SET nome = COALESCE($1, nome),
             valor = COALESCE($2, valor),
             recorrente = COALESCE($3, recorrente),
             data = COALESCE($4, data),
             data_vencimento = COALESCE($5, data_vencimento),
             categoria_despesa_id = COALESCE($6, categoria_despesa_id)
         WHERE id = $7 AND usuario_id = $8 RETURNING *`,
        [
          updateDespesaDto.nome,
          updateDespesaDto.valor,
          updateDespesaDto.recorrente,
          updateDespesaDto.data,
          updateDespesaDto.data_vencimento,
          updateDespesaDto.categoria_despesa_id,
          id,
          userId,
        ],
      );

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
}
