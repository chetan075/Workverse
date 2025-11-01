'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  Target, 
  Search, 
  Filter, 
  Star, 
  Award, 
  Briefcase, 
  MapPin, 
  Clock, 
  TrendingUp, 
  Eye, 
  MessageCircle, 
  UserCheck, 
  UserX, 
  X,
  Zap,
  Brain,
  Network,
  Lightbulb,
  ChevronRight,
  ChevronDown,
  Building,
  GraduationCap,
  Hash,
  Globe,
  Calendar,
  Activity,
  Layers,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Info,
  Sparkles,
  ArrowRight,
  ThumbsUp,
  ThumbsDown,
  BookmarkPlus,
  Share2,
  ExternalLink,
  Compass,
  Radar,
  Cpu,
  Database
} from 'lucide-react';

interface RecommendedUser {
  id: string;
  name: string;
  title: string;
  company?: string;
  location: string;
  profileImage?: string;
  skills: string[];
  mutualConnections: number;
  recommendationScore: number;
  recommendationReasons: RecommendationReason[];
  hourlyRate?: number;
  rating: number;
  completedProjects: number;
  responseTime: string;
  availability: 'available' | 'busy' | 'unavailable';
  lastActive: string;
  isOnline: boolean;
  socialLinks: {
    linkedin?: string;
    github?: string;
    website?: string;
  };
  connectionStatus: 'not_connected' | 'invitation_sent' | 'connected';
}

interface RecommendationReason {
  type: 'skill_match' | 'mutual_connections' | 'project_history' | 'location' | 'industry' | 'activity';
  description: string;
  weight: number;
}

interface RecommendationFilter {
  skills: string[];
  location: string;
  experience: string;
  availability: string;
  hourlyRateMin: number;
  hourlyRateMax: number;
  rating: number;
  industry: string;
}

