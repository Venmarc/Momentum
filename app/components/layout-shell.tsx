'use client';

import React, { useState, useEffect } from 'react';
import Navigation from './navigation';
import { useSidebarStore } from '@/app/hooks/use-sidebar-store';

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebarStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const collapsed = mounted ? isCollapsed : false;

  return (
    <>
      <Navigation />
      <div 
        className={`flex-1 flex flex-col min-h-screen pt-16 md:pt-0 pb-16 md:pb-0 transition-all duration-300 ${
          collapsed ? 'md:pl-20' : 'md:pl-64'
        }`}
      >
        <main className="flex-1 flex flex-col">
          {children}
        </main>
      </div>
    </>
  );
}
