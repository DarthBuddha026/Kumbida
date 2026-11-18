"use client";

import Link from "next/link";
import { useState } from "react";
import { DesignPreview, pvPrimary, pvSecondary } from "@/components/DesignPreview";
import { DesignTile } from "@/components/DesignTile";
import { CATEGORIES, DESIGNS, type CategoryId, type Design } from "@/lib/designs";

export const chip = (on: boolean) =>
  `min-h-11 flex-none cursor-pointer rounded-full border-2 px-4 font-sans text-[15px] font-extrabold whitespace-nowrap ${
    on ? "border-teal bg-teal text-white" : "border-outline bg-white text-deep hover:border-teal"
  }`;

/** Category filter chips (design/templates folders). Phones: one swipeable row; wider screens: wraps. */
export function CategoryChips({
  categories,
  value,
  onChange,
}: {
  categories: readonly (typeof CATEGORIES)[number][];
  value: CategoryId | "all";
  onChange: (v: CategoryId | "all") => void;
}) {
  return (
    <div
      role="group"
      aria-label="Filter designs by category"
      className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden"
    >
      <button type="button" aria-pressed={value === "all"} onClick={() => onChange("all")} className={chip(value === "all")}>All</button>
      {categories.map((c) => (
        <button key={c.id} type="button" aria-pressed={value === c.id} onClick={() => onChange(c.id)} className={chip(value === c.id)}>
          {c.label}
        </button>
      ))}
    </div>
  );
}

/** Landing-page designs grid + category filter + preview (design/pages/Main.html "DESIGNS"). */
export function DesignGallery() {
  const [open, setOpen] = useState<Design | null>(null);
  const [cat, setCat] = useState<CategoryId | "all">("all");
  const shown = cat === "all" ? DESIGNS : DESIGNS.filter((d) => d.category === cat);

  return (
    <>
      <CategoryChips categories={CATEGORIES} value={cat} onChange={setCat} />
      <p aria-live="polite" className="sr-only">{shown.length} designs</p>

      <ul className="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-x-5 gap-y-6 p-0">
        {shown.map((d) => (
          <li key={d.id}>
            <button
              type="button"
              onClick={() => setOpen(d)}
              aria-label={`Preview the ${d.name} design`}
              className="flex w-full cursor-pointer flex-col gap-2.5 border-0 bg-transparent p-0 text-left font-sans text-deep"
            >
              <DesignTile design={d} height={260} size={38} />
              <span className="flex flex-col gap-0.5 px-0.5">
                <span className="text-base font-extrabold">{d.name}</span>
                <span className="text-[13px] text-muted">{d.tags}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
      <DesignPreview design={open} onClose={() => setOpen(null)}>
        <Link href={`/book?design=${open?.id ?? ""}`} className={pvPrimary}>Book with this design</Link>
        <button type="button" onClick={() => setOpen(null)} className={pvSecondary}>Keep browsing</button>
      </DesignPreview>
    </>
  );
}
