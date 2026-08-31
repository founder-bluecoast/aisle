export const MATERIAL_STATUSES = [
  "unknown",
  "ordered",
  "received",
  "issued",
  "cert_hold",
] as const;
export type MaterialStatus = (typeof MATERIAL_STATUSES)[number];

export const MACHINE_STATUSES = ["up", "down", "setup"] as const;
export type MachineStatus = (typeof MACHINE_STATUSES)[number];

export const QUOTE_STATUSES = ["open", "won", "lost", "released"] as const;
export type QuoteStatus = (typeof QUOTE_STATUSES)[number];

export const NCR_DISPOSITIONS = ["rework", "scrap", "use_as_is", "return"] as const;
export type NcrDisposition = (typeof NCR_DISPOSITIONS)[number];

export const PROGRAM_STATUSES = ["unknown", "missing", "ready", "prove"] as const;
export type ProgramStatus = (typeof PROGRAM_STATUSES)[number];

export const SHIP_STATUSES = ["open", "packed", "shipped"] as const;
export type ShipStatus = (typeof SHIP_STATUSES)[number];

export const SENDOUT_STATUSES = ["open", "sent", "back"] as const;
export type SendoutStatus = (typeof SENDOUT_STATUSES)[number];

export const PACKET_KEYS = ["drawing", "cert", "fai", "coc"] as const;
export type PacketKey = (typeof PACKET_KEYS)[number];

export const PACKET_LABELS: Record<PacketKey, string> = {
  drawing: "Drawing",
  cert: "Mill cert",
  fai: "FAI",
  coc: "C of C",
};

export function materialLabel(s: string | null | undefined): string {
  switch (s) {
    case "ordered":
      return "ORDERED";
    case "received":
      return "RECEIVED";
    case "issued":
      return "ISSUED";
    case "cert_hold":
      return "CERT HOLD";
    default:
      return "MATL ?";
  }
}

export function programLabel(s: string | null | undefined): string {
  switch (s) {
    case "missing":
      return "PGM MISSING";
    case "ready":
      return "PGM READY";
    case "prove":
      return "PROVE-OUT";
    default:
      return "PGM —";
  }
}

export function packetReady(j: {
  packet_drawing?: boolean | null;
  packet_cert?: boolean | null;
  packet_fai?: boolean | null;
  packet_coc?: boolean | null;
}): boolean {
  return Boolean(j.packet_drawing && j.packet_cert && j.packet_fai && j.packet_coc);
}
