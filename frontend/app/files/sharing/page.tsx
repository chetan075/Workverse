'use client';

import { useState } from 'react';
import { 
  Share2, 
  Users, 
  Lock, 
  Unlock, 
  Eye, 
  Edit3, 
  Trash2, 
  Plus, 
  Link, 
  Mail, 
  Copy, 
  Calendar, 
  Clock, 
  Shield, 
  UserCheck, 
  UserX, 
  Settings, 
  Globe, 
  AlertTriangle, 
  CheckCircle, 
  X,
  Download,
  QrCode,
  Timer,
  Key,
  UserPlus,
  Crown,
  Activity
} from 'lucide-react';

interface SharePermission {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  role: 'viewer' | 'editor' | 'admin';
  accessType: 'direct' | 'link' | 'inherited';
  grantedAt: string;
  grantedBy: string;
  expiresAt?: string;
  lastAccessed?: string;
}

interface ShareLink {
  id: string;
  url: string;
  accessLevel: 'view' | 'edit' | 'download';
  expiresAt?: string;
  password?: boolean;
  downloadLimit?: number;
  downloadsUsed: number;
  createdAt: string;
  lastAccessed?: string;
  accessCount: number;
}

interface PublicShareSettings {
  enabled: boolean;
  requireAuth: boolean;
  allowDownload: boolean;
  allowComments: boolean;
  watermark: boolean;
}

