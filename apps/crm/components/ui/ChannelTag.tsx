import React from "react";
import { cn } from "@/lib/utils";

export interface ChannelTagProps extends React.HTMLAttributes<HTMLSpanElement> {
  channel: "WHATSAPP" | "SMS" | "EMAIL" | "RCS";
}

export function ChannelTag({ channel, className, ...props }: ChannelTagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center font-mono text-[12px] font-medium leading-none text-ink-body",
        "bg-surface-2 border border-hairline rounded-full px-2 py-0.5 uppercase tracking-wider",
        className
      )}
      {...props}
    >
      [ {channel} ]
    </span>
  );
}
