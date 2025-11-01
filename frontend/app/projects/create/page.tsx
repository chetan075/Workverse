'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  DollarSign,
  Calendar,
  Users,
  Tag,
  FileText,
  Zap,
  Clock,
  Target
} from 'lucide-react';
import { createProject, fetchUsers } from '@/lib/api';

interface CreateProjectForm {
  title: string;
  description: string;
  budget: number;
  currency: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  deadline: string;
  skillIds: string[];
  freelancerId?: string;
}

const initialForm: CreateProjectForm = {
  title: '',
  description: '',
  budget: 0,
  currency: 'USD',
  difficulty: 'MEDIUM',
  deadline: '',
  skillIds: [],
  freelancerId: undefined
};

const steps = [
  {
    id: 1,
    title: 'Project Details',
    description: 'Basic information about your project',
    icon: FileText
  },
  {
    id: 2,
    title: 'Budget & Timeline',
    description: 'Set your budget and project timeline',
    icon: DollarSign
  },
  {
    id: 3,
    title: 'Skills & Requirements',
    description: 'Define required skills and complexity',
    icon: Zap
  },
  {
    id: 4,
    title: 'Team Assignment',
    description: 'Assign a freelancer (optional)',
    icon: Users
  },
  {
    id: 5,
    title: 'Review & Create',
    description: 'Review your project before creating',
    icon: Check
  }
];

const availableSkills = [
  { id: '1', name: 'React', category: 'Frontend' },
  { id: '2', name: 'Node.js', category: 'Backend' },
  { id: '3', name: 'TypeScript', category: 'Programming' },
  { id: '4', name: 'UI/UX Design', category: 'Design' },
  { id: '5', name: 'Python', category: 'Programming' },
  { id: '6', name: 'PostgreSQL', category: 'Database' },
  { id: '7', name: 'AWS', category: 'Cloud' },
  { id: '8', name: 'Docker', category: 'DevOps' },
  { id: '9', name: 'GraphQL', category: 'API' },
  { id: '10', name: 'MongoDB', category: 'Database' }
];

