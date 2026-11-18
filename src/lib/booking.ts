// Booking request validation (§6.5, design/pages/Booking.dc.html), shared by the form's live
// "To send, please:" list and the server action. Imports use .ts extensions so `node --test` can run it.
import { designById, isEventType } from "./designs.ts";
import { isPackageId } from "./packages.ts";

export const CHANNELS = { messenger: "Messenger", viber: "Viber", sms: "Text message", email: "Email" } as const;
export type Channel = keyof typeof CHANNELS;

export const GUEST_OPTIONS = ["Not sure yet", "Up to 50", "50–100", "100–200", "More than 200"];

export type Booking = {
  package: string;
  eventType: string;
  design: string; // design id, "unsure", or "" (none chosen / Personalized)
  celebrant: string;
  eventDate: string; // YYYY-MM-DD
  city: string;
  guests: string;
  clientName: string;
  mobile: string;
  channel: string;
  fb: string;
  email: string;
  notes: string;
  agree: boolean;
};

export const LIMITS = { celebrant: 80, city: 60, clientName: 80, fb: 80, email: 120, notes: 500 };

/** Normalizes a PH mobile number to 09XXXXXXXXX, or null if invalid. */
export function normalizeMobile(raw: string): string | null {
  const d = raw.replace(/\D/g, "").replace(/^63/, "0");
  return /^09\d{9}$/.test(d) ? d : null;
}

export const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());

/** Today's date in Manila as YYYY-MM-DD. */
export const manilaToday = () => new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Manila" });

/** What's still missing before the request can be sent, in the design's order; empty means valid. */
export function missing(b: Booking, today = manilaToday()): string[] {
  const out: string[] = [];
  if (!isPackageId(b.package)) out.push("Choose a package");
  if (!isEventType(b.eventType)) out.push("Choose what you’re celebrating");
  if (!b.celebrant.trim()) out.push("Add the celebrant’s name");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(b.eventDate)) out.push("Pick the event date");
  else if (b.eventDate < today) out.push("Pick an event date that isn’t in the past");
  if (b.package !== "personalized") {
    const d = designById(b.design);
    const fits = d && (!isEventType(b.eventType) || d.types.includes(b.eventType));
    if (b.design !== "unsure" && !fits) out.splice(Math.min(3, out.length), 0, "Choose a design (or “Help me choose”)");
  }
  if (!b.clientName.trim()) out.push("Add your name");
  if (!normalizeMobile(b.mobile)) out.push("Add a valid mobile number");
  if (!(b.channel in CHANNELS)) out.push("Choose where we should send your private link");
  if (b.channel === "messenger" && !b.fb.trim()) out.push("Add your Facebook name");
  if (b.channel === "email" && !isEmail(b.email)) out.push("Add your email address");
  if (b.guests && !GUEST_OPTIONS.includes(b.guests)) out.push("Choose a guest count");
  for (const [k, max] of Object.entries(LIMITS))
    if (b[k as keyof typeof LIMITS].length > max) out.push(`Shorten ${k === "clientName" ? "your name" : k === "fb" ? "your Facebook name" : k} to ${max} characters`);
  if (!b.agree) out.push("Agree to the terms and privacy policy");
  return out;
}

/** Where the private link goes, per channel. */
export const contactFor = (b: Booking) =>
  b.channel === "messenger" ? b.fb.trim() : b.channel === "email" ? b.email.trim() : normalizeMobile(b.mobile) ?? "";

export const bookingRef = (id: number) => `KB-${String(id).padStart(4, "0")}`;
