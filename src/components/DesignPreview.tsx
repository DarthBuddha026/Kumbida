"use client";

import { useEffect, useRef, type ReactNode } from "react";
import type { Design } from "@/lib/designs";

/**
 * Design preview modal (§6.6), shared by the landing page, the booking page and (later) admin Templates.
 * The full cover is the generated public/covers/<id>.html, shown at 390×844 and scaled down.
 */
export function DesignPreview({ design, onClose, children }: { design: Design | null; onClose: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (design && !d?.open) d?.showModal();
    if (!design && d?.open) d.close();
  }, [design]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      aria-labelledby="pv-title"
      className="modal m-0 h-full max-h-none w-full max-w-none overflow-y-auto bg-transparent px-4 py-8 backdrop:bg-[rgba(20,38,37,0.6)]"
    >
      {design && (
        <div className="modal-panel relative mx-auto box-border flex w-full max-w-[780px] flex-wrap gap-7 rounded-[26px] bg-white p-6 text-deep">
          <button
            type="button"
            aria-label="Close preview"
            onClick={onClose}
            className="absolute top-3.5 right-3.5 z-10 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border-0 bg-fill text-deep"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
          <div className="mx-auto h-[591px] w-[273px] flex-none overflow-hidden rounded-[22px] bg-fill shadow-[0_0_0_1px_#DCE3DD,0_18px_40px_rgba(41,75,73,0.18)] min-[420px]:h-[718px] min-[420px]:w-[332px]">
            <iframe
              key={design.id}
              src={`/covers/${design.id}.html`}
              title={`${design.name} invitation cover`}
              width={390}
              height={844}
              tabIndex={-1}
              className="block h-[844px] w-[390px] origin-top-left scale-[0.7] border-0 min-[420px]:scale-[0.8513]"
            />
          </div>
          <div className="flex min-w-0 flex-[1_1_280px] flex-col gap-3 pt-2">
            <p className="m-0 text-xs font-extrabold tracking-[0.16em] text-teal">DESIGN PREVIEW</p>
            <h2 id="pv-title" className="m-0 font-display text-[34px] leading-[1.1] font-medium">{design.name}</h2>
            <span className="text-sm font-bold text-muted">{design.tags}</span>
            <p className="m-0 text-base text-body2">{design.blurb}</p>
            <ul className="mt-1 mb-0 flex list-disc flex-col gap-1.5 pl-5 text-[15px] text-body2">
              <li>Your names, date, venue and photos go in on your private link.</li>
              <li>The display text changes with your occasion, like &quot;The Happy Couple&quot; or &quot;Our Little Blessing&quot;.</li>
              <li>Same RSVP form and guest page features on every design.</li>
            </ul>
            <div className="mt-2 flex flex-wrap gap-2.5">
              {children}
              <a href={`/demo/${design.id}`} target="_blank" rel="noopener" className={`${pvSecondary} gap-2`}>
                View live preview
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
                </svg>
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
}

export const pvPrimary =
  "inline-flex min-h-12 cursor-pointer items-center justify-center rounded-full border-0 bg-teal px-6 font-sans text-base font-extrabold text-white no-underline hover:bg-deep hover:text-white";
export const pvSecondary =
  "inline-flex min-h-12 cursor-pointer items-center justify-center rounded-full border-2 border-outline bg-white px-6 font-sans text-base font-extrabold text-deep no-underline";
