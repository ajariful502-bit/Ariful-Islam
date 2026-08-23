import React, { useState } from 'react';
import { ArrowRight, Tag } from 'lucide-react';
import { ProductItem, SheetSettings } from '../types';
import { formatImageUrl } from '../utils/mediaUtils';

interface ProductsSectionProps {
  products: ProductItem[];
  settings?: SheetSettings;
  primaryColor?: string;
}

export const ProductsSection: React.FC<ProductsSectionProps> = ({ products, settings, primaryColor = '#1d4ed8' }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('সব');

  const badgeText = settings?.products_section_badge || 'আমাদের অফারসমূহ';
  const titleText = settings?.products_section_title || 'পণ্য ও ডিজিটাল সেবাসমূহ';
  const subtitleText = settings?.products_section_subtitle || 'আপনার গুগল শিটের Products ট্যাব থেকে সরাসরি ডাটা প্রদর্শিত হচ্ছে।';

  const categories = ['সব', ...Array.from(new Set(products.map(p => p.category || 'সাধারণ')))];

  const filteredProducts = selectedCategory === 'সব'
    ? products
    : products.filter(p => (p.category || 'সাধারণ') === selectedCategory);

  return (
    <section id="products" className="py-16 sm:py-24 bg-slate-50/70 border-b border-slate-200">
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

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={cat === selectedCategory ? { backgroundColor: primaryColor, color: '#fff' } : {}}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition duration-150 cursor-pointer ${
                cat === selectedCategory
                  ? 'shadow-sm'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col group"
            >
              {/* Product Image */}
              <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                <img
                  src={formatImageUrl(prod.image_url)}
                  alt={prod.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80';
                  }}
                />
                <span className="absolute top-3 right-3 px-2.5 py-1 rounded-lg text-xs font-bold bg-white/95 text-slate-800 shadow-xs border border-slate-200/80 backdrop-blur-xs flex items-center gap-1">
                  <Tag className="w-3 h-3 text-blue-600" />
                  <span>{prod.category}</span>
                </span>
              </div>

              {/* Product Content */}
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-bold text-base sm:text-lg text-slate-900 group-hover:text-blue-700 transition leading-snug mb-2">
                  {prod.name}
                </h3>
                
                <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 mb-5 flex-1">
                  {prod.description}
                </p>

                {/* Price & Action Button */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto">
                  <span className="font-extrabold text-base sm:text-lg text-slate-900">
                    {prod.price}
                  </span>
                  
                  <a
                    href={prod.button_link || '#contact'}
                    style={{ backgroundColor: primaryColor }}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold text-white shadow-xs hover:opacity-90 transition inline-flex items-center gap-1"
                  >
                    <span>{prod.button_text || 'বিস্তারিত'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
