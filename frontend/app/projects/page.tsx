'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Search,
  Filter,
  Calendar,
  DollarSign,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  PauseCircle,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  User,
  Star,
  ArrowRight,
  Edit,
  Trash2,
  PlayCircle,
  Briefcase
} from 'lucide-react';
import {
  fetchProjects,
  fetchProjectStats,
  fetchMe,
  updateProject,
  completeProject,
  cancelProject
} from '@/lib/api';

interface Project {
  id: string;
  title: string;
  description: string;
  budget?: number;
  actualCost?: number;
  currency: string;
  status: 'PLANNING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
  startDate?: string;
  endDate?: string;
  deadline?: string;
  createdAt: string;
  updatedAt: string;
  client: {
    id: string;
    name: string;
    email: string;
    profileImage?: string;
  };
  freelancer?: {
    id: string;
    name: string;
    email: string;
    profileImage?: string;
  };
  skills: Array<{
    skill: {
      id: string;
      name: string;
      category: string;
    };
  }>;
  reviews: Array<{
    id: string;
    rating: number;
    author: {
      id: string;
      name: string;
    };
  }>;
  _count: {
    reviews: number;
  };
}

interface ProjectStats {
  asClient: {
    projects: Record<string, number>;
    totalSpent: number;
  };
  asFreelancer: {
    projects: Record<string, number>;
    totalEarnings: number;
  };
}

export default function ProjectsPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<{ id: string; name: string; email: string; role: string } | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState<ProjectStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<'all' | 'client' | 'freelancer'>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadProjectData();
  }, [selectedRole, selectedStatus]);

  const loadProjectData = async () => {
    try {
      setLoading(true);
      
      // Get current user
      const user = await fetchMe();
      setCurrentUser(user);
      
      // Fetch projects and stats
      const [projectsData, statsData] = await Promise.all([
        fetchProjects(selectedRole, selectedStatus),
        fetchProjectStats()
      ]);
      
      setProjects(projectsData);
      setStats(statsData);
      
    } catch (error) {
      console.error('Error loading project data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (projectId: string, status: string) => {
    try {
      if (status === 'COMPLETED') {
        await completeProject(projectId);
      } else if (status === 'CANCELLED') {
        await cancelProject(projectId);
      } else {
        await updateProject(projectId, { status: status as any });
      }
      
      // Reload projects
      loadProjectData();
    } catch (error) {
      console.error('Error updating project status:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PLANNING':
        return <PauseCircle className="h-4 w-4 text-yellow-600" />;
      case 'IN_PROGRESS':
        return <PlayCircle className="h-4 w-4 text-blue-600" />;
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'CANCELLED':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PLANNING':
        return 'bg-yellow-100 text-yellow-800';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'EASY':
        return 'bg-green-100 text-green-800';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800';
      case 'HARD':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getProjectProgress = (project: Project) => {
    const now = new Date();
    const start = project.startDate ? new Date(project.startDate) : new Date(project.createdAt);
    const end = project.deadline ? new Date(project.deadline) : null;
    
    if (!end) return 0;
    
    const total = end.getTime() - start.getTime();
    const elapsed = now.getTime() - start.getTime();
    
    return Math.min(Math.max((elapsed / total) * 100, 0), 100);
  };

  const filteredProjects = projects.filter(project => {
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return (
        project.title.toLowerCase().includes(search) ||
        project.description.toLowerCase().includes(search) ||
        project.client.name.toLowerCase().includes(search) ||
        project.freelancer?.name.toLowerCase().includes(search)
      );
    }
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
              <p className="text-gray-600 mt-1">Manage your projects and track progress</p>
            </div>
            <button
              onClick={() => router.push('/projects/create')}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Briefcase className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Active Projects</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {(stats.asClient.projects.in_progress || 0) + (stats.asFreelancer.projects.in_progress || 0)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {(stats.asClient.projects.completed || 0) + (stats.asFreelancer.projects.completed || 0)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-emerald-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Earned</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(stats.asFreelancer.totalEarnings)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <TrendingDown className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Spent</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(stats.asClient.totalSpent)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Role Filter */}
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              title="Filter by role"
              aria-label="Filter projects by role"
            >
              <option value="all">All Projects</option>
              <option value="client">As Client</option>
              <option value="freelancer">As Freelancer</option>
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              title="Filter by status"
              aria-label="Filter projects by status"
            >
              <option value="">All Statuses</option>
              <option value="PLANNING">Planning</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              title="Toggle filters"
              aria-label="Toggle advanced filters"
            >
              <Filter className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Projects List */}
        <div className="bg-white rounded-lg shadow-sm">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No projects found</h3>
              <p className="text-gray-500 mt-1">
                {searchTerm ? 'Try adjusting your search criteria' : 'Create your first project to get started'}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => router.push('/projects/create')}
                  className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Project
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredProjects.map((project) => {
                const isClient = project.client.id === currentUser?.id;
                const progress = getProjectProgress(project);
                const averageRating = project.reviews.length > 0
                  ? project.reviews.reduce((sum, review) => sum + review.rating, 0) / project.reviews.length
                  : 0;

                return (
                  <div key={project.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-medium text-gray-900 truncate">
                            {project.title}
                          </h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                            {getStatusIcon(project.status)}
                            <span className="ml-1">{project.status.replace('_', ' ')}</span>
                          </span>
                          {project.difficulty && (
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(project.difficulty)}`}>
                              {project.difficulty}
                            </span>
                          )}
                        </div>

                        <p className="text-gray-600 mb-3 line-clamp-2">{project.description}</p>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-1" />
                            <span>
                              {project.budget ? formatCurrency(project.budget, project.currency) : 'Budget TBD'}
                            </span>
                          </div>

                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>
                              {project.deadline ? `Due ${formatDate(project.deadline)}` : 'No deadline'}
                            </span>
                          </div>

                          {project.freelancer && (
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-1" />
                              <span>{project.freelancer.name}</span>
                            </div>
                          )}

                          {averageRating > 0 && (
                            <div className="flex items-center">
                              <Star className="h-4 w-4 mr-1 text-yellow-500" />
                              <span>{averageRating.toFixed(1)} ({project._count.reviews})</span>
                            </div>
                          )}
                        </div>

                        {/* Skills */}
                        {project.skills.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {project.skills.slice(0, 3).map((skillRel) => (
                              <span
                                key={skillRel.skill.id}
                                className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                              >
                                {skillRel.skill.name}
                              </span>
                            ))}
                            {project.skills.length > 3 && (
                              <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                                +{project.skills.length - 3} more
                              </span>
                            )}
                          </div>
                        )}

                        {/* Progress Bar */}
                        {project.status === 'IN_PROGRESS' && project.deadline && (
                          <div className="mt-3">
                            <div className="flex items-center justify-between text-sm text-gray-500 mb-1">
                              <span>Progress</span>
                              <span>{Math.round(progress)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  progress > 90 ? 'bg-red-500' : progress > 70 ? 'bg-yellow-500' : 'bg-blue-500'
                                }`}
                                style={{ width: `${Math.min(progress, 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => router.push(`/projects/${project.id}`)}
                          className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
                          title="View project"
                        >
                          <ArrowRight className="h-4 w-4" />
                        </button>

                        {isClient && project.status !== 'COMPLETED' && project.status !== 'CANCELLED' && (
                          <button
                            onClick={() => router.push(`/projects/${project.id}/edit`)}
                            className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
                            title="Edit project"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}