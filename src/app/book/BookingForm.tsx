"use client";

import Link from "next/link";
import Script from "next/script";
import { useSearchParams } from "next/navigation";
import { useState, useTransition, type ReactNode } from "react";
import { DesignPreview, pvPrimary, pvSecondary } from "@/components/DesignPreview";
import { DesignTile } from "@/components/DesignTile";
import { CHANNELS, GUEST_OPTIONS, LIMITS, manilaToday, missing, normalizeMobile, type Booking, type Channel } from "@/lib/booking";
import { CategoryChips } from "@/components/DesignGallery";
import { CATEGORIES, DESIGNS, designById, EVENT_TYPES, isEventType, type CategoryId, type Design, type EventType } from "@/lib/designs";
import { isPackageId, PACKAGES, peso } from "@/lib/packages";
import { SITE } from "@/lib/site";
import { submitBooking, type BookingResult } from "./actions";

// Layout, copy and behavior: design/pages/Booking.dc.html

const TURNSTILE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

const CELEBRANT: Record<EventType | "", [string, string]> = {
  wedding: ["Couple’s names", "e.g. Ana & Marco"],
  birthday: ["Celebrant’s name and age", "e.g. Lia, turning 1"],
  debut: ["Debutante’s name", "e.g. Mika"],
  baptism: ["Baby’s name", "e.g. Baby Gabriel"],
  anniversary: ["Couple’s names and years", "e.g. Lito & Nena, 50 years"],
  reunion: ["Family or class", "e.g. Dela Cruz Family, Class of 2006"],
  other: ["Event name", "e.g. Lola Nena's retirement party"],
  "": ["Who are we celebrating?", "Name(s) of the celebrant"],
};

const blank = (pkg: string, design: string): Booking => ({
  package: pkg, eventType: "", design, celebrant: "", eventDate: "", city: "", guests: "Not sure yet",
  clientName: "", mobile: "", channel: "viber", fb: "", email: "", notes: "", agree: false,
});

const card = "flex flex-col rounded-[22px] border-[1.5px] border-line bg-white p-6";
const h2 = "m-0 font-display text-2xl font-medium";
const chip = (on: boolean) =>
  `min-h-11 cursor-pointer rounded-full border-2 px-4 font-sans text-[15px] font-extrabold ${
    on ? "border-teal bg-teal text-white" : "border-outline bg-white text-deep"
  }`;

function Field({ id, label, optional, children }: { id: string; label: string; optional?: boolean; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="label">
        {label} {optional && <span className="font-semibold text-muted">(optional)</span>}
      </label>
      {children}
    </div>
  );
}

