'use client';

import { useState, useEffect } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Users, 
  Calendar, 
  MapPin, 
  Star, 
  Eye, 
  ThumbsUp, 
  ThumbsDown, 
  Bookmark, 
  Flag, 
  MoreHorizontal, 
  Clock, 
  Globe, 
  Lock, 
  UserPlus, 
  UserMinus, 
  Send, 
  Filter, 
  Search, 
  Rss, 
  Bell, 
  Settings, 
  Plus, 
  Camera, 
  Video, 
  FileText, 
  Link2, 
  Award, 
  TrendingUp, 
  Activity, 
  Briefcase, 
  Code, 
  Zap, 
  Target, 
  Coffee, 
  BookOpen, 
  Lightbulb, 
  Sparkles, 
  Trophy, 
  Gift, 
  Handshake, 
  Megaphone, 
  Hash,
  CheckCircle,
  AlertCircle,
  Image as ImageIcon,
  Download,
  ExternalLink,
  Mail,
  Linkedin,
  Twitter,
  Facebook,
  ArrowUp,
  ArrowDown,
  Reply,
  Edit,
  Trash2,
  Maximize2,
  Minimize2
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  title: string;
  company?: string;
  profileImage?: string;
  isVerified?: boolean;
  isFollowing?: boolean;
  followersCount: number;
  connectionLevel: 'direct' | '2nd' | '3rd' | 'none';
}

interface Post {
  id: string;
  user: User;
  content: string;
  type: 'text' | 'image' | 'video' | 'article' | 'achievement' | 'project' | 'event';
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  isBookmarked: boolean;
  media?: {
    type: 'image' | 'video';
    url: string;
    thumbnail?: string;
    alt?: string;
  }[];
  article?: {
    title: string;
    summary: string;
    readTime: number;
    url: string;
  };
  achievement?: {
    type: 'certification' | 'milestone' | 'award' | 'completion';
    title: string;
    issuer: string;
    date: string;
  };
  project?: {
    title: string;
    description: string;
    tech: string[];
    status: 'in-progress' | 'completed' | 'on-hold';
  };
  event?: {
    title: string;
    date: string;
    location: string;
    attendees: number;
    isAttending: boolean;
  };
  visibility: 'public' | 'connections' | 'private';
  tags: string[];
}

