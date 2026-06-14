"use client";

import React, { memo } from "react";
import { motion } from "framer-motion";
import { ease } from "./motion";

export const ChatMockup = memo(function ChatMockup() {
  const msgs = [
    { role: "user" as const, text: "Message my best customers who spent over ₹5000 in the last month." },
    { role: "ai" as const, text: "Found 1,845 customers who match! Drafting personalized WhatsApp messages for them..." },
    { role: "ai" as const, text: "Done! 3 custom message drafts are ready. Would you like to review and send them?" },
  ];

  return (
    <div className="flex flex-col bg-canvas border border-hairline rounded-sm overflow-hidden w-full" style={{ boxShadow: "0 20px 40px rgba(0,0,0,0.04)" }}>
      {/* Chrome header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-hairline bg-canvas-deep">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
          <span className="font-mono text-[10px] uppercase tracking-wider text-ink font-bold">CONSOLE_ROOT</span>
        </div>
        <div className="flex items-center gap-4 text-ink-muted">
          <span className="font-mono text-[10px] uppercase tracking-wider">[ PORT:3000 ]</span>
          <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-success font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
            </span>
            [ DB_ONLINE ]
          </div>
        </div>
      </div>

      {/* Workspace Dual Pane */}
      <div className="flex divide-x divide-hairline h-[360px] bg-canvas">
        {/* Left pane: Conversation Stream */}
        <div className="flex-[3] flex flex-col p-5 overflow-hidden justify-between">
          <div className="space-y-4 overflow-y-auto pr-1">
            {msgs.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.4, duration: 0.5, ease }}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[90%] text-[13px] leading-relaxed border p-3 rounded-sm ${
                    m.role === "user"
                      ? "bg-primary text-white border-primary rounded-tr-none"
                      : "bg-canvas-deep text-ink border-hairline rounded-tl-none"
                  }`}
                >
                  {m.text}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Interactive button element */}
          <div className="pt-4 border-t border-hairline flex items-center justify-between gap-4">
            <div className="flex-1 h-9 bg-canvas-deep border border-hairline rounded-xs flex items-center px-3 text-[12px] text-ink-muted">
              Awaiting draft confirmation...
            </div>
            <button
              className="px-5 h-9 text-[12px] font-sans font-medium text-white bg-accent hover:bg-accent-hover rounded-full transition-all shrink-0 shadow-md shadow-accent/25 hover:-translate-y-0.5 active:translate-y-0 duration-300"
            >
              Dispatch
            </button>
          </div>
        </div>

        {/* Right pane: Technical Telemetry Monitor (hidden on small screen) */}
        <div className="hidden sm:flex flex-[2] bg-canvas-deep p-5 flex flex-col justify-between font-mono text-[10px] overflow-hidden">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <span className="text-ink-muted uppercase tracking-wider font-bold block">Prisma Query Compiler</span>
              <div className="p-2.5 bg-canvas border border-hairline rounded-xs">
                <span className="text-success font-semibold block mb-1">COMPILE_SUCCESS</span>
                <pre className="text-ink-body font-mono text-[9px] leading-tight overflow-x-auto whitespace-pre-wrap">
{`prisma.customer.findMany({
  where: {
    totalSpent: { gt: 5000 },
    lastOrderAt: { gte: 30d }
  }
})`}
                </pre>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-ink-muted uppercase tracking-wider font-bold block">Execution Log</span>
              <div className="space-y-1.5 text-ink-body">
                <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-link" /> [11:42] user_query_received</div>
                <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" /> [11:42] call: segment_customers</div>
                <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-success" /> [11:43] resolved: 1,845 cohorts</div>
                <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-accent" /> [11:43] call: draft_message</div>
              </div>
            </div>
          </div>

          <div className="border-t border-hairline pt-3 flex justify-between text-[9px] text-ink-muted">
            <span>MEM: 14.2MB</span>
            <span>CPU: 0.4%</span>
          </div>
        </div>
      </div>
    </div>
  );
});
