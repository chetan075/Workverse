'use client';

import { useState } from 'react';
import { 
  History, 
  Download, 
  Eye, 
  RotateCcw, 
  GitBranch, 
  Calendar, 
  User, 
  FileText, 
  ArrowRight, 
  Plus, 
  Minus, 
  Upload,
  AlertTriangle,
  CheckCircle,
  Tag,
  ArrowRightLeft as Compare,
  Star,
  Trash2,
  Edit3,
  Copy,
  Share2
} from 'lucide-react';

interface FileVersion {
  id: string;
  version: string;
  createdAt: string;
  author: string;
  comment: string;
  size: number;
  checksum: string;
  status: 'current' | 'archived' | 'deleted';
  tags: string[];
  changes?: {
    additions: number;
    deletions: number;
    modifications: number;
  };
}

interface FileDiff {
  type: 'addition' | 'deletion' | 'modification';
  lineNumber: number;
  content: string;
  oldContent?: string;
}

export default function FileVersionsPage() {
  const [selectedFile] = useState({
    id: 'file-123',
    name: 'Contract_Template.docx',
    currentVersion: 'v2.3.1',
    totalVersions: 8
  });

  const [activeTab, setActiveTab] = useState<'versions' | 'diff' | 'branches'>('versions');
  const [selectedVersions, setSelectedVersions] = useState<string[]>([]);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [compareMode, setCompareMode] = useState(false);

  const [versions] = useState<FileVersion[]>([
    {
      id: 'v2.3.1',
      version: 'v2.3.1',
      createdAt: '2024-11-01T14:30:00Z',
      author: 'John Doe',
      comment: 'Updated payment terms and added new clauses for remote work',
      size: 1024000,
      checksum: 'sha256:abc123...',
      status: 'current',
      tags: ['latest', 'approved'],
      changes: { additions: 15, deletions: 3, modifications: 8 }
    },
    {
      id: 'v2.3.0',
      version: 'v2.3.0',
      createdAt: '2024-10-28T11:15:00Z',
      author: 'Jane Smith',
      comment: 'Legal review updates - compliance with new regulations',
      size: 1020000,
      checksum: 'sha256:def456...',
      status: 'archived',
      tags: ['legal-reviewed'],
      changes: { additions: 22, deletions: 7, modifications: 12 }
    },
    {
      id: 'v2.2.1',
      version: 'v2.2.1',
      createdAt: '2024-10-25T16:20:00Z',
      author: 'John Doe',
      comment: 'Minor formatting fixes and typo corrections',
      size: 1018000,
      checksum: 'sha256:ghi789...',
      status: 'archived',
      tags: ['bugfix'],
      changes: { additions: 2, deletions: 1, modifications: 5 }
    },
    {
      id: 'v2.2.0',
      version: 'v2.2.0',
      createdAt: '2024-10-20T09:30:00Z',
      author: 'Legal Team',
      comment: 'Major revision - updated intellectual property clauses',
      size: 1015000,
      checksum: 'sha256:jkl012...',
      status: 'archived',
      tags: ['major-revision', 'ip-update'],
      changes: { additions: 45, deletions: 18, modifications: 25 }
    },
    {
      id: 'v2.1.0',
      version: 'v2.1.0',
      createdAt: '2024-10-15T14:45:00Z',
      author: 'John Doe',
      comment: 'Added termination clauses and dispute resolution section',
      size: 998000,
      checksum: 'sha256:mno345...',
      status: 'archived',
      tags: ['feature'],
      changes: { additions: 35, deletions: 5, modifications: 15 }
    }
  ]);

  const [sampleDiff] = useState<FileDiff[]>([
    {
      type: 'modification',
      lineNumber: 45,
      content: 'Payment shall be made within 30 business days of invoice receipt',
      oldContent: 'Payment shall be made within 15 business days of invoice receipt'
    },
    {
      type: 'addition',
      lineNumber: 78,
      content: 'Remote work provisions: Contractor may work from any location with prior approval'
    },
    {
      type: 'addition',
      lineNumber: 79,
      content: 'Equipment and software requirements for remote work shall be specified in Appendix C'
    },
    {
      type: 'deletion',
      lineNumber: 92,
      content: 'All work must be performed on-site at the client&apos;s premises'
    }
  ]);

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
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

  const getVersionStatus = (status: string) => {
    switch (status) {
      case 'current':
        return 'bg-green-100 text-green-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      case 'deleted':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleVersionSelect = (versionId: string) => {
    if (compareMode) {
      const newSelected = [...selectedVersions];
      if (newSelected.includes(versionId)) {
        newSelected.splice(newSelected.indexOf(versionId), 1);
      } else if (newSelected.length < 2) {
        newSelected.push(versionId);
      }
      setSelectedVersions(newSelected);
    }
  };

  const toggleCompareMode = () => {
    setCompareMode(!compareMode);
    setSelectedVersions([]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">File Version Control</h1>
              <p className="text-gray-600 mt-1">
                Track changes, compare versions, and manage file history for {selectedFile.name}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={toggleCompareMode}
                className={`flex items-center gap-2 px-4 py-2 border rounded-lg ${
                  compareMode 
                    ? 'bg-blue-600 text-white border-blue-600' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Compare className="h-4 w-4" />
                {compareMode ? 'Exit Compare' : 'Compare Versions'}
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Upload className="h-4 w-4" />
                Upload New Version
              </button>
            </div>
          </div>

          {/* File Info */}
          <div className="bg-white rounded-lg p-6 border mb-6">
            <div className="flex items-center gap-4">
              <FileText className="h-12 w-12 text-blue-600" />
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900">{selectedFile.name}</h2>
                <div className="flex items-center gap-6 mt-2 text-sm text-gray-600">
                  <span>Current: {selectedFile.currentVersion}</span>
                  <span>{selectedFile.totalVersions} versions</span>
                  <span>Last modified: {formatDate(versions[0].createdAt)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-400 hover:text-gray-600" title="Star this file">
                  <Star className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600" title="Share file">
                  <Share2 className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600" title="Download current version">
                  <Download className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Compare Mode Info */}
          {compareMode && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Compare className="h-5 w-5 text-blue-600" />
                  <span className="text-blue-900 font-medium">
                    Compare Mode: Select up to 2 versions to compare
                  </span>
                </div>
                {selectedVersions.length === 2 && (
                  <button 
                    onClick={() => setActiveTab('diff')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    View Differences
                  </button>
                )}
              </div>
              {selectedVersions.length > 0 && (
                <div className="mt-2 text-sm text-blue-800">
                  Selected: {selectedVersions.join(', ')}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'versions', name: 'Version History', icon: History },
                { id: 'diff', name: 'Changes & Diff', icon: GitBranch },
                { id: 'branches', name: 'Branches & Tags', icon: Tag }
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as 'versions' | 'diff' | 'branches')}
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

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm">
          {/* Version History Tab */}
          {activeTab === 'versions' && (
            <div className="p-6">
              <div className="space-y-4">
                {versions.map((version, index) => (
                  <div 
                    key={version.id}
                    className={`border rounded-lg p-6 ${
                      compareMode && selectedVersions.includes(version.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    } ${compareMode ? 'cursor-pointer' : ''}`}
                    onClick={() => compareMode && handleVersionSelect(version.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-lg font-semibold text-gray-900">{version.version}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getVersionStatus(version.status)}`}>
                            {version.status}
                          </span>
                          {version.tags.map((tag) => (
                            <span key={tag} className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                              {tag}
                            </span>
                          ))}
                        </div>
                        
                        <p className="text-gray-700 mb-3">{version.comment}</p>
                        
                        <div className="flex items-center gap-6 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {version.author}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(version.createdAt)}
                          </div>
                          <div className="flex items-center gap-1">
                            <FileText className="h-4 w-4" />
                            {formatFileSize(version.size)}
                          </div>
                        </div>

                        {version.changes && (
                          <div className="flex items-center gap-4 mt-3 text-sm">
                            <div className="flex items-center gap-1 text-green-600">
                              <Plus className="h-3 w-3" />
                              {version.changes.additions} additions
                            </div>
                            <div className="flex items-center gap-1 text-red-600">
                              <Minus className="h-3 w-3" />
                              {version.changes.deletions} deletions
                            </div>
                            <div className="flex items-center gap-1 text-blue-600">
                              <Edit3 className="h-3 w-3" />
                              {version.changes.modifications} modifications
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        {!compareMode && (
                          <>
                            <button 
                              className="p-2 text-gray-400 hover:text-gray-600"
                              title="Preview version"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button 
                              className="p-2 text-gray-400 hover:text-gray-600"
                              title="Download version"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                            <button 
                              className="p-2 text-gray-400 hover:text-gray-600"
                              title="Copy version"
                            >
                              <Copy className="h-4 w-4" />
                            </button>
                            {version.status !== 'current' && (
                              <button 
                                onClick={() => setShowRestoreModal(true)}
                                className="p-2 text-blue-600 hover:text-blue-700"
                                title="Restore this version"
                              >
                                <RotateCcw className="h-4 w-4" />
                              </button>
                            )}
                          </>
                        )}
                        {compareMode && selectedVersions.includes(version.id) && (
                          <CheckCircle className="h-5 w-5 text-blue-600" />
                        )}
                      </div>
                    </div>

                    {index < versions.length - 1 && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center text-xs text-gray-500">
                          <ArrowRight className="h-3 w-3 mr-1" />
                          Changes from previous version
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Changes & Diff Tab */}
          {activeTab === 'diff' && (
            <div className="p-6">
              {selectedVersions.length === 2 ? (
                <div>
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">
                      Comparing {selectedVersions[0]} with {selectedVersions[1]}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Plus className="h-3 w-3 text-green-600" />
                        4 additions
                      </span>
                      <span className="flex items-center gap-1">
                        <Minus className="h-3 w-3 text-red-600" />
                        1 deletion
                      </span>
                      <span className="flex items-center gap-1">
                        <Edit3 className="h-3 w-3 text-blue-600" />
                        1 modification
                      </span>
                    </div>
                  </div>

                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-2 border-b text-sm font-medium text-gray-700">
                      Contract_Template.docx
                    </div>
                    <div className="divide-y divide-gray-200">
                      {sampleDiff.map((diff, index) => (
                        <div key={index} className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="text-xs text-gray-500 w-12 text-right">
                              L{diff.lineNumber}
                            </div>
                            <div className="flex-1">
                              {diff.type === 'modification' && (
                                <>
                                  <div className="bg-red-50 border-l-4 border-red-400 p-2 mb-2">
                                    <div className="flex items-center gap-2 mb-1">
                                      <Minus className="h-3 w-3 text-red-600" />
                                      <span className="text-xs text-red-600 font-medium">Removed</span>
                                    </div>
                                    <div className="text-sm text-red-800">{diff.oldContent}</div>
                                  </div>
                                  <div className="bg-green-50 border-l-4 border-green-400 p-2">
                                    <div className="flex items-center gap-2 mb-1">
                                      <Plus className="h-3 w-3 text-green-600" />
                                      <span className="text-xs text-green-600 font-medium">Added</span>
                                    </div>
                                    <div className="text-sm text-green-800">{diff.content}</div>
                                  </div>
                                </>
                              )}
                              
                              {diff.type === 'addition' && (
                                <div className="bg-green-50 border-l-4 border-green-400 p-2">
                                  <div className="flex items-center gap-2 mb-1">
                                    <Plus className="h-3 w-3 text-green-600" />
                                    <span className="text-xs text-green-600 font-medium">Added</span>
                                  </div>
                                  <div className="text-sm text-green-800">{diff.content}</div>
                                </div>
                              )}
                              
                              {diff.type === 'deletion' && (
                                <div className="bg-red-50 border-l-4 border-red-400 p-2">
                                  <div className="flex items-center gap-2 mb-1">
                                    <Minus className="h-3 w-3 text-red-600" />
                                    <span className="text-xs text-red-600 font-medium">Removed</span>
                                  </div>
                                  <div className="text-sm text-red-800">{diff.content}</div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Compare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select Two Versions to Compare</h3>
                  <p className="text-gray-600 mb-6">
                    Go back to the Version History tab and enable compare mode to select two versions
                  </p>
                  <button 
                    onClick={() => {
                      setActiveTab('versions');
                      setCompareMode(true);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Start Comparing
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Branches & Tags Tab */}
          {activeTab === 'branches' && (
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Tags Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Tags</h3>
                  <div className="space-y-3">
                    {['latest', 'approved', 'legal-reviewed', 'major-revision', 'ip-update', 'feature', 'bugfix'].map((tag) => (
                      <div key={tag} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Tag className="h-4 w-4 text-purple-600" />
                          <span className="font-medium">{tag}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">v2.3.1</span>
                          <button className="p-1 text-gray-400 hover:text-gray-600">
                            <Edit3 className="h-3 w-3" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-red-600">
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <button className="mt-4 flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Plus className="h-4 w-4" />
                    Add Tag
                  </button>
                </div>

                {/* Branch Info */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Branch Information</h3>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <GitBranch className="h-5 w-5 text-blue-600" />
                        <span className="font-medium">main</span>
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">current</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        Main production branch containing stable versions
                      </p>
                      <div className="text-xs text-gray-500">
                        8 commits • Last updated {formatDate(versions[0].createdAt)}
                      </div>
                    </div>

                    <div className="p-4 border border-dashed border-gray-300 rounded-lg text-center">
                      <GitBranch className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-3">
                        Create feature branches for collaborative editing
                      </p>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        Create Branch
                      </button>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-amber-900">Version Control Best Practices</h4>
                        <ul className="mt-2 text-sm text-amber-800 space-y-1">
                          <li>• Always add meaningful comments when uploading new versions</li>
                          <li>• Use tags to mark important milestones</li>
                          <li>• Review changes before finalizing versions</li>
                          <li>• Keep archived versions for audit trails</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Restore Version Modal */}
        {showRestoreModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex items-center gap-3 mb-4">
                <RotateCcw className="h-6 w-6 text-blue-600" />
                <h3 className="text-lg font-semibold">Restore Version</h3>
              </div>
              
              <p className="text-gray-600 mb-4">
                Are you sure you want to restore to version v2.2.0? This will create a new version 
                based on the selected version and mark it as the current version.
              </p>
              
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
                  <div className="text-sm text-amber-800">
                    The current version will be preserved in history. This action cannot be undone.
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-3">
                <button 
                  onClick={() => setShowRestoreModal(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  onClick={() => {
                    setShowRestoreModal(false);
                    alert('Version restored successfully!');
                  }}
                >
                  Restore Version
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}