import { ReactNode } from 'react';
import Link from 'next/link';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full flex bg-canvas font-sans selection:bg-accent/30">
      {/* Left Side: Visual/Branding (Hidden on mobile) */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-[#0A0A0A] p-12 relative overflow-hidden border-r border-hairline">
        {/* Subtle background glow/effects */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] pointer-events-none" />
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-accent/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2 mb-16 inline-flex hover:opacity-80 transition-opacity">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent shadow-1">
              <svg width="14" height="14" viewBox="0 0 13 13" fill="none">
                <path d="M6.5 0L12.5622 3.5V10.5L6.5 14L0.437822 10.5V3.5L6.5 0Z" fill="white"/>
              </svg>
            </div>
            <span className="font-[family-name:var(--font-display)] text-[28px] tracking-tight text-white leading-none pt-1">Xeno</span>
          </Link>

          <h1 className="text-white font-[family-name:var(--font-display)]" style={{ fontSize: "clamp(40px, 4vw, 64px)", lineHeight: 1.1, letterSpacing: "-1px" }}>
            The CRM that speaks your language.
          </h1>
          <p className="text-white/60 text-[18px] mt-6 max-w-[400px] leading-relaxed">
            Segment your audience in plain English, draft personalised copy, and fire multi-channel campaigns instantly.
          </p>
        </div>

        <div className="relative z-10 flex gap-4">
           <div className="p-5 rounded-[20px] bg-white/5 border border-white/10 backdrop-blur-md min-w-[140px]">
             <div className="text-white/40 text-[11px] uppercase tracking-wider mb-2 font-medium">Delivery Rate</div>
             <div className="text-white font-[family-name:var(--font-display)] text-[36px] leading-none">99.8%</div>
           </div>
           <div className="p-5 rounded-[20px] bg-white/5 border border-white/10 backdrop-blur-md min-w-[140px]">
             <div className="text-white/40 text-[11px] uppercase tracking-wider mb-2 font-medium">Segment Time</div>
             <div className="text-white font-[family-name:var(--font-display)] text-[36px] leading-none">&lt; 2s</div>
           </div>
        </div>
      </div>

      {/* Right Side: Form (Full width on mobile, half on desktop) */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 lg:p-12 relative overflow-y-auto">
        <div className="w-full max-w-[420px]">
          {/* Mobile Logo (Visible only on small screens) */}
          <Link href="/" className="flex lg:hidden items-center gap-2 justify-center mb-10 hover:opacity-80 transition-opacity">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent shadow-1">
              <svg width="14" height="14" viewBox="0 0 13 13" fill="none">
                <path d="M6.5 0L12.5622 3.5V10.5L6.5 14L0.437822 10.5V3.5L6.5 0Z" fill="white"/>
              </svg>
            </div>
            <span className="font-[family-name:var(--font-display)] text-[28px] tracking-tight text-ink leading-none pt-1">Xeno</span>
          </Link>

          {children}
        </div>
      </div>
    </div>
  );
}
