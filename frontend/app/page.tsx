"use client";

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../components/AuthProvider';
import UserProfileCard from '../components/UserProfileCard';
import WorkOpportunityCard from '../components/WorkOpportunityCard';
import TaskCard from '../components/TaskCard';
import { fetchUserProfiles, fetchWorkOpportunities, fetchAvailableTasks } from '../lib/api';

type UserProfile = {
  id: string;
  name?: string;
  email: string;
  role: 'CLIENT' | 'FREELANCER';
  reputation?: { score: number };
  skills?: string[];
  hourlyRate?: number;
  availability?: string;
  completedProjects?: number;
};

type WorkOpportunity = {
  id: string;
  title: string;
  description: string;
  budget: number;
  currency?: string;
  skills: string[];
  deadline?: string;
  clientName?: string;
  clientId?: string;
  postedAt: string;
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
};

type Task = {
  id: string;
  title: string;
  description: string;
  budget: number;
  currency?: string;
  skills: string[];
  deadline?: string;
  freelancerName?: string;
  freelancerId?: string;
  estimatedHours?: number;
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
  category?: string;
};

export default function Home() {
  const { user, loading } = useAuth();
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [opportunities, setOpportunities] = useState<WorkOpportunity[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [dataLoading, setDataLoading] = useState(false);

  useEffect(() => {
    async function loadData() {
      setDataLoading(true);
      try {
        // Load different data based on user role
        if (user?.role === 'CLIENT') {
          // For clients, show freelancer profiles and available tasks
          const [freelancerProfiles, availableTasks] = await Promise.all([
            fetchUserProfiles('FREELANCER').catch(() => []),
            fetchAvailableTasks().catch(() => [])
          ]);
          setProfiles(freelancerProfiles.slice(0, 6) || []);
          setTasks(availableTasks.slice(0, 4) || []);
        } else if (user?.role === 'FREELANCER') {
          // For freelancers, show client profiles and work opportunities
          const [clientProfiles, workOpportunities] = await Promise.all([
            fetchUserProfiles('CLIENT').catch(() => []),
            fetchWorkOpportunities().catch(() => [])
          ]);
          setProfiles(clientProfiles.slice(0, 6) || []);
          setOpportunities(workOpportunities.slice(0, 4) || []);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setDataLoading(false);
      }
    }

    if (user && !loading) {
      loadData();
    }
  }, [user, loading]);

  // Mock data for development (remove when backend endpoints are ready)
  useEffect(() => {
    if (user && !loading && profiles.length === 0 && !dataLoading) {
      const mockProfiles: UserProfile[] = user.role === 'CLIENT' ? [
        {
          id: '1', 
          name: 'Alice Johnson', 
          email: 'alice@example.com', 
          role: 'FREELANCER',
          reputation: { score: 95 },
          skills: ['React', 'TypeScript', 'Node.js'],
          hourlyRate: 85,
          availability: 'Available now'
        },
        {
          id: '2', 
          name: 'Bob Smith', 
          email: 'bob@example.com', 
          role: 'FREELANCER',
          reputation: { score: 87 },
          skills: ['Python', 'AI/ML', 'Data Science'],
          hourlyRate: 95,
          availability: 'Available next week'
        }
      ] : [
        {
          id: '3', 
          name: 'Carol Brown', 
          email: 'carol@example.com', 
          role: 'CLIENT',
          reputation: { score: 92 },
          completedProjects: 15
        },
        {
          id: '4', 
          name: 'David Wilson', 
          email: 'david@example.com', 
          role: 'CLIENT',
          reputation: { score: 88 },
          completedProjects: 8
        }
      ];
      
      setProfiles(mockProfiles);

      if (user.role === 'FREELANCER') {
        setOpportunities([
          {
            id: '1',
            title: 'Build E-commerce Website',
            description: 'Need a modern e-commerce platform with payment integration and admin dashboard.',
            budget: 5000,
            skills: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
            deadline: '2025-12-15',
            clientName: 'TechStartup Co.',
            postedAt: '2025-11-01T10:00:00Z',
            difficulty: 'MEDIUM'
          },
          {
            id: '2',
            title: 'Mobile App Development',
            description: 'React Native app for iOS and Android with real-time features.',
            budget: 8000,
            skills: ['React Native', 'Firebase', 'TypeScript'],
            deadline: '2025-12-30',
            clientName: 'Innovation Labs',
            postedAt: '2025-10-31T15:30:00Z',
            difficulty: 'HARD'
          }
        ]);
      } else {
        setTasks([
          {
            id: '1',
            title: 'UI/UX Design Consultation',
            description: 'Help improve user experience for an existing web application.',
            budget: 1200,
            skills: ['UI/UX', 'Figma', 'Design Systems'],
            estimatedHours: 15,
            freelancerName: 'Design Expert',
            deadline: '2025-11-20',
            difficulty: 'EASY',
            category: 'Design'
          },
          {
            id: '2',
            title: 'API Integration Service',
            description: 'Connect third-party APIs to existing system with proper error handling.',
            budget: 2500,
            skills: ['REST APIs', 'Node.js', 'Error Handling'],
            estimatedHours: 25,
            freelancerName: 'Backend Specialist',
            deadline: '2025-11-30',
            difficulty: 'MEDIUM',
            category: 'Backend'
          }
        ]);
      }
    }
  }, [user, loading, profiles.length, dataLoading]);

  const handleContactUser = (userId: string) => {
    // TODO: Implement contact functionality
    console.log('Contact user:', userId);
  };

  const handleViewProfile = (userId: string) => {
    // TODO: Navigate to user profile page
    console.log('View profile:', userId);
  };

  const handleApplyToOpportunity = (opportunityId: string) => {
    // TODO: Implement application functionality
    console.log('Apply to opportunity:', opportunityId);
  };

  const handleHireForTask = (taskId: string) => {
    // TODO: Implement hiring functionality
    console.log('Hire for task:', taskId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-emerald-400 flex items-center justify-center">
                <span className="text-slate-900 font-bold text-xl">W</span>
              </div>
              <h1 className="text-5xl font-bold text-white">
                Workverse
              </h1>
            </div>
            
            {!loading && !user ? (
              <>
                <p className="text-xl text-slate-400 mb-8 max-w-3xl mx-auto leading-relaxed">
                  The future of freelance work. Connect with top talent, secure payments through blockchain, and build your professional reputation in a trusted decentralized marketplace.
                </p>
                
                <div className="flex items-center justify-center gap-4 mb-12">
                  <Link href="/register" className="group px-8 py-4 bg-emerald-400 text-slate-900 rounded-lg font-semibold hover:shadow-lg hover:shadow-emerald-400/25 transition-all duration-300 transform hover:-translate-y-0.5">
                    <span className="flex items-center gap-2">
                      Get Started Free
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </Link>
                  <Link href="/login" className="px-8 py-4 bg-slate-800/50 border border-slate-600/30 text-white rounded-lg font-medium hover:bg-slate-700/50 hover:border-slate-500/50 transition-all duration-300 backdrop-blur-sm">
                    Sign In
                  </Link>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-3 gap-8 mb-16">
                  <div className="bg-slate-800/30 backdrop-blur-md border border-slate-600/20 rounded-xl p-6">
                    <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
                      <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Secure Payments</h3>
                    <p className="text-slate-400 text-sm">Blockchain-powered escrow ensures safe transactions for both freelancers and clients</p>
                  </div>

                  <div className="bg-slate-800/30 backdrop-blur-md border border-slate-600/20 rounded-xl p-6">
                    <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
                      <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Global Talent Network</h3>
                    <p className="text-slate-400 text-sm">Connect with skilled professionals and top-tier clients from around the world</p>
                  </div>

                  <div className="bg-slate-800/30 backdrop-blur-md border border-slate-600/20 rounded-xl p-6">
                    <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
                      <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Reputation System</h3>
                    <p className="text-slate-400 text-sm">Build trust through our transparent blockchain-based reputation and review system</p>
                  </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-emerald-400 mb-2">50K+</div>
                    <div className="text-slate-400">Active Users</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-emerald-400 mb-2">25K+</div>
                    <div className="text-slate-400">Projects Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-emerald-400 mb-2">$12M+</div>
                    <div className="text-slate-400">Payments Processed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-emerald-400 mb-2">4.9★</div>
                    <div className="text-slate-400">Average Rating</div>
                  </div>
                </div>

                {/* Services */}
                <div className="grid md:grid-cols-2 gap-8 mb-16">
                  <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-600/20 rounded-2xl p-8">
                    <h3 className="text-2xl font-bold text-white mb-4">For Freelancers</h3>
                    <ul className="space-y-3 text-slate-300">
                      <li className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Find high-quality projects
                      </li>
                      <li className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Secure escrow payments
                      </li>
                      <li className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Build your reputation
                      </li>
                      <li className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Professional tools & support
                      </li>
                    </ul>
                  </div>

                  <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-600/20 rounded-2xl p-8">
                    <h3 className="text-2xl font-bold text-white mb-4">For Clients</h3>
                    <ul className="space-y-3 text-slate-300">
                      <li className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Access to top talent
                      </li>
                      <li className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Quality guaranteed work
                      </li>
                      <li className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Transparent pricing
                      </li>
                      <li className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Project management tools
                      </li>
                    </ul>
                  </div>
                </div>
              </>
            ) : (
              <>
                <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto leading-relaxed">
                  The future of work. Premium invoicing, secure escrow, and reputation-based collaboration for elite builders.
                </p>
                
                <div className="flex items-center justify-center gap-4 mb-8">
                  <Link href="/dashboard" className="group px-6 py-3 bg-emerald-400 text-slate-900 rounded-lg font-semibold hover:shadow-lg hover:shadow-emerald-400/25 transition-all duration-300 transform hover:-translate-y-0.5">
                    <span className="flex items-center gap-2">
                      Dashboard
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </Link>
                  <Link href="/upload" className="px-6 py-3 bg-slate-800/50 border border-slate-600/30 text-white rounded-lg font-medium hover:bg-slate-700/50 hover:border-slate-500/50 transition-all duration-300 backdrop-blur-sm">
                    Upload Files
                  </Link>
                </div>
              </>
            )}

            {/* Status Card */}
            <div className="inline-block bg-slate-800/30 backdrop-blur-md border border-slate-600/20 rounded-xl p-6 shadow-2xl">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${user ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`}></div>
                <div className="text-left">
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-slate-300">Connecting...</span>
                    </div>
                  ) : user ? (
                    <div>
                      <div className="text-white font-medium">{user.name || user.email}</div>
                      <div className="text-slate-400 text-sm">
                        {user.role?.toLowerCase()} • authenticated
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="text-slate-300">Welcome to Workverse</div>
                      <div className="text-slate-500 text-sm">Sign in to access all features</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {user && !loading && (
          <div className="space-y-16">
            {/* Profiles Section */}
            <section className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-3xl blur-3xl -z-10"></div>
              <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-600/20 rounded-2xl p-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2">
                      {user.role === 'CLIENT' ? 'Elite Freelancers' : 'Premium Clients'}
                    </h2>
                    <p className="text-slate-400">
                      {user.role === 'CLIENT' 
                        ? 'Top-rated professionals ready to bring your vision to life' 
                        : 'Industry leaders seeking exceptional talent for their next breakthrough'
                      }
                    </p>
                  </div>
                  <Link href="/profiles" className="group flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
                    View all
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
                
                {dataLoading ? (
                  <div className="flex items-center justify-center py-16">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 border-3 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-slate-300 text-lg">Loading profiles...</span>
                    </div>
                  </div>
                ) : profiles.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {profiles.map((profile) => (
                      <UserProfileCard
                        key={profile.id}
                        profile={profile}
                        onContact={handleContactUser}
                        onViewProfile={handleViewProfile}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-12 h-12 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-slate-300 mb-2">No profiles available</h3>
                    <p className="text-slate-500">Check back soon for new {user.role === 'CLIENT' ? 'freelancers' : 'clients'}</p>
                  </div>
                )}
              </div>
            </section>

            {/* Work Opportunities / Tasks Section */}
            <section className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-3xl blur-3xl -z-10"></div>
              <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-600/20 rounded-2xl p-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2">
                      {user.role === 'FREELANCER' ? 'Premium Opportunities' : 'Expert Services'}
                    </h2>
                    <p className="text-slate-400">
                      {user.role === 'FREELANCER' 
                        ? 'High-value projects from leading companies and innovators' 
                        : 'Specialized services from verified professionals'
                      }
                    </p>
                  </div>
                  <Link href={user.role === 'FREELANCER' ? '/opportunities' : '/services'} className="group flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
                    View all
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>

                {dataLoading ? (
                  <div className="flex items-center justify-center py-16">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 border-3 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-slate-300 text-lg">Loading opportunities...</span>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {user.role === 'FREELANCER' ? (
                      opportunities.length > 0 ? (
                        opportunities.map((opportunity) => (
                          <WorkOpportunityCard
                            key={opportunity.id}
                            opportunity={opportunity}
                            onApply={handleApplyToOpportunity}
                            onSaveForLater={(id) => console.log('Save for later:', id)}
                          />
                        ))
                      ) : (
                        <div className="text-center py-16 col-span-2">
                          <div className="w-24 h-24 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-12 h-12 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                            </svg>
                          </div>
                          <h3 className="text-xl font-semibold text-slate-300 mb-2">No opportunities available</h3>
                          <p className="text-slate-500">Check back soon for new projects</p>
                        </div>
                      )
                    ) : (
                      tasks.length > 0 ? (
                        tasks.map((task) => (
                          <TaskCard
                            key={task.id}
                            task={task}
                            onHire={handleHireForTask}
                            onContactFreelancer={handleContactUser}
                            onViewDetails={(id) => console.log('View details:', id)}
                          />
                        ))
                      ) : (
                        <div className="text-center py-16 col-span-2">
                          <div className="w-24 h-24 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-12 h-12 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                            </svg>
                          </div>
                          <h3 className="text-xl font-semibold text-slate-300 mb-2">No services available</h3>
                          <p className="text-slate-500">Check back soon for new services</p>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
