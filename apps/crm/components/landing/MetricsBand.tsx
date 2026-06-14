import React from "react";
import { StaggerGrid, StaggerItem } from "./motion";

export function MetricsBand() {
  const items = [
    { val: "84,920", label: "Customer Groups Created", sub: "Grouped by behavior in real-time" },
    { val: "99.87%", label: "Successful Deliveries", sub: "Messages reaching inbox instantly" },
    { val: "450ms", label: "Average Campaign Setup", sub: "AI drafts campaigns in milliseconds" },
    { val: "12M+", label: "Personalized Messages", sub: "Tailored to customer order history" },
  ];

  return (
    <section className="py-24 px-6 border-b border-hairline bg-canvas">
      <div className="mx-auto max-w-[1280px]">
        <StaggerGrid className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-hairline border border-hairline rounded-sm overflow-hidden" stagger={0.09}>
          {items.map((m, i) => (
            <StaggerItem key={i} className="flex-1 p-8 flex flex-col justify-between gap-4">
              <span className="font-mono text-[10px] text-ink-muted uppercase tracking-widest">[ METRIC 0{i+1} ]</span>
              <div>
                <div className="font-mono text-[40px] lg:text-[48px] font-semibold text-ink leading-none tracking-tight mb-3">
                  {m.val}
                </div>
                <div className="text-[14px] font-sans font-medium text-ink mb-1">{m.label}</div>
                <div className="font-mono text-[11px] text-ink-body leading-relaxed">{m.sub}</div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </div>
    </section>
  );
}
