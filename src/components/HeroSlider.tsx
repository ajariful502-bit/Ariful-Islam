import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles, Pause, Play } from 'lucide-react';
import { SliderItem } from '../types';
import { formatImageUrl } from '../utils/mediaUtils';

interface HeroSliderProps {
  sliders: SliderItem[];
  primaryColor?: string;
  onOpenAdmin?: () => void;
}

export const HeroSlider: React.FC<HeroSliderProps> = ({ sliders, primaryColor = '#1d4ed8' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const totalSlides = sliders && sliders.length > 0 ? sliders.length : 1;

  // Auto-play effect
  useEffect(() => {
    if (!isAutoPlaying || totalSlides <= 1) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides);
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, isAutoPlaying, totalSlides]);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalSlides) % totalSlides);
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides);
  };

  const currentSlide = sliders && sliders.length > 0 ? sliders[currentIndex] : {
    id: 'default',
    image_url: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1600&auto=format&fit=crop&q=80',
    badge: 'ডিজিটাল সলিউশন',
    title: 'গুগল শিট দিয়ে ওয়েবসাইট পরিচালনার সহজ সমাধান',
    subtitle: 'কোনো জটিল সিএমএস ছাড়াই গুগল স্প্রেডশিট থেকে সব কন্টেন্ট ও ছবি পরিচালনা করুন।',
    button_text: 'আমাদের সেবা দেখুন',
    button_link: '#products'
  };

  return (
    <section id="hero" className="w-full bg-slate-900 py-4 sm:py-6 px-2 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* 16:9 Slider Container */}
        <div 
          className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl bg-slate-950 aspect-[16/9] min-h-[320px] max-h-[640px] group"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {/* Background Images with smooth transitions */}
          {sliders.map((slide, idx) => (
            <div
              key={slide.id || idx}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                idx === currentIndex ? 'opacity-100 z-10 scale-100' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <img
                src={formatImageUrl(slide.image_url)}
                alt={slide.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1600&auto=format&fit=crop&q=80';
                }}
              />
              {/* Refined gradient overlay for readability */}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />
            </div>
          ))}

          {/* Slide Text Content */}
          <div className="relative z-20 h-full w-full flex items-center p-6 sm:p-10 md:p-14 lg:p-16">
            <div key={currentIndex} className="max-w-2xl text-white space-y-3 sm:space-y-4 md:space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
              
              {/* Badge */}
              {currentSlide.badge && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold bg-blue-600/30 text-blue-200 border border-blue-400/40 backdrop-blur-md">
                  <Sparkles className="w-3.5 h-3.5 text-blue-300 animate-pulse" />
                  <span>{currentSlide.badge}</span>
                </div>
              )}

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight text-white drop-shadow-md">
                {currentSlide.title}
              </h1>

              {/* Subtitle */}
              <p className="text-xs sm:text-sm md:text-base lg:text-lg text-slate-200 leading-relaxed line-clamp-3 sm:line-clamp-none max-w-xl drop-shadow-sm">
                {currentSlide.subtitle}
              </p>

              {/* Action Button */}
              <div className="pt-2 sm:pt-4 flex flex-wrap items-center gap-3">
                <a
                  href={currentSlide.button_link || '#products'}
                  style={{ backgroundColor: primaryColor }}
                  className="px-5 py-2.5 sm:px-7 sm:py-3.5 rounded-xl text-xs sm:text-sm font-bold text-white shadow-lg hover:opacity-90 transition transform hover:-translate-y-0.5 inline-flex items-center gap-2"
                >
                  <span>{currentSlide.button_text || 'পণ্য ও সেবা দেখুন'}</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <a
                  href="#contact"
                  className="hidden sm:inline-flex px-5 py-2.5 sm:px-6 sm:py-3.5 rounded-xl text-xs sm:text-sm font-bold text-slate-200 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 backdrop-blur-sm transition"
                >
                  যোগাযোগ করুন
                </a>
              </div>

            </div>
          </div>

          {/* Navigation Prev / Next Arrows */}
          {totalSlides > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-3 rounded-full bg-slate-950/60 hover:bg-slate-950/90 text-white backdrop-blur-md border border-white/10 shadow-lg opacity-80 group-hover:opacity-100 transition transform hover:scale-110 active:scale-95 cursor-pointer"
                aria-label="পূর্ববর্তী স্লাইড"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              <button
                onClick={handleNext}
                className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-3 rounded-full bg-slate-950/60 hover:bg-slate-950/90 text-white backdrop-blur-md border border-white/10 shadow-lg opacity-80 group-hover:opacity-100 transition transform hover:scale-110 active:scale-95 cursor-pointer"
                aria-label="পরবর্তী স্লাইড"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </>
          )}

          {/* Bottom Dots & Controls */}
          {totalSlides > 1 && (
            <div className="absolute bottom-3 sm:bottom-6 right-4 sm:right-8 z-30 flex items-center gap-2 bg-slate-950/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
              {sliders.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === currentIndex
                      ? 'w-6 sm:w-8 bg-blue-500'
                      : 'w-2 bg-white/40 hover:bg-white/70'
                  }`}
                  aria-label={`স্লাইড ${idx + 1}`}
                />
              ))}

              <button
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                className="ml-1 text-slate-300 hover:text-white p-0.5 cursor-pointer"
                title={isAutoPlaying ? 'অটো-প্লে থামান' : 'অটো-প্লে চালু করুন'}
              >
                {isAutoPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              </button>
            </div>
          )}

          {/* 16:9 Aspect ratio indicator tag */}
          <div className="absolute top-3 sm:top-4 right-4 sm:right-6 z-30 hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/40 text-slate-300 text-[11px] font-mono backdrop-blur-md border border-white/10">
            <span>১৬:৯ এইচডি স্লাইডার</span>
          </div>

        </div>
      </div>
    </section>
  );
};
