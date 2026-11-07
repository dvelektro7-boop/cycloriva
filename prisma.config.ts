import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",

  migrations: {
    path: "prisma/migrations",
  },

  datasource: {
    // Migrations require a session connection, not the transaction pool on 6543.
    url: env("DIRECT_URL"),
  },
});