interface NetworkEvent {
  id: string;
  title: string;
  description: string;
  type: 'webinar' | 'workshop' | 'networking' | 'conference' | 'meetup';
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  isVirtual: boolean;
  organizer: User;
  attendeesCount: number;
  maxAttendees?: number;
  isAttending: boolean;
  price?: number;
  tags: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

interface Comment {
  id: string;
  user: User;
  content: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
  replies: Comment[];
}

export default function SocialFeaturesPage() {
  const [activeTab, setActiveTab] = useState<'feed' | 'events' | 'following' | 'trending'>('feed');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showPostModal, setShowPostModal] = useState(false);
  const [showComments, setShowComments] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'connections' | 'trending' | 'recent'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [posts, setPosts] = useState<Post[]>([
    {
      id: 'post-1',
      user: {
        id: 'user-1',
        name: 'Sarah Johnson',
        title: 'Senior Full Stack Developer',
        company: 'TechCorp',
        profileImage: 'https://i.pravatar.cc/150?u=sarah',
        isVerified: true,
        isFollowing: true,
        followersCount: 1250,
        connectionLevel: 'direct'
      },
      content: 'Just completed my first React Native project! The learning curve was steep but totally worth it. Here are 5 key takeaways that helped me succeed...',
      type: 'text',
      timestamp: '2024-10-31T10:30:00Z',
      likes: 24,
      comments: 8,
      shares: 3,
      isLiked: false,
      isBookmarked: true,
      visibility: 'public',
      tags: ['react-native', 'mobile-development', 'learning']
    },
    {
      id: 'post-2',
      user: {
        id: 'user-2',
        name: 'Mike Chen',
        title: 'UI/UX Designer',
        company: 'DesignStudio',
        profileImage: 'https://i.pravatar.cc/150?u=mike',
        isVerified: false,
        isFollowing: false,
        followersCount: 890,
        connectionLevel: '2nd'
      },
      content: 'New project showcase: E-commerce redesign that increased conversion rates by 40%! 🎉',
      type: 'image',
      timestamp: '2024-10-31T08:15:00Z',
      likes: 67,
      comments: 15,
      shares: 12,
      isLiked: true,
      isBookmarked: false,
      media: [
        {
          type: 'image',
          url: 'https://via.placeholder.com/600x400/3B82F6/FFFFFF?text=E-commerce+Design',
          alt: 'E-commerce website redesign mockup'
        }
      ],
      visibility: 'public',
      tags: ['ui-design', 'ecommerce', 'case-study']
    },
    {
      id: 'post-3',
      user: {
        id: 'user-3',
        name: 'Emily Rodriguez',
        title: 'Data Scientist',
        company: 'AI Labs',
        profileImage: 'https://i.pravatar.cc/150?u=emily',
        isVerified: true,
        isFollowing: true,
        followersCount: 2100,
        connectionLevel: 'direct'
      },
      content: 'Excited to share that I just earned my AWS Machine Learning Specialty certification! 🏆',
      type: 'achievement',
      timestamp: '2024-10-30T16:45:00Z',
      likes: 89,
      comments: 23,
      shares: 8,
      isLiked: true,
      isBookmarked: true,
      achievement: {
        type: 'certification',
        title: 'AWS Certified Machine Learning - Specialty',
        issuer: 'Amazon Web Services',
        date: '2024-10-30'
      },
      visibility: 'public',
      tags: ['aws', 'machine-learning', 'certification']
    }
  ]);

  const [events, setEvents] = useState<NetworkEvent[]>([
    {
      id: 'event-1',
      title: 'AI in Web Development: Future Trends',
      description: 'Join industry experts as we explore how AI is revolutionizing web development practices and what it means for developers.',
      type: 'webinar',
      date: '2024-11-15',
      startTime: '14:00',
      endTime: '15:30',
      location: 'Virtual Event',
      isVirtual: true,
      organizer: {
        id: 'org-1',
        name: 'TechTalks',
        title: 'Event Organizer',
        followersCount: 5600,
        connectionLevel: 'none'
      },
      attendeesCount: 234,
      maxAttendees: 500,
      isAttending: true,
      price: 0,
      tags: ['ai', 'web-development', 'trends'],
      difficulty: 'intermediate'
    },
    {
      id: 'event-2',
      title: 'Freelancer Networking Meetup',
      description: 'Connect with fellow freelancers, share experiences, and build valuable professional relationships.',
      type: 'networking',
      date: '2024-11-08',
      startTime: '18:00',
      endTime: '21:00',
      location: 'Downtown Convention Center',
      isVirtual: false,
      organizer: {
        id: 'org-2',
        name: 'FreelanceHub',
        title: 'Community Manager',
        followersCount: 3200,
        connectionLevel: 'none'
      },
      attendeesCount: 45,
      maxAttendees: 100,
      isAttending: false,
      price: 25,
      tags: ['networking', 'freelancing', 'community'],
      difficulty: 'beginner'
    }
  ]);

