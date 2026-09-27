'use client';

import React from 'react';
import { AreaAnalysis } from '@/types';
import { formatMMK, formatSqftPrice, formatDistance } from '@/lib/geo';
import {
  Compass,
  X,
  GraduationCap,
  Hospital,
  ShoppingCart,
  Landmark,
  Bus,
  Trees,
  Info
} from 'lucide-react';

interface NeighborhoodAnalysisPanelProps {
  analysis: AreaAnalysis | null;
  onClose: () => void;
  onRadiusChange: (radius: number) => void;
  propertyName?: string;
}

export function NeighborhoodAnalysisPanel({
  analysis,
  onClose,
  onRadiusChange,
  propertyName
}: NeighborhoodAnalysisPanelProps) {
  if (!analysis) return null;

  return (
    <div className="absolute top-16 right-4 z-20 w-80 sm:w-96 bg-white/98 backdrop-blur-md rounded-lg border border-slate-200 shadow-xl overflow-hidden animate-in fade-in slide-in-from-right-3 duration-200">
      {/* Header */}
      <div className="p-3.5 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-sky-400" />
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-100">
              Neighborhood Intelligence
            </h3>
            {propertyName && (
              <p className="text-[11px] text-slate-400 truncate max-w-[220px]">
                {propertyName}
              </p>
            )}
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded transition-colors"
          aria-label="Close intelligence panel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 space-y-4 max-h-[calc(100vh-14rem)] overflow-y-auto">
        {/* Radius Selector */}
        <div>
          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
            Analysis Perimeter Radius
          </span>
          <div className="grid grid-cols-4 gap-1 bg-slate-100 p-1 rounded-md">
            {[500, 1000, 2000, 5000].map((radius) => {
              const label = radius >= 1000 ? `${radius / 1000} km` : `${radius} m`;
              const isSelected = analysis.radius_meters === radius;
              return (
                <button
                  key={radius}
                  onClick={() => onRadiusChange(radius)}
                  className={`py-1 text-xs font-semibold rounded transition-colors ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Primary Pricing Metrics Grid */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50">
            <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
              Avg Listing Price
            </span>
            <div className="text-sm font-bold text-slate-900 mt-0.5">
              {analysis.avg_price > 0 ? formatMMK(analysis.avg_price, true) : 'N/A'}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              {analysis.property_count} properties surveyed
            </div>
          </div>

          <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50">
            <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
              Avg Price / Sqft
            </span>
            <div className="text-sm font-bold text-sky-700 mt-0.5">
              {analysis.avg_price_per_sqft > 0 ? formatSqftPrice(analysis.avg_price_per_sqft, false) : 'N/A'}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              Range: {formatSqftPrice(analysis.min_price_per_sqft, true)} - {formatSqftPrice(analysis.max_price_per_sqft, true)}
            </div>
          </div>
        </div>

        {/* Breakdown Counts */}
        <div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-600">
          <span>For Sale: <strong className="text-slate-900">{analysis.for_sale_count}</strong></span>
          <span>For Rent: <strong className="text-slate-900">{analysis.for_rent_count}</strong></span>
          <span>Total Density: <strong className="text-slate-900">{analysis.property_count}</strong></span>
        </div>

        {/* Facility Density within radius */}
        <div>
          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Facilities Within {formatDistance(analysis.radius_meters)}
          </span>
          <div className="grid grid-cols-3 gap-2">
            <div className="p-2 rounded border border-slate-200 bg-white flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-blue-600" />
              <div>
                <div className="text-xs font-bold text-slate-900">{analysis.facility_counts.school}</div>
                <div className="text-[9px] text-slate-500">Schools</div>
              </div>
            </div>

            <div className="p-2 rounded border border-slate-200 bg-white flex items-center gap-2">
              <Hospital className="w-4 h-4 text-red-600" />
              <div>
                <div className="text-xs font-bold text-slate-900">{analysis.facility_counts.hospital}</div>
                <div className="text-[9px] text-slate-500">Hospitals</div>
              </div>
            </div>

            <div className="p-2 rounded border border-slate-200 bg-white flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-orange-600" />
              <div>
                <div className="text-xs font-bold text-slate-900">{analysis.facility_counts.market}</div>
                <div className="text-[9px] text-slate-500">Markets</div>
              </div>
            </div>

            <div className="p-2 rounded border border-slate-200 bg-white flex items-center gap-2">
              <Landmark className="w-4 h-4 text-emerald-600" />
              <div>
                <div className="text-xs font-bold text-slate-900">{analysis.facility_counts.bank}</div>
                <div className="text-[9px] text-slate-500">Banks</div>
              </div>
            </div>

            <div className="p-2 rounded border border-slate-200 bg-white flex items-center gap-2">
              <Bus className="w-4 h-4 text-purple-600" />
              <div>
                <div className="text-xs font-bold text-slate-900">{analysis.facility_counts.bus_stop}</div>
                <div className="text-[9px] text-slate-500">Transit</div>
              </div>
            </div>

            <div className="p-2 rounded border border-slate-200 bg-white flex items-center gap-2">
              <Trees className="w-4 h-4 text-green-600" />
              <div>
                <div className="text-xs font-bold text-slate-900">{analysis.facility_counts.park}</div>
                <div className="text-[9px] text-slate-500">Parks</div>
              </div>
            </div>
          </div>
        </div>

        {/* Closest key facilities */}
        {analysis.closest_facilities.length > 0 && (
          <div>
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Nearest Key Amenities
            </span>
            <div className="divide-y divide-slate-100 text-xs">
              {analysis.closest_facilities.map((cf, idx) => (
                <div key={idx} className="py-1.5 flex items-center justify-between">
                  <span className="text-slate-700 truncate pr-2">{cf.name}</span>
                  <span className="text-slate-500 font-medium whitespace-nowrap text-[11px] bg-slate-100 px-1.5 py-0.5 rounded">
                    {formatDistance(cf.distance_meters)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Transparency note as requested by PRD Section 11 & 40 */}
        <div className="p-2 rounded bg-amber-50/70 border border-amber-200/60 flex items-start gap-1.5 text-[11px] text-amber-900">
          <Info className="w-3.5 h-3.5 text-amber-700 flex-shrink-0 mt-0.5" />
          <span>
            Calculated metrics reflect verified active listings and public facilities within the selected perimeter.
          </span>
        </div>
      </div>
    </div>
  );
}
