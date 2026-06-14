'use client';

import { Filter, Search, X } from 'lucide-react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useState, useCallback, useTransition } from 'react';

export default function SegmentFilters({ currentVip, currentSearch }: { currentVip: boolean, currentSearch: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState(currentSearch);
  const [vip, setVip] = useState(currentVip);

  const applyFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (vip) {
      params.set('vip', 'true');
    } else {
      params.delete('vip');
    }

    if (search.trim()) {
      params.set('search', search.trim());
    } else {
      params.delete('search');
    }

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
    
    setIsOpen(false);
  }, [vip, search, pathname, router, searchParams]);

  const clearFilters = () => {
    setSearch('');
    setVip(false);
    startTransition(() => {
      router.push(pathname);
    });
    setIsOpen(false);
  };

  const hasActiveFilters = currentVip || currentSearch.length > 0;

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl font-medium shadow-sm transition-all text-[13px] sm:text-[14px] ${hasActiveFilters ? 'bg-accent text-white border-accent' : 'bg-surface border border-hairline text-ink hover:border-ink/20'}`}
      >
        <Filter className="w-4 h-4" /> 
        <span className="hidden sm:inline">Filter</span>
        {hasActiveFilters && (
          <span className="w-5 h-5 rounded-full bg-white/20 text-white flex items-center justify-center text-[10px]">
            {Number(currentVip) + (currentSearch ? 1 : 0)}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-[calc(100%+8px)] w-[280px] bg-canvas border border-hairline rounded-2xl shadow-2xl p-5 z-50 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-[14px] text-ink">Filter Customers</h3>
            <button onClick={() => setIsOpen(false)} className="text-ink-muted hover:text-ink"><X className="w-4 h-4" /></button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-[12px] font-bold text-ink-muted uppercase tracking-wider block mb-2">Search</label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
                <input 
                  type="text" 
                  placeholder="Name or email..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-surface border border-hairline rounded-xl pl-9 pr-3 py-2 text-[13px] focus:outline-none focus:border-ink/30 transition-colors"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-[13px] font-medium text-ink cursor-pointer flex items-center gap-2" htmlFor="vip-toggle">
                VIP Customers Only
              </label>
              <input 
                type="checkbox" 
                id="vip-toggle" 
                checked={vip} 
                onChange={(e) => setVip(e.target.checked)}
                className="w-4 h-4 accent-accent"
              />
            </div>
          </div>

          <div className="flex gap-2 mt-6">
            <button 
              onClick={clearFilters}
              className="flex-1 py-2 text-[13px] font-medium text-ink-muted hover:text-ink transition-colors"
            >
              Clear
            </button>
            <button 
              onClick={applyFilters}
              disabled={isPending}
              className="flex-1 py-2 bg-ink text-canvas rounded-xl text-[13px] font-medium shadow-sm hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
            >
              {isPending ? 'Applying...' : 'Apply Filters'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