  const [comments] = useState<Record<string, Comment[]>>({
    'post-1': [
      {
        id: 'comment-1',
        user: {
          id: 'user-4',
          name: 'Alex Thompson',
          title: 'Mobile Developer',
          followersCount: 450,
          connectionLevel: 'direct'
        },
        content: 'Great insights! React Native can be tricky at first but it\'s so powerful once you get the hang of it.',
        timestamp: '2024-10-31T11:00:00Z',
        likes: 5,
        isLiked: false,
        replies: []
      },
      {
        id: 'comment-2',
        user: {
          id: 'user-5',
          name: 'Lisa Park',
          title: 'Frontend Developer',
          followersCount: 680,
          connectionLevel: '2nd'
        },
        content: 'Would love to see a detailed breakdown of your learning process!',
        timestamp: '2024-10-31T11:15:00Z',
        likes: 3,
        isLiked: true,
        replies: []
      }
    ]
  });

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}d`;
  };

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  const handleBookmark = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, isBookmarked: !post.isBookmarked }
        : post
    ));
  };

  const handleFollow = (userId: string) => {
    setPosts(posts.map(post => 
      post.user.id === userId 
        ? { ...post, user: { ...post.user, isFollowing: !post.user.isFollowing } }
        : post
    ));
  };

  const handleEventAttendance = (eventId: string) => {
    setEvents(events.map(event => 
      event.id === eventId 
        ? { 
            ...event, 
            isAttending: !event.isAttending,
            attendeesCount: event.isAttending ? event.attendeesCount - 1 : event.attendeesCount + 1
          }
        : event
    ));
  };

  const getConnectionColor = (level: string) => {
    switch (level) {
      case 'direct': return 'text-green-600';
      case '2nd': return 'text-blue-600';
      case '3rd': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  const getPostTypeIcon = (type: string) => {
    switch (type) {
      case 'achievement': return <Trophy className="h-4 w-4 text-yellow-600" />;
      case 'project': return <Code className="h-4 w-4 text-blue-600" />;
      case 'article': return <FileText className="h-4 w-4 text-purple-600" />;
      case 'event': return <Calendar className="h-4 w-4 text-red-600" />;
      case 'image': return <ImageIcon className="h-4 w-4 text-green-600" />;
      case 'video': return <Video className="h-4 w-4 text-red-600" />;
      default: return <MessageCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'webinar': return <Video className="h-5 w-5 text-blue-600" />;
      case 'workshop': return <BookOpen className="h-5 w-5 text-green-600" />;
      case 'networking': return <Users className="h-5 w-5 text-purple-600" />;
      case 'conference': return <Megaphone className="h-5 w-5 text-red-600" />;
      case 'meetup': return <Coffee className="h-5 w-5 text-orange-600" />;
      default: return <Calendar className="h-5 w-5 text-gray-600" />;
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (!matchesSearch) return false;
    
    switch (filter) {
      case 'connections':
        return post.user.connectionLevel === 'direct';
      case 'trending':
        return post.likes > 20;
      case 'recent':
        const hoursSince = (new Date().getTime() - new Date(post.timestamp).getTime()) / (1000 * 60 * 60);
        return hoursSince < 24;
      default:
        return true;
    }
  });

  const trendingTopics = ['react-native', 'ai', 'web-development', 'freelancing', 'ui-design', 'machine-learning'];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Professional Network</h1>
              <p className="text-gray-600 mt-1">
                Stay connected with your professional community
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="p-2 text-gray-600 hover:text-gray-900 border rounded-lg">
                <Bell className="h-5 w-5" />
              </button>
              <button 
                onClick={() => setShowPostModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
                Create Post
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'feed', name: 'Activity Feed', icon: Rss },
                { id: 'events', name: 'Events', icon: Calendar },
                { id: 'following', name: 'Following', icon: Users },
                { id: 'trending', name: 'Trending', icon: TrendingUp }
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 py-3 px-1 border-b-2 font-medium text-sm ${
                      isActive
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
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search posts, people, topics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Filter</label>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Posts</option>
                  <option value="connections">My Connections</option>
                  <option value="trending">Trending</option>
                  <option value="recent">Recent (24h)</option>
                </select>
              </div>
            </div>

            {/* Trending Topics */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Trending Topics</h3>
              <div className="space-y-2">
                {trendingTopics.map((topic) => (
                  <button
                    key={topic}
                    onClick={() => setSearchQuery(topic)}
                    className="flex items-center gap-2 w-full text-left p-2 rounded hover:bg-gray-50"
                  >
                    <Hash className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-700">{topic}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Activity Feed */}
            {activeTab === 'feed' && (
              <div className="space-y-6">
                {filteredPosts.map((post) => (
                  <div key={post.id} className="bg-white rounded-lg shadow-sm p-6">
                    {/* Post Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3">
                        <div className="relative">
                          {post.user.profileImage ? (
                            <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                              <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500"></div>
                            </div>
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                              <Users className="h-6 w-6 text-gray-500" />
                            </div>
                          )}
                          {post.user.isVerified && (
                            <CheckCircle className="absolute -bottom-1 -right-1 h-4 w-4 text-blue-500 bg-white rounded-full" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900">{post.user.name}</h3>
                            <span className={`text-xs ${getConnectionColor(post.user.connectionLevel)}`}>
                              • {post.user.connectionLevel === 'direct' ? '1st' : post.user.connectionLevel}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{post.user.title}</p>
                          {post.user.company && (
                            <p className="text-xs text-gray-500">{post.user.company}</p>
                          )}
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-500">{formatTimeAgo(post.timestamp)}</span>
                            <span className="text-xs text-gray-400">•</span>
                            <div className="flex items-center gap-1">
                              {getPostTypeIcon(post.type)}
                              <span className="text-xs text-gray-500 capitalize">{post.type}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {!post.user.isFollowing && post.user.connectionLevel !== 'direct' && (
                          <button
                            onClick={() => handleFollow(post.user.id)}
                            className="text-xs px-3 py-1 border border-blue-600 text-blue-600 rounded hover:bg-blue-50"
                          >
                            Follow
                          </button>
                        )}
                        <button className="p-1 text-gray-400 hover:text-gray-600">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Post Content */}
                    <div className="mb-4">
                      <p className="text-gray-900 mb-3">{post.content}</p>
                      
                      {/* Achievement */}
                      {post.achievement && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                          <div className="flex items-center gap-3">
                            <Award className="h-8 w-8 text-yellow-600" />
                            <div>
                              <h4 className="font-semibold text-gray-900">{post.achievement.title}</h4>
                              <p className="text-sm text-gray-600">Issued by {post.achievement.issuer}</p>
                              <p className="text-xs text-gray-500">Earned on {new Date(post.achievement.date).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Media */}
                      {post.media && post.media.length > 0 && (
                        <div className="grid grid-cols-1 gap-3">
                          {post.media.map((media, index) => (
                            <div key={index} className="rounded-lg overflow-hidden border">
                              <div className="aspect-video bg-gray-200 flex items-center justify-center">
                                <ImageIcon className="h-16 w-16 text-gray-400" />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Tags */}
                      {post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {post.tags.map((tag) => (
                            <button
                              key={tag}
                              onClick={() => setSearchQuery(tag)}
                              className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200"
                            >
                              #{tag}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Post Actions */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-6">
                        <button
                          onClick={() => handleLike(post.id)}
                          className={`flex items-center gap-2 text-sm ${
                            post.isLiked ? 'text-red-600' : 'text-gray-600 hover:text-red-600'
                          }`}
                        >
                          <Heart className={`h-4 w-4 ${post.isLiked ? 'fill-current' : ''}`} />
                          <span>{post.likes}</span>
                        </button>
                        
                        <button
                          onClick={() => setShowComments(showComments === post.id ? null : post.id)}
                          className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600"
                        >
                          <MessageCircle className="h-4 w-4" />
                          <span>{post.comments}</span>
                        </button>
                        
                        <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-green-600">
                          <Share2 className="h-4 w-4" />
                          <span>{post.shares}</span>
                        </button>
                      </div>
                      
                      <button
                        onClick={() => handleBookmark(post.id)}
                        className={`p-1 ${
                          post.isBookmarked ? 'text-yellow-600' : 'text-gray-400 hover:text-yellow-600'
                        }`}
                      >
                        <Bookmark className={`h-4 w-4 ${post.isBookmarked ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    {/* Comments */}
                    {showComments === post.id && comments[post.id] && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="space-y-3">
                          {comments[post.id].map((comment) => (
                            <div key={comment.id} className="flex gap-3">
                              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                                <Users className="h-4 w-4 text-gray-500" />
                              </div>
                              <div className="flex-1">
                                <div className="bg-gray-50 rounded-lg p-3">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium text-sm text-gray-900">{comment.user.name}</span>
                                    <span className="text-xs text-gray-500">{formatTimeAgo(comment.timestamp)}</span>
                                  </div>
                                  <p className="text-sm text-gray-700">{comment.content}</p>
                                </div>
                                <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                  <button className="hover:text-red-600">
                                    Like ({comment.likes})
                                  </button>
                                  <button className="hover:text-blue-600">Reply</button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {/* Add Comment */}
                        <div className="flex gap-3 mt-4">
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                            <Users className="h-4 w-4 text-gray-500" />
                          </div>
                          <div className="flex-1">
                            <input
                              type="text"
                              placeholder="Write a comment..."
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {filteredPosts.length === 0 && (
                  <div className="text-center py-12">
                    <Activity className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No posts found</h3>
                    <p className="text-gray-600 mb-4">
                      {searchQuery ? 'Try adjusting your search criteria' : 'Start following people to see their updates'}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Events Tab */}
            {activeTab === 'events' && (
              <div className="space-y-6">
                {events.map((event) => (
                  <div key={event.id} className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-gray-100 rounded-lg">
                          {getEventTypeIcon(event.type)}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">{event.title}</h3>
                          <p className="text-gray-600 text-sm mb-2">{event.description}</p>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(event.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{event.startTime} - {event.endTime}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              <span>{event.location}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              <span>{event.attendeesCount} attending</span>
                              {event.maxAttendees && <span>/ {event.maxAttendees} max</span>}
                            </div>
                            {event.price !== undefined && (
                              <div className="flex items-center gap-1">
                                <span className="font-medium">
                                  {event.price === 0 ? 'Free' : `$${event.price}`}
                                </span>
                              </div>
                            )}
                            {event.difficulty && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs capitalize">
                                {event.difficulty}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleEventAttendance(event.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium ${
                          event.isAttending
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {event.isAttending ? 'Attending' : 'Attend'}
                      </button>
                    </div>
                    
                    {/* Event Tags */}
                    <div className="flex flex-wrap gap-2">
                      {event.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Other tabs placeholder */}
            {(activeTab === 'following' || activeTab === 'trending') && (
              <div className="text-center py-12">
                <Eye className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Coming Soon</h3>
                <p className="text-gray-600">
                  This section is under development and will be available soon.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Create Post Modal */}
        {showPostModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Create Post</h3>
                <button 
                  onClick={() => setShowPostModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <textarea
                  placeholder="What's on your mind? Share your professional insights, achievements, or ask for advice..."
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                ></textarea>
                
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
                    <Camera className="h-4 w-4" />
                    <span className="text-sm">Photo</span>
                  </button>
                  <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
                    <Video className="h-4 w-4" />
                    <span className="text-sm">Video</span>
                  </button>
                  <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
                    <FileText className="h-4 w-4" />
                    <span className="text-sm">Article</span>
                  </button>
                  <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
                    <Award className="h-4 w-4" />
                    <span className="text-sm">Achievement</span>
                  </button>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-gray-400" />
                    <select className="text-sm border-none focus:ring-0">
                      <option>Public</option>
                      <option>Connections only</option>
                      <option>Private</option>
                    </select>
                  </div>
                  
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setShowPostModal(false)}
                      className="px-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                      Post
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}