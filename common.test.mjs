import assert from "node:assert";
import test from "node:test";

import { getOccurrenceDate } from "./common.mjs";

test("Ada Lovelace Day 2024 is October 8", () => {
  assert.equal(getOccurrenceDate(2024, 9, "Tuesday", "second"), 8);
});

test("Ada Lovelace Day 2025 is October 14", () => {
  assert.equal(getOccurrenceDate(2025, 9, "Tuesday", "second"), 14);
});

test("World Lemur Day 2024 is October 25", () => {
  assert.equal(getOccurrenceDate(2024, 9, "Friday", "last"), 25);
});

test("International Binturong Day 2030 is May 11", () => {
  assert.equal(getOccurrenceDate(2030, 4, "Saturday", "second"), 11);
});
