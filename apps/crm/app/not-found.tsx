import Link from 'next/link';
import { Home, ArrowLeft, SearchX } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-canvas relative overflow-hidden">
      {/* Decorative Background Gradients */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-accent/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-brand/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>

      <div className="relative z-10 w-full max-w-[500px] flex flex-col items-center text-center">
        {/* Glassmorphic Container */}
        <div className="bg-surface/80 backdrop-blur-xl border border-hairline p-10 sm:p-14 rounded-[32px] shadow-2xl flex flex-col items-center w-full">
          
          <div className="h-20 w-20 rounded-2xl bg-canvas border border-hairline flex items-center justify-center shadow-1 mb-8">
            <SearchX className="h-10 w-10 text-accent" />
          </div>

          <h1 className="text-[80px] sm:text-[100px] leading-none font-bold font-[family-name:var(--font-display)] text-ink mb-2 tracking-tighter">
            404
          </h1>
          
          <h2 className="text-[20px] sm:text-[24px] font-semibold text-ink mb-4">
            Page Not Found
          </h2>
          
          <p className="text-ink-muted text-[15px] sm:text-[16px] mb-10 max-w-[300px]">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <Link 
              href="/"
              className="flex-1 flex items-center justify-center gap-2 bg-ink text-canvas hover:bg-ink-body px-6 py-3.5 rounded-2xl font-medium transition-transform active:scale-95 shadow-lg"
            >
              <Home className="w-5 h-5" />
              Go to Home
            </Link>
            
            <Link 
              href="/dashboard"
              className="flex-1 flex items-center justify-center gap-2 bg-canvas border border-hairline text-ink hover:bg-surface px-6 py-3.5 rounded-2xl font-medium transition-transform active:scale-95 shadow-sm"
            >
              <ArrowLeft className="w-5 h-5" />
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
