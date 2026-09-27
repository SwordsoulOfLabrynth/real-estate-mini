'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MapPin, Compass, BarChart3, Scale, Heart, Shield, Search } from 'lucide-react';
import { useFavorites, useComparison } from '@/lib/store/user-preferences';

interface HeaderProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export function Header({ searchQuery = '', onSearchChange }: HeaderProps) {
  const pathname = usePathname();
  const { favorites } = useFavorites();
  const { compareList } = useComparison();

  return (
    <header className="h-16 border-b border-slate-200 bg-white/95 backdrop-blur-sm px-4 md:px-6 flex items-center justify-between z-30 sticky top-0">
      {/* Brand & Concept */}
      <div className="flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 bg-slate-900 text-white rounded-md flex items-center justify-center font-bold tracking-wider text-sm transition-transform group-hover:bg-sky-600">
            <Compass className="w-5 h-5 text-sky-400 group-hover:text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-slate-900 leading-tight">
              TERRA<span className="text-sky-600 font-extrabold">MAP</span>
            </span>
            <span className="text-[10px] font-medium tracking-wider text-slate-500 uppercase">
              Real Estate Intelligence
            </span>
          </div>
        </Link>

        {/* Global Search Bar (Only shown on map view or general navigation) */}
        {onSearchChange !== undefined && (
          <div className="relative hidden md:block w-72 lg:w-96">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search township, street, or property..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 rounded-md bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 transition-colors"
            />
          </div>
        )}
      </div>

      {/* Navigation Actions */}
      <nav className="flex items-center gap-1 sm:gap-2">
        <Link
          href="/"
          className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors ${
            pathname === '/'
              ? 'bg-slate-100 text-slate-900 font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <MapPin className="w-3.5 h-3.5 text-slate-500" />
          <span>Map Discovery</span>
        </Link>

        <Link
          href="/analysis"
          className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors ${
            pathname.startsWith('/analysis')
              ? 'bg-slate-100 text-slate-900 font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5 text-slate-500" />
          <span>Area Intelligence</span>
        </Link>

        <Link
          href="/compare"
          className={`relative px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors ${
            pathname === '/compare'
              ? 'bg-slate-100 text-slate-900 font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Scale className="w-3.5 h-3.5 text-slate-500" />
          <span>Compare</span>
          {compareList.length > 0 && (
            <span className="w-4 h-4 bg-sky-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
              {compareList.length}
            </span>
          )}
        </Link>

        <Link
          href="/favorites"
          className={`relative px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors ${
            pathname === '/favorites'
              ? 'bg-slate-100 text-slate-900 font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Heart className="w-3.5 h-3.5 text-slate-500" />
          <span>Favorites</span>
          {favorites.length > 0 && (
            <span className="w-4 h-4 bg-rose-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
              {favorites.length}
            </span>
          )}
        </Link>

        <div className="h-4 w-[1px] bg-slate-200 mx-1 hidden sm:block" />

        <Link
          href="/admin"
          className={`px-2.5 py-1.5 rounded-md text-xs font-medium flex items-center gap-1 transition-colors ${
            pathname.startsWith('/admin')
              ? 'bg-slate-900 text-white'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
          }`}
          title="Admin Management"
        >
          <Shield className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Admin</span>
        </Link>
      </nav>
    </header>
  );
}
