import React, { useState } from 'react';
import { Menu, X, Lock } from 'lucide-react';
import { MenuItem, SheetSettings } from '../types';
import { GoogleProfileAvatar } from './GoogleProfileAvatar';

interface NavbarProps {
  settings: SheetSettings;
  menuItems: MenuItem[];
  onOpenAdmin: () => void;
  isAdminLoggedIn?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  menuItems,
  onOpenAdmin,
  isAdminLoggedIn = false
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const avatarUrl = settings.avatar_icon_url || settings.logo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80';
  const name = settings.site_title || 'আরিফুল ইসলাম';
  const subtitle = settings.about_me_designation || 'ফুলস্ট্যাক ওয়েব ডেভেলপার ও অটোমেশন বিশেষজ্ঞ';

  // Check if Admin tab is already in menuItems, if not we add it seamlessly as a tab
  const hasAdminInMenu = menuItems.some(
    (item) => item.name.includes('এডমিন') || item.link === '#admin'
  );

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Header Left: Round Animated Google RGB Avatar + Name + Subtitle */}
        <a href="#hero" className="flex items-center gap-3.5 group">
          <GoogleProfileAvatar
            src={avatarUrl}
            alt={name}
            size="sm"
            showBadge={true}
            animateRing={true}
          />
          
          <div className="flex flex-col">
            {/* Name on Top */}
            <span className="font-bold text-lg sm:text-xl tracking-tight text-slate-900 group-hover:text-blue-700 transition leading-tight">
              {name}
            </span>
            {/* Subtitle Below */}
            <span className="text-[11px] sm:text-xs font-semibold text-blue-700 flex items-center gap-1 leading-tight mt-0.5">
              <span>{subtitle}</span>
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links (Clean Tab Bar) */}
        <nav className="hidden lg:flex items-center gap-6">
          {menuItems.map((item) => {
            if (item.link === '#admin' || item.name.includes('এডমিন')) {
              return (
                <button
                  key={item.id}
                  onClick={onOpenAdmin}
                  className="text-sm font-semibold text-slate-700 hover:text-blue-700 transition-colors duration-150 py-1 hover:border-b-2 hover:border-blue-600 flex items-center gap-1.5 cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5 text-blue-600" />
                  <span>{item.name}</span>
                  {isAdminLoggedIn && <span className="w-2 h-2 rounded-full bg-emerald-500"></span>}
                </button>
              );
            }
            return (
              <a
                key={item.id}
                href={item.link}
                className="text-sm font-semibold text-slate-700 hover:text-blue-700 transition-colors duration-150 py-1 hover:border-b-2 hover:border-blue-600"
              >
                {item.name}
              </a>
            );
          })}

          {!hasAdminInMenu && (
            <button
              onClick={onOpenAdmin}
              className="text-sm font-semibold text-slate-700 hover:text-blue-700 transition-colors duration-150 py-1 hover:border-b-2 hover:border-blue-600 flex items-center gap-1.5 cursor-pointer"
              title="এডমিন প্যানেল"
            >
              <Lock className="w-3.5 h-3.5 text-blue-600" />
              <span>এডমিন প্যানেল</span>
              {isAdminLoggedIn && <span className="w-2 h-2 rounded-full bg-emerald-500"></span>}
            </button>
          )}
        </nav>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition"
            aria-label="মেনু টগল করুন"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-5 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-1">
            {menuItems.map((item) => {
              if (item.link === '#admin' || item.name.includes('এডমিন')) {
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setMobileOpen(false);
                      onOpenAdmin();
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-xl text-base font-semibold text-slate-800 hover:bg-slate-100 hover:text-blue-700 transition flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-blue-600" />
                      <span>{item.name}</span>
                    </span>
                    {isAdminLoggedIn && <span className="w-2 h-2 rounded-full bg-emerald-500"></span>}
                  </button>
                );
              }
              return (
                <a
                  key={item.id}
                  href={item.link}
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2.5 rounded-xl text-base font-semibold text-slate-800 hover:bg-slate-100 hover:text-blue-700 transition"
                >
                  {item.name}
                </a>
              );
            })}

            {!hasAdminInMenu && (
              <button
                onClick={() => {
                  setMobileOpen(false);
                  onOpenAdmin();
                }}
                className="w-full text-left px-3 py-2.5 rounded-xl text-base font-semibold text-slate-800 hover:bg-slate-100 hover:text-blue-700 transition flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-blue-600" />
                  <span>এডমিন প্যানেল</span>
                </span>
                {isAdminLoggedIn && <span className="w-2 h-2 rounded-full bg-emerald-500"></span>}
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
