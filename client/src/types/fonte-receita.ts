export interface FonteReceita {
  id: number;
  nome: string;
  icone: string;
  created_at: string;
  usuario_id: number;
}

export interface CreateFonteReceitaDto {
  nome: string;
  icone?: string;
}

export interface UpdateFonteReceitaDto {
  nome?: string;
  icone?: string;
}
