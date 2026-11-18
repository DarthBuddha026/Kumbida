import type { Metadata } from "next";
import { notFound } from "next/navigation";
import covers from "@/lib/covers.generated.json";
import { designById, DESIGNS } from "@/lib/designs";
import { DemoView } from "./DemoView";

// Sample guest page per design (§10, §15 "/demo/<template>"), opened from the preview modal's
// "View live preview". A sidebar switches packages to show what guests get with each (§5.4).
// ponytail: one shared layout for all 15 designs; the design handoff has no guest-page screens yet.

const COVERS = covers as Record<string, { fonts: string[]; html: string }>;

// Every design is prerendered and the page opens in a new tab, not via client navigation,
// so it doesn't need an instant-navigation shell.
export const instant = false;

export function generateStaticParams() {
  return DESIGNS.map((d) => ({ design: d.id }));
}

export async function generateMetadata({ params }: PageProps<"/demo/[design]">): Promise<Metadata> {
  const d = designById((await params).design);
  return { title: d ? `${d.name} · sample invitation` : "Sample invitation", robots: { index: false } };
}

export default async function DemoPage({ params }: PageProps<"/demo/[design]">) {
  const { design: id } = await params;
  const d = designById(id);
  const cover = COVERS[id];
  if (!d || !cover) notFound();

  return (
    <div className="min-h-screen bg-[#E9E5DA] font-sans">
      {cover.fonts.map((href) => <link key={href} rel="stylesheet" href={href} precedence="default" />)}

      <DemoView design={d} coverHtml={cover.html} />
    </div>
  );
}
