'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  Network, 
  Search, 
  Filter, 
  MoreVertical, 
  MessageCircle, 
  Phone, 
  Mail, 
  Star, 
  Award, 
  Briefcase, 
  MapPin, 
  Clock, 
  TrendingUp, 
  Eye, 
  UserCheck, 
  UserX, 
  Calendar, 
  Target, 
  Activity, 
  Globe,
  LinkedinIcon,
  TwitterIcon,
  GithubIcon,
  ExternalLink,
  Send,
  CheckCircle,
  XCircle,
  AlertCircle,
  Zap,
  Heart,
  Share2,
  Download,
  Upload,
  Settings,
  Bell,
  Gift,
  Handshake,
  UserCircle,
  Building,
  GraduationCap,
  Badge,
  Bookmark
} from 'lucide-react';

interface Connection {
  id: string;
  userId: string;
  name: string;
  title: string;
  company?: string;
  location: string;
  profileImage?: string;
  skills: string[];
  connectionDate: string;
  mutualConnections: number;
  projectsWorkedTogether: number;
  valueScore: number;
  status: 'connected' | 'pending' | 'invited';
  lastActivity: string;
  isOnline: boolean;
  hourlyRate?: number;
  rating: number;
  completedProjects: number;
  responseTime: string;
  availability: 'available' | 'busy' | 'unavailable';
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    website?: string;
  };
}

interface NetworkStats {
  totalConnections: number;
  pendingInvitations: number;
  mutualConnections: number;
  networkGrowth: number;
  averageValueScore: number;
  topSkillsInNetwork: string[];
  recentActivity: number;
  strongConnections: number;
}

