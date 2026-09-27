'use client';

import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Property, Facility, FacilityType, FilterState, MapBounds, AreaAnalysis } from '@/types';
import { fetchProperties, fetchFacilities, fetchAreaAnalysis } from '@/lib/data/store';
import { Header } from '@/components/layout/Header';
import { FilterSidebar } from '@/components/filters/FilterSidebar';
import { MapLayerToolbar } from '@/components/map/MapLayerToolbar';
import { PropertyPreview } from '@/components/property/PropertyPreview';
import { NeighborhoodAnalysisPanel } from '@/components/analysis/NeighborhoodAnalysisPanel';

// Dynamically import Leaflet Map to ensure no SSR window errors
const LeafletMap = dynamic(() => import('@/components/map/LeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-500">
      <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin mb-2" />
      <span className="text-xs font-semibold tracking-wider uppercase text-slate-400">
        Loading Cartographic Map...
      </span>
    </div>
  )
});

const DEFAULT_FILTERS: FilterState = {
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
};

export default function HomePage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [hoveredPropertyId, setHoveredPropertyId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentCity, setCurrentCity] = useState<'Mandalay' | 'Yangon'>('Mandalay');

  // Map Layer States
  const [markerDisplayMode, setMarkerDisplayMode] = useState<'price' | 'sqft'>('price');
  const [visibleFacilities, setVisibleFacilities] = useState<Set<FacilityType>>(
    new Set(['school', 'hospital', 'market'])
  );
  const [analysisRadius, setAnalysisRadius] = useState<number | null>(null);
  const [analysisCenter, setAnalysisCenter] = useState<{ lat: number; lng: number } | null>(null);
  const [areaAnalysis, setAreaAnalysis] = useState<AreaAnalysis | null>(null);
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);
  const [currentBounds, setCurrentBounds] = useState<MapBounds | null>(null);

  // Initial load
  useEffect(() => {
    async function loadData() {
      const [props, facs] = await Promise.all([
        fetchProperties(filters, currentBounds),
        fetchFacilities()
      ]);
      setProperties(props);
      setFacilities(facs);
    }
    loadData();
  }, [filters, currentBounds]);

  // Handle bounds change from map pan/zoom
  const handleBoundsChange = useCallback((bounds: MapBounds) => {
    setCurrentBounds(bounds);
  }, []);

  // Facility layer toggle
  const handleToggleFacility = (type: FacilityType) => {
    setVisibleFacilities((prev) => {
      const next = new Set(prev);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  };

  // Neighborhood Analysis trigger
  const handleAnalyzeNeighborhood = async (property: Property) => {
    const radius = analysisRadius || 1000;
    setAnalysisRadius(radius);
    setAnalysisCenter({ lat: property.latitude, lng: property.longitude });
    const analysis = await fetchAreaAnalysis(
      { lat: property.latitude, lng: property.longitude },
      radius
    );
    setAreaAnalysis(analysis);
    setIsAnalysisOpen(true);
  };

  const handleRadiusChange = async (radius: number) => {
    setAnalysisRadius(radius);
    if (analysisCenter) {
      const analysis = await fetchAreaAnalysis(analysisCenter, radius);
      setAreaAnalysis(analysis);
    }
  };

  // Map clicks update an active analysis, but must not dismiss the selected
  // property's action card. Users can close that card with its close button.
  const handleMapClick = async (latlng: { lat: number; lng: number }) => {
    if (analysisRadius) {
      setAnalysisCenter(latlng);
      const analysis = await fetchAreaAnalysis(latlng, analysisRadius);
      setAreaAnalysis(analysis);
      setIsAnalysisOpen(true);
    }
  };

  // City Switcher
  const handleCitySwitch = (city: 'Mandalay' | 'Yangon') => {
    setCurrentCity(city);
    // Find first property in that city to center on
    const targetProp = properties.find((p) => p.city.toLowerCase() === city.toLowerCase());
    if (targetProp) {
      setSelectedProperty(targetProp);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-50 font-sans">
      {/* Top Header */}
      <Header
        searchQuery={filters.searchQuery}
        onSearchChange={(q) => setFilters({ ...filters, searchQuery: q })}
      />

      {/* Main Workspace (Map + Collapsible Property Sidebar) */}
      <div className="flex-1 relative flex overflow-hidden">
        {/* Left Filter & Properties List Sidebar */}
        <FilterSidebar
          filters={filters}
          onFilterChange={setFilters}
          properties={properties}
          selectedProperty={selectedProperty}
          onSelectProperty={(prop) => {
            setSelectedProperty(prop);
            // Center map on this property
          }}
          hoveredPropertyId={hoveredPropertyId}
          onHoverProperty={setHoveredPropertyId}
          isOpen={isSidebarOpen}
          onToggleOpen={() => setIsSidebarOpen(!isSidebarOpen)}
          onCitySwitch={handleCitySwitch}
          currentCity={currentCity}
        />

        {/* Central Map Canvas */}
        <main className="flex-1 relative h-full w-full">
          {/* Layer Toolbar */}
          <MapLayerToolbar
            markerDisplayMode={markerDisplayMode}
            onToggleMarkerMode={() =>
              setMarkerDisplayMode((prev) => (prev === 'price' ? 'sqft' : 'price'))
            }
            visibleFacilities={visibleFacilities}
            onToggleFacility={handleToggleFacility}
            analysisRadius={analysisRadius}
            onSelectRadius={(radius) => {
              setAnalysisRadius(radius);
              if (radius && selectedProperty) {
                handleAnalyzeNeighborhood(selectedProperty);
              } else if (!radius) {
                setIsAnalysisOpen(false);
              }
            }}
          />

          {/* Leaflet Map */}
          <LeafletMap
            properties={properties}
            facilities={facilities}
            selectedProperty={selectedProperty}
            onSelectProperty={setSelectedProperty}
            hoveredPropertyId={hoveredPropertyId}
            onHoverProperty={setHoveredPropertyId}
            markerDisplayMode={markerDisplayMode}
            visibleFacilities={visibleFacilities}
            analysisRadius={analysisRadius}
            analysisCenter={analysisCenter}
            onBoundsChange={handleBoundsChange}
            onMapClick={handleMapClick}
          />

          {/* Compact Property Preview Card (PRD Section 10) */}
          {selectedProperty && (
            <PropertyPreview
              property={selectedProperty}
              onClose={() => setSelectedProperty(null)}
              onAnalyzeNeighborhood={handleAnalyzeNeighborhood}
            />
          )}

          {/* Neighborhood Analysis Panel (PRD Section 12) */}
          {isAnalysisOpen && (
            <NeighborhoodAnalysisPanel
              analysis={areaAnalysis}
              onClose={() => {
                setIsAnalysisOpen(false);
                setAnalysisRadius(null);
              }}
              onRadiusChange={handleRadiusChange}
              propertyName={selectedProperty?.title}
            />
          )}
        </main>
      </div>
    </div>
  );
}
