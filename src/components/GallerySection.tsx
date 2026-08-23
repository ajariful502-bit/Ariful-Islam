import React, { useState } from 'react';
import { Eye, X } from 'lucide-react';
import { GalleryItem, SheetSettings } from '../types';
import { formatImageUrl } from '../utils/mediaUtils';

interface GallerySectionProps {
  galleryItems: GalleryItem[];
  settings?: SheetSettings;
  primaryColor?: string;
}

export const GallerySection: React.FC<GallerySectionProps> = ({ galleryItems, settings, primaryColor = '#1d4ed8' }) => {
  const [selectedSection, setSelectedSection] = useState<string>('সব');
  const [activeImage, setActiveImage] = useState<GalleryItem | null>(null);

  const badgeText = settings?.gallery_section_badge || 'ভিজ্যুয়াল শোকেস';
  const titleText = settings?.gallery_section_title || 'প্রকল্প ও ফটো গ্যালারি';
  const subtitleText = settings?.gallery_section_subtitle || 'আপনার গুগল শিটের Gallery ট্যাব থেকে রিয়েল-টাইমে লোড হওয়া চিত্রশালা।';

  const sections = ['সব', ...Array.from(new Set(galleryItems.map(g => g.image_section || (g as any)['image section'] || 'গ্যালারি')))];

  const filteredGallery = selectedSection === 'সব'
    ? galleryItems
    : galleryItems.filter(g => (g.image_section || (g as any)['image section'] || 'গ্যালারি') === selectedSection);

  return (
    <section id="gallery" className="py-16 sm:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10 sm:mb-14">
          <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-800 border border-blue-200">
            {badgeText}
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            {titleText}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            {subtitleText}
          </p>
        </div>

        {/* Section Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {sections.map((sec) => (
            <button
              key={sec}
              onClick={() => setSelectedSection(sec)}
              style={sec === selectedSection ? { backgroundColor: primaryColor, color: '#fff' } : {}}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition duration-150 cursor-pointer ${
                sec === selectedSection
                  ? 'shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {sec}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGallery.map((item, idx) => {
            const rawUrl = item.image_uploaded || (item as any)['image uploaded'] || (item as any).image_url;
            const imgUrl = formatImageUrl(rawUrl);
            const imgTitle = item.image_title || (item as any)['image title'] || 'গ্যালারি ছবি';
            const imgSec = item.image_section || (item as any)['image section'] || 'সাধারণ';

            return (
              <div
                key={idx}
                onClick={() => setActiveImage(item)}
                className="group relative rounded-2xl overflow-hidden shadow-xs border border-slate-200 aspect-[4/3] cursor-pointer bg-slate-100 hover:shadow-xl hover:-translate-y-1 transition duration-300"
              >
                <img
                  src={imgUrl}
                  alt={imgTitle}
                  className="w-full h-full object-cover group-hover:scale-108 transition duration-700 ease-out"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&auto=format&fit=crop&q=80';
                  }}
                />
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6 text-white">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-300 bg-blue-900/60 px-2 py-0.5 rounded border border-blue-400/30">{imgSec}</span>
                    <Eye className="w-5 h-5 text-white/80" />
                  </div>
                  <h4 className="font-bold text-base sm:text-lg leading-snug">{imgTitle}</h4>
                  {item.description && (
                    <p className="text-xs text-slate-300 line-clamp-2 mt-1">{item.description}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Fullscreen Image Preview Modal */}
      {activeImage && (
        <div
          onClick={() => setActiveImage(null)}
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer animate-in fade-in duration-200"
        >
          <div className="max-w-4xl w-full relative bg-slate-900 rounded-2xl p-4 border border-slate-800" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setActiveImage(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-white hover:bg-slate-700 transition cursor-pointer"
              aria-label="বন্ধ করুন"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={formatImageUrl(activeImage.image_uploaded || (activeImage as any)['image uploaded'] || (activeImage as any).image_url)}
              alt={activeImage.image_title || (activeImage as any)['image title']}
              className="max-h-[70vh] w-auto mx-auto rounded-xl object-contain shadow-2xl"
            />
            <div className="text-center mt-4 text-white">
              <h4 className="font-bold text-lg sm:text-xl">{activeImage.image_title || (activeImage as any)['image title']}</h4>
              {activeImage.description && (
                <p className="text-sm text-slate-300 mt-1 max-w-2xl mx-auto">{activeImage.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
