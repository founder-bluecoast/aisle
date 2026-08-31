import type {
  EventType,
  JobState,
  JobStatus,
  Operation,
  TravelerEvent,
} from "./types";

export function reduceJob(
  ops: Operation[],
  events: TravelerEvent[],
): Omit<JobState, "traveler_id"> {
  const sortedOps = [...ops].sort((a, b) => a.seq - b.seq);
  const sortedEvents = [...events]
    .filter((e) => e.type !== "note")
    .sort((a, b) => {
      const t = a.ts.localeCompare(b.ts);
      return t !== 0 ? t : a.id.localeCompare(b.id);
    });

  if (sortedEvents.length === 0) {
    return {
      current_seq: sortedOps[0]?.seq ?? null,
      current_op_name: null,
      status: "unknown",
      blocker_code: null,
      blocker_text: null,
      state_entered_at: null,
      last_station_id: null,
      last_event_id: null,
    };
  }

  const last = sortedEvents[sortedEvents.length - 1]!;
  const opName = (seq: number | null) =>
    seq == null ? null : (sortedOps.find((o) => o.seq === seq)?.name ?? `Op ${seq}`);

  if (last.type === "ship") {
    return {
      current_seq: last.seq,
      current_op_name: opName(last.seq),
      status: "done",
      blocker_code: null,
      blocker_text: last.note || "shipped",
      state_entered_at: last.ts,
      last_station_id: last.station_id,
      last_event_id: last.id,
    };
  }

  if (last.type === "hold") {
    return {
      current_seq: last.seq,
      current_op_name: opName(last.seq),
      status: "held",
      blocker_code: last.blocker_code,
      blocker_text: last.blocker_text,
      state_entered_at: last.ts,
      last_station_id: last.station_id,
      last_event_id: last.id,
    };
  }

  if (last.type === "rework") {
    return {
      current_seq: last.seq,
      current_op_name: opName(last.seq),
      status: "queued",
      blocker_code: null,
      blocker_text: last.note || last.blocker_text || "rework",
      state_entered_at: last.ts,
      last_station_id: last.station_id,
      last_event_id: last.id,
    };
  }

  if (last.type === "complete" || last.type === "scrap") {
    const next = sortedOps.find((o) => o.seq > last.seq);
    if (!next) {
      return {
        current_seq: last.seq,
        current_op_name: opName(last.seq),
        status: "done",
        blocker_code: null,
        blocker_text: null,
        state_entered_at: last.ts,
        last_station_id: last.station_id,
        last_event_id: last.id,
      };
    }
    return {
      current_seq: next.seq,
      current_op_name: next.name,
      status: "queued",
      blocker_code: null,
      blocker_text: null,
      state_entered_at: last.ts,
      last_station_id: last.station_id,
      last_event_id: last.id,
    };
  }

  return {
    current_seq: last.seq,
    current_op_name: opName(last.seq),
    status: "in_op",
    blocker_code: null,
    blocker_text: null,
    state_entered_at: last.ts,
    last_station_id: last.station_id,
    last_event_id: last.id,
  };
}

export function legalSeq(
  ops: Operation[],
  events: TravelerEvent[],
): { seq: number | null; status: JobStatus } {
  const state = reduceJob(ops, events);
  if (state.status === "done") return { seq: null, status: "done" };
  if (state.status === "unknown") {
    const first = [...ops].sort((a, b) => a.seq - b.seq)[0];
    return { seq: first?.seq ?? null, status: "unknown" };
  }
  return { seq: state.current_seq, status: state.status };
}

export function isEventType(v: string): v is EventType {
  return (
    v === "scan" ||
    v === "start" ||
    v === "complete" ||
    v === "hold" ||
    v === "unhold" ||
    v === "scrap" ||
    v === "rework" ||
    v === "note" ||
    v === "ship"
  );
}
