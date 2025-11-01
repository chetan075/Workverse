"use client";
import React from 'react';

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

interface UserProfileCardProps {
  profile: UserProfile;
  onContact?: (userId: string) => void;
  onViewProfile?: (userId: string) => void;
}

export default function UserProfileCard({ profile, onContact, onViewProfile }: UserProfileCardProps) {
  const isFreelancer = profile.role === 'FREELANCER';
  
  return (
    <div className="group bg-slate-800/50 backdrop-blur-sm border border-slate-600/20 rounded-xl p-6 hover:bg-slate-700/50 hover:border-slate-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-400/10 hover:-translate-y-1">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-xl bg-emerald-500 flex items-center justify-center text-slate-900 font-bold text-lg shadow-lg">
              {(profile.name || profile.email)[0].toUpperCase()}
            </div>
            {profile.reputation && profile.reputation.score > 90 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-yellow-900" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-white text-lg group-hover:text-emerald-300 transition-colors">
              {profile.name || profile.email.split('@')[0]}
            </h3>
            <p className="text-sm text-slate-400 capitalize font-medium">{profile.role.toLowerCase()}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          {profile.reputation && (
            <div className="flex items-center gap-1 bg-emerald-900/30 text-emerald-300 px-2 py-1 rounded-full text-xs font-medium">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {profile.reputation.score}
            </div>
          )}
        </div>
      </div>

      {isFreelancer && (
        <div className="mb-4">
          {profile.skills && (
            <div className="flex flex-wrap gap-2 mb-3">
              {profile.skills.slice(0, 3).map((skill, idx) => (
                <span key={idx} className="text-xs bg-slate-700/50 text-slate-300 px-2 py-1 rounded-md border border-slate-600/30">
                  {skill}
                </span>
              ))}
              {profile.skills.length > 3 && (
                <span className="text-xs text-slate-400 bg-slate-800/50 px-2 py-1 rounded-md">
                  +{profile.skills.length - 3} more
                </span>
              )}
            </div>
          )}
          {profile.hourlyRate && (
            <div className="flex items-center gap-2 mb-2">
              <span className="text-emerald-400 font-bold text-lg">${profile.hourlyRate}</span>
              <span className="text-slate-400 text-sm">/hour</span>
            </div>
          )}
        </div>
      )}

      {!isFreelancer && profile.completedProjects !== undefined && (
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-slate-300 font-medium">{profile.completedProjects} projects completed</span>
          </div>
        </div>
      )}

      {profile.availability && (
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-slate-400">{profile.availability}</span>
          </div>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button 
          onClick={() => onViewProfile?.(profile.id)}
          className="flex-1 text-sm px-4 py-2.5 bg-slate-700/50 border border-slate-600/30 text-slate-300 rounded-lg hover:bg-slate-600/50 hover:border-slate-500/40 hover:text-white transition-all duration-200 font-medium"
        >
          View Profile
        </button>
        <button 
          onClick={() => onContact?.(profile.id)}
          className="flex-1 text-sm px-4 py-2.5 bg-emerald-500 text-white rounded-lg font-semibold hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-400/25 transition-all duration-200 transform hover:-translate-y-0.5"
        >
          Contact
        </button>
      </div>
    </div>
  );
}