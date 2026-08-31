import type { TravelerEvent } from "./types";

export function hoursInState(fromIso: string | null | undefined, nowMs: number): string {
  if (!fromIso) return "";
  const t = Date.parse(fromIso);
  if (!Number.isFinite(t)) return "";
  const hours = Math.max(0, (nowMs - t) / 3600000);
  if (hours < 10) return hours.toFixed(1);
  return Math.round(hours).toString();
}

export function isLate(due: string | null | undefined, nowMs: number): boolean {
  if (!due) return false;
  const t = Date.parse(due);
  if (!Number.isFinite(t)) return false;
  return t < nowMs;
}

/** Hours on an op from start/unhold to complete/scrap/hold. */
export function laborByOp(events: TravelerEvent[]): Record<number, number> {
  const sorted = [...events].sort((a, b) => a.ts.localeCompare(b.ts));
  const open = new Map<number, number>();
  const hours: Record<number, number> = {};
  for (const e of sorted) {
    const t = Date.parse(e.ts);
    if (!Number.isFinite(t)) continue;
    if (e.type === "start" || e.type === "unhold" || e.type === "scan") {
      open.set(e.seq, t);
    }
    if (e.type === "complete" || e.type === "scrap" || e.type === "hold") {
      const from = open.get(e.seq);
      if (from != null) {
        hours[e.seq] = (hours[e.seq] ?? 0) + (t - from) / 3600000;
        open.delete(e.seq);
      }
    }
  }
  return hours;
}

export function formatHours(h: number | undefined): string {
  if (h == null || !Number.isFinite(h)) return "—";
  if (h < 10) return h.toFixed(1);
  return Math.round(h).toString();
}
