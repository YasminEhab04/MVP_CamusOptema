'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button, cn } from './ui';
import { LogOut, Bell, Calendar, LayoutDashboard } from 'lucide-react';

export function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/bookings', label: 'Bookings', icon: Calendar },
    { href: '/notifications', label: 'Notifications', icon: Bell },
  ];

  return (
    <nav className="border-b border-zinc-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <Link href="/dashboard" className="text-xl font-bold text-indigo-600">
                CampusRes
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium transition-colors',
                      isActive
                        ? 'border-indigo-500 text-zinc-900'
                        : 'border-transparent text-zinc-500 hover:border-zinc-300 hover:text-zinc-700'
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            <div className="flex items-center space-x-3">
              <div className="flex flex-col items-end">
                <div className="text-sm font-medium text-zinc-900">{user?.name}</div>
                <div className="text-xs text-zinc-500 capitalize">{user?.role.toLowerCase()}</div>
              </div>
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
