import type { Metadata } from "next";
import { fontVars } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Kumbida · Online invitations and RSVP", template: "%s · Kumbida" },
  description:
    "Beautiful invitations. RSVPs that count themselves. Invitation pages for weddings, birthdays, debuts, anniversaries and reunions.",
};

export const viewport = { themeColor: "#F5F2E9" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${fontVars} antialiased`}>
      {/* Browser extensions (e.g. ColorZilla's cz-shortcut-listen) add attributes to <body> before React loads.
          This only ignores <body>'s own attributes; mismatches deeper in the tree are still reported. */}
      <body className="flex min-h-screen flex-col font-sans" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
