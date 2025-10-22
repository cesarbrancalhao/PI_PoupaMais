export interface FonteReceita {
  id: number;
  nome: string;
  cor: string;
  created_at: string;
  usuario_id: number;
}

export interface CreateFonteReceitaDto {
  nome: string;
  cor?: string;
}

export interface UpdateFonteReceitaDto {
  nome?: string;
  cor?: string;
}
