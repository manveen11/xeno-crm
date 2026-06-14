import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { User, Mail, Shield, Key, Clock, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { SignOutButton } from '@/components/ui/SignOutButton';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-ink-muted">Please sign in to view your profile.</p>
      </div>
    );
  }

  // Fetch full user details including linked OAuth accounts
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { accounts: true }
  });

  if (!user) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-ink-muted">User not found.</p>
      </div>
    );
  }

  const initial = user.name ? user.name.charAt(0).toUpperCase() : 'U';
  
  // Determine auth method
  const hasPassword = !!user.password;
  const oauthProviders = user.accounts.map(acc => acc.provider);
  const authMethods = [];
  if (hasPassword) authMethods.push('Email & Password');
  if (oauthProviders.length > 0) {
    authMethods.push(...oauthProviders.map(p => p.charAt(0).toUpperCase() + p.slice(1)));
  }

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 flex flex-col h-full overflow-y-auto pb-10 scrollbar-hide pt-6 sm:pt-10">
      <div className="flex justify-between items-center mb-10 sm:mb-12 shrink-0">
        <div>
          <h1 className="text-[32px] sm:text-[44px] font-[family-name:var(--font-display)] tracking-tight leading-none text-ink">My Profile</h1>
          <p className="text-ink-muted mt-3 sm:mt-4 text-[14px] sm:text-[16px]">Manage your personal information and account settings.</p>
        </div>
        <SignOutButton />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        
        {/* Left Column: Personal Info Card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface border border-hairline p-6 sm:p-8 rounded-[24px] shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8">
            <div className="h-24 w-24 sm:h-32 sm:w-32 shrink-0 rounded-[24px] bg-canvas border border-hairline flex items-center justify-center font-[family-name:var(--font-display)] text-ink text-[40px] italic shadow-1">
              {user.image ? (
                <img src={user.image} alt={initial} className="h-full w-full rounded-[24px] object-cover" />
              ) : (
                initial
              )}
            </div>
            
            <div className="flex-1 space-y-4 w-full">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-ink-muted font-mono mb-1">Full Name</p>
                <div className="flex items-center gap-3 bg-canvas border border-hairline px-4 py-3 rounded-xl">
                  <User className="w-5 h-5 text-accent" />
                  <span className="text-[16px] font-semibold text-ink">{user.name || 'Not provided'}</span>
                </div>
              </div>
              
              <div>
                <p className="text-[10px] uppercase tracking-widest text-ink-muted font-mono mb-1">Email Address</p>
                <div className="flex items-center gap-3 bg-canvas border border-hairline px-4 py-3 rounded-xl">
                  <Mail className="w-5 h-5 text-accent" />
                  <span className="text-[16px] font-medium text-ink truncate">{user.email}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Security/Meta */}
        <div className="space-y-6">
          <div className="bg-surface border border-hairline p-6 sm:p-8 rounded-[24px] shadow-sm">
            <h3 className="text-[16px] font-bold text-ink mb-5 flex items-center gap-2">
              <Shield className="w-5 h-5 text-accent" /> Security Details
            </h3>
            
            <div className="space-y-5">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-ink-muted font-mono mb-1">Account Role</p>
                <div className="inline-flex items-center px-3 py-1 bg-ink text-canvas text-[11px] font-bold uppercase tracking-widest rounded-md">
                  Administrator
                </div>
              </div>
              
              <div className="pt-4 border-t border-hairline">
                <p className="text-[10px] uppercase tracking-widest text-ink-muted font-mono mb-1">Authentication Method</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {authMethods.length > 0 ? authMethods.map((method, idx) => (
                    <span key={idx} className="flex items-center gap-1.5 px-3 py-1.5 bg-canvas border border-hairline rounded-lg text-[13px] font-medium text-ink">
                      <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                      {method}
                    </span>
                  )) : (
                    <span className="text-[13px] text-ink-muted">Unknown</span>
                  )}
                </div>
              </div>

              {hasPassword && (
                <div className="pt-4 border-t border-hairline">
                  <p className="text-[10px] uppercase tracking-widest text-ink-muted font-mono mb-1">Password</p>
                  <div className="flex items-center gap-2 text-[14px] font-medium text-ink">
                    <Key className="w-4 h-4 text-ink-muted" /> Password is set
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
