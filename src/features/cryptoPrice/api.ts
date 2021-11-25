import { SupportedCryptos } from "./slice";

export type GeckoPriceObject = {
  usd: number,
  btc: number,
  eth: number,
};

const DEFAULT_PRICE_OBJECT: GeckoPriceObject = {
  usd: 0,
  btc: 0,
  eth: 0,
};

type GeckoPriceResponse = {
  "ethereum": GeckoPriceObject,
  "usd-coin": GeckoPriceObject,
  "wrapped-bitcoin": GeckoPriceObject,
};

export const getCoinGeckoPrices = async (): Promise<{ [key in SupportedCryptos]: GeckoPriceObject }> => {
  const ids = ["bitcoin", "wrapped-bitcoin", "ethereum", "usd-coin"];
  const vss = ["usd", "btc", "eth"];
  const api = `https://api.coingecko.com/api/v3/simple/price?ids=${ids.join(",")}&vs_currencies=${vss.join(",")}`;
  const response = await fetch(api, { cache: "no-cache" });
  const priceData = (await response.json()) as GeckoPriceResponse;
  return {
    USDC: priceData["usd-coin"] ?? DEFAULT_PRICE_OBJECT,
    WBTC: priceData["wrapped-bitcoin"] ?? DEFAULT_PRICE_OBJECT,
    ETH: priceData["ethereum"] ?? DEFAULT_PRICE_OBJECT,
  }
};