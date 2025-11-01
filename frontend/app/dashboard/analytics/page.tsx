'use client';

import { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar, 
  Clock, 
  Users, 
  Award, 
  Activity, 
  PieChart, 
  LineChart, 
  Target, 
  AlertCircle, 
  CheckCircle, 
  Star, 
  Briefcase, 
  CreditCard, 
  FileText, 
  Download, 
  Filter, 
  RefreshCw, 
  Eye, 
  Zap, 
  Globe, 
  MapPin, 
  Percent, 
  Calculator, 
  ArrowUp, 
  ArrowDown, 
  Minus,
  ChevronRight,
  ChevronDown,
  Info,
  Settings,
  Share2,
  Mail,
  Phone,
  Building,
  Wallet,
  CreditCard as CCard,
  Receipt,
  Search,
  Calendar as CalendarIcon,
  MoreHorizontal
} from 'lucide-react';

interface RevenueData {
  totalRevenue: number;
  monthlyRevenue: number;
  revenueGrowth: number;
  averageProjectValue: number;
  pendingPayments: number;
  completedPayments: number;
  monthlyEarnings: { month: string; amount: number; }[];
  revenueByCategory: { category: string; amount: number; percentage: number; }[];
}

interface ProjectMetrics {
  totalProjects: number;
  completedProjects: number;
  activeProjects: number;
  successRate: number;
  averageCompletionTime: number;
  onTimeDelivery: number;
  clientSatisfaction: number;
  projectTrends: { month: string; completed: number; started: number; }[];
}

interface MarketTrends {
  demandGrowth: number;
  averageRates: { skill: string; rate: number; trend: 'up' | 'down' | 'stable'; }[];
  hotSkills: { skill: string; demand: number; growth: number; }[];
  marketShare: { category: string; percentage: number; }[];
  competitorAnalysis: { metric: string; yourValue: number; marketAverage: number; }[];
}

interface EngagementMetrics {
  dailyActiveUsers: number;
  sessionDuration: number;
  pageViews: number;
  engagementRate: number;
  topPages: { page: string; views: number; }[];
  userActivity: { day: string; users: number; }[];
  featureUsage: { feature: string; usage: number; }[];
}

interface FinancialReport {
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  profitMargin: number;
  taxLiability: number;
  monthlyBreakdown: { month: string; income: number; expenses: number; profit: number; }[];
  expenseCategories: { category: string; amount: number; percentage: number; }[];
}

