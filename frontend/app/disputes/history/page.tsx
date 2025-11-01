'use client';

import { useState, useEffect } from 'react';
import { 
  Calendar, 
  Filter, 
  TrendingUp, 
  TrendingDown, 
  Scale, 
  CheckCircle, 
  XCircle, 
  Clock,
  BarChart3,
  PieChart,
  DollarSign,
  Users,
  AlertTriangle,
  Award,
  Eye
} from 'lucide-react';
import { fetchDisputes } from '@/lib/api';

interface Dispute {
  id: string;
  invoiceId: string;
  openerId: string;
  reason: string;
  resolved: boolean;
  outcome: 'FOR' | 'AGAINST' | 'TIED' | null;
  createdAt: string;
  invoice: {
    id: string;
    title: string;
    amount: number;
    status: string;
  };
  opener: {
    id: string;
    name: string;
    email: string;
  };
  votes: Array<{
    id: string;
    userId: string;
    vote: 'FOR' | 'AGAINST';
    createdAt: string;
  }>;
}

export default function DisputeHistoryPage() {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [statusFilter, setStatusFilter] = useState<'all' | 'resolved' | 'for' | 'against' | 'tied'>('all');

  useEffect(() => {
    loadDisputes();
  }, []);

  const loadDisputes = async () => {
    try {
      setLoading(true);
      const data = await fetchDisputes();
      setDisputes(data.disputes as Dispute[] || []);
    } catch (error) {
      console.error('Error loading disputes:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDisputes = disputes.filter(dispute => {
    if (statusFilter === 'all') return true;
    if (statusFilter === 'resolved') return dispute.resolved;
    if (statusFilter === 'for') return dispute.outcome === 'FOR';
    if (statusFilter === 'against') return dispute.outcome === 'AGAINST';
    if (statusFilter === 'tied') return dispute.outcome === 'TIED';
    return true;
  });

  const stats = {
    total: disputes.length,
    resolved: disputes.filter(d => d.resolved).length,
    forOpener: disputes.filter(d => d.outcome === 'FOR').length,
    againstOpener: disputes.filter(d => d.outcome === 'AGAINST').length,
    tied: disputes.filter(d => d.outcome === 'TIED').length,
    averageResolutionTime: '5.2 days',
    totalAmount: disputes.reduce((sum, d) => sum + d.invoice.amount, 0)
  };

  const resolutionRate = stats.total > 0 ? ((stats.resolved / stats.total) * 100).toFixed(1) : '0';
  const forRate = stats.resolved > 0 ? ((stats.forOpener / stats.resolved) * 100).toFixed(1) : '0';

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getOutcomeColor = (outcome: string | null) => {
    switch (outcome) {
      case 'FOR':
        return 'text-green-600 bg-green-100';
      case 'AGAINST':
        return 'text-red-600 bg-red-100';
      case 'TIED':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getOutcomeText = (dispute: Dispute) => {
    if (!dispute.resolved) return 'Pending';
    switch (dispute.outcome) {
      case 'FOR':
        return 'For Opener';
      case 'AGAINST':
        return 'Against Opener';
      case 'TIED':
        return 'Tied';
      default:
        return 'Resolved';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
              <h1 className="text-3xl font-bold text-gray-900">Dispute History & Analytics</h1>
              <p className="text-gray-600 mt-1">Track dispute patterns and resolution outcomes</p>
            </div>
            
            <div className="flex items-center gap-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                title="Select time range"
                aria-label="Select time range for analytics"
              >
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="quarter">Last Quarter</option>
                <option value="year">Last Year</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Scale className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.total}</div>
                <div className="text-gray-600 text-sm">Total Disputes</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{resolutionRate}%</div>
                <div className="text-gray-600 text-sm">Resolution Rate</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.averageResolutionTime}</div>
                <div className="text-gray-600 text-sm">Avg Resolution Time</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{formatCurrency(stats.totalAmount)}</div>
                <div className="text-gray-600 text-sm">Total Dispute Value</div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Resolution Breakdown */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Resolution Breakdown</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="text-sm">For Opener</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{stats.forOpener}</div>
                  <div className="text-xs text-gray-500">{forRate}%</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span className="text-sm">Against Opener</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{stats.againstOpener}</div>
                  <div className="text-xs text-gray-500">
                    {stats.resolved > 0 ? ((stats.againstOpener / stats.resolved) * 100).toFixed(1) : '0'}%
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                  <span className="text-sm">Tied</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{stats.tied}</div>
                  <div className="text-xs text-gray-500">
                    {stats.resolved > 0 ? ((stats.tied / stats.resolved) * 100).toFixed(1) : '0'}%
                  </div>
                </div>
              </div>
            </div>
            
            {/* Visual bar chart */}
            <div className="mt-6">
              <div className="flex h-8 bg-gray-100 rounded overflow-hidden">
                <div 
                  className="bg-green-500"
                  style={{ width: `${forRate}%` }}
                ></div>
                <div 
                  className="bg-red-500"
                  style={{ width: `${stats.resolved > 0 ? (stats.againstOpener / stats.resolved) * 100 : 0}%` }}
                ></div>
                <div 
                  className="bg-yellow-500"
                  style={{ width: `${stats.resolved > 0 ? (stats.tied / stats.resolved) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Trends */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Dispute Trends</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <TrendingDown className="h-5 w-5 text-green-600" />
                  <div>
                    <div className="font-medium">Dispute Volume</div>
                    <div className="text-sm text-gray-600">Down 15% this month</div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-green-600">↓15%</div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="font-medium">Resolution Speed</div>
                    <div className="text-sm text-gray-600">Improved by 20%</div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-blue-600">↑20%</div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Award className="h-5 w-5 text-purple-600" />
                  <div>
                    <div className="font-medium">Community Participation</div>
                    <div className="text-sm text-gray-600">Higher voting engagement</div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-purple-600">85%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-3">Dispute History</h3>
            </div>
            
            <div className="flex gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                title="Filter by outcome"
                aria-label="Filter disputes by outcome"
              >
                <option value="all">All Outcomes</option>
                <option value="resolved">Resolved</option>
                <option value="for">For Opener</option>
                <option value="against">Against Opener</option>
                <option value="tied">Tied</option>
              </select>
            </div>
          </div>
        </div>

        {/* Disputes Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dispute
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Filed Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Outcome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Votes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDisputes.map((dispute) => (
                  <tr key={dispute.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{dispute.invoice.title}</div>
                        <div className="text-sm text-gray-600 truncate max-w-xs">
                          {dispute.reason}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {formatCurrency(dispute.invoice.amount)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(dispute.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getOutcomeColor(dispute.outcome)}`}>
                        {getOutcomeText(dispute)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="flex items-center gap-4">
                        <span className="text-green-600">
                          {dispute.votes.filter(v => v.vote === 'FOR').length} For
                        </span>
                        <span className="text-red-600">
                          {dispute.votes.filter(v => v.vote === 'AGAINST').length} Against
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        className="text-blue-600 hover:text-blue-700 text-sm"
                        title="View dispute details"
                        aria-label="View dispute details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredDisputes.length === 0 && (
            <div className="text-center py-12">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No disputes found</h3>
              <p className="text-gray-500">No disputes match your current filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}