export function BookingForm() {
  const params = useSearchParams();
  const qp = params.get("package");
  const qd = params.get("design") ?? "";
  const initial = () => blank(isPackageId(qp) ? qp : "basic", designById(qd) ? qd : "");
  const [b, setB] = useState<Booking>(initial);
  const [preview, setPreview] = useState<Design | null>(null);
  const [designCat, setDesignCat] = useState<CategoryId | "all">("all");
  const [result, setResult] = useState<BookingResult>(null);
  const [pending, startTransition] = useTransition();
  const set = (patch: Partial<Booking>) => setB((prev) => ({ ...prev, ...patch }));

  const todo = missing(b);
  const disabled = todo.length > 0 || pending;
  const pkg = PACKAGES.find((p) => p.id === b.package) ?? PACKAGES[1];
  const type = isEventType(b.eventType) ? b.eventType : "";
  const typeLabel = EVENT_TYPES.find((t) => t.id === type)?.label ?? "";
  const personalized = b.package === "personalized";
  // Design picker: filtered by occasion, then by the category chips that fit it (§9.1).
  const typeDesigns = type ? DESIGNS.filter((d) => d.types.includes(type)) : DESIGNS;
  const typeCats = CATEGORIES.filter((c) => typeDesigns.some((d) => d.category === c.id));
  const shown = designCat === "all" ? typeDesigns : typeDesigns.filter((d) => d.category === designCat);
  const tplName = personalized ? "Custom design (made for you)" : b.design === "unsure" ? "Help me choose" : designById(b.design)?.name ?? "Not chosen yet";
  const dateStr = b.eventDate ? new Date(`${b.eventDate}T00:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "";
  const summaryLine = [typeLabel, b.celebrant.trim(), dateStr].filter(Boolean).join(" · ") || "Fill in your event details";
  const channelName = CHANNELS[b.channel as Channel] ?? "Viber";
  const mobileDigits = b.mobile.replace(/\D/g, "");
  const mobileOk = !!normalizeMobile(b.mobile);
  const mobileBad = mobileDigits.length > 0 && !mobileOk;
  const [celLabel, celPh] = CELEBRANT[type];

  const pickType = (t: EventType) => {
    const keep = b.design === "unsure" || !b.design || !!designById(b.design)?.types.includes(t);
    set({ eventType: t, design: keep ? b.design : "" });
    setDesignCat("all");
  };

  if (result?.ok) {
    const rows = [
      ["Request no.", result.ref],
      ["Package", `${pkg.name} · ${peso(pkg.price)}`],
      ["Event", summaryLine],
      ["Design", tplName],
      ["Mobile", b.mobile],
    ];
    return (
      <div className="mx-auto my-5 flex w-full max-w-[640px] flex-col items-start gap-4 rounded-[26px] border-[1.5px] border-[#CFE3D8] bg-white p-9" role="status">
        <span aria-hidden="true" className="flex h-[60px] w-[60px] items-center justify-center rounded-full bg-ok-bg text-[#2F7A5A]">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7" /></svg>
        </span>
        <h1 className="m-0 font-display text-4xl leading-[1.1] font-medium">Request received, {b.clientName.trim().split(" ")[0] || "there"}!</h1>
        <p className="m-0 text-[17px] text-muted">
          We&apos;ll review your booking and send your private link by <strong className="text-deep">{channelName}</strong> within {SITE.replyTime}.
        </p>
        <dl className="m-0 flex w-full flex-col gap-2 rounded-2xl bg-fill p-4 text-[15px]">
          {rows.map(([k, v]) => (
            <div key={k} className="flex justify-between gap-2.5">
              <dt className="text-muted">{k}</dt>
              <dd className="m-0 text-right font-extrabold">{v}</dd>
            </div>
          ))}
        </dl>
        <p className="m-0 text-sm text-muted">
          Nothing to pay yet. If you don&apos;t hear from us within a day, message us on Messenger and mention request {result.ref}.
        </p>
        <div className="flex flex-wrap gap-2.5">
          <Link href="/" className="inline-flex min-h-12 items-center rounded-full bg-teal px-[22px] font-extrabold text-white no-underline hover:bg-deep hover:text-white">Back to home</Link>
          <button
            type="button"
            onClick={() => { setB(initial()); setResult(null); }}
            className="min-h-12 cursor-pointer rounded-full border-[1.5px] border-line bg-white px-[22px] font-sans text-[15px] font-extrabold text-teal"
          >
            Book another event
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        if (todo.length) return;
        const token = new FormData(e.currentTarget).get("cf-turnstile-response");
        startTransition(async () => setResult(await submitBooking(b, typeof token === "string" ? token : undefined)));
      }}
      className="flex flex-col gap-7"
    >
      <div className="flex max-w-[700px] flex-col gap-2">
        <p className="eyebrow">BOOK YOUR INVITATION</p>
        <h1 className="m-0 font-display text-[clamp(34px,7vw,46px)] leading-[1.08] font-medium text-balance">Tell us about your celebration</h1>
        <p className="m-0 text-[17px] text-muted">
          Takes about 2 minutes. No payment yet: we&apos;ll check the details and send you a private link to pay and set up your invitation.
        </p>
      </div>

      <div className="flex flex-wrap items-start gap-7">
        <div className="flex min-w-0 flex-[999_1_560px] flex-col gap-[22px]">
          {/* 1 PACKAGE */}
          <section aria-labelledby="b1" className={`${card} gap-3.5`}>
            <h2 id="b1" className={h2}>1. Choose a package</h2>
            <div role="radiogroup" aria-labelledby="b1" className="grid grid-cols-[repeat(auto-fit,minmax(min(220px,100%),1fr))] gap-2.5">
              {PACKAGES.map((p) => {
                const on = p.id === b.package;
                return (
                  <button
                    key={p.id}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => set({ package: p.id })}
                    className={`flex min-h-[92px] cursor-pointer flex-col items-start gap-1 rounded-2xl border-2 px-4 py-3.5 font-sans text-deep ${
                      on ? "border-teal bg-mist shadow-[0_0_0_3px_#D7E0D9]" : "border-line bg-white"
                    }`}
                  >
                    <span className="flex w-full items-baseline justify-between gap-2">
                      <span className="font-display text-[19px]">{p.name}</span>
                      <span className="text-[17px] font-extrabold">{peso(p.price)}</span>
                    </span>
                    <span className="text-left text-[13px] text-muted">{p.booking}</span>
                  </button>
                );
              })}
            </div>
            <Link href="/packages" target="_blank" className="self-start text-sm font-extrabold">Compare all packages</Link>
          </section>

          {/* 2 EVENT */}
          <section aria-labelledby="b2" className={`${card} gap-4`}>
            <h2 id="b2" className={h2}>2. Your event</h2>
            <fieldset className="m-0 flex flex-col gap-2 border-0 p-0">
              <legend className="mb-2 p-0 text-sm font-extrabold">What are you celebrating?</legend>
              <div className="flex flex-wrap gap-2">
                {EVENT_TYPES.map((t) => (
                  <button key={t.id} type="button" aria-pressed={type === t.id} onClick={() => pickType(t.id)} className={chip(type === t.id)}>
                    {t.label}
                  </button>
                ))}
              </div>
            </fieldset>
            <Field id="bk-celebrant" label={celLabel}>
              <input id="bk-celebrant" type="text" placeholder={celPh} maxLength={LIMITS.celebrant} value={b.celebrant} onChange={(e) => set({ celebrant: e.target.value })} className="field" />
            </Field>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(220px,100%),1fr))] gap-3.5">
              <Field id="bk-date" label="Event date">
                <input id="bk-date" type="date" min={manilaToday()} value={b.eventDate} onChange={(e) => set({ eventDate: e.target.value })} className="field px-3.5" />
              </Field>
              <Field id="bk-city" label="City or town" optional>
                <input id="bk-city" type="text" placeholder="e.g. Quezon City" maxLength={LIMITS.city} value={b.city} onChange={(e) => set({ city: e.target.value })} className="field" />
              </Field>
            </div>
            <Field id="bk-guests" label="About how many guests?" optional>
              <select id="bk-guests" value={b.guests} onChange={(e) => set({ guests: e.target.value })} className="field max-w-[320px] px-3">
                {GUEST_OPTIONS.map((o) => <option key={o}>{o}</option>)}
              </select>
            </Field>
          </section>

          {/* 3 DESIGN */}
          <section aria-labelledby="bd" className={`${card} gap-3.5`}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 id="bd" className={h2}>3. Choose a design</h2>
              {!personalized && (
                <span className="text-[13px] text-muted">
                  {type ? `Showing designs for ${typeLabel.toLowerCase()}s` : "Pick what you’re celebrating to see matching designs"}
                </span>
              )}
            </div>
            {personalized ? (
              <div className="flex flex-col gap-1 rounded-2xl bg-fill p-4">
                <span className="text-base font-extrabold">Your design is made just for you</span>
                <span className="text-sm text-muted">With Personalized, we design your page from scratch. Tell us your theme, colors or a printed invitation to match in the notes below.</span>
              </div>
            ) : (
              <>
                {typeCats.length > 1 && <CategoryChips categories={typeCats} value={designCat} onChange={setDesignCat} />}
                {shown.length === 0 && (
                  <div className="flex flex-col gap-1 rounded-2xl bg-fill p-4">
                    <span className="text-base font-extrabold">No {typeLabel.toLowerCase()} designs yet</span>
                    <span className="text-sm text-muted">Choose “Not sure yet” below and we’ll suggest one, or tell us your theme in the notes.</span>
                  </div>
                )}
                <div role="radiogroup" aria-labelledby="bd" className="grid grid-cols-[repeat(auto-fill,minmax(min(170px,100%),1fr))] gap-3">
                  {shown.map((d) => {
                    const on = b.design === d.id;
                    return (
                      <div key={d.id} className={`flex flex-col gap-2 rounded-[18px] border-2 bg-white p-2.5 ${on ? "border-teal shadow-[0_0_0_3px_#D7E0D9]" : "border-line"}`}>
                        <button
                          type="button"
                          role="radio"
                          aria-checked={on}
                          aria-label={d.name}
                          onClick={() => set({ design: d.id })}
                          className="flex cursor-pointer flex-col gap-2.5 border-0 bg-transparent p-0 text-left font-sans text-deep"
                        >
                          <DesignTile design={d} height={190} size={28} />
                          <span className="flex items-center justify-between gap-2 px-0.5">
                            <span className="text-base font-extrabold">{d.name}</span>
                            {on && <span className="rounded-full bg-teal px-2 py-0.5 text-[11px] font-extrabold text-white">SELECTED</span>}
                          </span>
                          <span className="px-0.5 text-[13px] text-muted">{d.tags}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setPreview(d)}
                          className="min-h-9 cursor-pointer self-start border-0 bg-transparent px-0.5 font-sans text-[13px] font-extrabold text-teal underline"
                        >
                          Preview design
                        </button>
                      </div>
                    );
                  })}
                </div>
                <button
                  type="button"
                  aria-pressed={b.design === "unsure"}
                  onClick={() => set({ design: "unsure" })}
                  className={`min-h-11 cursor-pointer self-start rounded-full border-2 px-4 font-sans text-sm font-extrabold ${
                    b.design === "unsure" ? "border-teal bg-teal text-white" : "border-outline bg-white text-teal"
                  }`}
                >
                  Not sure yet. Help me choose.
                </button>
                <span className="text-[13px] text-muted">
                  You can change the design before your page goes live. Colors of your motif can be added later on your private link.
                </span>
              </>
            )}
          </section>

          {/* 4 YOU */}
          <section aria-labelledby="b3" className={`${card} gap-4`}>
            <h2 id="b3" className={h2}>4. How we&apos;ll reach you</h2>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(220px,100%),1fr))] gap-3.5">
              <Field id="bk-name" label="Your name">
                <input id="bk-name" type="text" autoComplete="name" placeholder="e.g. Mia Santos" maxLength={LIMITS.clientName} value={b.clientName} onChange={(e) => set({ clientName: e.target.value })} className="field" />
              </Field>
              <Field id="bk-mobile" label="Mobile number">
                <input
                  id="bk-mobile" type="tel" autoComplete="tel" placeholder="09XX XXX XXXX" value={b.mobile}
                  onChange={(e) => set({ mobile: e.target.value })}
                  aria-invalid={mobileBad}
                  aria-describedby={mobileBad ? "bk-mobile-err" : undefined}
                  className="field"
                  style={{ borderColor: mobileBad ? "#2B5653" : mobileOk ? "#2F7A5A" : undefined }}
                />
                {mobileBad && <span id="bk-mobile-err" className="text-[13px] font-bold text-[#2B5653]">Enter an 11-digit PH mobile number, e.g. 0917 123 4567.</span>}
              </Field>
            </div>
            <fieldset className="m-0 flex flex-col gap-2 border-0 p-0">
              <legend className="mb-2 p-0 text-sm font-extrabold">Where should we send your private link?</legend>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(CHANNELS) as Channel[]).map((c) => (
                  <button key={c} type="button" aria-pressed={b.channel === c} onClick={() => set({ channel: c })} className={chip(b.channel === c)}>
                    {CHANNELS[c]}
                  </button>
                ))}
              </div>
            </fieldset>
            {b.channel === "messenger" && (
              <Field id="bk-fb" label="Your Facebook name">
                <input id="bk-fb" type="text" placeholder="As it shows on Messenger" maxLength={LIMITS.fb} value={b.fb} onChange={(e) => set({ fb: e.target.value })} className="field" />
              </Field>
            )}
            {b.channel === "email" && (
              <Field id="bk-email" label="Email address">
                <input id="bk-email" type="email" autoComplete="email" placeholder="you@example.com" maxLength={LIMITS.email} value={b.email} onChange={(e) => set({ email: e.target.value })} className="field" />
              </Field>
            )}
            <Field id="bk-notes" label="Anything else?" optional>
              <textarea
                id="bk-notes" rows={3} placeholder="Theme, colors, a template you liked, or questions" maxLength={LIMITS.notes}
                value={b.notes} onChange={(e) => set({ notes: e.target.value })}
                className="resize-y rounded-xl border-[1.5px] border-field bg-white px-4 py-3 text-base text-deep"
              />
            </Field>
            <label htmlFor="bk-agree" className="flex cursor-pointer items-start gap-2.5 text-sm">
              <input id="bk-agree" type="checkbox" checked={b.agree} onChange={(e) => set({ agree: e.target.checked })} className="mt-0.5 h-5 w-5 flex-none accent-teal" />
              <span>
                I agree to the <Link href="/terms" target="_blank">terms</Link> and <Link href="/privacy" target="_blank">privacy policy</Link>. Kumbida will use my
                details only to set up and support my event.
              </span>
            </label>
          </section>
        </div>

        {/* SUMMARY */}
        <aside aria-label="Booking summary" className="sticky top-[105px] flex min-w-0 flex-[1_1_320px] flex-col gap-3.5">
          <div className="flex flex-col gap-3 rounded-[22px] bg-deep p-[22px] text-white">
            <span className="text-[13px] font-extrabold tracking-[0.1em] text-gold">YOUR BOOKING</span>
            <div className="flex items-baseline justify-between gap-2">
              <span className="font-display text-[26px]">{pkg.name}</span>
              <span className="text-[26px] font-extrabold">{peso(pkg.price)}</span>
            </div>
            <span className="text-sm text-mist">{summaryLine}</span>
            <span className="text-sm text-mist">Design: <strong className="text-white">{tplName}</strong></span>
            <span className="text-[13px] text-sage">One-time price per event. You&apos;ll pay after we send your private link.</span>
          </div>
          <div className="flex flex-col gap-3 rounded-[22px] border-[1.5px] border-line bg-white p-5">
            <span className="text-[15px] font-extrabold">What happens next</span>
            <ol className="m-0 flex list-none flex-col gap-2.5 p-0 text-sm">
              {[
                `We review your request, usually within ${SITE.replyTime}.`,
                `You get your private link by ${channelName}.`,
                "Pay via InstaPay or QR and upload your receipt.",
                b.package === "starter" || b.package === "basic"
                  ? "Once we confirm payment, you fill in your page and share it."
                  : "Once we confirm payment, we set up your page with you.",
              ].map((s, i) => (
                <li key={i} className="flex gap-2.5">
                  <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-mist text-xs font-extrabold text-teal">{i + 1}</span>
                  {s}
                </li>
              ))}
            </ol>
          </div>
          {TURNSTILE_KEY && (
            <>
              <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />
              <div className="cf-turnstile" data-sitekey={TURNSTILE_KEY} />
            </>
          )}
          <button
            type="submit"
            disabled={disabled}
            className={`min-h-14 rounded-full border-0 font-sans text-[17px] font-extrabold ${
              disabled ? "cursor-not-allowed bg-off text-off-ink" : "cursor-pointer bg-teal text-white shadow-[0_8px_20px_rgba(41,75,73,0.25)] hover:bg-deep"
            }`}
          >
            {pending ? "Sending…" : "Send booking request"}
          </button>
          {todo.length > 0 && (
            <div id="todo" className="flex flex-col gap-1 rounded-xl bg-fill px-3.5 py-3 text-sm">
              <span className="font-extrabold">To send, please:</span>
              {todo.map((m) => (
                <span key={m} className="flex gap-2 text-body2">
                  <span aria-hidden="true" className="font-extrabold text-teal">○</span>
                  {m}
                </span>
              ))}
            </div>
          )}
          {result && !result.ok && <p role="alert" className="m-0 rounded-xl bg-[#FFF4DE] px-3.5 py-3 text-sm font-bold text-[#7A5410]">{result.error}</p>}
          <p className="m-0 text-center text-[13px] text-muted">
            Prefer to chat? <a href={SITE.messengerUrl}>Message us on Messenger</a>
          </p>
        </aside>
      </div>

      <DesignPreview design={preview} onClose={() => setPreview(null)}>
        <button type="button" onClick={() => { if (preview) set({ design: preview.id }); setPreview(null); }} className={pvPrimary}>
          {preview && b.design === preview.id ? "Keep this design" : "Use this design"}
        </button>
        <button type="button" onClick={() => setPreview(null)} className={pvSecondary}>Back to designs</button>
      </DesignPreview>
    </form>
  );
}
