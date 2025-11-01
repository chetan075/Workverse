"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../components/AuthProvider';
import { createWorkOpportunity } from '../../../lib/api';

interface OpportunityForm {
  title: string;
  description: string;
  budget: number;
  currency: string;
  difficulty: string;
  category: string;
  skills: string[];
  deadline: string;
  startDate: string;
  requirements: string;
  deliverables: string;
}

const CATEGORIES = [
  'Web Development',
  'Mobile Development',
  'Design',
  'Data Science',
  'Backend Development',
  'Writing',
  'Marketing',
  'Other'
];

const DIFFICULTIES = ['Beginner', 'Intermediate', 'Expert'];
const CURRENCIES = ['USD', 'EUR', 'GBP', 'INR'];

const PREDEFINED_SKILLS = [
  // Web Development
  'React', 'Vue.js', 'Angular', 'JavaScript', 'TypeScript', 'HTML', 'CSS', 'Node.js',
  // Mobile Development
  'React Native', 'Flutter', 'Swift', 'Kotlin', 'iOS', 'Android',
  // Design
  'UI Design', 'UX Design', 'Figma', 'Photoshop', 'Illustrator', 'Sketch',
  // Data Science
  'Python', 'R', 'SQL', 'Data Analysis', 'Machine Learning', 'Tableau',
  // Backend
  'Node.js', 'Python', 'Java', 'PHP', 'API Development', 'Database Design',
  // Other
  'Project Management', 'Testing', 'DevOps', 'AWS', 'Docker', 'Git'
];

