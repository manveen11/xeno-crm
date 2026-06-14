"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { ease, MagButton } from "./motion";

export function Nav() {
  const { status } = useSession();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease }}
      className="fixed inset-x-0 top-0 z-50 flex justify-center w-full border-b border-hairline bg-canvas/90 backdrop-blur-md pointer-events-auto"
    >
      <div className="flex items-center justify-between gap-6 px-6 md:px-8 h-16 w-full max-w-[1280px]">
        <Link href="/" className="flex items-center gap-2 shrink-0 group">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-primary text-white font-mono text-sm font-bold">
            X
          </div>
          <span className="font-sans font-medium text-[15px] tracking-tight text-ink">Xeno CRM</span>
        </Link>

        <nav className="hidden md:flex items-center gap-2 flex-1 justify-center">
          <Link href="#capabilities" className="px-4 py-1.5 text-[14px] font-sans font-medium text-ink-body hover:text-ink hover:underline decoration-accent decoration-2 underline-offset-4 transition-all">
            Features
          </Link>
          <Link href="#how-it-works" className="px-4 py-1.5 text-[14px] font-sans font-medium text-ink-body hover:text-ink hover:underline decoration-accent decoration-2 underline-offset-4 transition-all">
            Workflow
          </Link>
          <a href="https://github.com/manveen11" target="_blank" rel="noopener noreferrer" className="px-4 py-1.5 text-[14px] font-sans font-medium text-ink-body hover:text-ink hover:underline decoration-accent decoration-2 underline-offset-4 transition-all">
            Documentation
          </a>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-hairline bg-canvas-deep ml-2 shadow-xs select-none">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-success"></span>
            </span>
            <span className="font-mono text-[9px] uppercase tracking-wider text-ink-muted font-bold">API Online</span>
          </div>
        </nav>

        <div className="flex items-center gap-4 shrink-0">
          {status === 'unauthenticated' && (
            <Link href="/login" className="hidden sm:flex items-center px-2 py-1.5 text-[14px] font-sans font-medium text-ink-body hover:text-ink transition-all">
              Sign in
            </Link>
          )}
          <MagButton
            asLink href="/dashboard"
            className="flex items-center gap-1.5 px-6 h-10 text-[14px] font-sans font-medium text-on-primary bg-primary hover:bg-primary-hover rounded-full transition-all"
          >
            Console
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <path d="M2 5.5H9M9 5.5L6.5 3M9 5.5L6.5 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </MagButton>
        </div>
      </div>
    </motion.header>
  );
}
