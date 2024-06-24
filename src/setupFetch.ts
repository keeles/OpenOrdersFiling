if (!globalThis.fetch) {
  //@ts-ignore
  globalThis.fetch = require("node-fetch");
}
