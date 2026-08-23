import React from 'react';
import { SheetSettings } from '../types';
import { ArrowRight, Sparkles } from 'lucide-react';

interface HeroProps {
  settings: SheetSettings;
}

export const Hero: React.FC<HeroProps> = ({ settings }) => {
  const primaryColor = settings.primary_color || '#2563eb';

  return (
    <section id="hero" className="relative overflow-hidden bg-slate-950 text-white min-h-[580px] lg:min-h-[640px] flex items-center py-20 lg:py-28">
      {/* Background Image from Sheet Settings */}
      {settings.hero_bg_image && (
        <div
          className="absolute inset-0 z-0 bg-cover bg-center transition-all duration-1000 opacity-25"
          style={{ backgroundImage: `url('${settings.hero_bg_image}')` }}
        />
      )}

      {/* Modern Gradient Backdrop */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-transparent z-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-3xl space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/10 text-blue-300 border border-white/15 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Zero-Code Google Sheets CMS</span>
          </div>

          {/* Hero Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            {settings.hero_title || 'Dynamic Digital Experiences Driven by Live Google Sheets'}
          </h1>

          {/* Hero Subtitle */}
          <p className="text-lg sm:text-xl text-slate-300 leading-relaxed max-w-2xl">
            {settings.hero_subtitle || 'Edit text, images, products, posts, and navigation directly inside your spreadsheet with zero code recompilation.'}
          </p>

          {/* Call to Action Buttons */}
          <div className="pt-4 flex flex-wrap items-center gap-4">
            <a
              href={settings.hero_btn_link || '#products'}
              className="px-8 py-4 rounded-xl text-base font-semibold text-white shadow-xl transition transform hover:-translate-y-0.5 inline-flex items-center gap-2.5"
              style={{
                backgroundColor: primaryColor,
                boxShadow: `0 10px 25px -5px ${primaryColor}66`
              }}
            >
              <span>{settings.hero_btn_text || 'Explore Offerings'}</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href="#about"
              className="px-8 py-4 rounded-xl text-base font-semibold text-slate-200 bg-slate-900/80 hover:bg-slate-800/80 border border-slate-700/80 transition"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
