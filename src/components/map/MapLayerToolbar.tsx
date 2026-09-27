'use client';

import React from 'react';
import { FacilityType } from '@/types';
import { GraduationCap, Hospital, ShoppingCart, Landmark, Bus, Trees, Tag, Percent } from 'lucide-react';

interface MapLayerToolbarProps {
  markerDisplayMode: 'price' | 'sqft';
  onToggleMarkerMode: () => void;
  visibleFacilities: Set<FacilityType>;
  onToggleFacility: (type: FacilityType) => void;
  analysisRadius: number | null;
  onSelectRadius: (radius: number | null) => void;
}

const FACILITY_BUTTONS: { type: FacilityType; label: string; icon: React.ReactNode; color: string }[] = [
  { type: 'school', label: 'Schools', icon: <GraduationCap className="w-3.5 h-3.5" />, color: 'text-blue-600' },
  { type: 'hospital', label: 'Hospitals', icon: <Hospital className="w-3.5 h-3.5" />, color: 'text-red-600' },
  { type: 'market', label: 'Markets', icon: <ShoppingCart className="w-3.5 h-3.5" />, color: 'text-orange-600' },
  { type: 'bank', label: 'Banks', icon: <Landmark className="w-3.5 h-3.5" />, color: 'text-emerald-600' },
  { type: 'bus_stop', label: 'Bus', icon: <Bus className="w-3.5 h-3.5" />, color: 'text-purple-600' },
  { type: 'park', label: 'Parks', icon: <Trees className="w-3.5 h-3.5" />, color: 'text-green-600' },
];

export function MapLayerToolbar({
  markerDisplayMode,
  onToggleMarkerMode,
  visibleFacilities,
  onToggleFacility,
  analysisRadius,
  onSelectRadius,
}: MapLayerToolbarProps) {
  return (
    <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-1.5 bg-white/95 backdrop-blur-md p-1.5 rounded-lg border border-slate-200 shadow-md max-w-[calc(100vw-2rem)]">
      {/* Marker Mode Switch (Price vs Sqft) */}
      <div className="flex items-center bg-slate-100 p-0.5 rounded-md">
        <button
          onClick={onToggleMarkerMode}
          className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold transition-all ${
            markerDisplayMode === 'price'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
          title="Display total listing price on map badges"
        >
          <Tag className="w-3 h-3" />
          <span>Price</span>
        </button>
        <button
          onClick={onToggleMarkerMode}
          className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold transition-all ${
            markerDisplayMode === 'sqft'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
          title="Display price per square foot on map badges"
        >
          <Percent className="w-3 h-3" />
          <span>/sqft</span>
        </button>
      </div>

      <div className="h-4 w-[1px] bg-slate-200 mx-0.5 hidden sm:block" />

      {/* Facilities Overlay Toggles */}
      <div className="flex items-center gap-1 overflow-x-auto py-0.5">
        {FACILITY_BUTTONS.map(({ type, label, icon, color }) => {
          const isActive = visibleFacilities.has(type);
          return (
            <button
              key={type}
              onClick={() => onToggleFacility(type)}
              className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border transition-colors ${
                isActive
                  ? 'bg-slate-900 border-slate-900 text-white'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
              title={`Toggle ${label} layer`}
            >
              <span className={isActive ? 'text-white' : color}>{icon}</span>
              <span className="hidden md:inline">{label}</span>
            </button>
          );
        })}
      </div>

      <div className="h-4 w-[1px] bg-slate-200 mx-0.5 hidden lg:block" />

      {/* Radius Mode Selector */}
      <div className="hidden lg:flex items-center gap-1 bg-slate-50 px-1 py-0.5 rounded border border-slate-200">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">Radius:</span>
        {[500, 1000, 2000, 5000].map((meters) => {
          const label = meters >= 1000 ? `${meters / 1000}km` : `${meters}m`;
          const isSelected = analysisRadius === meters;
          return (
            <button
              key={meters}
              onClick={() => onSelectRadius(isSelected ? null : meters)}
              className={`px-1.5 py-0.5 text-[11px] font-semibold rounded transition-colors ${
                isSelected
                  ? 'bg-sky-600 text-white'
                  : 'text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
