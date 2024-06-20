import {fetchOrders} from "./src/apiCall";
import {createOrderWorkbook} from "./src/localWorkbook";
import * as dotenv from "dotenv";
import {siteId} from "./src/sharepointWorkbook";

dotenv.config();

async function main() {
  const crailOrders = await fetchOrders(process.env.CRAILTAP_API_TOKEN as string, "crailstore-canada");
  const dixxonOrders = await fetchOrders(process.env.DIXXON_API_TOKEN as string, "dixxoncanada");
  const gastownOrders = await fetchOrders(process.env.GASTOWN_API_TOKEN as string, "gastownsupplyco");
  const gshockOrders = await fetchOrders(process.env.GSHOCK_API_TOKEN as string, "g-shock-store");
  // const hufOrders = await fetchOrders(process.env.HUF_API_TOKEN as string, "huf-canada");
  // const jasonMarkkOrders = await fetchOrders(process.env.JASONMARKK_API_TOKEN as string, "jason-markk-canada");
  const fistOrders = await fetchOrders(process.env.FIST_API_TOKEN as string, "fist-handwear-canada");
  const t5mrktOrders = await fetchOrders(process.env.T5MRKT_API_TOKEN as string, "take-five-trading");
  const allOrders = [
    crailOrders,
    dixxonOrders,
    gastownOrders,
    gshockOrders,
    // hufOrders,
    // jasonMarkkOrders,
    fistOrders,
    t5mrktOrders,
  ];

  await createOrderWorkbook(allOrders);
}

main();

// siteId();
