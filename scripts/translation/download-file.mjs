// Download public model/runtime weights only. Product text never leaves the machine.
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { createHash } from "node:crypto";

const root = fileURLToPath(new URL("../../", import.meta.url));
const [url, target, byteCount, expectedHash = ""] = process.argv.slice(2);
const size = Number(byteCount);
const destination = path.resolve(root, target);
const cacheRoot = path.join(root, ".translation-cache") + path.sep;
if (!destination.startsWith(cacheRoot) || !Number.isSafeInteger(size) || size <= 0 || new URL(url).protocol !== "https:") throw new Error("Invalid public asset download");
const algorithm = expectedHash.startsWith("sha512-") ? "sha512" : "sha256";
const encoding = algorithm === "sha512" ? "base64" : "hex";
const hashValue = expectedHash.replace(/^sha512-/, "");
async function valid(file) {
  try {
    if ((await fs.stat(file)).size !== size) return false;
    return !hashValue || createHash(algorithm).update(await fs.readFile(file)).digest(encoding) === hashValue;
  } catch { return false; }
}
if (await valid(destination)) { console.log(`Already downloaded ${path.basename(destination)}`); process.exit(0); }
const directory = path.join(cacheRoot, "downloads", createHash("sha256").update(url).digest("hex"));
await fs.mkdir(directory, { recursive: true });
await fs.mkdir(path.dirname(destination), { recursive: true });
const execute = promisify(execFile);
const curl = process.platform === "win32" ? "curl.exe" : "curl";
const count = 16;
const chunk = Math.ceil(size / count);
let cursor = 0;
await Promise.all(Array.from({ length: 4 }, async () => {
  while (cursor < count) {
  const i = cursor++;
  const start = i * chunk, end = Math.min(size - 1, (i + 1) * chunk - 1);
  const file = path.join(directory, String(i));
  try { if ((await fs.stat(file)).size === end - start + 1) continue; } catch {}
  for (let attempt = 0; attempt < 12; attempt++) {
    let received = 0;
    try { received = (await fs.stat(file)).size; } catch {}
    if (received === end - start + 1) break;
    const offset = start + received;
    const appendFile = `${file}.append`;
    const headersFile = `${file}.headers`;
    try {
      await execute(curl, ["--fail", "--location", "--silent", "--show-error", "--max-time", "120", "--range", `${offset}-${end}`, "--dump-header", headersFile, "--output", appendFile, url], { windowsHide: true });
    } catch { /* Preserve a valid partial response before retrying. */ }
    let headers = "", bytes;
    try { headers = await fs.readFile(headersFile, "utf8"); bytes = await fs.readFile(appendFile); } catch {}
    const range = [...headers.matchAll(/content-range:\s*bytes (\d+)-(\d+)\/(\d+)/gi)].at(-1);
    if (bytes?.length && range && Number(range[1]) === offset && bytes.length <= end - offset + 1) {
      await fs.appendFile(file, bytes);
      console.log(`[weights] ${path.basename(destination)}: saved ${bytes.length} bytes in part ${i + 1}`);
    }
    await fs.rm(appendFile, { force: true });
    await fs.rm(headersFile, { force: true });
  }
  if ((await fs.stat(file)).size !== end - start + 1) throw new Error("Server did not honor requested byte range");
  console.log(`[weights] ${path.basename(destination)}: part ${i + 1}/${count}`);
  }
}));
const temporary = `${destination}.tmp`;
await fs.writeFile(temporary, "");
for (let i = 0; i < count; i++) await fs.appendFile(temporary, await fs.readFile(path.join(directory, String(i))));
if (!await valid(temporary)) throw new Error("Asset checksum verification failed");
await fs.rename(temporary, destination);
console.log(`Verified ${path.basename(destination)} (${size} bytes)`);
