"use client";

import React, { useState, useRef, useEffect } from "react";
import { LogOut, User, Settings, CreditCard } from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";

interface ProfileDropdownProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export default function ProfileDropdown({ user }: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initial = user.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <div className="relative shrink-0" ref={dropdownRef}>
      {/* Profile Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-10 w-10 min-h-[40px] min-w-[40px] shrink-0 rounded-full bg-surface border border-hairline sm:ml-4 flex items-center justify-center font-[family-name:var(--font-display)] text-ink text-[18px] italic shadow-1 transition-transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-accent/20"
      >
        {user.image ? (
          <img src={user.image} alt={initial} className="h-full w-full rounded-full object-cover" />
        ) : (
          initial
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-72 bg-canvas border border-hairline rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200 origin-top-right">
          {/* User Info Header */}
          <div className="p-5 border-b border-hairline bg-surface/50">
            <p className="font-semibold text-[15px] text-ink truncate">{user.name || "Xeno User"}</p>
            <p className="text-[13px] text-ink-muted truncate mt-1">{user.email}</p>
          </div>

          {/* Menu Items */}
          <div className="p-2 space-y-1">
            <Link href="/dashboard/profile" onClick={() => setIsOpen(false)} className="w-full flex items-center gap-4 px-4 py-3 text-[14px] font-medium text-ink-body hover:text-ink hover:bg-surface rounded-xl transition-colors">
              <User className="h-5 w-5 text-ink-muted" />
              My Profile
            </Link>
            <Link href="/dashboard/settings" onClick={() => setIsOpen(false)} className="w-full flex items-center gap-4 px-4 py-3 text-[14px] font-medium text-ink-body hover:text-ink hover:bg-surface rounded-xl transition-colors">
              <Settings className="h-5 w-5 text-ink-muted" />
              Settings
            </Link>
          </div>

          <div className="p-2 border-t border-hairline">
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="w-full flex items-center gap-4 px-4 py-3 text-[14px] font-medium text-accent hover:bg-accent/10 rounded-xl transition-colors"
            >
              <LogOut className="h-5 w-5" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
