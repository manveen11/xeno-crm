import React from "react";
import { Reveal, MagButton } from "./motion";
import { ChatMockup } from "./ChatMockup";
import Image from "next/image";

export function HeroSection() {
  return (
    <section className="min-h-[100dvh] flex flex-col items-center justify-center pt-28 px-6 bg-canvas">
      <div className="mx-auto max-w-[1280px] w-full text-center flex flex-col items-center">
        


        {/* Headline */}
        <Reveal delay={0.12} y={20}>
          <h1
            className="text-ink font-display mb-6 max-w-[900px] text-center text-balance"
            style={{
              fontSize: "clamp(44px, 5.5vw, 84px)",
              lineHeight: 1.05,
              letterSpacing: "-1.5px",
            }}
          >
            Launch marketing campaigns in <span className="text-accent underline decoration-wavy decoration-2 underline-offset-8">plain English</span>.
          </h1>
        </Reveal>

        {/* Subtitle */}
        <Reveal delay={0.22}>
          <p className="text-[18px] md:text-[20px] leading-[1.5] text-ink-body mb-8 max-w-[720px] text-center">
            Message your customers without the complexity. Just describe who you want to reach (like "customers who spent over ₹5,000") and what you want to send—our AI will do the rest in seconds.
          </p>
        </Reveal>

        {/* Buttons */}
        <Reveal delay={0.3}>
          <div className="flex flex-wrap items-center justify-center gap-6 mb-16">
            <MagButton
              asLink href="/dashboard"
              className="flex items-center justify-center gap-2 px-8 h-12 text-[14px] font-medium text-on-primary bg-primary hover:bg-primary-hover rounded-full transition-all active:scale-[0.97]"
            >
              Open Console
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M2.5 6.5H10.5M10.5 6.5L7.5 3.5M10.5 6.5L7.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </MagButton>
            <button className="text-[14px] font-medium text-ink hover:underline decoration-accent decoration-2 underline-offset-4 transition-all">
              Interface Tour &rarr;
            </button>
          </div>
        </Reveal>

        {/* Two-Card Media Composition */}
        <Reveal delay={0.35} y={30} className="w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full max-w-[1200px] mx-auto mb-16 text-left items-stretch">
            
            {/* Left Card: Wide Product Mockup Console (Col Span 7) */}
            <div className="lg:col-span-7 flex flex-col rounded-lg shadow-3 overflow-hidden">
              <ChatMockup />
            </div>

            {/* Right Card: Narrower Photography/Abstract Art Card (Col Span 5) */}
            <div className="lg:col-span-5 relative min-h-[300px] rounded-lg overflow-hidden border border-hairline bg-surface-2 flex flex-col justify-end p-8 group">
              <div className="absolute inset-0 z-0">
                <Image
                  src="/cohere_abstract_art.png"
                  alt="AI Node Network Art"
                  fill
                  sizes="(max-w-768px) 100vw, 400px"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
              <div className="relative z-20 text-white">
                <span className="font-mono text-[11px] text-accent uppercase tracking-widest">100% SECURE &amp; PRIVATE</span>
                <h3 className="font-sans text-[24px] font-medium mt-1 mb-2 leading-tight">Your Customer Data Stays Yours</h3>
                <p className="text-[14px] text-white/80 leading-relaxed">
                  Our smart engine scans your database locally. We never share your customers' names, emails, or personal details with external AI models.
                </p>
              </div>
            </div>

          </div>
        </Reveal>

        {/* Stats Band */}
        <Reveal delay={0.42} className="w-full max-w-[900px]">
          <div className="grid grid-cols-3 divide-x divide-hairline border border-hairline rounded-sm w-full bg-canvas-deep overflow-hidden">
            {[
              { val: "142,509", label: "MESSAGES SENT" },
              { val: "99.94%", label: "DELIVERY RATE" },
              { val: "0.28s", label: "AVERAGE RESPONSE TIME" },
            ].map((s, i) => (
              <div
                key={i}
                className="flex flex-col items-center py-6 px-4 text-center justify-center"
              >
                <span className="font-mono text-[22px] sm:text-[30px] font-semibold text-ink leading-none">{s.val}</span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-ink-muted mt-2">{s.label}</span>
              </div>
            ))}
          </div>
        </Reveal>

      </div>
    </section>
  );
}
