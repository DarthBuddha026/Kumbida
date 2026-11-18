import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";

export const metadata: Metadata = { title: "Privacy policy" };

// ponytail: plain-language draft from the design doc (§5.5, §13); needs review against the Data Privacy Act before launch.
export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />
      <main className="wrap max-w-3xl py-10 [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-display [&_h2]:font-medium [&_p]:mt-2 [&_p]:text-muted">
        <h1 className="text-4xl font-display font-medium">Privacy policy</h1>
        <p className="font-bold text-deep">Draft. This policy is being finalized before launch.</p>
        <h2>What we collect</h2>
        <p>From hosts: your name, mobile number, how to reach you, your event details and photos, and payment receipts.</p>
        <p>From guests: the name, mobile number and RSVP answers you give on an event page.</p>
        <h2>Why</h2>
        <p>To make and run your invitation page, collect RSVPs for the host, and confirm payments.</p>
        <h2>Who sees it</h2>
        <p>Only the event&apos;s host and the Kumbida team. Event pages are hidden from search engines, and guest lists are never public.</p>
        <h2>How long we keep it</h2>
        <p>Guests&apos; personal details are deleted after the event. Booking requests that don&apos;t go ahead are deleted after 30 days. We keep basic payment records for bookkeeping.</p>
        <h2>Your rights</h2>
        <p>Under the Philippine Data Privacy Act you can ask to see, correct or delete your data. Contact us through the details on our home page.</p>
      </main>
      <SiteFooter />
    </>
  );
}
