import {ConfidentialClientApplication} from "@azure/msal-node";
import * as dotenv from "dotenv";

dotenv.config();

const config = {
  auth: {
    clientId: process.env.AZURE_CID as string,
    authority: `https://login.microsoftonline.com/${process.env.TENANT_ID as string}`,
    clientSecret: process.env.AZURE_CLIENT_SECRET,
  },
};

const cca = new ConfidentialClientApplication(config);

export async function getAccessToken() {
  const clientCredentialRequest = {
    scopes: ["https://graph.microsoft.com/.default"],
  };

  const response = await cca.acquireTokenByClientCredential(clientCredentialRequest);
  console.log("Access Token", response?.accessToken);
  return response?.accessToken;
}
