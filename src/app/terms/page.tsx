import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";

export const metadata: Metadata = { title: "Terms" };

// ponytail: placeholder until the owner's client agreement (§13) is written.
export default function TermsPage() {
  return (
    <>
      <SiteHeader />
      <main className="wrap max-w-3xl py-10">
        <h1 className="text-4xl font-display font-medium">Terms of service</h1>
        <p className="mt-4 text-muted">
          Our terms are being finalized before launch. In short: you are responsible for the photos you upload (you must have the
          right to use them) and for the accuracy of your guest list. Message us with any questions before you book.
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
