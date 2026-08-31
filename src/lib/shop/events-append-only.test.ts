import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { PGlite } from "@electric-sql/pglite";

const MIGRATIONS = [
  "migrations/0002_shopfloor.sql",
  "migrations/0003_product.sql",
  "migrations/0004_floor.sql",
  "migrations/0005_close.sql",
  "migrations/0006_events_append_only.sql",
];

test("traveler_events reject update and delete", async () => {
  const db = new PGlite();
  try {
    for (const file of MIGRATIONS) {
      await db.exec(readFileSync(file, "utf8"));
    }
    await db.exec(`
      insert into jobs (traveler_id, nickname) values ('T-TEST', 'append-only');
      insert into traveler_events (id, traveler_id, seq, type)
        values ('e1', 'T-TEST', 10, 'start');
    `);

    await assert.rejects(
      db.exec("update traveler_events set type = 'note' where id = 'e1'"),
      /append-only/,
    );
    await assert.rejects(db.exec("delete from traveler_events where id = 'e1'"), /append-only/);

    const { rows } = await db.query<{ type: string }>("select type from traveler_events where id = 'e1'");
    assert.equal(rows[0]?.type, "start");
  } finally {
    await db.close();
  }
});
