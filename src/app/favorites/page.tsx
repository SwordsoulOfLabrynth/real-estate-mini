'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Property } from '@/types';
import { fetchProperties } from '@/lib/data/store';
import { formatMMK, formatSqftPrice } from '@/lib/geo';
import { Header } from '@/components/layout/Header';
import { useFavorites, useComparison } from '@/lib/store/user-preferences';
import {
  Heart,
  Scale,
  Maximize2,
  Bed,
  Bath,
  MapPin,
  ArrowRight,
  Trash2,
  Compass
} from 'lucide-react';

export default function FavoritesPage() {
  const { favorites, toggleFavorite } = useFavorites();
  const { isInCompare, toggleCompare } = useComparison();
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const props = await fetchProperties();
      setAllProperties(props);
      setIsLoading(false);
    }
    load();
  }, []);

  const favoriteProperties = allProperties.filter((p) => favorites.includes(p.id));

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 space-y-6">
        {/* Title */}
        <div className="border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-600 fill-rose-600" />
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Saved Favorite Properties ({favoriteProperties.length})
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Access your saved listings for quick reference and comparison.
          </p>
        </div>

        {/* Empty State */}
        {favoriteProperties.length === 0 && !isLoading && (
          <div className="bg-white rounded-lg border border-slate-200 p-12 text-center max-w-md mx-auto space-y-3">
            <Heart className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">
              No Saved Properties Yet
            </h3>
            <p className="text-xs text-slate-500">
              Click the heart icon on any property map marker or details card to bookmark it here.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors mt-2"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Explore Map Listings</span>
            </Link>
          </div>
        )}

        {/* Properties Grid */}
        {favoriteProperties.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {favoriteProperties.map((prop) => {
              const compared = isInCompare(prop.id);
              return (
                <div
                  key={prop.id}
                  className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-xs hover:border-slate-300 transition-all flex flex-col"
                >
                  {/* Photo with Overlay */}
                  <div className="relative h-48 w-full bg-slate-100">
                    <Image
                      src={prop.images[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'}
                      alt={prop.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        prop.listing_type === 'sale' ? 'bg-slate-900 text-white' : 'bg-sky-600 text-white'
                      }`}>
                        For {prop.listing_type}
                      </span>
                    </div>
                    <button
                      onClick={() => toggleFavorite(prop.id)}
                      className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white/90 text-rose-600 hover:bg-white transition-colors"
                      title="Remove from favorites"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-baseline justify-between">
                        <span className="text-base font-extrabold text-slate-900">
                          {formatMMK(prop.price, false)}
                        </span>
                        <span className="text-xs font-semibold text-sky-700">
                          {formatSqftPrice(prop.price_per_sqft)}
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold text-slate-900 line-clamp-1 mt-1">
                        {prop.title}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate">{prop.township}, {prop.city}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 py-2 border-y border-slate-100 text-xs text-slate-600">
                      <span className="flex items-center gap-1">
                        <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
                        {prop.area_sqft} sqft
                      </span>
                      <span className="flex items-center gap-1">
                        <Bed className="w-3.5 h-3.5 text-slate-400" />
                        {prop.bedrooms} Beds
                      </span>
                      <span className="flex items-center gap-1">
                        <Bath className="w-3.5 h-3.5 text-slate-400" />
                        {prop.bathrooms} Baths
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-1">
                      <Link
                        href={`/properties/${prop.id}`}
                        className="flex-1 py-1.5 px-3 rounded bg-slate-900 text-white text-xs font-semibold flex items-center justify-center gap-1 hover:bg-slate-800 transition-colors"
                      >
                        <span>Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>

                      <button
                        onClick={() => toggleCompare(prop.id)}
                        className={`p-1.5 rounded border transition-colors ${
                          compared
                            ? 'bg-sky-600 border-sky-600 text-white'
                            : 'border-slate-300 text-slate-600 hover:bg-slate-50'
                        }`}
                        title={compared ? 'In comparison matrix' : 'Add to comparison'}
                      >
                        <Scale className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
