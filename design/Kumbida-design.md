# Kumbida — Design

*Date: 2026-11-17 · Updated: 2026-11-18 (website design, template library) · Status: ready for approval*

Items marked **(proposal)** are calls made during design that the owner hasn't explicitly confirmed; everything else was decided in conversation.

---

## 1. Intent

**Kumbida** is an online RSVP service sold to people hosting celebrations: weddings, birthdays, baptisms, anniversaries and other occasions. Each event gets its own public webpage built from one of the owner's professionally designed templates. Guests open the page and RSVP there.

The owner (and their team) runs the business from an **admin dashboard** and keeps control of the design. Hosts get a **private host link** where they edit their event's content, upload photos and watch responses come in. That way the most common requests ("change the time", "who's coming?") don't have to go through the owner.

**Why this shape:** the design quality is part of what clients pay for, so design stays with the owner. The repetitive back-and-forth (collecting photos, content edits, RSVP reports) is handed to the host through a secure link, without the cost of full host accounts.

## 2. Goals, non-goals, anti-goals

**Goals**
- Owner can set up and publish a new event in minutes from the admin dashboard.
- Each event has a fast, beautiful, mobile-first public page that previews well when shared in chat apps (Messenger, Viber, etc.).
- Hosts can edit content, upload photos, manage RSVP options and see/download responses without contacting the owner.
- Two RSVP modes per event: **Open** and **Guest list**, plus an invitation-only option with no RSVP.
- Template library that grows over time; one template can serve any event type.

**Non-goals (v1)**
- Host sign-up/accounts or self-serve event creation. The owner creates every event.
- A payment gateway or automatic payment confirmation. Clients pay the owner's UnionBank account; the system tracks orders by InstaPay reference number and the owner confirms each payment in one tap (§5.6).
- Meal choices on the RSVP form.
- Custom form builder or drag-and-drop page editor.
- Email/SMS notifications or reminders **(proposal)**.

**Anti-goals** (outcomes that count as failure even if every feature works; check new features against these)

| # | Must never happen | Why it matters | Guarded by |
|---|---|---|---|
| 1 | **A guest page looks broken or off-brand**, whatever the host types or uploads (long names, sideways or huge photos, missing details). | Every page is shared in group chats and carries the Kumbida name; one ugly page is bad advertising. | Fixed templates, editable fields only, length limits, browser photo resizing, templates tested with missing data (§5.1, §9, §11). |
| 2 | **Guest names or phone numbers are seen by anyone other than the host and the owner.** | It breaks guests' trust and the Data Privacy Act. | Long random host-link tokens, `noindex`, last-4-digit check in guest-list mode, no public guest lists, deletion after the event (§5.3, §5.5, §7). |
| 3 | **An RSVP is lost** (a guest replies but the host never sees it). | The host plans food and seats from these numbers; a missing reply is a real-world problem at the event. | Saved replies are confirmed to the guest, change history, nightly backups (§6, §7, §12). |
| 4 | **The guest page is slow or broken on mobile data or inside Messenger's browser.** | That is how most guests open the link; if it doesn't load, they don't RSVP. | Cached pages, small WebP photos, testing in in-app browsers, fallbacks for unreliable features (§10, §11). |
| 5 | **Hosts need to message the owner to do basic things** (change the venue, add photos, download the list). | Self-service is what makes the service affordable to run; a confusing host link turns every event into support work. | One simple host-link page, no account or password, clear sections (§7). |
| 6 | **A money mistake:** a host gets set up without paying, a payment is matched to the wrong order, or a client pays and nothing happens. | It loses money or a client's trust, often days before their event. | Setup locked until the owner confirms payment, reference + amount + date matching, receipt flags, status shown to the client (§5.6, §7). |
| 7 | **A template uses someone else's characters, brands or real people's details.** | Selling designs with trademarked characters or names exposes the business to takedowns and legal claims. | Original art only, original stand-ins for branded themes, occasion display text and placeholders (§9.1). |
| 8 | **Running costs appear before there are paying clients.** | The plan only works if it costs ₱0 a month until sales start. | Free-tier stack with commercial use allowed, browser-side image work, cached pages (§12). |

## 3. Roles

| Role | How they get in | What they can do |
|---|---|---|
| **Admin** (owner/team) | Email + password login to `/admin` | Everything: events, templates preview, all settings, host-link management, responses |
| **Host** (couple, parent, celebrant, coordinator) | Private host link, no account; optional PIN | Edit event content, photos, RSVP options, guest list; view and download responses |
| **Guest** | Public event link (open mode) or their invitation link (guest-list mode) | View event page, submit and edit their RSVP |

## 4. Approaches considered

| Approach | Summary | Trade-off |
|---|---|---|
| **A. Templates as code in one Next.js app** ✅ chosen | Each template is a React component in the codebase rendering typed event data. Admin, host link and guest pages in one app; Postgres + object storage. | Full creative freedom, type-safe templates, SSR for fast pages and link previews. New template = code + deploy (fine, since the owner builds designs in-house). |
| B. Templates as HTML in the database | HTML/CSS with `{{placeholders}}` uploaded via admin | Add templates without deploying, but no type checking, awkward interactivity, needs preview/test machinery. |
| C. Laravel + Filament, Blade templates | Templates as code, ready-made admin panel | Fastest admin, but richer guest-page interaction is more work than in a React app. |

The owner picked **A**.

The host-involvement model was also chosen from three options: *owner does everything* / *full host self-serve* / **hybrid with a private host link** ✅.

## 5. Event model

### 5.1 Event fields