export default function CreateOpportunityPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [formData, setFormData] = useState<OpportunityForm>({
    title: '',
    description: '',
    budget: 0,
    currency: 'USD',
    difficulty: 'Intermediate',
    category: 'Web Development',
    skills: [],
    deadline: '',
    startDate: '',
    requirements: '',
    deliverables: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [skillInput, setSkillInput] = useState('');
  const [showSkillSuggestions, setShowSkillSuggestions] = useState(false);

  // Redirect if not a client
  if (user && user.role !== 'CLIENT') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-slate-400 mb-6">Only clients can create work opportunities.</p>
          <Link href="/opportunities" className="px-6 py-3 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors">
            Browse Opportunities
          </Link>
        </div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'budget' ? Number(value) : value
    }));
  };

  const handleAddSkill = (skill: string) => {
    if (skill.trim() && !formData.skills.includes(skill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skill.trim()]
      }));
    }
    setSkillInput('');
    setShowSkillSuggestions(false);
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const filteredSkillSuggestions = PREDEFINED_SKILLS.filter(skill =>
    skill.toLowerCase().includes(skillInput.toLowerCase()) &&
    !formData.skills.includes(skill)
  );

  const calculateEstimatedHours = () => {
    // Simple estimation based on budget and difficulty
    const baseRate = formData.difficulty === 'Beginner' ? 30 : formData.difficulty === 'Intermediate' ? 50 : 75;
    return Math.round(formData.budget / baseRate);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    // Validation
    if (!formData.title.trim()) {
      setError('Please provide a project title');
      return;
    }

    if (!formData.description.trim()) {
      setError('Please provide a project description');
      return;
    }

    if (formData.budget <= 0) {
      setError('Please provide a valid budget');
      return;
    }

    if (formData.skills.length === 0) {
      setError('Please add at least one required skill');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await createWorkOpportunity({
        title: formData.title,
        description: formData.description,
        budget: formData.budget,
        currency: formData.currency,
        difficulty: formData.difficulty,
        skills: formData.skills,
        deadline: formData.deadline || undefined,
        startDate: formData.startDate || undefined
      });

      router.push('/opportunities?created=true');
    } catch (err: any) {
      setError(err.message || 'Failed to create opportunity');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-600/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
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
            
            <h1 className="text-xl font-semibold text-white">Create New Opportunity</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Project Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="e.g., Build a React E-commerce Website"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Project Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={6}
                  className="input-field resize-none"
                  placeholder="Describe your project in detail. Include what you need, your goals, and any specific requirements..."
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  >
                    {CATEGORIES.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Difficulty Level *
                  </label>
                  <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  >
                    {DIFFICULTIES.map(difficulty => (
                      <option key={difficulty} value={difficulty}>{difficulty}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Budget & Timeline */}
          <div className="panel">
            <h3 className="text-lg font-semibold text-white mb-6">Budget & Timeline</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Budget *
                </label>
                <div className="flex">
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleInputChange}
                    className="input-field rounded-r-none w-20"
                  >
                    {CURRENCIES.map(currency => (
                      <option key={currency} value={currency}>{currency}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    className="input-field rounded-l-none flex-1"
                    placeholder="5000"
                    min="1"
                    step="0.01"
                    required
                  />
                </div>
                {formData.budget > 0 && (
                  <p className="text-sm text-slate-400 mt-2">
                    Estimated: ~{calculateEstimatedHours()} hours
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Project Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="input-field"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Project Deadline
                </label>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleInputChange}
                  className="input-field"
                  min={formData.startDate || new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
          </div>

          {/* Skills Required */}
          <div className="panel">
            <h3 className="text-lg font-semibold text-white mb-6">Skills Required</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Add Skills *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => {
                      setSkillInput(e.target.value);
                      setShowSkillSuggestions(e.target.value.length > 0);
                    }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkill(skillInput);
                      }
                    }}
                    className="input-field"
                    placeholder="Type a skill and press Enter (e.g., React, Python, Design)"
                  />
                  
                  {/* Skill Suggestions */}
                  {showSkillSuggestions && filteredSkillSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 bg-slate-800 border border-slate-600 rounded-lg mt-1 max-h-48 overflow-y-auto z-10">
                      {filteredSkillSuggestions.slice(0, 8).map(skill => (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => handleAddSkill(skill)}
                          className="w-full text-left px-4 py-2 text-slate-300 hover:bg-slate-700 transition-colors"
                        >
                          {skill}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Selected Skills */}
              {formData.skills.length > 0 && (
                <div>
                  <p className="text-sm text-slate-400 mb-3">Selected Skills ({formData.skills.length}):</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map(skill => (
                      <div
                        key={skill}
                        className="flex items-center gap-2 px-3 py-2 bg-emerald-500/20 text-emerald-300 rounded-lg border border-emerald-500/30"
                      >
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="text-emerald-400 hover:text-emerald-300 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Additional Details */}
          <div className="panel">
            <h3 className="text-lg font-semibold text-white mb-6">Additional Details</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Specific Requirements
                </label>
                <textarea
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleInputChange}
                  rows={4}
                  className="input-field resize-none"
                  placeholder="List any specific requirements, technologies, or constraints..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Expected Deliverables
                </label>
                <textarea
                  name="deliverables"
                  value={formData.deliverables}
                  onChange={handleInputChange}
                  rows={4}
                  className="input-field resize-none"
                  placeholder="What should be delivered at the end of this project?"
                />
              </div>
            </div>
          </div>

          {/* Project Summary */}
          {formData.title && formData.budget > 0 && (
            <div className="panel bg-slate-700/30">
              <h3 className="text-lg font-semibold text-white mb-4">Project Summary</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-slate-400 text-sm">Budget</p>
                  <p className="text-2xl font-bold text-emerald-400">
                    {formData.budget.toLocaleString()} {formData.currency}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Estimated Hours</p>
                  <p className="text-xl text-white">~{calculateEstimatedHours()} hours</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Difficulty</p>
                  <p className="text-white">{formData.difficulty}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Skills Needed</p>
                  <p className="text-white">{formData.skills.length} skills</p>
                </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-end gap-4">
            <Link
              href="/opportunities"
              className="px-6 py-3 bg-slate-600 text-white rounded-lg font-medium hover:bg-slate-500 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              {loading ? 'Creating...' : 'Create Opportunity'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}