'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Briefcase, 
  DollarSign, 
  MessageSquare, 
  FileText, 
  Star,
  Search,
  Upload,
  Clock,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Plus
} from 'lucide-react';
import InvoiceTable from '../../components/InvoiceTable';
import { fetchInvoices } from '../../lib/api';
import { useAuth } from '../../components/AuthProvider';
import CreateInvoiceModal from '../../components/CreateInvoiceModal';

type Invoice = { id: string; title: string; amount: number; status: string };

interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  totalEarnings: number;
  monthlyEarnings: number;
  completedTasks: number;
  rating: number;
  pendingInvoices: number;
  unreadMessages: number;
}

interface RecentActivity {
  id: string;
  type: 'project' | 'payment' | 'message' | 'review';
  title: string;
  description: string;
  time: string;
  status?: 'pending' | 'completed' | 'urgent';
}

interface QuickLink {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const quickLinks: QuickLink[] = [
  {
    title: 'Find Work',
    description: 'Browse opportunities',
    href: '/opportunities',
    icon: Search,
    color: 'bg-blue-600 hover:bg-blue-700'
  },
  {
    title: 'Upload Files',
    description: 'Add documents',
    href: '/upload',
    icon: Upload,
    color: 'bg-green-600 hover:bg-green-700'
  },
  {
    title: 'Create Invoice',
    description: 'Generate invoice',
    href: '/invoices/create',
    icon: FileText,
    color: 'bg-purple-600 hover:bg-purple-700'
  },
  {
    title: 'Browse Services',
    description: 'Find freelancers',
    href: '/services',
    icon: Users,
    color: 'bg-orange-600 hover:bg-orange-700'
  },
  {
    title: 'Start Chat',
    description: 'Send message',
    href: '/chat',
    icon: MessageSquare,
    color: 'bg-pink-600 hover:bg-pink-700'
  },
  {
    title: 'View Profile',
    description: 'Edit profile',
    href: '/profile',
    icon: Star,
    color: 'bg-yellow-600 hover:bg-yellow-700'
  }
];

export default function DashboardPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [creating, setCreating] = useState(false);
  const { loading } = useAuth();
  
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    activeProjects: 0,
    totalEarnings: 0,
    monthlyEarnings: 0,
    completedTasks: 0,
    rating: 0,
    pendingInvoices: 0,
    unreadMessages: 0
  });

  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchInvoices();
        setInvoices(data || []);
      } catch (e) {
        console.error(e);
      }
    };
    load();

    // Mock stats data
    setStats({
      totalProjects: 24,
      activeProjects: 3,
      totalEarnings: 45000,
      monthlyEarnings: 8500,
      completedTasks: 156,
      rating: 4.8,
      pendingInvoices: 2,
      unreadMessages: 5
    });

    setRecentActivity([
      {
        id: '1',
        type: 'project',
        title: 'E-commerce Project Completed',
        description: 'Successfully delivered the React e-commerce platform',
        time: '2 hours ago',
        status: 'completed'
      },
      {
        id: '2',
        type: 'payment',
        title: 'Payment Received',
        description: '$2,500 from TechStartup Co.',
        time: '1 day ago',
        status: 'completed'
      },
      {
        id: '3',
        type: 'message',
        title: 'New Message',
        description: 'Client inquiry about mobile app project',
        time: '2 days ago',
        status: 'pending'
      }
    ]);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'project': return <Briefcase className="h-4 w-4" />;
      case 'payment': return <DollarSign className="h-4 w-4" />;
      case 'message': return <MessageSquare className="h-4 w-4" />;
      case 'review': return <Star className="h-4 w-4" />;
      default: return <CheckCircle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'completed': return 'text-green-500 bg-green-500/10';
      case 'pending': return 'text-yellow-500 bg-yellow-500/10';
      case 'urgent': return 'text-red-500 bg-red-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome to Workverse</h1>
          <p className="text-gray-400">Here's what's happening with your freelance work today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/search"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">Search</span>
          </Link>
          <button
            onClick={() => setCreating(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New Invoice</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-600/20 rounded-lg">
              <Briefcase className="h-6 w-6 text-blue-400" />
            </div>
            <TrendingUp className="h-4 w-4 text-green-400" />
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-white">{stats.totalProjects}</p>
            <p className="text-sm text-gray-400">Total Projects</p>
            <p className="text-xs text-green-400">+{stats.activeProjects} active</p>
          </div>
        </div>

        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-600/20 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-400" />
            </div>
            <TrendingUp className="h-4 w-4 text-green-400" />
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-white">{formatCurrency(stats.totalEarnings)}</p>
            <p className="text-sm text-gray-400">Total Earnings</p>
            <p className="text-xs text-green-400">+{formatCurrency(stats.monthlyEarnings)} this month</p>
          </div>
        </div>

        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-yellow-600/20 rounded-lg">
              <Star className="h-6 w-6 text-yellow-400" />
            </div>
            <TrendingUp className="h-4 w-4 text-green-400" />
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-white">{stats.rating}</p>
            <p className="text-sm text-gray-400">Average Rating</p>
            <p className="text-xs text-green-400">{stats.completedTasks} reviews</p>
          </div>
        </div>

        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-600/20 rounded-lg">
              <MessageSquare className="h-6 w-6 text-purple-400" />
            </div>
            {stats.unreadMessages > 0 && (
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            )}
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-white">{stats.unreadMessages}</p>
            <p className="text-sm text-gray-400">Unread Messages</p>
            <p className="text-xs text-gray-500">{stats.pendingInvoices} pending invoices</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`p-4 rounded-lg ${link.color} transition-colors group`}
            >
              <div className="flex flex-col items-center text-center">
                <link.icon className="h-8 w-8 text-white mb-2" />
                <span className="text-white font-medium text-sm">{link.title}</span>
                <span className="text-white/70 text-xs mt-1">{link.description}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
            <Link
              href="/notifications"
              className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
            >
              View All
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-700/30 transition-colors">
                <div className={`p-2 rounded-lg ${getStatusColor(activity.status)}`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-medium text-sm">{activity.title}</h3>
                  <p className="text-gray-400 text-sm mt-1">{activity.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Clock className="h-3 w-3 text-gray-500" />
                    <span className="text-gray-500 text-xs">{activity.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Platform Navigation */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Explore Platform</h2>
          <div className="space-y-3">
            <Link
              href="/opportunities"
              className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-700/30 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600/20 rounded-lg">
                  <Briefcase className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-white font-medium">Work Opportunities</h3>
                  <p className="text-gray-400 text-sm">Find new projects and gigs</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-white transition-colors" />
            </Link>

            <Link
              href="/services"
              className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-700/30 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-600/20 rounded-lg">
                  <Users className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <h3 className="text-white font-medium">Browse Services</h3>
                  <p className="text-gray-400 text-sm">Hire talented freelancers</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-white transition-colors" />
            </Link>

            <Link
              href="/files"
              className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-700/30 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-600/20 rounded-lg">
                  <FileText className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-white font-medium">File Management</h3>
                  <p className="text-gray-400 text-sm">Organize project files</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-white transition-colors" />
            </Link>

            <Link
              href="/reputation"
              className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-700/30 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-600/20 rounded-lg">
                  <Star className="h-5 w-5 text-yellow-400" />
                </div>
                <div>
                  <h3 className="text-white font-medium">Reputation & Reviews</h3>
                  <p className="text-gray-400 text-sm">Build your professional reputation</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-white transition-colors" />
            </Link>
          </div>
        </div>
      </div>

      {/* Invoices Section */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Recent Invoices</h2>
          <Link
            href="/invoices"
            className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
          >
            View All
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <InvoiceTable invoices={invoices.slice(0, 5)} />
      </div>

      {/* System Status */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">System Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-400" />
            <div>
              <p className="text-white font-medium">All Systems Operational</p>
              <p className="text-gray-400 text-sm">Platform running smoothly</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-400" />
            <div>
              <p className="text-white font-medium">Payments Processing</p>
              <p className="text-gray-400 text-sm">99.9% uptime</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-400" />
            <div>
              <p className="text-white font-medium">Maintenance Scheduled</p>
              <p className="text-gray-400 text-sm">Nov 15, 2:00 AM UTC</p>
            </div>
          </div>
        </div>
      </div>

      {creating && (
        <CreateInvoiceModal
          onClose={() => setCreating(false)}
          onSave={(invoice) => {
            setInvoices([...invoices, invoice]);
            setCreating(false);
          }}
        />
      )}
    </div>
  );
}
