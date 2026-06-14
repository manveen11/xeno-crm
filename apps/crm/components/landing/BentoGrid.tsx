import React from "react";
import { Reveal, StaggerGrid, StaggerItem } from "./motion";

export function BentoGrid() {
    return (
        <section id="capabilities" className="py-24 px-6 bg-canvas border-b border-hairline">
            <div className="mx-auto max-w-[1280px]">
                <Reveal className="mb-14">
                    <span className="font-mono text-[11px] text-ink-muted tracking-widest uppercase block mb-4">[ CAPABILITIES ]</span>
                    <h2
                        className="text-ink font-display"
                        style={{ fontSize: "clamp(36px, 4vw, 52px)", lineHeight: 1.05, letterSpacing: "-1px" }}
                    >
                        Built for the speed of D2C.
                    </h2>
                </Reveal>

                <StaggerGrid className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" stagger={0.08}>
                    
                    {/* Card 1: Chat-first (spans 2 cols on lg, horizontal split on md+) */}
                    <StaggerItem className="lg:col-span-2">
                        <div className="h-full flex flex-col md:flex-row gap-8 p-8 bg-canvas-deep rounded-lg border border-hairline justify-between items-stretch">
                            <div className="flex-1 flex flex-col justify-between">
                                <div>
                                    <span className="font-mono text-[11px] text-ink-muted uppercase tracking-widest block mb-4">01 / Chat-first</span>
                                    <h3 className="text-[26px] font-sans font-medium text-ink leading-tight tracking-normal mb-3">
                                        Your CRM is a conversation.
                                    </h3>
                                    <p className="text-[15px] text-ink-body leading-relaxed">
                                        No complex rule builders or deep menus. Just type who you want to target in natural language, and let the system execute the segment search, campaign drafting, and messaging.
                                    </p>
                                </div>
                                <div className="mt-8 md:mt-0 font-mono text-[10px] text-ink-muted tracking-wider">
                                    [ ENGINE: NEXT.JS &bull; PRISMA &bull; GEMINI ]
                                </div>
                            </div>
                            
                            {/* Mock Message Box */}
                            <div className="flex-1 flex flex-col justify-between p-5 bg-canvas rounded-md border border-hairline shadow-sm min-h-[200px]">
                                <div className="space-y-3">
                                    <div className="flex justify-end">
                                        <div className="bg-primary text-white text-[12px] p-2.5 rounded-sm rounded-tr-none max-w-[85%] border border-primary font-medium">
                                            "Email a 10% discount code to everyone who hasn't bought anything in the last month."
                                        </div>
                                    </div>
                                    <div className="flex justify-start">
                                        <div className="bg-canvas-deep text-ink text-[12px] p-2.5 border border-hairline rounded-sm rounded-tl-none max-w-[85%]">
                                            Found <strong className="text-accent">1,845</strong> customers. Average order value: <strong className="text-ink">₹14,290</strong>. Message drafts ready.
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-3 border-t border-hairline text-[9px] font-mono text-ink-muted flex justify-between">
                                    <span>EXECUTION SPEED: 112ms</span>
                                    <span className="text-success font-semibold">● READY</span>
                                </div>
                            </div>
                        </div>
                    </StaggerItem>

                    {/* Card 2: Safe Dispatch (Color blocked green background card, spans 1 col) */}
                    <StaggerItem>
                        <div className="h-full flex flex-col gap-6 p-8 bg-success rounded-lg border border-white/10 text-white justify-between">
                            <div>
                                <span className="font-mono text-[11px] text-white/50 uppercase tracking-widest block mb-4">02 / Safe Dispatch</span>
                                <h3 className="text-[24px] font-sans font-medium text-white leading-tight tracking-normal mb-3">
                                    Confirm before launching.
                                </h3>
                                <p className="text-[14px] text-white/80 leading-relaxed">
                                    We keep a clean, transparent workspace where the interactive dispatch button represents the final confirmation. You review the variables, click, and it fires.
                                </p>
                            </div>
                            <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-4 mt-auto">
                                <span className="font-mono text-[10px] text-white/60">Awaiting confirmation...</span>
                                <button
                                    className="px-5 h-9 rounded-full text-[12px] font-medium text-success bg-white hover:bg-white/95 transition-all active:scale-[0.97]"
                                >
                                    Send Campaign &rarr;
                                </button>
                            </div>
                        </div>
                    </StaggerItem>

                    {/* Card 3: Secured Engine (Terminal interface card) */}
                    <StaggerItem>
                        <div className="h-full flex flex-col gap-5 p-8 bg-canvas rounded-lg border border-hairline justify-between">
                            <div>
                                <span className="font-mono text-[11px] text-ink-muted uppercase tracking-widest block mb-4">03 / Secured Engine</span>
                                <h3 className="text-[24px] font-sans font-medium text-ink leading-tight tracking-normal mb-3">
                                    Local query compilation.
                                </h3>
                                <p className="text-[14px] text-ink-body leading-relaxed">
                                    The agent compiles strict prisma query statements locally against your database, fetching segment counts without exposing PII to external models.
                                </p>
                            </div>
                            <div className="p-4 bg-canvas-deep border border-hairline rounded-sm font-mono text-[10px] space-y-2 mt-auto">
                                <div className="flex items-center justify-between border-b border-hairline pb-2 mb-2 text-ink-muted">
                                    <span>DATABASE CLIENT</span>
                                    <span className="text-success font-bold">● CONNECTED</span>
                                </div>
                                <div className="space-y-1.5 text-ink-body">
                                    <div className="flex items-center gap-2"><span className="text-accent">ƒ</span> segment_customers() <span className="text-ink-muted ml-auto">1,845 records</span></div>
                                    <div className="flex items-center gap-2"><span className="text-accent">ƒ</span> draft_message() <span className="text-ink-muted ml-auto">3 variants</span></div>
                                    <div className="flex items-center gap-2"><span className="text-accent">ƒ</span> create_campaign() <span className="text-ink-muted ml-auto">queued</span></div>
                                </div>
                            </div>
                        </div>
                    </StaggerItem>

                    {/* Card 4: Unified routing (Visual schematic node graphic card) */}
                    <StaggerItem>
                        <div className="h-full flex flex-col gap-5 p-8 bg-canvas-deep rounded-lg border border-hairline justify-between">
                            <div>
                                <span className="font-mono text-[11px] text-ink-muted uppercase tracking-widest block mb-4">04 / Unified routing</span>
                                <h3 className="text-[24px] font-sans font-medium text-ink leading-tight tracking-normal mb-3">
                                    Multi-channel routing.
                                </h3>
                                <p className="text-[14px] text-ink-body leading-relaxed">
                                    One request handles delivery. The system drafts custom messages for WhatsApp, SMS, RCS, or Email, injecting customer names and order history variables.
                                </p>
                            </div>
                            
                            {/* Graphic Schematic */}
                            <div className="py-4 flex flex-col items-center justify-center relative bg-canvas rounded-sm border border-hairline p-4 mt-auto">
                                <div className="flex items-center justify-between w-full z-10">
                                    <div className="flex flex-col gap-2.5">
                                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-hairline bg-canvas shadow-xs">
                                            <svg className="w-3.5 h-3.5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                                            </svg>
                                            <span className="text-[10px] font-mono tracking-wider uppercase text-ink-body">WhatsApp</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-hairline bg-canvas shadow-xs">
                                            <svg className="w-3.5 h-3.5 text-[#1863dc]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                            </svg>
                                            <span className="text-[10px] font-mono tracking-wider uppercase text-ink-body">SMS</span>
                                        </div>
                                    </div>

                                    {/* Center Hub */}
                                    <div className="w-9 h-9 rounded-sm bg-primary border border-white/10 flex items-center justify-center text-white text-[11px] font-mono font-bold shadow-md z-20">
                                        X
                                    </div>

                                    <div className="flex flex-col gap-2.5 items-end">
                                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-hairline bg-canvas shadow-xs">
                                            <span className="text-[10px] font-mono tracking-wider uppercase text-ink-body">Email</span>
                                            <svg className="w-3.5 h-3.5 text-[#5956E9]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                                <polyline points="22,6 12,13 2,6" />
                                            </svg>
                                        </div>
                                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-hairline bg-canvas shadow-xs">
                                            <span className="text-[10px] font-mono tracking-wider uppercase text-ink-body">RCS</span>
                                            <svg className="w-3.5 h-3.5 text-[#9b60aa]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Connection line decorations behind */}
                                <div className="absolute inset-x-8 top-1/2 h-[1px] bg-hairline z-0" />
                            </div>
                        </div>
                    </StaggerItem>

                    {/* Card 5: Live telemetry (Visual progress charts card) */}
                    <StaggerItem>
                        <div className="h-full flex flex-col gap-5 p-8 bg-canvas rounded-lg border border-hairline justify-between">
                            <div>
                                <span className="font-mono text-[11px] text-ink-muted uppercase tracking-widest block mb-4">05 / Live telemetry</span>
                                <h3 className="text-[24px] font-sans font-medium text-ink leading-tight tracking-normal mb-3">
                                    Watch stats stream live.
                                </h3>
                                <p className="text-[14px] text-ink-body leading-relaxed">
                                    Watch delivered, opened, and clicked counts update in real time directly inside the chat and database console as users engage.
                                </p>
                            </div>
                            <div className="space-y-3.5 p-5 bg-canvas-deep rounded-sm border border-hairline mt-auto">
                                {[
                                    { label: "DELIVERED", val: "12,984", pct: 99.8, color: "var(--accent)" },
                                    { label: "OPENED", val: "7,842", pct: 60.4, color: "var(--opened-fg)" },
                                    { label: "CLICKED", val: "3,115", pct: 24.0, color: "var(--clicked-fg)" },
                                ].map((s) => (
                                    <div key={s.label} className="space-y-1.5">
                                        <div className="flex justify-between items-center text-[10px] font-mono">
                                            <span className="text-ink-muted uppercase tracking-wider">{s.label}</span>
                                            <span className="text-ink font-semibold">{s.val} <span className="text-ink-muted font-normal">({s.pct}%)</span></span>
                                        </div>
                                        <div className="h-1.5 w-full bg-canvas border border-hairline rounded-full overflow-hidden">
                                            <div className="h-full rounded-full" style={{ width: `${s.pct}%`, backgroundColor: s.color }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </StaggerItem>
                </StaggerGrid>
            </div>
        </section>
    );
}
