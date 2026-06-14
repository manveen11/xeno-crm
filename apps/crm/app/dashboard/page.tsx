import ChatInterface from '@/components/chat/ChatInterface';
import { prisma } from '@/lib/prisma';
import { BarChart2, MessageSquare, Send, Users } from 'lucide-react';
import { redirect } from 'next/navigation';
import { AnimatedNumber } from '@/components/ui/AnimatedNumber';
import { AutoRefresh } from '@/components/ui/AutoRefresh';

// Force dynamic rendering since we are reading from DB
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  // Session check is handled by layout.tsx

 // Fetch some aggregate stats to display on the side
 const totalCustomers = await prisma.customer.count();
 const totalCampaigns = await prisma.campaign.count();
 const totalSent = await prisma.campaignStats.aggregate({
 _sum: { sent: true, delivered: true, opened: true }
 });

  return (
    <main className="flex-1 max-w-[1280px] w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col h-[calc(100dvh-64px)] bg-canvas">
      <AutoRefresh intervalMs={3000} />
      
      {/* Horizontal Telemetry Bar */}
      <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-hairline border border-hairline bg-canvas rounded-sm mb-6 sm:mb-8 shrink-0 overflow-hidden shadow-sm">
        {[
          { label: "Customers", val: totalCustomers, icon: <Users className="h-4 w-4 text-accent" /> },
          { label: "Campaigns", val: totalCampaigns, icon: <Send className="h-4 w-4 text-accent" /> },
          { label: "Delivered", val: totalSent._sum.delivered || 0, icon: <MessageSquare className="h-4 w-4 text-accent" /> },
          { label: "Total Opens", val: totalSent._sum.opened || 0, icon: <BarChart2 className="h-4 w-4 text-opened-fg" /> },
        ].map((kpi, idx) => (
          <div key={idx} className="flex-1 p-6 flex items-center justify-between sm:flex-col sm:items-start gap-4">
            <div className="flex items-center gap-2 text-ink-muted">
              {kpi.icon}
              <span className="text-[11px] font-mono uppercase tracking-widest">{kpi.label}</span>
            </div>
            <p className="text-[28px] sm:text-[36px] font-mono font-semibold leading-none text-ink tracking-tight">
              <AnimatedNumber value={kpi.val} />
            </p>
          </div>
        ))}
      </div>

      {/* Dynamic Chat Area */}
      <div className="flex-1 w-full flex justify-center pb-4 min-h-0">
        <ChatInterface />
      </div>
    </main>
  );
}
