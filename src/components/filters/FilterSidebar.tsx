'use client';

import React, { useState } from 'react';
import { Property, FilterState } from '@/types';
import { formatMMK, formatSqftPrice } from '@/lib/geo';
import {
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Bed,
  Bath,
  Maximize2,
  Building,
  Home,
  Layers,
  MapPin,
  ArrowUpDown
} from 'lucide-react';
import Image from 'next/image';

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  properties: Property[];
  selectedProperty: Property | null;
  onSelectProperty: (property: Property) => void;
  hoveredPropertyId: string | null;
  onHoverProperty: (propertyId: string | null) => void;
  isOpen: boolean;
  onToggleOpen: () => void;
  onCitySwitch: (city: 'Mandalay' | 'Yangon') => void;
  currentCity: string;
}

const AMENITY_OPTIONS = [
  'Parking',
  'Garden',
  'Balcony',
  'Security',
  'Generator System',
  'Furnished'
];

export function FilterSidebar({
  filters,
  onFilterChange,
  properties,
  selectedProperty,
  onSelectProperty,
  hoveredPropertyId,
  onHoverProperty,
  isOpen,
  onToggleOpen,
  onCitySwitch,
  currentCity
}: FilterSidebarProps) {
  const [activeTab, setActiveTab] = useState<'results' | 'filters'>('results');

  const handleResetFilters = () => {
    onFilterChange({
      searchQuery: '',
      listingType: 'all',
      propertyType: 'all',
      minPrice: null,
      maxPrice: null,
      minArea: null,
      maxArea: null,
      bedrooms: 'any',
      bathrooms: 'any',
      features: [],
      township: '',
      sortBy: 'newest'
    });
  };

  const handleFeatureToggle = (feature: string) => {
    const next = filters.features.includes(feature)
      ? filters.features.filter((f) => f !== feature)
      : [...filters.features, feature];
    onFilterChange({ ...filters, features: next });
  };

  return (
    <>
      {/* Mobile Toggle / Floating Button */}
      <button
        onClick={onToggleOpen}
        className="md:hidden fixed bottom-6 right-6 z-30 bg-slate-900 text-white p-3 rounded-full shadow-xl flex items-center justify-center"
        aria-label="Toggle property list and filters"
      >
        <SlidersHorizontal className="w-5 h-5" />
      </button>

      {/* Main Sidebar Container */}
      <aside
        className={`fixed md:relative top-16 md:top-0 left-0 bottom-0 z-20 w-80 lg:w-96 bg-white border-r border-slate-200 flex flex-col transition-all duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:w-12 lg:md:w-12'
        }`}
      >
        {/* Collapsed state rail for Desktop */}
        {!isOpen && (
          <div className="hidden md:flex flex-col items-center py-4 w-full h-full justify-between">
            <button
              onClick={onToggleOpen}
              className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
              title="Expand property panel"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <div className="rotate-90 origin-center text-xs font-semibold tracking-wider text-slate-400 whitespace-nowrap">
              PROPERTIES ({properties.length})
            </div>
            <div />
          </div>
        )}

        {/* Expanded Content View */}
        {isOpen && (
          <div className="flex flex-col h-full overflow-hidden">
            {/* Top Bar with City quick-switch & Collapse toggle */}
            <div className="p-3 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">City:</span>
                <button
                  onClick={() => onCitySwitch('Mandalay')}
                  className={`px-2 py-0.5 rounded text-xs font-semibold transition-colors ${
                    currentCity === 'Mandalay'
                      ? 'bg-slate-900 text-white'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Mandalay
                </button>
                <button
                  onClick={() => onCitySwitch('Yangon')}
                  className={`px-2 py-0.5 rounded text-xs font-semibold transition-colors ${
                    currentCity === 'Yangon'
                      ? 'bg-slate-900 text-white'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Yangon
                </button>
              </div>

              <button
                onClick={onToggleOpen}
                className="hidden md:flex items-center justify-center p-1.5 rounded-md text-slate-400 hover:text-slate-800 hover:bg-slate-200/50 transition-colors"
                title="Collapse sidebar"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

            {/* View Mode Tabs: Results vs Filter Tuning */}
            <div className="flex border-b border-slate-200 bg-white">
              <button
                onClick={() => setActiveTab('results')}
                className={`flex-1 py-2.5 text-xs font-semibold text-center border-b-2 transition-colors ${
                  activeTab === 'results'
                    ? 'border-slate-900 text-slate-900'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                Properties ({properties.length})
              </button>
              <button
                onClick={() => setActiveTab('filters')}
                className={`flex-1 py-2.5 text-xs font-semibold text-center border-b-2 flex items-center justify-center gap-1.5 transition-colors ${
                  activeTab === 'filters'
                    ? 'border-slate-900 text-slate-900'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filters</span>
                {(filters.listingType !== 'all' || filters.propertyType !== 'all' || filters.minPrice || filters.maxPrice || filters.features.length > 0) && (
                  <span className="w-2 h-2 rounded-full bg-sky-600" />
                )}
              </button>
            </div>

            {/* TAB: PROPERTIES RESULTS LIST */}
            {activeTab === 'results' && (
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Sort Bar */}
                <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>{properties.length} in current viewport</span>
                  <div className="flex items-center gap-1">
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    <select
                      value={filters.sortBy}
                      onChange={(e) =>
                        onFilterChange({ ...filters, sortBy: e.target.value as FilterState['sortBy'] })
                      }
                      className="text-xs bg-transparent text-slate-700 font-medium focus:outline-none cursor-pointer"
                    >
                      <option value="newest">Newest</option>
                      <option value="price_asc">Price: Low to High</option>
                      <option value="price_desc">Price: High to Low</option>
                      <option value="sqft_asc">Price/Sqft: Low to High</option>
                      <option value="sqft_desc">Price/Sqft: High to Low</option>
                    </select>
                  </div>
                </div>

                {/* Scrollable Items */}
                <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 space-y-2">
                  {properties.length === 0 ? (
                    <div className="p-6 text-center space-y-2">
                      <MapPin className="w-8 h-8 text-slate-300 mx-auto" />
                      <div className="text-sm font-semibold text-slate-800">
                        No properties found in this area
                      </div>
                      <p className="text-xs text-slate-500">
                        Try panning the map, zooming out, or clearing your active filters.
                      </p>
                      <button
                        onClick={handleResetFilters}
                        className="mt-3 px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-xs font-medium text-slate-700 transition-colors"
                      >
                        Reset All Filters
                      </button>
                    </div>
                  ) : (
                    properties.map((prop) => {
                      const isSelected = selectedProperty?.id === prop.id;
                      const isHovered = hoveredPropertyId === prop.id;

                      return (
                        <div
                          key={prop.id}
                          onClick={() => onSelectProperty(prop)}
                          onMouseEnter={() => onHoverProperty(prop.id)}
                          onMouseLeave={() => onHoverProperty(null)}
                          className={`p-2.5 rounded-lg border transition-all cursor-pointer flex gap-3 ${
                            isSelected
                              ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900 shadow-sm'
                              : isHovered
                              ? 'border-slate-300 bg-slate-50/60'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          {/* Thumbnail */}
                          <div className="relative w-24 h-20 rounded-md overflow-hidden bg-slate-100 flex-shrink-0">
                            <Image
                              src={prop.images[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80'}
                              alt={prop.title}
                              fill
                              sizes="96px"
                              className="object-cover"
                            />
                            <span className="absolute bottom-1 left-1 px-1 py-0.5 rounded bg-slate-900/80 text-white text-[9px] font-bold uppercase">
                              {prop.listing_type}
                            </span>
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <div>
                              <div className="flex items-baseline justify-between gap-1">
                                <span className="text-xs font-bold text-slate-900">
                                  {formatMMK(prop.price, true)}
                                </span>
                                <span className="text-[10px] font-medium text-slate-500">
                                  {formatSqftPrice(prop.price_per_sqft)}
                                </span>
                              </div>
                              <h4 className="text-xs font-medium text-slate-800 line-clamp-1 leading-snug mt-0.5">
                                {prop.title}
                              </h4>
                              <div className="text-[11px] text-slate-500 truncate mt-0.5">
                                {prop.township}
                              </div>
                            </div>

                            <div className="flex items-center gap-2.5 text-[11px] text-slate-600 mt-1">
                              <span className="flex items-center gap-1">
                                <Maximize2 className="w-3 h-3 text-slate-400" />
                                {prop.area_sqft} sqft
                              </span>
                              {prop.bedrooms > 0 && (
                                <span className="flex items-center gap-1">
                                  <Bed className="w-3 h-3 text-slate-400" />
                                  {prop.bedrooms}
                                </span>
                              )}
                              {prop.bathrooms > 0 && (
                                <span className="flex items-center gap-1">
                                  <Bath className="w-3 h-3 text-slate-400" />
                                  {prop.bathrooms}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* TAB: FILTERS CONTROLS */}
            {activeTab === 'filters' && (
              <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs text-slate-700">
                {/* Listing Type Toggle */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Listing Type
                  </label>
                  <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-md">
                    {(['all', 'sale', 'rent'] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => onFilterChange({ ...filters, listingType: type })}
                        className={`py-1.5 text-xs font-medium rounded capitalize transition-colors ${
                          filters.listingType === type
                            ? 'bg-white text-slate-900 shadow-xs font-semibold'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {type === 'all' ? 'All Types' : `For ${type}`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Property Type Pills */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Property Type
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {(['all', 'house', 'apartment', 'condo', 'land'] as const).map((ptype) => (
                      <button
                        key={ptype}
                        onClick={() => onFilterChange({ ...filters, propertyType: ptype })}
                        className={`py-1.5 px-2 rounded-md border text-xs font-medium capitalize text-left transition-colors flex items-center justify-between ${
                          filters.propertyType === ptype
                            ? 'border-slate-900 bg-slate-900 text-white'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <span>{ptype}</span>
                        {ptype === 'house' && <Home className="w-3.5 h-3.5 opacity-70" />}
                        {ptype === 'condo' && <Building className="w-3.5 h-3.5 opacity-70" />}
                        {ptype === 'land' && <Layers className="w-3.5 h-3.5 opacity-70" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range Presets / Inputs */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Price Range (MMK)
                  </label>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <div>
                      <span className="text-[10px] text-slate-400">Min MMK</span>
                      <input
                        type="number"
                        placeholder="0"
                        value={filters.minPrice || ''}
                        onChange={(e) =>
                          onFilterChange({
                            ...filters,
                            minPrice: e.target.value ? Number(e.target.value) : null
                          })
                        }
                        className="w-full text-xs p-1.5 rounded border border-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400">Max MMK</span>
                      <input
                        type="number"
                        placeholder="Any"
                        value={filters.maxPrice || ''}
                        onChange={(e) =>
                          onFilterChange({
                            ...filters,
                            maxPrice: e.target.value ? Number(e.target.value) : null
                          })
                        }
                        className="w-full text-xs p-1.5 rounded border border-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Bedrooms & Bathrooms */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      Bedrooms
                    </label>
                    <div className="flex gap-1">
                      {(['any', 1, 2, 3, '4+'] as const).map((b) => (
                        <button
                          key={String(b)}
                          onClick={() => onFilterChange({ ...filters, bedrooms: b })}
                          className={`flex-1 py-1 text-center rounded border font-medium transition-colors ${
                            filters.bedrooms === b
                              ? 'bg-slate-900 border-slate-900 text-white'
                              : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                          }`}
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      Bathrooms
                    </label>
                    <div className="flex gap-1">
                      {(['any', 1, 2, '3+'] as const).map((b) => (
                        <button
                          key={String(b)}
                          onClick={() => onFilterChange({ ...filters, bathrooms: b })}
                          className={`flex-1 py-1 text-center rounded border font-medium transition-colors ${
                            filters.bathrooms === b
                              ? 'bg-slate-900 border-slate-900 text-white'
                              : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                          }`}
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Amenities Checklist */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Amenities & Features
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {AMENITY_OPTIONS.map((amenity) => {
                      const checked = filters.features.includes(amenity);
                      return (
                        <button
                          key={amenity}
                          type="button"
                          onClick={() => handleFeatureToggle(amenity)}
                          className={`p-2 rounded border text-left text-xs font-medium transition-colors flex items-center justify-between ${
                            checked
                              ? 'border-sky-600 bg-sky-50 text-sky-900'
                              : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          <span>{amenity}</span>
                          <span className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center text-[10px] ${
                            checked ? 'bg-sky-600 border-sky-600 text-white' : 'border-slate-300'
                          }`}>
                            {checked ? '✓' : ''}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Reset Action */}
                <div className="pt-2">
                  <button
                    onClick={handleResetFilters}
                    className="w-full py-2 px-3 rounded-md border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                    <span>Reset All Filters</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </aside>
    </>
  );
}
