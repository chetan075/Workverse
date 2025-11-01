"use client";
import React from 'react';

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

interface WorkOpportunityCardProps {
  opportunity: WorkOpportunity;
  onApply?: (opportunityId: string) => void;
  onSaveForLater?: (opportunityId: string) => void;
}

export default function WorkOpportunityCard({ opportunity, onApply, onSaveForLater }: WorkOpportunityCardProps) {
  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'EASY': return 'bg-green-900 text-green-300';
      case 'MEDIUM': return 'bg-yellow-900 text-yellow-300';
      case 'HARD': return 'bg-red-900 text-red-300';
      default: return 'bg-slate-800 text-slate-400';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just posted';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <div className="group bg-slate-800/50 backdrop-blur-sm border border-slate-600/20 rounded-xl p-6 hover:bg-slate-700/50 hover:border-slate-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-400/10 hover:-translate-y-1">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-bold text-white text-lg group-hover:text-indigo-300 transition-colors">
              {opportunity.title}
            </h3>
            {opportunity.difficulty && (
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${getDifficultyColor(opportunity.difficulty)}`}>
                {opportunity.difficulty}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-6m-2-12h6m-6 4h6m-6 4h6" />
            </svg>
            <span>{opportunity.clientName || 'Anonymous Client'}</span>
            <span>•</span>
            <span>{formatTimeAgo(opportunity.postedAt)}</span>
          </div>
        </div>
        <div className="text-right ml-4">
          <p className="text-2xl font-bold text-emerald-400">
            ${opportunity.budget.toLocaleString()}
          </p>
          {opportunity.currency && opportunity.currency !== 'USD' && (
            <p className="text-xs text-slate-400">{opportunity.currency}</p>
          )}
        </div>
      </div>

      <p className="text-slate-300 mb-4 leading-relaxed line-clamp-2">
        {opportunity.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {opportunity.skills.slice(0, 4).map((skill, idx) => (
          <span key={idx} className="text-xs bg-indigo-900/30 text-indigo-300 px-2 py-1 rounded-md border border-indigo-700/30 font-medium">
            {skill}
          </span>
        ))}
        {opportunity.skills.length > 4 && (
          <span className="text-xs text-slate-400 bg-slate-800/50 px-2 py-1 rounded-md">
            +{opportunity.skills.length - 4} more
          </span>
        )}
      </div>

      {opportunity.deadline && (
        <div className="flex items-center gap-2 mb-4 text-sm text-slate-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Due: {new Date(opportunity.deadline).toLocaleDateString()}</span>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button 
          onClick={() => onSaveForLater?.(opportunity.id)}
          title="Save for later"
          className="px-4 py-2.5 bg-slate-700/50 border border-slate-600/30 text-slate-300 rounded-lg hover:bg-slate-600/50 hover:border-slate-500/40 hover:text-white transition-all duration-200 font-medium"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </button>
        <button 
          onClick={() => onApply?.(opportunity.id)}
          className="flex-1 px-4 py-2.5 bg-indigo-500 text-white rounded-lg font-semibold hover:bg-indigo-400 hover:shadow-lg hover:shadow-indigo-400/25 transition-all duration-200 transform hover:-translate-y-0.5"
        >
          Apply Now
        </button>
      </div>
    </div>
  );
}