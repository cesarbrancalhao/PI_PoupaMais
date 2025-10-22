export interface Receita {
  id: number;
  nome: string;
  valor: number;
  recorrente: boolean;
  data: string;
  data_vencimento?: string;
  created_at: string;
  fonte_receita_id?: number;
  usuario_id: number;
}

export interface CreateReceitaDto {
  nome: string;
  valor: number;
  recorrente: boolean;
  data: string;
  data_vencimento?: string;
  fonte_receita_id?: number;
}

export interface UpdateReceitaDto {
  nome?: string;
  valor?: number;
  recorrente?: boolean;
  data?: string;
  data_vencimento?: string;
  fonte_receita_id?: number;
}
