import {Client} from "@microsoft/microsoft-graph-client";
import {getAccessToken} from "./accessToken.js";
import * as dotenv from "dotenv";

dotenv.config();

export async function updateSharepointWorkbook() {
  const accessToken = await getAccessToken();

  const client = Client.init({
    authProvider: (done) => {
      done(null, accessToken as string);
    },
  });

  const siteId = process.env.SHAREPOINT_SITE_ID as string;
  const driveId = process.env.SHAREPOINT_DRIVE_ID as string;
  const itemId = process.env.FILE_ITEM_ID as string;

  const data = ["await"];

  try {
    client.api(`/sites/${siteId}/drives/${driveId}/items/${itemId}/workbook`).patch({
      values: data,
    });
  } catch (err) {
    console.log(err);
  }
}

async function getSiteId() {
  const accessToken = await getAccessToken();
  const client = Client.init({
    authProvider: (done) => {
      done(null, accessToken as string);
    },
  });

  const site = await client.api("/sites/supradistribution-my.sharepoint.com/").get();
  return site.id;
}

export async function siteId() {
  const sid = await getSiteId();
  console.log(sid);
}
