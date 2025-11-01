'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Shield, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Calendar,
  DollarSign,
  User,
  FileText,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { fetchInvoices, releaseEscrow, fetchMe } from '@/lib/api';

interface EscrowPayment {
  id: string;
  invoiceId: string;
  title: string;
  amount: number;
  currency: string;
  status: 'PAID' | 'RELEASED';
  clientName: string;
  clientEmail: string;
  freelancerName: string;
  freelancerEmail: string;
  projectDescription?: string;
  paidAt: string;
  releasedAt?: string;
  autoReleaseDate?: string;
  daysInEscrow: number;
  canRelease: boolean;
}

export default function EscrowManagementPage() {
  const router = useRouter();
  const [escrowPayments, setEscrowPayments] = useState<EscrowPayment[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [releaseLoading, setReleaseLoading] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'held' | 'released'>('all');

  useEffect(() => {
    loadEscrowData();
  }, []);

  const loadEscrowData = async () => {
    try {
      setLoading(true);
      
      // Get current user
      const user = await fetchMe();
      setCurrentUser(user);
      
      // Get all invoices and filter for escrow-relevant ones
      const invoices = await fetchInvoices();
      const escrowInvoices = invoices.filter((invoice: any) => 
        invoice.status === 'PAID' || invoice.status === 'RELEASED'
      );

      // Transform to escrow payment format
      const escrowData: EscrowPayment[] = escrowInvoices.map((invoice: any) => {
        const paidDate = new Date(invoice.createdAt);
        const releasedDate = invoice.releasedAt ? new Date(invoice.releasedAt) : null;
        const now = new Date();
        
        // Calculate days in escrow
        const daysInEscrow = Math.floor(
          (releasedDate ? releasedDate.getTime() : now.getTime() - paidDate.getTime()) / 
          (1000 * 60 * 60 * 24)
        );

        // Auto-release after 14 days (configurable)
        const autoReleaseDate = new Date(paidDate);
        autoReleaseDate.setDate(autoReleaseDate.getDate() + 14);

        // Can release if: user is client and invoice is paid but not released
        const canRelease = user.role === 'CLIENT' && 
                          invoice.status === 'PAID' && 
                          invoice.clientId === user.id;

        return {
          id: invoice.id,
          invoiceId: invoice.id,
          title: invoice.title,
          amount: invoice.amount,
          currency: invoice.currency || 'USD',
          status: invoice.status,
          clientName: invoice.client?.name || 'Unknown Client',
          clientEmail: invoice.client?.email || '',
          freelancerName: invoice.freelancer?.name || 'Unknown Freelancer',
          freelancerEmail: invoice.freelancer?.email || '',
          projectDescription: invoice.title,
          paidAt: invoice.createdAt,
          releasedAt: invoice.releasedAt,
          autoReleaseDate: autoReleaseDate.toISOString(),
          daysInEscrow,
          canRelease
        };
      });

      setEscrowPayments(escrowData);
    } catch (error) {
      console.error('Error loading escrow data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReleaseEscrow = async (escrowPaymentId: string) => {
    try {
      setReleaseLoading(escrowPaymentId);
      await releaseEscrow(escrowPaymentId);
      
      // Refresh data
      await loadEscrowData();
      
    } catch (error) {
      console.error('Error releasing escrow:', error);
      alert('Failed to release escrow. Please try again.');
    } finally {
      setReleaseLoading(null);
    }
  };

  const filteredPayments = escrowPayments.filter(payment => {
    switch (filter) {
      case 'held':
        return payment.status === 'PAID';
      case 'released':
        return payment.status === 'RELEASED';
      default:
        return true;
    }
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
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'RELEASED':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTimeUntilAutoRelease = (autoReleaseDate: string) => {
    const now = new Date();
    const releaseDate = new Date(autoReleaseDate);
    const timeDiff = releaseDate.getTime() - now.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    
    if (daysDiff <= 0) {
      return 'Auto-release available';
    } else if (daysDiff === 1) {
      return '1 day until auto-release';
    } else {
      return `${daysDiff} days until auto-release`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading escrow data...</p>
        </div>
      </div>
    );
  }

  const totalHeld = filteredPayments
    .filter(p => p.status === 'PAID')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalReleased = filteredPayments
    .filter(p => p.status === 'RELEASED')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Escrow Management</h1>
              <p className="mt-2 text-gray-600">Manage payments held in escrow for project protection</p>
            </div>
            <button
              onClick={loadEscrowData}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Held in Escrow</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {formatCurrency(totalHeld)}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Shield className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Released</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(totalReleased)}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Escrows</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredPayments.filter(p => p.status === 'PAID').length}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* How Escrow Works */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">How Escrow Protection Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-medium text-gray-900">Payment Secured</h3>
              <p className="text-sm text-gray-600 mt-1">
                Client payment is held safely in escrow when work begins
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Shield className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="font-medium text-gray-900">Work Protected</h3>
              <p className="text-sm text-gray-600 mt-1">
                Freelancer is guaranteed payment upon successful completion
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-medium text-gray-900">Funds Released</h3>
              <p className="text-sm text-gray-600 mt-1">
                Payment is released when client approves the completed work
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Escrow Transactions</h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  filter === 'all'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                All ({escrowPayments.length})
              </button>
              <button
                onClick={() => setFilter('held')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  filter === 'held'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Held ({escrowPayments.filter(p => p.status === 'PAID').length})
              </button>
              <button
                onClick={() => setFilter('released')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  filter === 'released'
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Released ({escrowPayments.filter(p => p.status === 'RELEASED').length})
              </button>
            </div>
          </div>
        </div>

        {/* Escrow List */}
        <div className="space-y-6">
          {filteredPayments.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <Shield className="h-12 w-12 text-gray-400 mx-auto" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No escrow transactions</h3>
              <p className="mt-1 text-sm text-gray-500">
                {filter === 'all' 
                  ? 'Escrow transactions will appear here when payments are made.'
                  : `No ${filter} escrow transactions found.`}
              </p>
            </div>
          ) : (
            filteredPayments.map((payment) => (
              <div key={payment.id} className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {payment.title}
                        </h3>
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(payment.status)}`}>
                          {payment.status === 'PAID' ? 'Held in Escrow' : 'Released'}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">
                          {formatCurrency(payment.amount, payment.currency)}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <User className="h-4 w-4 mr-2" />
                        <span>Client: {payment.clientName}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <User className="h-4 w-4 mr-2" />
                        <span>Freelancer: {payment.freelancerName}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>Paid: {formatDate(payment.paidAt)}</span>
                      </div>
                    </div>

                    {payment.status === 'PAID' && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Clock className="h-5 w-5 text-yellow-600 mr-2" />
                            <span className="text-sm text-yellow-800">
                              Held for {payment.daysInEscrow} days • {getTimeUntilAutoRelease(payment.autoReleaseDate!)}
                            </span>
                          </div>
                          {payment.canRelease && (
                            <button
                              onClick={() => handleReleaseEscrow(payment.id)}
                              disabled={releaseLoading === payment.id}
                              className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 disabled:opacity-50"
                            >
                              {releaseLoading === payment.id ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                  Releasing...
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Release Funds
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    {payment.status === 'RELEASED' && payment.releasedAt && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                        <div className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                          <span className="text-sm text-green-800">
                            Released on {formatDate(payment.releasedAt)}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => router.push(`/invoices/${payment.invoiceId}`)}
                        className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700"
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        View Invoice Details
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </button>
                      
                      {!payment.canRelease && payment.status === 'PAID' && (
                        <span className="text-xs text-gray-500">
                          Only the client can release escrow funds
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}