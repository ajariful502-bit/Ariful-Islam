import React from 'react';
import { SheetSettings, MenuItem } from '../types';
import { ShieldCheck, Facebook, Twitter, Linkedin, Youtube, Instagram, MessageCircle, Github, Send, ArrowRight } from 'lucide-react';
import { GoogleProfileAvatar } from './GoogleProfileAvatar';

interface FooterProps {
  settings: SheetSettings;
  menuItems: MenuItem[];
}

export const Footer: React.FC<FooterProps> = ({ settings, menuItems }) => {
  return (
    <footer className="bg-slate-950 text-slate-400 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Col 1: Brand & Bio with Animated Google RGB Avatar */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3.5">
              <GoogleProfileAvatar
                src={settings.avatar_icon_url || settings.logo_url}
                alt={settings.site_title}
                size="sm"
                showBadge={true}
                animateRing={true}
              />
              <div>
                <span className="font-bold text-xl text-white tracking-tight block">
                  {settings.site_title || 'প্রবর্তন'}
                </span>
                <span className="text-xs text-blue-400 font-semibold">
                  {settings.about_me_designation || 'ফুলস্ট্যাক ওয়েব ডেভেলপার'}
                </span>
              </div>
            </div>
            
            <p className="text-sm text-slate-400 leading-relaxed max-w-md">
              {settings.about_me_summary || settings.hero_subtitle || 'গুগল স্প্রেডশিট দ্বারা সম্পূর্ণ পরিচালিত আধুনিক হেডলেস ওয়েব প্ল্যাটফর্ম। যেকোনো তথ্য পরিবর্তন করুন তাৎক্ষণিকভাবে।'}
            </p>

            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800 w-fit">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>গুগল শিট ও জেমিনি এআই লাইভ সিঙ্কড</span>
            </div>
          </div>

          {/* Col 2: All Tabs Shortcuts */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              মেনু লিংকসমূহ
            </h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {menuItems.map((item) => (
                <a
                  key={item.id}
                  href={item.link}
                  className="text-slate-400 hover:text-white hover:translate-x-1 transition duration-150 flex items-center gap-1.5 py-1"
                >
                  <ArrowRight className="w-3 h-3 text-blue-500" />
                  <span>{item.name}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Col 3: Social & Contact */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              সোশ্যাল মিডিয়া ও সংযোগ
            </h4>
            <div className="flex flex-wrap items-center gap-2.5">
              {settings.facebook_url && (
                <a
                  href={settings.facebook_url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-slate-900 text-slate-300 hover:text-white hover:bg-blue-600 transition"
                  aria-label="Facebook"
                  title="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {settings.twitter_url && (
                <a
                  href={settings.twitter_url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-slate-900 text-slate-300 hover:text-white hover:bg-sky-500 transition"
                  aria-label="Twitter"
                  title="Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {settings.linkedin_url && (
                <a
                  href={settings.linkedin_url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-slate-900 text-slate-300 hover:text-white hover:bg-blue-700 transition"
                  aria-label="LinkedIn"
                  title="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {settings.youtube_url && (
                <a
                  href={settings.youtube_url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-slate-900 text-slate-300 hover:text-white hover:bg-red-600 transition"
                  aria-label="YouTube"
                  title="YouTube"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              )}
              {settings.instagram_url && (
                <a
                  href={settings.instagram_url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-slate-900 text-slate-300 hover:text-white hover:bg-pink-600 transition"
                  aria-label="Instagram"
                  title="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {settings.whatsapp_url && (
                <a
                  href={settings.whatsapp_url.startsWith('http') ? settings.whatsapp_url : `https://wa.me/${settings.whatsapp_url.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-slate-900 text-slate-300 hover:text-white hover:bg-emerald-600 transition"
                  aria-label="WhatsApp"
                  title="WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              )}
              {settings.telegram_url && (
                <a
                  href={settings.telegram_url.startsWith('http') ? settings.telegram_url : `https://t.me/${settings.telegram_url.replace('@', '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-slate-900 text-slate-300 hover:text-white hover:bg-sky-600 transition"
                  aria-label="Telegram"
                  title="Telegram"
                >
                  <Send className="w-4 h-4" />
                </a>
              )}
              {settings.github_url && (
                <a
                  href={settings.github_url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 transition"
                  aria-label="GitHub"
                  title="GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
            </div>
            
            <div className="text-xs text-slate-500 space-y-1">
              {settings.contact_email && <p>ইমেইল: {settings.contact_email}</p>}
              {settings.contact_phone && <p>ফোন: {settings.contact_phone}</p>}
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>{settings.footer_text || `© ২০২৬ ${settings.site_title || 'প্রবর্তন ডিজিটাল'}। সর্বস্বত্ব সংরক্ষিত।`}</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>{settings.footer_tagline || 'গুগল শিট ও জেমিনি এআই আর্কিটেকচার'}</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
