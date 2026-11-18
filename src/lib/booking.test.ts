import { test } from "node:test";
import assert from "node:assert/strict";
import { bookingRef, contactFor, missing, normalizeMobile, type Booking } from "./booking.ts";

const ok: Booking = {
  package: "basic", eventType: "birthday", design: "little-star", celebrant: "Lia, turning 1", eventDate: "2027-01-10",
  city: "", guests: "", clientName: "Ana Cruz", mobile: "0917 123 4567", channel: "viber", fb: "", email: "", notes: "", agree: true,
};
const today = "2026-11-18";

test("valid booking has nothing missing", () => assert.deepEqual(missing(ok, today), []));

test("mobile normalization", () => {
  assert.equal(normalizeMobile("+63 917-123-4567"), "09171234567");
  assert.equal(normalizeMobile("639171234567"), "09171234567");
  assert.equal(normalizeMobile("0917123456"), null);
  assert.equal(normalizeMobile("08171234567"), null);
});

test("design must fit the event type, unless unsure or personalized", () => {
  assert.deepEqual(missing({ ...ok, eventType: "wedding" }, today), ["Choose a design (or “Help me choose”)"]);
  assert.deepEqual(missing({ ...ok, eventType: "wedding", design: "unsure" }, today), []);
  assert.deepEqual(missing({ ...ok, package: "personalized", design: "" }, today), []);
});

test("channel needs its own contact field", () => {
  assert.deepEqual(missing({ ...ok, channel: "messenger" }, today), ["Add your Facebook name"]);
  assert.deepEqual(missing({ ...ok, channel: "email", email: "nope" }, today), ["Add your email address"]);
  assert.equal(contactFor({ ...ok, channel: "sms" }), "09171234567");
  assert.equal(contactFor({ ...ok, channel: "messenger", fb: " Ana Cruz " }), "Ana Cruz");
});

test("past dates and unchecked agreement are reported", () => {
  assert.equal(missing({ ...ok, eventDate: "2026-11-17", agree: false }, today).length, 2);
});

test("booking ref format", () => assert.equal(bookingRef(42), "KB-0042"));
