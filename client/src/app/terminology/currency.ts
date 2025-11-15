import { Moeda } from "@/types/configs";

interface CurrencyInfo {
  locale: string;
  currency: string;
  symbol: string;
}

const currencyMap: Record<Moeda, CurrencyInfo> = {
  real: {
    locale: "pt-BR",
    currency: "BRL",
    symbol: "R$",
  },
  dolar: {
    locale: "en-US",
    currency: "USD",
    symbol: "$",
  },
  euro: {
    locale: "de-DE",
    currency: "EUR",
    symbol: "€",
  }
};

export function formatCurrency(value: number, moeda: Moeda) {
  const config = currencyMap[moeda];

  return new Intl.NumberFormat(config.locale, {
    style: "currency",
    currency: config.currency,
  }).format(value);
}

export function getCurrencySymbol(moeda: Moeda) {
  return currencyMap[moeda].symbol;
}
