import { createHash, timingSafeEqual } from "node:crypto";

export function hashPin(pin: string): string {
  return createHash("sha256").update(`aisle:station:${pin}`).digest("hex");
}

export function pinsMatch(pin: string, storedHash: string): boolean {
  const got = Buffer.from(hashPin(pin), "hex");
  const want = Buffer.from(storedHash, "hex");
  if (got.length !== want.length) return false;
  return timingSafeEqual(got, want);
}
