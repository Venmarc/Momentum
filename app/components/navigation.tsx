'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, CheckSquare, Dumbbell, Heart, TrendingUp, 
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { UserButton, useUser } from '@clerk/nextjs';
import { useSidebarStore } from '@/app/hooks/use-sidebar-store';

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Habits', href: '/habits', icon: CheckSquare },
  { name: 'Fitness', href: '/fitness', icon: Dumbbell },
  { name: 'Wellness', href: '/wellness', icon: Heart },
  { name: 'Progress', href: '/progress', icon: TrendingUp },
];

export default function Navigation() {
  const pathname = usePathname();
  const { user, isLoaded } = useUser();
  const { isCollapsed, toggleSidebar } = useSidebarStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const collapsed = mounted ? isCollapsed : false;
  const displayName = isLoaded && user ? (user.username || user.firstName || 'User') : 'User';

  return (
    <>
      {/* Desktop Sidebar */}
      <aside 
        className={`hidden md:flex fixed inset-y-0 left-0 flex-col border-r border-[#1a1a1c] bg-[#09090b] text-[#f4f4f5] z-30 transition-all duration-300 ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Header/Logo */}
        <div className={`flex items-center h-16 border-b border-[#1a1a1c] px-4 ${collapsed ? 'justify-center' : 'justify-between px-6'}`}>
          {!collapsed ? (
            <>
              <span className="text-sm font-bold tracking-widest text-[#f4f4f5] flex items-center gap-2 select-none">
                <span className="w-2 h-2 rounded-full bg-brand-success animate-pulse shrink-0" />
                MOMENTUM
              </span>
              <button 
                onClick={toggleSidebar} 
                className="p-1.5 rounded-lg border border-[#27272a] hover:border-zinc-700 bg-transparent text-[#a1a1aa] hover:text-white cursor-pointer hover:bg-[#121214] transition-colors active-bounce"
                title="Collapse Sidebar"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </>
          ) : (
            <button 
              onClick={toggleSidebar} 
              className="p-1.5 rounded-lg border border-[#27272a] hover:border-zinc-700 bg-transparent text-[#a1a1aa] hover:text-white cursor-pointer hover:bg-[#121214] transition-colors active-bounce"
              title="Expand Sidebar"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center rounded-xl text-xs font-semibold transition-all active-bounce ${
                  collapsed ? 'justify-center p-3' : 'gap-3 px-4 py-3'
                } ${
                  isActive
                    ? 'bg-[#18181b] text-brand-success border border-[#27272a]'
                    : 'text-[#a1a1aa] hover:bg-[#121214] hover:text-[#f4f4f5] border border-transparent'
                }`}
                title={collapsed ? item.name : undefined}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-brand-success' : ''}`} />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer/User Profile */}
        <div className={`p-4 border-t border-[#1a1a1c] flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
          <div className="flex items-center gap-3">
            <UserButton />
            {!collapsed && (
              <div className="text-left select-none max-w-[140px] truncate">
                <p className="text-xs font-bold text-white leading-tight truncate">{displayName}</p>
                <p className="text-[10px] text-[#71717a] font-medium leading-tight mt-0.5">Operating System</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-16 border-b border-[#1a1a1c] bg-[#09090b] flex items-center justify-between px-6 z-30">
        <span className="text-sm font-bold tracking-widest text-[#f4f4f5] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-brand-success animate-pulse" />
          MOMENTUM
        </span>
        <UserButton />
      </header>

      {/* Mobile Bottom Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 border-t border-[#1a1a1c] bg-[#09090b] flex items-center justify-around z-30">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center w-16 h-full transition-all active-bounce ${
                isActive ? 'text-brand-success' : 'text-[#a1a1aa]'
              }`}
            >
              <Icon className="w-4 h-4 mb-1" />
              <span className="text-[9px] font-bold tracking-wider">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
