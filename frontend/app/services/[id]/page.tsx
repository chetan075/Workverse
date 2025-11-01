"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../components/AuthProvider';
import { fetchService, hireFreelancerForService, contactFreelancer, requestCustomQuote } from '../../../lib/api';

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

interface HireForm {
  message: string;
  budget: number;
  timeline: string;
  requirements: string;
}

interface ContactForm {
  subject: string;
  body: string;
}

interface QuoteForm {
  serviceType: string;
  description: string;
  budget: number;
  timeline: string;
}

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  
  const serviceId = params.id as string;
  const showHireForm = searchParams.get('hire') === 'true';

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'hire' | 'contact' | 'quote'>('overview');

  // Form states
  const [submitting, setSubmitting] = useState(false);
  const [hireForm, setHireForm] = useState<HireForm>({
    message: '',
    budget: 0,
    timeline: '',
    requirements: ''
  });

  const [contactForm, setContactForm] = useState<ContactForm>({
    subject: '',
    body: ''
  });

  const [quoteForm, setQuoteForm] = useState<QuoteForm>({
    serviceType: '',
    description: '',
    budget: 0,
    timeline: ''
  });

  useEffect(() => {
    loadService();
  }, [serviceId]);

  useEffect(() => {
    if (showHireForm) {
      setActiveTab('hire');
    }
  }, [showHireForm]);

  const loadService = async () => {
    try {
      setLoading(true);
      const serviceData = await fetchService(serviceId);
      
      if (serviceData) {
        setService(serviceData);
        setHireForm(prev => ({
          ...prev,
          budget: serviceData.totalPrice,
          timeline: getEstimatedDelivery(serviceData.estimatedHours)
        }));
        setContactForm(prev => ({
          ...prev,
          subject: `Inquiry about ${serviceData.title}`
        }));
        setQuoteForm(prev => ({
          ...prev,
          serviceType: serviceData.category,
          budget: serviceData.totalPrice
        }));
      } else {
        setError('Service not found');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load service');
    } finally {
      setLoading(false);
    }
  };

  const handleHire = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!service || submitting) return;

    try {
      setSubmitting(true);
      await hireFreelancerForService(serviceId, service.freelancer.id, hireForm);
      router.push(`/services?hired=${serviceId}`);
    } catch (err: any) {
      setError(err.message || 'Failed to hire freelancer');
    } finally {
      setSubmitting(false);
    }
  };

  const handleContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!service || submitting) return;

    try {
      setSubmitting(true);
      await contactFreelancer(service.freelancer.id, {
        ...contactForm,
        serviceId
      });
      setContactForm({ subject: '', body: '' });
      setActiveTab('overview');
      // Show success message
    } catch (err: any) {
      setError(err.message || 'Failed to send message');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuoteRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!service || submitting) return;

    try {
      setSubmitting(true);
      await requestCustomQuote(service.freelancer.id, quoteForm);
      setQuoteForm({
        serviceType: service.category,
        description: '',
        budget: service.totalPrice,
        timeline: ''
      });
      setActiveTab('overview');
      // Show success message
    } catch (err: any) {
      setError(err.message || 'Failed to request quote');
    } finally {
      setSubmitting(false);
    }
  };

  const getEstimatedDelivery = (hours: number) => {
    const days = Math.ceil(hours / 8);
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-3 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-white text-lg">Loading service...</span>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Service Not Found</h2>
          <p className="text-slate-400 mb-6">{error || 'The requested service could not be found.'}</p>
          <Link href="/services" className="px-6 py-3 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors">
            Browse Services
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
          <Link
            href="/services"
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Services
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Service Header */}
            <div className="panel">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-white mb-2">{service.title}</h1>
                  <p className="text-slate-400">{service.category}</p>
                </div>
                
                <div className="text-right">
                  <div className="text-3xl font-bold text-emerald-400 mb-1">
                    ${service.totalPrice.toLocaleString()}
                  </div>
                  <p className="text-sm text-slate-400">
                    ${service.hourlyRate}/hr × {service.estimatedHours}h
                  </p>
                </div>
              </div>

              <div className="prose prose-invert max-w-none">
                <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {service.description}
                </p>
              </div>
            </div>

            {/* Skills */}
            <div className="panel">
              <h3 className="text-lg font-semibold text-white mb-4">Skills & Technologies</h3>
              <div className="flex flex-wrap gap-3">
                {service.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-2 bg-emerald-500/20 text-emerald-300 rounded-lg border border-emerald-500/30"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Service Details */}
            <div className="panel">
              <h3 className="text-lg font-semibold text-white mb-4">Service Details</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-slate-400 mb-2">Delivery Time</h4>
                  <p className="text-white font-medium">{getEstimatedDelivery(service.estimatedHours)}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-slate-400 mb-2">Response Time</h4>
                  <p className="text-white font-medium">{service.responseTime}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-slate-400 mb-2">Availability</h4>
                  <p className="text-emerald-400 font-medium">{service.availability}</p>
                </div>
              </div>
            </div>

            {/* Action Tabs */}
            {user?.role === 'CLIENT' && (
              <div className="panel">
                <div className="flex border-b border-slate-600/20 mb-6">
                  {[
                    { id: 'overview', label: 'Overview', icon: '📋' },
                    { id: 'hire', label: 'Hire Now', icon: '💼' },
                    { id: 'contact', label: 'Contact', icon: '💬' },
                    { id: 'quote', label: 'Custom Quote', icon: '💰' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`px-4 py-3 text-sm font-medium transition-colors ${
                        activeTab === tab.id
                          ? 'text-emerald-400 border-b-2 border-emerald-400'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <span className="mr-2">{tab.icon}</span>
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                {activeTab === 'overview' && (
                  <div className="space-y-4">
                    <div className="bg-slate-700/30 rounded-lg p-4">
                      <h4 className="text-white font-medium mb-2">What's Included</h4>
                      <ul className="text-slate-300 space-y-1">
                        <li>• Professional {service.category.toLowerCase()} service</li>
                        <li>• {service.estimatedHours} hours of dedicated work</li>
                        <li>• Expert-level implementation</li>
                        <li>• Delivery within {getEstimatedDelivery(service.estimatedHours)}</li>
                        <li>• {service.responseTime} response time</li>
                        <li>• Post-delivery support</li>
                      </ul>
                    </div>
                    
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                      <h4 className="text-blue-400 font-medium mb-2">Ready to get started?</h4>
                      <p className="text-slate-300 mb-4">
                        Contact {service.freelancer.name} to discuss your project or hire them directly for this service.
                      </p>
                      <div className="flex gap-3">
                        <button
                          onClick={() => setActiveTab('hire')}
                          className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                        >
                          Hire Now
                        </button>
                        <button
                          onClick={() => setActiveTab('contact')}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                          Send Message
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'hire' && (
                  <form onSubmit={handleHire} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Project Message *
                      </label>
                      <textarea
                        value={hireForm.message}
                        onChange={(e) => setHireForm(prev => ({ ...prev, message: e.target.value }))}
                        rows={4}
                        className="input-field resize-none"
                        placeholder="Describe your project requirements..."
                        required
                      />
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Budget ($) *
                        </label>
                        <input
                          type="number"
                          value={hireForm.budget}
                          onChange={(e) => setHireForm(prev => ({ ...prev, budget: Number(e.target.value) }))}
                          className="input-field"
                          min="1"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Timeline *
                        </label>
                        <input
                          type="text"
                          value={hireForm.timeline}
                          onChange={(e) => setHireForm(prev => ({ ...prev, timeline: e.target.value }))}
                          className="input-field"
                          placeholder="e.g., 1 week"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Additional Requirements
                      </label>
                      <textarea
                        value={hireForm.requirements}
                        onChange={(e) => setHireForm(prev => ({ ...prev, requirements: e.target.value }))}
                        rows={3}
                        className="input-field resize-none"
                        placeholder="Any specific requirements or preferences..."
                      />
                    </div>
                    
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full px-6 py-3 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {submitting && (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      )}
                      {submitting ? 'Processing...' : 'Hire Freelancer'}
                    </button>
                  </form>
                )}

                {activeTab === 'contact' && (
                  <form onSubmit={handleContact} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Subject *
                      </label>
                      <input
                        type="text"
                        value={contactForm.subject}
                        onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                        className="input-field"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Message *
                      </label>
                      <textarea
                        value={contactForm.body}
                        onChange={(e) => setContactForm(prev => ({ ...prev, body: e.target.value }))}
                        rows={6}
                        className="input-field resize-none"
                        placeholder="Ask questions about the service, timeline, or requirements..."
                        required
                      />
                    </div>
                    
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {submitting && (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      )}
                      {submitting ? 'Sending...' : 'Send Message'}
                    </button>
                  </form>
                )}

                {activeTab === 'quote' && (
                  <form onSubmit={handleQuoteRequest} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Service Type *
                      </label>
                      <input
                        type="text"
                        value={quoteForm.serviceType}
                        onChange={(e) => setQuoteForm(prev => ({ ...prev, serviceType: e.target.value }))}
                        className="input-field"
                        placeholder="Custom web application"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Project Description *
                      </label>
                      <textarea
                        value={quoteForm.description}
                        onChange={(e) => setQuoteForm(prev => ({ ...prev, description: e.target.value }))}
                        rows={4}
                        className="input-field resize-none"
                        placeholder="Describe your custom project requirements..."
                        required
                      />
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Budget Range ($) *
                        </label>
                        <input
                          type="number"
                          value={quoteForm.budget}
                          onChange={(e) => setQuoteForm(prev => ({ ...prev, budget: Number(e.target.value) }))}
                          className="input-field"
                          min="1"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Timeline *
                        </label>
                        <input
                          type="text"
                          value={quoteForm.timeline}
                          onChange={(e) => setQuoteForm(prev => ({ ...prev, timeline: e.target.value }))}
                          className="input-field"
                          placeholder="e.g., 2-3 weeks"
                          required
                        />
                      </div>
                    </div>
                    
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full px-6 py-3 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {submitting && (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      )}
                      {submitting ? 'Requesting...' : 'Request Custom Quote'}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Freelancer Profile */}
            <div className="panel">
              <h3 className="text-lg font-semibold text-white mb-4">About the Freelancer</h3>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl font-bold">
                    {service.freelancer.name[0].toUpperCase()}
                  </span>
                </div>
                <div>
                  <h4 className="font-medium text-white">{service.freelancer.name}</h4>
                  <div className="flex items-center gap-1">
                    <span className={`${getReputationColor(service.freelancer.reputation)}`}>★</span>
                    <span className="text-sm text-slate-400">
                      {service.freelancer.reputation.toFixed(1)} ({service.freelancer.completedProjects} projects)
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-slate-400">Projects Completed</span>
                  <span className="text-white font-medium">{service.freelancer.completedProjects}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Reputation Score</span>
                  <span className="text-white font-medium">{Math.round(service.freelancer.reputation)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Response Time</span>
                  <span className="text-white font-medium">{service.responseTime}</span>
                </div>
              </div>
              
              <Link
                href={`/profile/${service.freelancer.id}`}
                className="w-full block text-center px-4 py-2 bg-slate-700 text-white rounded-lg font-medium hover:bg-slate-600 transition-colors"
              >
                View Full Profile
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="panel">
              <h3 className="text-lg font-semibold text-white mb-4">Service Overview</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-slate-400">Service Price</span>
                  <span className="text-emerald-400 font-bold text-lg">
                    ${service.totalPrice.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-slate-400">Hourly Rate</span>
                  <span className="text-white">${service.hourlyRate}/hr</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-slate-400">Estimated Hours</span>
                  <span className="text-white">{service.estimatedHours}h</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-slate-400">Delivery Time</span>
                  <span className="text-white">{getEstimatedDelivery(service.estimatedHours)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-slate-400">Category</span>
                  <span className="text-white">{service.category}</span>
                </div>
              </div>
            </div>

            {/* Similar Services */}
            <div className="panel">
              <h3 className="text-lg font-semibold text-white mb-4">Similar Services</h3>
              <div className="space-y-3">
                <div className="p-3 bg-slate-700/30 rounded-lg">
                  <h4 className="text-sm font-medium text-white mb-1">Web Development Package</h4>
                  <p className="text-xs text-slate-400 mb-2">$2,800 • 40 hours</p>
                  <div className="flex gap-1">
                    <span className="px-2 py-1 bg-slate-600 text-xs text-slate-300 rounded">React</span>
                    <span className="px-2 py-1 bg-slate-600 text-xs text-slate-300 rounded">Node.js</span>
                  </div>
                </div>
                
                <div className="p-3 bg-slate-700/30 rounded-lg">
                  <h4 className="text-sm font-medium text-white mb-1">Mobile App Development</h4>
                  <p className="text-xs text-slate-400 mb-2">$3,500 • 50 hours</p>
                  <div className="flex gap-1">
                    <span className="px-2 py-1 bg-slate-600 text-xs text-slate-300 rounded">Flutter</span>
                    <span className="px-2 py-1 bg-slate-600 text-xs text-slate-300 rounded">Firebase</span>
                  </div>
                </div>
              </div>
              
              <Link href="/services" className="block mt-4 text-center text-emerald-400 hover:text-emerald-300 transition-colors text-sm">
                Browse All Services →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}