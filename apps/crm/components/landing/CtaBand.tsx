import React from "react";
import Link from "next/link";
import { Reveal, MagButton } from "./motion";

export function CtaBand() {
  return (
    <section className="py-32 px-6 bg-success border-y border-white/10">
      <div className="mx-auto max-w-[1280px]">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-12">
          
          <Reveal className="max-w-[600px] text-left">
            <span className="font-mono text-[11px] text-white/50 tracking-widest uppercase block mb-5">[ GET STARTED ]</span>
            <h2
              className="text-white font-display mb-6"
              style={{ fontSize: "clamp(36px, 4vw, 52px)", lineHeight: 1.05, letterSpacing: "-1px" }}
            >
              Start messaging your customers in seconds.
            </h2>
            <p className="text-[16px] md:text-[18px] text-white/80 leading-relaxed">
              Open the chat console, describe who you want to reach in simple English, and let our AI handle segmenting and drafting your campaign instantly.
            </p>
          </Reveal>

          <Reveal delay={0.15} className="flex flex-col sm:flex-row items-center gap-6 shrink-0">
            <MagButton
              asLink href="/dashboard"
              className="flex items-center justify-center gap-2 px-8 h-12 text-[14px] font-sans font-medium text-primary bg-white hover:bg-white/95 rounded-full transition-all active:scale-[0.97]"
            >
              Launch the CRM
            </MagButton>
            <Link
              href="/dashboard"
              className="text-[14px] font-sans font-medium text-white hover:underline decoration-accent decoration-2 underline-offset-4 transition-all"
            >
              Go to Chat &rarr;
            </Link>
          </Reveal>

        </div>
      </div>
    </section>
  );
}
