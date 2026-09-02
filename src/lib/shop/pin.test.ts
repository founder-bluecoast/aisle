import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import { hashPin, isPin, pinsMatch } from "./pin.ts";

const prevPepper = process.env.AISLE_PIN_PEPPER;

afterEach(() => {
  if (prevPepper === undefined) delete process.env.AISLE_PIN_PEPPER;
  else process.env.AISLE_PIN_PEPPER = prevPepper;
});

test("isPin accepts only four digits", () => {
  assert.equal(isPin("1001"), true);
  assert.equal(isPin("0000"), true);
  assert.equal(isPin("2468"), true);
  assert.equal(isPin("100"), false);
  assert.equal(isPin("10011"), false);
  assert.equal(isPin("10a1"), false);
  assert.equal(isPin(""), false);
});

test("hashPin rejects non-PIN input", () => {
  assert.throws(() => hashPin("123"), /four digits/);
  assert.throws(() => hashPin("abcd"), /four digits/);
});

test("same PIN hashes to different stored strings and still matches", () => {
  const a = hashPin("1001");
  const b = hashPin("1001");
  assert.notEqual(a, b);
  assert.match(a, /^scrypt\$/);
  assert.equal(pinsMatch("1001", a), true);
  assert.equal(pinsMatch("1001", b), true);
});

test("pinsMatch rejects the wrong PIN and junk hashes", () => {
  const stored = hashPin("1002");
  assert.equal(pinsMatch("1003", stored), false);
  assert.equal(pinsMatch("1002", ""), false);
  assert.equal(pinsMatch("1002", "not-a-hash"), false);
  assert.equal(
    pinsMatch("1002", "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"),
    false,
  );
  assert.equal(pinsMatch("12", stored), false);
});

test("pepper changes the stored hash so a DB-only leak is not enough", () => {
  delete process.env.AISLE_PIN_PEPPER;
  const unpeppered = hashPin("2468");
  process.env.AISLE_PIN_PEPPER = "shop-box-secret";
  const peppered = hashPin("2468");
  assert.equal(pinsMatch("2468", peppered), true);
  assert.equal(pinsMatch("2468", unpeppered), false);
  delete process.env.AISLE_PIN_PEPPER;
  assert.equal(pinsMatch("2468", peppered), false);
  assert.equal(pinsMatch("2468", unpeppered), true);
});
