import { prisma } from '@/lib/prisma';
import { Send, Plus, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { AnimatedNumber } from '@/components/ui/AnimatedNumber';
import { AutoRefresh } from '@/components/ui/AutoRefresh';

export const dynamic = 'force-dynamic';

export default async function CampaignsPage() {
  const campaigns = await prisma.campaign.findMany({
    include: { stats: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 flex flex-col h-full overflow-y-auto pb-10 scrollbar-hide pt-6 sm:pt-10">
      <AutoRefresh intervalMs={3000} />
      <div className="flex justify-between items-center mb-10 sm:mb-12 shrink-0">
        <div>
          <h1 className="text-[32px] sm:text-[44px] font-[family-name:var(--font-display)] tracking-tight leading-none text-ink">Campaigns</h1>
          <p className="text-ink-muted mt-3 sm:mt-4 text-[14px] sm:text-[16px]">View and track all your outbound marketing campaigns.</p>
        </div>
        <Link href="/dashboard?prompt=Launch+a+new+campaign+offering+" className="flex items-center gap-2 bg-ink text-canvas px-3 py-2 sm:px-5 sm:py-2.5 rounded-xl font-medium shadow-sm hover:scale-105 active:scale-95 transition-all text-[13px] sm:text-[14px]">
          <Plus className="w-4 h-4" /> <span className="hidden sm:inline">New Campaign</span>
        </Link>
      </div>

      {campaigns.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center bg-surface border border-hairline rounded-[24px] p-8 text-center mt-4 min-h-[400px]">
          <div className="w-16 h-16 bg-accent/10 text-accent rounded-2xl flex items-center justify-center mb-6 shadow-sm">
            <Send className="w-6 h-6 ml-1" />
          </div>
          <h3 className="text-[20px] sm:text-[24px] font-[family-name:var(--font-display)] tracking-tight text-ink mb-2">No Campaigns Yet</h3>
          <p className="text-ink-muted max-w-sm mb-8 text-[14px] sm:text-[15px] leading-relaxed">You haven't launched any campaigns. Go to the Agent dashboard to draft and send your first one!</p>
          <Link href="/dashboard" className="bg-accent text-white px-6 py-3 rounded-xl font-medium shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">
            Open AI Agent
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="bg-surface border border-hairline p-5 sm:p-6 rounded-[20px] shadow-sm hover:shadow-md transition-shadow flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
                  <h3 className="text-[16px] sm:text-[18px] font-bold text-ink truncate max-w-full">{campaign.name}</h3>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`px-2 py-0.5 sm:px-2.5 sm:py-1 text-[9px] sm:text-[10px] uppercase tracking-widest font-bold rounded-md ${campaign.status === 'SENT' ? 'bg-[#F0FDF4] text-[#16A34A] border border-[#22C55E]/20' : 'bg-canvas border border-hairline text-ink-muted'}`}>
                      {campaign.status}
                    </span>
                    <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 text-[9px] sm:text-[10px] uppercase tracking-widest font-bold rounded-md bg-canvas border border-hairline text-accent">
                      {campaign.channel}
                    </span>
                  </div>
                </div>
                <p className="text-ink-body text-[13px] sm:text-[14px] line-clamp-2 w-full lg:max-w-2xl bg-canvas border border-hairline p-3 rounded-xl italic">"{campaign.message}"</p>
                <p className="text-ink-muted text-[12px] mt-4 font-medium uppercase tracking-wider">{new Date(campaign.createdAt).toLocaleDateString()} at {new Date(campaign.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              </div>

              {campaign.stats ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 shrink-0 bg-canvas border border-hairline p-4 rounded-xl w-full lg:w-auto">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-ink-muted font-mono mb-1">Delivered</p>
                    <p className="text-[20px] sm:text-[24px] font-bold text-[#16A34A] leading-none"><AnimatedNumber value={campaign.stats.delivered} /></p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-ink-muted font-mono mb-1">Opened</p>
                    <p className="text-[20px] sm:text-[24px] font-bold text-[#2563EB] leading-none"><AnimatedNumber value={campaign.stats.opened} /></p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-ink-muted font-mono mb-1">Clicked</p>
                    <p className="text-[20px] sm:text-[24px] font-bold text-[#7C3AED] leading-none"><AnimatedNumber value={campaign.stats.clicked} /></p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-ink-muted font-mono mb-1">Failed</p>
                    <p className="text-[20px] sm:text-[24px] font-bold text-[#DC2626] leading-none"><AnimatedNumber value={campaign.stats.failed} /></p>
                  </div>
                </div>
              ) : (
                <div className="shrink-0 flex items-center justify-center gap-2 text-ink-muted bg-canvas border border-hairline px-4 py-3 rounded-xl text-[13px] font-medium w-full lg:w-auto">
                  <AlertCircle className="w-4 h-4" /> Processing Delivery Stats...
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
