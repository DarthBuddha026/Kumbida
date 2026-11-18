import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { COMPARISON, PACKAGES, peso } from "@/lib/packages";

export const metadata: Metadata = { title: "Celebration RSVP Packages" };

export default function PackagesPage() {
  return (
    <>
      <SiteHeader />
      <main className="wrap pt-11 pb-[72px]">
        <p className="eyebrow">PACKAGES</p>
        <h1 className="mt-2 font-display text-[clamp(34px,7vw,46px)] leading-[1.08] font-medium">Celebration RSVP Packages</h1>
        <p className="mt-2 mb-8 max-w-2xl text-muted">One-time price per event. Upgrade anytime; your page and link stay the same.</p>
        <div className="overflow-x-auto rounded-[22px] border-[1.5px] border-line bg-white">
          <table className="w-full min-w-[860px] border-collapse text-left">
            <caption className="sr-only">Features included in each package</caption>
            <thead>
              <tr className="border-b border-line">
                <th scope="col" className="p-4 align-bottom">Feature</th>
                {PACKAGES.map((p) => (
                  <th key={p.id} scope="col" className={`p-4 align-bottom ${p.id === "premium" ? "bg-fill" : ""}`}>
                    <span className="block font-display text-lg">{p.name}</span>
                    <span className="block text-teal">{peso(p.price)}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row) => (
                <tr key={row.feature} className="border-b border-line last:border-0">
                  <th scope="row" className="p-4 font-semibold">{row.feature}</th>
                  {row.values.map((v, i) => (
                    <td key={i} className={`p-4 text-muted ${PACKAGES[i].id === "premium" ? "bg-fill" : ""}`}>{v}</td>
                  ))}
                </tr>
              ))}
              <tr>
                <td />
                {PACKAGES.map((p) => (
                  <td key={p.id} className={`p-4 ${p.id === "premium" ? "bg-fill" : ""}`}>
                    <Link href={`/book?package=${p.id}`} className="inline-flex min-h-11 items-center rounded-full bg-teal px-4 text-sm font-extrabold whitespace-nowrap text-white no-underline hover:bg-deep hover:text-white">Book {p.name}</Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-6 text-muted">
          Add-ons, arranged with us directly: rush setup (₱300–500), extra photos (₱200), extra revision round for Personalized (₱500).
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
