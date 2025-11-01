"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchUserProfile } from '../../../lib/api';
import { useAuth } from '../../../components/AuthProvider';

interface UserProfile {
  id: string;
  name?: string;
  email: string;
  role: 'CLIENT' | 'FREELANCER';
  bio?: string;
  title?: string;
  location?: string;
  website?: string;
  profileImage?: string;
  hourlyRate?: number;
  currency?: string;
  yearsExperience?: number;
  availability?: 'AVAILABLE' | 'BUSY' | 'UNAVAILABLE';
  hoursPerWeek?: number;
  timezone?: string;
  createdAt: string;
  reputation?: {
    score: number;
    completedProjects: number;
    averageRating: number;
    totalReviews: number;
    responseTime?: number;
    onTimeDelivery?: number;
    qualityScore?: number;
    communicationScore?: number;
    timelinessScore?: number;
    professionalismScore?: number;
  };
  skills?: Array<{
    level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
    verified: boolean;
    skill: {
      name: string;
      category: string;
    };
  }>;
  _count?: {
    invoicesAsFreelancer: number;
    invoicesAsClient: number;
  };
}

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userId = params.id as string;
  const isOwnProfile = user?.id === userId;

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        const profileData = await fetchUserProfile(userId);
        setProfile(profileData);
      } catch (err: any) {
        setError(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    }

    if (userId) {
      loadProfile();
    }
  }, [userId]);

  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return 'bg-emerald-500';
      case 'BUSY': return 'bg-yellow-500';
      case 'UNAVAILABLE': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case 'EXPERT': return 'bg-purple-500';
      case 'ADVANCED': return 'bg-blue-500';
      case 'INTERMEDIATE': return 'bg-emerald-500';
      case 'BEGINNER': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const formatJoinDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-3 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-white text-lg">Loading profile...</span>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Profile Not Found</h2>
          <p className="text-slate-400 mb-6">{error || 'The requested profile could not be found.'}</p>
          <Link href="/" className="px-6 py-3 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-600/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            
            {isOwnProfile && (
              <Link
                href="/profile/edit"
                className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors"
              >
                Edit Profile
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="panel">
              <div className="text-center">
                {/* Profile Image */}
                <div className="w-32 h-32 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  {profile.profileImage ? (
                    <img 
                      src={profile.profileImage} 
                      alt={profile.name || 'Profile'} 
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-white text-4xl font-bold">
                      {(profile.name || profile.email)[0].toUpperCase()}
                    </span>
                  )}
                </div>

                {/* Name & Title */}
                <h1 className="text-2xl font-bold text-white mb-2">
                  {profile.name || profile.email.split('@')[0]}
                </h1>
                {profile.title && (
                  <p className="text-lg text-emerald-400 mb-2">{profile.title}</p>
                )}
                
                {/* Role Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-700/50 rounded-full mb-4">
                  <div className={`w-2 h-2 rounded-full ${profile.role === 'FREELANCER' ? 'bg-emerald-400' : 'bg-blue-400'}`}></div>
                  <span className="text-slate-300 text-sm font-medium">
                    {profile.role === 'FREELANCER' ? 'Freelancer' : 'Client'}
                  </span>
                </div>

                {/* Availability Status */}
                {profile.availability && profile.role === 'FREELANCER' && (
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <div className={`w-3 h-3 rounded-full ${getAvailabilityColor(profile.availability)} animate-pulse`}></div>
                    <span className="text-slate-300 text-sm">
                      {profile.availability.charAt(0) + profile.availability.slice(1).toLowerCase()}
                    </span>
                  </div>
                )}
              </div>

              {/* Quick Stats */}
              {profile.reputation && (
                <div className="mt-6 pt-6 border-t border-slate-600/20">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-emerald-400">
                        {Math.round(profile.reputation.score)}
                      </div>
                      <div className="text-xs text-slate-400">Reputation</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">
                        {profile.reputation.completedProjects}
                      </div>
                      <div className="text-xs text-slate-400">Projects</div>
                    </div>
                    {profile.reputation.averageRating > 0 && (
                      <>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-yellow-400">
                            {profile.reputation.averageRating.toFixed(1)}★
                          </div>
                          <div className="text-xs text-slate-400">Rating</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-400">
                            {profile.reputation.totalReviews}
                          </div>
                          <div className="text-xs text-slate-400">Reviews</div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Contact Info */}
              <div className="mt-6 pt-6 border-t border-slate-600/20 space-y-3">
                {profile.location && (
                  <div className="flex items-center gap-3 text-slate-300">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-sm">{profile.location}</span>
                  </div>
                )}
                
                {profile.website && (
                  <div className="flex items-center gap-3 text-slate-300">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    <a 
                      href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                      {profile.website}
                    </a>
                  </div>
                )}

                <div className="flex items-center gap-3 text-slate-300">
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm">Joined {formatJoinDate(profile.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Professional Details */}
            {profile.role === 'FREELANCER' && (
              <div className="panel">
                <h3 className="text-lg font-semibold text-white mb-4">Professional Details</h3>
                <div className="space-y-3">
                  {profile.hourlyRate && (
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Hourly Rate</span>
                      <span className="text-white font-medium">
                        ${profile.hourlyRate}/{profile.currency || 'USD'}
                      </span>
                    </div>
                  )}
                  
                  {profile.yearsExperience && (
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Experience</span>
                      <span className="text-white font-medium">
                        {profile.yearsExperience} years
                      </span>
                    </div>
                  )}
                  
                  {profile.hoursPerWeek && (
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Availability</span>
                      <span className="text-white font-medium">
                        {profile.hoursPerWeek} hours/week
                      </span>
                    </div>
                  )}
                  
                  {profile.timezone && (
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Timezone</span>
                      <span className="text-white font-medium">
                        {profile.timezone}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bio */}
            {profile.bio && (
              <div className="panel">
                <h3 className="text-lg font-semibold text-white mb-4">About</h3>
                <p className="text-slate-300 leading-relaxed">{profile.bio}</p>
              </div>
            )}

            {/* Skills */}
            {profile.skills && profile.skills.length > 0 && (
              <div className="panel">
                <h3 className="text-lg font-semibold text-white mb-4">Skills & Expertise</h3>
                <div className="space-y-4">
                  {Object.entries(
                    profile.skills.reduce((acc, skillData) => {
                      const category = skillData.skill.category;
                      if (!acc[category]) acc[category] = [];
                      acc[category].push(skillData);
                      return acc;
                    }, {} as Record<string, typeof profile.skills>)
                  ).map(([category, skills]) => (
                    <div key={category}>
                      <h4 className="text-sm font-medium text-slate-400 mb-2">{category}</h4>
                      <div className="flex flex-wrap gap-2">
                        {skills.map((skillData, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 px-3 py-1 bg-slate-700/50 rounded-full"
                          >
                            <span className="text-white text-sm">{skillData.skill.name}</span>
                            <div className={`w-2 h-2 rounded-full ${getSkillLevelColor(skillData.level)}`}></div>
                            {skillData.verified && (
                              <svg className="w-3 h-3 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Detailed Reputation */}
            {profile.reputation && profile.reputation.totalReviews > 0 && (
              <div className="panel">
                <h3 className="text-lg font-semibold text-white mb-4">Performance Metrics</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {profile.reputation.qualityScore && (
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Quality</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-emerald-500 rounded-full"
                            style={{ width: `${(profile.reputation.qualityScore / 5) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-white text-sm">{profile.reputation.qualityScore.toFixed(1)}</span>
                      </div>
                    </div>
                  )}
                  
                  {profile.reputation.communicationScore && (
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Communication</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${(profile.reputation.communicationScore / 5) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-white text-sm">{profile.reputation.communicationScore.toFixed(1)}</span>
                      </div>
                    </div>
                  )}
                  
                  {profile.reputation.timelinessScore && (
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Timeliness</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-yellow-500 rounded-full"
                            style={{ width: `${(profile.reputation.timelinessScore / 5) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-white text-sm">{profile.reputation.timelinessScore.toFixed(1)}</span>
                      </div>
                    </div>
                  )}
                  
                  {profile.reputation.professionalismScore && (
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Professionalism</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-purple-500 rounded-full"
                            style={{ width: `${(profile.reputation.professionalismScore / 5) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-white text-sm">{profile.reputation.professionalismScore.toFixed(1)}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Work History Summary */}
            {profile._count && (
              <div className="panel">
                <h3 className="text-lg font-semibold text-white mb-4">Work History</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-slate-700/30 rounded-lg">
                    <div className="text-2xl font-bold text-emerald-400 mb-1">
                      {profile._count.invoicesAsFreelancer}
                    </div>
                    <div className="text-sm text-slate-400">As Freelancer</div>
                  </div>
                  <div className="text-center p-4 bg-slate-700/30 rounded-lg">
                    <div className="text-2xl font-bold text-blue-400 mb-1">
                      {profile._count.invoicesAsClient}
                    </div>
                    <div className="text-sm text-slate-400">As Client</div>
                  </div>
                  <div className="text-center p-4 bg-slate-700/30 rounded-lg">
                    <div className="text-2xl font-bold text-purple-400 mb-1">
                      {profile._count.invoicesAsFreelancer + profile._count.invoicesAsClient}
                    </div>
                    <div className="text-sm text-slate-400">Total Projects</div>
                  </div>
                </div>
              </div>
            )}

            {/* Contact Actions */}
            {!isOwnProfile && (
              <div className="panel">
                <h3 className="text-lg font-semibold text-white mb-4">Get In Touch</h3>
                <div className="flex flex-wrap gap-4">
                  <button className="px-6 py-3 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors">
                    Send Message
                  </button>
                  {profile.role === 'FREELANCER' && (
                    <button className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors">
                      Hire for Project
                    </button>
                  )}
                  <button className="px-6 py-3 bg-slate-700 text-white rounded-lg font-medium hover:bg-slate-600 transition-colors">
                    Save Profile
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}