export default function ConnectionRecommendationsPage() {
  const [activeTab, setActiveTab] = useState<'ai_suggestions' | 'skill_based' | 'mutual_connections' | 'trending'>('ai_suggestions');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedUser, setSelectedUser] = useState<RecommendedUser | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const [filters, setFilters] = useState<RecommendationFilter>({
    skills: [],
    location: '',
    experience: '',
    availability: '',
    hourlyRateMin: 0,
    hourlyRateMax: 200,
    rating: 0,
    industry: ''
  });

  const [recommendations, setRecommendations] = useState<RecommendedUser[]>([
    {
      id: 'rec-1',
      name: 'Alexandra Chen',
      title: 'Senior React Developer',
      company: 'Meta',
      location: 'San Francisco, CA',
      profileImage: 'https://i.pravatar.cc/150?u=alexandra',
      skills: ['React', 'TypeScript', 'GraphQL', 'Node.js', 'AWS'],
      mutualConnections: 12,
      recommendationScore: 9.4,
      recommendationReasons: [
        { type: 'skill_match', description: 'Shares 4 skills with you (React, TypeScript, Node.js, AWS)', weight: 0.4 },
        { type: 'mutual_connections', description: '12 mutual connections including Sarah Johnson', weight: 0.3 },
        { type: 'project_history', description: 'Worked on similar e-commerce projects', weight: 0.2 },
        { type: 'activity', description: 'Highly active in React community', weight: 0.1 }
      ],
      hourlyRate: 120,
      rating: 4.9,
      completedProjects: 89,
      responseTime: '< 1 hour',
      availability: 'available',
      lastActive: '2024-11-01T10:30:00Z',
      isOnline: true,
      socialLinks: {
        linkedin: 'https://linkedin.com/in/alexandrachen',
        github: 'https://github.com/alexchen',
        website: 'https://alexdev.com'
      },
      connectionStatus: 'not_connected'
    },
    {
      id: 'rec-2',
      name: 'Marcus Williams',
      title: 'UX/UI Designer & Frontend Developer',
      company: 'Airbnb',
      location: 'Austin, TX',
      profileImage: 'https://i.pravatar.cc/150?u=marcus',
      skills: ['Figma', 'React', 'Design Systems', 'User Research', 'Prototyping'],
      mutualConnections: 8,
      recommendationScore: 8.9,
      recommendationReasons: [
        { type: 'skill_match', description: 'Complementary skills in design and development', weight: 0.35 },
        { type: 'mutual_connections', description: '8 mutual connections including Michael Chen', weight: 0.25 },
        { type: 'industry', description: 'Both work in tech product development', weight: 0.25 },
        { type: 'location', description: 'Based in similar tech hub city', weight: 0.15 }
      ],
      hourlyRate: 95,
      rating: 4.8,
      completedProjects: 156,
      responseTime: '< 2 hours',
      availability: 'busy',
      lastActive: '2024-10-31T16:45:00Z',
      isOnline: false,
      socialLinks: {
        linkedin: 'https://linkedin.com/in/marcuswilliams',
        website: 'https://marcusdesign.com'
      },
      connectionStatus: 'not_connected'
    },
    {
      id: 'rec-3',
      name: 'Priya Patel',
      title: 'DevOps Engineer',
      company: 'Google',
      location: 'Mountain View, CA',
      profileImage: 'https://i.pravatar.cc/150?u=priya',
      skills: ['Kubernetes', 'Docker', 'AWS', 'Terraform', 'Python'],
      mutualConnections: 15,
      recommendationScore: 8.7,
      recommendationReasons: [
        { type: 'skill_match', description: 'Shares AWS and Python expertise', weight: 0.3 },
        { type: 'mutual_connections', description: '15 mutual connections from previous companies', weight: 0.4 },
        { type: 'project_history', description: 'Worked on cloud migration projects', weight: 0.2 },
        { type: 'activity', description: 'Active contributor to open source', weight: 0.1 }
      ],
      hourlyRate: 110,
      rating: 4.9,
      completedProjects: 78,
      responseTime: '< 3 hours',
      availability: 'available',
      lastActive: '2024-11-01T08:15:00Z',
      isOnline: true,
      socialLinks: {
        linkedin: 'https://linkedin.com/in/priyapatel',
        github: 'https://github.com/priyap'
      },
      connectionStatus: 'not_connected'
    },
    {
      id: 'rec-4',
      name: 'James Rodriguez',
      title: 'Product Manager',
      company: 'Stripe',
      location: 'New York, NY',
      profileImage: 'https://i.pravatar.cc/150?u=james',
      skills: ['Product Strategy', 'Agile', 'Analytics', 'User Research', 'A/B Testing'],
      mutualConnections: 20,
      recommendationScore: 8.5,
      recommendationReasons: [
        { type: 'mutual_connections', description: '20 mutual connections including Lisa Thompson', weight: 0.45 },
        { type: 'industry', description: 'Both experienced in fintech and payments', weight: 0.25 },
        { type: 'project_history', description: 'Led similar product development initiatives', weight: 0.2 },
        { type: 'location', description: 'Both work with East Coast clients', weight: 0.1 }
      ],
      hourlyRate: 85,
      rating: 4.7,
      completedProjects: 203,
      responseTime: '< 4 hours',
      availability: 'available',
      lastActive: '2024-10-31T14:22:00Z',
      isOnline: false,
      socialLinks: {
        linkedin: 'https://linkedin.com/in/jamesrodriguez',
        website: 'https://jamespm.com'
      },
      connectionStatus: 'not_connected'
    },
    {
      id: 'rec-5',
      name: 'Sophie Kim',
      title: 'Data Scientist',
      company: 'Netflix',
      location: 'Los Angeles, CA',
      profileImage: 'https://i.pravatar.cc/150?u=sophie',
      skills: ['Python', 'Machine Learning', 'SQL', 'TensorFlow', 'Data Visualization'],
      mutualConnections: 7,
      recommendationScore: 8.3,
      recommendationReasons: [
        { type: 'skill_match', description: 'Shares Python and data analysis skills', weight: 0.3 },
        { type: 'industry', description: 'Both work with data-driven products', weight: 0.3 },
        { type: 'mutual_connections', description: '7 mutual connections from data community', weight: 0.25 },
        { type: 'activity', description: 'Active in ML and AI discussions', weight: 0.15 }
      ],
      hourlyRate: 100,
      rating: 4.8,
      completedProjects: 134,
      responseTime: '< 2 hours',
      availability: 'busy',
      lastActive: '2024-10-30T11:30:00Z',
      isOnline: false,
      socialLinks: {
        linkedin: 'https://linkedin.com/in/sophiekim',
        github: 'https://github.com/sophiek'
      },
      connectionStatus: 'not_connected'
    }
  ]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'busy':
        return 'bg-yellow-100 text-yellow-800';
      case 'unavailable':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getReasonIcon = (type: string) => {
    switch (type) {
      case 'skill_match':
        return <Zap className="h-4 w-4 text-blue-600" />;
      case 'mutual_connections':
        return <Users className="h-4 w-4 text-green-600" />;
      case 'project_history':
        return <Briefcase className="h-4 w-4 text-purple-600" />;
      case 'location':
        return <MapPin className="h-4 w-4 text-orange-600" />;
      case 'industry':
        return <Building className="h-4 w-4 text-indigo-600" />;
      case 'activity':
        return <Activity className="h-4 w-4 text-pink-600" />;
      default:
        return <Lightbulb className="h-4 w-4 text-gray-600" />;
    }
  };

  const sendConnectionRequest = async (userId: string) => {
    try {
      // Implement connection request logic
      setRecommendations(prev => 
        prev.map(user => 
          user.id === userId 
            ? { ...user, connectionStatus: 'invitation_sent' as const }
            : user
        )
      );
      console.log('Sending connection request to:', userId);
    } catch (error) {
      console.error('Failed to send connection request:', error);
    }
  };

  const refreshRecommendations = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const filteredRecommendations = recommendations.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Connection Recommendations</h1>
              <p className="text-gray-600 mt-1">
                Discover professionals who could expand your network based on AI insights
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={refreshRecommendations}
                disabled={refreshing}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                <Filter className="h-4 w-4" />
                Filters
              </button>
            </div>
          </div>

          {/* AI Insight Banner */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <Brain className="h-6 w-6 text-blue-600 mt-0.5" />
              <div>
                <h3 className="text-lg font-semibold text-blue-900 mb-1">AI-Powered Recommendations</h3>
                <p className="text-blue-800 text-sm">
                  Our intelligent system analyzes your skills, project history, and network patterns to suggest the most valuable connections for your professional growth.
                </p>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by name, title, or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
              />
            </div>

            {showFilters && (
              <div className="bg-white border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter Recommendations</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
                    <input
                      type="text"
                      placeholder="e.g., React, Python, Design"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <input
                      type="text"
                      placeholder="e.g., San Francisco, Remote"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="">All Industries</option>
                      <option value="tech">Technology</option>
                      <option value="finance">Finance</option>
                      <option value="healthcare">Healthcare</option>
                      <option value="education">Education</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hourly Rate Range</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <span className="text-gray-500">-</span>
                      <input
                        type="number"
                        placeholder="Max"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="">Any</option>
                      <option value="available">Available</option>
                      <option value="busy">Busy</option>
                      <option value="unavailable">Unavailable</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Rating</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="0">Any Rating</option>
                      <option value="4">4+ Stars</option>
                      <option value="4.5">4.5+ Stars</option>
                      <option value="4.8">4.8+ Stars</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recommendation Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'ai_suggestions', name: 'AI Suggestions', icon: Brain, description: 'Intelligent recommendations' },
                { id: 'skill_based', name: 'Skill Match', icon: Zap, description: 'Based on your skills' },
                { id: 'mutual_connections', name: 'Mutual Connections', icon: Users, description: 'Through your network' },
                { id: 'trending', name: 'Trending Professionals', icon: TrendingUp, description: 'Popular this week' }
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                      isActive
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <div className="text-left">
                      <div>{tab.name}</div>
                      <div className="text-xs text-gray-400">{tab.description}</div>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Recommendations Content */}
        <div className="space-y-6">
          {filteredRecommendations.map((user) => (
            <div key={user.id} className="bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <img
                        src={user.profileImage}
                        alt={user.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      {user.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-xl font-semibold text-gray-900">{user.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(user.availability)}`}>
                          {user.availability}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-1">{user.title}</p>
                      {user.company && (
                        <p className="text-sm text-gray-500 mb-2">{user.company}</p>
                      )}
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {user.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          {user.rating}
                        </span>
                        <span className="flex items-center gap-1">
                          <Briefcase className="h-3 w-3" />
                          {user.completedProjects} projects
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {user.mutualConnections} mutual
                        </span>
                        {user.hourlyRate && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            ${user.hourlyRate}/hr
                          </span>
                        )}
                      </div>

                      {/* Skills */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {user.skills.slice(0, 5).map((skill) => (
                          <span 
                            key={skill}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                        {user.skills.length > 5 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{user.skills.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 px-3 py-1 rounded-full">
                      <Sparkles className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-semibold text-blue-900">
                        {user.recommendationScore}/10 Match
                      </span>
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      Last active {formatDate(user.lastActive)}
                    </div>
                  </div>
                </div>

                {/* Recommendation Reasons */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-yellow-500" />
                    Why we recommend this connection:
                  </h4>
                  <div className="space-y-2">
                    {user.recommendationReasons.map((reason, index) => (
                      <div key={index} className="flex items-center gap-3 text-sm">
                        {getReasonIcon(reason.type)}
                        <span className="text-gray-700">{reason.description}</span>
                        <div className="ml-auto">
                          <div className="w-16 bg-gray-200 rounded-full h-1.5">
                            <div 
                              className="bg-blue-600 h-1.5 rounded-full" 
                              style={{ width: `${reason.weight * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  {user.connectionStatus === 'not_connected' && (
                    <button 
                      onClick={() => sendConnectionRequest(user.id)}
                      className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <UserPlus className="h-4 w-4" />
                      Connect
                    </button>
                  )}
                  
                  {user.connectionStatus === 'invitation_sent' && (
                    <button 
                      disabled
                      className="flex items-center gap-2 px-6 py-2 bg-gray-100 text-gray-500 rounded-lg cursor-not-allowed"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Invitation Sent
                    </button>
                  )}

                  <button 
                    onClick={() => setSelectedUser(user)}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    <Eye className="h-4 w-4" />
                    View Profile
                  </button>

                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                    <MessageCircle className="h-4 w-4" />
                    Message
                  </button>

                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <BookmarkPlus className="h-4 w-4" />
                  </button>

                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <Share2 className="h-4 w-4" />
                  </button>

                  <div className="ml-auto flex items-center gap-2">
                    <button className="p-2 text-gray-400 hover:text-green-600" title="Good recommendation">
                      <ThumbsUp className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600" title="Poor recommendation">
                      <ThumbsDown className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredRecommendations.length === 0 && (
          <div className="text-center py-12">
            <Compass className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No recommendations found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or filters to discover new connections
            </p>
            <button 
              onClick={refreshRecommendations}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Refresh Recommendations
            </button>
          </div>
        )}

        {/* User Detail Modal */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={selectedUser.profileImage}
                      alt={selectedUser.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    {selectedUser.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{selectedUser.name}</h2>
                    <p className="text-gray-600">{selectedUser.title}</p>
                    {selectedUser.company && (
                      <p className="text-sm text-gray-500">{selectedUser.company}</p>
                    )}
                  </div>
                </div>
                
                <button 
                  onClick={() => setSelectedUser(null)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Recommendation Score */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Brain className="h-6 w-6 text-blue-600" />
                    <div>
                      <h3 className="font-semibold text-blue-900">AI Recommendation Score</h3>
                      <p className="text-sm text-blue-700">Based on compatibility analysis</p>
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-blue-900">
                    {selectedUser.recommendationScore}/10
                  </div>
                </div>
              </div>

              {/* Detailed Reasons */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Why This Connection Makes Sense</h3>
                <div className="space-y-3">
                  {selectedUser.recommendationReasons.map((reason, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      {getReasonIcon(reason.type)}
                      <div className="flex-1">
                        <p className="text-gray-900">{reason.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${reason.weight * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500">{Math.round(reason.weight * 100)}% weight</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Skills & Expertise</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedUser.skills.map((skill) => (
                    <span 
                      key={skill}
                      className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Professional Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-2xl font-bold text-gray-900">{selectedUser.rating}</div>
                  <div className="text-sm text-gray-600">Rating</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-2xl font-bold text-gray-900">{selectedUser.completedProjects}</div>
                  <div className="text-sm text-gray-600">Completed Projects</div>
                </div>
              </div>

              <div className="flex gap-3">
                {selectedUser.connectionStatus === 'not_connected' && (
                  <button 
                    onClick={() => {
                      sendConnectionRequest(selectedUser.id);
                      setSelectedUser(null);
                    }}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center gap-2"
                  >
                    <UserPlus className="h-4 w-4" />
                    Send Connection Request
                  </button>
                )}
                
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Send Message
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}