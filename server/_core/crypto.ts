import crypto from "node:crypto";

const PREFIX = "enc:v1:";

function getKey() {
  const raw = process.env.APP_ENCRYPTION_KEY;
  if (!raw) throw new Error("APP_ENCRYPTION_KEY is required for sensitive data encryption");
  const key = Buffer.from(raw, "base64");
  if (key.length !== 32) throw new Error("APP_ENCRYPTION_KEY must be a base64-encoded 32-byte key");
  return key;
}

export function encryptSensitive(value: string | null | undefined) {
  if (value == null || value === "") return value ?? null;
  if (value.startsWith(PREFIX)) return value;
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", getKey(), iv);
  const ciphertext = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${PREFIX}${iv.toString("base64url")}.${tag.toString("base64url")}.${ciphertext.toString("base64url")}`;
}

export function decryptSensitive(value: string | null | undefined) {
  if (value == null || value === "" || !value.startsWith(PREFIX)) return value ?? null;
  const [ivText, tagText, cipherText] = value.slice(PREFIX.length).split(".");
  if (!ivText || !tagText || !cipherText) throw new Error("Invalid encrypted value");
  const decipher = crypto.createDecipheriv("aes-256-gcm", getKey(), Buffer.from(ivText, "base64url"));
  decipher.setAuthTag(Buffer.from(tagText, "base64url"));
  return Buffer.concat([decipher.update(Buffer.from(cipherText, "base64url")), decipher.final()]).toString("utf8");
}
