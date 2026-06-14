import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import DashboardNavbar from '@/components/layout/DashboardNavbar';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-canvas text-ink selection:bg-accent/30 flex flex-col font-sans">
      <DashboardNavbar user={session.user as any} />
      {children}
    </div>
  );
}
