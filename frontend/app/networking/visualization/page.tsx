'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Network, 
  Users, 
  Maximize, 
  Minimize, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Settings, 
  Filter, 
  Download, 
  Share2, 
  Search, 
  MapPin, 
  Briefcase, 
  Star, 
  Activity, 
  Layers, 
  Eye, 
  EyeOff, 
  Target, 
  Zap,
  Compass,
  Grid,
  GitBranch,
  Radar,
  Cpu,
  Database,
  Globe,
  Building,
  GraduationCap,
  Award,
  ChevronDown,
  ChevronRight,
  X,
  Info,
  Lightbulb,
  Sparkles,
  TrendingUp,
  Clock,
  MessageCircle,
  UserPlus,
  ExternalLink
} from 'lucide-react';

interface NetworkNode {
  id: string;
  name: string;
  title: string;
  company?: string;
  profileImage?: string;
  x: number;
  y: number;
  size: number;
  color: string;
  skills: string[];
  connections: number;
  projects: number;
  rating: number;
  isUser?: boolean;
  category: 'direct' | 'mutual' | 'recommended' | 'potential';
  connectionStrength: number;
  lastActivity: string;
}

interface NetworkEdge {
  id: string;
  source: string;
  target: string;
  strength: number;
  type: 'strong' | 'medium' | 'weak';
  projects: number;
  connectionDate: string;
}

interface NetworkStats {
  totalNodes: number;
  totalEdges: number;
  averageConnections: number;
  networkDensity: number;
  strongConnections: number;
  clusteringCoefficient: number;
  shortestPath: number;
}

