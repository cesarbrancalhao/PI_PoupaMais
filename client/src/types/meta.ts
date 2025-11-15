export interface Meta {
  id: number
  nome: string
  descricao?: string
  valor: number
  valor_atual: number
  economia_mensal: number
  data_inicio: string
  data_alvo?: string
  created_at: string
  usuario_id: number
}

export interface CreateMetaDto {
  nome: string
  descricao?: string
  valor: number
  economia_mensal?: number
  data_inicio?: string
  data_alvo?: string
}

export interface UpdateMetaDto {
  nome?: string
  descricao?: string
  valor?: number
  economia_mensal?: number
  data_inicio?: string
  data_alvo?: string
}
