"use client";

import React, { memo } from "react";

export const Tag = memo(({ ch, size = "sm" }: { ch: string; size?: "sm" | "md" }) => (
  <span
    className={
      size === "sm"
        ? "inline-flex items-center font-mono text-[10px] uppercase tracking-[0.5px] text-ink-muted border border-hairline rounded-full bg-surface-3 px-2 py-[3px] leading-none"
        : "inline-flex items-center font-mono text-[11px] uppercase tracking-[0.5px] text-ink-muted border border-hairline rounded-full bg-surface-3 px-3 py-1 leading-none"
    }
  >
    [ {ch} ]
  </span>
));
Tag.displayName = "Tag";