export default function NetworkVisualizationPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedNodes, setHighlightedNodes] = useState<string[]>([]);
  
  const [viewMode, setViewMode] = useState<'overview' | 'skills' | 'projects' | 'strength'>('overview');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showLabels, setShowLabels] = useState(true);
  const [animateLayout, setAnimateLayout] = useState(false);

  const [networkStats] = useState<NetworkStats>({
    totalNodes: 247,
    totalEdges: 589,
    averageConnections: 4.8,
    networkDensity: 0.019,
    strongConnections: 89,
    clusteringCoefficient: 0.342,
    shortestPath: 3.2
  });

  const [nodes, setNodes] = useState<NetworkNode[]>([
    {
      id: 'user',
      name: 'You',
      title: 'Full-Stack Developer',
      x: 400,
      y: 300,
      size: 20,
      color: '#3B82F6',
      skills: ['React', 'Node.js', 'TypeScript', 'AWS'],
      connections: 247,
      projects: 89,
      rating: 4.8,
      isUser: true,
      category: 'direct',
      connectionStrength: 1.0,
      lastActivity: '2024-11-01T10:00:00Z'
    },
    {
      id: 'sarah',
      name: 'Sarah Johnson',
      title: 'Senior React Developer',
      company: 'TechCorp',
      profileImage: 'https://i.pravatar.cc/150?u=sarah',
      x: 300,
      y: 200,
      size: 16,
      color: '#10B981',
      skills: ['React', 'TypeScript', 'GraphQL'],
      connections: 189,
      projects: 67,
      rating: 4.9,
      category: 'direct',
      connectionStrength: 0.9,
      lastActivity: '2024-11-01T09:30:00Z'
    },
    {
      id: 'michael',
      name: 'Michael Chen',
      title: 'UI/UX Designer',
      company: 'Design Studio',
      profileImage: 'https://i.pravatar.cc/150?u=michael',
      x: 500,
      y: 200,
      size: 14,
      color: '#F59E0B',
      skills: ['Figma', 'Design Systems', 'Prototyping'],
      connections: 156,
      projects: 45,
      rating: 4.7,
      category: 'direct',
      connectionStrength: 0.8,
      lastActivity: '2024-10-31T16:45:00Z'
    },
    {
      id: 'emily',
      name: 'Emily Rodriguez',
      title: 'Marketing Specialist',
      company: 'Marketing Pro',
      profileImage: 'https://i.pravatar.cc/150?u=emily',
      x: 350,
      y: 400,
      size: 15,
      color: '#EF4444',
      skills: ['SEO', 'Content Marketing', 'Analytics'],
      connections: 203,
      projects: 78,
      rating: 4.6,
      category: 'direct',
      connectionStrength: 0.85,
      lastActivity: '2024-11-01T08:15:00Z'
    },
    {
      id: 'david',
      name: 'David Park',
      title: 'DevOps Engineer',
      company: 'Cloud Solutions',
      profileImage: 'https://i.pravatar.cc/150?u=david',
      x: 450,
      y: 400,
      size: 13,
      color: '#8B5CF6',
      skills: ['Docker', 'Kubernetes', 'AWS'],
      connections: 134,
      projects: 34,
      rating: 4.5,
      category: 'direct',
      connectionStrength: 0.7,
      lastActivity: '2024-10-30T14:22:00Z'
    },
    // Mutual connections
    {
      id: 'alex',
      name: 'Alex Kumar',
      title: 'Backend Developer',
      company: 'StartupXYZ',
      profileImage: 'https://i.pravatar.cc/150?u=alex',
      x: 200,
      y: 150,
      size: 12,
      color: '#06B6D4',
      skills: ['Python', 'Django', 'PostgreSQL'],
      connections: 89,
      projects: 23,
      rating: 4.4,
      category: 'mutual',
      connectionStrength: 0.6,
      lastActivity: '2024-10-29T11:30:00Z'
    },
    {
      id: 'maria',
      name: 'Maria Gonzalez',
      title: 'Data Scientist',
      company: 'Analytics Hub',
      profileImage: 'https://i.pravatar.cc/150?u=maria',
      x: 600,
      y: 250,
      size: 11,
      color: '#84CC16',
      skills: ['Python', 'Machine Learning', 'SQL'],
      connections: 67,
      projects: 19,
      rating: 4.3,
      category: 'mutual',
      connectionStrength: 0.5,
      lastActivity: '2024-10-28T15:45:00Z'
    },
    // Recommended connections
    {
      id: 'priya',
      name: 'Priya Patel',
      title: 'Cloud Architect',
      company: 'Google',
      profileImage: 'https://i.pravatar.cc/150?u=priya',
      x: 250,
      y: 350,
      size: 10,
      color: '#F97316',
      skills: ['AWS', 'Azure', 'Terraform'],
      connections: 234,
      projects: 56,
      rating: 4.8,
      category: 'recommended',
      connectionStrength: 0.4,
      lastActivity: '2024-10-27T09:20:00Z'
    },
    {
      id: 'james',
      name: 'James Wilson',
      title: 'Product Manager',
      company: 'Stripe',
      profileImage: 'https://i.pravatar.cc/150?u=james',
      x: 550,
      y: 350,
      size: 9,
      color: '#EC4899',
      skills: ['Product Strategy', 'Agile', 'Analytics'],
      connections: 178,
      projects: 42,
      rating: 4.7,
      category: 'recommended',
      connectionStrength: 0.3,
      lastActivity: '2024-10-26T13:15:00Z'
    }
  ]);

  const [edges] = useState<NetworkEdge[]>([
    {
      id: 'user-sarah',
      source: 'user',
      target: 'sarah',
      strength: 0.9,
      type: 'strong',
      projects: 5,
      connectionDate: '2024-01-15T00:00:00Z'
    },
    {
      id: 'user-michael',
      source: 'user',
      target: 'michael',
      strength: 0.8,
      type: 'strong',
      projects: 3,
      connectionDate: '2024-02-20T00:00:00Z'
    },
    {
      id: 'user-emily',
      source: 'user',
      target: 'emily',
      strength: 0.85,
      type: 'strong',
      projects: 4,
      connectionDate: '2024-03-10T00:00:00Z'
    },
    {
      id: 'user-david',
      source: 'user',
      target: 'david',
      strength: 0.7,
      type: 'medium',
      projects: 2,
      connectionDate: '2024-05-05T00:00:00Z'
    },
    {
      id: 'sarah-alex',
      source: 'sarah',
      target: 'alex',
      strength: 0.6,
      type: 'medium',
      projects: 1,
      connectionDate: '2024-04-12T00:00:00Z'
    },
    {
      id: 'michael-maria',
      source: 'michael',
      target: 'maria',
      strength: 0.5,
      type: 'weak',
      projects: 0,
      connectionDate: '2024-06-08T00:00:00Z'
    }
  ]);

  const drawNetwork = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Apply zoom and pan
    ctx.save();
    ctx.translate(pan.x, pan.y);
    ctx.scale(zoom, zoom);

    // Draw edges
    edges.forEach(edge => {
      const sourceNode = nodes.find(n => n.id === edge.source);
      const targetNode = nodes.find(n => n.id === edge.target);
      
      if (!sourceNode || !targetNode) return;

      ctx.beginPath();
      ctx.moveTo(sourceNode.x, sourceNode.y);
      ctx.lineTo(targetNode.x, targetNode.y);
      
      // Edge styling based on strength
      const alpha = edge.strength;
      const width = Math.max(1, edge.strength * 4);
      
      if (edge.type === 'strong') {
        ctx.strokeStyle = `rgba(59, 130, 246, ${alpha})`;
      } else if (edge.type === 'medium') {
        ctx.strokeStyle = `rgba(16, 185, 129, ${alpha})`;
      } else {
        ctx.strokeStyle = `rgba(156, 163, 175, ${alpha})`;
      }
      
      ctx.lineWidth = width;
      ctx.stroke();
    });

    // Draw nodes
    nodes.forEach(node => {
      const isHighlighted = highlightedNodes.includes(node.id);
      const isSelected = selectedNode?.id === node.id;
      
      // Node circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.size, 0, 2 * Math.PI);
      
      if (isSelected) {
        ctx.strokeStyle = '#1F2937';
        ctx.lineWidth = 3;
        ctx.stroke();
      } else if (isHighlighted) {
        ctx.strokeStyle = '#F59E0B';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      
      ctx.fillStyle = node.color;
      ctx.fill();
      
      // User indicator
      if (node.isUser) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size + 3, 0, 2 * Math.PI);
        ctx.strokeStyle = '#1F2937';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      
      // Draw labels if enabled
      if (showLabels && zoom > 0.5) {
        ctx.fillStyle = '#1F2937';
        ctx.font = `${Math.max(10, 12 * zoom)}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText(node.name, node.x, node.y + node.size + 15);
      }
    });

    ctx.restore();
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left - pan.x) / zoom;
    const y = (event.clientY - rect.top - pan.y) / zoom;

    // Find clicked node
    const clickedNode = nodes.find(node => {
      const dx = x - node.x;
      const dy = y - node.y;
      return Math.sqrt(dx * dx + dy * dy) <= node.size;
    });

    setSelectedNode(clickedNode || null);
  };

  const searchNodes = (term: string) => {
    if (!term) {
      setHighlightedNodes([]);
      return;
    }

    const matchingNodes = nodes.filter(node =>
      node.name.toLowerCase().includes(term.toLowerCase()) ||
      node.title.toLowerCase().includes(term.toLowerCase()) ||
      node.skills.some(skill => skill.toLowerCase().includes(term.toLowerCase()))
    ).map(node => node.id);

    setHighlightedNodes(matchingNodes);
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setSelectedNode(null);
    setHighlightedNodes([]);
  };

  const exportNetwork = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'network-visualization.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  useEffect(() => {
    drawNetwork();
  }, [nodes, edges, zoom, pan, selectedNode, highlightedNodes, showLabels]);

  useEffect(() => {
    searchNodes(searchTerm);
  }, [searchTerm]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'direct': return '#3B82F6';
      case 'mutual': return '#10B981';
      case 'recommended': return '#F59E0B';
      case 'potential': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getConnectionTypeIcon = (type: string) => {
    switch (type) {
      case 'strong': return <Zap className="h-4 w-4 text-blue-600" />;
      case 'medium': return <Activity className="h-4 w-4 text-green-600" />;
      case 'weak': return <Users className="h-4 w-4 text-gray-600" />;
      default: return <Network className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Network Visualization</h1>
              <p className="text-gray-600 mt-1">
                Interactive visualization of your professional network and connection patterns
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                <Settings className="h-4 w-4" />
                Settings
              </button>
              <button
                onClick={exportNetwork}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                <Download className="h-4 w-4" />
                Export
              </button>
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              </button>
            </div>
          </div>

          {/* Network Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 border">
              <div className="flex items-center gap-3">
                <Network className="h-8 w-8 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold">{networkStats.totalNodes}</div>
                  <div className="text-sm text-gray-600">Total Connections</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border">
              <div className="flex items-center gap-3">
                <GitBranch className="h-8 w-8 text-green-600" />
                <div>
                  <div className="text-2xl font-bold">{networkStats.totalEdges}</div>
                  <div className="text-sm text-gray-600">Total Relationships</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border">
              <div className="flex items-center gap-3">
                <Target className="h-8 w-8 text-purple-600" />
                <div>
                  <div className="text-2xl font-bold">{networkStats.networkDensity.toFixed(3)}</div>
                  <div className="text-sm text-gray-600">Network Density</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border">
              <div className="flex items-center gap-3">
                <Zap className="h-8 w-8 text-yellow-600" />
                <div>
                  <div className="text-2xl font-bold">{networkStats.strongConnections}</div>
                  <div className="text-sm text-gray-600">Strong Connections</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls and Visualization */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6">
            {/* Top Controls */}
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-6">
              <div className="flex flex-col sm:flex-row gap-3 flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search connections..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-80"
                  />
                </div>
                
                <select
                  value={viewMode}
                  onChange={(e) => setViewMode(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="overview">Overview</option>
                  <option value="skills">By Skills</option>
                  <option value="projects">By Projects</option>
                  <option value="strength">By Connection Strength</option>
                </select>

                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Categories</option>
                  <option value="direct">Direct Connections</option>
                  <option value="mutual">Mutual Connections</option>
                  <option value="recommended">Recommended</option>
                  <option value="potential">Potential</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setZoom(Math.max(0.1, zoom - 0.1))}
                  className="p-2 border border-gray-300 rounded hover:bg-gray-50"
                  title="Zoom Out"
                >
                  <ZoomOut className="h-4 w-4" />
                </button>
                <span className="text-sm text-gray-600 min-w-[60px] text-center">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  onClick={() => setZoom(Math.min(3, zoom + 0.1))}
                  className="p-2 border border-gray-300 rounded hover:bg-gray-50"
                  title="Zoom In"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
                <button
                  onClick={resetView}
                  className="p-2 border border-gray-300 rounded hover:bg-gray-50"
                  title="Reset View"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Settings Panel */}
            {showSettings && (
              <div className="bg-gray-50 border rounded-lg p-4 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Visualization Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">Show Labels</label>
                    <input
                      type="checkbox"
                      checked={showLabels}
                      onChange={(e) => setShowLabels(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">Animate Layout</label>
                    <input
                      type="checkbox"
                      checked={animateLayout}
                      onChange={(e) => setAnimateLayout(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">Physics Simulation</label>
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Main Visualization Area */}
            <div className="relative border rounded-lg overflow-hidden bg-white" style={{ height: isFullscreen ? '80vh' : '600px' }}>
              <canvas
                ref={canvasRef}
                width={800}
                height={isFullscreen ? 600 : 600}
                onClick={handleCanvasClick}
                className="w-full h-full cursor-pointer"
                style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)' }}
              />
              
              {/* Legend */}
              <div className="absolute top-4 left-4 bg-white bg-opacity-90 rounded-lg p-3 shadow-sm">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Legend</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                    <span>You</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-600"></div>
                    <span>Direct Connections</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-600"></div>
                    <span>Mutual Connections</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-orange-600"></div>
                    <span>Recommended</span>
                  </div>
                </div>
              </div>

              {/* Node Information Panel */}
              {selectedNode && (
                <div className="absolute top-4 right-4 bg-white rounded-lg p-4 shadow-lg max-w-sm">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {selectedNode.profileImage ? (
                        <img
                          src={selectedNode.profileImage}
                          alt={selectedNode.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <Users className="h-5 w-5 text-gray-500" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-gray-900">{selectedNode.name}</h3>
                        <p className="text-sm text-gray-600">{selectedNode.title}</p>
                        {selectedNode.company && (
                          <p className="text-xs text-gray-500">{selectedNode.company}</p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedNode(null)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-600">Connections:</span>
                        <div className="font-medium">{selectedNode.connections}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Projects:</span>
                        <div className="font-medium">{selectedNode.projects}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Rating:</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          <span className="font-medium">{selectedNode.rating}</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600">Category:</span>
                        <div className="font-medium capitalize">{selectedNode.category}</div>
                      </div>
                    </div>

                    {/* Skills */}
                    <div>
                      <span className="text-sm text-gray-600 mb-1 block">Skills:</span>
                      <div className="flex flex-wrap gap-1">
                        {selectedNode.skills.slice(0, 3).map((skill) => (
                          <span 
                            key={skill}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                        {selectedNode.skills.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{selectedNode.skills.length - 3}
                          </span>
                        )}
                      </div>
                    </div>

                    {!selectedNode.isUser && (
                      <div className="flex gap-2 pt-2">
                        <button className="flex-1 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 flex items-center justify-center gap-1">
                          <MessageCircle className="h-3 w-3" />
                          Message
                        </button>
                        <button className="px-3 py-1 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50">
                          <ExternalLink className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Stats */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Network Insights</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Clustering Coefficient:</span>
                    <span className="font-medium">{networkStats.clusteringCoefficient.toFixed(3)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Average Path Length:</span>
                    <span className="font-medium">{networkStats.shortestPath.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Avg Connections:</span>
                    <span className="font-medium">{networkStats.averageConnections.toFixed(1)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Connection Types</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="h-3 w-3 text-blue-600" />
                      <span className="text-gray-600">Strong:</span>
                    </div>
                    <span className="font-medium">{edges.filter(e => e.type === 'strong').length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Activity className="h-3 w-3 text-green-600" />
                      <span className="text-gray-600">Medium:</span>
                    </div>
                    <span className="font-medium">{edges.filter(e => e.type === 'medium').length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-3 w-3 text-gray-600" />
                      <span className="text-gray-600">Weak:</span>
                    </div>
                    <span className="font-medium">{edges.filter(e => e.type === 'weak').length}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Quick Actions</h3>
                <div className="space-y-2">
                  <button className="w-full px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                    Find Connection Paths
                  </button>
                  <button className="w-full px-3 py-2 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50">
                    Analyze Network Gaps
                  </button>
                  <button className="w-full px-3 py-2 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50">
                    Export Network Data
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}