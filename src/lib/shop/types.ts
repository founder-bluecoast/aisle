export const EVENT_TYPES = [
  "scan",
  "start",
  "complete",
  "hold",
  "unhold",
  "scrap",
  "rework",
  "note",
  "ship",
] as const;
export type EventType = (typeof EVENT_TYPES)[number];

export const JOB_STATUSES = [
  "unknown",
  "queued",
  "in_op",
  "held",
  "done",
] as const;
export type JobStatus = (typeof JOB_STATUSES)[number];

export const BLOCKER_CODES = [
  "tool",
  "material",
  "machine",
  "insp",
  "outside",
  "program",
  "missing",
  "other",
] as const;
export type BlockerCode = (typeof BLOCKER_CODES)[number];

export const BLOCKERS: { code: BlockerCode; label: string }[] = [
  { code: "tool", label: "Missing tool / fixture" },
  { code: "material", label: "Missing material or cert" },
  { code: "machine", label: "Machine down" },
  { code: "insp", label: "Waiting inspection" },
  { code: "outside", label: "Waiting outside process" },
  { code: "program", label: "Waiting program / rev" },
  { code: "missing", label: "Can't find parts" },
  { code: "other", label: "Other" },
];

export function blockerLabel(code: string | null | undefined): string {
  if (!code) return "";
  return BLOCKERS.find((b) => b.code === code)?.label ?? code;
}

export function statusLabel(status: JobStatus | string): string {
  switch (status) {
    case "unknown":
      return "UNKNOWN";
    case "queued":
      return "QUEUED";
    case "in_op":
      return "IN OP";
    case "held":
      return "HELD";
    case "done":
      return "DONE";
    default:
      return String(status).toUpperCase();
  }
}

export type Operation = {
  traveler_id: string;
  seq: number;
  name: string;
  workcenter: string | null;
  inspect: boolean;
  notes: string | null;
  planned_hours: number | null;
  instructions: string | null;
};

export type TravelerEvent = {
  id: string;
  traveler_id: string;
  seq: number;
  type: EventType;
  station_id: string | null;
  blocker_code: string | null;
  blocker_text: string | null;
  client_event_id: string | null;
  ts: string;
  qty: number | null;
  initials: string | null;
  note: string | null;
};

export type JobState = {
  traveler_id: string;
  current_seq: number | null;
  current_op_name: string | null;
  status: JobStatus;
  blocker_code: string | null;
  blocker_text: string | null;
  state_entered_at: string | null;
  last_station_id: string | null;
  last_event_id: string | null;
};

export type JobHeader = {
  traveler_id: string;
  erp_id: string | null;
  nickname: string;
  customer: string | null;
  qty: number | null;
  due_date: string | null;
  part_no: string | null;
  drawing_rev: string | null;
  material: string | null;
  heat_lot: string | null;
  po: string | null;
  notes: string | null;
  rush: boolean;
  quoted_hours: number | null;
  quoted_price: number | null;
  material_status: string;
  parent_traveler_id: string | null;
  quote_id: string | null;
  program_status: string;
  dispatch_rank: number | null;
  packet_drawing: boolean;
  packet_cert: boolean;
  packet_fai: boolean;
  packet_coc: boolean;
  ship_status: string;
};

export type BoardRow = {
  traveler_id: string;
  erp_id: string | null;
  nickname: string;
  customer: string | null;
  qty: number | null;
  due_date: string | null;
  part_no: string | null;
  drawing_rev: string | null;
  current_seq: number | null;
  current_op_name: string | null;
  status: JobStatus;
  blocker_code: string | null;
  blocker_text: string | null;
  state_entered_at: string | null;
  last_station_id: string | null;
  rush: boolean;
  material_status: string;
  program_status: string;
  packet_ready: boolean;
  osp: string | null;
  ship_status: string;
};

export type LegalOp = {
  traveler_id: string;
  nickname: string;
  erp_id: string | null;
  qty: number | null;
  status: JobStatus;
  seq: number | null;
  op_name: string | null;
  workcenter: string | null;
  inspect: boolean;
  instructions: string | null;
  rush: boolean;
  blocker_code: string | null;
  blocker_text: string | null;
  done: boolean;
  last_op: boolean;
  program_status: string;
  ops: { seq: number; name: string }[];
};

export type Station = {
  id: string;
  name: string;
  active: boolean;
  workcenter: string | null;
  machine_status: string;
  machine_note: string | null;
};

export type EventRow = TravelerEvent & {
  nickname: string;
  station_name: string | null;
};

export type ShopSettings = {
  name: string;
  traveler_template_rev: string;
};

export type Sendout = {
  id: string;
  traveler_id: string;
  vendor: string;
  process: string;
  qty: number | null;
  sent_at: string | null;
  due_back: string | null;
  received_at: string | null;
  cert_ok: boolean;
  notes: string | null;
  status: string;
  nickname?: string;
};
