import { Facility, FacilityType, Property, AreaAnalysis, MapBounds } from '@/types';

/**
 * Calculates great-circle distance between two coordinates in meters using the Haversine formula
 */
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

/**
 * Formats distance for display (e.g. '350 m' or '1.4 km')
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  return `${(meters / 1000).toFixed(1)} km`;
}

/**
 * Formats price in Myanmar Kyat (MMK) compactly or fully
 */
export function formatMMK(price: number, compact: boolean = false): string {
  if (compact) {
    if (price >= 1_000_000_000) {
      return `${(price / 1_000_000_000).toFixed(1).replace(/\.0$/, '')}B MMK`;
    }
    if (price >= 1_000_000) {
      return `${(price / 1_000_000).toFixed(1).replace(/\.0$/, '')}M MMK`;
    }
    if (price >= 1_000) {
      return `${Math.round(price / 1_000)}K MMK`;
    }
  }
  return `${new Intl.NumberFormat('en-US').format(price)} MMK`;
}

/**
 * Formats price per square foot (e.g. '82K MMK / sqft')
 */
export function formatSqftPrice(pricePerSqft: number, compact: boolean = true): string {
  if (compact) {
    if (pricePerSqft >= 1_000_000) {
      return `${(pricePerSqft / 1_000_000).toFixed(1)}M/sqft`;
    }
    if (pricePerSqft >= 1_000) {
      return `${Math.round(pricePerSqft / 1_000)}K/sqft`;
    }
  }
  return `${new Intl.NumberFormat('en-US').format(Math.round(pricePerSqft))} MMK/sqft`;
}

/**
 * Check if a point is within map bounding box
 */
export function isInBounds(lat: number, lng: number, bounds: MapBounds): boolean {
  return (
    lat >= bounds.south &&
    lat <= bounds.north &&
    lng >= bounds.west &&
    lng <= bounds.east
  );
}

/**
 * Computes Area Intelligence metrics for a specific coordinate and radius
 */
export function computeAreaAnalysis(
  center: { lat: number; lng: number },
  radiusMeters: number,
  allProperties: Property[],
  allFacilities: Facility[]
): AreaAnalysis {
  const nearbyProperties = allProperties.filter(
    (p) => calculateDistance(center.lat, center.lng, p.latitude, p.longitude) <= radiusMeters
  );

  const saleProperties = nearbyProperties.filter((p) => p.listing_type === 'sale');
  const rentProperties = nearbyProperties.filter((p) => p.listing_type === 'rent');

  const prices = saleProperties.length > 0 
    ? saleProperties.map((p) => p.price)
    : nearbyProperties.map((p) => p.price);
  
  const sortedPrices = [...prices].sort((a, b) => a - b);
  const avgPrice = prices.length > 0 ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : 0;
  const medianPrice = sortedPrices.length > 0
    ? sortedPrices[Math.floor(sortedPrices.length / 2)]
    : 0;

  const sqftPrices = saleProperties.length > 0
    ? saleProperties.map((p) => p.price_per_sqft).filter((v) => v > 0)
    : nearbyProperties.map((p) => p.price_per_sqft).filter((v) => v > 0);

  const avgPricePerSqft = sqftPrices.length > 0
    ? Math.round(sqftPrices.reduce((a, b) => a + b, 0) / sqftPrices.length)
    : 0;

  const minPricePerSqft = sqftPrices.length > 0 ? Math.min(...sqftPrices) : 0;
  const maxPricePerSqft = sqftPrices.length > 0 ? Math.max(...sqftPrices) : 0;

  // Facilities analysis
  const facilitiesWithDistance = allFacilities.map((f) => ({
    ...f,
    distance_meters: calculateDistance(center.lat, center.lng, f.latitude, f.longitude)
  })).filter((f) => (f.distance_meters || 0) <= radiusMeters);

  const facilityCounts: Record<FacilityType, number> = {
    school: 0,
    hospital: 0,
    market: 0,
    bank: 0,
    bus_stop: 0,
    park: 0
  };

  facilitiesWithDistance.forEach((f) => {
    if (facilityCounts[f.type] !== undefined) {
      facilityCounts[f.type]++;
    }
  });

  // Find closest of each facility type
  const facilityTypes: FacilityType[] = ['school', 'hospital', 'market', 'bank', 'bus_stop', 'park'];
  const closestFacilities = facilityTypes.map((type) => {
    const matching = allFacilities
      .map((f) => ({
        type: f.type,
        name: f.name,
        distance_meters: calculateDistance(center.lat, center.lng, f.latitude, f.longitude)
      }))
      .filter((f) => f.type === type)
      .sort((a, b) => a.distance_meters - b.distance_meters);

    return matching[0];
  }).filter(Boolean);

  // Price distribution intervals (in MMK)
  const priceRanges = [
    { range: '< 150M', min: 0, max: 150_000_000 },
    { range: '150M - 250M', min: 150_000_000, max: 250_000_000 },
    { range: '250M - 400M', min: 250_000_000, max: 400_000_000 },
    { range: '400M - 700M', min: 400_000_000, max: 700_000_000 },
    { range: '> 700M', min: 700_000_000, max: Infinity }
  ];

  const priceDistribution = priceRanges.map(({ range, min, max }) => ({
    range,
    count: saleProperties.filter((p) => p.price >= min && p.price < max).length
  }));

  return {
    radius_meters: radiusMeters,
    center,
    property_count: nearbyProperties.length,
    avg_price: avgPrice,
    median_price: medianPrice,
    avg_price_per_sqft: avgPricePerSqft,
    min_price_per_sqft: minPricePerSqft,
    max_price_per_sqft: maxPricePerSqft,
    for_sale_count: saleProperties.length,
    for_rent_count: rentProperties.length,
    facility_counts: facilityCounts,
    closest_facilities: closestFacilities,
    price_distribution: priceDistribution
  };
}
