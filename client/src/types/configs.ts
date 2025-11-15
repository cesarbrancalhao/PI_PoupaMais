export type Moeda = "real" | "dolar" | "euro";

export interface UserConfigs {
  tema: boolean;
  idioma: string;
  moeda: Moeda;
}

export interface UpdateConfigsRequest {
  tema: boolean;
  idioma: string;
  moeda: Moeda;
}
