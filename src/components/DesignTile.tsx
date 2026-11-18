import type { Design } from "@/lib/designs";

/** Small cover tile (§6.6): the design's background, its small label and its title in the cover's font. */
export function DesignTile({ design, height, size }: { design: Design; height: number; size: number }) {
  const t = design.tile;
  return (
    <span
      aria-hidden="true"
      className="box-border flex flex-col items-center justify-center overflow-hidden rounded-xl border border-line px-2.5 py-3.5 text-center"
      style={{ height, background: t.bg, gap: Math.round(height / 22) }}
    >
      <span className="font-sans text-[9px] font-extrabold tracking-[0.18em]" style={{ color: t.sub }}>{t.small}</span>
      <span
        style={{
          fontFamily: t.font,
          fontSize: size * (t.scale ?? 1),
          lineHeight: 1,
          color: t.ink,
          fontStyle: t.italic ? "italic" : "normal",
          fontWeight: t.weight,
        }}
      >
        {t.sample}
      </span>
    </span>
  );
}