export default function NetworkingPage() {
  const [activeTab, setActiveTab] = useState<'connections' | 'invitations' | 'discover' | 'analytics'>('connections');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSkill, setFilterSkill] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'recent' | 'value' | 'projects'>('recent');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedConnection, setSelectedConnection] = useState<Connection | null>(null);
  const [showConnectionModal, setShowConnectionModal] = useState(false);

  const [networkStats] = useState<NetworkStats>({
    totalConnections: 247,
    pendingInvitations: 8,
    mutualConnections: 156,
    networkGrowth: 12.5,
    averageValueScore: 8.7,
    topSkillsInNetwork: ['React', 'Node.js', 'Python', 'Design', 'Marketing'],
    recentActivity: 23,
    strongConnections: 89
  });

  const [connections, setConnections] = useState<Connection[]>([
    {
      id: '1',
      userId: 'user-1',
      name: 'Sarah Johnson',
      title: 'Senior Full-Stack Developer',
      company: 'TechCorp',
      location: 'San Francisco, CA',
      profileImage: 'https://i.pravatar.cc/150?u=sarah',
      skills: ['React', 'Node.js', 'TypeScript', 'AWS'],
      connectionDate: '2024-10-15T10:00:00Z',
      mutualConnections: 23,
      projectsWorkedTogether: 3,
      valueScore: 9.2,
      status: 'connected',
      lastActivity: '2024-11-01T09:30:00Z',
      isOnline: true,
      hourlyRate: 85,
      rating: 4.9,
      completedProjects: 127,
      responseTime: '< 1 hour',
      availability: 'available',
      socialLinks: {
        linkedin: 'https://linkedin.com/in/sarahjohnson',
        github: 'https://github.com/sarahj',
        website: 'https://sarahdev.com'
      }
    },
    {
      id: '2',
      userId: 'user-2',
      name: 'Michael Chen',
      title: 'UI/UX Designer',
      company: 'Design Studio',
      location: 'New York, NY',
      profileImage: 'https://i.pravatar.cc/150?u=michael',
      skills: ['Figma', 'Adobe Creative Suite', 'User Research', 'Prototyping'],
      connectionDate: '2024-09-22T14:30:00Z',
      mutualConnections: 18,
      projectsWorkedTogether: 2,
      valueScore: 8.8,
      status: 'connected',
      lastActivity: '2024-10-31T16:45:00Z',
      isOnline: false,
      hourlyRate: 75,
      rating: 4.8,
      completedProjects: 89,
      responseTime: '< 2 hours',
      availability: 'busy',
      socialLinks: {
        linkedin: 'https://linkedin.com/in/michaelchen',
        twitter: 'https://twitter.com/mikedesigns'
      }
    },
    {
      id: '3',
      userId: 'user-3',
      name: 'Emily Rodriguez',
      title: 'Digital Marketing Specialist',
      company: 'Marketing Pro',
      location: 'Austin, TX',
      profileImage: 'https://i.pravatar.cc/150?u=emily',
      skills: ['SEO', 'Content Marketing', 'Social Media', 'Analytics'],
      connectionDate: '2024-08-10T11:20:00Z',
      mutualConnections: 31,
      projectsWorkedTogether: 1,
      valueScore: 8.5,
      status: 'connected',
      lastActivity: '2024-11-01T08:15:00Z',
      isOnline: true,
      hourlyRate: 60,
      rating: 4.7,
      completedProjects: 156,
      responseTime: '< 3 hours',
      availability: 'available',
      socialLinks: {
        linkedin: 'https://linkedin.com/in/emilyrodriguez',
        twitter: 'https://twitter.com/emilymarketing',
        website: 'https://emilydigital.com'
      }
    },
    {
      id: '4',
      userId: 'user-4',
      name: 'David Park',
      title: 'DevOps Engineer',
      company: 'Cloud Solutions Inc',
      location: 'Seattle, WA',
      profileImage: 'https://i.pravatar.cc/150?u=david',
      skills: ['Docker', 'Kubernetes', 'AWS', 'Terraform'],
      connectionDate: '2024-07-28T09:45:00Z',
      mutualConnections: 12,
      projectsWorkedTogether: 0,
      valueScore: 7.9,
      status: 'connected',
      lastActivity: '2024-10-30T14:22:00Z',
      isOnline: false,
      hourlyRate: 95,
      rating: 4.6,
      completedProjects: 67,
      responseTime: '< 4 hours',
      availability: 'unavailable',
      socialLinks: {
        linkedin: 'https://linkedin.com/in/davidpark',
        github: 'https://github.com/davidp'
      }
    },
    {
      id: '5',
      userId: 'user-5',
      name: 'Lisa Thompson',
      title: 'Project Manager',
      company: 'Agile Consulting',
      location: 'Chicago, IL',
      profileImage: 'https://i.pravatar.cc/150?u=lisa',
      skills: ['Agile', 'Scrum', 'Project Planning', 'Team Leadership'],
      connectionDate: '2024-10-01T13:10:00Z',
      mutualConnections: 28,
      projectsWorkedTogether: 4,
      valueScore: 9.1,
      status: 'connected',
      lastActivity: '2024-11-01T11:30:00Z',
      isOnline: true,
      hourlyRate: 70,
      rating: 4.9,
      completedProjects: 203,
      responseTime: '< 1 hour',
      availability: 'available',
      socialLinks: {
        linkedin: 'https://linkedin.com/in/lisathompson',
        website: 'https://agilewithlisa.com'
      }
    }
  ]);

  const [invitations] = useState([
    {
      id: 'inv-1',
      name: 'Alex Kumar',
      title: 'Backend Developer',
      company: 'StartupXYZ',
      profileImage: 'https://i.pravatar.cc/150?u=alex',
      mutualConnections: 15,
      invitedDate: '2024-10-28T10:00:00Z',
      message: 'I saw your work on the React project and would love to connect!'
    },
    {
      id: 'inv-2',
      name: 'Maria Gonzalez',
      title: 'Data Scientist',
      company: 'Analytics Hub',
      profileImage: 'https://i.pravatar.cc/150?u=maria',
      mutualConnections: 8,
      invitedDate: '2024-10-25T15:30:00Z',
      message: 'We have several mutual connections. Interested in collaboration opportunities.'
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

  const filteredConnections = connections
    .filter(conn => 
      conn.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conn.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conn.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .filter(conn => !filterSkill || conn.skills.includes(filterSkill))
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'recent':
          return new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime();
        case 'value':
          return b.valueScore - a.valueScore;
        case 'projects':
          return b.projectsWorkedTogether - a.projectsWorkedTogether;
        default:
          return 0;
      }
    });

  const allSkills = Array.from(new Set(connections.flatMap(conn => conn.skills)));

  const sendMessage = (connection: Connection) => {
    // Implement message sending logic
    console.log('Sending message to:', connection.name);
  };

  const connectUser = async (userId: string) => {
    // Implement connection logic
    console.log('Connecting to user:', userId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Professional Network</h1>
              <p className="text-gray-600 mt-1">
                Manage your professional connections and grow your network
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                <Download className="h-4 w-4" />
                Export
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <UserPlus className="h-4 w-4" />
                Find Connections
              </button>
            </div>
          </div>

          {/* Network Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 border">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold">{networkStats.totalConnections}</div>
                  <div className="text-sm text-gray-600">Total Connections</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-green-600" />
                <div>
                  <div className="text-2xl font-bold">+{networkStats.networkGrowth}%</div>
                  <div className="text-sm text-gray-600">Network Growth</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border">
              <div className="flex items-center gap-3">
                <Star className="h-8 w-8 text-yellow-600" />
                <div>
                  <div className="text-2xl font-bold">{networkStats.averageValueScore}</div>
                  <div className="text-sm text-gray-600">Avg Value Score</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border">
              <div className="flex items-center gap-3">
                <Activity className="h-8 w-8 text-purple-600" />
                <div>
                  <div className="text-2xl font-bold">{networkStats.recentActivity}</div>
                  <div className="text-sm text-gray-600">Recent Activity</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'connections', name: 'My Connections', icon: Users, count: networkStats.totalConnections },
                { id: 'invitations', name: 'Invitations', icon: Bell, count: networkStats.pendingInvitations },
                { id: 'discover', name: 'Discover People', icon: Search },
                { id: 'analytics', name: 'Network Analytics', icon: TrendingUp }
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
                    {tab.name}
                    {tab.count && (
                      <span className="ml-1 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm">
          {/* Connections Tab */}
          {activeTab === 'connections' && (
            <div className="p-6">
              {/* Filters and Search */}
              <div className="mb-6">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div className="flex flex-col sm:flex-row gap-3 flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <input
                        type="text"
                        placeholder="Search connections..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-80"
                      />
                    </div>
                    
                    <select
                      value={filterSkill}
                      onChange={(e) => setFilterSkill(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">All Skills</option>
                      {allSkills.map(skill => (
                        <option key={skill} value={skill}>{skill}</option>
                      ))}
                    </select>

                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="recent">Recent Activity</option>
                      <option value="name">Name</option>
                      <option value="value">Value Score</option>
                      <option value="projects">Projects Together</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      <div className="h-4 w-4 grid grid-cols-2 gap-0.5">
                        <div className="bg-current rounded-sm"></div>
                        <div className="bg-current rounded-sm"></div>
                        <div className="bg-current rounded-sm"></div>
                        <div className="bg-current rounded-sm"></div>
                      </div>
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      <div className="h-4 w-4 flex flex-col gap-0.5">
                        <div className="bg-current h-1 rounded-sm"></div>
                        <div className="bg-current h-1 rounded-sm"></div>
                        <div className="bg-current h-1 rounded-sm"></div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Connections Grid/List */}
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredConnections.map((connection) => (
                    <div key={connection.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <img
                              src={connection.profileImage}
                              alt={connection.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                            {connection.isOnline && (
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{connection.name}</h3>
                            <p className="text-sm text-gray-600">{connection.title}</p>
                            {connection.company && (
                              <p className="text-xs text-gray-500">{connection.company}</p>
                            )}
                          </div>
                        </div>
                        
                        <button className="p-1 text-gray-400 hover:text-gray-600">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Value Score:</span>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-500 fill-current" />
                            <span className="font-medium">{connection.valueScore}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Projects Together:</span>
                          <span className="font-medium">{connection.projectsWorkedTogether}</span>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Mutual Connections:</span>
                          <span className="font-medium">{connection.mutualConnections}</span>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Last Active:</span>
                          <span className="font-medium">{formatDate(connection.lastActivity)}</span>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Availability:</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(connection.availability)}`}>
                            {connection.availability}
                          </span>
                        </div>

                        {/* Skills */}
                        <div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {connection.skills.slice(0, 3).map((skill) => (
                              <span 
                                key={skill}
                                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                              >
                                {skill}
                              </span>
                            ))}
                            {connection.skills.length > 3 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                +{connection.skills.length - 3}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-3">
                          <button 
                            onClick={() => sendMessage(connection)}
                            className="flex-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm flex items-center justify-center gap-1"
                          >
                            <MessageCircle className="h-3 w-3" />
                            Message
                          </button>
                          <button 
                            onClick={() => setSelectedConnection(connection)}
                            className="px-3 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 text-sm"
                          >
                            <Eye className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredConnections.map((connection) => (
                    <div key={connection.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <img
                              src={connection.profileImage}
                              alt={connection.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                            {connection.isOnline && (
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="font-semibold text-gray-900">{connection.name}</h3>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(connection.availability)}`}>
                                {connection.availability}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">{connection.title}</p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {connection.location}
                              </span>
                              <span className="flex items-center gap-1">
                                <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                {connection.valueScore}
                              </span>
                              <span className="flex items-center gap-1">
                                <Briefcase className="h-3 w-3" />
                                {connection.projectsWorkedTogether} projects
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {connection.mutualConnections} mutual
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => sendMessage(connection)}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm flex items-center gap-1"
                          >
                            <MessageCircle className="h-3 w-3" />
                            Message
                          </button>
                          <button 
                            onClick={() => setSelectedConnection(connection)}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 text-sm"
                          >
                            View Profile
                          </button>
                          <button className="p-2 text-gray-400 hover:text-gray-600">
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {filteredConnections.length === 0 && (
                <div className="text-center py-12">
                  <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No connections found</h3>
                  <p className="text-gray-600">
                    Try adjusting your search criteria or explore new connections
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Invitations Tab */}
          {activeTab === 'invitations' && (
            <div className="p-6">
              <div className="space-y-4">
                {invitations.map((invitation) => (
                  <div key={invitation.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <img
                          src={invitation.profileImage}
                          alt={invitation.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900">{invitation.name}</h3>
                            <span className="text-sm text-gray-500">• {invitation.mutualConnections} mutual connections</span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{invitation.title} at {invitation.company}</p>
                          <p className="text-sm text-gray-700 mb-3">"{invitation.message}"</p>
                          <p className="text-xs text-gray-500">Invited {formatDate(invitation.invitedDate)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm flex items-center gap-1">
                          <UserCheck className="h-3 w-3" />
                          Accept
                        </button>
                        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 text-sm flex items-center gap-1">
                          <UserX className="h-3 w-3" />
                          Decline
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {invitations.length === 0 && (
                  <div className="text-center py-12">
                    <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No pending invitations</h3>
                    <p className="text-gray-600">
                      New connection requests will appear here
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Discover Tab */}
          {activeTab === 'discover' && (
            <div className="p-6">
              <div className="text-center py-12">
                <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Discover New Connections</h3>
                <p className="text-gray-600 mb-4">
                  Find professionals based on skills, interests, and mutual connections
                </p>
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Start Exploring
                </button>
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Network Growth Chart Placeholder */}
                <div className="border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Network Growth</h3>
                  <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">Growth chart would be displayed here</p>
                    </div>
                  </div>
                </div>

                {/* Top Skills */}
                <div className="border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Skills in Network</h3>
                  <div className="space-y-3">
                    {networkStats.topSkillsInNetwork.map((skill, index) => (
                      <div key={skill} className="flex items-center justify-between">
                        <span className="font-medium">{skill}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${100 - index * 15}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">{45 - index * 8}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Connection Detail Modal */}
        {selectedConnection && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={selectedConnection.profileImage}
                      alt={selectedConnection.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    {selectedConnection.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{selectedConnection.name}</h2>
                    <p className="text-gray-600">{selectedConnection.title}</p>
                    {selectedConnection.company && (
                      <p className="text-sm text-gray-500">{selectedConnection.company}</p>
                    )}
                  </div>
                </div>
                
                <button 
                  onClick={() => setSelectedConnection(null)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Location</label>
                    <p className="text-gray-900">{selectedConnection.location}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Hourly Rate</label>
                    <p className="text-gray-900">${selectedConnection.hourlyRate}/hour</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Response Time</label>
                    <p className="text-gray-900">{selectedConnection.responseTime}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Rating</label>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-gray-900">{selectedConnection.rating}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Completed Projects</label>
                    <p className="text-gray-900">{selectedConnection.completedProjects}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Value Score</label>
                    <p className="text-gray-900">{selectedConnection.valueScore}/10</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="text-sm font-medium text-gray-700 mb-2 block">Skills</label>
                <div className="flex flex-wrap gap-2">
                  {selectedConnection.skills.map((skill) => (
                    <span 
                      key={skill}
                      className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="text-sm font-medium text-gray-700 mb-2 block">Social Links</label>
                <div className="flex gap-3">
                  {selectedConnection.socialLinks.linkedin && (
                    <a 
                      href={selectedConnection.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <LinkedinIcon className="h-5 w-5" />
                    </a>
                  )}
                  {selectedConnection.socialLinks.github && (
                    <a 
                      href={selectedConnection.socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-800 hover:bg-gray-50 rounded"
                    >
                      <GithubIcon className="h-5 w-5" />
                    </a>
                  )}
                  {selectedConnection.socialLinks.website && (
                    <a 
                      href={selectedConnection.socialLinks.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-green-600 hover:bg-green-50 rounded"
                    >
                      <Globe className="h-5 w-5" />
                    </a>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => sendMessage(selectedConnection)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center gap-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  Send Message
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 flex items-center gap-2">
                  <Share2 className="h-4 w-4" />
                  Share Profile
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50">
                  <Bookmark className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}