'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Property, Facility, FacilityType, PropertyType, ListingType } from '@/types';
import {
  fetchProperties,
  fetchFacilities,
  createOrUpdateProperty,
  deleteProperty,
  createFacility,
  deleteFacility
} from '@/lib/data/store';
import { formatMMK, formatSqftPrice } from '@/lib/geo';
import { Header } from '@/components/layout/Header';
import {
  Shield,
  Plus,
  Trash2,
  Edit2,
  X
} from 'lucide-react';

export default function AdminPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [activeTab, setActiveTab] = useState<'properties' | 'facilities'>('properties');
  const [isEditingProperty, setIsEditingProperty] = useState(false);
  const [isEditingFacility, setIsEditingFacility] = useState(false);

  // Property Form State
  const [propertyForm, setPropertyForm] = useState<Partial<Property>>({
    title: '',
    description: '',
    listing_type: 'sale',
    property_type: 'house',
    price: 150000000,
    area_sqft: 2000,
    bedrooms: 3,
    bathrooms: 2,
    parking: 1,
    latitude: 21.9325,
    longitude: 96.0841,
    address: '',
    township: 'Chanmyathazi',
    city: 'Mandalay',
    images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'],
    features: ['Parking', 'Security'],
    status: 'available',
    is_verified: true
  });

  // Facility Form State
  const [facilityForm, setFacilityForm] = useState<Omit<Facility, 'id'>>({
    name: '',
    type: 'school',
    latitude: 21.9338,
    longitude: 96.0862,
    address: '',
    township: 'Chanmyathazi'
  });

  const loadData = useCallback(async () => {
    const [p, f] = await Promise.all([fetchProperties(), fetchFacilities()]);
    setProperties(p);
    setFacilities(f);
  }, []);

  useEffect(() => {
    let ignore = false;
    async function init() {
      const [p, f] = await Promise.all([fetchProperties(), fetchFacilities()]);
      if (!ignore) {
        setProperties(p);
        setFacilities(f);
      }
    }
    init();
    return () => {
      ignore = true;
    };
  }, []);

  const handleSaveProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    await createOrUpdateProperty(propertyForm);
    setIsEditingProperty(false);
    setPropertyForm({
      title: '',
      description: '',
      listing_type: 'sale',
      property_type: 'house',
      price: 150000000,
      area_sqft: 2000,
      bedrooms: 3,
      bathrooms: 2,
      parking: 1,
      latitude: 21.9325,
      longitude: 96.0841,
      address: '',
      township: 'Chanmyathazi',
      city: 'Mandalay',
      images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'],
      features: ['Parking', 'Security'],
      status: 'available',
      is_verified: true
    });
    await loadData();
  };

  const handleDeleteProperty = async (id: string) => {
    if (confirm('Are you sure you want to delete this property?')) {
      await deleteProperty(id);
      await loadData();
    }
  };

  const handleSaveFacility = async (e: React.FormEvent) => {
    e.preventDefault();
    await createFacility(facilityForm);
    setIsEditingFacility(false);
    setFacilityForm({
      name: '',
      type: 'school',
      latitude: 21.9338,
      longitude: 96.0862,
      address: '',
      township: 'Chanmyathazi'
    });
    await loadData();
  };

  const handleDeleteFacility = async (id: string) => {
    if (confirm('Are you sure you want to delete this facility?')) {
      await deleteFacility(id);
      await loadData();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 space-y-6">
        {/* Title & Overview */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-slate-900" />
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                Administrative Management
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Publish and modify spatial real estate listings and municipal facilities.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {activeTab === 'properties' ? (
              <button
                onClick={() => {
                  setPropertyForm({
                    title: '',
                    description: '',
                    listing_type: 'sale',
                    property_type: 'house',
                    price: 180000000,
                    area_sqft: 2000,
                    bedrooms: 3,
                    bathrooms: 2,
                    parking: 1,
                    latitude: 21.9325,
                    longitude: 96.0841,
                    address: '62nd Street, Chanmyathazi',
                    township: 'Chanmyathazi',
                    city: 'Mandalay',
                    images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'],
                    features: ['Parking', 'Security'],
                    status: 'available',
                    is_verified: true
                  });
                  setIsEditingProperty(true);
                }}
                className="px-3.5 py-1.5 rounded-md bg-slate-900 text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-slate-800 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>New Property Listing</span>
              </button>
            ) : (
              <button
                onClick={() => setIsEditingFacility(true)}
                className="px-3.5 py-1.5 rounded-md bg-slate-900 text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-slate-800 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>New Facility</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab('properties')}
            className={`py-2 px-4 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'properties'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Properties ({properties.length})
          </button>
          <button
            onClick={() => setActiveTab('facilities')}
            className={`py-2 px-4 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'facilities'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Facilities ({facilities.length})
          </button>
        </div>

        {/* PROPERTY LIST / CRUD */}
        {activeTab === 'properties' && (
          <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs divide-y divide-slate-200">
                <thead className="bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-3.5">Title & Location</th>
                    <th className="p-3.5">Type</th>
                    <th className="p-3.5">Price</th>
                    <th className="p-3.5">Price / Sqft</th>
                    <th className="p-3.5">Coordinates</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {properties.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/60">
                      <td className="p-3.5">
                        <div className="font-semibold text-slate-900">{p.title}</div>
                        <div className="text-[11px] text-slate-400">{p.address} ({p.township})</div>
                      </td>
                      <td className="p-3.5 capitalize">
                        {p.property_type} · {p.listing_type}
                      </td>
                      <td className="p-3.5 font-bold text-slate-900">
                        {formatMMK(p.price, true)}
                      </td>
                      <td className="p-3.5 font-medium text-sky-700">
                        {formatSqftPrice(p.price_per_sqft)}
                      </td>
                      <td className="p-3.5 text-slate-500 text-[11px]">
                        {p.latitude.toFixed(4)}, {p.longitude.toFixed(4)}
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          p.status === 'available'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right space-x-1">
                        <button
                          onClick={() => {
                            setPropertyForm(p);
                            setIsEditingProperty(true);
                          }}
                          className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProperty(p.id)}
                          className="p-1 rounded text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* FACILITIES LIST / CRUD */}
        {activeTab === 'facilities' && (
          <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs divide-y divide-slate-200">
                <thead className="bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-3.5">Facility Name</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Township</th>
                    <th className="p-3.5">Address</th>
                    <th className="p-3.5">Coordinates</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {facilities.map((f) => (
                    <tr key={f.id} className="hover:bg-slate-50/60">
                      <td className="p-3.5 font-semibold text-slate-900">
                        {f.name}
                      </td>
                      <td className="p-3.5 capitalize font-medium">
                        {f.type.replace('_', ' ')}
                      </td>
                      <td className="p-3.5 text-slate-600">
                        {f.township}
                      </td>
                      <td className="p-3.5 text-slate-500 text-[11px]">
                        {f.address}
                      </td>
                      <td className="p-3.5 text-slate-500 text-[11px]">
                        {f.latitude.toFixed(4)}, {f.longitude.toFixed(4)}
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => handleDeleteFacility(f.id)}
                          className="p-1 rounded text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CREATE / EDIT PROPERTY MODAL */}
        {isEditingProperty && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-lg border border-slate-200 shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900">
                  {propertyForm.id ? 'Edit Property Listing' : 'Create New Property Listing'}
                </h3>
                <button
                  onClick={() => setIsEditingProperty(false)}
                  className="p-1 text-slate-400 hover:text-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveProperty} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Title</label>
                    <input
                      type="text"
                      required
                      value={propertyForm.title || ''}
                      onChange={(e) => setPropertyForm({ ...propertyForm, title: e.target.value })}
                      className="w-full p-2 rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Township</label>
                    <input
                      type="text"
                      required
                      value={propertyForm.township || ''}
                      onChange={(e) => setPropertyForm({ ...propertyForm, township: e.target.value })}
                      className="w-full p-2 rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-sky-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Listing Type</label>
                    <select
                      value={propertyForm.listing_type || 'sale'}
                      onChange={(e) => setPropertyForm({ ...propertyForm, listing_type: e.target.value as ListingType })}
                      className="w-full p-2 rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-sky-500"
                    >
                      <option value="sale">For Sale</option>
                      <option value="rent">For Rent</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Property Type</label>
                    <select
                      value={propertyForm.property_type || 'house'}
                      onChange={(e) => setPropertyForm({ ...propertyForm, property_type: e.target.value as PropertyType })}
                      className="w-full p-2 rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-sky-500"
                    >
                      <option value="house">House</option>
                      <option value="apartment">Apartment</option>
                      <option value="condo">Condo</option>
                      <option value="land">Land</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Price (MMK)</label>
                    <input
                      type="number"
                      required
                      value={propertyForm.price || 0}
                      onChange={(e) => setPropertyForm({ ...propertyForm, price: Number(e.target.value) })}
                      className="w-full p-2 rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-sky-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Area (sqft)</label>
                    <input
                      type="number"
                      required
                      value={propertyForm.area_sqft || 0}
                      onChange={(e) => setPropertyForm({ ...propertyForm, area_sqft: Number(e.target.value) })}
                      className="w-full p-2 rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Bedrooms</label>
                    <input
                      type="number"
                      value={propertyForm.bedrooms || 0}
                      onChange={(e) => setPropertyForm({ ...propertyForm, bedrooms: Number(e.target.value) })}
                      className="w-full p-2 rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Bathrooms</label>
                    <input
                      type="number"
                      value={propertyForm.bathrooms || 0}
                      onChange={(e) => setPropertyForm({ ...propertyForm, bathrooms: Number(e.target.value) })}
                      className="w-full p-2 rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Parking</label>
                    <input
                      type="number"
                      value={propertyForm.parking || 0}
                      onChange={(e) => setPropertyForm({ ...propertyForm, parking: Number(e.target.value) })}
                      className="w-full p-2 rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-sky-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={propertyForm.latitude || 0}
                      onChange={(e) => setPropertyForm({ ...propertyForm, latitude: Number(e.target.value) })}
                      className="w-full p-2 rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Longitude</label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={propertyForm.longitude || 0}
                      onChange={(e) => setPropertyForm({ ...propertyForm, longitude: Number(e.target.value) })}
                      className="w-full p-2 rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-sky-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Address</label>
                  <input
                    type="text"
                    required
                    value={propertyForm.address || ''}
                    onChange={(e) => setPropertyForm({ ...propertyForm, address: e.target.value })}
                    className="w-full p-2 rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={propertyForm.description || ''}
                    onChange={(e) => setPropertyForm({ ...propertyForm, description: e.target.value })}
                    className="w-full p-2 rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsEditingProperty(false)}
                    className="px-4 py-2 rounded border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded bg-slate-900 text-white font-semibold hover:bg-slate-800"
                  >
                    Save Property
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* CREATE FACILITY MODAL */}
        {isEditingFacility && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-lg border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900">Add New Public Facility</h3>
                <button
                  onClick={() => setIsEditingFacility(false)}
                  className="p-1 text-slate-400 hover:text-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveFacility} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Facility Name</label>
                  <input
                    type="text"
                    required
                    value={facilityForm.name}
                    onChange={(e) => setFacilityForm({ ...facilityForm, name: e.target.value })}
                    className="w-full p-2 rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Facility Type</label>
                  <select
                    value={facilityForm.type}
                    onChange={(e) => setFacilityForm({ ...facilityForm, type: e.target.value as FacilityType })}
                    className="w-full p-2 rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  >
                    <option value="school">School</option>
                    <option value="hospital">Hospital</option>
                    <option value="market">Market</option>
                    <option value="bank">Bank</option>
                    <option value="bus_stop">Bus Stop / Transit</option>
                    <option value="park">Park</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={facilityForm.latitude}
                      onChange={(e) => setFacilityForm({ ...facilityForm, latitude: Number(e.target.value) })}
                      className="w-full p-2 rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Longitude</label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={facilityForm.longitude}
                      onChange={(e) => setFacilityForm({ ...facilityForm, longitude: Number(e.target.value) })}
                      className="w-full p-2 rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-sky-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Township</label>
                  <input
                    type="text"
                    required
                    value={facilityForm.township}
                    onChange={(e) => setFacilityForm({ ...facilityForm, township: e.target.value })}
                    className="w-full p-2 rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Address</label>
                  <input
                    type="text"
                    value={facilityForm.address}
                    onChange={(e) => setFacilityForm({ ...facilityForm, address: e.target.value })}
                    className="w-full p-2 rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsEditingFacility(false)}
                    className="px-4 py-2 rounded border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded bg-slate-900 text-white font-semibold hover:bg-slate-800"
                  >
                    Add Facility
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
