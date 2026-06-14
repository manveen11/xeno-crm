'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ProfileDropdown from '@/components/layout/ProfileDropdown';
import { User } from 'next-auth';

interface DashboardNavbarProps {
  user: User;
}

export default function DashboardNavbar({ user }: DashboardNavbarProps) {
  const pathname = usePathname();

  const links = [
    { href: '/dashboard', label: 'Agent' },
    { href: '/dashboard/campaigns', label: 'Campaigns' },
    { href: '/dashboard/segments', label: 'Segments' },
  ];

  return (
    <nav className="border-b border-hairline px-6 h-16 flex items-center justify-between sticky top-0 bg-canvas/80 backdrop-blur-xl z-50">
      <Link href="/dashboard" className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary text-white font-mono text-sm font-bold">
          X
        </div>
        <span className="font-sans font-medium text-[15px] tracking-tight text-ink">Xeno CRM</span>
      </Link>
      <div className="flex items-center gap-4 sm:gap-6 text-[14px] font-sans font-medium text-ink-muted">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`hidden sm:inline transition-colors ${
                isActive ? 'text-ink font-semibold' : 'hover:text-ink'
              }`}
            >
              {link.label}
            </Link>
          );
        })}
        <ProfileDropdown user={user} />
      </div>
    </nav>
  );
}
