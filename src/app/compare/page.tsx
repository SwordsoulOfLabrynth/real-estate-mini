'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Property, Facility } from '@/types';
import { fetchProperties, fetchFacilities } from '@/lib/data/store';
import { formatMMK, formatSqftPrice, calculateDistance, formatDistance } from '@/lib/geo';
import { Header } from '@/components/layout/Header';
import { useComparison } from '@/lib/store/user-preferences';
import {
  Scale,
  X,
  ArrowRight,
  ShieldCheck,
  Plus
} from 'lucide-react';

export default function ComparePage() {
  const { compareList, removeFromCompare, clearComparison } = useComparison();
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [allFacilities, setAllFacilities] = useState<Facility[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [props, facs] = await Promise.all([
        fetchProperties(),
        fetchFacilities()
      ]);
      setAllProperties(props);
      setAllFacilities(facs);
      setIsLoading(false);
    }
    load();
  }, []);

  const comparedProperties = allProperties.filter((p) => compareList.includes(p.id));

  // Compute nearest hospital and school for each compared property
  const getNearestFacilityDistance = (prop: Property, type: 'hospital' | 'school' | 'market') => {
    const facilitiesOfType = allFacilities.filter((f) => f.type === type);
    if (facilitiesOfType.length === 0) return 'N/A';

    const distances = facilitiesOfType.map((f) =>
      calculateDistance(prop.latitude, prop.longitude, f.latitude, f.longitude)
    );
    const min = Math.min(...distances);
    return formatDistance(min);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 space-y-6">
        {/* Title & Clear Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-sky-600" />
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                Property Comparison Matrix
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Compare spatial specifications, pricing metrics, and amenity accessibility side by side.
            </p>
          </div>

          {comparedProperties.length > 0 && (
            <button
              onClick={clearComparison}
              className="text-xs text-rose-600 hover:text-rose-800 font-semibold self-start sm:self-auto"
            >
              Clear All ({comparedProperties.length})
            </button>
          )}
        </div>

        {/* Empty State */}
        {comparedProperties.length === 0 && !isLoading && (
          <div className="bg-white rounded-lg border border-slate-200 p-12 text-center max-w-md mx-auto space-y-3">
            <Scale className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">
              No Properties Selected for Comparison
            </h3>
            <p className="text-xs text-slate-500">
              Explore the map and click the comparison icon on any property to compare factual differences.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors mt-2"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Browse Intelligence Map</span>
            </Link>
          </div>
        )}

        {/* Comparison Table */}
        {comparedProperties.length > 0 && (
          <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 divide-y divide-slate-200">
              {/* Table Header: Property Cards */}
              <thead className="bg-slate-50/70">
                <tr>
                  <th className="p-4 w-44 font-bold text-slate-400 uppercase tracking-wider text-[11px]">
                    Attribute
                  </th>
                  {comparedProperties.map((prop) => (
                    <th key={prop.id} className="p-4 min-w-[220px] max-w-[280px]">
                      <div className="relative rounded-md overflow-hidden bg-slate-100 h-28 mb-2">
                        <Image
                          src={prop.images[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80'}
                          alt={prop.title}
                          fill
                          className="object-cover"
                        />
                        <button
                          onClick={() => removeFromCompare(prop.id)}
                          className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-slate-900/80 text-white flex items-center justify-center hover:bg-slate-900 transition-colors"
                          title="Remove from comparison"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="font-bold text-sm text-slate-900 truncate">
                        {prop.title}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        {prop.township}, {prop.city}
                      </div>
                      <Link
                        href={`/properties/${prop.id}`}
                        className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-sky-600 hover:text-sky-800"
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Table Body: Specifications */}
              <tbody className="divide-y divide-slate-100">
                {/* Asking Price */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-4 font-semibold text-slate-900 bg-slate-50/40">
                    Price
                  </td>
                  {comparedProperties.map((prop) => (
                    <td key={prop.id} className="p-4 font-extrabold text-sm text-slate-900">
                      {formatMMK(prop.price, false)}
                    </td>
                  ))}
                </tr>

                {/* Price Per Sqft */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-4 font-semibold text-slate-900 bg-slate-50/40">
                    Price / Sqft
                  </td>
                  {comparedProperties.map((prop) => (
                    <td key={prop.id} className="p-4 font-bold text-sky-700">
                      {formatSqftPrice(prop.price_per_sqft, false)}
                    </td>
                  ))}
                </tr>

                {/* Floor Area */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-4 font-semibold text-slate-900 bg-slate-50/40">
                    Floor Area
                  </td>
                  {comparedProperties.map((prop) => (
                    <td key={prop.id} className="p-4">
                      {prop.area_sqft.toLocaleString()} sqft
                    </td>
                  ))}
                </tr>

                {/* Listing & Property Type */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-4 font-semibold text-slate-900 bg-slate-50/40">
                    Property Type
                  </td>
                  {comparedProperties.map((prop) => (
                    <td key={prop.id} className="p-4 capitalize">
                      {prop.property_type} ({prop.listing_type})
                    </td>
                  ))}
                </tr>

                {/* Bedrooms & Bathrooms */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-4 font-semibold text-slate-900 bg-slate-50/40">
                    Beds & Baths
                  </td>
                  {comparedProperties.map((prop) => (
                    <td key={prop.id} className="p-4">
                      {prop.bedrooms} Beds · {prop.bathrooms} Baths
                    </td>
                  ))}
                </tr>

                {/* Parking */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-4 font-semibold text-slate-900 bg-slate-50/40">
                    Parking Stalls
                  </td>
                  {comparedProperties.map((prop) => (
                    <td key={prop.id} className="p-4">
                      {prop.parking} vehicle{prop.parking !== 1 ? 's' : ''}
                    </td>
                  ))}
                </tr>

                {/* Location Accessibility (Nearest Hospital) */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-4 font-semibold text-slate-900 bg-slate-50/40">
                    Nearest Hospital
                  </td>
                  {comparedProperties.map((prop) => (
                    <td key={prop.id} className="p-4 font-medium">
                      {getNearestFacilityDistance(prop, 'hospital')}
                    </td>
                  ))}
                </tr>

                {/* Nearest School */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-4 font-semibold text-slate-900 bg-slate-50/40">
                    Nearest School
                  </td>
                  {comparedProperties.map((prop) => (
                    <td key={prop.id} className="p-4 font-medium">
                      {getNearestFacilityDistance(prop, 'school')}
                    </td>
                  ))}
                </tr>

                {/* Nearest Market */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-4 font-semibold text-slate-900 bg-slate-50/40">
                    Nearest Market
                  </td>
                  {comparedProperties.map((prop) => (
                    <td key={prop.id} className="p-4 font-medium">
                      {getNearestFacilityDistance(prop, 'market')}
                    </td>
                  ))}
                </tr>

                {/* Title Verification Status */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-4 font-semibold text-slate-900 bg-slate-50/40">
                    Title Status
                  </td>
                  {comparedProperties.map((prop) => (
                    <td key={prop.id} className="p-4">
                      {prop.is_verified ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          Verified
                        </span>
                      ) : (
                        <span className="text-slate-400">Standard Listing</span>
                      )}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
