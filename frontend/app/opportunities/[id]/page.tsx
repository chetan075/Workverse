"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../components/AuthProvider';
import { fetchWorkOpportunity, applyToOpportunity, saveOpportunity, unsaveOpportunity } from '../../../lib/api';

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

interface ApplicationForm {
  coverLetter: string;
  proposedRate: number;
  estimatedHours: number;
  deliveryDate: string;
}

export default function OpportunityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  
  const opportunityId = params.id as string;
  const showApplyForm = searchParams.get('apply') === 'true';

  const [opportunity, setOpportunity] = useState<WorkOpportunity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  // Application form state
  const [showApplication, setShowApplication] = useState(showApplyForm);
  const [applying, setApplying] = useState(false);
  const [applicationForm, setApplicationForm] = useState<ApplicationForm>({
    coverLetter: '',
    proposedRate: 0,
    estimatedHours: 0,
    deliveryDate: ''
  });

  useEffect(() => {
    loadOpportunity();
  }, [opportunityId]);

  const loadOpportunity = async () => {
    try {
      setLoading(true);
      // Since the backend doesn't have a single opportunity endpoint yet, 
      // we'll need to fetch all opportunities and find the one we need
      // This is a temporary solution until the backend adds the endpoint
      const opportunities = await import('../../../lib/api').then(api => api.fetchWorkOpportunities());
      const foundOpportunity = opportunities.find((opp: any) => opp.id === opportunityId);
      
      if (foundOpportunity) {
        setOpportunity(foundOpportunity);
        setApplicationForm(prev => ({
          ...prev,
          proposedRate: Math.round(foundOpportunity.budget / foundOpportunity.estimatedHours),
          estimatedHours: foundOpportunity.estimatedHours,
          deliveryDate: foundOpportunity.deadline ? foundOpportunity.deadline.split('T')[0] : ''
        }));
      } else {
        setError('Opportunity not found');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load opportunity');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToggle = async () => {
    if (saving) return;
    
    try {
      setSaving(true);
      if (saved) {
        await unsaveOpportunity(opportunityId);
        setSaved(false);
      } else {
        await saveOpportunity(opportunityId);
        setSaved(true);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save opportunity');
    } finally {
      setSaving(false);
    }
  };

  const handleApplicationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (applying) return;

    try {
      setApplying(true);
      await applyToOpportunity(opportunityId, applicationForm);
      setShowApplication(false);
      // Show success message or redirect
      router.push(`/opportunities?applied=${opportunityId}`);
    } catch (err: any) {
      setError(err.message || 'Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'expert': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just posted';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} days ago`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks} weeks ago`;
  };

  const formatDeadline = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-3 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-white text-lg">Loading opportunity...</span>
        </div>
      </div>
    );
  }

  if (error || !opportunity) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Opportunity Not Found</h2>
          <p className="text-slate-400 mb-6">{error || 'The requested opportunity could not be found.'}</p>
          <Link href="/opportunities" className="px-6 py-3 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors">
            Browse Opportunities
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-600/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/opportunities"
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Opportunities
            </Link>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handleSaveToggle}
                disabled={saving}
                className={`p-2 rounded-lg transition-colors ${
                  saved 
                    ? 'text-emerald-400 bg-emerald-500/20' 
                    : 'text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10'
                }`}
              >
                <svg className="w-5 h-5" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </button>

              {user?.role === 'FREELANCER' && !showApplication && (
                <button
                  onClick={() => setShowApplication(true)}
                  className="px-6 py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors"
                >
                  Apply Now
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Opportunity Header */}
            <div className="panel">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-white mb-2">{opportunity.title}</h1>
                  <p className="text-slate-400">Posted {formatTimeAgo(opportunity.postedAt)}</p>
                </div>
                
                <div className={`px-3 py-2 rounded-lg border ${getDifficultyColor(opportunity.difficulty)}`}>
                  <span className="font-medium">{opportunity.difficulty}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="text-3xl font-bold text-emerald-400">
                  ${opportunity.budget.toLocaleString()} {opportunity.currency}
                </div>
                <div className="text-slate-400">
                  ~{opportunity.estimatedHours} hours
                </div>
                <div className="text-slate-400">
                  ${Math.round(opportunity.budget / opportunity.estimatedHours)}/hour estimated
                </div>
              </div>

              <div className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                {opportunity.description}
              </div>
            </div>

            {/* Skills Required */}
            <div className="panel">
              <h3 className="text-lg font-semibold text-white mb-4">Skills Required</h3>
              <div className="flex flex-wrap gap-2">
                {opportunity.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-2 bg-slate-700/50 text-slate-300 rounded-lg border border-slate-600/30"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Project Details */}
            <div className="panel">
              <h3 className="text-lg font-semibold text-white mb-4">Project Details</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-slate-400 mb-2">Category</h4>
                  <p className="text-white">{opportunity.category}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-slate-400 mb-2">Estimated Duration</h4>
                  <p className="text-white">{opportunity.estimatedHours} hours</p>
                </div>
                
                {opportunity.startDate && (
                  <div>
                    <h4 className="text-sm font-medium text-slate-400 mb-2">Start Date</h4>
                    <p className="text-white">{formatDeadline(opportunity.startDate)}</p>
                  </div>
                )}
                
                {opportunity.deadline && (
                  <div>
                    <h4 className="text-sm font-medium text-slate-400 mb-2">Deadline</h4>
                    <p className="text-white">{formatDeadline(opportunity.deadline)}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Application Form */}
            {showApplication && user?.role === 'FREELANCER' && (
              <div className="panel">
                <h3 className="text-lg font-semibold text-white mb-4">Submit Your Proposal</h3>
                
                <form onSubmit={handleApplicationSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Cover Letter *
                    </label>
                    <textarea
                      value={applicationForm.coverLetter}
                      onChange={(e) => setApplicationForm(prev => ({ ...prev, coverLetter: e.target.value }))}
                      rows={6}
                      className="input-field resize-none"
                      placeholder="Explain why you're the perfect fit for this project..."
                      required
                    />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Proposed Rate (${opportunity.currency}/hour) *
                      </label>
                      <input
                        type="number"
                        value={applicationForm.proposedRate}
                        onChange={(e) => setApplicationForm(prev => ({ ...prev, proposedRate: Number(e.target.value) }))}
                        className="input-field"
                        placeholder="50"
                        min="1"
                        step="0.01"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Estimated Hours *
                      </label>
                      <input
                        type="number"
                        value={applicationForm.estimatedHours}
                        onChange={(e) => setApplicationForm(prev => ({ ...prev, estimatedHours: Number(e.target.value) }))}
                        className="input-field"
                        placeholder={opportunity.estimatedHours.toString()}
                        min="1"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Delivery Date *
                    </label>
                    <input
                      type="date"
                      value={applicationForm.deliveryDate}
                      onChange={(e) => setApplicationForm(prev => ({ ...prev, deliveryDate: e.target.value }))}
                      className="input-field"
                      min={new Date().toISOString().split('T')[0]}
                      max={opportunity.deadline?.split('T')[0]}
                      required
                    />
                  </div>
                  
                  <div className="bg-slate-700/30 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-slate-400">Total Project Cost:</span>
                      <span className="text-xl font-bold text-emerald-400">
                        ${(applicationForm.proposedRate * applicationForm.estimatedHours).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500">
                      {applicationForm.proposedRate} × {applicationForm.estimatedHours} hours
                    </p>
                  </div>
                  
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setShowApplication(false)}
                      className="px-6 py-3 bg-slate-600 text-white rounded-lg font-medium hover:bg-slate-500 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={applying}
                      className="flex-1 px-6 py-3 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {applying && (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      )}
                      {applying ? 'Submitting...' : 'Submit Proposal'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Client Information */}
            <div className="panel">
              <h3 className="text-lg font-semibold text-white mb-4">About the Client</h3>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg font-bold">
                    {opportunity.client.name[0].toUpperCase()}
                  </span>
                </div>
                <div>
                  <h4 className="font-medium text-white">{opportunity.client.name}</h4>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400">★</span>
                    <span className="text-sm text-slate-400">
                      {opportunity.client.averageRating.toFixed(1)} rating
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Projects Completed</span>
                  <span className="text-white font-medium">{opportunity.client.completedProjects}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Reputation Score</span>
                  <span className="text-white font-medium">{Math.round(opportunity.client.reputation)}</span>
                </div>
              </div>
              
              <button className="w-full mt-4 px-4 py-2 bg-slate-700 text-white rounded-lg font-medium hover:bg-slate-600 transition-colors">
                View Client Profile
              </button>
            </div>

            {/* Quick Stats */}
            <div className="panel">
              <h3 className="text-lg font-semibold text-white mb-4">Project Summary</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-slate-400">Budget</span>
                  <span className="text-emerald-400 font-bold">
                    ${opportunity.budget.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-slate-400">Duration</span>
                  <span className="text-white">{opportunity.estimatedHours}h</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-slate-400">Hourly Rate</span>
                  <span className="text-white">
                    ~${Math.round(opportunity.budget / opportunity.estimatedHours)}/hr
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-slate-400">Experience Level</span>
                  <span className="text-white">{opportunity.difficulty}</span>
                </div>
              </div>
            </div>

            {/* Similar Opportunities */}
            <div className="panel">
              <h3 className="text-lg font-semibold text-white mb-4">Similar Opportunities</h3>
              <div className="space-y-3">
                <div className="p-3 bg-slate-700/30 rounded-lg">
                  <h4 className="text-sm font-medium text-white mb-1">Web App Development</h4>
                  <p className="text-xs text-slate-400 mb-2">$2,500 • Expert Level</p>
                  <div className="flex gap-1">
                    <span className="px-2 py-1 bg-slate-600 text-xs text-slate-300 rounded">React</span>
                    <span className="px-2 py-1 bg-slate-600 text-xs text-slate-300 rounded">Node.js</span>
                  </div>
                </div>
                
                <div className="p-3 bg-slate-700/30 rounded-lg">
                  <h4 className="text-sm font-medium text-white mb-1">Mobile App UI/UX</h4>
                  <p className="text-xs text-slate-400 mb-2">$1,800 • Intermediate</p>
                  <div className="flex gap-1">
                    <span className="px-2 py-1 bg-slate-600 text-xs text-slate-300 rounded">Figma</span>
                    <span className="px-2 py-1 bg-slate-600 text-xs text-slate-300 rounded">Design</span>
                  </div>
                </div>
              </div>
              
              <Link href="/opportunities" className="block mt-4 text-center text-emerald-400 hover:text-emerald-300 transition-colors text-sm">
                View All Opportunities →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}