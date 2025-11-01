"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../components/AuthProvider';
import { fetchInvoices } from '../../../lib/api';

interface Invoice {
  id: string;
  title: string;
  amount: number;
  dueDate: string;
  currency: string;
  status: 'DRAFT' | 'SENT' | 'PAID' | 'RELEASED';
  createdAt: string;
}

interface AnalyticsData {
  totalRevenue: number;
  paidInvoices: number;
  pendingAmount: number;
  overdueAmount: number;
  averageInvoiceValue: number;
  monthlyRevenue: { month: string; revenue: number }[];
  statusDistribution: { status: string; count: number; amount: number }[];
  recentTrends: {
    revenueGrowth: number;
    invoiceGrowth: number;
    collectionRate: number;
  };
}

export default function InvoiceAnalyticsPage() {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const data = await fetchInvoices();
      setInvoices(data);
      
      const analyticsData = calculateAnalytics(data);
      setAnalytics(analyticsData);
    } catch (err: any) {
      setError(err.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const calculateAnalytics = (invoiceData: Invoice[]): AnalyticsData => {
    const now = new Date();
    const cutoffDate = new Date();
    
    switch (timeRange) {
      case '7d':
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        cutoffDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        cutoffDate.setDate(now.getDate() - 90);
        break;
      case '1y':
        cutoffDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    const filteredInvoices = invoiceData.filter(invoice => 
      new Date(invoice.createdAt) >= cutoffDate
    );

    const totalRevenue = filteredInvoices
      .filter(inv => inv.status === 'PAID' || inv.status === 'RELEASED')
      .reduce((sum, inv) => sum + inv.amount, 0);

    const paidInvoices = filteredInvoices
      .filter(inv => inv.status === 'PAID' || inv.status === 'RELEASED').length;

    const pendingAmount = filteredInvoices
      .filter(inv => inv.status === 'SENT')
      .reduce((sum, inv) => sum + inv.amount, 0);

    const overdueAmount = filteredInvoices
      .filter(inv => inv.status === 'SENT' && new Date(inv.dueDate) < now)
      .reduce((sum, inv) => sum + inv.amount, 0);

    const averageInvoiceValue = filteredInvoices.length > 0 
      ? filteredInvoices.reduce((sum, inv) => sum + inv.amount, 0) / filteredInvoices.length 
      : 0;

    // Monthly revenue calculation
    const monthlyRevenue = calculateMonthlyRevenue(filteredInvoices);
    
    // Status distribution
    const statusDistribution = calculateStatusDistribution(filteredInvoices);
    
    // Recent trends (comparing to previous period)
    const recentTrends = calculateTrends(invoiceData, cutoffDate);

    return {
      totalRevenue,
      paidInvoices,
      pendingAmount,
      overdueAmount,
      averageInvoiceValue,
      monthlyRevenue,
      statusDistribution,
      recentTrends
    };
  };

  const calculateMonthlyRevenue = (invoiceData: Invoice[]) => {
    const monthlyData: { [key: string]: number } = {};
    
    invoiceData
      .filter(inv => inv.status === 'PAID' || inv.status === 'RELEASED')
      .forEach(invoice => {
        const date = new Date(invoice.createdAt);
        const monthKey = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
        monthlyData[monthKey] = (monthlyData[monthKey] || 0) + invoice.amount;
      });

    return Object.entries(monthlyData)
      .map(([month, revenue]) => ({ month, revenue }))
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())
      .slice(-6); // Last 6 months
  };

  const calculateStatusDistribution = (invoiceData: Invoice[]) => {
    const distribution: { [key: string]: { count: number; amount: number } } = {};
    
    invoiceData.forEach(invoice => {
      if (!distribution[invoice.status]) {
        distribution[invoice.status] = { count: 0, amount: 0 };
      }
      distribution[invoice.status].count++;
      distribution[invoice.status].amount += invoice.amount;
    });

    return Object.entries(distribution).map(([status, data]) => ({
      status,
      count: data.count,
      amount: data.amount
    }));
  };

  const calculateTrends = (allInvoices: Invoice[], currentCutoff: Date) => {
    const currentPeriodRevenue = allInvoices
      .filter(inv => 
        new Date(inv.createdAt) >= currentCutoff && 
        (inv.status === 'PAID' || inv.status === 'RELEASED')
      )
      .reduce((sum, inv) => sum + inv.amount, 0);

    const currentPeriodCount = allInvoices
      .filter(inv => new Date(inv.createdAt) >= currentCutoff).length;

    // Previous period (same duration before current period)
    const periodDuration = Date.now() - currentCutoff.getTime();
    const previousCutoff = new Date(currentCutoff.getTime() - periodDuration);
    
    const previousPeriodRevenue = allInvoices
      .filter(inv => 
        new Date(inv.createdAt) >= previousCutoff && 
        new Date(inv.createdAt) < currentCutoff &&
        (inv.status === 'PAID' || inv.status === 'RELEASED')
      )
      .reduce((sum, inv) => sum + inv.amount, 0);

    const previousPeriodCount = allInvoices
      .filter(inv => 
        new Date(inv.createdAt) >= previousCutoff && 
        new Date(inv.createdAt) < currentCutoff
      ).length;

    const revenueGrowth = previousPeriodRevenue > 0 
      ? ((currentPeriodRevenue - previousPeriodRevenue) / previousPeriodRevenue) * 100 
      : 0;

    const invoiceGrowth = previousPeriodCount > 0 
      ? ((currentPeriodCount - previousPeriodCount) / previousPeriodCount) * 100 
      : 0;

    const totalSent = allInvoices.filter(inv => 
      new Date(inv.createdAt) >= currentCutoff && inv.status !== 'DRAFT'
    ).length;
    const totalPaid = allInvoices.filter(inv => 
      new Date(inv.createdAt) >= currentCutoff && 
      (inv.status === 'PAID' || inv.status === 'RELEASED')
    ).length;
    const collectionRate = totalSent > 0 ? (totalPaid / totalSent) * 100 : 0;

    return {
      revenueGrowth,
      invoiceGrowth,
      collectionRate
    };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'text-slate-400 bg-slate-500/10';
      case 'SENT': return 'text-blue-400 bg-blue-500/10';
      case 'PAID': return 'text-emerald-400 bg-emerald-500/10';
      case 'RELEASED': return 'text-purple-400 bg-purple-500/10';
      default: return 'text-slate-400 bg-slate-500/10';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-3 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-white text-lg">Loading analytics...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-600/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/invoices"
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Invoices
              </Link>
              <div className="h-6 w-px bg-slate-600"></div>
              <div>
                <h1 className="text-3xl font-bold text-white">Invoice Analytics</h1>
                <p className="text-slate-400 mt-1">Track your invoice performance and revenue insights</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
                className="px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 hover:bg-slate-600 transition-colors"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-red-400 font-medium">Error</span>
            </div>
            <p className="text-red-300 mt-1">{error}</p>
          </div>
        )}

        {analytics && (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="panel">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Total Revenue</p>
                    <p className="text-2xl font-bold text-emerald-400">{formatCurrency(analytics.totalRevenue)}</p>
                    <p className={`text-sm ${analytics.recentTrends.revenueGrowth >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {formatPercentage(analytics.recentTrends.revenueGrowth)} vs prev period
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="panel">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Paid Invoices</p>
                    <p className="text-2xl font-bold text-blue-400">{analytics.paidInvoices}</p>
                    <p className={`text-sm ${analytics.recentTrends.invoiceGrowth >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {formatPercentage(analytics.recentTrends.invoiceGrowth)} vs prev period
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="panel">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Pending Amount</p>
                    <p className="text-2xl font-bold text-yellow-400">{formatCurrency(analytics.pendingAmount)}</p>
                    <p className="text-sm text-slate-400">Awaiting payment</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="panel">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Collection Rate</p>
                    <p className="text-2xl font-bold text-purple-400">{analytics.recentTrends.collectionRate.toFixed(1)}%</p>
                    <p className="text-sm text-slate-400">Payment success rate</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 mb-8">
              {/* Monthly Revenue Chart */}
              <div className="panel">
                <h2 className="text-xl font-semibold text-white mb-6">Monthly Revenue Trend</h2>
                <div className="space-y-4">
                  {analytics.monthlyRevenue.map((month, index) => {
                    const maxRevenue = Math.max(...analytics.monthlyRevenue.map(m => m.revenue));
                    const percentage = maxRevenue > 0 ? (month.revenue / maxRevenue) * 100 : 0;
                    
                    return (
                      <div key={index} className="flex items-center gap-4">
                        <div className="w-16 text-sm text-slate-400">{month.month}</div>
                        <div className="flex-1">
                          <div className="w-full bg-slate-700/30 rounded-full h-3">
                            <div 
                              className="bg-gradient-to-r from-emerald-500 to-blue-500 h-3 rounded-full transition-all duration-300"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="w-24 text-right text-sm font-medium text-white">
                          {formatCurrency(month.revenue)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Status Distribution */}
              <div className="panel">
                <h2 className="text-xl font-semibold text-white mb-6">Invoice Status Distribution</h2>
                <div className="space-y-4">
                  {analytics.statusDistribution.map((status, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(status.status)}`}>
                          {status.status}
                        </span>
                        <span className="text-white">{status.count} invoices</span>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-medium">{formatCurrency(status.amount)}</p>
                        <p className="text-xs text-slate-400">
                          {((status.amount / analytics.totalRevenue) * 100).toFixed(1)}% of total
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Additional Insights */}
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="panel">
                <h3 className="text-lg font-semibold text-white mb-4">Average Invoice Value</h3>
                <div className="text-center">
                  <p className="text-3xl font-bold text-emerald-400 mb-2">
                    {formatCurrency(analytics.averageInvoiceValue)}
                  </p>
                  <p className="text-sm text-slate-400">Per invoice average</p>
                </div>
              </div>

              <div className="panel">
                <h3 className="text-lg font-semibold text-white mb-4">Overdue Amount</h3>
                <div className="text-center">
                  <p className="text-3xl font-bold text-red-400 mb-2">
                    {formatCurrency(analytics.overdueAmount)}
                  </p>
                  <p className="text-sm text-slate-400">Past due date</p>
                </div>
              </div>

              <div className="panel">
                <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link
                    href="/invoices/create"
                    className="w-full px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors text-center block"
                  >
                    Create New Invoice
                  </Link>
                  <Link
                    href="/invoices?status=sent"
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-center block"
                  >
                    View Pending Invoices
                  </Link>
                  <Link
                    href="/invoices"
                    className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors text-center block"
                  >
                    All Invoices
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}