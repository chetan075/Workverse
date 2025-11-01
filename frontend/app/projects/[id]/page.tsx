'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Users,
  Clock,
  MessageSquare,
  FileText,
  Edit3,
  Settings,
  Play,
  Pause,
  CheckCircle,
  XCircle,
  AlertCircle,
  Target,
  TrendingUp,
  Star,
  User,
  MapPin,
  Link as LinkIcon,
  Download,
  Upload
} from 'lucide-react';
import { 
  fetchProject, 
  updateProject, 
  assignFreelancerToProject, 
  completeProject, 
  cancelProject,
  fetchProjectMilestones,
  fetchProjectTimeEntries
} from '@/lib/api';

interface ProjectDetails {
  id: string;
  title: string;
  description: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  budget: number;
  currency: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  deadline: string;
  createdAt: string;
  updatedAt: string;
  client: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  freelancer?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    hourlyRate: number;
    rating: number;
    completedProjects: number;
  };
  skills: {
    id: string;
    name: string;
    category: string;
  }[];
  milestones: {
    id: string;
    title: string;
    description: string;
    deadline: string;
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
    amount: number;
  }[];
  timeEntries: {
    id: string;
    description: string;
    hours: number;
    date: string;
    hourlyRate: number;
  }[];
  totalTimeSpent: number;
  progress: number;
}

const statusColors = {
  OPEN: 'bg-blue-100 text-blue-800',
  IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800'
};

const statusIcons = {
  OPEN: AlertCircle,
  IN_PROGRESS: Play,
  COMPLETED: CheckCircle,
  CANCELLED: XCircle
};

