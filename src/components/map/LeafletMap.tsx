'use client';

import React, { useEffect, useRef } from 'react';
import type * as LeafletType from 'leaflet';
import { Property, Facility, FacilityType, MapBounds } from '@/types';
import { formatMMK, formatSqftPrice } from '@/lib/geo';

interface LeafletMapProps {
  properties: Property[];
  facilities: Facility[];
  selectedProperty: Property | null;
  onSelectProperty: (property: Property | null) => void;
  hoveredPropertyId: string | null;
  onHoverProperty?: (propertyId: string | null) => void;
  markerDisplayMode: 'price' | 'sqft';
  visibleFacilities: Set<FacilityType>;
  analysisRadius: number | null;
  analysisCenter: { lat: number; lng: number } | null;
  onBoundsChange?: (bounds: MapBounds) => void;
  onMapClick?: (latlng: { lat: number; lng: number }) => void;
}

export default function LeafletMap({
  properties,
  facilities,
  selectedProperty,
  onSelectProperty,
  hoveredPropertyId,
  onHoverProperty,
  markerDisplayMode,
  visibleFacilities,
  analysisRadius,
  analysisCenter,
  onBoundsChange,
  onMapClick
}: LeafletMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletType.Map | null>(null);
  const propertyMarkersRef = useRef<Map<string, LeafletType.Marker>>(new Map());
  const facilityMarkersRef = useRef<LeafletType.Marker[]>([]);
  const radiusCircleRef = useRef<LeafletType.Circle | null>(null);
  const LRef = useRef<typeof LeafletType | null>(null);

  // Store active callbacks in refs to avoid re-binding map event listeners
  const callbacksRef = useRef({
    onMapClick,
    onBoundsChange,
    onSelectProperty,
    onHoverProperty
  });

  useEffect(() => {
    callbacksRef.current = {
      onMapClick,
      onBoundsChange,
      onSelectProperty,
      onHoverProperty
    };
  });

  // Initialize Map
  useEffect(() => {
    let isMounted = true;
    let resizeObserver: ResizeObserver | null = null;
    let debounceTimeout: ReturnType<typeof setTimeout> | undefined;

    async function initMap() {
      if (!mapContainerRef.current || mapInstanceRef.current) return;

      const L = await import('leaflet');
      if (!isMounted || !mapContainerRef.current) return;
      LRef.current = L;

      // Initial center at Mandalay Chanmyathazi / central Myanmar
      const map = L.map(mapContainerRef.current, {
        center: [21.9325, 96.0841],
        zoom: 13,
        zoomControl: false,
        attributionControl: false
      });

      // Standard OpenStreetMap tiles - free, no API key required
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      // Attribution small in corner
      L.control.attribution({ position: 'bottomright' }).addTo(map);

      // Zoom control bottom-right
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Handle map clicks
      map.on('click', (e) => {
        callbacksRef.current.onMapClick?.({ lat: e.latlng.lat, lng: e.latlng.lng });
      });

      // Viewport bounds change
      const handleMove = () => {
        if (debounceTimeout) clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
          // A scheduled move can outlive the Leaflet map during Fast Refresh
          // or route cleanup. Never read bounds from a disposed map instance.
          if (!isMounted || mapInstanceRef.current !== map || !callbacksRef.current.onBoundsChange) {
            return;
          }
          const b = map.getBounds();
          callbacksRef.current.onBoundsChange({
            north: b.getNorth(),
            south: b.getSouth(),
            east: b.getEast(),
            west: b.getWest()
          });
        }, 300);
      };

      map.on('moveend', handleMove);
      mapInstanceRef.current = map;

      // Trigger size invalidation immediately and after short delay
      map.invalidateSize();
      setTimeout(() => {
        if (isMounted && mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 150);

      // Resize observer to ensure full container tiles loading whenever container changes size
      if (typeof ResizeObserver !== 'undefined' && mapContainerRef.current) {
        resizeObserver = new ResizeObserver(() => {
          map.invalidateSize();
        });
        resizeObserver.observe(mapContainerRef.current);
      }

      // Trigger initial bounds calculation
      handleMove();
    }

    initMap();

    return () => {
      isMounted = false;
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Property Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const L = LRef.current;
    if (!map || !L) return;

    // Clear existing markers
    propertyMarkersRef.current.forEach((marker) => marker.remove());
    propertyMarkersRef.current.clear();

    properties.forEach((prop) => {
      const isSelected = selectedProperty?.id === prop.id;
      const isHovered = hoveredPropertyId === prop.id;
      const displayValue =
        markerDisplayMode === 'price'
          ? formatMMK(prop.price, true)
          : formatSqftPrice(prop.price_per_sqft, true);

      const html = `
        <div class="re-price-marker ${prop.listing_type} ${isSelected ? 'active' : ''} ${isHovered ? 'hovered' : ''}">
          <div class="re-price-badge">
            <span>${displayValue}</span>
          </div>
          <div class="re-price-pin-dot"></div>
        </div>
      `;

      const customIcon = L.divIcon({
        html,
        className: 'custom-leaflet-price-marker',
        iconSize: [60, 30],
        iconAnchor: [30, 28]
      });

      const marker = L.marker([prop.latitude, prop.longitude], { icon: customIcon });

      marker.on('click', (e) => {
        L.DomEvent.stopPropagation(e);
        callbacksRef.current.onSelectProperty(prop);
      });

      marker.on('mouseover', () => callbacksRef.current.onHoverProperty?.(prop.id));
      marker.on('mouseout', () => callbacksRef.current.onHoverProperty?.(null));

      marker.addTo(map);
      propertyMarkersRef.current.set(prop.id, marker);
    });
  }, [properties, selectedProperty, hoveredPropertyId, markerDisplayMode]);

  // Update Facility Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const L = LRef.current;
    if (!map || !L) return;

    // Remove old facilities
    facilityMarkersRef.current.forEach((m) => m.remove());
    facilityMarkersRef.current = [];

    // Filter facilities matching active layers
    const visible = facilities.filter((f) => visibleFacilities.has(f.type));

    const facilityIcons: Record<FacilityType, string> = {
      school: '🎓',
      hospital: '🏥',
      market: '🛒',
      bank: '🏦',
      bus_stop: '🚌',
      park: '🌳'
    };

    visible.forEach((f) => {
      const iconChar = facilityIcons[f.type] || '📍';
      const html = `
        <div class="re-facility-marker re-facility-${f.type}" title="${f.name} (${f.type})">
          <span style="font-size: 13px; line-height: 1;">${iconChar}</span>
        </div>
      `;

      const facilityIcon = L.divIcon({
        html,
        className: 'custom-leaflet-facility-marker',
        iconSize: [26, 26],
        iconAnchor: [13, 13]
      });

      const marker = L.marker([f.latitude, f.longitude], { icon: facilityIcon });
      marker.bindTooltip(
        `<strong>${f.name}</strong><br/><span style="color:#64748b;font-size:11px;">${f.township} · ${f.type.toUpperCase()}</span>`,
        {
          direction: 'top',
          offset: [0, -10],
          opacity: 0.95
        }
      );

      marker.addTo(map);
      facilityMarkersRef.current.push(marker);
    });
  }, [facilities, visibleFacilities]);

  // Update Neighborhood Radius Circle
  useEffect(() => {
    const map = mapInstanceRef.current;
    const L = LRef.current;
    if (!map || !L) return;

    if (radiusCircleRef.current) {
      radiusCircleRef.current.remove();
      radiusCircleRef.current = null;
    }

    if (analysisRadius && analysisCenter) {
      const circle = L.circle([analysisCenter.lat, analysisCenter.lng], {
        radius: analysisRadius,
        color: '#0284c7',
        weight: 1.5,
        dashArray: '4, 6',
        fillColor: '#0284c7',
        fillOpacity: 0.08
      }).addTo(map);

      radiusCircleRef.current = circle;
    }
  }, [analysisRadius, analysisCenter]);

  // Fly to selected property when chosen
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedProperty) return;

    map.flyTo([selectedProperty.latitude, selectedProperty.longitude], 15, {
      duration: 0.8,
      easeLinearity: 0.25
    });
  }, [selectedProperty]);

  return (
    <div className="relative isolate z-0 w-full h-full">
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
}
