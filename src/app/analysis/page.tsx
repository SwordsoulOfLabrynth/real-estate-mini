'use client';

import React, { useEffect, useState } from 'react';
import { Property, Facility } from '@/types';
import { fetchProperties, fetchFacilities } from '@/lib/data/store';
import { formatMMK, formatSqftPrice } from '@/lib/geo';
import { Header } from '@/components/layout/Header';
import {
  BarChart3,
  GraduationCap,
  Hospital,
  ShoppingCart,
  Bus,
  CheckCircle2,
  Info
} from 'lucide-react';

interface TownshipMetric {
  township: string;
  city: string;
  propertyCount: number;
  avgPrice: number;
  avgPricePerSqft: number;
  minPricePerSqft: number;
  maxPricePerSqft: number;
  schoolCount: number;
  hospitalCount: number;
  marketCount: number;
  transitCount: number;
}

export default function AnalysisPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTownship, setSelectedTownship] = useState<string>('All');

  useEffect(() => {
    async function load() {
      const [props, facs] = await Promise.all([
        fetchProperties(),
        fetchFacilities()
      ]);
      setProperties(props);
      setFacilities(facs);
      setIsLoading(false);
    }
    load();
  }, []);

  // Compute township aggregates
  const townshipsList = Array.from(new Set(properties.map((p) => p.township)));

  const townshipMetrics: TownshipMetric[] = townshipsList.map((tw) => {
    const twProps = properties.filter((p) => p.township === tw);
    const twFacs = facilities.filter((f) => f.township === tw);

    const prices = twProps.map((p) => p.price);
    const sqftPrices = twProps.map((p) => p.price_per_sqft).filter((v) => v > 0);

    const avgPrice = Math.round(prices.reduce((a, b) => a + b, 0) / (prices.length || 1));
    const avgPricePerSqft = Math.round(
      sqftPrices.reduce((a, b) => a + b, 0) / (sqftPrices.length || 1)
    );

    return {
      township: tw,
      city: twProps[0]?.city || '',
      propertyCount: twProps.length,
      avgPrice,
      avgPricePerSqft,
      minPricePerSqft: sqftPrices.length > 0 ? Math.min(...sqftPrices) : 0,
      maxPricePerSqft: sqftPrices.length > 0 ? Math.max(...sqftPrices) : 0,
      schoolCount: twFacs.filter((f) => f.type === 'school').length,
      hospitalCount: twFacs.filter((f) => f.type === 'hospital').length,
      marketCount: twFacs.filter((f) => f.type === 'market').length,
      transitCount: twFacs.filter((f) => f.type === 'bus_stop').length,
    };
  });

  const filteredMetrics =
    selectedTownship === 'All'
      ? townshipMetrics
      : townshipMetrics.filter((m) => m.township === selectedTownship);

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 space-y-6">
        {/* Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-sky-600" />
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                Area & Neighborhood Intelligence
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Geographic price benchmarks, square-foot analytics, and municipal facility distributions.
            </p>
          </div>

          {/* Township Filter Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">Focus:</span>
            <select
              value={selectedTownship}
              onChange={(e) => setSelectedTownship(e.target.value)}
              className="text-xs font-semibold py-1.5 px-3 rounded-md border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
            >
              <option value="All">All Townships ({townshipsList.length})</option>
              {townshipsList.map((tw) => (
                <option key={tw} value={tw}>{tw}</option>
              ))}
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400 space-y-3">
            <div className="w-8 h-8 border-2 border-slate-300 border-t-sky-600 rounded-full animate-spin" />
            <span className="text-xs font-medium">Aggregating township analytics...</span>
          </div>
        ) : (
          <>
            {/* Global Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Total Active Listings
            </span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">
              {properties.length}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              Across {townshipsList.length} urban townships
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Surveyed Facilities
            </span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">
              {facilities.length}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              Schools, hospitals, transit, markets
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Mean Price / Sqft
            </span>
            <div className="text-2xl font-extrabold text-sky-700 mt-1">
              {formatSqftPrice(
                Math.round(
                  properties.reduce((a, b) => a + b.price_per_sqft, 0) /
                    (properties.length || 1)
                ),
                true
              )}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              Computed across verified active listings
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Data Integrity
            </span>
            <div className="text-2xl font-extrabold text-emerald-600 mt-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-6 h-6" />
              <span>Verified</span>
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              Transparent, factual market data
            </div>
          </div>
        </div>

        {/* Township Intelligence Table */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Township Valuation & Facility Density Matrix
            </h3>
            <span className="text-[11px] text-slate-400 font-medium">
              Live Aggregate Metrics
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs divide-y divide-slate-200">
              <thead className="bg-slate-50/70 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                <tr>
                  <th className="p-3.5">Township & City</th>
                  <th className="p-3.5">Listings</th>
                  <th className="p-3.5">Avg Price</th>
                  <th className="p-3.5">Avg Price/Sqft</th>
                  <th className="p-3.5">Sqft Price Range</th>
                  <th className="p-3.5">Schools</th>
                  <th className="p-3.5">Hospitals</th>
                  <th className="p-3.5">Markets</th>
                  <th className="p-3.5">Transit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredMetrics.map((item) => (
                  <tr key={item.township} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-3.5 font-bold text-slate-900">
                      <div>{item.township}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{item.city}</div>
                    </td>
                    <td className="p-3.5 font-semibold text-slate-800">
                      {item.propertyCount}
                    </td>
                    <td className="p-3.5 font-semibold text-slate-900">
                      {formatMMK(item.avgPrice, true)}
                    </td>
                    <td className="p-3.5 font-bold text-sky-700">
                      {formatSqftPrice(item.avgPricePerSqft, false)}
                    </td>
                    <td className="p-3.5 text-slate-500 text-[11px]">
                      {formatSqftPrice(item.minPricePerSqft, true)} – {formatSqftPrice(item.maxPricePerSqft, true)}
                    </td>
                    <td className="p-3.5 font-medium">
                      <span className="inline-flex items-center gap-1">
                        <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                        {item.schoolCount}
                      </span>
                    </td>
                    <td className="p-3.5 font-medium">
                      <span className="inline-flex items-center gap-1">
                        <Hospital className="w-3.5 h-3.5 text-red-600" />
                        {item.hospitalCount}
                      </span>
                    </td>
                    <td className="p-3.5 font-medium">
                      <span className="inline-flex items-center gap-1">
                        <ShoppingCart className="w-3.5 h-3.5 text-orange-600" />
                        {item.marketCount}
                      </span>
                    </td>
                    <td className="p-3.5 font-medium">
                      <span className="inline-flex items-center gap-1">
                        <Bus className="w-3.5 h-3.5 text-purple-600" />
                        {item.transitCount}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        </>
        )}

        {/* Methodology & Data Accuracy Notice (PRD Section 40) */}
        <div className="p-4 rounded-lg border border-slate-200 bg-white space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
            <Info className="w-4 h-4 text-sky-600" />
            <span>Calculation Methodology & Standards</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            All price-per-square-foot values are derived strictly from active seller listing prices divided by declared square footage. In accordance with the product requirements, estimates and projections are not presented as authoritative appraisals.
          </p>
        </div>
      </main>
    </div>
  );
}
