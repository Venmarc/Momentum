'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, CheckSquare, Dumbbell, Heart, TrendingUp, 
  PanelLeftClose, PanelLeft
} from 'lucide-react';
import { UserButton, useUser } from '@clerk/nextjs';
import { useSidebarStore } from '@/app/hooks/use-sidebar-store';
import { useRef } from 'react';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
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
  const [isHovered, setIsHovered] = useState(false);
  const leaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const collapsed = mounted ? isCollapsed : false;
  
  const handleMouseEnter = () => {
    if (collapsed && typeof window !== 'undefined' && window.innerWidth >= 1024) {
      if (leaveTimeoutRef.current) {
        clearTimeout(leaveTimeoutRef.current);
        leaveTimeoutRef.current = null;
      }
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (collapsed) {
      leaveTimeoutRef.current = setTimeout(() => {
        setIsHovered(false);
      }, 300);
    }
  };

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (leaveTimeoutRef.current) {
        clearTimeout(leaveTimeoutRef.current);
      }
    };
  }, []);

  const isExpandedVisual = !collapsed || isHovered;
  const displayName = isLoaded && user ? (user.firstName || user.username || 'User') : 'User';

  return (
    <>
      {/* Desktop Sidebar */}
      <aside 
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`hidden md:flex fixed inset-y-0 left-0 flex-col z-30 transition-all duration-300 cubic-bezier(0.16, 1, 0.3, 1) ${
          isExpandedVisual 
            ? 'w-64 bg-[#09090b]/95 backdrop-blur-md border-r border-[#27272a] shadow-2xl shadow-black/95' 
            : 'w-16 bg-[#09090b] border-r border-[#1a1a1c]'
        } ${
          isExpandedVisual ? 'overflow-y-auto overflow-x-hidden' : 'overflow-visible'
        }`}
      >
        {/* Header/Logo */}
        <div className={`flex items-center h-16 border-b border-[#1a1a1c] px-4 transition-all duration-300 ${isExpandedVisual ? 'justify-between px-6' : 'justify-center'}`}>
          {isExpandedVisual ? (
            <>
              <Link 
                href={user ? "/dashboard" : "/"}
                className="flex items-center gap-2 select-none cursor-pointer group/logo"
              >
                <img 
                  src="/logo.svg" 
                  alt="Momentum Logo" 
                  className="w-8 h-8 rounded-xl bg-brand-success/5 border border-brand-success/20 p-1 object-contain transition-all" 
                />
                <span className="text-xs font-black tracking-widest text-[#f4f4f5] transition-colors">
                  MOMENTUM
                </span>
              </Link>
              <button 
                onClick={toggleSidebar} 
                className="p-1.5 rounded-lg border border-[#27272a] hover:border-zinc-700 bg-transparent text-[#a1a1aa] hover:text-white cursor-pointer hover:bg-[#121214] transition-colors active-bounce relative group"
              >
                <PanelLeftClose className="w-4 h-4" />
                <span className="absolute left-full ml-2.5 top-1/2 -translate-y-1/2 scale-95 opacity-0 group-hover:scale-100 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 ease-out pointer-events-none whitespace-nowrap bg-[#09090b] border border-[#27272a] text-[#e4e4e7] rounded-lg px-2.5 py-1.5 text-[11px] font-medium shadow-xl shadow-black/60 z-50">
                  Collapse Sidebar
                </span>
              </button>
            </>
          ) : (
            <Link 
              href={user ? "/dashboard" : "/"}
              className="cursor-pointer relative group"
            >
              <img 
                src="/logo.svg" 
                alt="Momentum Logo" 
                className="w-8 h-8 rounded-xl bg-brand-success/5 border border-brand-success/20 p-1 object-contain transition-all" 
              />
              <span className="absolute left-full ml-2.5 top-1/2 -translate-y-1/2 scale-95 opacity-0 group-hover:scale-100 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 ease-out pointer-events-none whitespace-nowrap bg-[#09090b] border border-[#27272a] text-[#e4e4e7] rounded-lg px-2.5 py-1.5 text-[11px] font-medium shadow-xl shadow-black/60 z-50">
                Expand Sidebar
              </span>
            </Link>
          )}
        </div>

        {/* Navigation Links */}
        <nav className={`flex-1 px-3 py-6 space-y-1.5 ${isExpandedVisual ? 'overflow-y-auto overflow-x-hidden' : 'overflow-visible'}`}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center rounded-xl text-xs font-semibold transition-all active-bounce relative group ${
                  !isExpandedVisual ? 'justify-center p-3' : 'gap-3 px-4 py-3'
                } ${
                  isActive
                    ? 'bg-[#18181b] text-brand-success border border-[#27272a]'
                    : 'text-[#a1a1aa] hover:bg-[#121214] hover:text-[#f4f4f5] border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-brand-success' : ''}`} />
                {isExpandedVisual && <span>{item.name}</span>}
                {!isExpandedVisual && (
                  <span className="absolute left-full ml-2.5 top-1/2 -translate-y-1/2 scale-95 opacity-0 group-hover:scale-100 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 ease-out pointer-events-none whitespace-nowrap bg-[#09090b] border border-[#27272a] text-[#e4e4e7] rounded-lg px-2.5 py-1.5 text-[11px] font-medium shadow-xl shadow-black/60 z-50">
                    {item.name}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer/User Profile */}
        <div className={`p-4 border-t border-[#1a1a1c] flex items-center transition-all duration-300 ${!isExpandedVisual ? 'justify-center' : 'justify-between'}`}>
          <div className="flex items-center gap-3 relative group">
            <UserButton />
            {isExpandedVisual ? (
              <div className="text-left select-none max-w-[140px] truncate">
                <p className="text-xs font-bold text-white leading-tight truncate">{displayName}</p>
                <p className="text-[10px] text-[#71717a] font-medium leading-tight mt-0.5">Operating System</p>
              </div>
            ) : (
              <span className="absolute left-full ml-2.5 top-1/2 -translate-y-1/2 scale-95 opacity-0 group-hover:scale-100 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 ease-out pointer-events-none whitespace-nowrap bg-[#09090b] border border-[#27272a] text-[#e4e4e7] rounded-lg px-2.5 py-1.5 text-[11px] font-medium shadow-xl shadow-black/60 z-50">
                {displayName}
              </span>
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
              className={`flex-1 flex flex-col items-center justify-center h-full transition-all active-bounce ${
                isActive ? 'text-brand-success' : 'text-[#a1a1aa]'
              }`}
            >
              <Icon className="w-4 h-4 mb-1" />
              <span className="text-[8px] sm:text-[9px] font-bold tracking-normal">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
