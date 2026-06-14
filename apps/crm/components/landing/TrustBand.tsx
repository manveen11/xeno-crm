import React from "react";
import { Reveal } from "./motion";

export function TrustBand() {
 const brands = ["Nykaa", "Mamaearth", "Sugar Cosmetics", "Wow Skin", "mCaffeine", "Plum", "Minimalist", "Dot & Key", "Snitch"];
 
 return (
 <Reveal>
 <section className="py-10 border-y border-hairline bg-canvas-deep overflow-hidden relative">
 {/* Fade gradients for edges */}
 <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-canvas-deep to-transparent z-10 pointer-events-none" />
 <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-canvas-deep to-transparent z-10 pointer-events-none" />
 
 <div className="mx-auto max-w-[1280px] px-6">
 <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-12">
 <span className="font-mono text-[11px] text-ink-muted tracking-widest uppercase shrink-0 relative z-20">
 [ USED BY D2C TEAMS AT ]
 </span>
 
 <div className="flex-1 overflow-hidden flex items-center">
 {/* Marquee Track 1 */}
 <div className="flex items-center gap-12 md:gap-20 animate-marquee shrink-0 pr-12 md:pr-20">
 {brands.map((b, i) => (
 <span key={i} className="text-2xl md:text-[32px] font-[family-name:var(--font-display)] text-ink-muted/40 whitespace-nowrap select-none hover:text-ink-muted transition-colors duration-300">
 {b}
 </span>
 ))}
 </div>
 {/* Marquee Track 2 (Duplicate for seamless loop) */}
 <div className="flex items-center gap-12 md:gap-20 animate-marquee shrink-0 pr-12 md:pr-20" aria-hidden="true">
 {brands.map((b, i) => (
 <span key={i} className="text-2xl md:text-[32px] font-[family-name:var(--font-display)] text-ink-muted/40 whitespace-nowrap select-none hover:text-ink-muted transition-colors duration-300">
 {b}
 </span>
 ))}
 </div>
 </div>
 </div>
 </div>
 </section>
 </Reveal>
 );
}
