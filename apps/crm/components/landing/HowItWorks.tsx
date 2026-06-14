import React from "react";
import { motion } from "framer-motion";
import { Reveal, StaggerGrid, StaggerItem, ease } from "./motion";

export function HowItWorks() {
    const steps = [
        {
            n: "01",
            tag: "NATURAL LANGUAGE",
            title: "Describe your goal.",
            desc: "No complex segment builders. Just type who you want to target and what you want to offer in plain text, and let the system translate it.",
            visual: (
                <div className="p-5 bg-canvas rounded-sm border border-hairline shadow-sm w-full max-w-[340px]">
                    <div className="font-mono text-[13px] text-ink-body leading-[1.6]">
                        <span className="text-accent">~</span>{" "}
                        Find customers who haven't bought in 2 months and offer a 20% off WhatsApp discount
                        <span className="inline-block w-[6px] h-[14px] bg-ink ml-1.5 align-middle animate-pulse" />
                    </div>
                </div>
            ),
        },
        {
            n: "02",
            tag: "AI AGENT",
            title: "Let the AI do the work.",
            desc: "The assistant securely queries your database, compiles the exact customer list, and drafts multiple personalized messages for you in under 3 seconds.",
            visual: (
                <div className="space-y-2 w-full max-w-[340px]">
                    {[
                        { tool: "segment_customers()", result: "18,491 matches", done: true },
                        { tool: "draft_message()", result: "Variant ready", done: true },
                        { tool: "create_campaign()", result: "Awaiting confirm…", done: false },
                    ].map((t) => (
                        <div key={t.tool} className="flex items-center gap-3 px-4 py-2 bg-canvas border border-hairline rounded-sm shadow-sm">
                            <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 ${t.done ? "bg-accent/20" : "bg-ink/5"}`}>
                                {t.done ? (
                                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                                        <path d="M1.5 4L3 5.5L6.5 2" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" />
                                    </svg>
                                ) : (
                                    <div className="w-2 h-2 rounded-full border border-ink/30 border-t-transparent animate-spin" />
                                )}
                            </div>
                            <span className="font-mono text-[11px] text-ink flex-1"><span className="text-accent">ƒ</span> {t.tool}</span>
                            <span className={`font-mono text-[10px] ${t.done ? "text-accent" : "text-ink-muted"}`}>{t.result}</span>
                        </div>
                    ))}
                </div>
            ),
        },
        {
            n: "03",
            tag: "LIVE DELIVERY",
            title: "One click to launch.",
            desc: "Review the customer count and message drafts, select your favorite variant, and hit launch. Delivery, open, and click rates stream back live.",
            visual: (
                <div className="space-y-3 p-4 bg-canvas rounded-sm border border-hairline shadow-sm w-full max-w-[340px]">
                    <div className="space-y-2.5">
                        {[
                            { label: "DELIVERED", pct: 99.8, color: "var(--accent)" },
                            { label: "OPENED", pct: 60.4, color: "var(--opened-fg)" },
                            { label: "CLICKED", pct: 24, color: "var(--clicked-fg)" },
                        ].map((b) => (
                            <div key={b.label} className="flex items-center gap-3">
                                <span className="w-16 font-mono text-[9px] text-ink-muted uppercase tracking-wide shrink-0">{b.label}</span>
                                <div className="flex-1 h-1 bg-canvas-deep border border-hairline rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ scaleX: 0 }}
                                        whileInView={{ scaleX: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.9, delay: 0.2, ease }}
                                        className="h-full rounded-full origin-left"
                                        style={{ width: `${b.pct}%`, background: b.color }}
                                    />
                                </div>
                                <span className="w-7 font-mono text-[9px] text-ink-muted text-right shrink-0">{b.pct}%</span>
                            </div>
                        ))}
                    </div>
                    <div className="pt-1">
                        <button
                            className="w-full h-9 rounded-full text-[13px] font-medium text-white transition-all bg-accent hover:bg-accent-hover active:scale-[0.97]"
                        >
                            Send Campaign &rarr;
                        </button>
                    </div>
                </div>
            ),
        },
    ];

    return (
        <section id="how-it-works" className="py-24 px-6 bg-canvas border-b border-hairline">
            <div className="mx-auto max-w-[1280px]">
                <Reveal className="mb-20">
                    <span className="font-mono text-[11px] text-ink-muted tracking-widest uppercase block mb-4">
                        [ SYSTEM WORKFLOW ]
                    </span>
                    <h2
                        className="text-ink font-display"
                        style={{ fontSize: "clamp(36px, 4vw, 52px)", lineHeight: 1.05, letterSpacing: "-1px" }}
                    >
                        From thought to delivery.
                    </h2>
                </Reveal>

                <StaggerGrid className="flex flex-col w-full" stagger={0.1}>
                    {steps.map((s, i) => (
                        <StaggerItem key={i} className="w-full">
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 py-10 border-t border-hairline items-start text-left">
                                
                                {/* Step number & tag */}
                                <div className="md:col-span-3 flex flex-col gap-2">
                                    <span className="font-mono text-[24px] text-accent leading-none font-medium">
                                        {s.n}
                                    </span>
                                    <span className="font-mono text-[11px] text-ink-body tracking-widest uppercase">
                                        {s.tag}
                                    </span>
                                </div>

                                {/* Title & description */}
                                <div className="md:col-span-5 pr-4">
                                    <h3 className="text-[22px] font-sans font-medium text-ink leading-tight mb-3">
                                        {s.title}
                                    </h3>
                                    <p className="text-[15px] leading-relaxed text-ink-body">
                                        {s.desc}
                                    </p>
                                </div>

                                {/* Visual */}
                                <div className="md:col-span-4 flex justify-start md:justify-end">
                                    {s.visual}
                                </div>

                            </div>
                        </StaggerItem>
                    ))}
                    {/* Bottom boundary line */}
                    <div className="border-t border-hairline w-full" />
                </StaggerGrid>
            </div>
        </section>
    );
}
