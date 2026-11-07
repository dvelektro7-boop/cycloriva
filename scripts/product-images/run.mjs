import { parseCliArgs } from "./utils.mjs";
import { runSearch } from "./search.mjs";
import { runDownload } from "./download.mjs";
import { runRank } from "./rank.mjs";
import { runStatus } from "./status.mjs";

const [command = "status", ...rest] = process.argv.slice(2);
const cli = parseCliArgs(rest);

try {
  if (command === "search") {
    await runSearch(cli);
  } else if (command === "download") {
    await runDownload(cli);
    if (!cli["no-rank"]) await runRank(cli);
  } else if (command === "rank") {
    await runRank(cli);
  } else if (command === "all") {
    await runSearch(cli);
    await runDownload(cli);
    await runRank(cli);
  } else if (command === "status") {
    runStatus();
  } else {
    console.error(`Commande inconnue: ${command}`);
    console.error("Commandes: search | download | rank | all | status");
    process.exitCode = 1;
  }
} catch (error) {
  console.error("\nERREUR:", error instanceof Error ? error.message : error);
  process.exitCode = 1;
}