export default function DashboardAnalyticsPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'revenue' | 'projects' | 'market' | 'engagement' | 'financial'>('overview');
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

  // Mock data - in real app, this would come from APIs
  const [revenueData] = useState<RevenueData>({
    totalRevenue: 125430,
    monthlyRevenue: 18650,
    revenueGrowth: 23.5,
    averageProjectValue: 3450,
    pendingPayments: 12400,
    completedPayments: 113030,
    monthlyEarnings: [
      { month: 'Jan', amount: 12000 },
      { month: 'Feb', amount: 15000 },
      { month: 'Mar', amount: 18000 },
      { month: 'Apr', amount: 16500 },
      { month: 'May', amount: 21000 },
      { month: 'Jun', amount: 18650 }
    ],
    revenueByCategory: [
      { category: 'Web Development', amount: 45000, percentage: 36 },
      { category: 'Mobile Apps', amount: 35000, percentage: 28 },
      { category: 'UI/UX Design', amount: 25000, percentage: 20 },
      { category: 'Consulting', amount: 20430, percentage: 16 }
    ]
  });

  const [projectMetrics] = useState<ProjectMetrics>({
    totalProjects: 47,
    completedProjects: 42,
    activeProjects: 5,
    successRate: 89.4,
    averageCompletionTime: 18.5,
    onTimeDelivery: 85.7,
    clientSatisfaction: 4.7,
    projectTrends: [
      { month: 'Jan', completed: 6, started: 8 },
      { month: 'Feb', completed: 7, started: 9 },
      { month: 'Mar', completed: 8, started: 7 },
      { month: 'Apr', completed: 6, started: 10 },
      { month: 'May', completed: 9, started: 8 },
      { month: 'Jun', completed: 6, started: 5 }
    ]
  });

  const [marketTrends] = useState<MarketTrends>({
    demandGrowth: 15.8,
    averageRates: [
      { skill: 'React', rate: 85, trend: 'up' },
      { skill: 'Node.js', rate: 80, trend: 'up' },
      { skill: 'Python', rate: 75, trend: 'stable' },
      { skill: 'UI/UX', rate: 70, trend: 'up' },
      { skill: 'Mobile', rate: 90, trend: 'down' }
    ],
    hotSkills: [
      { skill: 'AI/ML', demand: 95, growth: 45.2 },
      { skill: 'React Native', demand: 87, growth: 32.1 },
      { skill: 'DevOps', demand: 82, growth: 28.7 },
      { skill: 'Blockchain', demand: 76, growth: 38.9 }
    ],
    marketShare: [
      { category: 'Web Development', percentage: 35 },
      { category: 'Mobile Development', percentage: 25 },
      { category: 'Design', percentage: 20 },
      { category: 'Data Science', percentage: 20 }
    ],
    competitorAnalysis: [
      { metric: 'Average Rate', yourValue: 85, marketAverage: 75 },
      { metric: 'Response Time', yourValue: 2.5, marketAverage: 4.2 },
      { metric: 'Success Rate', yourValue: 89, marketAverage: 82 },
      { metric: 'Client Rating', yourValue: 4.7, marketAverage: 4.2 }
    ]
  });

  const [engagementMetrics] = useState<EngagementMetrics>({
    dailyActiveUsers: 1247,
    sessionDuration: 24.5,
    pageViews: 8932,
    engagementRate: 73.2,
    topPages: [
      { page: '/dashboard', views: 2456 },
      { page: '/projects', views: 1832 },
      { page: '/opportunities', views: 1521 },
      { page: '/profile', views: 1234 },
      { page: '/payments', views: 889 }
    ],
    userActivity: [
      { day: 'Mon', users: 1150 },
      { day: 'Tue', users: 1320 },
      { day: 'Wed', users: 1247 },
      { day: 'Thu', users: 1410 },
      { day: 'Fri', users: 1580 },
      { day: 'Sat', users: 980 },
      { day: 'Sun', users: 890 }
    ],
    featureUsage: [
      { feature: 'Project Management', usage: 87 },
      { feature: 'Messaging', usage: 76 },
      { feature: 'File Sharing', usage: 64 },
      { feature: 'Payments', usage: 92 },
      { feature: 'Analytics', usage: 43 }
    ]
  });

  const [financialReport] = useState<FinancialReport>({
    totalIncome: 125430,
    totalExpenses: 23450,
    netProfit: 101980,
    profitMargin: 81.3,
    taxLiability: 20396,
    monthlyBreakdown: [
      { month: 'Jan', income: 12000, expenses: 3200, profit: 8800 },
      { month: 'Feb', income: 15000, expenses: 3800, profit: 11200 },
      { month: 'Mar', income: 18000, expenses: 4200, profit: 13800 },
      { month: 'Apr', income: 16500, expenses: 3900, profit: 12600 },
      { month: 'May', income: 21000, expenses: 4350, profit: 16650 },
      { month: 'Jun', income: 18650, expenses: 4000, profit: 14650 }
    ],
    expenseCategories: [
      { category: 'Software Tools', amount: 8500, percentage: 36 },
      { category: 'Marketing', amount: 6200, percentage: 26 },
      { category: 'Education', amount: 4300, percentage: 18 },
      { category: 'Equipment', amount: 2950, percentage: 13 },
      { category: 'Other', amount: 1500, percentage: 7 }
    ]
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const getChangeColor = (value: number) => {
    if (value > 0) return 'text-green-600';
    if (value < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Comprehensive insights into your freelance business performance
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                <Download className="h-4 w-4" />
                Export
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>
            </div>
          </div>

          {/* Key Metrics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg p-6 border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(revenueData.totalRevenue)}</p>
                  <div className={`flex items-center gap-1 text-sm ${getChangeColor(revenueData.revenueGrowth)}`}>
                    {revenueData.revenueGrowth > 0 ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                    {formatPercentage(revenueData.revenueGrowth)}
                  </div>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Projects</p>
                  <p className="text-2xl font-bold text-gray-900">{projectMetrics.activeProjects}</p>
                  <div className="text-sm text-gray-500">
                    {projectMetrics.completedProjects} completed
                  </div>
                </div>
                <Briefcase className="h-8 w-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Success Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{projectMetrics.successRate}%</p>
                  <div className="text-sm text-gray-500">
                    {projectMetrics.onTimeDelivery}% on-time delivery
                  </div>
                </div>
                <Target className="h-8 w-8 text-purple-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Client Rating</p>
                  <p className="text-2xl font-bold text-gray-900">{projectMetrics.clientSatisfaction}</p>
                  <div className="flex items-center gap-1 text-sm text-yellow-600">
                    <Star className="h-4 w-4 fill-current" />
                    <span>Excellent</span>
                  </div>
                </div>
                <Award className="h-8 w-8 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', name: 'Overview', icon: BarChart3 },
                { id: 'revenue', name: 'Revenue Analytics', icon: DollarSign },
                { id: 'projects', name: 'Project Metrics', icon: Briefcase },
                { id: 'market', name: 'Market Trends', icon: TrendingUp },
                { id: 'engagement', name: 'User Engagement', icon: Users },
                { id: 'financial', name: 'Financial Reports', icon: FileText }
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

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Trend Chart */}
                <div className="border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
                  <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <LineChart className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">Monthly revenue chart would be displayed here</p>
                    </div>
                  </div>
                </div>

                {/* Project Performance */}
                <div className="border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Performance</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Completion Rate</span>
                      <span className="font-semibold">{projectMetrics.successRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${projectMetrics.successRate}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">On-Time Delivery</span>
                      <span className="font-semibold">{projectMetrics.onTimeDelivery}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${projectMetrics.onTimeDelivery}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Revenue by Category */}
                <div className="border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Category</h3>
                  <div className="space-y-3">
                    {revenueData.revenueByCategory.map((category, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${
                            index === 0 ? 'bg-blue-500' : 
                            index === 1 ? 'bg-green-500' : 
                            index === 2 ? 'bg-yellow-500' : 'bg-purple-500'
                          }`}></div>
                          <span className="text-gray-700">{category.category}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{formatCurrency(category.amount)}</div>
                          <div className="text-sm text-gray-500">{category.percentage}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Skills in Demand */}
                <div className="border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Hot Skills</h3>
                  <div className="space-y-3">
                    {marketTrends.hotSkills.slice(0, 4).map((skill, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-gray-700">{skill.skill}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-green-600">
                            +{skill.growth}%
                          </span>
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full" 
                              style={{ width: `${skill.demand}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <FileText className="h-8 w-8 text-blue-600" />
                    <div className="text-left">
                      <div className="font-medium text-gray-900">Generate Report</div>
                      <div className="text-sm text-gray-600">Create monthly business report</div>
                    </div>
                  </button>
                  <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <Calculator className="h-8 w-8 text-green-600" />
                    <div className="text-left">
                      <div className="font-medium text-gray-900">Tax Calculator</div>
                      <div className="text-sm text-gray-600">Calculate estimated taxes</div>
                    </div>
                  </button>
                  <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <Target className="h-8 w-8 text-purple-600" />
                    <div className="text-left">
                      <div className="font-medium text-gray-900">Set Goals</div>
                      <div className="text-sm text-gray-600">Define revenue targets</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Revenue Analytics Tab */}
          {activeTab === 'revenue' && (
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="lg:col-span-2">
                  <div className="border rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
                    <div className="h-80 bg-gray-50 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <LineChart className="h-20 w-20 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">Revenue trend chart visualization</p>
                        <p className="text-sm text-gray-500 mt-2">
                          Monthly earnings: {revenueData.monthlyEarnings.map(m => `${m.month}: ${formatCurrency(m.amount)}`).join(', ')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="border rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Metrics</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-gray-600">Monthly Revenue</span>
                          <span className="font-semibold">{formatCurrency(revenueData.monthlyRevenue)}</span>
                        </div>
                        <div className={`text-sm ${getChangeColor(revenueData.revenueGrowth)}`}>
                          {formatPercentage(revenueData.revenueGrowth)} vs last month
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-gray-600">Avg Project Value</span>
                          <span className="font-semibold">{formatCurrency(revenueData.averageProjectValue)}</span>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-gray-600">Pending Payments</span>
                          <span className="font-semibold text-orange-600">{formatCurrency(revenueData.pendingPayments)}</span>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-gray-600">Completed Payments</span>
                          <span className="font-semibold text-green-600">{formatCurrency(revenueData.completedPayments)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Status</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span className="text-sm font-medium">Completed</span>
                        </div>
                        <span className="text-sm font-semibold">{formatCurrency(revenueData.completedPayments)}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Clock className="h-5 w-5 text-orange-600" />
                          <span className="text-sm font-medium">Pending</span>
                        </div>
                        <span className="text-sm font-semibold">{formatCurrency(revenueData.pendingPayments)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Revenue by Category */}
              <div className="border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Service Category</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {revenueData.revenueByCategory.map((category, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{category.category}</h4>
                        <span className="text-sm text-gray-500">{category.percentage}%</span>
                      </div>
                      <div className="text-2xl font-bold text-gray-900 mb-1">
                        {formatCurrency(category.amount)}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            index === 0 ? 'bg-blue-500' : 
                            index === 1 ? 'bg-green-500' : 
                            index === 2 ? 'bg-yellow-500' : 'bg-purple-500'
                          }`}
                          style={{ width: `${category.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Project Performance Metrics Tab */}
          {activeTab === 'projects' && (
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Project Performance Overview */}
                <div className="lg:col-span-2">
                  <div className="border rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Completion Trends</h3>
                    <div className="h-80 bg-gray-50 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <BarChart3 className="h-20 w-20 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">Project completion trend chart</p>
                        <div className="text-sm text-gray-500 mt-2 space-y-1">
                          {projectMetrics.projectTrends.map((trend, index) => (
                            <div key={index} className="flex justify-center gap-4">
                              <span>{trend.month}: Completed {trend.completed}, Started {trend.started}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Project KPIs */}
                <div className="space-y-6">
                  <div className="border rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Performance Indicators</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Success Rate</span>
                        <span className="text-lg font-bold text-green-600">{projectMetrics.successRate}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-green-500 h-3 rounded-full transition-all duration-300" 
                          style={{ width: `${projectMetrics.successRate}%` }}
                        ></div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">On-Time Delivery</span>
                        <span className="text-lg font-bold text-blue-600">{projectMetrics.onTimeDelivery}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-blue-500 h-3 rounded-full transition-all duration-300" 
                          style={{ width: `${projectMetrics.onTimeDelivery}%` }}
                        ></div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Client Satisfaction</span>
                        <div className="flex items-center gap-1">
                          <span className="text-lg font-bold text-yellow-600">{projectMetrics.clientSatisfaction}</span>
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Avg Completion Time</span>
                        <span className="text-lg font-bold text-purple-600">{projectMetrics.averageCompletionTime} days</span>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Status</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span className="text-sm font-medium">Completed</span>
                        </div>
                        <span className="text-lg font-bold text-green-600">{projectMetrics.completedProjects}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Activity className="h-5 w-5 text-blue-600" />
                          <span className="text-sm font-medium">Active</span>
                        </div>
                        <span className="text-lg font-bold text-blue-600">{projectMetrics.activeProjects}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <BarChart3 className="h-5 w-5 text-gray-600" />
                          <span className="text-sm font-medium">Total</span>
                        </div>
                        <span className="text-lg font-bold text-gray-600">{projectMetrics.totalProjects}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Project Analytics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Project Timeline Performance */}
                <div className="border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline Performance</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">Early Completion</div>
                        <div className="text-sm text-gray-600">Projects finished ahead of schedule</div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">23%</div>
                        <div className="text-sm text-gray-500">+5% vs last month</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">On Schedule</div>
                        <div className="text-sm text-gray-600">Projects completed on time</div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">63%</div>
                        <div className="text-sm text-gray-500">+2% vs last month</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">Delayed</div>
                        <div className="text-sm text-gray-600">Projects completed late</div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-red-600">14%</div>
                        <div className="text-sm text-gray-500">-3% vs last month</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Client Feedback Analysis */}
                <div className="border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Client Feedback Breakdown</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Communication</span>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">4.8</span>
                        <div className="flex">
                          {[1,2,3,4,5].map(star => (
                            <Star key={star} className="h-4 w-4 text-yellow-500 fill-current" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Quality of Work</span>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">4.7</span>
                        <div className="flex">
                          {[1,2,3,4,5].map(star => (
                            <Star key={star} className="h-4 w-4 text-yellow-500 fill-current" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Timeliness</span>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">4.6</span>
                        <div className="flex">
                          {[1,2,3,4,5].map(star => (
                            <Star key={star} className="h-4 w-4 text-yellow-500 fill-current" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Value for Money</span>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">4.8</span>
                        <div className="flex">
                          {[1,2,3,4,5].map(star => (
                            <Star key={star} className="h-4 w-4 text-yellow-500 fill-current" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="pt-3 border-t">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">Overall Rating</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-bold text-yellow-600">{projectMetrics.clientSatisfaction}</span>
                          <Star className="h-5 w-5 text-yellow-500 fill-current" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Project Performance Insights */}
              <div className="mt-6 border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Insights & Recommendations</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="font-medium text-green-900">Strengths</span>
                    </div>
                    <ul className="text-sm text-green-800 space-y-1">
                      <li>• High client satisfaction (4.7/5)</li>
                      <li>• Strong on-time delivery rate</li>
                      <li>• Consistent quality ratings</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="h-5 w-5 text-yellow-600" />
                      <span className="font-medium text-yellow-900">Areas for Improvement</span>
                    </div>
                    <ul className="text-sm text-yellow-800 space-y-1">
                      <li>• Reduce average completion time</li>
                      <li>• Improve early delivery rate</li>
                      <li>• Focus on complex projects</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-5 w-5 text-blue-600" />
                      <span className="font-medium text-blue-900">Recommendations</span>
                    </div>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Set more realistic timelines</li>
                      <li>• Implement better project tracking</li>
                      <li>• Regular client check-ins</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Market Trends Tab */}
          {activeTab === 'market' && (
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Market Demand Overview */}
                <div className="border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Demand Growth</h3>
                  <div className="text-center mb-4">
                    <div className="text-4xl font-bold text-green-600 mb-2">+{marketTrends.demandGrowth}%</div>
                    <div className="text-gray-600">Overall market growth</div>
                  </div>
                  <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">Market demand chart</p>
                    </div>
                  </div>
                </div>

                {/* Hot Skills */}
                <div className="border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Trending Skills</h3>
                  <div className="space-y-4">
                    {marketTrends.hotSkills.map((skill, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">{skill.skill}</div>
                          <div className="text-sm text-gray-600">Demand: {skill.demand}%</div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600">+{skill.growth}%</div>
                          <div className="text-xs text-gray-500">growth</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Average Rates by Skill */}
              <div className="border rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Average Hourly Rates by Skill</h3>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {marketTrends.averageRates.map((rate, index) => (
                    <div key={index} className="text-center p-4 border rounded-lg">
                      <div className="font-medium text-gray-900 mb-1">{rate.skill}</div>
                      <div className="text-2xl font-bold text-blue-600 mb-1">${rate.rate}/hr</div>
                      <div className="flex items-center justify-center">
                        {getTrendIcon(rate.trend)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Competitive Analysis */}
              <div className="border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Competitive Analysis</h3>
                <div className="space-y-4">
                  {marketTrends.competitorAnalysis.map((metric, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <span className="font-medium text-gray-900">{metric.metric}</span>
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <div className="text-sm text-gray-600">Your Value</div>
                          <div className="text-lg font-bold text-blue-600">
                            {metric.metric.includes('Time') ? `${metric.yourValue}h` : 
                             metric.metric.includes('Rate') ? `${metric.yourValue}%` : 
                             metric.metric.includes('Rating') ? metric.yourValue : 
                             `$${metric.yourValue}`}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-gray-600">Market Avg</div>
                          <div className="text-lg font-bold text-gray-600">
                            {metric.metric.includes('Time') ? `${metric.marketAverage}h` : 
                             metric.metric.includes('Rate') ? `${metric.marketAverage}%` : 
                             metric.metric.includes('Rating') ? metric.marketAverage : 
                             `$${metric.marketAverage}`}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-gray-600">Performance</div>
                          <div className={`text-lg font-bold ${
                            metric.yourValue > metric.marketAverage ? 'text-green-600' : 
                            metric.yourValue < metric.marketAverage ? 'text-red-600' : 'text-gray-600'
                          }`}>
                            {metric.yourValue > metric.marketAverage ? '↗' : 
                             metric.yourValue < metric.marketAverage ? '↘' : '→'}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* User Engagement Tab */}
          {activeTab === 'engagement' && (
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Engagement Overview */}
                <div className="lg:col-span-2">
                  <div className="border rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Active Users</h3>
                    <div className="h-80 bg-gray-50 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <Users className="h-20 w-20 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">User activity chart</p>
                        <div className="text-sm text-gray-500 mt-2">
                          Weekly activity: {engagementMetrics.userActivity.map(d => `${d.day}: ${d.users}`).join(', ')}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Engagement Metrics */}
                <div className="space-y-6">
                  <div className="border rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Metrics</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-gray-600">Daily Active Users</span>
                          <span className="font-semibold">{engagementMetrics.dailyActiveUsers.toLocaleString()}</span>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-gray-600">Session Duration</span>
                          <span className="font-semibold">{engagementMetrics.sessionDuration}m</span>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-gray-600">Page Views</span>
                          <span className="font-semibold">{engagementMetrics.pageViews.toLocaleString()}</span>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-gray-600">Engagement Rate</span>
                          <span className="font-semibold">{engagementMetrics.engagementRate}%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Feature Usage</h3>
                    <div className="space-y-3">
                      {engagementMetrics.featureUsage.map((feature, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">{feature.feature}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{feature.usage}%</span>
                            <div className="w-12 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-500 h-2 rounded-full" 
                                style={{ width: `${feature.usage}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Pages */}
              <div className="border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Visited Pages</h3>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {engagementMetrics.topPages.map((page, index) => (
                    <div key={index} className="text-center p-4 border rounded-lg">
                      <div className="text-lg font-bold text-blue-600 mb-1">{page.views.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">{page.page}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Financial Reports Tab */}
          {activeTab === 'financial' && (
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Financial Summary */}
                <div className="lg:col-span-2">
                  <div className="border rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Profit & Loss Statement</h3>
                    <div className="h-80 bg-gray-50 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <PieChart className="h-20 w-20 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">Monthly P&L chart</p>
                        <div className="text-sm text-gray-500 mt-2">
                          Net Profit: {formatCurrency(financialReport.netProfit)} ({financialReport.profitMargin}% margin)
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Financial KPIs */}
                <div className="space-y-6">
                  <div className="border rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Summary</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Total Income</span>
                        <span className="text-lg font-bold text-green-600">{formatCurrency(financialReport.totalIncome)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Total Expenses</span>
                        <span className="text-lg font-bold text-red-600">{formatCurrency(financialReport.totalExpenses)}</span>
                      </div>
                      <div className="flex items-center justify-between border-t pt-2">
                        <span className="text-sm font-medium text-gray-900">Net Profit</span>
                        <span className="text-xl font-bold text-green-600">{formatCurrency(financialReport.netProfit)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Profit Margin</span>
                        <span className="text-lg font-bold text-blue-600">{financialReport.profitMargin}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Est. Tax Liability</span>
                        <span className="text-lg font-bold text-orange-600">{formatCurrency(financialReport.taxLiability)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Expense Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Expense Categories</h3>
                  <div className="space-y-3">
                    {financialReport.expenseCategories.map((category, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <span className="text-gray-700">{category.category}</span>
                        <div className="text-right">
                          <div className="font-semibold">{formatCurrency(category.amount)}</div>
                          <div className="text-sm text-gray-500">{category.percentage}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Breakdown</h3>
                  <div className="space-y-2">
                    {financialReport.monthlyBreakdown.map((month, index) => (
                      <div key={index} className="flex items-center justify-between text-sm p-2 rounded hover:bg-gray-50">
                        <span className="font-medium">{month.month}</span>
                        <div className="flex items-center gap-4">
                          <span className="text-green-600">{formatCurrency(month.income)}</span>
                          <span className="text-red-600">-{formatCurrency(month.expenses)}</span>
                          <span className="font-bold text-blue-600">{formatCurrency(month.profit)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Other tabs placeholder */}
          {!['overview', 'revenue', 'projects', 'market', 'engagement', 'financial'].includes(activeTab) && (
            <div className="p-6 text-center py-12">
              <BarChart3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Analytics
              </h3>
              <p className="text-gray-600">
                This section is under development and will be available soon.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}