'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Property } from '@/types';
import { formatMMK, formatSqftPrice } from '@/lib/geo';
import { Bed, Bath, Maximize2, Heart, Scale, X, ArrowRight, ShieldCheck } from 'lucide-react';
import { useFavorites, useComparison } from '@/lib/store/user-preferences';

interface PropertyPreviewProps {
  property: Property;
  onClose: () => void;
  onAnalyzeNeighborhood?: (property: Property) => void;
}

export function PropertyPreview({ property, onClose, onAnalyzeNeighborhood }: PropertyPreviewProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isInCompare, toggleCompare } = useComparison();

  const favorite = isFavorite(property.id);
  const compared = isInCompare(property.id);

  return (
    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 w-80 sm:w-96 bg-white rounded-lg border border-slate-200 shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-200">
      {/* Top Media Bar */}
      <div className="relative h-40 w-full bg-slate-100">
        <Image
          src={property.images[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'}
          alt={property.title}
          fill
          sizes="(max-width: 768px) 320px, 384px"
          className="object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-slate-900/70 text-white flex items-center justify-center hover:bg-slate-900 transition-colors"
          aria-label="Close preview"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Status / Type Tag */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
            property.listing_type === 'sale' ? 'bg-slate-900 text-white' : 'bg-sky-600 text-white'
          }`}>
            For {property.listing_type}
          </span>
          {property.is_verified && (
            <span className="px-1.5 py-0.5 rounded bg-emerald-600/90 text-white text-[10px] font-medium flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              Verified
            </span>
          )}
        </div>

        {/* Price on Image Bottom */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-baseline justify-between text-white">
          <div>
            <div className="text-lg font-extrabold tracking-tight">
              {formatMMK(property.price, false)}
            </div>
          </div>
          <div className="text-xs font-semibold px-2 py-0.5 rounded bg-white/20 backdrop-blur-md">
            {formatSqftPrice(property.price_per_sqft)}
          </div>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-3.5 space-y-3">
        <div>
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            {property.township}, {property.city}
          </div>
          <h3 className="text-sm font-semibold text-slate-900 line-clamp-1 leading-snug">
            {property.title}
          </h3>
        </div>

        {/* Key Spatial Specs */}
        <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-100 text-slate-700 text-xs">
          <div className="flex items-center gap-1.5">
            <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-medium">{property.area_sqft.toLocaleString()}</span>
            <span className="text-slate-400 text-[10px]">sqft</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Bed className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-medium">{property.bedrooms}</span>
            <span className="text-slate-400 text-[10px]">Beds</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Bath className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-medium">{property.bathrooms}</span>
            <span className="text-slate-400 text-[10px]">Baths</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 pt-0.5">
          <Link
            href={`/properties/${property.id}`}
            className="flex-1 py-2 px-3 rounded bg-slate-900 text-white text-xs font-semibold flex items-center justify-center gap-1 hover:bg-slate-800 transition-colors"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          {onAnalyzeNeighborhood && (
            <button
              onClick={() => onAnalyzeNeighborhood(property)}
              className="py-2 px-2.5 rounded bg-sky-50 text-sky-700 border border-sky-200 text-xs font-medium hover:bg-sky-100 transition-colors"
              title="Analyze neighborhood radius"
            >
              Analyze Area
            </button>
          )}

          <button
            onClick={() => toggleCompare(property.id)}
            className={`p-2 rounded border transition-colors ${
              compared
                ? 'bg-sky-600 border-sky-600 text-white'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
            title={compared ? 'Remove from comparison' : 'Compare property'}
          >
            <Scale className="w-4 h-4" />
          </button>

          <button
            onClick={() => toggleFavorite(property.id)}
            className={`p-2 rounded border transition-colors ${
              favorite
                ? 'bg-rose-50 border-rose-200 text-rose-600'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
            title={favorite ? 'Saved to favorites' : 'Save property'}
          >
            <Heart className={`w-4 h-4 ${favorite ? 'fill-rose-600' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
}