| Field | Who edits | Notes |
|---|---|---|
| Event type | Admin | Wedding, Birthday, Baptism/Christening, Anniversary, Other |
| Template | Admin (pre-filled from the client's booking choice) | Must be one that supports the event type; the admin can change it before the page goes live |
| Public slug | Admin | e.g. `/ana-and-marco`; unique |
| Package | Admin | `starter`, `basic`, `lite`, `standard`, `premium` or `personalized`; controls which features the event gets (§5.4) |
| RSVP mode | Admin | `none` (Starter package), `open`, or `guest_list` (Premium or Personalized) |
| Status | Admin (+ automatic) | See lifecycle, §5.5 |
| Main name(s) / title | Host, Admin | e.g. "Ana & Marco", "Baby Lia's Christening"; length-limited |
| Schedule | Host, Admin | One or more parts, see §5.2 |
| Coordinator/host contact | Host, Admin | Name (optional) + mobile number |
| Color motif | Host, Admin | Toggle; 1–4 colors via color picker; shown as swatches |
| Attire / dress code | Host, Admin | Toggle; dropdown (Formal, Semi-formal, Smart casual, Casual, Theme/costume) + "Other" free text |
| Photos | Host, Admin | Hero + gallery; limits set by template |
| RSVP deadline | Host, Admin | Form closes after this |
| Max party size (open mode) | Host, Admin | e.g. up to 4 per RSVP |
| Optional RSVP questions | Host, Admin | Toggles, see §6 |
| Host link / PIN | Admin | Regenerate link; set/clear PIN |
| Internal notes | Admin only | Payment status, add-ons, etc. (free text) **(proposal)** |

Motif colors are information for guests (what to wear/bring). They don't recolor the template, because the design is fixed **(proposal)**.

### 5.2 Schedule

An event has an ordered list of **parts** (at least one). Each part has:
- label (e.g. "Ceremony", "Reception", "Party"; free text with suggestions)
- date + start time (end time optional), stored with time zone (default Asia/Manila)
- venue name + address
- map link (pasted Google Maps or other URL → "Open in Maps" button)

A simple birthday has one part, and the label can stay hidden when there's only one. The first part's date/time is the event's headline date (hero, link preview, countdown). The event counts as *past* after the last part's date. Hosts can add, edit, reorder and remove parts (proposal cap: 5). Templates must render 1–5 parts gracefully.

The RSVP covers the whole event, not each part separately **(proposal)**.

### 5.3 Guest-list invitations (guest-list mode)

Each invitation (often a household) has: display name ("Santos Family"), reserved seats, optional mobile number, optional notes/group. Hosts add invitations one at a time or by uploading a spreadsheet (CSV/XLSX with columns *Name, Seats, Mobile, Alternate names, Notes*). Hosts can edit seats later.

Each invitation can also have **alternate names** for lookup (e.g. "Santos Family" also matches "Juan Santos", "Jun Santos").

**How guests reach their invitation: both ways.**
- **Shared event link + name search (default):** one link for group chats, posts, or a QR code on printed invitations. The guest types their name and the page shows matching invitations.
  - Matching covers display name and alternate names; it's case- and accent-insensitive and tolerates small typos.
  - At most 3 matches are shown, with display names only, never seats or answers.
  - If the invitation has a mobile number on file, the guest must confirm its **last 4 digits** before seeing or changing that invitation's RSVP. Attempts are rate-limited.
  - With no match, the page shows "Can't find your name? Contact [coordinator number]."
- **Personal link per invitation:** each invitation has its own tokenized link that the host can copy (or bulk-download with the guest list) and send directly. Opening it goes straight to that invitation's form, with no search and no verification.

### 5.4 Packages

Each event has a package set by the admin. The package decides which features the host link and guest page offer; the system enforces it, so the owner doesn't have to. Payment happens outside the system (non-goal); prices are listed for reference and can change without code changes **(proposal: price table kept in config, not hard-coded in templates)**.

| Tier | Best for | Inclusions | Price |
|---|---|---|---|
| **Starter** | Simple parties, small family gatherings, hosts who only need to share the details | Self-setup via host link · digital invitation page (details, schedule, map links, motif/attire, contact) · 1 photo · share link, QR code, link-preview card · **no RSVP** (contact shown instead) | **₱299** |
| **Basic** | Kids' birthdays, small baptisms on a budget | Everything in Starter · **core RSVP** (name, attending, headcount, mobile) · view responses in host link | **₱499** |
| **Lite** | Birthdays, baptisms and anniversaries that want it done for them | **Owner sets it up** · up to 3 photos · all optional RSVP questions (companions, kids, message) · spreadsheet download · full share kit (invite message, share card download) | **₱999** |
| **Standard** | Debuts, milestone birthdays, bigger baptisms and anniversaries | Everything in Lite · **photo gallery** (up to 10 photos) | **₱1,499** |
| **Premium** | Weddings and events with a fixed headcount | Everything in Standard · **guest-list mode** (reserved seats per family, personal links, name search with verification, pending tracking, bulk invite messages) | **₱2,499** |
| **Personalized** | Couples and hosts who want a one-of-a-kind page, e.g. matching their printed invitation, monogram or theme | Everything in Premium · **custom design made just for them** (their colors, fonts, monogram, layout) · matching custom link-preview card · up to 20 photos · up to 2 rounds of revisions · priority setup · open or guest-list RSVP, their choice | **₱4,999** |

Feature detail per tier:

| Feature | Starter (₱299) | Basic (₱499) | Lite (₱999) | Standard (₱1,499) | Premium (₱2,499) | Personalized (₱4,999) |
|---|---|---|---|---|---|---|
| Who sets it up | Host, via host link | Host, via host link | Owner | Owner | Owner | Owner (priority) |
| Event details, schedule (up to 5 parts), map links, motif / attire, contact | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Photos | 1 (hero) | 1 (hero) | up to 3 | up to 10 incl. gallery | up to 10 incl. gallery | up to 20 incl. gallery |
| RSVP form | — (contact shown instead) | Core fields only | ✓ + optional questions | ✓ + optional questions | ✓ + optional questions | ✓ + optional questions |
| Responses | — | View in host link | View + download | View + download | View + download | View + download |
| Share link, QR code, share card / link preview | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ (custom-designed card) |
| Full share kit (invite message, share card download) | — | — | ✓ | ✓ | ✓ | ✓ |
| Guest-list mode (seats, personal links, name search, pending) | — | — | — | — | ✓ | ✓ (optional) |
| Design | Template library | Template library | Template library | Template library | Template library | **Custom, made for this event** (2 revision rounds) |

- **Starter** is a digital invitation page only: no RSVP. Where the RSVP section would be, the page shows a "Kindly confirm your attendance with [contact name] · [number]" block with a tap-to-call link. Its RSVP mode is `none`.
- **Self-setup tiers (Starter, Basic):** the admin creates the event (type, template, slug, package) and sends the host link; the host fills in everything else. This is what keeps them profitable at a low price.
- Upgrade path is designed in: Starter → Basic turns on the RSVP form for the same page and link.
- **Personalized** gets its own template, built by the owner in code like any other template but marked **private** to that event: it never appears in the library or demo pages, and isn't offered to other clients without the client's permission **(proposal)**. It's the one tier whose setup takes design time (roughly 1–2 days per page), which is what the price covers. Revisions beyond 2 rounds are billed as an add-on.
- Templates still decide their own limits (e.g. a template with no gallery); the effective limit is the smaller of package and template.
- Upgrading an event's package unlocks features immediately; nothing entered is lost. Downgrading hides extra features but keeps their data until archive, in case it was a mistake **(proposal)**.
- Every package gets the same share card, link previews, spam protection, privacy, and data retention.
- The host link shows locked features greyed out with "Available in Standard" so hosts know what an upgrade gets them **(proposal)**.

Add-ons (handled manually by the owner, outside the system): rush setup (₱300–500), extra photos (₱200), extra revision round for Personalized (₱500) **(proposal)**. The old "custom template by quote" add-on is replaced by the Personalized tier.

### 5.5 Lifecycle

`draft` → `published` → `rsvp_closed` → `past` → `archived`

- **draft:** the event exists and its host link works, but until payment is confirmed the link shows only the Pay step. After confirmation the host can fill in details and upload photos (and the owner sets up Lite and up). The public page is only visible as a preview to admin and host.
- **published:** public page live, RSVP open.
- **rsvp_closed:** automatic at the deadline (or manual). Page still visible; form replaced by "RSVPs are closed. Please contact [contact number]."
- **past:** automatic after the last schedule part's date. Page still viewable; host link still works for downloads.
- **archived:** after a retention period (proposal: 90 days after event), guests' personal data (phones, messages) is purged. The admin can archive or delete earlier **(proposal)**.

### 5.6 Payments (owner decision: UnionBank account, matched by InstaPay reference number + amount + date)

Clients pay into the owner's **UnionBank account**. No payment gateway in v1; the system automates everything around the owner's check, and **the InstaPay reference number, together with amount and date, ties a payment to a client's order.**

**Ways a client can pay** (shown on the host link's Pay step):
- **Scan the owner's UnionBank QR code** (generated in the UnionBank Online app) from GCash, Maya or any bank app that supports InstaPay QR. *(Owner uploads the QR image in admin settings.)*
- **InstaPay transfer** to the UnionBank account number shown, from any bank or e-wallet.
- The page tells senders from other banks/e-wallets that their app may charge an InstaPay fee, and to send the **exact package price**.
- PESONet and UnionBank-to-UnionBank transfers are accepted too, but have no InstaPay reference; those go to the manual fallback below.

**Flow**
1. Admin creates the event with its package. The system creates an **order** for the **exact package price** (no unique centavos).
2. The host link shows a **Pay** step first: amount, the QR and account details, then **"Upload your receipt"**. The flow is **upload first, auto-read, then confirm** (owner decision):
   - The client picks their receipt screenshot. It's resized in the browser like photos, then **read automatically (OCR in the browser, e.g. Tesseract.js, loaded only on this step)**. No server CPU, no cost.
   - A parser per app finds the fields by their labels. For GCash: **"InstaPay Invoice No."** (never the 13-digit "Ref No."), **Transfer Amount**, **Date**, plus the **receiving bank, account name and account number**.
   - The form shows the read values **pre-filled for the client to check and edit**, with checks: paid via InstaPay ✓, **sent to Kumbida's UnionBank account** ✓ (account no./name match settings), **amount matches the package** ✓ or a warning ("Your receipt shows ₱450.00 but Basic is ₱499.00").
   - The client still **types the name on the paying account**: the receipt shows the receiver (Kumbida), not the sender.
   - If the screenshot can't be read, the same fields appear empty to type in, with the "where to find it" guide. A reference of 10+ digits still triggers the "that looks like your Ref No." warning.
   - **Several receipts per order** (owner decision): if the total is short (e.g. ₱450 of ₱499), the form shows "₱49.00 still to pay" and **Add another receipt**. Each receipt is read and checked on its own (own reference, amount, date), a reference can't repeat within the order, and the order can only be submitted once receipts add up to at least the package price. If they add up to more, the client is told the extra will be returned after confirmation **(proposal)**.
   - **Submit stays disabled until every requirement is met** (owner decision): each receipt has a reference (6–9 digits, not repeated), amount and date; no receipt is still being read; the payer name is filled in; and the receipts add up to at least the price. Under the disabled button, a short "To submit, please:" list says exactly what's left (e.g. "Add a receipt for the remaining ₱49.00").
   - What the OCR read is stored with the order next to what the client submitted, so the owner can see if the client changed a value.
   - OCR is a convenience, not proof: an edited screenshot can still read fine. The owner always confirms against UnionBank (step 4).
   - Later option if misreads are common: swap the in-browser reader for a vision model (e.g. Cloudflare Workers AI) behind the same parser interface.
   **Nothing else on the host link unlocks until the owner confirms payment** (owner decision): before that, the host sees only the Pay step and its status ("We're checking your payment"), with the later steps shown as locked.
3. On submit the system **normalizes** the reference (trims spaces, keeps digits/letters) and checks it against other orders. **InstaPay references are short (UnionBank shows 6 digits) and repeat over time**, so the reference alone is not unique:
   - **Blocked:** same reference + same amount + same payment date already on another order (a reused receipt).
   - **Flagged for the owner, not blocked:** same reference on a different date or amount.
   Then the order goes to **Payments to verify**. The client also enters the **payment date/time** (pre-filled with now) so the owner can find it quickly.
   The Pay step shows where the **InstaPay reference** appears on a typical receipt, since GCash/bank receipts also show the app's own reference number. The field accepts either; the owner matches on reference + amount + date + sender name, with the screenshot as backup.
4. Admin dashboard → **Payments to verify** (one row per receipt, grouped by order, with the order's total vs. price), laid out to match UnionBank's incoming entry: **reference** (large, copyable) · amount · payment date/time · **sender name** · screenshot · client · package · **⚠ suspicious-receipt flags** (below). The owner matches the reference against the number at the end of UnionBank's "Received from…" description, plus amount, date and sender name. The owner searches that reference in UnionBank's transaction history, checks the amount, and taps **Confirm** or **Reject** (with a reason the host sees, e.g. "Reference not found yet, please check the number").
5. **When every receipt in the order is confirmed and they add up to the price**, automatically: order marked Paid (who confirmed, when) → the host link unlocks → Starter/Basic: the host fills in their page and it is published once the required fields are complete → Lite and up: event moves to the owner's **Setup queue** → host link shows "Payment received ✓".
6. **Fallback (no reference or the bank history doesn't show it):** match on amount + date + sender name from the screenshot; admin can also record a payment by hand and mark an order Refunded.

**Suspicious-receipt flags** (owner decision; warnings only, never automatic rejection)

Screenshots can't be proven genuine, and image-forensics tools give too many false alarms on phone screenshots. The real protection is that **nothing is marked Paid until the owner sees the money in UnionBank**. Flags only tell the owner which receipts deserve a closer look. Each check runs when a receipt is submitted; results are stored on the receipt and shown in **Payments to verify** as e.g. "⚠ 2 flags: date before order · numbers don't add up".

| Flag | Check | Catches |
|---|---|---|
| `image_reused` | Perceptual hash of the uploaded image (computed in the browser before upload, stored on the receipt) is close to any earlier receipt's hash, on any order | Reusing an old or someone else's receipt, even resized or recropped |
| `reference_reused` | Same normalized reference + same amount + same date already on another order (hard block, §5.6 step 3); same reference on a different date/amount → flag only | Typed reuse of a receipt |
| `date_out_of_range` | Receipt date/time is before the order was created, or later than the upload time (with a few minutes' tolerance) | Old receipts, edited dates |
| `totals_mismatch` | Numbers on the receipt don't add up, e.g. GCash *Total* ≠ *Transfer Amount* + *Fee* | Careless edits to the amount |
| `wrong_recipient` | Receiving bank / account number / account name read from the receipt don't match Kumbida's settings | Receipts for other payments |
| `not_a_screenshot` | Image size doesn't match a common phone screen, or its metadata (read in the browser **before** it's stripped) names an image-editing app | Some edited images (weak signal) |
| `edited_after_read` | The client changed a value that OCR read from the receipt (reference, amount or date) | Typed values that differ from the screenshot |
| `ocr_low_confidence` | OCR confidence on the reference or amount is low | Blurry, cropped or tampered regions; also honest bad screenshots |

- Flags are **advisory**: the client never sees them, and they never block submission (except the hard-block case of `reference_reused`).
- The owner can mark a flag "checked, OK" so it isn't shown again for that receipt; the decision is kept in the change history.
- Thresholds (hash distance, time tolerance, OCR confidence) live in config so they can be tuned once real receipts come in.
- **Only real fix for fakes:** reading bank data directly (UnionBank Business Banking API or a payment gateway), listed under "Not in v1".

**Data:** order = event, package, price, status (`awaiting_payment` → `to_verify` → `paid` / `rejected` → `refunded`), sender account name, and **one or more receipts**, each with: reference no. (normalized; unique together with amount + payment date, not on its own), amount, payment date/time, screenshot key, OCR-read values and which fields the client edited, perceptual image hash, flags (and any "checked, OK" marks), and its own verify status, screenshot key, submitted at, confirmed by/at, rejection reason. Receipt screenshots are deleted with the event's other data at archive; the order record (amount, reference, dates) is kept for bookkeeping **(proposal)**.

**Checked (owner's UnionBank app):**
- *Outgoing* InstaPay: shows UnionBank's own reference ("UB…") and a separate **InstaPay Reference Number** (6 digits).
- *Incoming* InstaPay: shows UnionBank's reference ("UB…"), **date/time**, **amount**, and a description like **"Received from [SENDER FULL NAME] [SENDER BANK CODE] [6-digit number]"** (e.g. "GXI 412688" from GCash). There is no separate InstaPay field: the 6-digit number at the end of the description is what clients' references are matched against.
- **Tested GCash → UnionBank (₱65, Nov 18 2026):** the GCash receipt shows **"InstaPay Invoice No." (7 digits, e.g. 5893610)** and a separate 13-digit **"Ref No."**. UnionBank's incoming entry shows **"GXI 893610"**: the **last 6 digits of GCash's InstaPay Invoice No.** GCash's 13-digit Ref No. does not appear on UnionBank. The sender's ₱10 InstaPay fee is charged on top; UnionBank receives the exact amount sent.
- **Matching rule (from this test):** store the number the client enters in full; match on its **last 6 digits** against the number at the end of UnionBank's "Received from …" description.
- **Pay step guide:** for GCash, ask for the **"InstaPay Invoice No."** (GCash's own label) with a picture of where it is on the receipt. If the client enters 10+ digits, show: "That looks like your GCash Ref No. Please enter the InstaPay Invoice No. just above it." Tell clients to send the exact package price; their app may add a fee on top.
- **Still to test before launch:** Maya and at least one bank app (which receipt label holds the InstaPay number, and how many digits).

**Not in v1, possible later**
- **Automatic confirmation via UnionBank's API.** UnionBank has a developer portal tied to its Business Banking service; with a business account and API access, the system could read incoming transactions and auto-confirm orders whose reference numbers match. Needs a registered business and UnionBank's approval.
- **A payment gateway with QR Ph** (PayMongo, HitPay, etc.) for fully automatic, official confirmation, at ~1–2.5% per payment.

## 6. RSVP form

**Always shown**
| Field | Open mode | Guest-list mode |
|---|---|---|
| Name | typed by guest | already filled ("Hi, Santos Family!") |
| Will you attend? | Yes / No | Yes / No |
| How many are coming? (only if Yes) | 1 … host's max party size | 1 … reserved seats ("We've reserved 3 seats for you") |
| Mobile number | required | optional |

**Optional, host toggles each on/off**
- Names of companions (one text field per extra person, up to the party size)
- Number of kids, asked as "Of those, how many are kids?" so it's *part of* the headcount, not added on top. Totals show "85 people (12 kids)" **(proposal)**.
- Message for the celebrants (text, length-limited)

**Behavior**
- **Open mode duplicates:** if a submission's mobile number matches an existing response for the event, it updates that response instead of creating a new one. Because anyone who knows a number could do this, the previous answer is kept in the response's history and the host sees it marked "Updated" with the change **(proposal)**.
- **Spam protection** on every public form (RSVP, name search, last-4 check): Cloudflare Turnstile (free, usually invisible) plus per-IP and per-event rate limits **(proposal)**.
- **Editing:** after submitting, guests see a thank-you screen with their answers, an **Add to calendar** button (.ics with one entry per schedule part + Google Calendar link for the first part) and an **edit link** (tokenized). Edits are allowed until the deadline.
- **Guest-list mode:** each invitation has one response; re-submitting updates it.
- A short privacy notice under the form explains what's collected and why (mobile numbers are personal data under the Philippine Data Privacy Act) **(proposal)**.

## 6.5 Public website

A marketing landing page at the root of the domain: hero with a sample invitation, how it works (4 steps), features, a **designs gallery** (§6.6), the six packages with a link to the full comparison page, FAQ, and a contact section (Facebook Messenger + email).

**Booking page** (`/book`, owner decision): a public form that replaces typing a Messenger message, but **does not create an event or an account**. Fields: package (pre-selected from the "Book [package]" button via `?package=`), what's being celebrated (Wedding / Birthday / Debut / Baptism / Anniversary / Other), **design** (owner decision: the client picks a template from the library, filtered to templates that support the chosen event type, each with a **Preview design** link that opens the full cover in a modal with **Use this design**; the preview text follows the chosen event type (§9.1); or "Not sure yet, help me choose"; hidden for Personalized, which gets a custom design), celebrant name(s), event date, city (optional), rough guest count (optional), the client's name and PH mobile number, where to send the private link (Messenger + Facebook name / Viber / Text / Email + address), notes (optional), and agreement to terms and privacy. Send stays disabled until required fields are valid, with a "To send, please:" list. On send: a booking request (`KB-####`) is saved and shown in the admin **Bookings** inbox; the client sees a confirmation with the request number and what happens next. The owner reviews it, taps **Create event from this request** (form pre-filled), and sends the private link through the client's chosen channel (manually in v1; email could be automated later with the transactional email service). Requests are rate-limited and protected by Turnstile like other public forms; unconverted requests are deleted after 30 days **(proposal)**. Footer links: privacy policy, terms, admin log-in. Design on the "Landing Page & Admin Log-in" canvas; packages comparison as the "Celebration RSVP Packages" page.

## 6.6 Website design (owner decisions, 2026-11-18)

Applies to the Kumbida site and system screens: landing page, booking page, admin log-in and invite pages, admin dashboard, and the host link. **Invitation templates keep their own colors and fonts** (§9.1); the site palette never recolors a design preview.

**Color palette** (cream is the main color)

| Role | Color | Used for |
|---|---|---|
| Cream (main) | `#F5F2E9` | Page background. Cards are white `#FFFFFF` on top. |
| Teal | `#356B68` | Primary buttons (white text), logo mark, links, small labels ("OUR DESIGNS"), focus and selected borders. |
| Deep Teal | `#294B49` | Headings and body text; dark panels (Premium package card, "Ready to book?" banner, admin sidebar, log-in brand panel, booking summary). |
| Soft Gold | `#C5A66B` | Buttons and badges on Deep Teal panels, logo stroke, highlights. Never used for small text on cream (too low contrast). Text on gold is `#1E3836`. |
| Mist Green | `#D7E0D9` | Icon tiles, tag chips, light text on dark panels, the ring around a selected design or package. |

Supporting shades (derived): secondary text `#5A6B67`; borders `#DCE3DD` (cards), `#BFCBC2` (inputs); light fills `#EDF1EC`; disabled `#E3E7E2` with `#6F7C78` text; darkest teal `#1E3836`. Status colors stay semantic: green for paid/live, amber for warnings, red for errors. All text meets WCAG AA contrast (4.5:1 for normal text).

**Typography:** Fraunces (headings, display) + Nunito (body, UI), from Google Fonts. Invitation templates load their own fonts.

**Layout and components**
- Mobile-first, fluid pages (max content width ~1200 px); menus and toolbars wrap on phones; touch targets ≥ 44 px.
- Rounded cards (18–22 px radius), pill buttons, pill chips; real `<button>`/`<a>`/`<label>` elements throughout; icons are simple stroke SVGs.
- Disabled submit buttons always show a "To send / To submit, please:" list of what's missing.

**Landing page sections:** nav (How it works · Designs · Packages · FAQ · Contact · **Book now**) → hero with a sample invitation → occasions strip → how it works → **Our designs** → what you get → packages (6 cards, 3×2) → FAQ → contact banner → footer (privacy, terms, admin log-in).

**Designs gallery and preview modal**
- The gallery shows every library design as a small cover tile: the design's own background, a small label and the occasion display text in the design's font (no photo circle, no RSVP button), plus its name and occasions. A banner below points to Personalized for a one-of-a-kind design.
- Clicking a tile opens a **preview modal**: the full invitation cover (scaled phone view) on the left; on the right the design name, occasions, a one-line description, what the client can change, and actions. Landing: **Book with this design** / Keep browsing. Booking page: **Use this design** (selects it) / Back to designs. Admin Templates: status badge (Live / Cover only) / Close. Closed with the × button.
- The same tile and modal are used on the landing page, the booking page's design step and the admin Templates section, so all three always show the same set of designs.

**Admin Templates section:** all library designs with filters **All · Live · Cover only · Personalized**; "Live" means the full guest page is built, "Cover only" means only the cover design exists and the design shouldn't be offered to clients yet **(proposal)**.

Design files: "Landing Page & Admin Log-in" canvas (site, booking, admin, host Pay step, simulation) and "Kumbida Template Library" canvas (invitation covers).

## 7. Host link (`/h/<token>`)

A single mobile-friendly page with these sections:
0. **Pay** (the only section available until the owner confirms payment; sections 1–7 appear locked until then): amount, UnionBank QR / account details, InstaPay reference number + receipt upload, status (§5.6).
1. **Preview:** "View your page" (works in draft too).
2. **Details:** names, schedule parts (label, date/time, venue, map link), contact, motif toggle + colors, attire toggle + value. Changes go live immediately on save **(proposal)**. The fixed template plus field length limits protect the design, so owner approval isn't needed.
3. **Photos:** upload straight from the phone (resized in the browser, §11), set hero, reorder, delete; capped by the template's limits.
4. **RSVP settings:** deadline, max party size (open mode), optional question toggles.
5. **Guest list** (guest-list mode only): add/edit/remove invitations (incl. alternate names), spreadsheet upload, copy each invitation's personal link, download all links as a spreadsheet.
6. **Share your invite:** copy/share link, ready-to-send message, QR code, share card download (§10.1).
7. **Responses:** totals at top (*Attending: N people · Declined: N · Pending: N* — pending only in guest-list mode), full list, filter, **Download (XLSX/CSV)**.

Security: the token is a long random value (≥128 bits), stored hashed, and the admin can regenerate it (old link dies). There's an optional 4–6 digit PIN with rate-limited attempts. Pages are `noindex` and send no referrer.

One host link per event; the host can share it with their co-host or coordinator. There's no per-person tracking, so everyone with the link has the same access.

**Change history** **(proposal):** every save from the host link or admin is recorded (what changed, old → new, when, host or which admin). The admin can see it per event and restore a previous value. This is the safety net for live edits, e.g. a host accidentally deleting the reception from the schedule.

## 8. Admin dashboard (`/admin`)

- Login (email + password; a small team can have several admin users). Optional authenticator-app two-factor, since admin accounts can see every guest list **(proposal)**.
- **No public sign-up.** Admin accounts are created only by invite: the owner enters a team member's email, they get an invite link (expires), and set their name and password there, then are offered 2-step log-in setup (skippable). Forgot-password sends a reset link (expires in 1 hour). Neither the invite nor the reset page reveals whether an email belongs to the team. *(Owner decision: admin-only accounts; design on the "Landing Page & Admin Log-in" canvas.)*
- These are the system's only emails (invites, password resets), so the build needs a transactional email service with a free tier (builder's choice).
- **Bookings inbox:** booking requests from the website (and a place to log Messenger bookings), each with **Create event from this request** (pre-filled) and **Mark as spam / not going ahead**.
- **Events list:** search, filter by status/type/date, see response counts at a glance.
- **Create/edit event:** all fields in §5.1, plus copy-host-link button and regenerate link.
- **Responses:** same view as the host's, for any event.
- **Payments to verify:** confirm or reject submitted payments in one tap; filter for unpaid orders (§5.6).
- **Setup queue:** paid Lite-and-up events waiting for the owner to set up.
- **Settings:** UnionBank QR image, account name and number shown on the Pay step; package prices.
- **Templates:** every library design as a cover tile with a Live / Cover only badge, filters (All · Live · Cover only · Personalized) and the shared preview modal (§6.6); live templates can also be rendered with sample data for each event type they support, so designs can be checked before use (also useful to show clients).
- Publish / unpublish / close RSVP / archive / delete.

## 9. Templates

- Each template lives in the codebase (e.g. `templates/garden-romance/`) and exports:
  - **metadata:** name, thumbnail, supported event types, visibility (`library` or `private` to one event, for Personalized), capabilities (hero photo required?, max gallery photos, shows motif/attire section?, etc.)
  - **a page component** that receives a typed, read-only `EventView` (all event content + photo URLs + RSVP config) and renders the page.
  - **a share card renderer** that draws the 1200×630 preview image from the same `EventView` (§10.1). Optional; the fallback card is used if missing.
- The **RSVP form logic is shared**: one form component handles validation, modes and submission. Templates only theme it (fonts, colors, spacing via CSS variables/props), so RSVP behavior never differs between designs.
- Templates must look right with optional data missing (no motif, no gallery, long names up to the limit). The admin template gallery's sample data includes these edge cases.
- The host editor only shows fields/photo slots the event's template supports.

### 9.1 Template library v1 (owner decisions, 2026-11-18)

**Content rules for every template**
- **No real names, dates, times or places** in a template. Covers use occasion display text and placeholders until the host fills in their details.
- **Occasion display text** stands in for the celebrant's name, chosen by event type:

| Event type | Display text |
|---|---|
| Birthday | Birthday Star |
| Wedding | The Happy Couple |
| Baptism | Our Little Blessing |
| Debut | The Celebrant |
| Anniversary | The Happy Couple |
| Reunion | Together Again (small label: "The [Family name] Family" or "Class of [Year]") **(proposal)** |
| Other | Our Guest of Honor **(proposal)** |

  On the booking page, previews switch to the display text of the event type the client picked (e.g. Little Star reads "Our Little Blessing" for a baptism). Elsewhere a design shows its main occasion's text.
- **Placeholders:** dates `[Day], [Month Day, Year]` (or `[DAY] · [MONTH DAY, YEAR]` in all-caps designs), times `[Time]`, places `[Venue name], [City]` (`[Church name]` for ceremonies), deadlines `RSVP by [Date]`, photos "Celebrant's photo" / "Couple's photo".
- **Original art only.** No trademarked characters, brands or logos (no Disney, Barbie, Boss Baby, existing anime or cartoon characters). Themes that clients ask for by brand get an original alternative: Disney Princess → **Royal Princess**, Barbie → **Pink Glam**, Boss Baby → **Little Boss**. Outside templates may be used as style references, but art and layout are drawn new.
- Each cover has one color tweak (three presets) so a host can match their motif without changing the layout **(proposal)**.

**The 31 library designs, by category** (owner decision, 2026-11-18; invitation covers designed, only Little Star has its full guest page built so far). Birthday categories split by age group and girl/boy so clients find a fit fast; ages on the covers are sample text the host changes.

| Category | Designs |
|---|---|
| Baby Girl Birthday | Royal Princess · Bunny Garden · Little Star |
| Baby Boy Birthday | Little Sailor · Race Day · Dino Roar |
| Kid Girl Birthday | Unicorn Dreams · Mermaid Lagoon · Pink Glam |
| Kid Boy Birthday | Space Explorer · Construction Zone · Little Boss |
| Teen Girl Birthday | Disco Glow · Pastel Polaroid · Anime Adventure (Pink) |
| Teen Boy Birthday | Game On · Street Court · Anime Adventure (Sky Blue) |
| Debut Girl (18) | Enchanted Rose · Starlit Gala |
| Debut Boy (21) | Black Tie · City Lights |
| Weddings | Sampaguita · Garden Vows · Elegant & Minimalist · Bloom · Golden Hour (navy and gold sunset) |
| Anniversary | Golden Years · Love Letters |
| Reunion | Family Tree · Class Reunion |

Removed from the library: Fairy Garden, Cartoon Party, Sketchbook, Simply Yours, Cloud Nine, Safari Pals, Terracotta Sunset. **Reunion** is a new event type (add it to the event types in §5.1 and the booking page's occasion list) **(proposal)**. The website's designs gallery, booking design picker and admin Templates list should use these categories as filters.

Each cover is a 390×844 phone view: label, display text, photo frame, date/time/venue placeholders and an RSVP button. Building a design's full guest page (schedule, RSVP form, gallery, share card) moves it from "Cover only" to "Live".

## 10. Guest page

- Server-rendered, then **cached**: a guest page is regenerated only when its event changes (host/admin edit, status change), so normal visits cost almost no server CPU. Time-based changes (RSVP deadline passing, event becoming past) must also trigger regeneration, via the scheduled job that flips the status. Mobile-first; images served as resized WebP variants.
- **Works inside in-app browsers.** Most guests open links inside Messenger's or Facebook's built-in browser, not Chrome/Safari. The page, RSVP form and photo display must be tested there. Where a feature is unreliable in those browsers (.ics downloads), the fallback (Google Calendar link) is shown. The host link's share kit gets the same treatment (native share sheet → Copy link).
- After the event (*past*), the RSVP section is replaced by a short thank-you line; the rest of the page stays as a keepsake until archiving.
- Link previews and share tools: see §10.1.
- Sections (order and style decided by each template): hero (photo, names, headline date) → schedule (each part with time, venue + Open in Maps) → motif/attire (if enabled) → gallery → RSVP form → contact.
- `noindex` so event pages don't appear in search results **(proposal)**.

### 10.1 Sharing on social media and chat apps

Most invites spread through Messenger, Facebook, Viber, WhatsApp and group chats, so a shared link should look like an invitation, not a bare URL. **(proposal; whole section)**

**Designed preview card ("share card")**
- Every template ships a matching **share card** design: a 1200×630 image with the hero photo, names, headline date and a short line like "You're invited", in the template's fonts and colors.
- To stay inside the free hosting tier, the card is **drawn in the browser** (canvas) whenever the host or admin saves a change that affects it (names, date, hero photo, template). It's uploaded to R2 as a JPEG (most widely supported by social platforms) at `events/<eventId>/share/<version>.jpg`. No server-side image generation.
- A fallback card (hero photo + names in a neutral style) is used if a template has no share card yet.

**Complete link-preview tags on every event page**
- `og:title` phrased by event type: "Ana & Marco are getting married!", "You're invited to Lia's 7th Birthday!", "Join us for Baby Lia's Christening".
- `og:description`: headline date · first venue · "RSVP by <deadline>".
- `og:image` (share card, with width/height), `og:url` (clean canonical link), `og:type`, `twitter:card = summary_large_image`, and `theme-color` from the template.
- The share card URL contains a **version**, so when the host changes the photo or date, platforms fetch the new card instead of showing a stale cached one. The admin event page has a "Check link preview" shortcut to Facebook's Sharing Debugger for forcing a refresh.
- `noindex` stays: it hides pages from search engines but doesn't stop social platforms from reading previews.
- Personal guest links (§5.3) get the same preview tags.

**No share buttons on the guest page.** Guests don't get a "Know someone who's invited?" / share section; sharing is the host's job, through the share kit below. (Owner decision.)

**Share kit on the host link** (new section "Share your invite")
- Big **Copy link** and **Share** buttons.
- **Ready-to-send invite message**: pre-written text per event type, editable by the host, copied with the link, e.g. "You're invited to Ana & Marco's wedding on Feb 14, 2027! Please RSVP by Jan 31: <link>".
- **QR code** download (PNG, print-ready) for printed invitations, save-the-date cards, and signage at the venue. Generated in the browser.
- **Share card download**: the preview image itself, for posting as a Facebook/Instagram story or post with the link.
- Guest-list mode: the same kit for the shared link, plus copy/share per invitation's personal link, and a bulk download of all personal links with ready-to-send messages (spreadsheet).

**Clean, short links**
- Event: `<domain>/<slug>` (e.g. `/ana-and-marco`), chosen by the admin. Brand and domain are still to be decided.
- Personal guest links stay short: `<domain>/<slug>/i/<short-token>`.

## 11. Photos

- **Stored in Cloudflare R2**, served from a custom subdomain (e.g. `photos.<domain>`) through Cloudflare's CDN. The database stores only object keys and order, never full URLs, so storage can move later without touching data.
- **Resized in the host's browser, not on the server.** When a host picks photos, the browser decodes each one, fixes orientation, and re-encodes it as WebP variants (e.g. 480 / 960 / 1600 px). Re-encoding drops all EXIF, including GPS location. The variants upload **directly to R2** via short-lived signed upload URLs from the app, and the app then records them. Original files are never uploaded or kept.
  - Server-side checks: content type, max size per variant, and per-template photo count.
  - Accepted inputs: JPEG, PNG, HEIC (iPhone). HEIC is decoded client-side with a library where the browser can't decode it natively.
- Key layout: `events/<eventId>/<photoId>/<width>.webp`. Deleting/archiving an event deletes its folder.
- Expected footprint: ~3–5 MB per 10-photo event, so the R2 free tier (10 GB) holds ~2,000+ events.

## 12. Tech stack

**Goal: ₱0/month until there are paying clients, on services that allow commercial use and upgrade by billing change only (no migration).**

| Piece | Choice | Free-tier notes |
|---|---|---|
| App | **Next.js (App Router) + TypeScript**, one app for admin, host link, guest pages and API | |
| Hosting | **Cloudflare Workers** (Next.js via the OpenNext Cloudflare adapter) | 100k requests/day, 10 ms CPU per request. Upgrade path: Workers Paid ($5/mo) if SSR pages exceed the CPU limit. |
| Database | **Neon Postgres** (serverless driver) | 1 GB storage, 100 CU-hours/month; scales to zero and wakes automatically. |
| Photos | **Cloudflare R2** | 10 GB free, zero egress fees. |
| Admin auth | Library running inside the app (e.g. Auth.js / Better Auth) | No third-party auth service. |
| Bot protection | Cloudflare Turnstile | Free. |
| Backups | Scheduled job (e.g. a GitHub Actions cron) runs a nightly `pg_dump` of Neon to a private R2 bucket, keeping ~30 days | Free. Neon's free plan has only a short restore window, and losing a client's guest list days before their event would be serious. **(proposal)** |
| Domain | Owner buys one | Only fixed cost. Check the renewal price, not just year one. |

**Rejected for the free start:** Vercel Hobby (non-commercial use only), Supabase Free (projects pause after a week of inactivity and must be resumed manually), Firebase Storage (needs a billing plan anyway, and guest photo downloads aren't free).

**Constraints this places on the build:**
- Everything server-side must run in the Workers runtime: no native Node modules (e.g. no sharp), and keep per-request CPU low.
- Guest pages must be cached and revalidated on change (§10).
- Code that touches storage goes through one small storage module (upload URL, delete, public URL) so the vendor can be swapped.

**Left to the builder:** ORM (Drizzle recommended for Workers + Neon, but builder's call), auth library, UI kit, rate-limiting mechanism (e.g. Cloudflare's built-in rate limiting or a DB counter), spreadsheet library, scheduled jobs (Cloudflare Cron Triggers for auto-closing RSVPs and the retention purge).

## 13. Before taking real clients (non-code)

- **Privacy policy and terms of service** pages on the site. The business collects guests' names and mobile numbers, so under the Philippine Data Privacy Act the owner is responsible for that data. The policy should say what's collected, why, who sees it (host + owner), and when it's deleted (§5.5). The RSVP form's privacy notice links to it. *Not legal advice; worth a quick check with someone who knows the DPA.*
- A simple **client agreement** covering what the host is responsible for (photos they have rights to, accurate guest data).
- Error monitoring (free tier of a service like Sentry) so the owner hears about broken pages before clients do. Builder's choice of tool.

## 14. Build order (proposal)

1. **Core:** data model (incl. package gating and orders/payments), admin login + event CRUD, one template (with share card), open-mode RSVP with spam protection, host link (details, photos, share kit, responses + download), change history, guest page with full link-preview tags (no guest share buttons, §10.1), scheduled status job, nightly backups.
2. **Guest-list mode:** invitations, spreadsheet import, personal links, pending counts; then shared-link name search with last-4-digit verification.
3. **Polish & growth:** turn the remaining 14 library covers into full templates (§9.1), admin template gallery + public demo pages, data retention job, PIN, admin two-factor.

## 15. Open questions

- Domain name (doesn't block building; `<domain>` is a placeholder throughout). **Brand decided: Kumbida.**

**Decided:** events have a schedule of one or more parts (§5.2); guest-list mode offers both shared-link name search and personal links (§5.3); free-start stack on Cloudflare Workers + Neon + R2 (§12).

**Settled during review (proposals):**
- Hosts choose a template on the booking page (§6.5). Each template also has a public demo page per event type (`/demo/<template>/<type>`, sample data, RSVP disabled) that the owner can send to prospective clients. No separate marketing site in v1.
- UI and template text are in English for v1. Templates may hard-code other languages if a design calls for it.

## 16. Left to the builder

Database schema details, URL structure beyond what's stated, component library, exact validation limits (within the spirit above), testing approach, deployment pipeline.
