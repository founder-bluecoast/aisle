# Aisle

**MIT-licensed shop-floor job traveler + TV board for 5–80 person American job shops.**

Not an ERP. Not a scheduler. Paper QR traveler is canonical in the operator’s hand. Events are truth. The aisle TV is a projection. We never invent a green light.

Built for a precision job shop (aerospace / defense subcontract) that still moves work on paper travelers and keeps the scheduler’s whiteboard as the system of record. JobBOSS / ProShop / Excel already own quoting and costing. This is the floor picture they never get.

## What it does

1. Import a messy CSV of jobs + operations. Idempotent reload. Events are never wiped.
2. Print a traveler with a QR per job. Dual paper + digital is the AS9100 path.
3. Station screen: 4-digit **bay** PIN (not a person) → next legal operation → complete, hold-with-reason, scrap, rework.
4. Aisle TV: job, current op, hours in state, blocker. Blank if unknown.

No user accounts. Gloves, bad lighting, a TV at the aisle. Must work if the internet dies (embedded Postgres / PGLite; optional `DATABASE_URL` for a real box).

## Demo (seeded shop: Harbor Precision)

| Role | Key |
| --- | --- |
| Saw | `1001` |
| Haas VF-2 | `1002` |
| Deburr | `1003` |
| CMM / Insp | `1004` |
| Office (headers, bays, OSP, ship) | `2468` |

Scan traveler `T-45112-A` (Honda, RUSH). Waveguide flange `T-41888` is out at Anodic Tech.

## Run it (Cursor, or any Node 22 machine)

```bash
git clone https://github.com/founder-bluecoast/aisle.git
cd aisle
npm install
npm run dev
```

Open the URL Vite prints (binds `0.0.0.0:8080`). No `.env` required — it boots an embedded Postgres (PGLite) and seeds Harbor Precision.

To point at a real Postgres later:

```bash
export DATABASE_URL=postgres://...
npm run db:migrate
npm run dev
```

## Open in Cursor

1. **Cursor → Clone repo** (or terminal `git clone`) using `https://github.com/founder-bluecoast/aisle.git`
2. **File → Open Folder** on the clone
3. Terminal: `npm install` then `npm run dev`
4. Cursor picks up `AGENTS.md` and `.cursor/rules/` — the doctrine lives there. Do not add login, do not replace the ERP, do not invent a green status.

If you downloaded the zip instead: unzip, Open Folder, same `npm install && npm run dev`.

## Stack

TanStack Start (Vite) · React 19 · Tailwind v4 · Postgres (PGLite locally, Neon/any `DATABASE_URL` in production) · event-sourced `traveler_events` · job_state as a projection.

## What we refused to become

No login wall. No AI dispatcher. No MRP. No MTConnect fiction. No purchasing. No WMS. Quote log, dispatch rank, material/program gates, send-outs, packet boxes, and NCRs are floor-native stamps — not a second system.

## License

[MIT](./LICENSE). Run it on the shop LAN. Keep the data. Change the code. No per-seat tax.

The software is free. A paid week on the floor to stand it up against *your* export, *your* bays, and *your* exception list is a separate conversation.
