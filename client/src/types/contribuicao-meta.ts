export interface ContribuicaoMeta {
  id: number
  meta_id: number
  valor: number
  data: string
  observacao?: string
  created_at: string
  usuario_id: number
  meta_nome?: string
}

export interface CreateContribuicaoMetaDto {
  meta_id: number
  valor: number
  data?: string
  observacao?: string
}

export interface UpdateContribuicaoMetaDto {
  valor?: number
  data?: string
  observacao?: string
}
