import type { Metadata } from "next";
import { Suspense } from "react";
import { SiteHeader } from "@/components/SiteChrome";
import { BookingForm } from "./BookingForm";

export const metadata: Metadata = { title: "Book your invitation" };

// Shown in the prerendered HTML until the form hydrates (it reads ?package= / ?design=).
function FormSkeleton() {
  const pulse = "motion-safe:animate-pulse";
  const box = `rounded-[22px] border-[1.5px] border-line bg-white p-6 flex flex-col gap-3.5`;
  return (
    <div aria-busy="true" aria-label="Loading booking form" className="flex flex-col gap-7">
      <div className="flex max-w-[700px] flex-col gap-3">
        <div className={`h-4 w-48 rounded-full bg-off ${pulse}`} />
        <div className={`h-12 w-full max-w-[560px] rounded-2xl bg-off ${pulse}`} />
        <div className={`h-5 w-full max-w-[620px] rounded-full bg-off ${pulse}`} />
      </div>
      <div className="flex flex-wrap items-start gap-7">
        <div className="flex min-w-0 flex-[999_1_560px] flex-col gap-[22px]">
          <div className={box}>
            <div className={`h-7 w-56 rounded-full bg-off ${pulse}`} />
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(220px,100%),1fr))] gap-2.5">
              {Array.from({ length: 6 }, (_, i) => <div key={i} className={`h-[92px] rounded-2xl bg-fill ${pulse}`} />)}
            </div>
          </div>
          <div className={box}>
            <div className={`h-7 w-40 rounded-full bg-off ${pulse}`} />
            <div className="flex flex-wrap gap-2">
              {[96, 92, 76, 88, 120, 70].map((w) => <div key={w} className={`h-11 rounded-full bg-fill ${pulse}`} style={{ width: w }} />)}
            </div>
            <div className={`h-[50px] rounded-xl bg-fill ${pulse}`} />
          </div>
        </div>
        <div className="flex min-w-0 flex-[1_1_320px] flex-col gap-3.5">
          <div className="flex flex-col gap-3 rounded-[22px] bg-deep p-[22px]">
            {[40, 80, 100, 70].map((w) => <div key={w} className={`h-4 rounded-full bg-darkest ${pulse}`} style={{ width: `${w}%` }} />)}
          </div>
          <div className={`h-14 rounded-full bg-off ${pulse}`} />
        </div>
      </div>
    </div>
  );
}

export default function BookPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader back />
      <main className="mx-auto flex max-w-[1200px] flex-col gap-7 px-6 pt-11 pb-[72px]">
        <Suspense fallback={<FormSkeleton />}>
          <BookingForm />
        </Suspense>
      </main>
    </div>
  );
}
