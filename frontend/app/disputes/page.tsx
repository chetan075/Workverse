'use client';

import { useState, useEffect } from 'react';
import { 
  Scale, 
  AlertTriangle, 
  FileText, 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle,
  Eye,
  Plus,
  Filter,
  Search,
  Calendar,
  DollarSign,
  MessageSquare,
  Vote
} from 'lucide-react';
import { fetchDisputes, fetchInvoices } from '@/lib/api';
import DisputeFilingModal from '@/components/DisputeFilingModal';
import VotingModal from '@/components/VotingModal';

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

interface Invoice {
  id: string;
  title: string;
  amount: number;
  status: string;
  clientId?: string;
  freelancerId?: string;
}

export default function DisputesPage() {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'resolved'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'open' | 'resolved'>('all');
  const [showFilingModal, setShowFilingModal] = useState(false);
  const [showVotingModal, setShowVotingModal] = useState(false);
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);

  const tabs = [
    { id: 'all', name: 'All Disputes', icon: Scale },
    { id: 'active', name: 'Active', icon: AlertTriangle },
    { id: 'resolved', name: 'Resolved', icon: CheckCircle }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [disputesData, invoicesData] = await Promise.all([
        fetchDisputes(),
        fetchInvoices()
      ]);
      setDisputes(disputesData.disputes as Dispute[] || []);
      setInvoices(invoicesData.invoices || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDisputes = disputes.filter(dispute => {
    // Tab filter
    if (activeTab === 'active' && dispute.resolved) return false;
    if (activeTab === 'resolved' && !dispute.resolved) return false;

    // Search filter
    if (searchTerm && !dispute.reason.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !dispute.invoice.title.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    // Status filter
    if (filterStatus === 'open' && dispute.resolved) return false;
    if (filterStatus === 'resolved' && !dispute.resolved) return false;

    return true;
  });

  const getStatusColor = (dispute: Dispute) => {
    if (!dispute.resolved) {
      return 'bg-yellow-100 text-yellow-800';
    }
    switch (dispute.outcome) {
      case 'FOR':
        return 'bg-green-100 text-green-800';
      case 'AGAINST':
        return 'bg-red-100 text-red-800';
      case 'TIED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (dispute: Dispute) => {
    if (!dispute.resolved) {
      return 'Open';
    }
    switch (dispute.outcome) {
      case 'FOR':
        return 'Resolved - For Opener';
      case 'AGAINST':
        return 'Resolved - Against Opener';
      case 'TIED':
        return 'Resolved - Tied';
      default:
        return 'Resolved';
    }
  };

  const handleVote = (dispute: Dispute) => {
    setSelectedDispute(dispute);
    setShowVotingModal(true);
  };

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
              <h1 className="text-3xl font-bold text-gray-900">Dispute Resolution</h1>
              <p className="text-gray-600 mt-1">Manage disputes and community voting</p>
            </div>
            
            <button 
              onClick={() => setShowFilingModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              File Dispute
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Scale className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{disputes.length}</div>
                <div className="text-gray-600 text-sm">Total Disputes</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {disputes.filter(d => !d.resolved).length}
                </div>
                <div className="text-gray-600 text-sm">Active Disputes</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {disputes.filter(d => d.resolved).length}
                </div>
                <div className="text-gray-600 text-sm">Resolved</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">89%</div>
                <div className="text-gray-600 text-sm">Resolution Rate</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as 'all' | 'active' | 'resolved')}
                    className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
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

        {/* Filters */}
        <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search disputes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex gap-3">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as 'all' | 'open' | 'resolved')}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                title="Filter disputes by status"
                aria-label="Filter disputes by status"
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </div>
        </div>

        {/* Disputes List */}
        <div className="space-y-4">
          {filteredDisputes.map((dispute) => (
            <div key={dispute.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {dispute.invoice.title}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(dispute)}`}>
                        {getStatusText(dispute)}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        {formatCurrency(dispute.invoice.amount)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Filed {formatDate(dispute.createdAt)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        by {dispute.opener.name}
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-4">{dispute.reason}</p>
                    
                    {dispute.votes.length > 0 && (
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Vote className="h-4 w-4 text-green-600" />
                          <span className="text-green-600 font-medium">
                            {dispute.votes.filter(v => v.vote === 'FOR').length} For
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Vote className="h-4 w-4 text-red-600" />
                          <span className="text-red-600 font-medium">
                            {dispute.votes.filter(v => v.vote === 'AGAINST').length} Against
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {!dispute.resolved && (
                      <button 
                        onClick={() => handleVote(dispute)}
                        className="flex items-center gap-1 px-3 py-1.5 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 text-sm"
                      >
                        <Vote className="h-4 w-4" />
                        Vote
                      </button>
                    )}
                    <button className="flex items-center gap-1 px-3 py-1.5 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                      <Eye className="h-4 w-4" />
                      View
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {filteredDisputes.length === 0 && (
            <div className="text-center py-12">
              <Scale className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No disputes found</h3>
              <p className="text-gray-500">No disputes match your current filters.</p>
            </div>
          )}
        </div>
      </div>

      {/* Filing Modal */}
      <DisputeFilingModal
        isOpen={showFilingModal}
        onClose={() => setShowFilingModal(false)}
        invoices={invoices}
        onDisputeFiled={loadData}
      />

      {/* Voting Modal */}
      <VotingModal
        isOpen={showVotingModal}
        onClose={() => setShowVotingModal(false)}
        dispute={selectedDispute}
        onVoteSubmitted={loadData}
      />
    </div>
  );
}