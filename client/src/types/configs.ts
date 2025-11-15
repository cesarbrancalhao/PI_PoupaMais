export type Moeda = "real" | "dolar" | "euro";
export type Idioma = "portugues" | "ingles" | "espanhol";
export type Tema = "claro" | "escuro";

export interface UserConfigs {
  tema: boolean;
  idioma: Idioma;
  moeda: Moeda;
}

export interface UpdateConfigsRequest {
  tema: boolean;
  idioma: Idioma;
  moeda: Moeda;
}
