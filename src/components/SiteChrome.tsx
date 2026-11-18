import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 text-deep no-underline hover:text-deep">
      <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-teal">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C5A66B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M3 7l9 6 9-6" />
        </svg>
      </span>
      <span className="font-display text-[22px] font-semibold">Kumbida</span>
    </Link>
  );
}

const NAV = [
  ["How it works", "/#how"],
  ["Designs", "/#designs"],
  ["Packages", "/#packages"],
  ["FAQ", "/#faq"],
  ["Contact", "/#contact"],
];

/** Landing-page header (design/pages/Main.dc.html). `back` gives the booking page's "← Back to home" variant. */
export function SiteHeader({ back = false }: { back?: boolean }) {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-cream">
      <nav aria-label="Main" className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-x-4 gap-y-1 px-6 py-2.5 lg:py-[18px]">
        <Logo />
        {back ? (
          <Link href="/" className="inline-flex min-h-11 items-center text-[15px] font-bold no-underline">← Back to home</Link>
        ) : (
          // Phones: logo + Book now on top, links in one swipeable row below. lg+: one row, as in the design.
          <div className="contents text-[15px] font-bold lg:flex lg:items-center lg:gap-x-[22px]">
            <div className="order-last -mx-6 flex w-[calc(100%+48px)] gap-x-[22px] overflow-x-auto px-6 whitespace-nowrap [scrollbar-width:none] lg:order-none lg:mx-0 lg:w-auto lg:overflow-visible lg:px-0">
              {NAV.map(([label, href]) => (
                <Link key={href} href={href} className="inline-flex min-h-11 items-center text-deep no-underline">{label}</Link>
              ))}
            </div>
            <Link href="/book" className="inline-flex min-h-11 items-center rounded-full bg-teal px-[22px] font-extrabold text-white no-underline hover:bg-deep hover:text-white">
              Book now
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-4 px-6 pt-7 pb-10 text-sm text-muted">
        <span>© 2026 Kumbida · Online invitations &amp; RSVP, made in the Philippines</span>
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          <Link href="/privacy" className="inline-flex min-h-11 items-center">Privacy policy</Link>
          <Link href="/terms" className="inline-flex min-h-11 items-center">Terms</Link>
          <Link href="/admin" className="inline-flex min-h-11 items-center">Admin log-in</Link>
        </div>
      </div>
    </footer>
  );
}
