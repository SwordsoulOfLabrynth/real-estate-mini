import { Property, Facility, FilterState, MapBounds, AreaAnalysis } from '@/types';
import { INITIAL_PROPERTIES } from './properties';
import { INITIAL_FACILITIES } from './facilities';
import { isInBounds, computeAreaAnalysis } from '@/lib/geo';
import { isSupabaseConfigured, supabase } from '@/lib/supabase/client';

let inMemoryProperties: Property[] = [...INITIAL_PROPERTIES];
let inMemoryFacilities: Facility[] = [...INITIAL_FACILITIES];

export async function fetchProperties(
  filters?: Partial<FilterState>,
  bounds?: MapBounds | null
): Promise<Property[]> {
  // If Supabase is configured and reachable
  if (isSupabaseConfigured && supabase) {
    try {
      let query = supabase.from('properties').select('*');

      if (filters?.listingType && filters.listingType !== 'all') {
        query = query.eq('listing_type', filters.listingType);
      }
      if (filters?.propertyType && filters.propertyType !== 'all') {
        query = query.eq('property_type', filters.propertyType);
      }
      if (filters?.minPrice) {
        query = query.gte('price', filters.minPrice);
      }
      if (filters?.maxPrice) {
        query = query.lte('price', filters.maxPrice);
      }
      if (filters?.township) {
        query = query.ilike('township', `%${filters.township}%`);
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data as Property[];
      }
    } catch (e) {
      console.warn('Supabase fetch failed, falling back to local dataset', e);
    }
  }

  // Fallback to in-memory dataset with local filtering
  let results = [...inMemoryProperties];

  if (filters) {
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      results = results.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.address.toLowerCase().includes(q) ||
          p.township.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q)
      );
    }

    if (filters.listingType && filters.listingType !== 'all') {
      results = results.filter((p) => p.listing_type === filters.listingType);
    }

    if (filters.propertyType && filters.propertyType !== 'all') {
      results = results.filter((p) => p.property_type === filters.propertyType);
    }

    if (filters.minPrice !== null && filters.minPrice !== undefined && filters.minPrice > 0) {
      results = results.filter((p) => p.price >= (filters.minPrice as number));
    }

    if (filters.maxPrice !== null && filters.maxPrice !== undefined && filters.maxPrice > 0) {
      results = results.filter((p) => p.price <= (filters.maxPrice as number));
    }

    if (filters.minArea !== null && filters.minArea !== undefined && filters.minArea > 0) {
      results = results.filter((p) => p.area_sqft >= (filters.minArea as number));
    }

    if (filters.maxArea !== null && filters.maxArea !== undefined && filters.maxArea > 0) {
      results = results.filter((p) => p.area_sqft <= (filters.maxArea as number));
    }

    if (filters.bedrooms && filters.bedrooms !== 'any') {
      if (filters.bedrooms === '4+') {
        results = results.filter((p) => p.bedrooms >= 4);
      } else {
        results = results.filter((p) => p.bedrooms === Number(filters.bedrooms));
      }
    }

    if (filters.bathrooms && filters.bathrooms !== 'any') {
      if (filters.bathrooms === '3+') {
        results = results.filter((p) => p.bathrooms >= 3);
      } else {
        results = results.filter((p) => p.bathrooms === Number(filters.bathrooms));
      }
    }

    if (filters.township) {
      results = results.filter((p) =>
        p.township.toLowerCase().includes((filters.township as string).toLowerCase())
      );
    }

    if (filters.features && filters.features.length > 0) {
      results = results.filter((p) =>
        filters.features!.every((f) => p.features.includes(f))
      );
    }

    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'price_asc':
          results.sort((a, b) => a.price - b.price);
          break;
        case 'price_desc':
          results.sort((a, b) => b.price - a.price);
          break;
        case 'sqft_asc':
          results.sort((a, b) => a.price_per_sqft - b.price_per_sqft);
          break;
        case 'sqft_desc':
          results.sort((a, b) => b.price_per_sqft - a.price_per_sqft);
          break;
        case 'newest':
          results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
          break;
      }
    }
  }

  // Filter by map viewport bounds if provided and not zoomed out too far
  if (bounds) {
    const inBoundsResults = results.filter((p) => isInBounds(p.latitude, p.longitude, bounds));
    // If viewport contains results, return them. If user just panned into empty area, return empty as per PRD!
    return inBoundsResults;
  }

  return results;
}

export async function fetchPropertyById(id: string): Promise<Property | null> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('properties').select('*').eq('id', id).single();
      if (!error && data) {
        return data as Property;
      }
    } catch {
      // Fallback
    }
  }

  const prop = inMemoryProperties.find((p) => p.id === id);
  return prop || null;
}

export async function fetchFacilities(): Promise<Facility[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('facilities').select('*');
      if (!error && data) {
        return data as Facility[];
      }
    } catch {
      // Fallback
    }
  }

  return [...inMemoryFacilities];
}

export async function fetchAreaAnalysis(
  center: { lat: number; lng: number },
  radiusMeters: number
): Promise<AreaAnalysis> {
  const properties = await fetchProperties();
  const facilities = await fetchFacilities();
  return computeAreaAnalysis(center, radiusMeters, properties, facilities);
}

// Admin Operations
export async function createOrUpdateProperty(prop: Partial<Property>): Promise<Property> {
  const now = new Date().toISOString();
  const price = prop.price || 0;
  const area = prop.area_sqft || 1;
  const calculatedSqft = Math.round(price / area);

  if (prop.id) {
    const idx = inMemoryProperties.findIndex((p) => p.id === prop.id);
    if (idx !== -1) {
      const updated: Property = {
        ...inMemoryProperties[idx],
        ...prop,
        price_per_sqft: calculatedSqft,
        updated_at: now
      } as Property;
      inMemoryProperties[idx] = updated;
      return updated;
    }
  }

  const created: Property = {
    id: `prop-${Date.now()}`,
    title: prop.title || 'Untitled Property',
    description: prop.description || '',
    listing_type: prop.listing_type || 'sale',
    property_type: prop.property_type || 'house',
    price: price,
    currency: 'MMK',
    area_sqft: area,
    price_per_sqft: calculatedSqft,
    bedrooms: prop.bedrooms || 0,
    bathrooms: prop.bathrooms || 0,
    parking: prop.parking || 0,
    latitude: prop.latitude || 21.9325,
    longitude: prop.longitude || 96.0841,
    address: prop.address || 'Address pending',
    township: prop.township || 'Chanmyathazi',
    city: prop.city || 'Mandalay',
    images: prop.images && prop.images.length > 0 ? prop.images : [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
    ],
    features: prop.features || ['Parking'],
    is_verified: prop.is_verified ?? true,
    status: prop.status || 'available',
    created_at: now,
    updated_at: now
  };

  inMemoryProperties.unshift(created);
  return created;
}

export async function deleteProperty(id: string): Promise<boolean> {
  const initialLength = inMemoryProperties.length;
  inMemoryProperties = inMemoryProperties.filter((p) => p.id !== id);
  return inMemoryProperties.length < initialLength;
}

export async function createFacility(facility: Omit<Facility, 'id'>): Promise<Facility> {
  const newFac: Facility = {
    ...facility,
    id: `fac-${Date.now()}`
  };
  inMemoryFacilities.push(newFac);
  return newFac;
}

export async function deleteFacility(id: string): Promise<boolean> {
  const initialLength = inMemoryFacilities.length;
  inMemoryFacilities = inMemoryFacilities.filter((f) => f.id !== id);
  return inMemoryFacilities.length < initialLength;
}
