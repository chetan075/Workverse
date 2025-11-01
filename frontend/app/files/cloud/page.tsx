'use client';

import { useState } from 'react';
import { 
  Cloud, 
  Plus, 
  Settings, 
  RefreshCw as Sync, 
  CheckCircle, 
  AlertTriangle, 
  X, 
  Download, 
  Upload, 
  Folder, 
  File, 
  Trash2, 
  RefreshCw, 
  ExternalLink,
  Shield,
  Zap,
  HardDrive,
  Globe,
  Key,
  Clock,
  Activity,
  BarChart3,
  Users,
  Lock,
  Unlock,
  Link2,
  Database
} from 'lucide-react';

interface CloudProvider {
  id: string;
  name: string;
  icon: string;
  connected: boolean;
  storage: {
    used: number;
    total: number;
  };
  lastSync?: string;
  status: 'connected' | 'syncing' | 'error' | 'disconnected';
  files: number;
  autoSync: boolean;
}

interface SyncOperation {
  id: string;
  type: 'upload' | 'download' | 'sync';
  fileName: string;
  provider: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  progress: number;
  startedAt: string;
  size: number;
}

export default function CloudStoragePage() {
  const [activeTab, setActiveTab] = useState<'providers' | 'sync' | 'settings' | 'analytics'>('providers');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<string>('');

  const [cloudProviders, setCloudProviders] = useState<CloudProvider[]>([
    {
      id: 'aws-s3',
      name: 'Amazon S3',
      icon: '🪣',
      connected: true,
      storage: { used: 2.4e9, total: 10e9 },
      lastSync: '2024-11-01T14:30:00Z',
      status: 'connected',
      files: 156,
      autoSync: true
    },
    {
      id: 'google-drive',
      name: 'Google Drive',
      icon: '📁',
      connected: true,
      storage: { used: 8.7e9, total: 15e9 },
      lastSync: '2024-11-01T14:25:00Z',
      status: 'syncing',
      files: 243,
      autoSync: true
    },
    {
      id: 'dropbox',
      name: 'Dropbox',
      icon: '📦',
      connected: false,
      storage: { used: 0, total: 2e9 },
      status: 'disconnected',
      files: 0,
      autoSync: false
    },
    {
      id: 'onedrive',
      name: 'OneDrive',
      icon: '☁️',
      connected: true,
      storage: { used: 1.2e9, total: 5e9 },
      lastSync: '2024-11-01T13:45:00Z',
      status: 'error',
      files: 89,
      autoSync: false
    }
  ]);

  const [syncOperations] = useState<SyncOperation[]>([
    {
      id: '1',
      type: 'upload',
      fileName: 'Project_Proposal.pdf',
      provider: 'Google Drive',
      status: 'in-progress',
      progress: 65,
      startedAt: '2024-11-01T14:30:00Z',
      size: 2048576
    },
    {
      id: '2',
      type: 'download',
      fileName: 'Client_Contract.docx',
      provider: 'Amazon S3',
      status: 'completed',
      progress: 100,
      startedAt: '2024-11-01T14:25:00Z',
      size: 1024000
    },
    {
      id: '3',
      type: 'sync',
      fileName: 'Presentation_Slides.pptx',
      provider: 'OneDrive',
      status: 'failed',
      progress: 0,
      startedAt: '2024-11-01T14:20:00Z',
      size: 5242880
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-green-100 text-green-800';
      case 'syncing':
        return 'bg-blue-100 text-blue-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'disconnected':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'syncing':
        return <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'disconnected':
        return <X className="h-4 w-4 text-gray-600" />;
      default:
        return <X className="h-4 w-4 text-gray-600" />;
    }
  };

  const getOperationIcon = (type: string) => {
    switch (type) {
      case 'upload':
        return <Upload className="h-4 w-4 text-blue-600" />;
      case 'download':
        return <Download className="h-4 w-4 text-green-600" />;
      case 'sync':
        return <Sync className="h-4 w-4 text-purple-600" />;
      default:
        return <File className="h-4 w-4 text-gray-600" />;
    }
  };

  const connectProvider = (providerId: string) => {
    setCloudProviders(providers => 
      providers.map(p => 
        p.id === providerId 
          ? { ...p, connected: true, status: 'connected' as const, lastSync: new Date().toISOString() }
          : p
      )
    );
  };

  const disconnectProvider = (providerId: string) => {
    setCloudProviders(providers => 
      providers.map(p => 
        p.id === providerId 
          ? { ...p, connected: false, status: 'disconnected' as const, lastSync: undefined }
          : p
      )
    );
  };

  const toggleAutoSync = (providerId: string) => {
    setCloudProviders(providers => 
      providers.map(p => 
        p.id === providerId 
          ? { ...p, autoSync: !p.autoSync }
          : p
      )
    );
  };

  const totalUsedStorage = cloudProviders.reduce((total, provider) => 
    provider.connected ? total + provider.storage.used : total, 0
  );

  const totalAvailableStorage = cloudProviders.reduce((total, provider) => 
    provider.connected ? total + provider.storage.total : total, 0
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Cloud Storage Integration</h1>
              <p className="text-gray-600 mt-1">
                Connect and manage your cloud storage providers for seamless file synchronization
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
                Add Provider
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                <Sync className="h-4 w-4" />
                Sync All
              </button>
            </div>
          </div>

          {/* Storage Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 border">
              <div className="flex items-center gap-3">
                <Cloud className="h-8 w-8 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold">{cloudProviders.filter(p => p.connected).length}</div>
                  <div className="text-sm text-gray-600">Connected Providers</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border">
              <div className="flex items-center gap-3">
                <HardDrive className="h-8 w-8 text-green-600" />
                <div>
                  <div className="text-2xl font-bold">{formatFileSize(totalUsedStorage)}</div>
                  <div className="text-sm text-gray-600">Used Storage</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border">
              <div className="flex items-center gap-3">
                <Database className="h-8 w-8 text-purple-600" />
                <div>
                  <div className="text-2xl font-bold">{formatFileSize(totalAvailableStorage)}</div>
                  <div className="text-sm text-gray-600">Total Available</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border">
              <div className="flex items-center gap-3">
                <File className="h-8 w-8 text-orange-600" />
                <div>
                  <div className="text-2xl font-bold">
                    {cloudProviders.reduce((total, p) => total + p.files, 0)}
                  </div>
                  <div className="text-sm text-gray-600">Synced Files</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'providers', name: 'Cloud Providers', icon: Cloud },
                { id: 'sync', name: 'Sync Operations', icon: Sync },
                { id: 'settings', name: 'Sync Settings', icon: Settings },
                { id: 'analytics', name: 'Usage Analytics', icon: BarChart3 }
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
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
          {/* Cloud Providers Tab */}
          {activeTab === 'providers' && (
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {cloudProviders.map((provider) => (
                  <div key={provider.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{provider.icon}</div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{provider.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            {getStatusIcon(provider.status)}
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(provider.status)}`}>
                              {provider.status.charAt(0).toUpperCase() + provider.status.slice(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button 
                          className="p-2 text-gray-400 hover:text-gray-600"
                          title="Provider settings"
                        >
                          <Settings className="h-4 w-4" />
                        </button>
                        <button 
                          className="p-2 text-gray-400 hover:text-gray-600"
                          title="Open in new tab"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {provider.connected && (
                      <div className="space-y-4">
                        {/* Storage Usage */}
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Storage Usage</span>
                            <span>{formatFileSize(provider.storage.used)} / {formatFileSize(provider.storage.total)}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${(provider.storage.used / provider.storage.total) * 100}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* File Count */}
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Files synced:</span>
                          <span className="font-medium">{provider.files}</span>
                        </div>

                        {/* Last Sync */}
                        {provider.lastSync && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Last sync:</span>
                            <span className="font-medium">{formatDate(provider.lastSync)}</span>
                          </div>
                        )}

                        {/* Auto Sync Toggle */}
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Zap className="h-4 w-4 text-yellow-600" />
                            <span className="text-sm font-medium">Auto Sync</span>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={provider.autoSync}
                              onChange={() => toggleAutoSync(provider.id)}
                              className="sr-only peer"
                            />
                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <button className="flex-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
                            <Sync className="h-3 w-3 inline mr-1" />
                            Sync Now
                          </button>
                          <button 
                            onClick={() => disconnectProvider(provider.id)}
                            className="flex-1 px-3 py-2 border border-red-300 text-red-700 rounded hover:bg-red-50 text-sm"
                          >
                            Disconnect
                          </button>
                        </div>
                      </div>
                    )}

                    {!provider.connected && (
                      <div className="text-center py-4">
                        <p className="text-gray-600 mb-4">Connect to {provider.name} to sync your files</p>
                        <button 
                          onClick={() => connectProvider(provider.id)}
                          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Connect Now
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sync Operations Tab */}
          {activeTab === 'sync' && (
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Active & Recent Operations</h3>
                <p className="text-sm text-gray-600">
                  Monitor file synchronization progress and history
                </p>
              </div>

              <div className="space-y-4">
                {syncOperations.map((operation) => (
                  <div key={operation.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {getOperationIcon(operation.type)}
                        <div>
                          <div className="font-medium text-gray-900">{operation.fileName}</div>
                          <div className="text-sm text-gray-600">
                            {operation.type.charAt(0).toUpperCase() + operation.type.slice(1)} • {operation.provider} • {formatFileSize(operation.size)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          operation.status === 'completed' ? 'bg-green-100 text-green-800' :
                          operation.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                          operation.status === 'failed' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {operation.status.replace('-', ' ')}
                        </span>
                        {operation.status === 'failed' && (
                          <button className="text-blue-600 hover:text-blue-700 text-sm">
                            Retry
                          </button>
                        )}
                      </div>
                    </div>

                    {operation.status === 'in-progress' && (
                      <div className="mb-2">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{operation.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${operation.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    <div className="text-xs text-gray-500">
                      Started: {formatDate(operation.startedAt)}
                    </div>
                  </div>
                ))}
              </div>

              {syncOperations.length === 0 && (
                <div className="text-center py-12">
                  <Sync className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Operations</h3>
                  <p className="text-gray-600">
                    File synchronization operations will appear here
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Sync Settings Tab */}
          {activeTab === 'settings' && (
            <div className="p-6">
              <div className="space-y-6">
                {/* General Settings */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">General Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Sync className="h-5 w-5 text-blue-600" />
                        <div>
                          <div className="font-medium text-gray-900">Auto-sync on file changes</div>
                          <div className="text-sm text-gray-600">Automatically sync when files are modified</div>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Download className="h-5 w-5 text-green-600" />
                        <div>
                          <div className="font-medium text-gray-900">Download files on demand</div>
                          <div className="text-sm text-gray-600">Only download files when accessed locally</div>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Shield className="h-5 w-5 text-purple-600" />
                        <div>
                          <div className="font-medium text-gray-900">Encrypt files during transfer</div>
                          <div className="text-sm text-gray-600">Add extra security for sensitive files</div>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Sync Filters */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Sync Filters</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        File Types to Exclude
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., .tmp, .log, .cache"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Maximum File Size (MB)
                      </label>
                      <input
                        type="number"
                        defaultValue={100}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Folders to Exclude
                      </label>
                      <textarea
                        placeholder="node_modules&#10;.git&#10;temp"
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Bandwidth Settings */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Bandwidth Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload Limit (Mbps)
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option>Unlimited</option>
                        <option>10 Mbps</option>
                        <option>5 Mbps</option>
                        <option>1 Mbps</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Download Limit (Mbps)
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option>Unlimited</option>
                        <option>50 Mbps</option>
                        <option>25 Mbps</option>
                        <option>10 Mbps</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Save Settings
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Usage Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Storage Analytics */}
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Storage Usage</h3>
                  <div className="space-y-4">
                    {cloudProviders.filter(p => p.connected).map((provider) => (
                      <div key={provider.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{provider.icon}</span>
                          <span className="font-medium">{provider.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{formatFileSize(provider.storage.used)}</div>
                          <div className="text-xs text-gray-600">
                            {((provider.storage.used / provider.storage.total) * 100).toFixed(1)}% used
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sync Activity */}
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {[
                      { action: 'Uploaded', file: 'Project_Proposal.pdf', time: '2 minutes ago' },
                      { action: 'Downloaded', file: 'Client_Contract.docx', time: '15 minutes ago' },
                      { action: 'Synced', file: 'Budget_Spreadsheet.xlsx', time: '1 hour ago' },
                      { action: 'Uploaded', file: 'Meeting_Notes.md', time: '3 hours ago' }
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <div>
                          <span className="font-medium">{activity.action}</span>
                          <span className="text-gray-600 ml-1">{activity.file}</span>
                        </div>
                        <span className="text-gray-500">{activity.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Monthly Usage Chart Placeholder */}
              <div className="mt-6 border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Usage Trends</h3>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">Usage analytics chart would be displayed here</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Add Provider Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex items-center gap-3 mb-4">
                <Plus className="h-6 w-6 text-blue-600" />
                <h3 className="text-lg font-semibold">Add Cloud Provider</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Provider
                  </label>
                  <select
                    value={selectedProvider}
                    onChange={(e) => setSelectedProvider(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Choose a provider...</option>
                    <option value="aws-s3">Amazon S3</option>
                    <option value="google-drive">Google Drive</option>
                    <option value="dropbox">Dropbox</option>
                    <option value="onedrive">Microsoft OneDrive</option>
                    <option value="box">Box</option>
                    <option value="icloud">iCloud Drive</option>
                  </select>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <Shield className="h-4 w-4 text-blue-600 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      Your credentials are encrypted and stored securely. We never access your files without permission.
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  disabled={!selectedProvider}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Connect Provider
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}