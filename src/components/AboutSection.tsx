import React from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { AboutItem, SheetSettings } from '../types';
import { formatImageUrl } from '../utils/mediaUtils';

interface AboutSectionProps {
  aboutItem?: AboutItem;
  settings?: SheetSettings;
  primaryColor?: string;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ aboutItem, settings, primaryColor = '#1d4ed8' }) => {
  const item: AboutItem = aboutItem || {
    name: "প্রবর্তন ডিজিটাল ল্যাবস",
    title: "আধুনিক ডিজিটাল আর্কিটেকচার ও বিজনেস অটোমেশন",
    badge: "আমাদের পরিচিতি",
    image_url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&auto=format&fit=crop&q=80",
    description: "আমরা উদ্ভাবনী হেডলেস প্রযুক্তি সরবরাহ করি যেখানে প্রতিষ্ঠানগুলো তাদের সম্পূর্ণ ওয়েবসাইট কন্টেন্ট সরাসরি গুগল শিটের মাধ্যমে অতি সহজে নিয়ন্ত্রণ করতে পারে। কোনো অতিরিক্ত হোস্টিং বা ডেটাবেস ফি ছাড়াই সর্বোচ্চ গতি ও নিরাপত্তার নিশ্চয়তা।",
    highlight1: "১০০% গুগল শিট ইন্টিগ্রেশন ও লাইভ সিঙ্ক",
    highlight2: "স্মার্ট এআই চ্যাটবট অ্যাসিস্ট্যান্টের সার্বক্ষণিক সহায়তা",
    highlight3: "১৬:৯ রেস্পন্সিভ ইমেজ স্লাইডার ও মডার্ন ইউজার ইন্টারফেস"
  };

  const badgeText = settings?.about_section_badge || item.badge || 'আমাদের পরিচিতি';
  const nameText = settings?.about_section_title || item.name || 'আমাদের সম্পর্কে';
  const subTitleText = settings?.about_section_subtitle || item.title || 'আধুনিক ডিজিটাল আর্কিটেকচার ও অটোমেশন';

  const highlights = [item.highlight1, item.highlight2, item.highlight3].filter(Boolean) as string[];

  return (
    <section id="about" className="py-16 sm:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          {/* Left Column: Text & Highlights */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-block">
              <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-800 border border-blue-200">
                {badgeText}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {nameText}
            </h2>

            {subTitleText && (
              <h3 className="text-lg font-semibold text-blue-700">
                {subTitleText}
              </h3>
            )}

            <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
              {item.description}
            </p>

            {/* Highlights bullet points */}
            {highlights.length > 0 && (
              <div className="space-y-3 pt-2">
                {highlights.map((h, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="p-1 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 mt-0.5 shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span className="text-slate-800 font-medium text-sm sm:text-base">{h}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-4 flex items-center gap-4">
              <a
                href="#products"
                style={{ backgroundColor: primaryColor }}
                className="px-6 py-3 rounded-xl text-sm font-bold text-white shadow-md hover:opacity-90 transition inline-flex items-center gap-2"
              >
                <span>আমাদের কার্যক্রম দেখুন</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#contact"
                className="px-6 py-3 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
              >
                যোগাযোগ করুন
              </a>
            </div>
          </div>

          {/* Right Column: Visual Frame */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200 aspect-[4/3] group bg-slate-100">
              <img
                src={formatImageUrl(item.image_url)}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&auto=format&fit=crop&q=80';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-300">প্রবর্তন ডিজিটাল প্ল্যাটফর্ম</span>
                <p className="font-bold text-sm sm:text-base mt-0.5 drop-shadow-sm">গুগল শিট দ্বারা পরিচালিত আধুনিক হেডলেস ওয়েব</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