export default function CreateProjectPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState<CreateProjectForm>(initialForm);
  const [loading, setLoading] = useState(false);
  const [freelancers, setFreelancers] = useState<any[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadFreelancers();
  }, []);

  const loadFreelancers = async () => {
    try {
      // Mock freelancers data - in production, fetch from API
      const mockFreelancers = [
        {
          id: '1',
          name: 'John Smith',
          email: 'john@example.com',
          hourlyRate: 75,
          skills: ['React', 'TypeScript', 'Node.js'],
          rating: 4.8,
          completedProjects: 12
        },
        {
          id: '2',
          name: 'Sarah Wilson',
          email: 'sarah@example.com',
          hourlyRate: 85,
          skills: ['UI/UX Design', 'React', 'Figma'],
          rating: 4.9,
          completedProjects: 8
        },
        {
          id: '3',
          name: 'Mike Chen',
          email: 'mike@example.com',
          hourlyRate: 70,
          skills: ['Python', 'Django', 'PostgreSQL'],
          rating: 4.7,
          completedProjects: 15
        }
      ];
      setFreelancers(mockFreelancers);
    } catch (error) {
      console.error('Error loading freelancers:', error);
    }
  };

  const updateForm = (field: keyof CreateProjectForm, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
    // Clear error when field is updated
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!form.title.trim()) newErrors.title = 'Project title is required';
        if (!form.description.trim()) newErrors.description = 'Project description is required';
        if (form.description.trim().length < 50) newErrors.description = 'Description should be at least 50 characters';
        break;
      case 2:
        if (form.budget <= 0) newErrors.budget = 'Budget must be greater than 0';
        if (!form.deadline) newErrors.deadline = 'Project deadline is required';
        if (new Date(form.deadline) <= new Date()) newErrors.deadline = 'Deadline must be in the future';
        break;
      case 3:
        if (form.skillIds.length === 0) newErrors.skillIds = 'At least one skill is required';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    try {
      setLoading(true);
      
      const projectData = {
        ...form,
        skillIds: form.skillIds.length > 0 ? form.skillIds : undefined,
        freelancerId: form.freelancerId || undefined
      };
      
      console.log('Submitting project data:', projectData);
      
      const project = await createProject(projectData);
      
      router.push(`/projects/${project.id}`);
    } catch (error) {
      console.error('Error creating project:', error);
      
      // More detailed error handling
      let errorMessage = 'Failed to create project. Please try again.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      setErrors({ submit: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const toggleSkill = (skillId: string) => {
    setForm(prev => ({
      ...prev,
      skillIds: prev.skillIds.includes(skillId)
        ? prev.skillIds.filter(id => id !== skillId)
        : [...prev.skillIds, skillId]
    }));
  };

  const getDifficultyDescription = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY':
        return 'Simple project, clear requirements, minimal complexity';
      case 'MEDIUM':
        return 'Moderate complexity, some technical challenges';
      case 'HARD':
        return 'Complex project, significant technical expertise required';
      default:
        return '';
    }
  };

  const estimatedTimeframe = () => {
    const baseHours = {
      'EASY': 40,
      'MEDIUM': 80,
      'HARD': 160
    };
    
    const hours = baseHours[form.difficulty] + (form.skillIds.length * 20);
    const weeks = Math.ceil(hours / 40);
    
    return { hours, weeks };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900">Create New Project</h1>
          <p className="text-gray-600 mt-1">Follow the steps to create your project</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              const Icon = step.icon;

              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    isCompleted 
                      ? 'bg-green-600 border-green-600 text-white' 
                      : isActive 
                        ? 'border-blue-600 text-blue-600 bg-blue-50' 
                        : 'border-gray-300 text-gray-500'
                  }`}>
                    {isCompleted ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </div>
                  
                  <div className="ml-3 hidden sm:block">
                    <p className={`text-sm font-medium ${
                      isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-500">{step.description}</p>
                  </div>
                  
                  {index < steps.length - 1 && (
                    <div className={`hidden sm:block w-16 h-0.5 ml-6 ${
                      isCompleted ? 'bg-green-600' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          {/* Step 1: Project Details */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Project Details</h3>
                <p className="text-gray-600 mb-6">
                  Provide basic information about your project to help freelancers understand what you need.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => updateForm('title', e.target.value)}
                  placeholder="e.g., E-commerce Website Development"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => updateForm('description', e.target.value)}
                  placeholder="Describe your project in detail. Include goals, requirements, and any specific preferences..."
                  rows={6}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                <p className="text-gray-500 text-sm mt-1">
                  {form.description.length}/50 characters minimum
                </p>
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>
            </div>
          )}

          {/* Step 2: Budget & Timeline */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Budget & Timeline</h3>
                <p className="text-gray-600 mb-6">
                  Set your project budget and timeline to help freelancers plan their work.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Budget <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="number"
                      value={form.budget || ''}
                      onChange={(e) => updateForm('budget', parseFloat(e.target.value) || 0)}
                      placeholder="5000"
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.budget ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.budget && <p className="text-red-500 text-sm mt-1">{errors.budget}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currency
                  </label>
                  <select
                    value={form.currency}
                    onChange={(e) => updateForm('currency', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    title="Select currency for your project budget"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="INR">INR (₹)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Deadline <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="date"
                    value={form.deadline}
                    onChange={(e) => updateForm('deadline', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.deadline ? 'border-red-500' : 'border-gray-300'
                    }`}
                    title="Select your project deadline"
                  />
                </div>
                {errors.deadline && <p className="text-red-500 text-sm mt-1">{errors.deadline}</p>}
              </div>
            </div>
          )}

          {/* Step 3: Skills & Requirements */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Skills & Requirements</h3>
                <p className="text-gray-600 mb-6">
                  Select the skills required for your project and set the complexity level.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Required Skills <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {availableSkills.map((skill) => (
                    <button
                      key={skill.id}
                      onClick={() => toggleSkill(skill.id)}
                      className={`p-3 border rounded-lg text-left transition-colors ${
                        form.skillIds.includes(skill.id)
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="font-medium">{skill.name}</div>
                      <div className="text-xs text-gray-500">{skill.category}</div>
                    </button>
                  ))}
                </div>
                {errors.skillIds && <p className="text-red-500 text-sm mt-1">{errors.skillIds}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Complexity
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(['EASY', 'MEDIUM', 'HARD'] as const).map((difficulty) => (
                    <button
                      key={difficulty}
                      onClick={() => updateForm('difficulty', difficulty)}
                      className={`p-4 border rounded-lg text-left transition-colors ${
                        form.difficulty === difficulty
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className={`font-medium ${
                        form.difficulty === difficulty ? 'text-blue-700' : 'text-gray-900'
                      }`}>
                        {difficulty}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {getDifficultyDescription(difficulty)}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {form.skillIds.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Estimated Project Scope</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Estimated Hours:</span>
                      <span className="ml-2 font-medium">{estimatedTimeframe().hours} hours</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Estimated Duration:</span>
                      <span className="ml-2 font-medium">{estimatedTimeframe().weeks} weeks</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Team Assignment */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Team Assignment</h3>
                <p className="text-gray-600 mb-6">
                  Optionally assign a freelancer to your project, or leave it open for applications.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assign Freelancer (Optional)
                </label>
                <div className="space-y-3">
                  <button
                    onClick={() => updateForm('freelancerId', undefined)}
                    className={`w-full p-4 border rounded-lg text-left transition-colors ${
                      !form.freelancerId
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="font-medium">Leave Open for Applications</div>
                    <div className="text-sm text-gray-500">
                      Freelancers can apply to your project, and you can choose the best fit
                    </div>
                  </button>

                  {freelancers.map((freelancer) => (
                    <button
                      key={freelancer.id}
                      onClick={() => updateForm('freelancerId', freelancer.id)}
                      className={`w-full p-4 border rounded-lg text-left transition-colors ${
                        form.freelancerId === freelancer.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{freelancer.name}</div>
                          <div className="text-sm text-gray-500">{freelancer.email}</div>
                          <div className="text-sm text-gray-500 mt-1">
                            Skills: {freelancer.skills.join(', ')}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">${freelancer.hourlyRate}/hr</div>
                          <div className="text-sm text-gray-500">
                            ⭐ {freelancer.rating} ({freelancer.completedProjects} projects)
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Review & Create */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Review & Create</h3>
                <p className="text-gray-600 mb-6">
                  Review your project details before creating it.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Project Information</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="text-gray-500">Title:</span> {form.title}</div>
                      <div><span className="text-gray-500">Budget:</span> {form.currency} {form.budget.toLocaleString()}</div>
                      <div><span className="text-gray-500">Deadline:</span> {new Date(form.deadline).toLocaleDateString()}</div>
                      <div><span className="text-gray-500">Complexity:</span> {form.difficulty}</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Requirements</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-500">Skills:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {form.skillIds.map(skillId => {
                            const skill = availableSkills.find(s => s.id === skillId);
                            return skill ? (
                              <span key={skillId} className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                {skill.name}
                              </span>
                            ) : null;
                          })}
                        </div>
                      </div>
                      
                      {form.freelancerId && (
                        <div>
                          <span className="text-gray-500">Assigned to:</span>
                          {freelancers.find(f => f.id === form.freelancerId)?.name || 'Unknown'}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                  <p className="text-sm text-gray-700">{form.description}</p>
                </div>
              </div>

              {errors.submit && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-700 text-sm">{errors.submit}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </button>

          {currentStep < steps.length ? (
            <button
              onClick={nextStep}
              className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Project'}
              <Check className="h-4 w-4 ml-2" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}