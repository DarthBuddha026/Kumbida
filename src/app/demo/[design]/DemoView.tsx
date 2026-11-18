"use client";

import Link from "next/link";
import { useRef, useState, type CSSProperties, type ReactNode } from "react";
import { flushSync } from "react-dom";
import { FitWidth } from "@/components/FitWidth";
import type { Design } from "@/lib/designs";
import { PACKAGES, peso, type PackageId } from "@/lib/packages";
import { RsvpDemo } from "./RsvpDemo";

// What each package changes on the guest page (§5.4). Gallery = photos besides the cover photo.
// Personalized is left out: its page is a custom design, so a library-design preview doesn't represent it.
type Previewable = Exclude<PackageId, "personalized">;
const FEATURES: Record<Previewable, { rsvp: "none" | "core" | "full" | "guestList"; gallery: number; notes: string[] }> = {
  starter: { rsvp: "none", gallery: 0, notes: ["Schedule, map links, motif and attire", "1 photo (on the cover)", "No RSVP form: guests confirm with your contact person"] },
  basic: { rsvp: "core", gallery: 0, notes: ["Everything in Starter", "RSVP form: name, attending, headcount, mobile"] },
  lite: { rsvp: "full", gallery: 2, notes: ["Up to 3 photos", "Extra RSVP questions: companions' names, kids, a message"] },
  standard: { rsvp: "full", gallery: 9, notes: ["Everything in Lite", "Photo gallery, up to 10 photos"] },
  premium: { rsvp: "guestList", gallery: 9, notes: ["Everything in Standard", "Guest list: each family gets reserved seats", "Guests find their invitation by name or open their personal link"] },
};

const INERT = "Buttons don't work in this preview";

function Section({ title, label, children }: { title: string; label: string; children: ReactNode }) {
  return (
    <section className="flex flex-col items-center gap-5 border-t border-[color-mix(in_srgb,var(--ink)_18%,transparent)] px-6 py-12 text-center @4xl:gap-7 @4xl:px-12 @4xl:py-16 @4xl:first:border-t-0">
      <div className="flex flex-col items-center gap-1">
        <p className="m-0 text-xs font-extrabold tracking-[0.22em] opacity-85 @4xl:text-[13px]">{label}</p>
        <h2 className="m-0 text-[34px] leading-[1.1] font-normal text-[var(--ink)] [font-family:var(--font)] @4xl:text-[46px]">{title}</h2>
      </div>
      <div className="flex w-full max-w-[640px] flex-col items-center gap-5">{children}</div>
    </section>
  );
}

/** A guest-page button that does nothing in the preview. */
function InertButton({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span
      aria-disabled="true"
      title={INERT}
      className={`inline-flex min-h-11 cursor-not-allowed items-center justify-center rounded-full border-2 border-[var(--btn)] px-5 text-[15px] font-extrabold ${className}`}
    >
      {children}
    </span>
  );
}

const tint = "bg-[color-mix(in_srgb,var(--ink)_8%,transparent)]";

/**
 * Photo carousel built on native scroll-snap: swipe on phones, arrows or arrow keys elsewhere.
 * Slides are 86% wide so the next photo peeks in. Arrows only move between photos, so they work in the preview.
 */
