import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { fetchPropertyById, fetchFacilities, fetchProperties } from '@/lib/data/store';
import { formatMMK, formatSqftPrice, calculateDistance, formatDistance } from '@/lib/geo';
import { Header } from '@/components/layout/Header';
import {
  Bed,
  Bath,
  Maximize2,
  Car,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  GraduationCap,
  Hospital,
  ShoppingCart,
  Landmark,
  Bus,
  Trees,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { PropertyActionButtons } from './PropertyActionButtons';

export default async function PropertyDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const property = await fetchPropertyById(id);

  if (!property) {
    notFound();
  }

  // Fetch facilities and calculate nearby distances
  const facilities = await fetchFacilities();
  const facilitiesWithDistance = facilities
    .map((f) => ({
      ...f,
      distance_meters: calculateDistance(
        property.latitude,
        property.longitude,
        f.latitude,
        f.longitude
      )
    }))
    .sort((a, b) => a.distance_meters - b.distance_meters)
    .slice(0, 8);

  // Fetch comparable properties in same township/city
  const allProperties = await fetchProperties();
  const comparableProperties = allProperties
    .filter((p) => p.id !== property.id && p.township === property.township)
    .slice(0, 3);

  // Township benchmark price per sqft
  const townshipProperties = allProperties.filter((p) => p.township === property.township);
  const avgTownshipSqft =
    townshipProperties.length > 0
      ? Math.round(
          townshipProperties.reduce((sum, p) => sum + p.price_per_sqft, 0) /
            townshipProperties.length
        )
      : property.price_per_sqft;

  const sqftDifferencePercent =
    avgTownshipSqft > 0
      ? Math.round(((property.price_per_sqft - avgTownshipSqft) / avgTownshipSqft) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 space-y-6">
        {/* Back Link & Title Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Intelligence Map</span>
            </Link>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                property.listing_type === 'sale' ? 'bg-slate-900 text-white' : 'bg-sky-600 text-white'
              }`}>
                For {property.listing_type}
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-800 text-[10px] font-semibold uppercase tracking-wider">
                {property.property_type}
              </span>
              {property.is_verified && (
                <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  Verified Title
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              {property.title}
            </h1>
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{property.address}</span>
            </div>
          </div>

          {/* Pricing Box & Client Interactive Action Buttons */}
          <div className="flex flex-col sm:items-end gap-2 bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
            <div className="text-xs text-slate-500 font-medium">Asking Price</div>
            <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {formatMMK(property.price, false)}
            </div>
            <div className="text-xs font-semibold text-sky-700">
              {formatSqftPrice(property.price_per_sqft, false)}
            </div>
            <PropertyActionButtons propertyId={property.id} />
          </div>
        </div>

        {/* Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2 relative h-72 sm:h-96 rounded-lg overflow-hidden bg-slate-200">
            <Image
              src={property.images[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'}
              alt={property.title}
              fill
              priority
              className="object-cover"
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-1 gap-3">
            <div className="relative h-36 sm:h-[186px] rounded-lg overflow-hidden bg-slate-200">
              <Image
                src={property.images[1] || property.images[0]}
                alt={`${property.title} interior`}
                fill
                className="object-cover"
              />
            </div>
            <div className="relative h-36 sm:h-[186px] rounded-lg overflow-hidden bg-slate-200">
              <Image
                src={property.images[2] || property.images[0]}
                alt={`${property.title} room`}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Content Grid: Specs, Description, Price Intelligence, Location Intelligence */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main 2 Cols */}
          <div className="lg:col-span-2 space-y-6">
            {/* Key Specs Card */}
            <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                Property Specifications
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-md bg-slate-100 text-slate-700">
                    <Maximize2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Floor Area</div>
                    <div className="text-sm font-bold">{property.area_sqft.toLocaleString()} sqft</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-md bg-slate-100 text-slate-700">
                    <Bed className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Bedrooms</div>
                    <div className="text-sm font-bold">{property.bedrooms}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-md bg-slate-100 text-slate-700">
                    <Bath className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Bathrooms</div>
                    <div className="text-sm font-bold">{property.bathrooms}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-md bg-slate-100 text-slate-700">
                    <Car className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Parking Stalls</div>
                    <div className="text-sm font-bold">{property.parking}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Architectural & Property Overview
              </h2>
              <p className="text-sm text-slate-700 leading-relaxed">
                {property.description}
              </p>
            </div>

            {/* Amenities & Features */}
            <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Fixtures & Amenities
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {property.features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded border border-slate-100 bg-slate-50/70 text-xs font-medium text-slate-700 flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-sky-600 flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Intelligence Section (PRD Section 11 & 15) */}
            <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Price Intelligence & Benchmark
                </h2>
                <span className="text-[11px] font-medium text-slate-500">
                  {property.township} Benchmark
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/60">
                  <div className="text-xs text-slate-500">Subject Price / Sqft</div>
                  <div className="text-lg font-bold text-slate-900 mt-1">
                    {formatSqftPrice(property.price_per_sqft, false)}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Calculated: {formatMMK(property.price, true)} / {property.area_sqft} sqft
                  </div>
                </div>

                <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/60">
                  <div className="text-xs text-slate-500">Township Average / Sqft</div>
                  <div className="text-lg font-bold text-slate-900 mt-1">
                    {formatSqftPrice(avgTownshipSqft, false)}
                  </div>
                  <div className={`text-[11px] font-semibold mt-0.5 flex items-center gap-1 ${
                    sqftDifferencePercent <= 0 ? 'text-emerald-600' : 'text-amber-600'
                  }`}>
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>
                      {sqftDifferencePercent > 0 ? `+${sqftDifferencePercent}%` : `${sqftDifferencePercent}%`} vs township average
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Data Classification:</strong> Price-per-square-foot is calculated directly from current seller asking prices. No automated algorithmic valuation is implied.
                </span>
              </div>
            </div>
          </div>

          {/* Right Sidebar: Location Intelligence & Nearby Facilities */}
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Location Intelligence
                </h3>
                <span className="text-[10px] text-slate-400 font-medium">Exact Coordinates</span>
              </div>

              {/* Geographic Coordinates */}
              <div className="p-2.5 rounded bg-slate-50 border border-slate-200 text-xs text-slate-600 flex justify-between">
                <span>Latitude: <strong className="text-slate-800">{property.latitude.toFixed(4)}</strong></span>
                <span>Longitude: <strong className="text-slate-800">{property.longitude.toFixed(4)}</strong></span>
              </div>

              {/* Nearby Facilities List */}
              <div className="space-y-2">
                <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Surrounding Facilities
                </span>

                <div className="divide-y divide-slate-100 text-xs">
                  {facilitiesWithDistance.map((fac) => (
                    <div key={fac.id} className="py-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {fac.type === 'school' && <GraduationCap className="w-4 h-4 text-blue-600" />}
                        {fac.type === 'hospital' && <Hospital className="w-4 h-4 text-red-600" />}
                        {fac.type === 'market' && <ShoppingCart className="w-4 h-4 text-orange-600" />}
                        {fac.type === 'bank' && <Landmark className="w-4 h-4 text-emerald-600" />}
                        {fac.type === 'bus_stop' && <Bus className="w-4 h-4 text-purple-600" />}
                        {fac.type === 'park' && <Trees className="w-4 h-4 text-green-600" />}
                        <div>
                          <div className="font-semibold text-slate-800">{fac.name}</div>
                          <div className="text-[10px] text-slate-400 capitalize">{fac.type} · {fac.township}</div>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                        {formatDistance(fac.distance_meters || 0)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Nearby Comparable Properties */}
            {comparableProperties.length > 0 && (
              <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Nearby Properties in {property.township}
                </h3>
                <div className="space-y-3">
                  {comparableProperties.map((comp) => (
                    <Link
                      key={comp.id}
                      href={`/properties/${comp.id}`}
                      className="group block p-2.5 rounded-lg border border-slate-200 hover:border-slate-400 transition-colors"
                    >
                      <div className="text-xs font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                        {formatMMK(comp.price, true)}
                      </div>
                      <div className="text-xs font-medium text-slate-700 truncate mt-0.5">
                        {comp.title}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center justify-between mt-1">
                        <span>{comp.area_sqft} sqft</span>
                        <span>{formatSqftPrice(comp.price_per_sqft)}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
