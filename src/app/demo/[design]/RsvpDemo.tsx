"use client";

import { useState } from "react";
import { normalizeMobile } from "@/lib/booking";

// RSVP form as guests see it (§6), themed by the page's CSS variables. Fields respond so the
// preview shows how the form changes, but "Send my reply" does nothing: buttons don't work in previews.

type Props = {
  guestList: boolean; // Premium+: invitation with reserved seats (§5.3), name already known
  extras: boolean; // Lite+: companions' names, kids, message
};

const field =
  "min-h-[50px] w-full rounded-xl border-[1.5px] border-[color-mix(in_srgb,var(--ink)_35%,white)] bg-white px-4 text-base text-[#1F2A2A] placeholder:text-[#7E8C88]";
const lbl = "text-sm font-extrabold";
const SEATS = 3; // sample reserved seats (guest list)
const MAX_PARTY = 4; // sample host limit (open mode)

export function RsvpDemo({ guestList, extras }: Props) {
  const [name, setName] = useState("");
  const [attending, setAttending] = useState<"" | "yes" | "no">("");
  const [count, setCount] = useState(1);
  const [kids, setKids] = useState(0);
  const [mobile, setMobile] = useState("");

  const max = guestList ? SEATS : MAX_PARTY;
  const todo: string[] = [];
  if (!guestList && !name.trim()) todo.push("Add your name");
  if (!attending) todo.push("Tell us if you can come");
  if (!guestList && !normalizeMobile(mobile)) todo.push("Add a valid mobile number");

  return (
    <form noValidate onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-4 text-left">
      {guestList ? (
        <div className="flex flex-col items-center gap-1 rounded-2xl bg-[color-mix(in_srgb,var(--ink)_8%,transparent)] px-4 py-5 text-center">
          <p className="m-0 text-xl font-extrabold">Hi, [Family name]!</p>
          <p className="m-0">We&apos;ve reserved {SEATS} seats for you.</p>
          <span aria-disabled="true" className="mt-1 text-sm font-bold underline opacity-80">Not you? Find your invitation</span>
        </div>
      ) : (
        <div className="flex flex-col gap-1.5">
          <label htmlFor="rs-name" className={lbl}>Your name</label>
          <input id="rs-name" autoComplete="name" maxLength={80} value={name} onChange={(e) => setName(e.target.value)} className={field} />
        </div>
      )}

      <fieldset className="m-0 flex flex-col gap-2 border-0 p-0">
        <legend className={`${lbl} mb-2 p-0`}>Will you attend?</legend>
        <div className="grid grid-cols-2 gap-2">
          {(
            [
              ["yes", "Yes, I'll be there"],
              ["no", "Sorry, can't make it"],
            ] as const
          ).map(([v, label]) => {
            const on = attending === v;
            return (
              <button
                key={v}
                type="button"
                aria-pressed={on}
                onClick={() => setAttending(v)}
                className={`min-h-12 cursor-pointer rounded-xl border-2 px-3 font-sans text-[15px] font-extrabold ${
                  on ? "border-[var(--btn)] bg-[var(--btn)] text-[var(--btn-ink)]" : "border-[color-mix(in_srgb,var(--ink)_35%,white)] bg-white text-[#1F2A2A]"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </fieldset>

      {attending === "yes" && (
        <>
          <div className={`grid gap-3 ${extras ? "grid-cols-2" : "grid-cols-1"}`}>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="rs-count" className={lbl}>How many are coming?</label>
              <select id="rs-count" value={count} onChange={(e) => { setCount(+e.target.value); setKids(Math.min(kids, +e.target.value)); }} className={`${field} px-3`}>
                {Array.from({ length: max }, (_, i) => <option key={i} value={i + 1}>{i + 1}</option>)}
              </select>
            </div>
            {extras && (
              <div className="flex flex-col gap-1.5">
                <label htmlFor="rs-kids" className={lbl}>Of those, how many are kids?</label>
                <select id="rs-kids" value={kids} onChange={(e) => setKids(+e.target.value)} className={`${field} px-3`}>
                  {Array.from({ length: count + 1 }, (_, i) => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
            )}
          </div>
          {extras &&
            Array.from({ length: count - 1 }, (_, i) => (
              <div key={i} className="flex flex-col gap-1.5">
                <label htmlFor={`rs-comp-${i}`} className={lbl}>Companion {i + 1} name</label>
                <input id={`rs-comp-${i}`} maxLength={80} className={field} />
              </div>
            ))}
        </>
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="rs-mobile" className={lbl}>
          Mobile number {guestList && <span className="font-semibold opacity-80">(optional)</span>}
        </label>
        <input id="rs-mobile" type="tel" autoComplete="tel" placeholder="09XX XXX XXXX" value={mobile} onChange={(e) => setMobile(e.target.value)} className={field} />
      </div>

      {extras && (
        <div className="flex flex-col gap-1.5">
          <label htmlFor="rs-msg" className={lbl}>
            Message for the celebrant <span className="font-semibold opacity-80">(optional)</span>
          </label>
          <textarea id="rs-msg" rows={3} maxLength={300} className={`${field} py-3`} />
        </div>
      )}

      <button
        type="button"
        aria-disabled="true"
        title="Buttons don't work in this preview"
        className={`min-h-14 cursor-not-allowed rounded-full border-0 px-6 font-sans text-[17px] font-extrabold bg-[var(--btn)] text-[var(--btn-ink)] ${todo.length ? "opacity-45" : ""}`}
      >
        Send my reply
      </button>
      {todo.length > 0 && (
        <div className="flex flex-col gap-1 rounded-xl bg-[color-mix(in_srgb,var(--ink)_8%,transparent)] px-3.5 py-3 text-sm">
          <span className="font-extrabold">To send, please:</span>
          {todo.map((m) => <span key={m}>○ {m}</span>)}
        </div>
      )}
      <p className="m-0 text-[13px] opacity-80">
        Your reply goes only to the hosts. Your mobile number is used to update your reply and is deleted after the event.
      </p>
    </form>
  );
}
