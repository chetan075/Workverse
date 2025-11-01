"use client";
import React from 'react';

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

interface TaskCardProps {
  task: Task;
  onHire?: (taskId: string) => void;
  onContactFreelancer?: (freelancerId: string) => void;
  onViewDetails?: (taskId: string) => void;
}

export default function TaskCard({ task, onHire, onContactFreelancer, onViewDetails }: TaskCardProps) {
  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'EASY': return 'bg-green-900 text-green-300';
      case 'MEDIUM': return 'bg-yellow-900 text-yellow-300';
      case 'HARD': return 'bg-red-900 text-red-300';
      default: return 'bg-slate-800 text-slate-400';
    }
  };

  return (
    <div className="group bg-slate-800/50 backdrop-blur-sm border border-slate-600/20 rounded-xl p-6 hover:bg-slate-700/50 hover:border-slate-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-purple-400/10 hover:-translate-y-1">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-bold text-white text-lg group-hover:text-purple-300 transition-colors">
              {task.title}
            </h3>
            {task.category && (
              <span className="text-xs bg-purple-900/30 text-purple-300 px-2 py-1 rounded-md border border-purple-700/30 font-medium">
                {task.category}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>{task.freelancerName || 'Anonymous Freelancer'}</span>
          </div>
        </div>
        <div className="text-right ml-4">
          <p className="text-2xl font-bold text-emerald-400">
            ${task.budget.toLocaleString()}
          </p>
          {task.estimatedHours && (
            <p className="text-xs text-slate-400 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {task.estimatedHours}h est.
            </p>
          )}
        </div>
      </div>

      <p className="text-slate-300 mb-4 leading-relaxed line-clamp-2">
        {task.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {task.skills.slice(0, 4).map((skill, idx) => (
          <span key={idx} className="text-xs bg-slate-700/50 text-slate-300 px-2 py-1 rounded-md border border-slate-600/30 font-medium">
            {skill}
          </span>
        ))}
        {task.skills.length > 4 && (
          <span className="text-xs text-slate-400 bg-slate-800/50 px-2 py-1 rounded-md">
            +{task.skills.length - 4} more
          </span>
        )}
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {task.difficulty && (
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${getDifficultyColor(task.difficulty)}`}>
              {task.difficulty}
            </span>
          )}
          {task.deadline && (
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Available until: {new Date(task.deadline).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button 
          onClick={() => onViewDetails?.(task.id)}
          className="px-4 py-2.5 bg-slate-700/50 border border-slate-600/30 text-slate-300 rounded-lg hover:bg-slate-600/50 hover:border-slate-500/40 hover:text-white transition-all duration-200 font-medium"
        >
          Details
        </button>
        {task.freelancerId && (
          <button 
            onClick={() => onContactFreelancer?.(task.freelancerId!)}
            className="px-4 py-2.5 bg-slate-600/50 text-slate-200 rounded-lg hover:bg-slate-500/50 transition-all duration-200 font-medium"
          >
            Contact
          </button>
        )}
        <button 
          onClick={() => onHire?.(task.id)}
          className="flex-1 px-4 py-2.5 bg-purple-500 text-white rounded-lg font-semibold hover:bg-purple-400 hover:shadow-lg hover:shadow-purple-400/25 transition-all duration-200 transform hover:-translate-y-0.5"
        >
          Hire Now
        </button>
      </div>
    </div>
  );
}