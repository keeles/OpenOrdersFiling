import ShopifyResponse from "./types/ShopifyResponse";

const brands = {
  dixxon: "Dixxon",
  gastownsupplyco: "Gastown",
  gshock: "G-Shock",
  crailstore: "Crailstore",
  hufworldwide: "HUF",
  jasonmarkk: "Jason Markk",
  fisthandwear: "Fist",
  T5MRKT: "T5MRKT",
};

export async function orderDataToBuffer(response: ShopifyResponse): Promise<string[][]> {
  return response.orders.map((o: {name: string; created_at: string; order_status_url: string}) => {
    const url = o.order_status_url;
    const store = url.split(".")[0].substring(8) as string;
    //@ts-ignore
    return [o.name.substring(1), brands[store]];
  });
}
