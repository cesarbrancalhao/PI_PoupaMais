export interface CategoriaDespesa {
  id: number;
  nome: string;
  cor: string;
  created_at: string;
  usuario_id: number;
}

export interface CreateCategoriaDespesaDto {
  nome: string;
  cor?: string;
}

export interface UpdateCategoriaDespesaDto {
  nome?: string;
  cor?: string;
}
