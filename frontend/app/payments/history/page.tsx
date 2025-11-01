'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Download, 
  Search, 
  Filter,
  Calendar,
  ArrowUpRight,
  ArrowDownLeft,
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
  Shield,
  FileText,
  RefreshCw
} from 'lucide-react';

interface PaymentHistoryEntry {
  id: string;
  type: 'payment_received' | 'payment_sent' | 'escrow_held' | 'escrow_released' | 'withdrawal' | 'refund';
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed' | 'processing';
  description: string;
  invoiceId?: string;
  invoiceTitle?: string;
  counterpartyName?: string;
  counterpartyEmail?: string;
  paymentMethod?: string;
  transactionId?: string;
  feeAmount?: number;
  netAmount?: number;
  createdAt: string;
  completedAt?: string;
  failureReason?: string;
  metadata?: Record<string, any>;
}

export default function PaymentHistoryPage() {
  const router = useRouter();
  const [payments, setPayments] = useState<PaymentHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [dateRange, setDateRange] = useState<'all' | '7d' | '30d' | '90d' | '1y'>('all');
  const [exportLoading, setExportLoading] = useState(false);

  useEffect(() => {
    loadPaymentHistory();
  }, []);

  const loadPaymentHistory = async () => {
    try {
      setLoading(true);
      
      // Mock payment history data
      const mockPayments: PaymentHistoryEntry[] = [
        {
          id: '1',
          type: 'payment_received',
          amount: 2500.00,
          currency: 'USD',
          status: 'completed',
          description: 'Payment for E-commerce Website Development',
          invoiceId: 'inv_001',
          invoiceTitle: 'E-commerce Website Development',
          counterpartyName: 'Tech Solutions Inc',
          counterpartyEmail: 'contact@techsolutions.com',
          paymentMethod: 'visa_****4242',
          transactionId: 'pi_3OH123xyz',
          feeAmount: 75.00,
          netAmount: 2425.00,
          createdAt: '2025-11-01T10:30:00Z',
          completedAt: '2025-11-01T10:35:00Z'
        },
        {
          id: '2',
          type: 'escrow_held',
          amount: 1800.00,
          currency: 'USD',
          status: 'completed',
          description: 'Escrow hold for Mobile App UI/UX Design',
          invoiceId: 'inv_002',
          invoiceTitle: 'Mobile App UI/UX Design',
          counterpartyName: 'StartupXYZ',
          counterpartyEmail: 'founder@startupxyz.com',
          paymentMethod: 'mastercard_****8888',
          transactionId: 'pi_3OH124xyz',
          feeAmount: 54.00,
          netAmount: 1746.00,
          createdAt: '2025-10-30T14:20:00Z',
          completedAt: '2025-10-30T14:25:00Z'
        },
        {
          id: '3',
          type: 'payment_sent',
          amount: 500.00,
          currency: 'USD',
          status: 'completed',
          description: 'Payment for Logo Design Services',
          counterpartyName: 'Creative Studio',
          counterpartyEmail: 'hello@creativestudio.com',
          paymentMethod: 'bank_transfer',
          transactionId: 'transfer_123abc',
          feeAmount: 5.00,
          netAmount: 495.00,
          createdAt: '2025-10-28T09:15:00Z',
          completedAt: '2025-10-28T09:20:00Z'
        },
        {
          id: '4',
          type: 'withdrawal',
          amount: 1200.00,
          currency: 'USD',
          status: 'processing',
          description: 'Withdrawal to Bank Account',
          paymentMethod: 'bank_****1234',
          transactionId: 'wd_789def',
          feeAmount: 12.00,
          netAmount: 1188.00,
          createdAt: '2025-10-27T16:45:00Z'
        },
        {
          id: '5',
          type: 'escrow_released',
          amount: 1200.00,
          currency: 'USD',
          status: 'completed',
          description: 'Escrow release for API Integration Project',
          invoiceId: 'inv_003',
          invoiceTitle: 'API Integration Project',
          counterpartyName: 'DataCorp Ltd',
          counterpartyEmail: 'projects@datacorp.com',
          transactionId: 'release_456ghi',
          netAmount: 1200.00,
          createdAt: '2025-10-25T11:30:00Z',
          completedAt: '2025-10-25T11:35:00Z'
        },
        {
          id: '6',
          type: 'payment_received',
          amount: 750.00,
          currency: 'USD',
          status: 'failed',
          description: 'Payment for Website Maintenance',
          invoiceId: 'inv_004',
          invoiceTitle: 'Website Maintenance',
          counterpartyName: 'Small Business Co',
          counterpartyEmail: 'admin@smallbiz.com',
          paymentMethod: 'visa_****9999',
          transactionId: 'pi_3OH125xyz',
          failureReason: 'Insufficient funds',
          createdAt: '2025-10-24T08:20:00Z'
        }
      ];

      setPayments(mockPayments);
    } catch (error) {
      console.error('Error loading payment history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      setExportLoading(true);
      
      // Filter payments based on current filters
      const filteredData = getFilteredPayments();
      
      // Convert to CSV
      const headers = [
        'Date',
        'Type',
        'Description',
        'Amount',
        'Fee',
        'Net Amount',
        'Status',
        'Counterparty',
        'Payment Method',
        'Transaction ID'
      ];
      
      const csvContent = [
        headers.join(','),
        ...filteredData.map(payment => [
          new Date(payment.createdAt).toLocaleDateString(),
          payment.type.replace('_', ' ').toUpperCase(),
          `"${payment.description}"`,
          payment.amount,
          payment.feeAmount || 0,
          payment.netAmount || payment.amount,
          payment.status.toUpperCase(),
          `"${payment.counterpartyName || 'N/A'}"`,
          payment.paymentMethod || 'N/A',
          payment.transactionId || 'N/A'
        ].join(','))
      ].join('\n');
      
      // Download CSV
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `payment-history-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Error exporting payment history:', error);
      alert('Failed to export payment history. Please try again.');
    } finally {
      setExportLoading(false);
    }
  };

  const getFilteredPayments = () => {
    return payments.filter(payment => {
      // Search filter
      const matchesSearch = payment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           payment.counterpartyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           payment.transactionId?.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Type filter
      const matchesType = filterType === 'all' || payment.type === filterType;
      
      // Status filter
      const matchesStatus = filterStatus === 'all' || payment.status === filterStatus;
      
      // Date range filter
      let matchesDate = true;
      if (dateRange !== 'all') {
        const paymentDate = new Date(payment.createdAt);
        const now = new Date();
        const daysAgo = {
          '7d': 7,
          '30d': 30,
          '90d': 90,
          '1y': 365
        }[dateRange];
        
        if (daysAgo) {
          const cutoffDate = new Date(now);
          cutoffDate.setDate(cutoffDate.getDate() - daysAgo);
          matchesDate = paymentDate >= cutoffDate;
        }
      }
      
      return matchesSearch && matchesType && matchesStatus && matchesDate;
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'payment_received':
        return <ArrowDownLeft className="h-4 w-4 text-green-600" />;
      case 'payment_sent':
        return <ArrowUpRight className="h-4 w-4 text-red-600" />;
      case 'escrow_held':
      case 'escrow_released':
        return <Shield className="h-4 w-4 text-blue-600" />;
      case 'withdrawal':
        return <Download className="h-4 w-4 text-purple-600" />;
      case 'refund':
        return <ArrowDownLeft className="h-4 w-4 text-orange-600" />;
      default:
        return <DollarSign className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
      case 'processing':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'processing':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'failed':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTypeLabel = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const filteredPayments = getFilteredPayments();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payment history...</p>
        </div>
      </div>
    );
  }

  // Calculate summary stats
  const totalReceived = payments
    .filter(p => p.type === 'payment_received' && p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalSent = payments
    .filter(p => p.type === 'payment_sent' && p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalFees = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + (p.feeAmount || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Payment History</h1>
              <p className="mt-2 text-gray-600">Complete record of all your payment transactions</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={loadPaymentHistory}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </button>
              <button
                onClick={handleExport}
                disabled={exportLoading}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {exportLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Received</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(totalReceived)}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <ArrowDownLeft className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Sent</p>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(totalSent)}
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <ArrowUpRight className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Fees</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(totalFees)}
                </p>
              </div>
              <div className="p-3 bg-gray-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Net Amount</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(totalReceived - totalSent - totalFees)}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="payment_received">Payment Received</option>
                <option value="payment_sent">Payment Sent</option>
                <option value="escrow_held">Escrow Held</option>
                <option value="escrow_released">Escrow Released</option>
                <option value="withdrawal">Withdrawal</option>
                <option value="refund">Refund</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Time</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
                <option value="1y">Last Year</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterType('all');
                  setFilterStatus('all');
                  setDateRange('all');
                }}
                className="w-full px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Payment History Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Payment Transactions ({filteredPayments.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transaction
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 mr-3">
                          {getTypeIcon(payment.type)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {payment.description}
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatTypeLabel(payment.type)}
                            {payment.counterpartyName && ` • ${payment.counterpartyName}`}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className={`font-medium ${
                          payment.type.includes('received') || payment.type.includes('released') 
                            ? 'text-green-600' 
                            : 'text-gray-900'
                        }`}>
                          {formatCurrency(payment.amount, payment.currency)}
                        </div>
                        {payment.feeAmount && (
                          <div className="text-xs text-gray-500">
                            Fee: {formatCurrency(payment.feeAmount, payment.currency)}
                          </div>
                        )}
                        {payment.netAmount && payment.netAmount !== payment.amount && (
                          <div className="text-xs text-gray-600">
                            Net: {formatCurrency(payment.netAmount, payment.currency)}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {getStatusIcon(payment.status)}
                        <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(payment.status)}`}>
                          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                        </span>
                      </div>
                      {payment.status === 'failed' && payment.failureReason && (
                        <div className="text-xs text-red-600 mt-1">
                          {payment.failureReason}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div>{formatDate(payment.createdAt)}</div>
                      {payment.completedAt && payment.completedAt !== payment.createdAt && (
                        <div className="text-xs">
                          Completed: {formatDate(payment.completedAt)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="space-y-1">
                        {payment.transactionId && (
                          <div className="text-xs text-gray-500">
                            ID: {payment.transactionId}
                          </div>
                        )}
                        {payment.paymentMethod && (
                          <div className="text-xs text-gray-500">
                            Method: {payment.paymentMethod}
                          </div>
                        )}
                        {payment.invoiceId && (
                          <button
                            onClick={() => router.push(`/invoices/${payment.invoiceId}`)}
                            className="text-xs text-blue-600 hover:text-blue-700 flex items-center"
                          >
                            <FileText className="h-3 w-3 mr-1" />
                            View Invoice
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredPayments.length === 0 && (
            <div className="text-center py-12">
              <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No transactions found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || filterType !== 'all' || filterStatus !== 'all' || dateRange !== 'all'
                  ? 'Try adjusting your search or filters.'
                  : 'Your payment transactions will appear here.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}