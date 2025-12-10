import { Moeda } from "@/types/configs";

interface CurrencyInfo {
    locale: string;
    currency: string;
    symbol: string;
    position: "before" | "after";
}
  
const currencyMap: Record<Moeda, CurrencyInfo> = {
    real: {
        locale: "pt-BR",
        currency: "BRL",
        symbol: "R$",
        position: "before"
    },
    dolar: {
        locale: "en-US",
        currency: "USD",
        symbol: "$",
        position: "before"
    },
    euro: {
        locale: "de-DE",
        currency: "EUR",
        symbol: "€",
        position: "after"
    }
};
  

export function formatCurrency(value: number, moeda?: Moeda) {
  const safeMoeda = moeda ?? "real"; 
  const config = currencyMap[safeMoeda];

  // RN15 - A alteração da moeda não afetará os valores salvos, apenas irá alterar o símbolo de moeda exibida na interface junto aos valores.
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: config.currency,
  }).format(value);
}

export function getCurrencySymbol(moeda?: Moeda) {
  return currencyMap[moeda ?? "real"].symbol;
}

export function getCurrencyPlaceholder(moeda: Moeda) {
    const cfg = currencyMap[moeda];
  
    if (cfg.position === "before") {
      return `${cfg.symbol} 0,00`;
    }
  
    return `0,00 ${cfg.symbol}`;
  }
  

