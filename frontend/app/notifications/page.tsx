'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Bell,
  X,
  Search,
  Settings,
  MessageCircle,
  Briefcase,
  DollarSign,
  FileText,
  UserPlus,
  Info,
  Star,
  Eye
} from 'lucide-react';
import { 
  markNotificationAsRead, 
  markAllNotificationsAsRead,
  fetchMe
} from '@/lib/api';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'message' | 'project' | 'payment' | 'system' | 'review' | 'proposal';
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
  actionText?: string;
  sender?: {
    id: string;
    name: string;
    avatar?: string;
  };
  metadata?: {
    projectId?: string;
    projectTitle?: string;
    conversationId?: string;
    paymentId?: string;
    amount?: number;
  };
}

interface NotificationPreferences {
  emailNotifications: boolean;
  pushNotifications: boolean;
  types: {
    messages: boolean;
    projects: boolean;
    payments: boolean;
    reviews: boolean;
    proposals: boolean;
    system: boolean;
  };
  frequency: 'instant' | 'hourly' | 'daily' | 'weekly';
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<{ id: string; name: string; email: string; role: string } | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'unread' | 'message' | 'project' | 'payment' | 'system'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    emailNotifications: true,
    pushNotifications: true,
    types: {
      messages: true,
      projects: true,
      payments: true,
      reviews: true,
      proposals: true,
      system: true
    },
    frequency: 'instant',
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00'
    }
  });

  useEffect(() => {
    loadNotifications();
  }, []);

  useEffect(() => {
    filterNotifications();
  }, [notifications, selectedFilter, searchTerm]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      
      // Get current user
      const user = await fetchMe();
      setCurrentUser(user);
      
      // Mock notifications data
      const mockNotifications: Notification[] = [
        {
          id: '1',
          title: 'New message from Sarah Johnson',
          message: 'The latest designs look great! Can we schedule a call to discuss the next phase?',
          type: 'message',
          isRead: false,
          createdAt: '2025-11-01T14:30:00Z',
          actionUrl: '/chat',
          actionText: 'Reply',
          sender: {
            id: '1',
            name: 'Sarah Johnson',
            avatar: ''
          },
          metadata: {
            conversationId: '1',
            projectId: 'proj_001',
            projectTitle: 'E-commerce Website Redesign'
          }
        },
        {
          id: '2',
          title: 'Payment received',
          message: 'You received a payment of $2,500 for E-commerce Website Redesign',
          type: 'payment',
          isRead: false,
          createdAt: '2025-11-01T13:15:00Z',
          actionUrl: '/payments',
          actionText: 'View Details',
          metadata: {
            paymentId: 'pay_001',
            amount: 2500,
            projectId: 'proj_001',
            projectTitle: 'E-commerce Website Redesign'
          }
        },
        {
          id: '3',
          title: 'New project proposal',
          message: 'Mike Chen sent you a proposal for Mobile App Development',
          type: 'proposal',
          isRead: true,
          createdAt: '2025-11-01T11:45:00Z',
          actionUrl: '/opportunities',
          actionText: 'View Proposal',
          sender: {
            id: '2',
            name: 'Mike Chen',
            avatar: ''
          },
          metadata: {
            projectId: 'proj_002',
            projectTitle: 'Mobile App Development'
          }
        },
        {
          id: '4',
          title: 'Project milestone completed',
          message: 'The wireframe phase has been marked as complete for E-commerce Website Redesign',
          type: 'project',
          isRead: true,
          createdAt: '2025-11-01T10:20:00Z',
          actionUrl: '/projects',
          actionText: 'View Project',
          metadata: {
            projectId: 'proj_001',
            projectTitle: 'E-commerce Website Redesign'
          }
        },
        {
          id: '5',
          title: 'New review received',
          message: 'Sarah Johnson left a 5-star review for your work',
          type: 'review',
          isRead: false,
          createdAt: '2025-11-01T09:30:00Z',
          actionUrl: '/profile',
          actionText: 'View Review',
          sender: {
            id: '1',
            name: 'Sarah Johnson',
            avatar: ''
          }
        },
        {
          id: '6',
          title: 'Account security update',
          message: 'Your password was successfully changed',
          type: 'system',
          isRead: true,
          createdAt: '2025-11-01T08:45:00Z',
          actionUrl: '/profile/security',
          actionText: 'Security Settings'
        },
        {
          id: '7',
          title: 'Weekly earnings summary',
          message: 'You earned $3,200 this week across 2 projects',
          type: 'system',
          isRead: true,
          createdAt: '2025-10-31T18:00:00Z',
          actionUrl: '/dashboard',
          actionText: 'View Dashboard'
        }
      ];
      
      setNotifications(mockNotifications);
      
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterNotifications = () => {
    let filtered = notifications;
    
    // Apply type filter
    if (selectedFilter !== 'all') {
      if (selectedFilter === 'unread') {
        filtered = filtered.filter(n => !n.isRead);
      } else {
        filtered = filtered.filter(n => n.type === selectedFilter);
      }
    }
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(n => 
        n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.sender?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredNotifications(filtered);
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications(prev => prev.map(n => 
        n.id === notificationId ? { ...n, isRead: true } : n
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      handleMarkAsRead(notification.id);
    }
    
    if (notification.actionUrl) {
      router.push(notification.actionUrl);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message':
        return <MessageCircle className="h-5 w-5 text-blue-600" />;
      case 'project':
        return <Briefcase className="h-5 w-5 text-green-600" />;
      case 'payment':
        return <DollarSign className="h-5 w-5 text-emerald-600" />;
      case 'review':
        return <Star className="h-5 w-5 text-yellow-600" />;
      case 'proposal':
        return <FileText className="h-5 w-5 text-purple-600" />;
      case 'system':
        return <Info className="h-5 w-5 text-gray-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) {
      return 'Just now';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const filterOptions = [
    { value: 'all', label: 'All', count: notifications.length },
    { value: 'unread', label: 'Unread', count: unreadCount },
    { value: 'message', label: 'Messages', count: notifications.filter(n => n.type === 'message').length },
    { value: 'project', label: 'Projects', count: notifications.filter(n => n.type === 'project').length },
    { value: 'payment', label: 'Payments', count: notifications.filter(n => n.type === 'payment').length },
    { value: 'system', label: 'System', count: notifications.filter(n => n.type === 'system').length }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Bell className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                <p className="text-gray-600">
                  {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="px-4 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Mark all as read
                </button>
              )}
              <button
                onClick={() => setShowPreferences(true)}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
                title="Notification preferences"
                aria-label="Notification preferences"
              >
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center space-x-2 overflow-x-auto">
              {filterOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedFilter(option.value as typeof selectedFilter)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg whitespace-nowrap ${
                    selectedFilter === option.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                  {option.count > 0 && (
                    <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                      selectedFilter === option.value
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {option.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No notifications found</h3>
              <p className="text-gray-500 mt-1">
                {searchTerm ? 'Try adjusting your search criteria' : 'You\'re all caught up!'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                    !notification.isRead ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium ${
                            !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                          }`}>
                            {notification.title}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {notification.message}
                          </p>
                          
                          {notification.metadata?.projectTitle && (
                            <div className="mt-2">
                              <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                                {notification.metadata.projectTitle}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          <span className="text-xs text-gray-500 whitespace-nowrap">
                            {formatTimeAgo(notification.createdAt)}
                          </span>
                          
                          {!notification.isRead && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkAsRead(notification.id);
                              }}
                              className="p-1 text-gray-400 hover:text-gray-600"
                              title="Mark as read"
                              aria-label="Mark as read"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                      
                      {notification.sender && (
                        <div className="flex items-center mt-2">
                          <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center mr-2">
                            {notification.sender.avatar ? (
                              <img 
                                src={notification.sender.avatar} 
                                alt={notification.sender.name}
                                className="w-6 h-6 rounded-full object-cover"
                              />
                            ) : (
                              <UserPlus className="h-3 w-3 text-gray-600" />
                            )}
                          </div>
                          <span className="text-xs text-gray-500">From {notification.sender.name}</span>
                        </div>
                      )}
                      
                      {notification.actionText && (
                        <div className="mt-3">
                          <span className="inline-flex items-center px-3 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded-full hover:bg-blue-200">
                            {notification.actionText}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Preferences Modal */}
        {showPreferences && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Notification Preferences</h3>
                <button
                  onClick={() => setShowPreferences(false)}
                  className="text-gray-500 hover:text-gray-700"
                  title="Close preferences"
                  aria-label="Close preferences"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* General Settings */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">General</h4>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={preferences.emailNotifications}
                        onChange={(e) => setPreferences(prev => ({
                          ...prev,
                          emailNotifications: e.target.checked
                        }))}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Email notifications</span>
                    </label>
                    
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={preferences.pushNotifications}
                        onChange={(e) => setPreferences(prev => ({
                          ...prev,
                          pushNotifications: e.target.checked
                        }))}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Push notifications</span>
                    </label>
                  </div>
                </div>

                {/* Notification Types */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Notification Types</h4>
                  <div className="space-y-3">
                    {Object.entries(preferences.types).map(([type, enabled]) => (
                      <label key={type} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={enabled}
                          onChange={(e) => setPreferences(prev => ({
                            ...prev,
                            types: {
                              ...prev.types,
                              [type]: e.target.checked
                            }
                          }))}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700 capitalize">
                          {type.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Frequency */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Frequency</h4>
                  <select
                    value={preferences.frequency}
                    onChange={(e) => setPreferences(prev => ({
                      ...prev,
                      frequency: e.target.value as NotificationPreferences['frequency']
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    title="Notification frequency"
                  >
                    <option value="instant">Instant</option>
                    <option value="hourly">Hourly digest</option>
                    <option value="daily">Daily digest</option>
                    <option value="weekly">Weekly digest</option>
                  </select>
                </div>

                {/* Quiet Hours */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Quiet Hours</h4>
                  <label className="flex items-center mb-3">
                    <input
                      type="checkbox"
                      checked={preferences.quietHours.enabled}
                      onChange={(e) => setPreferences(prev => ({
                        ...prev,
                        quietHours: {
                          ...prev.quietHours,
                          enabled: e.target.checked
                        }
                      }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Enable quiet hours</span>
                  </label>
                  
                  {preferences.quietHours.enabled && (
                    <div className="flex items-center space-x-2">
                      <input
                        type="time"
                        value={preferences.quietHours.start}
                        onChange={(e) => setPreferences(prev => ({
                          ...prev,
                          quietHours: {
                            ...prev.quietHours,
                            start: e.target.value
                          }
                        }))}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        title="Start time for quiet hours"
                        aria-label="Start time for quiet hours"
                      />
                      <span className="text-sm text-gray-500">to</span>
                      <input
                        type="time"
                        value={preferences.quietHours.end}
                        onChange={(e) => setPreferences(prev => ({
                          ...prev,
                          quietHours: {
                            ...prev.quietHours,
                            end: e.target.value
                          }
                        }))}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        title="End time for quiet hours"
                        aria-label="End time for quiet hours"
                      />
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowPreferences(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Save preferences
                    setShowPreferences(false);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}