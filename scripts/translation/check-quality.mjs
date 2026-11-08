import { pipeline, env } from "@huggingface/transformers";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL("../../", import.meta.url));
env.localModelPath = path.join(root, ".translation-cache/models") + path.sep;
env.allowRemoteModels = false;
const translator = await pipeline("translation", "Xenova/opus-mt-fr-en", { dtype: "q8", session_options: { intraOpNumThreads: 4, interOpNumThreads: 1 } });
for (const text of [
  "Le cadre léger en aluminium assure une conduite confortable sur les routes et les chemins.",
  "La batterie offre une autonomie d’environ 80 km et se recharge en 5 heures.",
  "Ce vélo électrique est équipé de freins à disque hydrauliques et de pneus résistants.",
  "Cadre : Aluminium",
  "Autonomie : environ 80 km",
]) console.log(JSON.stringify({ source: text, result: await translator(text, { num_beams: 4, max_new_tokens: 180 }) }));
await translator.dispose();
