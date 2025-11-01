'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Download, 
  DollarSign, 
  CreditCard, 
  Building2,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowRight,
  RefreshCw,
  Eye,
  EyeOff,
  TrendingUp,
  Calendar
} from 'lucide-react';

interface WalletBalance {
  available: number;
  pending: number;
  escrow: number;
  currency: string;
  lastUpdated: string;
}

interface WithdrawalHistory {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  paymentMethod: {
    id: string;
    type: 'bank_account' | 'paypal' | 'card';
    label: string;
  };
  feeAmount: number;
  netAmount: number;
  requestedAt: string;
  completedAt?: string;
  estimatedArrival?: string;
  failureReason?: string;
}

interface PaymentMethod {
  id: string;
  type: 'bank_account' | 'paypal' | 'card';
  label: string;
  isVerified: boolean;
  withdrawalFee: number;
  processingTime: string;
}

export default function WalletPage() {
  const router = useRouter();
  const [balance, setBalance] = useState<WalletBalance>({
    available: 0,
    pending: 0,
    escrow: 0,
    currency: 'USD',
    lastUpdated: new Date().toISOString()
  });
  const [withdrawalHistory, setWithdrawalHistory] = useState<WithdrawalHistory[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBalance, setShowBalance] = useState(true);
  
  // Withdrawal form state
  const [showWithdrawalForm, setShowWithdrawalForm] = useState(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [withdrawalLoading, setWithdrawalLoading] = useState(false);

  useEffect(() => {
    loadWalletData();
  }, []);

  const loadWalletData = async () => {
    try {
      setLoading(true);
      
      // Mock wallet data
      const mockBalance: WalletBalance = {
        available: 3250.75,
        pending: 1800.00,
        escrow: 950.25,
        currency: 'USD',
        lastUpdated: new Date().toISOString()
      };

      const mockPaymentMethods: PaymentMethod[] = [
        {
          id: '1',
          type: 'bank_account',
          label: 'Chase Bank ****1234',
          isVerified: true,
          withdrawalFee: 0,
          processingTime: '1-3 business days'
        },
        {
          id: '2',
          type: 'paypal',
          label: 'john@example.com',
          isVerified: true,
          withdrawalFee: 25,
          processingTime: 'Instant'
        }
      ];

      const mockWithdrawalHistory: WithdrawalHistory[] = [
        {
          id: '1',
          amount: 1200.00,
          currency: 'USD',
          status: 'completed',
          paymentMethod: {
            id: '1',
            type: 'bank_account',
            label: 'Chase Bank ****1234'
          },
          feeAmount: 0,
          netAmount: 1200.00,
          requestedAt: '2025-10-27T16:45:00Z',
          completedAt: '2025-10-30T10:30:00Z'
        },
        {
          id: '2',
          amount: 500.00,
          currency: 'USD',
          status: 'processing',
          paymentMethod: {
            id: '2',
            type: 'paypal',
            label: 'john@example.com'
          },
          feeAmount: 25.00,
          netAmount: 475.00,
          requestedAt: '2025-11-01T14:20:00Z',
          estimatedArrival: '2025-11-01T15:00:00Z'
        }
      ];

      setBalance(mockBalance);
      setPaymentMethods(mockPaymentMethods);
      setWithdrawalHistory(mockWithdrawalHistory);
    } catch (error) {
      console.error('Error loading wallet data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!withdrawalAmount || !selectedPaymentMethod) {
      alert('Please fill in all required fields');
      return;
    }

    const amount = parseFloat(withdrawalAmount);
    if (amount <= 0 || amount > balance.available) {
      alert('Invalid withdrawal amount');
      return;
    }

    try {
      setWithdrawalLoading(true);
      
      const paymentMethod = paymentMethods.find(pm => pm.id === selectedPaymentMethod);
      if (!paymentMethod) return;

      const feeAmount = paymentMethod.withdrawalFee;
      const netAmount = amount - feeAmount;

      const newWithdrawal: WithdrawalHistory = {
        id: Date.now().toString(),
        amount,
        currency: balance.currency,
        status: 'pending',
        paymentMethod: {
          id: paymentMethod.id,
          type: paymentMethod.type,
          label: paymentMethod.label
        },
        feeAmount,
        netAmount,
        requestedAt: new Date().toISOString(),
        estimatedArrival: paymentMethod.type === 'paypal' 
          ? new Date(Date.now() + 60000).toISOString() // 1 minute for instant
          : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days for bank
      };

      setWithdrawalHistory(prev => [newWithdrawal, ...prev]);
      setBalance(prev => ({
        ...prev,
        available: prev.available - amount
      }));

      // Reset form
      setWithdrawalAmount('');
      setSelectedPaymentMethod('');
      setShowWithdrawalForm(false);

      alert('Withdrawal request submitted successfully!');
    } catch (error) {
      console.error('Error processing withdrawal:', error);
      alert('Failed to process withdrawal. Please try again.');
    } finally {
      setWithdrawalLoading(false);
    }
  };

  const getWithdrawalFee = () => {
    if (!selectedPaymentMethod) return 0;
    const method = paymentMethods.find(pm => pm.id === selectedPaymentMethod);
    return method?.withdrawalFee || 0;
  };

  const getNetAmount = () => {
    const amount = parseFloat(withdrawalAmount) || 0;
    const fee = getWithdrawalFee();
    return amount - fee;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'processing':
      case 'pending':
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
      case 'processing':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'failed':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPaymentMethodIcon = (type: string) => {
    switch (type) {
      case 'bank_account':
        return <Building2 className="h-4 w-4 text-green-600" />;
      case 'paypal':
        return <DollarSign className="h-4 w-4 text-orange-600" />;
      case 'card':
        return <CreditCard className="h-4 w-4 text-blue-600" />;
      default:
        return <DollarSign className="h-4 w-4 text-gray-600" />;
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading wallet data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Wallet & Withdrawals</h1>
              <p className="mt-2 text-gray-600">Manage your earnings and withdraw funds</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={loadWalletData}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </button>
              <button
                onClick={() => router.push('/payments/methods')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Payment Methods
              </button>
            </div>
          </div>
        </div>

        {/* Balance Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-sm p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Available Balance</h2>
                <button
                  onClick={() => setShowBalance(!showBalance)}
                  className="text-blue-200 hover:text-white"
                >
                  {showBalance ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <div className="mb-4">
                <p className="text-3xl font-bold">
                  {showBalance ? formatCurrency(balance.available, balance.currency) : '••••••'}
                </p>
                <p className="text-blue-200 text-sm">
                  Ready for withdrawal
                </p>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-blue-200">
                  Last updated: {formatDate(balance.lastUpdated)}
                </span>
                <button
                  onClick={() => setShowWithdrawalForm(true)}
                  disabled={balance.available <= 0}
                  className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Withdraw Funds
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Pending</span>
                <Clock className="h-4 w-4 text-yellow-600" />
              </div>
              <p className="text-xl font-bold text-gray-900">
                {formatCurrency(balance.pending, balance.currency)}
              </p>
              <p className="text-xs text-gray-500">Incoming payments</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">In Escrow</span>
                <TrendingUp className="h-4 w-4 text-blue-600" />
              </div>
              <p className="text-xl font-bold text-gray-900">
                {formatCurrency(balance.escrow, balance.currency)}
              </p>
              <p className="text-xs text-gray-500">Protected funds</p>
            </div>
          </div>
        </div>

        {/* Withdrawal Form Modal */}
        {showWithdrawalForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Withdraw Funds</h3>
                  <button
                    onClick={() => setShowWithdrawalForm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>

                <form onSubmit={handleWithdrawal}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Withdrawal Amount
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        $
                      </span>
                      <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        max={balance.available}
                        value={withdrawalAmount}
                        onChange={(e) => setWithdrawalAmount(e.target.value)}
                        className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="0.00"
                        required
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Available: {formatCurrency(balance.available, balance.currency)}
                    </p>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Withdrawal Method
                    </label>
                    <select
                      value={selectedPaymentMethod}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select payment method</option>
                      {paymentMethods.filter(pm => pm.isVerified).map((method) => (
                        <option key={method.id} value={method.id}>
                          {method.label} - {method.processingTime}
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedPaymentMethod && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between text-sm">
                        <span>Withdrawal amount:</span>
                        <span>{formatCurrency(parseFloat(withdrawalAmount) || 0)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Processing fee:</span>
                        <span>{formatCurrency(getWithdrawalFee())}</span>
                      </div>
                      <hr className="my-2" />
                      <div className="flex justify-between text-sm font-medium">
                        <span>You'll receive:</span>
                        <span>{formatCurrency(getNetAmount())}</span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowWithdrawalForm(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={withdrawalLoading || !withdrawalAmount || !selectedPaymentMethod}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                    >
                      {withdrawalLoading ? 'Processing...' : 'Withdraw Funds'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setShowWithdrawalForm(true)}
              disabled={balance.available <= 0}
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="p-2 bg-blue-100 rounded-lg mr-4">
                <Download className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">Withdraw Funds</p>
                <p className="text-sm text-gray-600">Transfer money to your bank account</p>
              </div>
            </button>

            <button
              onClick={() => router.push('/payments/methods')}
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="p-2 bg-green-100 rounded-lg mr-4">
                <CreditCard className="h-5 w-5 text-green-600" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">Payment Methods</p>
                <p className="text-sm text-gray-600">Manage withdrawal destinations</p>
              </div>
            </button>

            <button
              onClick={() => router.push('/payments/history')}
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="p-2 bg-purple-100 rounded-lg mr-4">
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">Payment History</p>
                <p className="text-sm text-gray-600">View all transactions</p>
              </div>
            </button>
          </div>
        </div>

        {/* Withdrawal History */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Withdrawals</h2>
          </div>

          <div className="divide-y divide-gray-200">
            {withdrawalHistory.length === 0 ? (
              <div className="text-center py-12">
                <Download className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No withdrawals yet</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Your withdrawal history will appear here.
                </p>
              </div>
            ) : (
              withdrawalHistory.map((withdrawal) => (
                <div key={withdrawal.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        {getPaymentMethodIcon(withdrawal.paymentMethod.type)}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-medium text-gray-900">
                            Withdrawal to {withdrawal.paymentMethod.label}
                          </p>
                          <div className="flex items-center">
                            {getStatusIcon(withdrawal.status)}
                            <span className={`ml-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(withdrawal.status)}`}>
                              {withdrawal.status.charAt(0).toUpperCase() + withdrawal.status.slice(1)}
                            </span>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">
                          Requested on {formatDate(withdrawal.requestedAt)}
                          {withdrawal.completedAt && (
                            <span> • Completed on {formatDate(withdrawal.completedAt)}</span>
                          )}
                          {withdrawal.estimatedArrival && withdrawal.status !== 'completed' && (
                            <span> • ETA: {formatDate(withdrawal.estimatedArrival)}</span>
                          )}
                        </div>
                        {withdrawal.failureReason && (
                          <div className="text-sm text-red-600 mt-1">
                            Failed: {withdrawal.failureReason}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {formatCurrency(withdrawal.amount, withdrawal.currency)}
                      </p>
                      {withdrawal.feeAmount > 0 && (
                        <p className="text-xs text-gray-500">
                          Fee: {formatCurrency(withdrawal.feeAmount, withdrawal.currency)}
                        </p>
                      )}
                      <p className="text-xs text-gray-600">
                        Net: {formatCurrency(withdrawal.netAmount, withdrawal.currency)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {withdrawalHistory.length > 0 && (
            <div className="p-6 border-t border-gray-200">
              <button
                onClick={() => router.push('/payments/history')}
                className="w-full flex items-center justify-center text-sm text-blue-600 hover:text-blue-700"
              >
                View All Transactions
                <ArrowRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}