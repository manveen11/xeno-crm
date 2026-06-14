import { prisma } from '@/lib/prisma';
import { Filter, Star } from 'lucide-react';
import Link from 'next/link';

import SegmentFilters from './SegmentFilters';
import { CSVImport } from '@/components/ui/CSVImport';

export const dynamic = 'force-dynamic';

export default async function SegmentsPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const params = await searchParams;
  const isVip = params.vip === 'true';
  const search = typeof params.search === 'string' ? params.search : undefined;

  // Build prisma where clause
  const where: any = {};
  if (isVip) {
    where.totalSpent = { gte: 5000 };
  }
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ];
  }

  // Fetch top customers by spend
  const customers = await prisma.customer.findMany({
    where,
    orderBy: { totalSpent: 'desc' },
    take: 100,
  });

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 flex flex-col h-full overflow-y-auto pb-10 scrollbar-hide pt-6 sm:pt-10">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-10 sm:mb-12 gap-6 shrink-0">
        <div>
          <h1 className="text-[32px] sm:text-[44px] font-[family-name:var(--font-display)] tracking-tight leading-none text-ink">Segments</h1>
          <p className="text-ink-muted mt-3 sm:mt-4 text-[14px] sm:text-[16px]">View and analyze your audience and customer data.</p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-end">
          <CSVImport />
          <SegmentFilters currentVip={isVip} currentSearch={search || ''} />
          <Link href="/dashboard?prompt=Target+customers+who+" className="flex items-center gap-2 bg-ink text-canvas px-3 py-2 sm:px-5 sm:py-2.5 rounded-xl font-medium shadow-sm hover:scale-105 active:scale-95 transition-all text-[13px] sm:text-[14px]">
             <span className="hidden sm:inline">Ask Agent to Segment</span>
             <span className="inline sm:hidden">Segment AI</span>
          </Link>
        </div>
      </div>

      <div className="bg-surface border border-hairline rounded-[16px] sm:rounded-[24px] shadow-sm overflow-hidden flex-1">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-hairline bg-canvas/50">
                <th className="px-6 py-4 text-[11px] uppercase tracking-widest font-bold text-ink-muted">Customer</th>
                <th className="px-6 py-4 text-[11px] uppercase tracking-widest font-bold text-ink-muted">Contact</th>
                <th className="px-6 py-4 text-[11px] uppercase tracking-widest font-bold text-ink-muted">Orders</th>
                <th className="px-6 py-4 text-[11px] uppercase tracking-widest font-bold text-ink-muted">Total Spent</th>
                <th className="px-6 py-4 text-[11px] uppercase tracking-widest font-bold text-ink-muted">Last Order</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {customers.map((c) => {
                const isVip = c.totalSpent >= 5000;
                return (
                  <tr key={c.id} className="hover:bg-canvas/50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold ${isVip ? 'bg-[#FFFBEB] text-[#D97706]' : 'bg-canvas border border-hairline text-ink'}`}>
                          {c.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[14px] font-bold text-ink flex items-center gap-2">
                            {c.name}
                            {isVip && <Star className="w-3 h-3 text-[#F59E0B] fill-[#F59E0B]" />}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-[13px] text-ink-body font-medium">{c.email || 'N/A'}</p>
                      <p className="text-[12px] text-ink-muted font-mono">{c.phone || 'N/A'}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-[14px] font-bold text-ink">{c.totalOrders}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-[14px] font-bold font-mono ${isVip ? 'text-[#D97706]' : 'text-ink'}`}>
                        ₹{c.totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-[13px] text-ink-muted font-medium">
                      {c.lastOrderAt ? new Date(c.lastOrderAt).toLocaleDateString() : 'Never'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
