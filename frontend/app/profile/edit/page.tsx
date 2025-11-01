"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchMe } from '../../../lib/api';
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
  skills?: Array<{
    level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
    verified: boolean;
    skill: {
      name: string;
      category: string;
    };
  }>;
}

interface FormData {
  name: string;
  bio: string;
  title: string;
  location: string;
  website: string;
  hourlyRate: number;
  currency: string;
  yearsExperience: number;
  availability: 'AVAILABLE' | 'BUSY' | 'UNAVAILABLE';
  hoursPerWeek: number;
  timezone: string;
}

interface SkillForm {
  name: string;
  category: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
}

const SKILL_CATEGORIES = [
  'Programming & Development',
  'Design & Creative',
  'Marketing & Sales',
  'Writing & Content',
  'Business & Finance',
  'Data & Analytics',
  'Engineering & Architecture',
  'Legal & Compliance',
  'Other'
];

const SKILL_LEVELS = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'] as const;
const AVAILABILITY_OPTIONS = ['AVAILABLE', 'BUSY', 'UNAVAILABLE'] as const;

export default function EditProfilePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    bio: '',
    title: '',
    location: '',
    website: '',
    hourlyRate: 0,
    currency: 'USD',
    yearsExperience: 0,
    availability: 'AVAILABLE',
    hoursPerWeek: 40,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });

  const [skills, setSkills] = useState<Array<{
    id?: string;
    name: string;
    category: string;
    level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
    verified: boolean;
  }>>([]);

  const [newSkill, setNewSkill] = useState<SkillForm>({
    name: '',
    category: SKILL_CATEGORIES[0],
    level: 'INTERMEDIATE'
  });

  const [showSkillForm, setShowSkillForm] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        const profileData = await fetchMe();
        setProfile(profileData);
        
        // Populate form with existing data
        setFormData({
          name: profileData.name || '',
          bio: profileData.bio || '',
          title: profileData.title || '',
          location: profileData.location || '',
          website: profileData.website || '',
          hourlyRate: profileData.hourlyRate || 0,
          currency: profileData.currency || 'USD',
          yearsExperience: profileData.yearsExperience || 0,
          availability: profileData.availability || 'AVAILABLE',
          hoursPerWeek: profileData.hoursPerWeek || 40,
          timezone: profileData.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
        });

        // Populate skills
        if (profileData.skills) {
          setSkills(profileData.skills.map((s: any) => ({
            id: s.id,
            name: s.skill.name,
            category: s.skill.category,
            level: s.level,
            verified: s.verified
          })));
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'hourlyRate' || name === 'yearsExperience' || name === 'hoursPerWeek' 
        ? Number(value) 
        : value
    }));
  };

  const handleAddSkill = () => {
    if (!newSkill.name.trim()) return;
    
    const skillExists = skills.some(s => 
      s.name.toLowerCase() === newSkill.name.toLowerCase() && 
      s.category === newSkill.category
    );
    
    if (skillExists) {
      setError('This skill already exists in your profile');
      return;
    }

    setSkills(prev => [...prev, {
      name: newSkill.name.trim(),
      category: newSkill.category,
      level: newSkill.level,
      verified: false
    }]);

    setNewSkill({
      name: '',
      category: SKILL_CATEGORIES[0],
      level: 'INTERMEDIATE'
    });
    
    setShowSkillForm(false);
    setError(null);
  };

  const handleRemoveSkill = (index: number) => {
    setSkills(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      // Here you would typically call an API to update the profile
      // For now, we'll simulate the save
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Profile data to save:', { formData, skills });
      
      setSuccess(true);
      setTimeout(() => {
        router.push(`/profile/${user?.id}`);
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'EXPERT': return 'text-purple-400 bg-purple-500/20';
      case 'ADVANCED': return 'text-blue-400 bg-blue-500/20';
      case 'INTERMEDIATE': return 'text-emerald-400 bg-emerald-500/20';
      case 'BEGINNER': return 'text-gray-400 bg-gray-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
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

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-slate-400 mb-6">You need to be logged in to edit your profile.</p>
          <Link href="/login" className="px-6 py-3 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-600/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link
              href={`/profile/${user?.id}`}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Profile
            </Link>
            
            <h1 className="text-xl font-semibold text-white">Edit Profile</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-emerald-500/20 border border-emerald-500/30 rounded-lg">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-emerald-300 font-medium">Profile updated successfully! Redirecting...</span>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span className="text-red-300">{error}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="panel">
            <h3 className="text-lg font-semibold text-white mb-6">Basic Information</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter your full name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Professional Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="e.g., Full Stack Developer"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="City, Country"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>
            
            <div className="mt-6">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows={4}
                className="input-field resize-none"
                placeholder="Tell us about yourself, your experience, and what makes you unique..."
              />
            </div>
          </div>

          {/* Professional Details (Freelancers only) */}
          {profile.role === 'FREELANCER' && (
            <div className="panel">
              <h3 className="text-lg font-semibold text-white mb-6">Professional Details</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Hourly Rate
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-lg border-r-0 bg-slate-700 border-slate-600 text-slate-300">
                      $
                    </span>
                    <input
                      type="number"
                      name="hourlyRate"
                      value={formData.hourlyRate}
                      onChange={handleInputChange}
                      className="input-field rounded-l-none"
                      placeholder="50"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Currency
                  </label>
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleInputChange}
                    className="input-field"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="INR">INR</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    name="yearsExperience"
                    value={formData.yearsExperience}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="5"
                    min="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Availability Status
                  </label>
                  <select
                    name="availability"
                    value={formData.availability}
                    onChange={handleInputChange}
                    className="input-field"
                  >
                    {AVAILABILITY_OPTIONS.map(option => (
                      <option key={option} value={option}>
                        {option.charAt(0) + option.slice(1).toLowerCase()}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Available Hours per Week
                  </label>
                  <input
                    type="number"
                    name="hoursPerWeek"
                    value={formData.hoursPerWeek}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="40"
                    min="1"
                    max="168"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Timezone
                  </label>
                  <input
                    type="text"
                    name="timezone"
                    value={formData.timezone}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="America/New_York"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Skills Section */}
          <div className="panel">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Skills & Expertise</h3>
              <button
                type="button"
                onClick={() => setShowSkillForm(!showSkillForm)}
                className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors"
              >
                Add Skill
              </button>
            </div>

            {/* Add Skill Form */}
            {showSkillForm && (
              <div className="mb-6 p-4 bg-slate-700/30 rounded-lg border border-slate-600/20">
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Skill Name
                    </label>
                    <input
                      type="text"
                      value={newSkill.name}
                      onChange={(e) => setNewSkill(prev => ({ ...prev, name: e.target.value }))}
                      className="input-field"
                      placeholder="e.g., React.js"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Category
                    </label>
                    <select
                      value={newSkill.category}
                      onChange={(e) => setNewSkill(prev => ({ ...prev, category: e.target.value }))}
                      className="input-field"
                    >
                      {SKILL_CATEGORIES.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Level
                    </label>
                    <select
                      value={newSkill.level}
                      onChange={(e) => setNewSkill(prev => ({ ...prev, level: e.target.value as any }))}
                      className="input-field"
                    >
                      {SKILL_LEVELS.map(level => (
                        <option key={level} value={level}>
                          {level.charAt(0) + level.slice(1).toLowerCase()}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors"
                  >
                    Add Skill
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowSkillForm(false)}
                    className="px-4 py-2 bg-slate-600 text-white rounded-lg font-medium hover:bg-slate-500 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Skills List */}
            {skills.length > 0 && (
              <div className="space-y-4">
                {Object.entries(
                  skills.reduce((acc, skill) => {
                    if (!acc[skill.category]) acc[skill.category] = [];
                    acc[skill.category].push(skill);
                    return acc;
                  }, {} as Record<string, typeof skills>)
                ).map(([category, categorySkills]) => (
                  <div key={category}>
                    <h4 className="text-sm font-medium text-slate-400 mb-3">{category}</h4>
                    <div className="flex flex-wrap gap-2">
                      {categorySkills.map((skill, index) => (
                        <div
                          key={`${skill.category}-${skill.name}-${index}`}
                          className="flex items-center gap-2 px-3 py-2 bg-slate-700/50 rounded-lg border border-slate-600/20"
                        >
                          <span className="text-white text-sm">{skill.name}</span>
                          <span className={`px-2 py-1 text-xs font-medium rounded ${getLevelColor(skill.level)}`}>
                            {skill.level.charAt(0) + skill.level.slice(1).toLowerCase()}
                          </span>
                          {skill.verified && (
                            <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(skills.indexOf(skill))}
                            className="text-red-400 hover:text-red-300 transition-colors ml-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {skills.length === 0 && (
              <div className="text-center py-8 text-slate-400">
                <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <p>No skills added yet. Click "Add Skill" to get started.</p>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4">
            <Link
              href={`/profile/${user?.id}`}
              className="px-6 py-3 bg-slate-600 text-white rounded-lg font-medium hover:bg-slate-500 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}