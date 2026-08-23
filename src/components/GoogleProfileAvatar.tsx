import React from 'react';
import { formatImageUrl } from '../utils/mediaUtils';

interface GoogleProfileAvatarProps {
  src?: string;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  showBadge?: boolean;
  animateRing?: boolean;
}

export const GoogleProfileAvatar: React.FC<GoogleProfileAvatarProps> = ({
  src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  alt = 'প্রোফাইল ছবি',
  size = 'md',
  className = '',
  showBadge = false,
  animateRing = true
}) => {
  const sizeClasses = {
    xs: 'w-8 h-8',
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
    xl: 'w-28 h-28 sm:w-36 sm:h-36',
    '2xl': 'w-36 h-36 sm:w-44 sm:h-44'
  };

  const ringThickness = {
    xs: '-inset-[2px]',
    sm: '-inset-[2.5px]',
    md: '-inset-[3px]',
    lg: '-inset-[3.5px]',
    xl: '-inset-[4px]',
    '2xl': '-inset-[5px]'
  };

  const innerGapClasses = {
    xs: 'p-[1.5px]',
    sm: 'p-[2px]',
    md: 'p-[2.5px]',
    lg: 'p-[3px]',
    xl: 'p-[3.5px]',
    '2xl': 'p-[4.5px]'
  };

  const resolvedSrc = formatImageUrl(src);

  // Google 4-Color Seamless Rotating Conic Gradient
  const googleGradient = 'conic-gradient(from 0deg, #4285F4 0deg, #EA4335 90deg, #FBBC05 180deg, #34A853 270deg, #4285F4 360deg)';

  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${sizeClasses[size]} ${className}`}>
      
      {/* 1. Subtle Ambient Glow (Google Colors Glow Effect) */}
      {animateRing && (
        <div
          className={`absolute ${ringThickness[size]} rounded-full blur-[3px] opacity-50 animate-google-color-spin pointer-events-none -z-0`}
          style={{ background: googleGradient }}
        />
      )}

      {/* 2. Sharp Google 4-Color Ring (Rotates smoothly in circular path around the static photo) */}
      <div
        className={`absolute ${ringThickness[size]} rounded-full ${
          animateRing ? 'animate-google-color-spin' : ''
        } pointer-events-none`}
        style={{ background: googleGradient }}
      />

      {/* 3. Static Inner Mask with White Background (Guarantees image stays 100% still and sharp without rotation) */}
      <div className={`relative z-10 w-full h-full rounded-full ${innerGapClasses[size]} bg-white shadow-xs flex items-center justify-center overflow-hidden`}>
        <img
          src={resolvedSrc}
          alt={alt}
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80';
          }}
          className="w-full h-full rounded-full object-cover shrink-0 select-none block"
          loading="lazy"
        />
      </div>

      {/* 4. Active/Online Verified Indicator Badge */}
      {showBadge && (
        <span className="absolute bottom-0 right-0 z-20 flex h-3.5 w-3.5 sm:h-4 sm:w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 sm:h-4 sm:w-4 bg-emerald-500 border-2 border-white shadow-xs"></span>
        </span>
      )}
    </div>
  );
};
