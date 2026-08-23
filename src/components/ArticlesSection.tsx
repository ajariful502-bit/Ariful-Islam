import React, { useState } from 'react';
import { Play, Copy, Check, Video, ArrowRight, X, Calendar, Clock } from 'lucide-react';
import { ArticleItem, SheetSettings } from '../types';
import { formatImageUrl, formatYoutubeEmbedUrl } from '../utils/mediaUtils';

interface ArticlesSectionProps {
  articles: ArticleItem[];
  settings?: SheetSettings;
  primaryColor?: string;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const ArticlesSection: React.FC<ArticlesSectionProps> = ({ articles, settings, primaryColor = '#1d4ed8', onShowToast }) => {
  const [activeVideo, setActiveVideo] = useState<{ url: string; title: string } | null>(null);
  const [copiedId, setCopiedId] = useState<string | number | null>(null);

  const badgeText = settings?.articles_section_badge || 'খবর ও ব্লগ পোস্ট';
  const titleText = settings?.articles_section_title || 'সর্বশেষ আপডেট ও ভিডিও';
  const subtitleText = settings?.articles_section_subtitle || 'আপনার গুগল শিটের Article and update ট্যাব থেকে সরাসরি পরিচালিত।';

  // Helper to extract YouTube video ID
  const getYouTubeId = (url?: string) => {
    if (!url) return null;
    const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^"&?\/\s]{11})/i;
    const match = url.match(regExp);
    return match && match[1] ? match[1] : (/^[a-zA-Z0-9_-]{11}$/.test(url.trim()) ? url.trim() : null);
  };

  const handleCopyLink = (title: string, id: string | number) => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedId(id);
    onShowToast(`'${title}' আর্টিকেলের লিংক কপি হয়েছে!`, 'success');
    setTimeout(() => setCopiedId(null), 3000);
  };

  return (
    <section id="articles" className="py-16 sm:py-24 bg-slate-50/70 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
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

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((art, idx) => {
            const videoUrl = art.youtube_video_url || (art as any).video_url;
            const ytId = getYouTubeId(videoUrl);
            const artId = art.id || idx;
            const formattedImg = formatImageUrl(art.image_url);

            return (
              <article
                key={artId}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col group"
              >
                {/* Media (YouTube thumbnail or Image) */}
                <div className="relative aspect-video bg-slate-900 overflow-hidden">
                  {ytId ? (
                    <div
                      onClick={() => setActiveVideo({ url: ytId, title: art.title })}
                      className="relative w-full h-full cursor-pointer group/video"
                    >
                      <img
                        src={`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`}
                        alt={art.title}
                        className="w-full h-full object-cover opacity-85 group-hover/video:opacity-100 group-hover/video:scale-105 transition duration-500"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = formattedImg || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80';
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-13 h-13 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg transform group-hover/video:scale-110 transition">
                          <Play className="w-6 h-6 fill-current ml-0.5" />
                        </div>
                      </div>
                      <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold bg-red-600 text-white shadow-xs flex items-center gap-1">
                        <Video className="w-3.5 h-3.5" />
                        <span>ইউটিউব ভিডিও</span>
                      </span>
                    </div>
                  ) : (
                    <>
                      <img
                        src={formattedImg}
                        alt={art.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80';
                        }}
                      />
                      <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold bg-white/95 text-slate-800 backdrop-blur-xs shadow-xs border border-slate-200">
                        {art.category || 'ব্লগ'}
                      </span>
                    </>
                  )}
                </div>

                {/* Article Content */}
                <div className="p-6 flex flex-col flex-1 space-y-3">
                  
                  {/* Meta info */}
                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium pb-1 border-b border-slate-100">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {art.date || 'সাম্প্রতিক'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {art.read_time || art.author || '৪ মিনিট পঠন'}
                    </span>
                  </div>

                  <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-700 transition leading-snug">
                    {art.title}
                  </h3>

                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed line-clamp-3 flex-1">
                    {art.description || art.content}
                  </p>

                  {/* Actions */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm mt-auto">
                    <button
                      onClick={() => handleCopyLink(art.title, artId)}
                      className="text-slate-500 hover:text-blue-700 font-semibold flex items-center gap-1 transition cursor-pointer"
                    >
                      {copiedId === artId ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-600" />
                          <span className="text-emerald-600 font-bold">কপি হয়েছে!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>লিংক কপি</span>
                        </>
                      )}
                    </button>

                    <a
                      href="#contact"
                      className="text-blue-700 hover:text-blue-800 font-bold flex items-center gap-1 transition"
                    >
                      <span>বিস্তারিত</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>

                </div>

              </article>
            );
          })}
        </div>

      </div>

      {/* YouTube Video Embed Modal */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-800 text-white">
              <h4 className="font-bold truncate text-base">{activeVideo.title}</h4>
              <button
                onClick={() => setActiveVideo(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="aspect-video w-full bg-black">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${activeVideo.url}?autoplay=1`}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
