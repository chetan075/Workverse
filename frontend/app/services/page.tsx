"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../components/AuthProvider';
import { fetchServices } from '../../lib/api';

interface Service {
  id: string;
  title: string;
  description: string;
  category: string;
  estimatedHours: number;
  hourlyRate: number;
  totalPrice: number;
  freelancer: {
    id: string;
    name: string;
    reputation: number;
    completedProjects: number;
  };
  skills: string[];
  availability: string;
  responseTime: string;
}

interface Filters {
  category: string;
  priceRange: string;
  minPrice: string;
  maxPrice: string;
  search: string;
  sortBy: string;
}

const CATEGORIES = [
  'All Categories',
  'Web Development',
  'Mobile Development',
  'Design',
  'Data Analysis',
  'Writing',
  'General'
];

const PRICE_RANGES = [
  { label: 'All Prices', value: '' },
  { label: 'Under $500', value: '0-500' },
  { label: '$500 - $1,500', value: '500-1500' },
  { label: '$1,500 - $3,000', value: '1500-3000' },
  { label: '$3,000+', value: '3000-999999' }
];

const SORT_OPTIONS = [
  { label: 'Most Relevant', value: 'relevant' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Best Rated', value: 'rating-desc' },
  { label: 'Most Experienced', value: 'experience-desc' }
];

export default function ServicesPage() {
  const { user } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [compareList, setCompareList] = useState<Set<string>>(new Set());

  const [filters, setFilters] = useState<Filters>({
    category: 'All Categories',
    priceRange: '',
    minPrice: '',
    maxPrice: '',
    search: '',
    sortBy: 'relevant'
  });

  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadServices();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [services, filters]);

  const loadServices = async () => {
    try {
      setLoading(true);
      const data = await fetchServices();
      setServices(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...services];

    // Search filter
    if (filters.search.trim()) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(service =>
        service.title.toLowerCase().includes(searchTerm) ||
        service.description.toLowerCase().includes(searchTerm) ||
        service.skills.some(skill => skill.toLowerCase().includes(searchTerm)) ||
        service.freelancer.name.toLowerCase().includes(searchTerm)
      );
    }

    // Category filter
    if (filters.category !== 'All Categories') {
      filtered = filtered.filter(service => service.category === filters.category);
    }

    // Price range filter
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(p => parseInt(p));
      filtered = filtered.filter(service => 
        service.totalPrice >= min && service.totalPrice <= max
      );
    }

    // Custom price filters
    if (filters.minPrice) {
      const minPrice = parseFloat(filters.minPrice);
      filtered = filtered.filter(service => service.totalPrice >= minPrice);
    }

    if (filters.maxPrice) {
      const maxPrice = parseFloat(filters.maxPrice);
      filtered = filtered.filter(service => service.totalPrice <= maxPrice);
    }

    // Sort results
    switch (filters.sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.totalPrice - b.totalPrice);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.totalPrice - a.totalPrice);
        break;
      case 'rating-desc':
        filtered.sort((a, b) => b.freelancer.reputation - a.freelancer.reputation);
        break;
      case 'experience-desc':
        filtered.sort((a, b) => b.freelancer.completedProjects - a.freelancer.completedProjects);
        break;
      default:
        // Keep original order for 'relevant'
        break;
    }

    setFilteredServices(filtered);
  };

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: 'All Categories',
      priceRange: '',
      minPrice: '',
      maxPrice: '',
      search: '',
      sortBy: 'relevant'
    });
  };

  const toggleCompare = (serviceId: string) => {
    const newCompareList = new Set(compareList);
    if (newCompareList.has(serviceId)) {
      newCompareList.delete(serviceId);
    } else if (newCompareList.size < 3) { // Limit to 3 comparisons
      newCompareList.add(serviceId);
    }
    setCompareList(newCompareList);
  };

  const getDeliveryEstimate = (hours: number) => {
    const days = Math.ceil(hours / 8); // Assuming 8 hours per day
    if (days === 1) return '1 day';
    if (days <= 7) return `${days} days`;
    const weeks = Math.ceil(days / 7);
    return `${weeks} week${weeks > 1 ? 's' : ''}`;
  };

  const getReputationColor = (reputation: number) => {
    if (reputation >= 4.5) return 'text-emerald-400';
    if (reputation >= 4.0) return 'text-blue-400';
    if (reputation >= 3.5) return 'text-yellow-400';
    return 'text-slate-400';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 border-3 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-white text-lg">Loading services...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Services Marketplace</h1>
            <p className="text-slate-400">
              Discover {filteredServices.length} professional services from expert freelancers
            </p>
          </div>
          
          <div className="mt-4 lg:mt-0 flex items-center gap-4">
            {compareList.size > 0 && (
              <Link
                href={`/services/compare?ids=${Array.from(compareList).join(',')}`}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l-3 3m12 6V6l3 3" />
                </svg>
                Compare ({compareList.size})
              </Link>
            )}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="panel mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <svg className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  placeholder="Search services, skills, or freelancers..."
                  className="input-field pl-10"
                />
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="lg:w-48">
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="input-field"
              >
                {SORT_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-3 bg-slate-700 text-white rounded-lg font-medium hover:bg-slate-600 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
              </svg>
              Filters
              {(filters.category !== 'All Categories' || filters.priceRange || filters.minPrice || filters.maxPrice) && (
                <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
              )}
            </button>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="pt-6 border-t border-slate-600/20">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="input-field"
                  >
                    {CATEGORIES.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Price Range</label>
                  <select
                    value={filters.priceRange}
                    onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                    className="input-field"
                  >
                    {PRICE_RANGES.map(range => (
                      <option key={range.value} value={range.value}>{range.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Min Price ($)</label>
                  <input
                    type="number"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    placeholder="500"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Max Price ($)</label>
                  <input
                    type="number"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    placeholder="5000"
                    className="input-field"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div className="panel border-red-500/20 bg-red-500/10 mb-8">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span className="text-red-300">{error}</span>
            </div>
          </div>
        )}

        {/* Services Grid */}
        {filteredServices.length === 0 ? (
          <div className="panel text-center py-12">
            <svg className="w-24 h-24 text-slate-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2z" />
            </svg>
            <h3 className="text-xl font-semibold text-white mb-2">No Services Found</h3>
            <p className="text-slate-400">
              {filters.search || filters.category !== 'All Categories' || filters.priceRange || filters.minPrice || filters.maxPrice
                ? 'Try adjusting your filters to see more services'
                : 'There are no services available at the moment'
              }
            </p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="panel hover:border-emerald-500/30 transition-all duration-200 group relative"
              >
                {/* Compare Checkbox */}
                <div className="absolute top-4 right-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={compareList.has(service.id)}
                      onChange={() => toggleCompare(service.id)}
                      className="w-4 h-4 text-emerald-500 bg-slate-700 border-slate-600 rounded focus:ring-emerald-500"
                      disabled={!compareList.has(service.id) && compareList.size >= 3}
                    />
                    <span className="text-xs text-slate-400">Compare</span>
                  </label>
                </div>

                {/* Service Header */}
                <div className="mb-4 pr-20">
                  <Link
                    href={`/services/${service.id}`}
                    className="text-lg font-semibold text-white group-hover:text-emerald-400 transition-colors line-clamp-2"
                  >
                    {service.title}
                  </Link>
                  <p className="text-sm text-slate-400 mt-1">{service.category}</p>
                </div>

                {/* Freelancer Info */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {service.freelancer.name[0].toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{service.freelancer.name}</p>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs ${getReputationColor(service.freelancer.reputation)}`}>
                        ★ {service.freelancer.reputation.toFixed(1)}
                      </span>
                      <span className="text-xs text-slate-400">
                        ({service.freelancer.completedProjects} projects)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-slate-300 text-sm mb-4 line-clamp-3">
                  {service.description}
                </p>

                {/* Skills */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {service.skills.slice(0, 3).map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-slate-700/50 text-slate-300 text-xs rounded"
                    >
                      {skill}
                    </span>
                  ))}
                  {service.skills.length > 3 && (
                    <span className="px-2 py-1 bg-slate-700/50 text-slate-400 text-xs rounded">
                      +{service.skills.length - 3}
                    </span>
                  )}
                </div>

                {/* Service Details */}
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <p className="text-slate-400">Delivery</p>
                    <p className="text-white">{getDeliveryEstimate(service.estimatedHours)}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Response</p>
                    <p className="text-white">{service.responseTime}</p>
                  </div>
                </div>

                {/* Pricing */}
                <div className="border-t border-slate-600/20 pt-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-emerald-400">
                        ${service.totalPrice.toLocaleString()}
                      </p>
                      <p className="text-xs text-slate-400">
                        ${service.hourlyRate}/hr × {service.estimatedHours}h
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-400">Starting at</p>
                      <p className="text-sm text-white font-medium">{service.availability}</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Link
                    href={`/services/${service.id}`}
                    className="flex-1 px-4 py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors text-center"
                  >
                    View Details
                  </Link>
                  {user?.role === 'CLIENT' && (
                    <Link
                      href={`/services/${service.id}?hire=true`}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
                    >
                      Hire
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load More */}
        {filteredServices.length > 0 && filteredServices.length % 20 === 0 && (
          <div className="text-center mt-8">
            <button className="px-6 py-3 bg-slate-700 text-white rounded-lg font-medium hover:bg-slate-600 transition-colors">
              Load More Services
            </button>
          </div>
        )}

        {/* Compare Fixed Panel */}
        {compareList.size > 0 && (
          <div className="fixed bottom-6 right-6 bg-slate-800 border border-slate-600 rounded-lg p-4 shadow-xl z-50">
            <div className="flex items-center gap-3">
              <span className="text-white font-medium">
                {compareList.size} service{compareList.size > 1 ? 's' : ''} selected
              </span>
              <Link
                href={`/services/compare?ids=${Array.from(compareList).join(',')}`}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Compare
              </Link>
              <button
                onClick={() => setCompareList(new Set())}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}