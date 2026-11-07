// Test runner only: Next.js normally resolves this marker at bundling time.
const Module = require("node:module");
const load = Module._load;
Module._load = function (name, ...args) {
  if (name === "server-only") return {};
  return load.call(this, name, ...args);
};
require("dotenv").config({ quiet: true });
