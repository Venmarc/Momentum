'use client';

import React, { useState, useEffect } from 'react';
import Navigation from './navigation';
import { useSidebarStore } from '@/app/hooks/use-sidebar-store';
import { usePathname } from 'next/navigation';

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLanding = pathname === '/';
  const { isCollapsed, setCollapsed } = useSidebarStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const handleResize = () => {
      // Collapse sidebar by default on tablet screens
      if (window.innerWidth >= 768 && window.innerWidth < 1024) {
        setCollapsed(true);
      }
    };

    handleResize(); // Run check on mount
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setCollapsed]);

  const collapsed = mounted ? isCollapsed : false;

  if (isLanding) {
    return (
      <div className="flex-1 flex flex-col min-h-screen min-w-0 bg-[#030303]">
        <main className="flex-1 flex flex-col min-w-0">
          {children}
        </main>
      </div>
    );
  }

  return (
    <>
      <Navigation />
      
      {/* Click-outside backdrop drawer overlay for tablets when sidebar is expanded */}
      {!collapsed && (
        <div 
          onClick={() => setCollapsed(true)}
          className="fixed inset-0 bg-black/50 backdrop-blur-md z-20 md:max-lg:block hidden pointer-events-auto cursor-pointer transition-all duration-300"
        />
      )}

      <div 
        className={`flex-1 flex flex-col min-h-screen pt-16 md:pt-0 pb-24 md:pb-0 min-w-0 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          collapsed ? 'md:pl-16' : 'md:pl-16 lg:pl-64'
        }`}
      >
        <main className="flex-1 flex flex-col min-w-0">
          {children}
        </main>
      </div>
    </>
  );
}

