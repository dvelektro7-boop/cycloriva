const { spawnSync } = require("node:child_process");
const result = spawnSync(
  process.execPath,
  [
    "--require",
    "./scripts/register-server-test.cjs",
    "--import",
    "tsx",
    "--test",
    "lib/checkout.integration.test.ts",
  ],
  { stdio: "inherit", env: { ...process.env, CHECKOUT_DATABASE_TESTS: "1" } },
);
process.exitCode = result.status ?? 1;
