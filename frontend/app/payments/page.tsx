'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  CreditCard, 
  Wallet, 
  TrendingUp, 
  Clock, 
  Shield, 
  Download,
  Filter,
  Search,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle,
  AlertCircle,
  DollarSign
} from 'lucide-react';

interface PaymentTransaction {
  id: string;
  type: 'incoming' | 'outgoing' | 'escrow_release' | 'withdrawal';
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed' | 'processing';
  description: string;
  invoiceId?: string;
  fromUser?: { name: string; email: string };
  toUser?: { name: string; email: string };
  createdAt: string;
  completedAt?: string;
  escrowReleaseAt?: string;
}

interface WalletBalance {
  available: number;
  pending: number;
  escrow: number;
  currency: string;
}

interface PaymentStats {
  totalReceived: number;
  totalPaid: number;
  activeEscrows: number;
  pendingPayments: number;
  currency: string;
}

export default function PaymentsPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [walletBalance, setWalletBalance] = useState<WalletBalance>({
    available: 0,
    pending: 0,
    escrow: 0,
    currency: 'USD'
  });
  const [paymentStats, setPaymentStats] = useState<PaymentStats>({
    totalReceived: 0,
    totalPaid: 0,
    activeEscrows: 0,
    pendingPayments: 0,
    currency: 'USD'
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    loadPaymentData();
  }, []);

  const loadPaymentData = async () => {
    try {
      setLoading(true);
      
      // Mock data for now - replace with actual API calls
      const mockTransactions: PaymentTransaction[] = [
        {
          id: '1',
          type: 'incoming',
          amount: 2500.00,
          currency: 'USD',
          status: 'completed',
          description: 'Payment for E-commerce Website Development',
          invoiceId: 'inv_001',
          fromUser: { name: 'Tech Solutions Inc', email: 'contact@techsolutions.com' },
          createdAt: '2025-11-01T10:30:00Z',
          completedAt: '2025-11-01T10:35:00Z'
        },
        {
          id: '2',
          type: 'escrow_release',
          amount: 1800.00,
          currency: 'USD',
          status: 'pending',
          description: 'Escrow release for Mobile App UI/UX Design',
          invoiceId: 'inv_002',
          toUser: { name: 'John Smith', email: 'john@designer.com' },
          createdAt: '2025-10-30T14:20:00Z',
          escrowReleaseAt: '2025-11-03T14:20:00Z'
        },
        {
          id: '3',
          type: 'outgoing',
          amount: 500.00,
          currency: 'USD',
          status: 'completed',
          description: 'Payment for Logo Design Services',
          fromUser: { name: 'Creative Studio', email: 'hello@creativestudio.com' },
          createdAt: '2025-10-28T09:15:00Z',
          completedAt: '2025-10-28T09:20:00Z'
        },
        {
          id: '4',
          type: 'withdrawal',
          amount: 1200.00,
          currency: 'USD',
          status: 'processing',
          description: 'Withdrawal to Bank Account ****1234',
          createdAt: '2025-10-27T16:45:00Z'
        }
      ];

      const mockWalletBalance: WalletBalance = {
        available: 3250.00,
        pending: 1800.00,
        escrow: 950.00,
        currency: 'USD'
      };

      const mockPaymentStats: PaymentStats = {
        totalReceived: 12500.00,
        totalPaid: 3200.00,
        activeEscrows: 3,
        pendingPayments: 2,
        currency: 'USD'
      };

      setTransactions(mockTransactions);
      setWalletBalance(mockWalletBalance);
      setPaymentStats(mockPaymentStats);
    } catch (error) {
      console.error('Error loading payment data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTransactionIcon = (type: string, status: string) => {
    switch (type) {
      case 'incoming':
        return <ArrowDownLeft className="h-4 w-4 text-green-600" />;
      case 'outgoing':
        return <ArrowUpRight className="h-4 w-4 text-red-600" />;
      case 'escrow_release':
        return <Shield className="h-4 w-4 text-blue-600" />;
      case 'withdrawal':
        return <Download className="h-4 w-4 text-purple-600" />;
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
        return 'text-green-600 bg-green-50';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'processing':
        return 'text-blue-600 bg-blue-50';
      case 'failed':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.fromUser?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.toUser?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || transaction.type === filterType;
    const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payment data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Payments & Wallet</h1>
              <p className="mt-2 text-gray-600">Manage your payments, track transactions, and view your balance</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => router.push('/payments/methods')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Payment Methods
              </button>
              <button
                onClick={() => router.push('/payments/withdraw')}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
              >
                <Download className="h-4 w-4 mr-2" />
                Withdraw Funds
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Available Balance</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(walletBalance.available, walletBalance.currency)}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Wallet className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Payments</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(walletBalance.pending, walletBalance.currency)}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Escrow Balance</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(walletBalance.escrow, walletBalance.currency)}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Received</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(paymentStats.totalReceived, paymentStats.currency)}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => router.push('/invoices/create')}
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="p-2 bg-blue-100 rounded-lg mr-4">
                <CreditCard className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">Create Invoice</p>
                <p className="text-sm text-gray-600">Send payment request to clients</p>
              </div>
            </button>

            <button
              onClick={() => router.push('/payments/escrow')}
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="p-2 bg-green-100 rounded-lg mr-4">
                <Shield className="h-5 w-5 text-green-600" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">Manage Escrow</p>
                <p className="text-sm text-gray-600">View and release escrow payments</p>
              </div>
            </button>

            <button
              onClick={() => router.push('/payments/history')}
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="p-2 bg-purple-100 rounded-lg mr-4">
                <Download className="h-5 w-5 text-purple-600" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">Export History</p>
                <p className="text-sm text-gray-600">Download payment records</p>
              </div>
            </button>
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
              <button
                onClick={() => router.push('/payments/history')}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View All →
              </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
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
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="incoming">Incoming</option>
                <option value="outgoing">Outgoing</option>
                <option value="escrow_release">Escrow Release</option>
                <option value="withdrawal">Withdrawal</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="failed">Failed</option>
              </select>
            </div>
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
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 mr-3">
                          {getTransactionIcon(transaction.type, transaction.status)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {transaction.description}
                          </div>
                          <div className="text-sm text-gray-500">
                            {transaction.fromUser?.name || transaction.toUser?.name || 'System'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${
                        transaction.type === 'incoming' || transaction.type === 'escrow_release' 
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }`}>
                        {transaction.type === 'incoming' || transaction.type === 'escrow_release' ? '+' : '-'}
                        {formatCurrency(transaction.amount, transaction.currency)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(transaction.status)}
                        <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(transaction.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {transaction.invoiceId && (
                        <button
                          onClick={() => router.push(`/invoices/${transaction.invoiceId}`)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View Invoice
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredTransactions.length === 0 && (
            <div className="text-center py-12">
              <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No transactions found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || filterType !== 'all' || filterStatus !== 'all'
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