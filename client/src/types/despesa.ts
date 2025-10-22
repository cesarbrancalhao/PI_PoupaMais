export interface Despesa {
  id: number;
  nome: string;
  valor: number;
  recorrente: boolean;
  data: string;
  data_vencimento?: string;
  created_at: string;
  categoria_despesa_id?: number;
  usuario_id: number;
}

export interface CreateDespesaDto {
  nome: string;
  valor: number;
  recorrente: boolean;
  data: string;
  data_vencimento?: string;
  categoria_despesa_id?: number;
}

export interface UpdateDespesaDto {
  nome?: string;
  valor?: number;
  recorrente?: boolean;
  data?: string;
  data_vencimento?: string;
  categoria_despesa_id?: number;
}
