export interface UserConfigs {
  tema: boolean;
  idioma: "portugues" | "ingles" | "espanhol";
  moeda: "real" | "dolar" | "euro";
}

export interface UpdateConfigsRequest {
  tema: boolean;
  idioma: "portugues" | "ingles" | "espanhol";
  moeda: "real" | "dolar" | "euro";
}
  