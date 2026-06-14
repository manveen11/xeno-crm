"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/' })}
      className="flex items-center gap-2 bg-canvas border border-hairline text-[#DC2626] px-3 py-2 sm:px-5 sm:py-2.5 rounded-xl font-medium shadow-sm hover:bg-[#FEF2F2] hover:border-[#FECACA] active:scale-95 transition-all text-[13px] sm:text-[14px]"
    >
      <LogOut className="w-4 h-4" /> <span className="hidden sm:inline">Sign Out</span>
    </button>
  );
}
