import React from "react";
import Link from "next/link";

export function Footer() {
    return (
        <footer className="py-12 px-6 border-t border-hairline bg-canvas">
            <div className="mx-auto max-w-[1280px]">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                    <div className="flex items-center gap-2 group">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-sm bg-primary text-white font-mono text-[10px] font-bold">
                            X
                        </div>
                        <span className="text-[14px] font-sans font-medium text-ink tracking-tight">Xeno CRM</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                        {["Dashboard", "Chat", "Campaigns", "Settings"].map((l) => (
                            <Link key={l} href={`/${l.toLowerCase()}`} className="text-[13px] font-sans text-ink-muted hover:text-ink transition-colors">
                                {l}
                            </Link>
                        ))}
                    </div>

                    <p className="font-mono text-[11px] text-ink-muted tracking-wider">
                        &copy; 2026 Xeno CRM &bull; By Manveen
                    </p>
                </div>
            </div>
        </footer>
    );
}
