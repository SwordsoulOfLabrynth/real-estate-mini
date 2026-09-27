export type ListingType = 'sale' | 'rent';

export type PropertyType = 'house' | 'apartment' | 'condo' | 'land' | 'townhouse';

export type PropertyStatus = 'available' | 'under_offer' | 'sold';

export type FacilityType = 'school' | 'hospital' | 'market' | 'bank' | 'bus_stop' | 'park';

export interface Property {
  id: string;
  title: string;
  description: string;
  listing_type: ListingType;
  property_type: PropertyType;
  price: number; // in MMK
  currency: 'MMK';
  area_sqft: number;
  price_per_sqft: number; // price / area_sqft
  bedrooms: number;
  bathrooms: number;
  parking: number;
  latitude: number;
  longitude: number;
  address: string;
  township: string;
  city: string;
  images: string[];
  features: string[];
  is_verified: boolean;
  status: PropertyStatus;
  created_at: string;
  updated_at: string;
}

export interface Facility {
  id: string;
  name: string;
  type: FacilityType;
  latitude: number;
  longitude: number;
  address: string;
  township: string;
  distance_meters?: number;
}

export interface AreaAnalysis {
  radius_meters: number;
  center: { lat: number; lng: number };
  property_count: number;
  avg_price: number;
  median_price: number;
  avg_price_per_sqft: number;
  min_price_per_sqft: number;
  max_price_per_sqft: number;
  for_sale_count: number;
  for_rent_count: number;
  facility_counts: Record<FacilityType, number>;
  closest_facilities: {
    type: FacilityType;
    name: string;
    distance_meters: number;
  }[];
  price_distribution: {
    range: string;
    count: number;
  }[];
}

export interface FilterState {
  searchQuery: string;
  listingType: 'all' | ListingType;
  propertyType: 'all' | PropertyType;
  minPrice: number | null;
  maxPrice: number | null;
  minArea: number | null;
  maxArea: number | null;
  bedrooms: 'any' | number | '4+';
  bathrooms: 'any' | number | '3+';
  features: string[];
  township: string;
  sortBy: 'price_asc' | 'price_desc' | 'sqft_asc' | 'sqft_desc' | 'newest';
}

export interface MapLayerState {
  showProperties: boolean;
  markerDisplayMode: 'price' | 'sqft';
  visibleFacilities: Set<FacilityType>;
  showHeatmap: boolean;
  showDensity: boolean;
  analysisRadius: number | null; // e.g. 500, 1000, 2000, 5000 in meters
  selectedPropertyId: string | null;
  hoveredPropertyId: string | null;
}

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}
