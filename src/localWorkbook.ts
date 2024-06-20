import ShopifyResponse from "./types/ShopifyResponse";
import {orderDataToBuffer} from "./buffer.js";
import {writeFile} from "node:fs/promises";
import * as xlsx from "node-xlsx";

export async function createOrderWorkbook(orders: ShopifyResponse[]) {
  const bufferData = orders.map((o) => orderDataToBuffer(o));
  const bufferArray = await Promise.all(bufferData);
  const buffer: Buffer = xlsx.build([{name: "unfulfilled", data: bufferArray.flat(1), options: {}}]);

  await writeFile("orders.xlsx", buffer);
  console.log("File written");
}
