'use client';

import { usePathname } from 'next/navigation';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Toaster } from 'react-hot-toast';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { cn } from '@/lib/utils/cn';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const updateScrollState = useCallback(() => {
    const node = scrollContainerRef.current;
    if (!node) {
      return;
    }

    setIsScrolled(node.scrollTop > 20);
  }, []);

  useEffect(() => {
    const node = scrollContainerRef.current;
    if (!node) {
      return;
    }

    node.addEventListener('scroll', updateScrollState, { passive: true });
    updateScrollState();

    return () => {
      node.removeEventListener('scroll', updateScrollState);
    };
  }, [updateScrollState]);

  useEffect(() => {
    setIsTransitioning(true);
    const timeout = setTimeout(() => setIsTransitioning(false), 450);
    return () => clearTimeout(timeout);
  }, [pathname]);

  return (
    <>
      <div className="flex h-screen overflow-hidden bg-gray-50">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="relative flex flex-1 flex-col overflow-hidden">
          <div
            className={cn(
              'pointer-events-none fixed left-0 right-0 top-0 z-50 h-0.5 origin-left bg-gradient-to-r from-blue-500 via-indigo-500 to-fuchsia-500 transition duration-500',
              isTransitioning ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'
            )}
            aria-hidden="true"
          />

          <Header onMenuClick={() => setSidebarOpen(true)} isScrolled={isScrolled} />

          <main
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto bg-gray-50 px-3 py-4 text-slate-900 scroll-smooth md:px-6 md:py-6"
          >
            <div key={pathname} className="page-transition">
              {children}
            </div>

            <Footer />
          </main>
        </div>
      </div>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </>
  );
}
