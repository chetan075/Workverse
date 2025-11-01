'use client';

import { useState, useEffect } from 'react';
import {
  Star,
  TrendingUp,
  Award,
  Clock,
  Target,
  Users,
  MessageSquare,
  CheckCircle,
  BarChart3,
  Download,
  Share2,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';
import { fetchUserReputation, fetchUserReviews } from '@/lib/api';

interface ReputationData {
  id: string;
  userId: string;
  score: number;
  completedProjects: number;
  totalEarnings: number;
  averageRating: number;
  responseTime: number;
  onTimeDelivery: number;
  qualityScore: number;
  communicationScore: number;
  timelinessScore: number;
  professionalismScore: number;
  totalReviews: number;
  updatedAt: string;
  createdAt: string;
}

interface Review {
  id: string;
  projectId: string;
  authorId: string;
  targetId: string;
  rating: number;
  comment?: string;
  quality?: number;
  communication?: number;
  timeliness?: number;
  professionalism?: number;
  createdAt: string;
  project: { title: string };
  author: { name: string; profileImage?: string | null };
}

const mockReputationData: ReputationData = {
  id: '1',
  userId: 'current-user',
  score: 87.5,
  completedProjects: 12,
  totalEarnings: 24500,
  averageRating: 4.8,
  responseTime: 2,
  onTimeDelivery: 95.0,
  qualityScore: 4.7,
  communicationScore: 4.9,
  timelinessScore: 4.6,
  professionalismScore: 4.8,
  totalReviews: 15,
  updatedAt: '2024-01-15T10:00:00Z',
  createdAt: '2024-01-01T10:00:00Z'
};

const scoreCategories = [
  { key: 'qualityScore', label: 'Quality', icon: Award, color: 'blue' },
  { key: 'communicationScore', label: 'Communication', icon: MessageSquare, color: 'green' },
  { key: 'timelinessScore', label: 'Timeliness', icon: Clock, color: 'orange' },
  { key: 'professionalismScore', label: 'Professionalism', icon: Users, color: 'purple' }
];

const achievements = [
  { 
    id: 1, 
    title: 'Top Performer', 
    description: '95%+ on-time delivery rate', 
    icon: Target, 
    earned: true,
    level: 'gold'
  },
  { 
    id: 2, 
    title: 'Client Favorite', 
    description: '4.8+ average rating', 
    icon: Star, 
    earned: true,
    level: 'gold'
  },
  { 
    id: 3, 
    title: 'Quick Responder', 
    description: 'Response time under 4 hours', 
    icon: Clock, 
    earned: true,
    level: 'silver'
  },
  { 
    id: 4, 
    title: 'Quality Expert', 
    description: '4.5+ quality score', 
    icon: Award, 
    earned: true,
    level: 'gold'
  },
  { 
    id: 5, 
    title: 'Communication Pro', 
    description: '4.8+ communication score', 
    icon: MessageSquare, 
    earned: true,
    level: 'gold'
  },
  { 
    id: 6, 
    title: 'Project Master', 
    description: '50+ completed projects', 
    icon: CheckCircle, 
    earned: false,
    level: 'platinum'
  }
];

export default function ReputationDashboard() {
  const [reputation, setReputation] = useState<ReputationData>(mockReputationData);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [timeFilter, setTimeFilter] = useState('all');

  useEffect(() => {
    loadReputationData();
  }, []);

  const loadReputationData = async () => {
    try {
      setLoading(true);
      
      // Load reputation data
      const reputationData = await fetchUserReputation('current-user');
      setReputation(reputationData);
      
      // Load reviews
      const reviewsData = await fetchUserReviews('current-user');
      setReviews(reviewsData.reviews);
      
    } catch (error) {
      console.error('Error loading reputation data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 4.5) return 'text-green-600 bg-green-100';
    if (score >= 4.0) return 'text-blue-600 bg-blue-100';
    if (score >= 3.5) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreTrend = () => {
    // Mock trend calculation - in real app, compare with previous period
    const trend = Math.random() - 0.5;
    if (trend > 0.1) return { icon: ArrowUp, color: 'text-green-600', value: '+0.2' };
    if (trend < -0.1) return { icon: ArrowDown, color: 'text-red-600', value: '-0.1' };
    return { icon: Minus, color: 'text-gray-600', value: '0.0' };
  };

  const getAchievementBadgeColor = (level: string, earned: boolean) => {
    if (!earned) return 'bg-gray-100 text-gray-400';
    switch (level) {
      case 'platinum': return 'bg-purple-100 text-purple-800';
      case 'gold': return 'bg-yellow-100 text-yellow-800';
      case 'silver': return 'bg-gray-100 text-gray-800';
      case 'bronze': return 'bg-orange-100 text-orange-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'reviews', name: 'Reviews', icon: Star },
    { id: 'achievements', name: 'Achievements', icon: Award },
    { id: 'analytics', name: 'Analytics', icon: TrendingUp }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!reputation) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500 mb-4">Unable to load reputation data</div>
          <button 
            onClick={loadReputationData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
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
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Reputation Dashboard</h1>
              <p className="text-gray-600 mt-1">Track your professional reputation and performance metrics</p>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Download className="h-4 w-4" />
                Export Report
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Share2 className="h-4 w-4" />
                Share Profile
              </button>
            </div>
          </div>
        </div>

        {/* Overall Score Card */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 mb-8 text-white">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{reputation?.score || 0}</div>
              <div className="text-blue-100">Overall Score</div>
              <div className="text-sm text-blue-200 mt-1">Out of 100</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-2">
                <Star className="h-6 w-6 text-yellow-300 fill-current" />
                <span className="text-4xl font-bold">{reputation?.averageRating || 0}</span>
              </div>
              <div className="text-blue-100">Average Rating</div>
              <div className="text-sm text-blue-200 mt-1">{reputation?.totalReviews || 0} reviews</div>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{reputation?.completedProjects || 0}</div>
              <div className="text-blue-100">Projects Completed</div>
              <div className="text-sm text-blue-200 mt-1">100% completion rate</div>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{formatCurrency(reputation?.totalEarnings || 0)}</div>
              <div className="text-blue-100">Total Earnings</div>
              <div className="text-sm text-blue-200 mt-1">Lifetime value</div>
            </div>
          </div>
        </div>

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
              <div className="space-y-8">
                {/* Performance Metrics */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Metrics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {scoreCategories.map((category) => {
                      const Icon = category.icon;
                      const score = (reputation[category.key as keyof ReputationData] as number) || 0;
                      const trend = getScoreTrend();
                      const TrendIcon = trend.icon;
                      
                      return (
                        <div key={category.key} className="bg-white border border-gray-200 rounded-lg p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className={`p-2 rounded-lg bg-${category.color}-100`}>
                              <Icon className={`h-5 w-5 text-${category.color}-600`} />
                            </div>
                            <div className={`flex items-center gap-1 text-sm ${trend.color}`}>
                              <TrendIcon className="h-3 w-3" />
                              {trend.value}
                            </div>
                          </div>
                          <div className="text-2xl font-bold text-gray-900 mb-1">
                            {score ? score.toFixed(1) : '0.0'}
                          </div>
                          <div className="text-sm text-gray-600">{category.label}</div>
                          <div className="mt-3">
                            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                              <span>Score</span>
                              <span>{score ? score.toFixed(1) : '0.0'}/5.0</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div 
                                className={`bg-${category.color}-600 h-1.5 rounded-full transition-all duration-300`}
                                style={{
                                  width: `${score ? (score / 5) * 100 : 0}%`
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Key Stats */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Key Statistics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-2 rounded-lg bg-green-100">
                          <Target className="h-5 w-5 text-green-600" />
                        </div>
                        <span className="text-green-600 text-sm font-medium">Excellent</span>
                      </div>
                      <div className="text-2xl font-bold text-gray-900 mb-1">
                        {reputation.onTimeDelivery}%
                      </div>
                      <div className="text-sm text-gray-600">On-Time Delivery</div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-2 rounded-lg bg-blue-100">
                          <Clock className="h-5 w-5 text-blue-600" />
                        </div>
                        <span className="text-blue-600 text-sm font-medium">Fast</span>
                      </div>
                      <div className="text-2xl font-bold text-gray-900 mb-1">
                        {reputation.responseTime}h
                      </div>
                      <div className="text-sm text-gray-600">Response Time</div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-2 rounded-lg bg-purple-100">
                          <CheckCircle className="h-5 w-5 text-purple-600" />
                        </div>
                        <span className="text-purple-600 text-sm font-medium">Perfect</span>
                      </div>
                      <div className="text-2xl font-bold text-gray-900 mb-1">100%</div>
                      <div className="text-sm text-gray-600">Success Rate</div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
                  <div className="bg-white border border-gray-200 rounded-lg">
                    <div className="p-6 space-y-4">
                      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Star className="h-4 w-4 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">Received 5-star review</p>
                          <p className="text-sm text-gray-600">E-commerce Website Development project</p>
                        </div>
                        <span className="text-sm text-gray-500">2 days ago</span>
                      </div>

                      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Award className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">Earned &quot;Top Performer&quot; badge</p>
                          <p className="text-sm text-gray-600">Achieved 95%+ on-time delivery rate</p>
                        </div>
                        <span className="text-sm text-gray-500">1 week ago</span>
                      </div>

                      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <CheckCircle className="h-4 w-4 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">Completed project milestone</p>
                          <p className="text-sm text-gray-600">Mobile App UI Design - Final delivery</p>
                        </div>
                        <span className="text-sm text-gray-500">2 weeks ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Client Reviews</h3>
                  <div className="flex items-center gap-3">
                    <select 
                      value={timeFilter} 
                      onChange={(e) => setTimeFilter(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      title="Filter reviews by time period"
                    >
                      <option value="all">All Time</option>
                      <option value="month">Last Month</option>
                      <option value="quarter">Last Quarter</option>
                      <option value="year">Last Year</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="bg-white border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">
                              {review.author.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{review.author.name}</p>
                            <p className="text-sm text-gray-600">{review.project.title}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 mb-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-sm text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {review.comment && (
                        <p className="text-gray-700 mb-4">{review.comment}</p>
                      )}

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Quality:</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(review.quality || 0)}`}>
                            {review.quality}/5
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Communication:</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(review.communication || 0)}`}>
                            {review.communication}/5
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Timeliness:</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(review.timeliness || 0)}`}>
                            {review.timeliness}/5
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Professionalism:</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(review.professionalism || 0)}`}>
                            {review.professionalism}/5
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'achievements' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Achievements & Badges</h3>
                  <p className="text-gray-600 mb-6">Earn badges by maintaining high performance standards</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {achievements.map((achievement) => {
                    const Icon = achievement.icon;
                    return (
                      <div 
                        key={achievement.id} 
                        className={`border rounded-lg p-6 ${
                          achievement.earned 
                            ? 'border-blue-200 bg-blue-50' 
                            : 'border-gray-200 bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <div className={`p-3 rounded-lg ${
                            achievement.earned 
                              ? getAchievementBadgeColor(achievement.level, true)
                              : 'bg-gray-200'
                          }`}>
                            <Icon className={`h-6 w-6 ${
                              achievement.earned ? '' : 'text-gray-400'
                            }`} />
                          </div>
                          <div>
                            <h4 className={`font-medium ${
                              achievement.earned ? 'text-gray-900' : 'text-gray-500'
                            }`}>
                              {achievement.title}
                            </h4>
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                              getAchievementBadgeColor(achievement.level, achievement.earned)
                            }`}>
                              {achievement.level.toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <p className={`text-sm ${
                          achievement.earned ? 'text-gray-700' : 'text-gray-500'
                        }`}>
                          {achievement.description}
                        </p>
                        {achievement.earned && (
                          <div className="mt-3 flex items-center gap-1 text-green-600 text-sm">
                            <CheckCircle className="h-4 w-4" />
                            Earned
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="text-center py-12">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Advanced Analytics</h3>
                <p className="text-gray-600 mb-4">Detailed performance analytics coming soon</p>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Request Beta Access
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}