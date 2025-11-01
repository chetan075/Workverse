"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../components/AuthProvider';
import { fetchWorkOpportunities } from '../../lib/api';

interface WorkOpportunity {
  id: string;
  title: string;
  description: string;
  budget: number;
  currency: string;
  category: string;
  difficulty: string;
  estimatedHours: number;
  skills: string[];
  client: {
    id: string;
    name: string;
    reputation: number;
    averageRating: number;
    completedProjects: number;
  };
  postedAt: string;
  deadline?: string;
  startDate?: string;
}

interface Filters {
  category: string;
  difficulty: string;
  minBudget: string;
  maxBudget: string;
  search: string;
}

const CATEGORIES = [
  'All Categories',
  'Web Development',
  'Mobile Development',
  'Design',
  'Data Science',
  'Backend Development',
  'Writing',
  'Other'
];

const DIFFICULTIES = [
  'All Levels',
  'Beginner',
  'Intermediate',
  'Expert'
];

export default function OpportunitiesPage() {
  const { user } = useAuth();
  const [opportunities, setOpportunities] = useState<WorkOpportunity[]>([]);
  const [filteredOpportunities, setFilteredOpportunities] = useState<WorkOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savedOpportunities, setSavedOpportunities] = useState<Set<string>>(new Set());

  const [filters, setFilters] = useState<Filters>({
    category: 'All Categories',
    difficulty: 'All Levels',
    minBudget: '',
    maxBudget: '',
    search: ''
  });

  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadOpportunities();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [opportunities, filters]);

  const loadOpportunities = async () => {
    try {
      setLoading(true);
      const data = await fetchWorkOpportunities();
      setOpportunities(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load opportunities');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...opportunities];

    // Search filter
    if (filters.search.trim()) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(opp =>
        opp.title.toLowerCase().includes(searchTerm) ||
        opp.description.toLowerCase().includes(searchTerm) ||
        opp.skills.some(skill => skill.toLowerCase().includes(searchTerm))
      );
    }

    // Category filter
    if (filters.category !== 'All Categories') {
      filtered = filtered.filter(opp => opp.category === filters.category);
    }

    // Difficulty filter
    if (filters.difficulty !== 'All Levels') {
      filtered = filtered.filter(opp => opp.difficulty === filters.difficulty);
    }

    // Budget filters
    if (filters.minBudget) {
      const minBudget = parseFloat(filters.minBudget);
      filtered = filtered.filter(opp => opp.budget >= minBudget);
    }

    if (filters.maxBudget) {
      const maxBudget = parseFloat(filters.maxBudget);
      filtered = filtered.filter(opp => opp.budget <= maxBudget);
    }

    setFilteredOpportunities(filtered);
  };

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: 'All Categories',
      difficulty: 'All Levels',
      minBudget: '',
      maxBudget: '',
      search: ''
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'bg-emerald-500/20 text-emerald-400';
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-400';
      case 'expert': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just posted';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks}w ago`;
  };

  const formatDeadline = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 border-3 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-white text-lg">Loading opportunities...</span>
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
            <h1 className="text-3xl font-bold text-white mb-2">Work Opportunities</h1>
            <p className="text-slate-400">
              Discover {filteredOpportunities.length} exciting projects waiting for your expertise
            </p>
          </div>
          
          {user?.role === 'CLIENT' && (
            <Link
              href="/opportunities/create"
              className="mt-4 lg:mt-0 px-6 py-3 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors inline-flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Post New Opportunity
            </Link>
          )}
        </div>

        {/* Search and Filters */}
        <div className="panel mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
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
                  placeholder="Search opportunities by title, description, or skills..."
                  className="input-field pl-10"
                />
              </div>
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
              {(filters.category !== 'All Categories' || filters.difficulty !== 'All Levels' || filters.minBudget || filters.maxBudget) && (
                <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
              )}
            </button>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-slate-600/20">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                  <label className="block text-sm font-medium text-slate-300 mb-2">Difficulty</label>
                  <select
                    value={filters.difficulty}
                    onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                    className="input-field"
                  >
                    {DIFFICULTIES.map(difficulty => (
                      <option key={difficulty} value={difficulty}>{difficulty}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Min Budget ($)</label>
                  <input
                    type="number"
                    value={filters.minBudget}
                    onChange={(e) => handleFilterChange('minBudget', e.target.value)}
                    placeholder="500"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Max Budget ($)</label>
                  <input
                    type="number"
                    value={filters.maxBudget}
                    onChange={(e) => handleFilterChange('maxBudget', e.target.value)}
                    placeholder="5000"
                    className="input-field"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-4">
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

        {/* Opportunities Grid */}
        {filteredOpportunities.length === 0 ? (
          <div className="panel text-center py-12">
            <svg className="w-24 h-24 text-slate-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2z" />
            </svg>
            <h3 className="text-xl font-semibold text-white mb-2">No Opportunities Found</h3>
            <p className="text-slate-400">
              {filters.search || filters.category !== 'All Categories' || filters.difficulty !== 'All Levels' || filters.minBudget || filters.maxBudget
                ? 'Try adjusting your filters to see more opportunities'
                : 'There are no work opportunities available at the moment'
              }
            </p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredOpportunities.map((opportunity) => (
              <div
                key={opportunity.id}
                className="panel hover:border-emerald-500/30 transition-all duration-200 group"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <Link
                      href={`/opportunities/${opportunity.id}`}
                      className="text-lg font-semibold text-white group-hover:text-emerald-400 transition-colors line-clamp-2"
                    >
                      {opportunity.title}
                    </Link>
                    <p className="text-sm text-slate-400 mt-1">{formatTimeAgo(opportunity.postedAt)}</p>
                  </div>
                  
                  <button className="text-slate-400 hover:text-emerald-400 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </button>
                </div>

                {/* Budget and Details */}
                <div className="flex items-center justify-between mb-4">
                  <div className="text-2xl font-bold text-emerald-400">
                    ${opportunity.budget.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${getDifficultyColor(opportunity.difficulty)}`}>
                      {opportunity.difficulty}
                    </span>
                    <span className="text-sm text-slate-400">
                      ~{opportunity.estimatedHours}h
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-slate-300 text-sm mb-4 line-clamp-3">
                  {opportunity.description}
                </p>

                {/* Skills */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {opportunity.skills.slice(0, 3).map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-slate-700/50 text-slate-300 text-xs rounded"
                    >
                      {skill}
                    </span>
                  ))}
                  {opportunity.skills.length > 3 && (
                    <span className="px-2 py-1 bg-slate-700/50 text-slate-400 text-xs rounded">
                      +{opportunity.skills.length - 3} more
                    </span>
                  )}
                </div>

                {/* Client Info */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-600/20">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">
                        {opportunity.client.name[0].toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{opportunity.client.name}</p>
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-400 text-xs">★</span>
                        <span className="text-xs text-slate-400">
                          {opportunity.client.averageRating.toFixed(1)} ({opportunity.client.completedProjects} projects)
                        </span>
                      </div>
                    </div>
                  </div>

                  {opportunity.deadline && (
                    <div className="text-right">
                      <p className="text-xs text-slate-400">Deadline</p>
                      <p className="text-sm text-white">{formatDeadline(opportunity.deadline)}</p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-4">
                  <Link
                    href={`/opportunities/${opportunity.id}`}
                    className="flex-1 px-4 py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors text-center"
                  >
                    View Details
                  </Link>
                  {user?.role === 'FREELANCER' && (
                    <Link
                      href={`/opportunities/${opportunity.id}?apply=true`}
                      className="px-4 py-2 bg-slate-700 text-white rounded-lg font-medium hover:bg-slate-600 transition-colors"
                    >
                      Apply
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load More */}
        {filteredOpportunities.length > 0 && filteredOpportunities.length % 20 === 0 && (
          <div className="text-center mt-8">
            <button className="px-6 py-3 bg-slate-700 text-white rounded-lg font-medium hover:bg-slate-600 transition-colors">
              Load More Opportunities
            </button>
          </div>
        )}
      </div>
    </div>
  );
}