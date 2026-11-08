import fs from "node:fs/promises";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

const run = promisify(execFile);
const curl = process.platform === "win32" ? "curl.exe" : "curl";
const root = fileURLToPath(new URL("../../", import.meta.url));
const selected = process.argv[2] ? [process.argv[2]] : ["en", "de", "es"];
for (const locale of selected) {
  const model = locale === "en" ? "Xenova/opus-mt-fr-en" : locale === "de" ? "Xenova/opus-mt-en-de" : "Xenova/opus-mt-en-ROMANCE";
  const { stdout } = await run(curl, ["--fail", "--silent", "--show-error", "--location", "--max-time", "30", `https://huggingface.co/api/models/${model}/tree/main?recursive=true`], { maxBuffer: 4 * 1024 * 1024, windowsHide: true });
  const files = JSON.parse(stdout).filter(file => file.type === "file" && (
    (!file.path.includes("/") && file.path.endsWith(".json")) ||
    ["onnx/encoder_model_quantized.onnx", "onnx/decoder_model_merged_quantized.onnx"].includes(file.path)
  ));
  for (const file of files) {
    const target = `.translation-cache/models/${model}/${file.path}`;
    if (file.size > 2_000_000) {
      await new Promise((resolve, reject) => {
        const child = execFile(process.execPath, [path.join(root, "scripts/translation/download-file.mjs"), `https://huggingface.co/${model}/resolve/main/${file.path}`, target, String(file.size), file.lfs?.oid ?? ""], { windowsHide: true }, error => error ? reject(error) : resolve());
        child.stdout.pipe(process.stdout); child.stderr.pipe(process.stderr);
      });
    } else {
      const destination = path.join(root, target);
      await fs.mkdir(path.dirname(destination), { recursive: true });
      try { if ((await fs.stat(destination)).size === file.size) continue; } catch {}
      await run(curl, ["--fail", "--silent", "--show-error", "--location", "--retry", "2", "--max-time", "120", "--output", destination, `https://huggingface.co/${model}/resolve/main/${file.path}`], { windowsHide: true });
    }
    console.log(`[models] ${model}/${file.path} ready`);
  }
}