function Carousel({ count }: { count: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const step = () => {
    const el = ref.current;
    const slide = el?.firstElementChild as HTMLElement | null;
    return el && slide ? slide.offsetWidth + parseFloat(getComputedStyle(el).columnGap || "0") : 0;
  };
  const go = (i: number) => ref.current?.scrollTo({ left: Math.max(0, Math.min(count - 1, i)) * step() });
  const arrow =
    "absolute top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-0 bg-white/90 text-[#1F2A2A] shadow-[0_4px_14px_rgba(0,0,0,0.18)] disabled:pointer-events-none disabled:opacity-0 transition-opacity";
  return (
    <div role="region" aria-roledescription="carousel" aria-label="Photo gallery" className="flex w-full flex-col items-center gap-3">
      <div className="relative w-full">
        <div
          ref={ref}
          tabIndex={0}
          onScroll={() => {
            const s = step();
            if (s) setIndex(Math.round(ref.current!.scrollLeft / s));
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
              e.preventDefault();
              go(index + (e.key === "ArrowRight" ? 1 : -1));
            }
          }}
          className="flex snap-x snap-mandatory gap-3 overflow-x-auto rounded-2xl px-[7%] [scrollbar-width:none] motion-safe:scroll-smooth [&::-webkit-scrollbar]:hidden"
        >
          {Array.from({ length: count }, (_, i) => (
            <div
              key={i}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}`}
              className={`flex aspect-[4/3] flex-none basis-[86%] snap-center items-center justify-center rounded-2xl ${tint} text-sm font-bold opacity-80`}
            >
              Photo {i + 1}
            </div>
          ))}
        </div>
        <button type="button" aria-label="Previous photo" disabled={index === 0} onClick={() => go(index - 1)} className={`${arrow} left-2`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg>
        </button>
        <button type="button" aria-label="Next photo" disabled={index >= count - 1} onClick={() => go(index + 1)} className={`${arrow} right-2`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>
        </button>
      </div>
      <p aria-live="polite" className="m-0 text-sm font-extrabold tabular-nums opacity-85">
        {index + 1} / {count}
      </p>
    </div>
  );
}

export function DemoView({ design: d, coverHtml }: { design: Design; coverHtml: string }) {
  const [pkg, setPkg] = useState<Previewable>("standard");
  const [drawer, setDrawer] = useState(false); // phones: overlay drawer, closed by default
  const [collapsed, setCollapsed] = useState(false); // desktop: open by default
  const [view, setView] = useState<"desktop" | "mobile">("desktop"); // desktop only: preview inside a phone frame
  // Morphs the guest view between the split layout and the phone frame (View Transitions API; see globals.css).
  // Browsers without it, and reduced-motion users, get an instant switch.
  const switchView = (v: "desktop" | "mobile") => {
    if (v === view) return;
    if (!document.startViewTransition || matchMedia("(prefers-reduced-motion: reduce)").matches) return setView(v);
    document.startViewTransition(() => flushSync(() => setView(v)));
  };
  const open = () => { setDrawer(true); setCollapsed(false); };
  const close = () => { setDrawer(false); setCollapsed(true); };

  const f = FEATURES[pkg];
  const p = PACKAGES.find((x) => x.id === pkg)!;
  const t = d.tile;
  const wedding = d.types[0] === "wedding";
  const parts = wedding ? [["Ceremony", "[Church name]"], ["Reception", "[Venue name]"]] : [["", "[Venue name]"]];
  const vars = { "--bg": t.bg, "--ink": t.ink, "--sub": t.text, "--btn": t.btn, "--btn-ink": t.btnInk, "--font": t.font } as CSSProperties;

  return (
    <>
    {/* Not part of the guest's view: tells prospects this is a sample. Phones: the label stays on one line and the
        package button sits here beside the links. */}
    <div className="bg-deep text-mist lg:sticky lg:top-0 lg:z-40">
      {/* Desktop: three columns. Left: reopen button while the sidebar is hidden; center: label; right: links. */}
      <div className="flex flex-wrap items-center justify-between gap-x-4 px-3 py-1 text-[13px] sm:px-4 sm:text-sm lg:grid lg:grid-cols-[1fr_auto_1fr] lg:py-2">
        <span className="hidden lg:flex">
          {!collapsed && (
            <span className="flex w-[268px] animate-[fade-in_200ms_ease-out] items-center justify-between gap-2 motion-reduce:animate-none">
              <span className="font-display text-[20px] font-medium text-white">Preview a package</span>
              <button
                type="button"
                onClick={close}
                aria-controls="pkg-panel"
                aria-expanded={true}
                aria-label="Hide packages"
                className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border-0 bg-white/10 text-mist hover:bg-white/20 hover:text-white"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg>
              </button>
            </span>
          )}
          {collapsed && (
            <button
              type="button"
              onClick={open}
              aria-controls="pkg-panel"
              aria-expanded={false}
              className="inline-flex min-h-11 animate-[pill-in_250ms_ease-out_150ms_both] cursor-pointer items-center gap-2 rounded-xl border-0 bg-mist px-4 font-sans text-sm font-extrabold whitespace-nowrap text-deep motion-reduce:animate-none"
            >
              Packages · {p.name}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>
            </button>
          )}
        </span>
        {/* Phones: two short lines (label, then the note); desktop: one centered sentence. */}
        <span className="min-w-0 basis-full py-1.5 text-center sm:basis-auto">
          <span className="block truncate lg:inline">
            <strong className="text-white">Sample guest view</strong> · {d.name}
          </span>
          <span className="block truncate text-xs lg:inline lg:text-sm">
            <span className="hidden lg:inline"> · </span>placeholders show where your details go
          </span>
        </span>
        <span className="flex flex-wrap items-center gap-x-3 sm:gap-x-4 lg:justify-self-end">
          <button
            type="button"
            onClick={open}
            aria-controls="pkg-panel"
            aria-expanded={drawer}
            className="inline-flex min-h-11 cursor-pointer items-center rounded-xl border-0 bg-mist px-3 font-sans text-[13px] font-extrabold whitespace-nowrap text-deep lg:hidden"
          >
            Package: {p.name}
          </button>
          <Link href="/#designs" className="inline-flex min-h-11 items-center font-bold whitespace-nowrap text-mist hover:text-white">All designs</Link>
          <Link href={`/book?design=${d.id}`} className="inline-flex min-h-11 items-center font-extrabold whitespace-nowrap text-gold hover:text-white">Book this design</Link>
        </span>
      </div>
    </div>
    <div className="lg:flex lg:items-start">
      {/* Package picker: a sidebar on desktop (collapsible), a drawer on phones. Uses site styles, not the design's. */}
      {/* Phones: backdrop fades with the drawer. */}
      <div
        aria-hidden="true"
        onClick={close}
        className={`fixed inset-0 z-40 bg-[rgba(20,38,37,0.5)] transition-opacity duration-300 motion-reduce:transition-none lg:hidden ${
          drawer ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      {/* Phones: the drawer slides in from the left. Desktop: the panel's width animates to 0 while its content slides
          out, so the invitation glides back to center. `invisible` applies after the slide, taking the closed panel out of
          the tab order. */}
      <aside
        id="pkg-panel"
        aria-label="Preview a package"
        className={`fixed inset-y-0 left-0 z-50 w-[300px] max-w-[85vw] transition-[translate,width,visibility] duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] motion-reduce:transition-none lg:sticky lg:top-[60px] lg:z-auto lg:h-[calc(100dvh-60px)] lg:max-w-none lg:flex-none lg:translate-x-0 lg:overflow-hidden ${
          drawer ? "visible translate-x-0" : "invisible -translate-x-full"
        } ${collapsed ? "lg:invisible lg:w-0" : "lg:visible lg:w-[300px]"}`}
      >
        <div
          className={`flex h-full w-full flex-col gap-4 overflow-y-auto border-r border-line bg-cream p-5 text-deep transition-[translate] duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] motion-reduce:transition-none lg:w-[300px] ${
            collapsed ? "lg:-translate-x-full" : "lg:translate-x-0"
          }`}
        >
        {/* Phones only: the drawer covers the top bar. On desktop this heading and button live in the top bar. */}
        <div className="flex items-center justify-between gap-2 lg:hidden">
          <h2 className="m-0 font-display text-[22px] font-medium">Preview a package</h2>
          <button type="button" onClick={close} aria-label="Hide packages" className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border-0 bg-fill text-deep">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg>
          </button>
        </div>
        <p className="m-0 text-sm text-muted">See what your guests get with each package, in the {d.name} design.</p>
        {/* Desktop only (on a phone you already see the mobile view). */}
        <div role="group" aria-label="Preview size" className="hidden grid-cols-2 gap-1 rounded-2xl bg-fill p-1 lg:grid">
          {(
            [
              ["desktop", "Desktop", <path key="d" d="M3 4h18v12H3zM8 20h8M12 16v4" />],
              ["mobile", "Mobile", <path key="m" d="M7 2h10a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zM11 18h2" />],
            ] as const
          ).map(([v, label, icon]) => (
            <button
              key={v}
              type="button"
              aria-pressed={view === v}
              onClick={() => switchView(v)}
              className={`inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border-0 font-sans text-sm font-extrabold transition-colors ${
                view === v ? "bg-white text-deep shadow-[0_1px_3px_rgba(30,56,54,0.18)]" : "bg-transparent text-muted hover:text-deep"
              }`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{icon}</svg>
              {label}
            </button>
          ))}
        </div>
        <div role="radiogroup" aria-label="Package" className="flex flex-col gap-2">
          {PACKAGES.filter((x): x is typeof x & { id: Previewable } => x.id in FEATURES).map((x) => {
            const on = x.id === pkg;
            return (
              <button
                key={x.id}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => setPkg(x.id)}
                className={`flex min-h-12 cursor-pointer items-center justify-between gap-2 rounded-2xl border-2 px-4 py-2.5 font-sans text-deep ${
                  on ? "border-teal bg-mist shadow-[0_0_0_3px_#D7E0D9]" : "border-line bg-white"
                }`}
              >
                <span className="font-display text-[17px]">{x.name}</span>
                <span className="text-[15px] font-extrabold">{peso(x.price)}</span>
              </button>
            );
          })}
        </div>
        <div className="flex flex-col gap-2 rounded-2xl border-[1.5px] border-line bg-white p-4">
          <span className="text-sm font-extrabold">What guests see with {p.name}</span>
          <ul className="m-0 flex list-disc flex-col gap-1 pl-5 text-sm text-body2">
            {f.notes.map((n) => <li key={n}>{n}</li>)}
          </ul>
        </div>
        <Link
          href={`/book?package=${pkg}&design=${d.id}`}
          className="inline-flex min-h-12 items-center justify-center rounded-full bg-teal px-5 text-center font-extrabold text-white no-underline hover:bg-deep hover:text-white"
        >
          Book {p.name} · {peso(p.price)}
        </Link>
        <p className="m-0 text-xs text-muted">Buttons on the invitation are turned off in this preview.</p>
        </div>
      </aside>

      {/* The guest's view */}
      {/* Phones/narrow: one column, the cover then the details. Wide (container ≥ 56rem, so it still works beside the
          package sidebar): a split layout with the cover pinned on the left and the details scrolling on the right. */}
      {/* Mobile preview (desktop only): a 390px phone frame that scrolls on its own. The guest page's layout is
          driven by this container's width, so it renders exactly as on a phone. */}
      <div className={view === "mobile" ? "min-w-0 flex-1 lg:flex lg:justify-center lg:py-6" : "contents"}>
      <div
        style={{ viewTransitionName: "guest-view" }}
        className={`@container min-w-0 flex-1 ${
          view === "mobile"
            ? "lg:h-[min(844px,calc(100dvh-60px-48px))] lg:w-[410px] lg:flex-none lg:overflow-y-auto lg:overscroll-contain lg:rounded-[40px] lg:border-[10px] lg:border-[#1F2733] lg:bg-[#1F2733] lg:shadow-[0_24px_60px_rgba(30,56,54,0.25)] lg:[scrollbar-width:none] lg:[&::-webkit-scrollbar]:hidden"
            : ""
        }`}
      >
        <main
          style={vars}
          className="mx-auto w-full max-w-[480px] overflow-x-clip bg-[var(--bg)] font-sans text-[var(--sub)] shadow-[0_24px_60px_rgba(30,56,54,0.18)] @4xl:grid @4xl:max-w-none @4xl:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] @4xl:items-start @4xl:shadow-none"
        >
          <div className="@4xl:sticky @4xl:top-0 @4xl:flex @4xl:h-dvh lg:@4xl:top-[60px] lg:@4xl:h-[calc(100dvh-60px)] @4xl:items-center @4xl:justify-center @4xl:bg-[color-mix(in_srgb,var(--ink)_7%,var(--bg))] @4xl:p-8">
            {/* Desktop: sized to the screen height (84vh tall at the cover's 390:844 ratio), as a card. */}
            <div className="w-full @4xl:w-[min(100%,39vh)] @4xl:overflow-hidden @4xl:rounded-[28px] @4xl:shadow-[0_24px_60px_rgba(0,0,0,0.22)]">
              <FitWidth width={390}>
                <div dangerouslySetInnerHTML={{ __html: coverHtml }} />
              </FitWidth>
            </div>
          </div>

          <div className="min-w-0">
          <Section label="WHEN AND WHERE" title={wedding ? "The celebration" : "Join us"}>
            <div className={`grid w-full gap-3 ${parts.length > 1 ? "@4xl:grid-cols-2" : ""}`}>
              {parts.map(([label, venue]) => (
                <div key={venue} className={`flex flex-col items-center gap-1 rounded-2xl ${tint} px-5 py-6`}>
                  {label && <p className="m-0 mb-1 text-xs font-extrabold tracking-[0.18em]">{label.toUpperCase()}</p>}
                  <p className="m-0 text-lg font-extrabold">[Day], [Month Day, Year]</p>
                  <p className="m-0">[Time]</p>
                  <p className="m-0 mt-2 font-extrabold">{venue}</p>
                  <p className="m-0">[Address], [City]</p>
                  <InertButton className="mt-3">Open in Maps</InertButton>
                </div>
              ))}
            </div>
          </Section>

          <Section label="WHAT TO WEAR" title="Motif and attire">
            <div className="flex gap-3" aria-label="Motif colors">
              {[t.btn, t.dot, t.ink].map((c, i) => (
                <span key={i} className="h-11 w-11 rounded-full border-[3px] border-white shadow-[0_0_0_1px_rgba(0,0,0,0.12)]" style={{ background: c }} />
              ))}
            </div>
            <p className="m-0">Attire: <strong>[Semi-formal]</strong></p>
          </Section>

          {f.gallery > 0 && (
            <Section label="MOMENTS" title="Gallery">
              {f.gallery <= 2 ? (
                // Lite's 2 photos fit side by side; a carousel only pays off with more.
                <div className="grid w-full grid-cols-2 gap-3">
                  {Array.from({ length: f.gallery }, (_, i) => (
                    <div key={i} className={`flex aspect-[4/5] items-center justify-center rounded-2xl ${tint} text-sm font-bold opacity-80`}>
                      Photo {i + 1}
                    </div>
                  ))}
                </div>
              ) : (
                <Carousel key={f.gallery} count={f.gallery} />
              )}
            </Section>
          )}

          {f.rsvp === "none" ? (
            <Section label="KINDLY CONFIRM BY [DATE]" title="Will you join us?">
              <p className="m-0">Kindly confirm your attendance with <strong>[Contact name]</strong> · [Mobile number]</p>
              <InertButton>Call [Contact name]</InertButton>
            </Section>
          ) : (
            <Section label="KINDLY REPLY BY [DATE]" title="Will you join us?">
              <div className="w-full">
                <RsvpDemo key={pkg} guestList={f.rsvp === "guestList"} extras={f.rsvp !== "core"} />
              </div>
            </Section>
          )}

          {f.rsvp !== "none" && (
            <Section label="QUESTIONS?" title="Get in touch">
              <p className="m-0">Contact <strong>[Coordinator name]</strong> · [Mobile number]</p>
              <InertButton>Call</InertButton>
            </Section>
          )}

          <footer className="border-t border-[color-mix(in_srgb,var(--ink)_18%,transparent)] px-6 py-6 text-center text-[13px] opacity-85">
            Invitation by <strong>Kumbida</strong>
          </footer>
          </div>
        </main>
      </div>
      </div>
    </div>
    </>
  );
}
