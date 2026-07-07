import React, { useState, useEffect, useMemo } from 'react';
import { getSupabaseStatus } from '../models/SupabaseModel';
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
  const [attempt, setAttempt] = useState(0);

  // Reset states if src changes
  useEffect(() => {
    setLoading(true);
    setError(false);
    setAttempt(0);
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

  // Normalize and optionally rewrite common storage paths to full URLs
  const normalizedSrc = useMemo(() => {
    if (!src) return '';
    let s = String(src).trim();

    // If protocol-relative (//example.com/...), prepend current protocol
    if (s.startsWith('//')) {
      s = window.location.protocol + s;
    }

    // Prefer https when possible
    if (s.startsWith('http://')) {
      s = s.replace(/^http:\/\//i, 'https://');
    }

    // If Supabase storage relative path or bucket/key is used, build a public object URL
    try {
      const supa = getSupabaseStatus();
      const base = supa?.url ? supa.url.replace(/\/$/, '') : '';
      if (base) {
        // Already a storage path starting with /storage or storage/v1/object
        if (s.startsWith('/storage') || s.startsWith('storage/v1') || s.startsWith('storage/')) {
          if (!s.startsWith('/')) s = '/' + s;
          s = base + s;
        } else if (!/^https?:\/\//i.test(s)) {
          // If it's a bucket path like '<bucket>/path/to/file.jpg' or 'bucket/path'
          // map to Supabase public object URL: {supabaseUrl}/storage/v1/object/public/{bucket}/{path}
          const parts = s.split('/').filter(Boolean);
          if (parts.length >= 2) {
            const bucket = parts.shift();
            const key = parts.join('/');
            s = `${base}/storage/v1/object/public/${bucket}/${key}`;
          }
        }
      }
    } catch (e) {
      // silent fallback if status not available
    }

    return s;
  }, [src]);

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
          src={normalizedSrc}
          alt={alt}
          className={`${className} transition-opacity duration-300 ${loading ? 'opacity-0 absolute' : 'opacity-100'}`}
          onLoad={() => setLoading(false)}
          onError={(ev) => {
            // Try a single retry by toggling protocol or removing query params
            console.warn('[SafeImage] failed to load', { src: normalizedSrc, attempt });
            setLoading(false);
            if (attempt === 0) {
              setAttempt(1);
              // attempt repair: strip query params, or try http if https failed
              let candidate = normalizedSrc;
              try {
                const urlObj = new URL(normalizedSrc, window.location.href);
                // remove search params that could expire (e.g., signed URLs)
                urlObj.search = '';
                candidate = urlObj.toString();
                // if still https, try forcing http (last resort)
                if (candidate.startsWith('https://')) {
                  candidate = candidate.replace(/^https:\/\//i, 'http://');
                }
              } catch (e) {
                // ignore
              }

              // set temporary src attribute to retry
              const imgEl = ev.currentTarget as HTMLImageElement;
              if (imgEl && candidate && candidate !== normalizedSrc) {
                imgEl.src = candidate;
                setLoading(true);
                return;
              }
            }

            setError(true);
          }}
          referrerPolicy="no-referrer"
          {...props}
        />
      )}
    </div>
  );
};
