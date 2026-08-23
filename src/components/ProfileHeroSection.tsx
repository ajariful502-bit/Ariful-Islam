import React from 'react';
import { SheetSettings } from '../types';
import { GoogleProfileAvatar } from './GoogleProfileAvatar';
import {
  Mail, Phone, MapPin, CheckCircle,
  Facebook, Twitter, Linkedin, Youtube, Instagram, MessageCircle, Briefcase, Github, Send
} from 'lucide-react';

interface ProfileHeroSectionProps {
  settings: SheetSettings;
  primaryColor?: string;
}

export const ProfileHeroSection: React.FC<ProfileHeroSectionProps> = ({
  settings,
  primaryColor = '#1d4ed8'
}) => {
  const avatarUrl = settings.avatar_icon_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80';
  const name = settings.site_title || 'আরিফুল ইসলাম';
  const designation = settings.about_me_designation || 'ফুলস্ট্যাক ওয়েব ডেভেলপার ও গুগল ওয়ার্কস্পেস অটোমেশন বিশেষজ্ঞ';
  const bio = settings.about_me_summary || 'আমি একজন পেশাদার ওয়েব ডেভেলপার। গুগল স্প্রেডশিটকে ডাটাবেস হিসেবে ব্যবহার করে ডায়নামিক ওয়েবসাইট ও অটোমেশন সলিউশন তৈরিতে বিশেষজ্ঞ।';

  const primaryBtnText = settings.profile_hero_btn_text || 'যোগাযোগ করুন';
  const secondaryBtnText = settings.profile_hero_sec_btn_text || 'পণ্য ও সেবাসমূহ';

  return (
    <section id="profile-hero" className="relative py-12 sm:py-16 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-white overflow-hidden border-b border-slate-800">
      
      {/* Decorative gradient glowing orbs */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Profile Card Container */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl backdrop-blur-md">
          
          <div className="flex flex-col md:flex-row items-center gap-8 lg:gap-12">
            
            {/* 1. Circular Profile Avatar with Animated Google RGB Ring */}
            <div className="flex flex-col items-center shrink-0 space-y-3">
              <GoogleProfileAvatar
                src={avatarUrl}
                alt={name}
                size="2xl"
                showBadge={true}
                animateRing={true}
                className="shadow-2xl"
              />
              
              {/* Google Badge Tag */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-slate-800/90 text-slate-300 border border-slate-700">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>প্রজেক্টের জন্য উন্মুক্ত</span>
              </div>
            </div>

            {/* 2. Profile Details & Bio */}
            <div className="flex-1 text-center md:text-left space-y-4">
              
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                  <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-blue-900/50 text-blue-300 border border-blue-700/60">
                    ব্যক্তিগত প্রোফাইল
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>ভেরিফাইড এক্সপার্ট</span>
                  </span>
                </div>

                {/* Prominent Bengali Name */}
                <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  {name}
                </h2>

                {/* Subtitle / Designation */}
                <p className="text-sm sm:text-base font-semibold text-blue-400">
                  {designation}
                </p>
              </div>

              {/* Short Bio Summary */}
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
                {bio}
              </p>

              {/* Contact Information Chips */}
              <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3 sm:gap-4 text-xs font-medium text-slate-300">
                {settings.contact_email && (
                  <a
                    href={`mailto:${settings.contact_email}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 transition"
                  >
                    <Mail className="w-3.5 h-3.5 text-blue-400" />
                    <span>{settings.contact_email}</span>
                  </a>
                )}
                {settings.contact_phone && (
                  <a
                    href={`tel:${settings.contact_phone}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 transition"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{settings.contact_phone}</span>
                  </a>
                )}
                {settings.contact_address && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-200">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    <span>{settings.contact_address}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons & Socials */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
                
                {/* Primary Action Button: যোগাযোগ */}
                <a
                  href="#contact"
                  style={{ backgroundColor: primaryColor }}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl text-sm font-bold text-white shadow-lg hover:opacity-90 transition transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{primaryBtnText}</span>
                </a>

                {/* Secondary Action Button: পণ্য ও সেবা */}
                <a
                  href="#products"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl text-sm font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition flex items-center justify-center gap-2"
                >
                  <Briefcase className="w-4 h-4 text-blue-400" />
                  <span>{secondaryBtnText}</span>
                </a>

                {/* Social media icons list */}
                <div className="flex flex-wrap items-center gap-2 pt-2 sm:pt-0">
                  {settings.facebook_url && (
                    <a
                      href={settings.facebook_url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-blue-600 transition"
                      aria-label="Facebook"
                      title="Facebook"
                    >
                      <Facebook className="w-4 h-4" />
                    </a>
                  )}
                  {settings.linkedin_url && (
                    <a
                      href={settings.linkedin_url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-blue-700 transition"
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
                      className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-red-600 transition"
                      aria-label="YouTube"
                      title="YouTube"
                    >
                      <Youtube className="w-4 h-4" />
                    </a>
                  )}
                  {settings.twitter_url && (
                    <a
                      href={settings.twitter_url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-sky-500 transition"
                      aria-label="Twitter"
                      title="Twitter"
                    >
                      <Twitter className="w-4 h-4" />
                    </a>
                  )}
                  {settings.instagram_url && (
                    <a
                      href={settings.instagram_url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-pink-600 transition"
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
                      className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-emerald-600 transition"
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
                      className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-sky-600 transition"
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
                      className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
                      aria-label="GitHub"
                      title="GitHub"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
