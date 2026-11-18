"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";

/** Scales fixed-width content (a 390px invitation cover) to fill its parent's width. */
export function FitWidth({ width, children }: { width: number; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    const parent = el?.parentElement;
    if (!el || !parent) return;
    const fit = () => (el.style.zoom = String(parent.clientWidth / width));
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(parent);
    return () => ro.disconnect();
  }, [width]);
  return <div ref={ref} style={{ width }}>{children}</div>;
}