export default function FileSharingPage() {
  const [activeTab, setActiveTab] = useState<'permissions' | 'links' | 'public' | 'activity'>('permissions');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'viewer' | 'editor' | 'admin'>('viewer');
  const [inviteMessage, setInviteMessage] = useState('');

  const [selectedFile] = useState({
    id: 'file-123',
    name: 'Project_Proposal.pdf',
    owner: 'John Doe',
    isPublic: false
  });

  const [permissions, setPermissions] = useState<SharePermission[]>([
    {
      id: '1',
      user: {
        id: 'u1',
        name: 'Jane Smith',
        email: 'jane.smith@company.com',
        avatar: '/api/placeholder/32/32'
      },
      role: 'editor',
      accessType: 'direct',
      grantedAt: '2024-10-28T10:00:00Z',
      grantedBy: 'John Doe',
      lastAccessed: '2024-11-01T14:30:00Z'
    },
    {
      id: '2',
      user: {
        id: 'u2',
        name: 'Mike Johnson',
        email: 'mike.johnson@partner.com',
        avatar: '/api/placeholder/32/32'
      },
      role: 'viewer',
      accessType: 'link',
      grantedAt: '2024-10-30T15:30:00Z',
      grantedBy: 'Jane Smith',
      expiresAt: '2024-11-15T23:59:59Z',
      lastAccessed: '2024-10-31T09:15:00Z'
    },
    {
      id: '3',
      user: {
        id: 'u3',
        name: 'Sarah Wilson',
        email: 'sarah.wilson@client.com',
        avatar: '/api/placeholder/32/32'
      },
      role: 'viewer',
      accessType: 'direct',
      grantedAt: '2024-10-25T11:20:00Z',
      grantedBy: 'John Doe',
      lastAccessed: '2024-10-29T16:45:00Z'
    }
  ]);

  const [shareLinks, setShareLinks] = useState<ShareLink[]>([
    {
      id: 'link1',
      url: 'https://workverse.app/s/abc123def456',
      accessLevel: 'view',
      expiresAt: '2024-11-15T23:59:59Z',
      password: true,
      accessCount: 15,
      downloadsUsed: 0,
      createdAt: '2024-10-30T10:00:00Z',
      lastAccessed: '2024-11-01T09:30:00Z'
    },
    {
      id: 'link2',
      url: 'https://workverse.app/s/xyz789ghi012',
      accessLevel: 'download',
      downloadLimit: 10,
      downloadsUsed: 3,
      accessCount: 8,
      createdAt: '2024-10-28T14:15:00Z',
      lastAccessed: '2024-10-31T11:20:00Z'
    }
  ]);

  const [publicSettings, setPublicSettings] = useState<PublicShareSettings>({
    enabled: false,
    requireAuth: true,
    allowDownload: false,
    allowComments: true,
    watermark: true
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Crown className="h-4 w-4 text-purple-600" />;
      case 'editor':
        return <Edit3 className="h-4 w-4 text-blue-600" />;
      case 'viewer':
        return <Eye className="h-4 w-4 text-green-600" />;
      default:
        return <Eye className="h-4 w-4 text-gray-600" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'editor':
        return 'bg-blue-100 text-blue-800';
      case 'viewer':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAccessTypeIcon = (type: string) => {
    switch (type) {
      case 'direct':
        return <UserCheck className="h-3 w-3 text-blue-600" />;
      case 'link':
        return <Link className="h-3 w-3 text-orange-600" />;
      case 'inherited':
        return <Settings className="h-3 w-3 text-purple-600" />;
      default:
        return <Settings className="h-3 w-3 text-gray-600" />;
    }
  };

  const handleRoleChange = (permissionId: string, newRole: 'viewer' | 'editor' | 'admin') => {
    setPermissions(permissions.map(p => 
      p.id === permissionId ? { ...p, role: newRole } : p
    ));
  };

  const handleRemovePermission = (permissionId: string) => {
    setPermissions(permissions.filter(p => p.id !== permissionId));
  };

  const handleInviteUser = () => {
    if (!inviteEmail) return;
    
    const newPermission: SharePermission = {
      id: `perm-${Date.now()}`,
      user: {
        id: `u-${Date.now()}`,
        name: inviteEmail.split('@')[0],
        email: inviteEmail
      },
      role: inviteRole,
      accessType: 'direct',
      grantedAt: new Date().toISOString(),
      grantedBy: selectedFile.owner
    };
    
    setPermissions([...permissions, newPermission]);
    setInviteEmail('');
    setInviteMessage('');
    setShowInviteModal(false);
  };

  const generateShareLink = (accessLevel: 'view' | 'edit' | 'download') => {
    const newLink: ShareLink = {
      id: `link-${Date.now()}`,
      url: `https://workverse.app/s/${Math.random().toString(36).substr(2, 12)}`,
      accessLevel,
      accessCount: 0,
      downloadsUsed: 0,
      createdAt: new Date().toISOString()
    };
    
    setShareLinks([...shareLinks, newLink]);
    return newLink;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">File Sharing & Permissions</h1>
              <p className="text-gray-600 mt-1">
                Manage access controls and sharing settings for {selectedFile.name}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowInviteModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <UserPlus className="h-4 w-4" />
                Invite People
              </button>
              <button
                onClick={() => setShowLinkModal(true)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                <Link className="h-4 w-4" />
                Create Link
              </button>
            </div>
          </div>

          {/* File Info */}
          <div className="bg-white rounded-lg p-6 border mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{selectedFile.name}</h2>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                    <span>Owner: {selectedFile.owner}</span>
                    <span>{permissions.length + 1} people have access</span>
                    <span>{shareLinks.length} active links</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  selectedFile.isPublic 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {selectedFile.isPublic ? 'Public' : 'Private'}
                </span>
                <button className="p-2 text-gray-400 hover:text-gray-600" title="File settings">
                  <Settings className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'permissions', name: 'People & Permissions', icon: Users },
                { id: 'links', name: 'Share Links', icon: Link },
                { id: 'public', name: 'Public Sharing', icon: Globe },
                { id: 'activity', name: 'Access Activity', icon: Activity }
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
          {/* People & Permissions Tab */}
          {activeTab === 'permissions' && (
            <div className="p-6">
              {/* Owner */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 uppercase tracking-wide mb-3">Owner</h3>
                <div className="flex items-center justify-between p-4 border rounded-lg bg-blue-50 border-blue-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {selectedFile.owner.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{selectedFile.owner}</div>
                      <div className="text-sm text-gray-600">Owner</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Crown className="h-5 w-5 text-yellow-600" />
                    <span className="text-sm font-medium text-gray-700">Full Control</span>
                  </div>
                </div>
              </div>

              {/* Shared With */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-700 uppercase tracking-wide">
                    Shared with ({permissions.length})
                  </h3>
                  <button
                    onClick={() => setShowInviteModal(true)}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Add people
                  </button>
                </div>
                
                <div className="space-y-3">
                  {permissions.map((permission) => (
                    <div key={permission.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                          {permission.user.avatar ? (
                            <div className="w-10 h-10 bg-gray-400 rounded-full" />
                          ) : (
                            <span className="text-gray-700 font-semibold">
                              {permission.user.name.charAt(0)}
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{permission.user.name}</div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span>{permission.user.email}</span>
                            {getAccessTypeIcon(permission.accessType)}
                            <span className="capitalize">{permission.accessType}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <select
                          value={permission.role}
                          onChange={(e) => handleRoleChange(permission.id, e.target.value as any)}
                          className="text-sm border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="viewer">Viewer</option>
                          <option value="editor">Editor</option>
                          <option value="admin">Admin</option>
                        </select>
                        
                        <div className="flex items-center gap-1">
                          {getRoleIcon(permission.role)}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(permission.role)}`}>
                            {permission.role}
                          </span>
                        </div>
                        
                        <button
                          onClick={() => handleRemovePermission(permission.id)}
                          className="p-1 text-gray-400 hover:text-red-600"
                          title="Remove access"
                        >
                          <UserX className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Role Descriptions */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Permission Levels</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-start gap-2">
                    <Eye className="h-4 w-4 text-green-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-gray-900">Viewer</div>
                      <div className="text-gray-600">Can view and download</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Edit3 className="h-4 w-4 text-blue-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-gray-900">Editor</div>
                      <div className="text-gray-600">Can view, edit, and share</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Crown className="h-4 w-4 text-purple-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-gray-900">Admin</div>
                      <div className="text-gray-600">Full control and permissions</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Share Links Tab */}
          {activeTab === 'links' && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Share Links</h3>
                  <p className="text-sm text-gray-600">Create and manage shareable links</p>
                </div>
                <button
                  onClick={() => setShowLinkModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4" />
                  Create Link
                </button>
              </div>

              <div className="space-y-4">
                {shareLinks.map((link) => (
                  <div key={link.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Link className="h-4 w-4 text-blue-600" />
                          <span className="font-medium text-gray-900">
                            {link.accessLevel.charAt(0).toUpperCase() + link.accessLevel.slice(1)} Link
                          </span>
                          {link.password && <Key className="h-4 w-4 text-amber-600" />}
                          {link.expiresAt && <Timer className="h-4 w-4 text-red-600" />}
                        </div>
                        
                        <div className="bg-gray-50 rounded p-2 mb-3">
                          <div className="flex items-center justify-between">
                            <code className="text-sm text-gray-700 truncate flex-1 mr-3">
                              {link.url}
                            </code>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => copyToClipboard(link.url)}
                                className="p-1 text-gray-400 hover:text-gray-600"
                                title="Copy link"
                              >
                                <Copy className="h-4 w-4" />
                              </button>
                              <button
                                className="p-1 text-gray-400 hover:text-gray-600"
                                title="QR Code"
                              >
                                <QrCode className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-6 text-sm text-gray-600">
                          <span>Created: {formatDate(link.createdAt)}</span>
                          <span>{link.accessCount} views</span>
                          {link.downloadLimit && (
                            <span>{link.downloadsUsed}/{link.downloadLimit} downloads</span>
                          )}
                          {link.expiresAt && (
                            <span className="text-red-600">
                              Expires: {formatDate(link.expiresAt)}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <button className="p-2 text-gray-400 hover:text-gray-600" title="Edit link">
                          <Settings className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => setShareLinks(shareLinks.filter(l => l.id !== link.id))}
                          className="p-2 text-gray-400 hover:text-red-600" 
                          title="Delete link"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {shareLinks.length === 0 && (
                <div className="text-center py-12">
                  <Link className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Share Links</h3>
                  <p className="text-gray-600 mb-6">
                    Create shareable links to give access without adding people directly
                  </p>
                  <button
                    onClick={() => setShowLinkModal(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Create Your First Link
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Public Sharing Tab */}
          {activeTab === 'public' && (
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Public Sharing Settings</h3>
                <p className="text-sm text-gray-600">
                  Control how this file can be accessed publicly
                </p>
              </div>

              <div className="space-y-6">
                {/* Enable Public Sharing */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="font-medium text-gray-900">Enable Public Sharing</div>
                      <div className="text-sm text-gray-600">Anyone with the link can access this file</div>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={publicSettings.enabled}
                      onChange={(e) => setPublicSettings({...publicSettings, enabled: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {/* Public Settings */}
                {publicSettings.enabled && (
                  <div className="space-y-4 pl-4 border-l-2 border-blue-200">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <UserCheck className="h-4 w-4 text-green-600" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">Require Authentication</div>
                          <div className="text-xs text-gray-600">Users must sign in to access</div>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={publicSettings.requireAuth}
                        onChange={(e) => setPublicSettings({...publicSettings, requireAuth: e.target.checked})}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Download className="h-4 w-4 text-purple-600" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">Allow Downloads</div>
                          <div className="text-xs text-gray-600">Users can download the file</div>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={publicSettings.allowDownload}
                        onChange={(e) => setPublicSettings({...publicSettings, allowDownload: e.target.checked})}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Eye className="h-4 w-4 text-orange-600" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">Add Watermark</div>
                          <div className="text-xs text-gray-600">Show watermark on previews</div>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={publicSettings.watermark}
                        onChange={(e) => setPublicSettings({...publicSettings, watermark: e.target.checked})}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                )}

                {/* Warning */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-amber-900">Security Notice</div>
                      <div className="text-sm text-amber-800 mt-1">
                        Public sharing makes your file accessible to anyone with the link. 
                        Ensure you&apos;re comfortable with the level of access you&apos;re granting.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Access Activity Tab */}
          {activeTab === 'activity' && (
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Access Activity</h3>
                <p className="text-sm text-gray-600">
                  Monitor who has accessed this file and when
                </p>
              </div>

              <div className="space-y-4">
                {[
                  {
                    user: 'Jane Smith',
                    action: 'viewed',
                    timestamp: '2024-11-01T14:30:00Z',
                    ip: '192.168.1.100',
                    device: 'Chrome on Windows'
                  },
                  {
                    user: 'Mike Johnson',
                    action: 'downloaded',
                    timestamp: '2024-10-31T09:15:00Z',
                    ip: '10.0.0.45',
                    device: 'Safari on macOS'
                  },
                  {
                    user: 'Anonymous User',
                    action: 'viewed via link',
                    timestamp: '2024-10-30T16:20:00Z',
                    ip: '203.45.67.89',
                    device: 'Firefox on Linux'
                  }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Activity className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {activity.user} {activity.action}
                        </div>
                        <div className="text-sm text-gray-600">
                          {formatDate(activity.timestamp)} • {activity.device}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {activity.ip}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Invite Modal */}
        {showInviteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex items-center gap-3 mb-4">
                <UserPlus className="h-6 w-6 text-blue-600" />
                <h3 className="text-lg font-semibold">Invite People</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Permission Level
                  </label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="viewer">Viewer - Can view and download</option>
                    <option value="editor">Editor - Can view, edit, and share</option>
                    <option value="admin">Admin - Full control</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message (Optional)
                  </label>
                  <textarea
                    value={inviteMessage}
                    onChange={(e) => setInviteMessage(e.target.value)}
                    placeholder="Add a personal message..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button 
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleInviteUser}
                  disabled={!inviteEmail}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send Invitation
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Create Link Modal */}
        {showLinkModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex items-center gap-3 mb-4">
                <Link className="h-6 w-6 text-blue-600" />
                <h3 className="text-lg font-semibold">Create Share Link</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Access Level
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="radio" name="accessLevel" value="view" defaultChecked className="mr-2" />
                      <span>View only</span>
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="accessLevel" value="download" className="mr-2" />
                      <span>View and download</span>
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="accessLevel" value="edit" className="mr-2" />
                      <span>View and edit</span>
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button 
                  onClick={() => setShowLinkModal(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    generateShareLink('view');
                    setShowLinkModal(false);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Create Link
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}