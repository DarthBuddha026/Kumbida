// Owner-supplied business details. The design leaves these as [placeholders]; fill them in here or via env.
export const SITE = {
  messengerUrl: process.env.NEXT_PUBLIC_MESSENGER_URL || "#contact",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "[your@email.com]",
  setupDays: "[X]", // "Live in as little as [X] days"
  replyTime: "[X hours]", // "We reply within [X hours]"
};
