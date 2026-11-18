"use server";

import { neon } from "@neondatabase/serverless";
import { headers } from "next/headers";
import { bookingRef, contactFor, missing, normalizeMobile, type Booking } from "@/lib/booking";

export type BookingResult = { ok: true; ref: string } | { ok: false; error: string } | null;

async function turnstileOk(token: unknown): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // not configured (local dev)
  if (typeof token !== "string" || !token) return false;
  const ip = (await headers()).get("cf-connecting-ip") ?? "";
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: new URLSearchParams({ secret, response: token, remoteip: ip }),
  });
  return ((await res.json()) as { success?: boolean }).success === true;
}

export async function submitBooking(b: Booking, turnstileToken?: string): Promise<BookingResult> {
  if (missing(b).length) return { ok: false, error: "Please check the form and try again." };
  if (!(await turnstileOk(turnstileToken)))
    return { ok: false, error: "We couldn't confirm you're not a robot. Please try again." };
  if (!process.env.DATABASE_URL) return { ok: false, error: "Bookings aren't connected yet. Please message us on Messenger instead." };

  const sql = neon(process.env.DATABASE_URL);
  const [row] = await sql`
    insert into booking_requests
      (package, event_type, design, celebrant, event_date, city, guests, client_name, mobile, channel, contact, notes)
    values
      (${b.package}, ${b.eventType}, ${b.package === "personalized" ? null : b.design}, ${b.celebrant.trim()}, ${b.eventDate},
       ${b.city.trim() || null}, ${b.guests && b.guests !== "Not sure yet" ? b.guests : null}, ${b.clientName.trim()},
       ${normalizeMobile(b.mobile)}, ${b.channel}, ${contactFor(b)}, ${b.notes.trim() || null})
    returning id`;
  return { ok: true, ref: bookingRef(row.id as number) };
}
