// Package tiers (design §5.4). Prices live here until admin Settings exists.
export type PackageId = "starter" | "basic" | "lite" | "standard" | "premium" | "personalized";

export type Package = {
  id: PackageId;
  name: string;
  price: number;
  card: string; // landing page card text
  badge?: string;
  booking: string; // booking page option text
};

// Copy from design/pages/Main.dc.html and Booking.dc.html.
export const PACKAGES: Package[] = [
  { id: "starter", name: "Starter", price: 299, badge: "Invitation only, no RSVP",
    card: "Your invitation page with details, map, 1 photo and QR code. You set it up.",
    booking: "Invitation page only, no RSVP. You set it up." },
  { id: "basic", name: "Basic", price: 499,
    card: "Everything in Starter plus an RSVP form and live responses. You set it up.",
    booking: "Invitation + RSVP and live responses. You set it up." },
  { id: "lite", name: "Lite", price: 999, badge: "We set it up for you",
    card: "3 photos, full RSVP with kids and messages, spreadsheet download.",
    booking: "We set it up. 3 photos, full RSVP, downloads." },
  { id: "standard", name: "Standard", price: 1499,
    card: "Everything in Lite plus a photo gallery of up to 10 photos.",
    booking: "Everything in Lite plus a photo gallery." },
  { id: "premium", name: "Premium", price: 2499, badge: "Best for weddings",
    card: "Everything in Standard plus a guest list with reserved seats per family.",
    booking: "Guest list with reserved seats. Best for weddings." },
  { id: "personalized", name: "Personalized", price: 4999, badge: "Designed just for you",
    card: "Everything in Premium with a one-of-a-kind design, 20 photos and 2 rounds of revisions.",
    booking: "A one-of-a-kind design made just for you." },
];

export const peso = (n: number) => `₱${n.toLocaleString("en-PH")}`;

export const isPackageId = (v: unknown): v is PackageId => PACKAGES.some((p) => p.id === v);

// Full comparison (design §5.4 "Feature detail per tier"), one value per package in PACKAGES order.
export const COMPARISON: { feature: string; values: string[] }[] = [
  { feature: "Who sets it up", values: ["You, via private link", "You, via private link", "We do", "We do", "We do", "We do (priority)"] },
  { feature: "Details, schedule (up to 5 parts), map links, motif and attire, contact", values: ["✓", "✓", "✓", "✓", "✓", "✓"] },
  { feature: "Photos", values: ["1 (hero)", "1 (hero)", "Up to 3", "Up to 10 incl. gallery", "Up to 10 incl. gallery", "Up to 20 incl. gallery"] },
  { feature: "RSVP form", values: ["— (your contact shown instead)", "Core fields", "✓ + optional questions", "✓ + optional questions", "✓ + optional questions", "✓ + optional questions"] },
  { feature: "Responses", values: ["—", "View on private link", "View + download", "View + download", "View + download", "View + download"] },
  { feature: "Share link, QR code, link preview", values: ["✓", "✓", "✓", "✓", "✓", "✓ (custom card)"] },
  { feature: "Full share kit (invite message, share card download)", values: ["—", "—", "✓", "✓", "✓", "✓"] },
  { feature: "Guest list (seats, personal links, name search, pending)", values: ["—", "—", "—", "—", "✓", "✓ (optional)"] },
  { feature: "Design", values: ["Template library", "Template library", "Template library", "Template library", "Template library", "Custom, made for you"] },
];
