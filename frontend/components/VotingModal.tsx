'use client';

import { useState } from 'react';
import { X, ThumbsUp, ThumbsDown, AlertTriangle, Eye, MessageSquare, Clock, DollarSign, Calendar } from 'lucide-react';
import { voteOnDispute } from '@/lib/api';

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

interface VotingModalProps {
  isOpen: boolean;
  onClose: () => void;
  dispute: Dispute | null;
  onVoteSubmitted: () => void;
}

export default function VotingModal({ isOpen, onClose, dispute, onVoteSubmitted }: VotingModalProps) {
  const [selectedVote, setSelectedVote] = useState<'for' | 'against' | null>(null);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVote || !dispute) return;

    try {
      setLoading(true);
      await voteOnDispute(dispute.id, {
        userId: 'current-user-id', // This would come from auth context
        vote: selectedVote
      });
      onVoteSubmitted();
      onClose();
      resetForm();
    } catch (error) {
      console.error('Error submitting vote:', error);
      alert('Error submitting vote. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedVote(null);
    setComment('');
    setShowDetails(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
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

  if (!isOpen || !dispute) return null;

  const forVotes = dispute.votes.filter(v => v.vote === 'FOR').length;
  const againstVotes = dispute.votes.filter(v => v.vote === 'AGAINST').length;
  const totalVotes = forVotes + againstVotes;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Community Voting</h2>
              <p className="text-gray-600 text-sm">Help resolve this dispute</p>
            </div>
          </div>
          <button 
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
            title="Close voting modal"
            aria-label="Close voting modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Dispute Summary */}
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">Dispute Summary</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900">{dispute.invoice.title}</h4>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        {formatCurrency(dispute.invoice.amount)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Filed {formatDate(dispute.createdAt)}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-gray-700 mb-2">Dispute Reason:</h5>
                    <p className="text-gray-700">{dispute.reason}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Filed by:</span>
                    <span className="font-medium">{dispute.opener.name}</span>
                  </div>
                </div>

                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="flex items-center gap-2 mt-4 text-blue-600 hover:text-blue-700 text-sm"
                >
                  <Eye className="h-4 w-4" />
                  {showDetails ? 'Hide' : 'Show'} Full Details
                </button>

                {showDetails && (
                  <div className="mt-4 p-4 bg-white rounded-lg border">
                    <h5 className="font-medium mb-2">Additional Information</h5>
                    <div className="text-sm text-gray-700 space-y-2">
                      <p><strong>Invoice ID:</strong> {dispute.invoiceId}</p>
                      <p><strong>Status:</strong> {dispute.invoice.status}</p>
                      <p><strong>Dispute ID:</strong> {dispute.id}</p>
                      <p><strong>Opener Email:</strong> {dispute.opener.email}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Voting Section */}
              <div className="bg-white border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Cast Your Vote</h3>
                <p className="text-gray-600 mb-6">
                  Review the dispute details and vote based on the evidence provided. Your vote helps the community reach a fair resolution.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Vote Options */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Your Vote *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <label className={`relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        selectedVote === 'for' 
                          ? 'border-green-500 bg-green-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}>
                        <input
                          type="radio"
                          name="vote"
                          value="for"
                          checked={selectedVote === 'for'}
                          onChange={(e) => setSelectedVote(e.target.value as 'for')}
                          className="sr-only"
                        />
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${
                            selectedVote === 'for' ? 'bg-green-100' : 'bg-gray-100'
                          }`}>
                            <ThumbsUp className={`h-5 w-5 ${
                              selectedVote === 'for' ? 'text-green-600' : 'text-gray-600'
                            }`} />
                          </div>
                          <div>
                            <div className="font-medium">Vote FOR the opener</div>
                            <div className="text-sm text-gray-600">
                              The dispute is valid and justified
                            </div>
                          </div>
                        </div>
                      </label>

                      <label className={`relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        selectedVote === 'against' 
                          ? 'border-red-500 bg-red-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}>
                        <input
                          type="radio"
                          name="vote"
                          value="against"
                          checked={selectedVote === 'against'}
                          onChange={(e) => setSelectedVote(e.target.value as 'against')}
                          className="sr-only"
                        />
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${
                            selectedVote === 'against' ? 'bg-red-100' : 'bg-gray-100'
                          }`}>
                            <ThumbsDown className={`h-5 w-5 ${
                              selectedVote === 'against' ? 'text-red-600' : 'text-gray-600'
                            }`} />
                          </div>
                          <div>
                            <div className="font-medium">Vote AGAINST the opener</div>
                            <div className="text-sm text-gray-600">
                              The dispute is not justified
                            </div>
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Optional Comment */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Comment (Optional)
                    </label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Explain your reasoning (optional but helpful for transparency)"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Voting Guidelines */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h5 className="font-medium text-blue-800 mb-2">Voting Guidelines</h5>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Vote based on facts and evidence presented</li>
                      <li>• Consider both sides of the dispute fairly</li>
                      <li>• Avoid bias and personal preferences</li>
                      <li>• Your vote is final and cannot be changed</li>
                    </ul>
                  </div>

                  {/* Submit */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    
                    <button
                      type="submit"
                      disabled={!selectedVote || loading}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Submitting Vote...' : 'Submit Vote'}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Current Voting Status */}
              <div className="bg-white border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Current Votes</h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">For Opener</span>
                      <span className="text-sm font-bold text-green-600">{forVotes}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: totalVotes > 0 ? `${(forVotes / totalVotes) * 100}%` : '0%' }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Against Opener</span>
                      <span className="text-sm font-bold text-red-600">{againstVotes}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full" 
                        style={{ width: totalVotes > 0 ? `${(againstVotes / totalVotes) * 100}%` : '0%' }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t border-gray-200">
                    <div className="text-center">
                      <span className="text-2xl font-bold text-gray-900">{totalVotes}</span>
                      <p className="text-sm text-gray-600">Total Votes</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Voting Timeline */}
              <div className="bg-white border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Voting Timeline</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <div className="text-sm">
                      <p className="font-medium">Dispute Filed</p>
                      <p className="text-gray-600">{formatDate(dispute.createdAt)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <div className="text-sm">
                      <p className="font-medium">Voting Period</p>
                      <p className="text-gray-600">7 days from filing</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <div className="text-sm">
                      <p className="font-medium">Resolution</p>
                      <p className="text-gray-600">After voting ends</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Community Guidelines */}
              <div className="bg-white border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">
                  <MessageSquare className="h-5 w-5 inline mr-2" />
                  Community Guidelines
                </h3>
                <div className="text-sm text-gray-600 space-y-2">
                  <p>• Be objective and fair in your assessment</p>
                  <p>• Consider all available evidence</p>
                  <p>• Respect the confidentiality of the dispute</p>
                  <p>• Vote in good faith to help resolve conflicts</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}