'use client';

import React from 'react';
import { Heart, Scale, Share2 } from 'lucide-react';
import { useFavorites, useComparison } from '@/lib/store/user-preferences';

export function PropertyActionButtons({ propertyId }: { propertyId: string }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isInCompare, toggleCompare } = useComparison();

  const favorite = isFavorite(propertyId);
  const compared = isInCompare(propertyId);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="flex items-center gap-2 pt-2">
      <button
        onClick={() => toggleCompare(propertyId)}
        className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
          compared
            ? 'bg-sky-600 text-white border-sky-600'
            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
        }`}
      >
        <Scale className="w-3.5 h-3.5" />
        <span>{compared ? 'In Comparison' : 'Compare'}</span>
      </button>

      <button
        onClick={() => toggleFavorite(propertyId)}
        className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
          favorite
            ? 'bg-rose-50 text-rose-600 border-rose-200'
            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
        }`}
      >
        <Heart className={`w-3.5 h-3.5 ${favorite ? 'fill-rose-600' : ''}`} />
        <span>{favorite ? 'Saved' : 'Save'}</span>
      </button>

      <button
        onClick={handleShare}
        className="p-1.5 rounded border border-slate-300 text-slate-600 hover:bg-slate-50 transition-colors"
        title="Share property link"
      >
        <Share2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
