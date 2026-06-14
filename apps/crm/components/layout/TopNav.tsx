import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function TopNav() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-hairline bg-canvas/80 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-6 sm:px-8">
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary text-white font-mono text-sm font-bold">
                        X
                    </div>
                    <span className="font-sans font-medium text-[15px] tracking-tight text-ink hidden sm:inline-block">
                        Xeno CRM
                    </span>
                </div>

                <nav className="hidden md:flex items-center gap-6">
                    <Link href="#" className="text-[14px] font-sans font-medium text-ink-body hover:text-ink transition-colors">
                        Product
                    </Link>
                    <Link href="#" className="text-[14px] font-sans font-medium text-ink-body hover:text-ink transition-colors">
                        Customers
                    </Link>
                    <Link href="#" className="text-[14px] font-sans font-medium text-ink-body hover:text-ink transition-colors">
                        Pricing
                    </Link>
                </nav>

                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="default" className="hidden sm:inline-flex font-sans font-medium text-[14px]">
                        Docs
                    </Button>
                    <Button variant="primary" size="default" asChild className="rounded-full font-sans font-medium text-[14px] px-6">
                        <Link href="/dashboard">Launch CRM</Link>
                    </Button>
                </div>
            </div>
        </header>
    );
}
