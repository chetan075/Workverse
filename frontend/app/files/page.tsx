'use client';

import { useState, useCallback, useRef } from 'react';
import { 
  Upload, 
  Search, 
  Filter, 
  Grid, 
  List, 
  Folder, 
  File, 
  Image, 
  FileText, 
  Video, 
  Music, 
  Archive, 
  Download, 
  Share2, 
  Trash2, 
  Eye, 
  MoreVertical,
  FolderPlus,
  Star,
  Clock,
  Users,
  Lock,
  Unlock,
  Copy,
  Edit3,
  Move,
  Info,
  CloudUpload,
  HardDrive,
  RefreshCw,
  SortAsc,
  Calendar,
  FileCode,
  Database
} from 'lucide-react';

interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size?: number;
  modifiedAt: string;
  createdAt: string;
  mimeType?: string;
  isStarred: boolean;
  isShared: boolean;
  permissions: 'read' | 'write' | 'admin';
  owner: string;
  versions?: number;
  thumbnail?: string;
  path: string;
  tags?: string[];
}

interface StorageStats {
  totalSpace: number;
  usedSpace: number;
  fileCount: number;
  folderCount: number;
}

export default function FilesPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPath, setCurrentPath] = useState('/');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size' | 'type'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filterType, setFilterType] = useState<'all' | 'images' | 'documents' | 'videos' | 'other'>('all');

  // Mock data
  const [files] = useState<FileItem[]>([
    {
      id: '1',
      name: 'Project Documents',
      type: 'folder',
      modifiedAt: '2024-11-01T10:30:00Z',
      createdAt: '2024-10-15T09:00:00Z',
      isStarred: true,
      isShared: false,
      permissions: 'admin',
      owner: 'John Doe',
      path: '/Project Documents'
    },
    {
      id: '2',
      name: 'Invoice_2024_001.pdf',
      type: 'file',
      size: 2048576,
      modifiedAt: '2024-11-01T14:20:00Z',
      createdAt: '2024-11-01T14:20:00Z',
      mimeType: 'application/pdf',
      isStarred: false,
      isShared: true,
      permissions: 'read',
      owner: 'Jane Smith',
      versions: 3,
      path: '/Invoice_2024_001.pdf',
      tags: ['invoice', 'client', 'urgent']
    },
    {
      id: '3',
      name: 'Website_Mockup.png',
      type: 'file',
      size: 4194304,
      modifiedAt: '2024-10-30T16:45:00Z',
      createdAt: '2024-10-30T16:45:00Z',
      mimeType: 'image/png',
      isStarred: true,
      isShared: false,
      permissions: 'write',
      owner: 'John Doe',
      versions: 1,
      thumbnail: '/api/placeholder/150/150',
      path: '/Website_Mockup.png',
      tags: ['design', 'mockup']
    },
    {
      id: '4',
      name: 'Contract_Template.docx',
      type: 'file',
      size: 1024000,
      modifiedAt: '2024-10-28T11:15:00Z',
      createdAt: '2024-10-20T09:30:00Z',
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      isStarred: false,
      isShared: true,
      permissions: 'write',
      owner: 'Legal Team',
      versions: 5,
      path: '/Contract_Template.docx',
      tags: ['legal', 'template']
    },
    {
      id: '5',
      name: 'Demo_Video.mp4',
      type: 'file',
      size: 52428800,
      modifiedAt: '2024-10-25T13:00:00Z',
      createdAt: '2024-10-25T13:00:00Z',
      mimeType: 'video/mp4',
      isStarred: false,
      isShared: false,
      permissions: 'admin',
      owner: 'John Doe',
      versions: 1,
      path: '/Demo_Video.mp4',
      tags: ['demo', 'presentation']
    }
  ]);

  const [storageStats] = useState<StorageStats>({
    totalSpace: 107374182400, // 100GB
    usedSpace: 15728640000,   // 14.6GB
    fileCount: 234,
    folderCount: 45
  });

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

  const getFileIcon = (file: FileItem) => {
    if (file.type === 'folder') {
      return <Folder className="h-6 w-6 text-blue-600" />;
    }

    const mimeType = file.mimeType || '';
    if (mimeType.startsWith('image/')) return <Image className="h-6 w-6 text-green-600" />;
    if (mimeType.startsWith('video/')) return <Video className="h-6 w-6 text-purple-600" />;
    if (mimeType.startsWith('audio/')) return <Music className="h-6 w-6 text-pink-600" />;
    if (mimeType.includes('pdf')) return <FileText className="h-6 w-6 text-red-600" />;
    if (mimeType.includes('word') || mimeType.includes('document')) return <FileText className="h-6 w-6 text-blue-600" />;
    if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return <Database className="h-6 w-6 text-green-600" />;
    if (mimeType.includes('code') || mimeType.includes('javascript') || mimeType.includes('typescript')) return <FileCode className="h-6 w-6 text-yellow-600" />;
    if (mimeType.includes('zip') || mimeType.includes('rar')) return <Archive className="h-6 w-6 text-gray-600" />;
    
    return <File className="h-6 w-6 text-gray-600" />;
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    console.log('Files dropped:', droppedFiles);
    // Handle file upload
  }, []);

  const handleFileSelect = (fileId: string) => {
    const newSelected = new Set(selectedFiles);
    if (newSelected.has(fileId)) {
      newSelected.delete(fileId);
    } else {
      newSelected.add(fileId);
    }
    setSelectedFiles(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedFiles.size === files.length) {
      setSelectedFiles(new Set());
    } else {
      setSelectedFiles(new Set(files.map(f => f.id)));
    }
  };

  const filteredFiles = files.filter(file => {
    if (searchQuery && !file.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    if (filterType !== 'all') {
      const mimeType = file.mimeType || '';
      switch (filterType) {
        case 'images':
          return mimeType.startsWith('image/');
        case 'documents':
          return mimeType.includes('pdf') || mimeType.includes('doc') || mimeType.includes('text');
        case 'videos':
          return mimeType.startsWith('video/');
        case 'other':
          return file.type === 'folder' || (!mimeType.startsWith('image/') && !mimeType.startsWith('video/') && !mimeType.includes('pdf') && !mimeType.includes('doc'));
      }
    }
    
    return true;
  }).sort((a, b) => {
    let compareValue = 0;
    
    switch (sortBy) {
      case 'name':
        compareValue = a.name.localeCompare(b.name);
        break;
      case 'date':
        compareValue = new Date(a.modifiedAt).getTime() - new Date(b.modifiedAt).getTime();
        break;
      case 'size':
        compareValue = (a.size || 0) - (b.size || 0);
        break;
      case 'type':
        compareValue = (a.mimeType || '').localeCompare(b.mimeType || '');
        break;
    }
    
    return sortOrder === 'asc' ? compareValue : -compareValue;
  });

  const usagePercentage = (storageStats.usedSpace / storageStats.totalSpace) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">File Manager</h1>
              <p className="text-gray-600 mt-1">Manage your files, folders, and collaborate with your team</p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowUploadModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <CloudUpload className="h-4 w-4" />
                Upload
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                <FolderPlus className="h-4 w-4" />
                New Folder
              </button>
            </div>
          </div>

          {/* Storage Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 border">
              <div className="flex items-center gap-3">
                <HardDrive className="h-8 w-8 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold">{formatFileSize(storageStats.usedSpace)}</div>
                  <div className="text-sm text-gray-600">of {formatFileSize(storageStats.totalSpace)} used</div>
                </div>
              </div>
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 mt-1">{usagePercentage.toFixed(1)}% used</div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border">
              <div className="flex items-center gap-3">
                <File className="h-8 w-8 text-green-600" />
                <div>
                  <div className="text-2xl font-bold">{storageStats.fileCount}</div>
                  <div className="text-sm text-gray-600">Files</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border">
              <div className="flex items-center gap-3">
                <Folder className="h-8 w-8 text-purple-600" />
                <div>
                  <div className="text-2xl font-bold">{storageStats.folderCount}</div>
                  <div className="text-sm text-gray-600">Folders</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border">
              <div className="flex items-center gap-3">
                <Share2 className="h-8 w-8 text-orange-600" />
                <div>
                  <div className="text-2xl font-bold">{files.filter(f => f.isShared).length}</div>
                  <div className="text-sm text-gray-600">Shared</div>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Controls */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search files and folders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center gap-3">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="all">All Files</option>
                <option value="images">Images</option>
                <option value="documents">Documents</option>
                <option value="videos">Videos</option>
                <option value="other">Other</option>
              </select>

              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-');
                  setSortBy(field as any);
                  setSortOrder(order as any);
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="name-asc">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
                <option value="date-desc">Date (Newest)</option>
                <option value="date-asc">Date (Oldest)</option>
                <option value="size-desc">Size (Largest)</option>
                <option value="size-asc">Size (Smallest)</option>
                <option value="type-asc">Type</option>
              </select>

              <div className="flex border border-gray-300 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <button className="hover:text-blue-600">Files</button>
            {currentPath !== '/' && (
              <>
                <span>/</span>
                <span className="text-gray-900">{currentPath.slice(1)}</span>
              </>
            )}
          </div>

          {/* Bulk Actions */}
          {selectedFiles.size > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-blue-900 font-medium">
                    {selectedFiles.size} file{selectedFiles.size > 1 ? 's' : ''} selected
                  </span>
                  <button 
                    onClick={() => setSelectedFiles(new Set())}
                    className="text-blue-600 hover:text-blue-700 text-sm"
                  >
                    Clear selection
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                    <Download className="h-3 w-3" />
                    Download
                  </button>
                  <button className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded text-sm hover:bg-green-700">
                    <Share2 className="h-3 w-3" />
                    Share
                  </button>
                  <button className="flex items-center gap-1 px-3 py-1.5 bg-gray-600 text-white rounded text-sm hover:bg-gray-700">
                    <Move className="h-3 w-3" />
                    Move
                  </button>
                  <button className="flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white rounded text-sm hover:bg-red-700">
                    <Trash2 className="h-3 w-3" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* File List/Grid */}
        <div 
          className={`bg-white rounded-lg border ${isDragging ? 'border-blue-500 bg-blue-50' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {isDragging && (
            <div className="absolute inset-0 bg-blue-50 bg-opacity-90 flex items-center justify-center z-10 rounded-lg">
              <div className="text-center">
                <CloudUpload className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                <p className="text-blue-900 text-lg font-medium">Drop files here to upload</p>
              </div>
            </div>
          )}

          {viewMode === 'grid' ? (
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {filteredFiles.map((file) => (
                  <div
                    key={file.id}
                    className={`group relative p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer ${
                      selectedFiles.has(file.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                    onClick={() => handleFileSelect(file.id)}
                  >
                    <div className="flex flex-col items-center text-center space-y-2">
                      {file.thumbnail ? (
                        <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden">
                          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                            {getFileIcon(file)}
                          </div>
                        </div>
                      ) : (
                        <div className="w-16 h-16 flex items-center justify-center">
                          {getFileIcon(file)}
                        </div>
                      )}
                      
                      <div className="w-full">
                        <p className="text-sm font-medium text-gray-900 truncate" title={file.name}>
                          {file.name}
                        </p>
                        {file.size && (
                          <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-1">
                        {file.isStarred && <Star className="h-3 w-3 text-yellow-500 fill-current" />}
                        {file.isShared && <Share2 className="h-3 w-3 text-blue-500" />}
                        {file.versions && file.versions > 1 && (
                          <span className="text-xs bg-gray-100 px-1 rounded">{file.versions}</span>
                        )}
                      </div>
                    </div>

                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1 bg-white rounded shadow-sm border hover:bg-gray-50">
                        <MoreVertical className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedFiles.size === files.length && files.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Size
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Modified
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Owner
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredFiles.map((file) => (
                    <tr key={file.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedFiles.has(file.id)}
                          onChange={() => handleFileSelect(file.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {getFileIcon(file)}
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-900">{file.name}</span>
                              {file.isStarred && <Star className="h-3 w-3 text-yellow-500 fill-current" />}
                              {file.isShared && <Share2 className="h-3 w-3 text-blue-500" />}
                              {file.versions && file.versions > 1 && (
                                <span className="text-xs bg-gray-100 px-1 rounded">v{file.versions}</span>
                              )}
                            </div>
                            {file.tags && (
                              <div className="flex gap-1 mt-1">
                                {file.tags.slice(0, 2).map((tag) => (
                                  <span key={tag} className="text-xs bg-blue-100 text-blue-800 px-1 rounded">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {file.size ? formatFileSize(file.size) : '—'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatDate(file.modifiedAt)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {file.owner}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button 
                            className="p-1 text-gray-400 hover:text-gray-600"
                            title="Preview"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button 
                            className="p-1 text-gray-400 hover:text-gray-600"
                            title="Download"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                          <button 
                            className="p-1 text-gray-400 hover:text-gray-600"
                            title="Share"
                          >
                            <Share2 className="h-4 w-4" />
                          </button>
                          <button 
                            className="p-1 text-gray-400 hover:text-gray-600"
                            title="More options"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {filteredFiles.length === 0 && (
            <div className="p-12 text-center">
              <File className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No files found</h3>
              <p className="text-gray-600 mb-6">
                {searchQuery ? 'Try adjusting your search query' : 'Upload your first file to get started'}
              </p>
              <button
                onClick={() => setShowUploadModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Upload Files
              </button>
            </div>
          )}
        </div>

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Upload Files</h3>
              
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4 hover:border-blue-500 transition-colors"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <CloudUpload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Drag and drop files here</p>
                <p className="text-sm text-gray-500 mb-4">or</p>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Choose Files
                </button>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  console.log('Files selected:', files);
                }}
              />
              
              <div className="flex justify-end gap-3">
                <button 
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  Upload
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}