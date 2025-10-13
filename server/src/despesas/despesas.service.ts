import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateDespesaDto } from './dto/create-despesa.dto';
import { UpdateDespesaDto } from './dto/update-despesa.dto';

@Injectable()
export class DespesasService {
  constructor(private databaseService: DatabaseService) {}

  async create(userId: number, createDespesaDto: CreateDespesaDto) {
    const categoryExists = await this.databaseService.query(
      'SELECT * FROM categoria_despesa WHERE id = $1 AND usuario_id = $2',
      [createDespesaDto.categoria_despesa_id, userId],
    );
    if (categoryExists.rows.length === 0) {
      throw new NotFoundException('Categoria não encontrada');
    }

    const result = await this.databaseService.query(
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
    return result.rows[0];
  }

  async findAll(userId: number) {
    const result = await this.databaseService.query(
      'SELECT * FROM despesa WHERE usuario_id = $1 ORDER BY data DESC',
      [userId],
    );
    return result.rows;
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
    const result = await this.databaseService.query(
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
    if (result.rows.length === 0) {
      throw new NotFoundException('Despesa não encontrada');
    }
    return result.rows[0];
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
