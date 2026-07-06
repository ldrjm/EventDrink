import React, { useState, useEffect } from 'react';
import { Beer, Wine, GlassWater, Sparkles, Receipt } from 'lucide-react';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  category?: 'beers' | 'wines' | 'spirits' | 'non_alcoholic';
  isPastOrder?: boolean;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  className = '',
  category,
  isPastOrder = false,
  ...props
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Reset states if src changes
  useEffect(() => {
    setLoading(true);
    setError(false);
  }, [src]);

  const getFallbackIcon = () => {
    if (isPastOrder) {
      return <Receipt className="w-8 h-8 text-neutral-400" />;
    }

    switch (category) {
      case 'beers':
        return <Beer className="w-8 h-8 text-[#fe9d00] animate-pulse" />;
      case 'wines':
        return <Wine className="w-8 h-8 text-red-400 animate-pulse" />;
      case 'spirits':
        return <Sparkles className="w-8 h-8 text-amber-300 animate-pulse" />;
      case 'non_alcoholic':
        return <GlassWater className="w-8 h-8 text-cyan-400 animate-pulse" />;
      default:
        return <GlassWater className="w-8 h-8 text-neutral-400" />;
    }
  };

  const getGradientBackground = () => {
    if (isPastOrder) {
      return 'from-neutral-900 to-neutral-950 border border-neutral-800';
    }

    switch (category) {
      case 'beers':
        return 'from-amber-950/40 via-neutral-950 to-neutral-950 border border-amber-500/20';
      case 'wines':
        return 'from-red-950/40 via-neutral-950 to-neutral-950 border border-red-500/20';
      case 'spirits':
        return 'from-yellow-950/40 via-neutral-950 to-neutral-950 border border-yellow-500/20';
      case 'non_alcoholic':
        return 'from-cyan-950/40 via-neutral-950 to-neutral-950 border border-cyan-500/20';
      default:
        return 'from-neutral-900 to-neutral-950 border border-neutral-900';
    }
  };

  return (
    <div className={`relative overflow-hidden flex items-center justify-center bg-neutral-950 ${className}`}>
      {/* Loading Skeleton */}
      {loading && (
        <div className="absolute inset-0 bg-neutral-900/80 animate-pulse flex items-center justify-center">
          <div className="w-6 h-6 rounded-full border-2 border-neutral-800 border-t-amber-500 animate-spin" />
        </div>
      )}

      {/* Fallback View */}
      {error ? (
        <div className={`w-full h-full flex flex-col items-center justify-center bg-gradient-to-br ${getGradientBackground()} p-4 text-center transition-all duration-300`}>
          <div className="p-2 bg-neutral-900/60 rounded-full mb-1.5 border border-neutral-800">
            {getFallbackIcon()}
          </div>
          <span className="text-[9px] font-mono text-neutral-400 font-medium truncate max-w-[95%] uppercase tracking-wider block">
            {alt || 'Drink'}
          </span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          className={`${className} transition-opacity duration-300 ${loading ? 'opacity-0 absolute' : 'opacity-100'}`}
          onLoad={() => setLoading(false)}
          onError={() => {
            setLoading(false);
            setError(true);
          }}
          referrerPolicy="no-referrer"
          {...props}
        />
      )}
    </div>
  );
};
