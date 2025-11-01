'use client';

import { useState } from 'react';
import { 
  X, 
  MessageSquare, 
  Users, 
  Calendar, 
  Clock, 
  CheckCircle,
  AlertTriangle,
  Phone,
  Video,
  Send,
  FileText,
  Paperclip,
  Settings,
  Shield
} from 'lucide-react';

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

interface MediationToolsProps {
  isOpen: boolean;
  onClose: () => void;
  dispute: Dispute | null;
  onResolutionSubmitted: () => void;
}

const mediationSteps = [
  {
    id: 'assessment',
    title: 'Initial Assessment',
    description: 'Review dispute details and evidence',
    status: 'completed'
  },
  {
    id: 'contact',
    title: 'Contact Parties',
    description: 'Reach out to both parties separately',
    status: 'completed'
  },
  {
    id: 'mediation',
    title: 'Mediation Session',
    description: 'Facilitate discussion between parties',
    status: 'active'
  },
  {
    id: 'resolution',
    title: 'Resolution',
    description: 'Document agreed-upon solution',
    status: 'pending'
  }
];

const mockMessages = [
  {
    id: '1',
    sender: 'mediator',
    content: 'Hello everyone, I\'m here to help facilitate a resolution to this dispute. Let me start by understanding both perspectives.',
    timestamp: new Date('2024-10-30T10:00:00').toISOString(),
    type: 'text'
  },
  {
    id: '2',
    sender: 'opener',
    content: 'Thank you for taking this case. As I mentioned in my filing, the work delivered did not meet the agreed specifications.',
    timestamp: new Date('2024-10-30T10:05:00').toISOString(),
    type: 'text'
  },
  {
    id: '3',
    sender: 'respondent',
    content: 'I disagree. I delivered exactly what was requested in the original brief. The client is now asking for additional features.',
    timestamp: new Date('2024-10-30T10:10:00').toISOString(),
    type: 'text'
  },
  {
    id: '4',
    sender: 'mediator',
    content: 'I can see both sides have valid points. Let\'s schedule a video call to discuss this in detail.',
    timestamp: new Date('2024-10-30T10:15:00').toISOString(),
    type: 'text'
  }
];

export default function MediationTools({ isOpen, onClose, dispute, onResolutionSubmitted }: MediationToolsProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'messages' | 'documents' | 'resolution'>('overview');
  const [newMessage, setNewMessage] = useState('');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [proposedSolution, setProposedSolution] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    // Here you would send the message to the backend
    console.log('Sending message:', newMessage);
    setNewMessage('');
  };

  const handleSubmitResolution = () => {
    // Here you would submit the resolution to the backend
    console.log('Submitting resolution:', { resolutionNotes, proposedSolution });
    onResolutionSubmitted();
    onClose();
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

  if (!isOpen || !dispute) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Shield className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Mediation Tools</h2>
              <p className="text-gray-600 text-sm">Dispute ID: {dispute.id}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
            title="Close mediation tools"
            aria-label="Close mediation tools"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex px-6">
            {[
              { id: 'overview', label: 'Overview', icon: FileText },
              { id: 'messages', label: 'Messages', icon: MessageSquare },
              { id: 'documents', label: 'Documents', icon: Paperclip },
              { id: 'resolution', label: 'Resolution', icon: CheckCircle }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 ${
                    activeTab === tab.id
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="h-full overflow-y-auto p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Dispute Details */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Dispute Summary</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Project</label>
                        <p className="text-gray-900">{dispute.invoice.title}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Amount</label>
                        <p className="text-gray-900">${dispute.invoice.amount.toLocaleString()}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Reason</label>
                        <p className="text-gray-900">{dispute.reason}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Filed By</label>
                        <p className="text-gray-900">{dispute.opener.name} ({dispute.opener.email})</p>
                      </div>
                    </div>
                  </div>

                  {/* Mediation Progress */}
                  <div className="bg-white border rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Mediation Progress</h3>
                    <div className="space-y-4">
                      {mediationSteps.map((step, index) => (
                        <div key={step.id} className="flex items-start gap-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                            step.status === 'completed' 
                              ? 'bg-green-100 text-green-600' 
                              : step.status === 'active'
                              ? 'bg-purple-100 text-purple-600'
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {step.status === 'completed' ? (
                              <CheckCircle className="h-4 w-4" />
                            ) : (
                              index + 1
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{step.title}</h4>
                            <p className="text-sm text-gray-600">{step.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Quick Actions */}
                  <div className="bg-white border rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      <button className="w-full flex items-center gap-2 px-4 py-2 text-left border border-gray-300 rounded-lg hover:bg-gray-50">
                        <Video className="h-4 w-4" />
                        Schedule Video Call
                      </button>
                      <button className="w-full flex items-center gap-2 px-4 py-2 text-left border border-gray-300 rounded-lg hover:bg-gray-50">
                        <Phone className="h-4 w-4" />
                        Schedule Phone Call
                      </button>
                      <button className="w-full flex items-center gap-2 px-4 py-2 text-left border border-gray-300 rounded-lg hover:bg-gray-50">
                        <Calendar className="h-4 w-4" />
                        Set Deadline
                      </button>
                      <button className="w-full flex items-center gap-2 px-4 py-2 text-left border border-gray-300 rounded-lg hover:bg-gray-50">
                        <Settings className="h-4 w-4" />
                        Mediation Settings
                      </button>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="bg-white border rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Timeline</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span>Dispute filed: {formatDate(dispute.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-purple-500" />
                        <span>Mediation started: Today</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span>Target resolution: In 5 days</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Messages Tab */}
          {activeTab === 'messages' && (
            <div className="h-full flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {mockMessages.map((message) => (
                  <div key={message.id} className={`flex ${
                    message.sender === 'mediator' ? 'justify-center' : 'justify-start'
                  }`}>
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender === 'mediator' 
                        ? 'bg-purple-100 text-purple-800'
                        : message.sender === 'opener'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      <div className="text-xs font-medium mb-1 capitalize">{message.sender}</div>
                      <div className="text-sm">{message.content}</div>
                      <div className="text-xs opacity-70 mt-1">
                        {formatDate(message.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="border-t border-gray-200 p-4">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message as mediator..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <div className="h-full overflow-y-auto p-6">
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Documents</h3>
                <p className="text-gray-500">Evidence and documents will appear here</p>
              </div>
            </div>
          )}

          {/* Resolution Tab */}
          {activeTab === 'resolution' && (
            <div className="h-full overflow-y-auto p-6">
              <div className="max-w-2xl mx-auto space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Resolution Documentation</h3>
                  <p className="text-gray-600 mb-6">
                    Document the agreed-upon resolution and next steps.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Proposed Solution *
                  </label>
                  <textarea
                    value={proposedSolution}
                    onChange={(e) => setProposedSolution(e.target.value)}
                    placeholder="Describe the proposed solution that both parties have agreed to..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mediation Notes
                  </label>
                  <textarea
                    value={resolutionNotes}
                    onChange={(e) => setResolutionNotes(e.target.value)}
                    placeholder="Add any additional notes about the mediation process..."
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-yellow-800 mb-1">Important</p>
                      <p className="text-yellow-700">
                        Once you submit this resolution, it will be final and the dispute will be marked as resolved.
                        Make sure both parties have agreed to the proposed solution.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitResolution}
                    disabled={!proposedSolution.trim()}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Submit Resolution
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}