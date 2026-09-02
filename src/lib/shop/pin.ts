import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

/** Bay / office key: four digits, the station, not a person. */
const PIN_RE = /^\d{4}$/;

const SCRYPT_N = 16_384;
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const KEY_LEN = 32;
const SALT_LEN = 16;

export function isPin(pin: string): boolean {
  return PIN_RE.test(pin);
}

function pepper(): string {
  return process.env.AISLE_PIN_PEPPER ?? "";
}

function scryptKey(pin: string, salt: Buffer, n: number, r: number, p: number): Buffer {
  return scryptSync(pepper() + pin, salt, KEY_LEN, { N: n, r, p });
}

/**
 * Store this string in `stations.pin_hash` / `shop_settings.office_pin_hash`.
 * Fresh salt every call — never compare hashes for equality.
 * A 4-digit space is still brute-forceable if the hash (and pepper) leak;
 * never send pin_hash to a client.
 */
export function hashPin(pin: string): string {
  if (!isPin(pin)) {
    throw new Error("PIN must be four digits");
  }
  const salt = randomBytes(SALT_LEN);
  const key = scryptKey(pin, salt, SCRYPT_N, SCRYPT_R, SCRYPT_P);
  return `scrypt$${SCRYPT_N}$${SCRYPT_R}$${SCRYPT_P}$${salt.toString("base64url")}$${key.toString("base64url")}`;
}

export function pinsMatch(pin: string, storedHash: string): boolean {
  if (!isPin(pin) || typeof storedHash !== "string") return false;
  const parts = storedHash.split("$");
  if (parts.length !== 6 || parts[0] !== "scrypt") return false;
  const n = Number(parts[1]);
  const r = Number(parts[2]);
  const p = Number(parts[3]);
  if (!Number.isInteger(n) || !Number.isInteger(r) || !Number.isInteger(p)) return false;
  if (n < 2 || r < 1 || p < 1) return false;
  try {
    const salt = Buffer.from(parts[4]!, "base64url");
    const want = Buffer.from(parts[5]!, "base64url");
    if (salt.length !== SALT_LEN || want.length !== KEY_LEN) return false;
    const got = scryptKey(pin, salt, n, r, p);
    if (got.length !== want.length) return false;
    return timingSafeEqual(got, want);
  } catch {
    return false;
  }
}
