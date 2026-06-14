'use client';

import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/login' })}
      className="flex items-center justify-center gap-2 px-4 h-8 text-[13px] font-medium text-ink-muted hover:text-ink hover:bg-surface-2 rounded-lg transition-colors ml-4 border border-transparent hover:border-hairline"
    >
      <LogOut className="w-3.5 h-3.5" />
      Sign out
    </button>
  );
}
