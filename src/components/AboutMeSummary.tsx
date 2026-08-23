import React from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import { SheetSettings } from '../types';
import { GoogleProfileAvatar } from './GoogleProfileAvatar';

interface AboutMeSummaryProps {
  settings: SheetSettings;
  primaryColor?: string;
}

export const AboutMeSummary: React.FC<AboutMeSummaryProps> = ({ settings, primaryColor = '#1d4ed8' }) => {
  const avatarUrl = settings.avatar_icon_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80';
  const bio = settings.about_me_summary || "আমি একজন পেশাদার ওয়েব ডেভেলপার এবং গুগল ওয়ার্কস্পেস অটোমেশন বিশেষজ্ঞ। আধুনিক ও ডায়নামিক ওয়েবসাইট তৈরি এবং গুগল শিটকে ডাটাবেস হিসেবে ব্যবহার করে বিজনেস অটোমেশনে সাহায্য করাই আমার লক্ষ্য।";
  const designation = settings.about_me_designation || "প্রতিষ্ঠাতা ও লিড সলিউশন আর্কিটেক্ট";

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-white to-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm relative overflow-hidden">
          
          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl -z-0 pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 sm:gap-10">
            
            {/* 1. Round Profile Avatar with Google RGB Ring Badge */}
            <div className="relative shrink-0 flex flex-col items-center">
              <GoogleProfileAvatar
                src={avatarUrl}
                alt={settings.site_title}
                size="xl"
                showBadge={true}
              />
            </div>

            {/* 2. Profile Info & Summary */}
            <div className="flex-1 text-center md:text-left space-y-3">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">
                  আমার সম্পর্কে সংক্ষেপে
                </span>
                <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  ভেরিফাইড প্রোফাইল
                </span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                  {settings.site_title}
                </h3>
                <p className="text-sm font-semibold text-blue-700 mt-0.5">
                  {designation}
                </p>
              </div>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-3xl">
                {bio}
              </p>

              {/* Contact mini badges */}
              <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-medium text-slate-600">
                {settings.contact_email && (
                  <a href={`mailto:${settings.contact_email}`} className="flex items-center gap-1.5 hover:text-blue-700 transition">
                    <Mail className="w-3.5 h-3.5 text-blue-600" />
                    <span>{settings.contact_email}</span>
                  </a>
                )}
                {settings.contact_phone && (
                  <a href={`tel:${settings.contact_phone}`} className="flex items-center gap-1.5 hover:text-blue-700 transition">
                    <Phone className="w-3.5 h-3.5 text-blue-600" />
                    <span>{settings.contact_phone}</span>
                  </a>
                )}
                {settings.contact_address && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                    <span>{settings.contact_address}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Direct Action Button */}
            <div className="shrink-0 flex flex-col sm:flex-row md:flex-col gap-2.5 w-full md:w-auto">
              <a
                href="#contact"
                style={{ backgroundColor: primaryColor }}
                className="px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold text-white shadow-sm hover:opacity-90 transition text-center flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>যোগাযোগ করুন</span>
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
