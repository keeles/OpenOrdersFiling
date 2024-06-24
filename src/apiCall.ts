import "@shopify/shopify-api/adapters/node";
import "@shopify/shopify-api/adapters/cf-worker";
import "@shopify/shopify-api/adapters/web-api";
import * as dotenv from "dotenv";
import ShopifyResponse from "./types/ShopifyResponse";
import {previousDayCalc} from "./date";

dotenv.config();

export async function fetchOrders(accessToken: string, shop: string): Promise<ShopifyResponse> {
  if (!globalThis.fetch) {
    //@ts-ignore
    globalThis.fetch = require("node-fetch");
  }
  const yesterdayDateString = previousDayCalc();
  const res = await fetch(
    `https://${shop}.myshopify.com/admin/api/2024-04/orders.json?fulfillment_status=unfulfilled&limit=250&created_at_max=${yesterdayDateString}`,
    {
      method: "GET",
      headers: {
        "content-type": "application/json",
        "X-Shopify-Access-Token": accessToken,
      },
    }
  );
  const data = (await res.json()) as ShopifyResponse;
  return data;
}
