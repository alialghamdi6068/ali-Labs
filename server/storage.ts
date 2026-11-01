import fs from "node:fs/promises";
import path from "node:path";

export const STORAGE_ROOT = path.resolve(process.env.STORAGE_ROOT || path.join(process.cwd(), "data", "uploads"));

function safeKey(relKey: string) {
  const normalized = relKey.replace(/\\/g, "/").replace(/^\/+/, "");
  if (!normalized || normalized.split("/").some(part => !part || part === "." || part === "..")) throw new Error("Invalid storage key");
  return normalized;
}

export function storagePath(relKey: string) {
  const key = safeKey(relKey);
  const absolute = path.resolve(STORAGE_ROOT, key);
  if (!absolute.startsWith(`${STORAGE_ROOT}${path.sep}`)) throw new Error("Invalid storage path");
  return { key, absolute };
}

export async function storagePut(relKey: string, data: Buffer | Uint8Array | string, contentType = "application/octet-stream") {
  const { key, absolute } = storagePath(relKey);
  await fs.mkdir(path.dirname(absolute), { recursive: true });
  await fs.writeFile(absolute, data);
  await fs.writeFile(`${absolute}.meta.json`, JSON.stringify({ contentType, createdAt: new Date().toISOString() }));
  return { key, url: `/api/files/${key.split("/").map(encodeURIComponent).join("/")}` };
}

export async function storageGet(relKey: string) {
  const { key } = storagePath(relKey);
  return { key, url: `/api/files/${key.split("/").map(encodeURIComponent).join("/")}` };
}

export async function storageGetSignedUrl(relKey: string) {
  return (await storageGet(relKey)).url;
}

export async function storageRead(relKey: string) {
  const { key, absolute } = storagePath(relKey);
  const data = await fs.readFile(absolute);
  let contentType = "application/octet-stream";
  try {
    const meta = JSON.parse(await fs.readFile(`${absolute}.meta.json`, "utf8")) as { contentType?: string };
    contentType = meta.contentType || contentType;
  } catch {}
  return { key, absolute, data, contentType };
}
