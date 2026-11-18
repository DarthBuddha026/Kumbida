import Link from "next/link";
import type { ReactNode } from "react";
import { DesignGallery } from "@/components/DesignGallery";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { DESIGNS } from "@/lib/designs";
import { PACKAGES, peso } from "@/lib/packages";
import { SITE } from "@/lib/site";

// Copy and layout: design/pages/Main.dc.html

const STEPS = [
  ["Pick a package and design", "Choose the tier that fits your event and a template from our library."],
  ["Add your details and photos", "Fill them in yourself on your private link, or send them to us and we set it up (Lite and up)."],
  ["Share one link", "Post it in your group chats or print the QR code. It shows a designed preview card in Messenger and Facebook."],
  ["Watch the replies come in", "See who's coming, how many kids, and their messages, all on your private link."],
];

const icon = (d: ReactNode) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{d}</svg>
);

const FEATURES: [ReactNode, string, string][] = [
  [icon(<><rect x="6" y="2" width="12" height="20" rx="3" /><path d="M11 18h2" /></>), "Looks great on any phone", "Fast on mobile data and inside Messenger's browser. Guests don't download anything."],
  [icon(<><path d="M9 11l3 3 8-8" /><path d="M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9" /></>), "RSVPs that add up for you", "Headcount, kids and messages, totaled live. Download the list for your caterer (Lite and up)."],
  [icon(<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" /></>), "Guest list with reserved seats", "\"We've reserved 3 seats for you.\" Guests find their invitation by name; you see who's still pending (Premium)."],
  [icon(<><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" /></>), "Change details anytime", "Venue moved? Time changed? Update it on your private link and the page updates for everyone."],
  [icon(<><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><path d="M14 14h3v3h-3zM20 14v.01M14 20h.01M17 20h4v-3" /></>), "QR code for printed invites", "Add it to your printed cards or venue signage so older relatives can reply too."],
  [icon(<><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></>), "Your guest list stays private", "Only you and our team can see replies and phone numbers. Guest data is deleted after your event."],
];

const FAQ = [
  ["Do my guests need to download an app or make an account?", "No. They open your link, read the details and reply. It works inside Messenger, Viber and any phone browser."],
  ["Can I change the details after I've shared the link?", "Yes. Update the time, venue or photos on your private link and the page changes for everyone right away. The link stays the same."],
  ["How do I see who's coming?", "Your private link shows every reply and the totals. From Lite up, you can download the list as a spreadsheet."],
  ["What if I have a fixed number of seats?", "Choose Premium. You set how many seats each family gets, and guests can only confirm up to that number."],
  ["How long does my page stay online?", "Until 90 days after your event. Guest phone numbers and messages are deleted then."],
  ["How do I pay?", "Scan our QR code or send by InstaPay from GCash, Maya or any bank app, then upload your receipt on your private link. Your page goes live once payment is confirmed."],
];

const pill = "inline-flex min-h-[54px] items-center rounded-full px-[30px] text-base font-extrabold no-underline";

export default function Home() {
  return (
    <div className="overflow-x-clip">
      <SiteHeader />
      <main>
        {/* HERO */}
        <section className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-14 px-6 pt-[72px] pb-16">
          <div className="flex min-w-0 flex-[1_1_440px] flex-col gap-[22px]">
            <p className="eyebrow">WEDDINGS · BIRTHDAYS · BAPTISMS · ANNIVERSARIES</p>
            <h1 className="m-0 font-display text-[clamp(40px,8vw,60px)] leading-[1.04] font-medium tracking-[-0.01em] text-balance">
              Beautiful invitations. RSVPs that count themselves.
            </h1>
            <p className="m-0 max-w-[34em] text-[19px] text-muted">
              Your celebration gets its own invitation page. Share one link in Messenger, Viber or on a printed QR code, and watch your
              guest count update as people reply. No app for your guests, no spreadsheets for you.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/book" className={`${pill} bg-teal text-white hover:bg-deep hover:text-white`}>Book now · from ₱299</Link>
              <Link href="#sample" className={`${pill} border-[1.5px] border-sage px-7 text-deep`}>View a sample invitation</Link>
            </div>
            <p className="m-0 text-sm text-muted">Pay with GCash or Maya · Live in as little as {SITE.setupDays} days</p>
          </div>

          <div id="sample" className="flex min-w-0 flex-[1_1_380px] scroll-mt-6 justify-center">
            <div className="relative w-[300px]">
              {/* Sample invitation: baby-boy blue (owner request; the reference used pink for "Lia's"). */}
              <div className="box-border flex h-[600px] w-[300px] flex-col items-center gap-3 overflow-hidden rounded-[40px] border-[9px] border-[#1F2733] bg-[#F3F8FD] px-[18px] py-[30px] text-center text-[#253B57] shadow-[0_30px_60px_rgba(37,59,87,0.22)]">
                <span className="text-[10px] font-extrabold tracking-[0.2em] text-[#3A6EA5]">YOU&apos;RE INVITED TO</span>
                <span className="font-display text-[44px] leading-none italic">Robbie&apos;s</span>
                <span className="font-display text-[22px] leading-none">First Birthday</span>
                <div className="relative mt-1.5 h-[220px] w-[180px]">
                  <div className="box-border flex h-[220px] w-[180px] items-center justify-center rounded-[90px_90px_20px_20px] border-[5px] border-white bg-[#D3E4F5] text-[11px] font-bold text-[#3F5F80]">Baby&apos;s photo</div>
                  <div className="absolute -right-2.5 -bottom-2.5 flex h-16 w-16 items-center justify-center rounded-full border-4 border-[#F3F8FD] bg-[#3A6EA5] font-display text-[30px] font-semibold text-white">1</div>
                </div>
                <span className="mt-2 text-[11px] font-extrabold tracking-[0.12em]">SAT · MARCH 20, 2027 · 3 PM</span>
                <span className="inline-flex min-h-10 items-center rounded-full bg-[#3A6EA5] px-5 text-[13px] font-extrabold text-white">RSVP by March 6</span>
              </div>
              <div className="absolute bottom-[70px] -left-3 flex w-[210px] flex-col gap-2.5 rounded-[18px] border border-line bg-white p-4 shadow-[0_16px_34px_rgba(41,75,73,0.16)] md:-left-[120px]">
                <span className="text-[11px] font-extrabold tracking-[0.12em] text-muted">YOUR RESPONSES · SAMPLE</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-display text-[34px] leading-none font-semibold">85</span>
                  <span className="text-[13px] font-bold text-muted">attending</span>
                </div>
                <div className="flex flex-wrap gap-1.5 text-xs font-extrabold">
                  <span className="rounded-full bg-mist px-2.5 py-1 text-teal">12 kids</span>
                  <span className="rounded-full bg-fill px-2.5 py-1 text-body2">9 declined</span>
                </div>
              </div>
              <div className="absolute top-[90px] -right-3 flex w-[168px] items-center gap-2.5 rounded-[18px] border border-line bg-white p-3.5 shadow-[0_16px_34px_rgba(41,75,73,0.16)] md:-right-24">
                <span aria-hidden="true" className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-mist text-teal">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7" /></svg>
                </span>
                <span className="text-[13px] leading-[1.3] font-bold">Tita Grace replied: <strong>3 coming</strong></span>
              </div>
            </div>
          </div>
        </section>

        {/* OCCASIONS */}
        <section aria-label="Occasions" className="border-y border-line bg-white">
          <div className="mx-auto flex max-w-[1200px] flex-wrap justify-between gap-x-7 gap-y-3 px-6 py-[22px] font-display text-[22px] text-muted">
            {["Weddings", "Debuts", "Birthdays", "Baptisms", "Anniversaries"].map((o, i) => (
              <span key={o} className="contents">
                {i > 0 && <span aria-hidden="true" className="text-sage">✦</span>}
                <span>{o}</span>
              </span>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how" className="mx-auto flex max-w-[1200px] scroll-mt-4 flex-col gap-10 px-6 py-[88px]">
          <div className="flex max-w-[640px] flex-col gap-2.5">
            <p className="eyebrow">HOW IT WORKS</p>
            <h2 className="h-section">From &quot;we&apos;re celebrating&quot; to a full guest count in four steps</h2>
          </div>
          <ol className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-5 p-0">
            {STEPS.map(([title, body], i) => (
              <li key={title} className="flex flex-col gap-2.5 rounded-[22px] border-[1.5px] border-line bg-white p-[26px]">
                <span className="font-display text-[40px] leading-none font-medium text-teal">{i + 1}</span>
                <h3 className="m-0 text-[19px] font-extrabold">{title}</h3>
                <p className="m-0 text-base text-muted">{body}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* DESIGNS */}
        <section id="designs" className="mx-auto flex max-w-[1200px] scroll-mt-4 flex-col gap-8 px-6 py-[88px]">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex max-w-[640px] flex-col gap-2.5">
              <p className="eyebrow">OUR DESIGNS</p>
              <h2 className="h-section">A design for every celebration</h2>
              <p className="m-0 text-[17px] text-muted">
                {DESIGNS.length} designs, from princess castles and race tracks to quiet, elegant weddings. Each one has the same RSVP
                form and works on any phone.
              </p>
            </div>
            <Link href="/book" className="text-base font-extrabold">Book with a design</Link>
          </div>
          <DesignGallery />
          <div className="flex flex-wrap items-center justify-between gap-3.5 rounded-[20px] border-[1.5px] border-line bg-white px-6 py-5">
            <span className="flex flex-col gap-0.5">
              <span className="text-[17px] font-extrabold">Want something one of a kind?</span>
              <span className="text-[15px] text-muted">With Personalized (₱4,999), we design a page just for your event, with 2 rounds of revisions.</span>
            </span>
            <Link href="/book?package=personalized" className="inline-flex min-h-11 items-center rounded-full border-2 border-outline bg-white px-5 font-extrabold text-teal no-underline">
              Book Personalized
            </Link>
          </div>
        </section>

        {/* FEATURES */}
        <section className="border-y border-line bg-white">
          <div className="mx-auto flex max-w-[1200px] flex-col gap-10 px-6 py-[88px]">
            <div className="flex max-w-[640px] flex-col gap-2.5">
              <p className="eyebrow">WHAT YOU GET</p>
              <h2 className="h-section">Made for how invitations actually get sent</h2>
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] gap-x-10 gap-y-8">
              {FEATURES.map(([svg, title, body]) => (
                <div key={title} className="flex gap-4">
                  <span aria-hidden="true" className="flex h-12 w-12 flex-none items-center justify-center rounded-[14px] bg-mist text-teal">{svg}</span>
                  <div className="flex flex-col gap-1">
                    <h3 className="m-0 text-lg font-extrabold">{title}</h3>
                    <p className="m-0 text-muted">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PACKAGES */}
        <section id="packages" className="mx-auto flex max-w-[1200px] scroll-mt-4 flex-col gap-9 px-6 py-[88px]">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex max-w-[640px] flex-col gap-2.5">
              <p className="eyebrow">PACKAGES</p>
              <h2 className="h-section">One-time price per event</h2>
            </div>
            <Link href="/packages" className="text-base font-extrabold">Compare all packages and preview each one</Link>
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] gap-5">
            {PACKAGES.map((p) => {
              const dark = p.id === "premium";
              const outlined = p.id === "personalized";
              return (
                <div
                  key={p.id}
                  className={`flex flex-col gap-2.5 rounded-[22px] p-[22px] ${
                    dark ? "border-[1.5px] border-deep bg-deep text-white" : outlined ? "border-2 border-teal bg-white" : "border-[1.5px] border-line bg-white"
                  }`}
                >
                  <h3 className="m-0 font-display text-2xl font-medium">{p.name}</h3>
                  <span className="text-[30px] font-extrabold tabular-nums">{peso(p.price)}</span>
                  {p.badge && (
                    <span
                      className={`self-start rounded-full px-2.5 py-[3px] text-xs font-extrabold ${
                        dark ? "bg-gold text-darkest" : p.id === "starter" ? "bg-fill text-body2" : "bg-mist text-teal"
                      }`}
                    >
                      {p.badge}
                    </span>
                  )}
                  <p className={`m-0 text-[15px] ${dark ? "text-mist" : "text-muted"}`}>{p.card}</p>
                  <Link
                    href={`/book?package=${p.id}`}
                    className={`mt-auto flex min-h-[46px] items-center justify-center rounded-xl text-[15px] font-extrabold no-underline ${
                      dark ? "bg-gold text-darkest hover:text-darkest" : "bg-teal text-white hover:bg-deep hover:text-white"
                    }`}
                  >
                    Book {p.name}
                  </Link>
                </div>
              );
            })}
          </div>
          <p className="m-0 text-[15px] text-muted">
            Add-ons: rush setup within 24 hours ₱300–500 · extra photos ₱200 · extra revision round for Personalized ₱500.
          </p>
        </section>

        {/* FAQ */}
        <section id="faq" className="scroll-mt-4 border-y border-line bg-white">
          <div className="mx-auto flex max-w-[1200px] flex-wrap gap-10 px-6 py-[88px]">
            <div className="flex flex-[1_1_280px] flex-col gap-2.5">
              <p className="eyebrow">FAQ</p>
              <h2 className="h-section">Questions hosts ask us</h2>
            </div>
            <dl className="m-0 flex min-w-0 flex-[2_1_520px] flex-col">
              {FAQ.map(([q, a], i) => (
                <div key={q} className={`py-5 ${i < FAQ.length - 1 ? "border-b border-line" : ""}`}>
                  <dt className="text-lg font-extrabold">{q}</dt>
                  <dd className="mt-1.5 mb-0 ml-0 text-muted">{a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* CONTACT CTA */}
        <section id="contact" className="mx-auto max-w-[1200px] scroll-mt-4 px-6 py-[88px]">
          <div className="flex flex-wrap items-center justify-between gap-7 rounded-[32px] bg-deep px-6 py-12 text-white sm:px-10 sm:py-14">
            <div className="flex flex-[1_1_420px] flex-col gap-2.5">
              <h2 className="m-0 font-display text-[clamp(32px,6vw,44px)] leading-[1.1] font-medium text-balance text-white">
                Ready to book? Let&apos;s make your invite.
              </h2>
              <p className="m-0 text-lg text-mist">
                Tell us your package, event and date on Messenger. We reply within {SITE.replyTime} with your private link to pay and set up.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href={SITE.messengerUrl} className={`${pill} bg-gold px-7 text-darkest hover:text-darkest`}>Book now on Messenger</a>
              <Link href="/book" className={`${pill} border-[1.5px] border-slate px-[26px] text-white hover:text-white`}>Use the booking form</Link>
              <a href={`mailto:${SITE.email}`} className={`${pill} border-[1.5px] border-slate px-[26px] text-white hover:text-white`}>{SITE.email}</a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
