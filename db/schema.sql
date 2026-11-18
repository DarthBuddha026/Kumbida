-- Run once against the Neon database (psql "$DATABASE_URL" -f db/schema.sql).
create table if not exists booking_requests (
  id            serial primary key,          -- shown to clients as KB-####
  created_at    timestamptz not null default now(),
  status        text not null default 'new', -- new | converted | spam | not_going_ahead
  package       text not null,
  event_type    text not null,
  design        text,                        -- design id, 'unsure', or null (Personalized)
  celebrant     text not null,
  event_date    date not null,
  city          text,
  guests        text,                        -- rough range, e.g. '50–100'
  client_name   text not null,
  mobile        text not null,
  channel       text not null,               -- messenger | viber | sms | email
  contact       text not null,               -- Facebook name, email, or the mobile number
  notes         text
);
-- ponytail: unconverted requests should be purged after 30 days (§6.5); add with the scheduled jobs.