const difficultyColors = {
  EASY: 'bg-green-100 text-green-800',
  MEDIUM: 'bg-yellow-100 text-yellow-800',
  HARD: 'bg-red-100 text-red-800'
};

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (params?.id) {
      loadProject(params.id as string);
    }
  }, [params?.id]);

  const loadProject = async (projectId: string) => {
    try {
      setLoading(true);
      
      // Mock project data - replace with actual API call
      const mockProject: ProjectDetails = {
        id: projectId,
        title: 'E-commerce Website Development',
        description: `Build a comprehensive e-commerce platform with modern features including user authentication, product catalog, shopping cart, payment integration, and admin dashboard. 

        Key Features Required:
        • Responsive design for mobile and desktop
        • User registration and authentication
        • Product browsing and search functionality
        • Shopping cart and checkout process
        • Payment gateway integration (Stripe/PayPal)
        • Order management system
        • Admin dashboard for product management
        • Email notifications
        • SEO optimization
        
        Technical Requirements:
        • React.js frontend with TypeScript
        • Node.js backend with Express
        • PostgreSQL database
        • JWT authentication
        • RESTful API design
        • Unit and integration tests`,
        status: 'IN_PROGRESS',
        budget: 5000,
        currency: 'USD',
        difficulty: 'MEDIUM',
        deadline: '2024-02-15',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-15',
        client: {
          id: '1',
          name: 'John Smith',
          email: 'john@example.com',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
        },
        freelancer: {
          id: '2',
          name: 'Sarah Wilson',
          email: 'sarah@example.com',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face',
          hourlyRate: 75,
          rating: 4.8,
          completedProjects: 12
        },
        skills: [
          { id: '1', name: 'React', category: 'Frontend' },
          { id: '2', name: 'Node.js', category: 'Backend' },
          { id: '3', name: 'TypeScript', category: 'Programming' },
          { id: '4', name: 'PostgreSQL', category: 'Database' }
        ],
        milestones: [
          {
            id: '1',
            title: 'Project Setup & Planning',
            description: 'Initial project setup, architecture planning, and development environment setup',
            deadline: '2024-01-10',
            status: 'COMPLETED',
            amount: 500
          },
          {
            id: '2',
            title: 'Frontend Development',
            description: 'Develop the user interface, product pages, and shopping cart functionality',
            deadline: '2024-01-25',
            status: 'IN_PROGRESS',
            amount: 2000
          },
          {
            id: '3',
            title: 'Backend API Development',
            description: 'Create RESTful APIs for user management, products, and orders',
            deadline: '2024-02-05',
            status: 'PENDING',
            amount: 1500
          },
          {
            id: '4',
            title: 'Payment Integration & Testing',
            description: 'Integrate payment gateway and conduct thorough testing',
            deadline: '2024-02-15',
            status: 'PENDING',
            amount: 1000
          }
        ],
        timeEntries: [
          {
            id: '1',
            description: 'Project setup and initial planning',
            hours: 8,
            date: '2024-01-02',
            hourlyRate: 75
          },
          {
            id: '2',
            description: 'Database schema design and setup',
            hours: 6,
            date: '2024-01-03',
            hourlyRate: 75
          },
          {
            id: '3',
            description: 'Frontend component development',
            hours: 10,
            date: '2024-01-08',
            hourlyRate: 75
          },
          {
            id: '4',
            description: 'API endpoint development',
            hours: 8,
            date: '2024-01-10',
            hourlyRate: 75
          }
        ],
        totalTimeSpent: 32,
        progress: 35
      };

      setProject(mockProject);
    } catch (error) {
      console.error('Error loading project:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    if (!project) return;

    try {
      setUpdating(true);
      
      switch (newStatus) {
        case 'IN_PROGRESS':
          await updateProject(project.id, { status: 'IN_PROGRESS' });
          break;
        case 'COMPLETED':
          await completeProject(project.id);
          break;
        case 'CANCELLED':
          await cancelProject(project.id);
          break;
      }

      // Reload project data
      await loadProject(project.id);
    } catch (error) {
      console.error('Error updating project status:', error);
    } finally {
      setUpdating(false);
    }
  };

  const getStatusIcon = (status: string) => {
    const Icon = statusIcons[status as keyof typeof statusIcons];
    return Icon ? <Icon className="h-4 w-4" /> : null;
  };

  const getDaysRemaining = (deadline: string) => {
    const days = Math.ceil((new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const getTotalEarned = () => {
    return project?.timeEntries.reduce((total, entry) => total + (entry.hours * entry.hourlyRate), 0) || 0;
  };

  const getCompletedMilestones = () => {
    return project?.milestones.filter(m => m.status === 'COMPLETED').length || 0;
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: FileText },
    { id: 'milestones', name: 'Milestones', icon: Target },
    { id: 'time-tracking', name: 'Time Tracking', icon: Clock },
    { id: 'communication', name: 'Messages', icon: MessageSquare },
    { id: 'files', name: 'Files', icon: Upload }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Project not found</h2>
          <p className="text-gray-600 mb-4">The project you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push('/projects')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/projects')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </button>

          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{project.title}</h1>
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                  statusColors[project.status]
                }`}>
                  {getStatusIcon(project.status)}
                  {project.status.replace('_', ' ')}
                </span>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  difficultyColors[project.difficulty]
                }`}>
                  {project.difficulty}
                </span>
              </div>
              
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  {project.currency} {project.budget.toLocaleString()}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Due {new Date(project.deadline).toLocaleDateString()}
                  {getDaysRemaining(project.deadline) > 0 && (
                    <span className="ml-1 text-orange-600">
                      ({getDaysRemaining(project.deadline)} days left)
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {project.totalTimeSpent}h logged
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {project.status === 'OPEN' && (
                <button
                  onClick={() => handleStatusUpdate('IN_PROGRESS')}
                  disabled={updating}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  <Play className="h-4 w-4" />
                  Start Project
                </button>
              )}
              
              {project.status === 'IN_PROGRESS' && (
                <>
                  <button
                    onClick={() => handleStatusUpdate('COMPLETED')}
                    disabled={updating}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Mark Complete
                  </button>
                  <button
                    onClick={() => handleStatusUpdate('CANCELLED')}
                    disabled={updating}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                  >
                    <XCircle className="h-4 w-4" />
                    Cancel
                  </button>
                </>
              )}
              
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Project Progress</span>
            <span className="text-sm text-gray-500">{project.progress}% complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${project.progress}%` }}
            ></div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Earned</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${getTotalEarned().toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Time Logged</p>
                <p className="text-2xl font-bold text-gray-900">{project.totalTimeSpent}h</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Milestones</p>
                <p className="text-2xl font-bold text-gray-900">
                  {getCompletedMilestones()}/{project.milestones.length}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Days Left</p>
                <p className="text-2xl font-bold text-gray-900">
                  {getDaysRemaining(project.deadline)}
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Tab Navigation */}
            <div className="bg-white rounded-lg shadow-sm mb-6">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                          activeTab === tab.id
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {tab.name}
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Project Description</h3>
                      <div className="prose max-w-none">
                        <p className="text-gray-700 whitespace-pre-line">{project.description}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Required Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {project.skills.map((skill) => (
                          <span
                            key={skill.id}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                          >
                            {skill.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Project Timeline</h3>
                      <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                          <Calendar className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900">Created</p>
                            <p className="text-sm text-gray-600">
                              {new Date(project.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                          <Target className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900">Deadline</p>
                            <p className="text-sm text-gray-600">
                              {new Date(project.deadline).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'milestones' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900">Project Milestones</h3>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                        Add Milestone
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      {project.milestones.map((milestone, index) => (
                        <div key={milestone.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="font-medium text-gray-900">{milestone.title}</h4>
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                  milestone.status === 'COMPLETED' 
                                    ? 'bg-green-100 text-green-800'
                                    : milestone.status === 'IN_PROGRESS'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {milestone.status.replace('_', ' ')}
                                </span>
                              </div>
                              <p className="text-gray-600 text-sm mb-3">{milestone.description}</p>
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span>Due: {new Date(milestone.deadline).toLocaleDateString()}</span>
                                <span>Value: ${milestone.amount}</span>
                              </div>
                            </div>
                            <div className="ml-4">
                              {milestone.status === 'PENDING' && (
                                <button className="text-blue-600 hover:text-blue-800 text-sm">
                                  Start
                                </button>
                              )}
                              {milestone.status === 'IN_PROGRESS' && (
                                <button className="text-green-600 hover:text-green-800 text-sm">
                                  Complete
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'time-tracking' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900">Time Entries</h3>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                        Log Time
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      {project.timeEntries.map((entry) => (
                        <div key={entry.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{entry.description}</p>
                            <p className="text-sm text-gray-600">
                              {new Date(entry.date).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">{entry.hours}h</p>
                            <p className="text-sm text-gray-600">
                              ${entry.hourlyRate}/hr
                            </p>
                          </div>
                          <div className="ml-4 text-right">
                            <p className="font-medium text-gray-900">
                              ${(entry.hours * entry.hourlyRate).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex items-center justify-between text-lg font-medium">
                        <span>Total</span>
                        <span>${getTotalEarned().toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'communication' && (
                  <div className="text-center py-12">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h3>
                    <p className="text-gray-600 mb-4">Start a conversation with your team</p>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      Send Message
                    </button>
                  </div>
                )}

                {activeTab === 'files' && (
                  <div className="text-center py-12">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No files uploaded</h3>
                    <p className="text-gray-600 mb-4">Upload project files and documents</p>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      Upload Files
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Client Info */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Client</h3>
              <div className="flex items-center gap-3">
                {project.client.avatar ? (
                  <img
                    src={project.client.avatar}
                    alt={project.client.name}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-gray-600" />
                  </div>
                )}
                <div>
                  <p className="font-medium text-gray-900">{project.client.name}</p>
                  <p className="text-sm text-gray-600">{project.client.email}</p>
                </div>
              </div>
              <button className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                Contact Client
              </button>
            </div>

            {/* Freelancer Info */}
            {project.freelancer && (
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Freelancer</h3>
                <div className="flex items-center gap-3 mb-3">
                  {project.freelancer.avatar ? (
                    <img
                      src={project.freelancer.avatar}
                      alt={project.freelancer.name}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-gray-600" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-gray-900">{project.freelancer.name}</p>
                    <p className="text-sm text-gray-600">{project.freelancer.email}</p>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Hourly Rate</span>
                    <span className="font-medium">${project.freelancer.hourlyRate}/hr</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Rating</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="font-medium">{project.freelancer.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Completed</span>
                    <span className="font-medium">{project.freelancer.completedProjects} projects</span>
                  </div>
                </div>
                
                <button className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                  Message Freelancer
                </button>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full flex items-center gap-2 px-4 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg">
                  <Edit3 className="h-4 w-4" />
                  Edit Project
                </button>
                <button className="w-full flex items-center gap-2 px-4 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg">
                  <LinkIcon className="h-4 w-4" />
                  Share Project
                </button>
                <button className="w-full flex items-center gap-2 px-4 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg">
                  <Download className="h-4 w-4" />
                  Export Data
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}