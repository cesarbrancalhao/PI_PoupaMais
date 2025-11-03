export interface CategoriaDespesa {
  id: number;
  nome: string;
  icone: string;
  created_at: string;
  usuario_id: number;
}

export interface CreateCategoriaDespesaDto {
  nome: string;
  icone?: string;
}

export interface UpdateCategoriaDespesaDto {
  nome?: string;
  icone?: string;
}
