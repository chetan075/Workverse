'use client';

import { useState } from 'react';
import {
  Shield,
  CheckCircle,
  Award,
  Star,
  Clock,
  Target,
  Users,
  MessageSquare,
  DollarSign,
  Calendar,
  Zap,
  Crown,
  Verified,
  Eye,
  Upload,
  X,
  Plus
} from 'lucide-react';

interface TrustBadge {
  id: string;
  type: 'achievement' | 'verification' | 'milestone';
  name: string;
  description: string;
  icon: string;
  color: string;
  level: 'bronze' | 'silver' | 'gold' | 'platinum';
  earned: boolean;
  earnedDate?: string;
  progress?: number;
  requirement?: string;
}

interface VerificationItem {
  id: string;
  type: 'identity' | 'email' | 'phone' | 'portfolio' | 'payment' | 'social';
  name: string;
  description: string;
  icon: string;
  verified: boolean;
  verifiedDate?: string;
  required: boolean;
}

const iconMap = {
  Shield,
  CheckCircle,
  Award,
  Star,
  Clock,
  Target,
  Users,
  MessageSquare,
  DollarSign,
  Calendar,
  Zap,
  Crown,
  Verified,
  Eye,
  Upload
};

const trustBadges: TrustBadge[] = [
  {
    id: '1',
    type: 'achievement',
    name: 'Top Performer',
    description: 'Maintained 95%+ on-time delivery rate',
    icon: 'Target',
    color: 'blue',
    level: 'gold',
    earned: true,
    earnedDate: '2024-01-15',
    progress: 100,
    requirement: '95% on-time delivery for 10+ projects'
  },
  {
    id: '2',
    type: 'achievement',
    name: 'Client Favorite',
    description: 'Achieved 4.8+ average rating',
    icon: 'Star',
    color: 'yellow',
    level: 'gold',
    earned: true,
    earnedDate: '2024-01-10',
    progress: 100,
    requirement: '4.8+ average rating with 10+ reviews'
  },
  {
    id: '3',
    type: 'achievement',
    name: 'Quick Responder',
    description: 'Response time under 4 hours',
    icon: 'Clock',
    color: 'green',
    level: 'silver',
    earned: true,
    earnedDate: '2024-01-05',
    progress: 100,
    requirement: 'Average response time under 4 hours'
  },
  {
    id: '4',
    type: 'achievement',
    name: 'Project Master',
    description: 'Complete 50+ projects successfully',
    icon: 'Award',
    color: 'purple',
    level: 'platinum',
    earned: false,
    progress: 24,
    requirement: '50 completed projects with 95%+ success rate'
  },
  {
    id: '5',
    type: 'achievement',
    name: 'Communication Pro',
    description: '4.8+ communication rating',
    icon: 'MessageSquare',
    color: 'blue',
    level: 'gold',
    earned: true,
    earnedDate: '2024-01-12',
    progress: 100,
    requirement: '4.8+ communication rating with 10+ reviews'
  },
  {
    id: '6',
    type: 'milestone',
    name: 'Rising Star',
    description: 'Complete your first 5 projects',
    icon: 'Star',
    color: 'orange',
    level: 'bronze',
    earned: true,
    earnedDate: '2023-12-01',
    progress: 100,
    requirement: 'Complete 5 projects successfully'
  },
  {
    id: '7',
    type: 'milestone',
    name: 'Trusted Professional',
    description: 'Earn $10,000+ total',
    icon: 'DollarSign',
    color: 'green',
    level: 'silver',
    earned: true,
    earnedDate: '2024-01-08',
    progress: 100,
    requirement: 'Earn $10,000+ in total project value'
  },
  {
    id: '8',
    type: 'milestone',
    name: 'Elite Expert',
    description: 'Earn $100,000+ total',
    icon: 'Crown',
    color: 'purple',
    level: 'platinum',
    earned: false,
    progress: 25,
    requirement: 'Earn $100,000+ in total project value'
  }
];

const verificationItems: VerificationItem[] = [
  {
    id: '1',
    type: 'identity',
    name: 'Identity Verification',
    description: 'Government-issued ID verification',
    icon: 'Shield',
    verified: true,
    verifiedDate: '2023-11-15',
    required: true
  },
  {
    id: '2',
    type: 'email',
    name: 'Email Verification',
    description: 'Verified email address',
    icon: 'CheckCircle',
    verified: true,
    verifiedDate: '2023-11-01',
    required: true
  },
  {
    id: '3',
    type: 'phone',
    name: 'Phone Verification',
    description: 'Verified phone number',
    icon: 'CheckCircle',
    verified: true,
    verifiedDate: '2023-11-02',
    required: true
  },
  {
    id: '4',
    type: 'portfolio',
    name: 'Portfolio Review',
    description: 'Professional portfolio verified',
    icon: 'Eye',
    verified: true,
    verifiedDate: '2023-11-20',
    required: false
  },
  {
    id: '5',
    type: 'payment',
    name: 'Payment Method',
    description: 'Bank account or payment method verified',
    icon: 'DollarSign',
    verified: true,
    verifiedDate: '2023-11-03',
    required: true
  },
  {
    id: '6',
    type: 'social',
    name: 'Social Media',
    description: 'LinkedIn profile verification',
    icon: 'Users',
    verified: false,
    required: false
  }
];

export default function TrustBadgesPage() {
  const [activeTab, setActiveTab] = useState('badges');
  const [selectedBadge, setSelectedBadge] = useState<TrustBadge | null>(null);
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  const getIconComponent = (iconName: string) => {
    return iconMap[iconName as keyof typeof iconMap] || Shield;
  };

  const getBadgeColorClass = (color: string, earned: boolean) => {
    if (!earned) return 'bg-gray-100 text-gray-400 border-gray-200';
    
    const colorMap = {
      blue: 'bg-blue-100 text-blue-800 border-blue-200',
      yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      green: 'bg-green-100 text-green-800 border-green-200',
      purple: 'bg-purple-100 text-purple-800 border-purple-200',
      orange: 'bg-orange-100 text-orange-800 border-orange-200'
    };
    
    return colorMap[color as keyof typeof colorMap] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getLevelBadgeColor = (level: string) => {
    const levelMap = {
      bronze: 'bg-orange-100 text-orange-800',
      silver: 'bg-gray-100 text-gray-800',
      gold: 'bg-yellow-100 text-yellow-800',
      platinum: 'bg-purple-100 text-purple-800'
    };
    
    return levelMap[level as keyof typeof levelMap] || 'bg-gray-100 text-gray-800';
  };

  const earnedBadges = trustBadges.filter(badge => badge.earned);
  const unearnedBadges = trustBadges.filter(badge => !badge.earned);
  const verifiedItems = verificationItems.filter(item => item.verified);

  const trustScore = Math.round(
    (verifiedItems.length / verificationItems.length) * 40 + 
    (earnedBadges.length / trustBadges.length) * 60
  );

  const tabs = [
    { id: 'badges', name: 'Trust Badges', count: earnedBadges.length },
    { id: 'verification', name: 'Verification', count: verifiedItems.length },
    { id: 'progress', name: 'Progress', count: unearnedBadges.length }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Trust & Verification</h1>
          <p className="text-gray-600 mt-1">Build trust with clients through verification and achievement badges</p>
        </div>

        {/* Trust Score Overview */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-8 mb-8 text-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{trustScore}</div>
              <div className="text-green-100">Trust Score</div>
              <div className="text-sm text-green-200 mt-1">Out of 100</div>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{earnedBadges.length}</div>
              <div className="text-green-100">Badges Earned</div>
              <div className="text-sm text-green-200 mt-1">Achievement unlocked</div>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{verifiedItems.length}/{verificationItems.length}</div>
              <div className="text-green-100">Verified Items</div>
              <div className="text-sm text-green-200 mt-1">Identity confirmed</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.name}
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    activeTab === tab.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'badges' && (
              <div className="space-y-8">
                {/* Earned Badges */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Earned Badges</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {earnedBadges.map((badge) => {
                      const IconComponent = getIconComponent(badge.icon);
                      return (
                        <div
                          key={badge.id}
                          onClick={() => setSelectedBadge(badge)}
                          className={`border rounded-lg p-6 cursor-pointer hover:shadow-md transition-shadow ${
                            getBadgeColorClass(badge.color, badge.earned)
                          }`}
                        >
                          <div className="flex items-center gap-3 mb-4">
                            <div className={`p-3 rounded-lg ${getBadgeColorClass(badge.color, badge.earned)}`}>
                              <IconComponent className="h-6 w-6" />
                            </div>
                            <div>
                              <h4 className="font-medium">{badge.name}</h4>
                              <span className={`text-xs px-2 py-1 rounded-full font-medium ${getLevelBadgeColor(badge.level)}`}>
                                {badge.level.toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm mb-3">{badge.description}</p>
                          <div className="flex items-center gap-1 text-green-600 text-sm">
                            <CheckCircle className="h-4 w-4" />
                            Earned {badge.earnedDate && new Date(badge.earnedDate).toLocaleDateString()}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'verification' && (
              <div className="space-y-8">
                {/* Verified Items */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Verified Items</h3>
                    <button
                      onClick={() => setShowVerificationModal(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Plus className="h-4 w-4" />
                      Add Verification
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {verificationItems.map((item) => {
                      const IconComponent = getIconComponent(item.icon);
                      return (
                        <div 
                          key={item.id} 
                          className={`border rounded-lg p-4 flex items-center justify-between ${
                            item.verified ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${
                              item.verified ? 'bg-green-100' : 'bg-gray-200'
                            }`}>
                              <IconComponent className={`h-5 w-5 ${
                                item.verified ? 'text-green-600' : 'text-gray-400'
                              }`} />
                            </div>
                            <div>
                              <h4 className={`font-medium ${
                                item.verified ? 'text-gray-900' : 'text-gray-500'
                              }`}>
                                {item.name}
                                {item.required && <span className="text-red-500 ml-1">*</span>}
                              </h4>
                              <p className={`text-sm ${
                                item.verified ? 'text-gray-700' : 'text-gray-500'
                              }`}>
                                {item.description}
                              </p>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            {item.verified ? (
                              <div>
                                <div className="flex items-center gap-1 text-green-600 text-sm mb-1">
                                  <CheckCircle className="h-4 w-4" />
                                  Verified
                                </div>
                                {item.verifiedDate && (
                                  <p className="text-xs text-gray-500">
                                    {new Date(item.verifiedDate).toLocaleDateString()}
                                  </p>
                                )}
                              </div>
                            ) : (
                                <button
                                onClick={() => {}}
                                className="px-3 py-1 text-blue-600 border border-blue-600 rounded hover:bg-blue-50 text-sm"
                              >
                                Verify
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'progress' && (
              <div className="space-y-8">
                {/* Progress Towards Badges */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Badge Progress</h3>
                  <div className="space-y-6">
                    {unearnedBadges.map((badge) => {
                      const IconComponent = getIconComponent(badge.icon);
                      return (
                        <div key={badge.id} className="border border-gray-200 rounded-lg p-6">
                          <div className="flex items-start gap-4">
                            <div className="p-3 rounded-lg bg-gray-100">
                              <IconComponent className="h-6 w-6 text-gray-400" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="font-medium text-gray-900">{badge.name}</h4>
                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${getLevelBadgeColor(badge.level)}`}>
                                  {badge.level.toUpperCase()}
                                </span>
                              </div>
                              <p className="text-gray-600 text-sm mb-4">{badge.description}</p>
                              
                              <div className="mb-3">
                                <div className="flex items-center justify-between text-sm mb-1">
                                  <span className="text-gray-600">Progress</span>
                                  <span className="font-medium">{badge.progress}% complete</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                    style={{
                                      width: `${badge.progress}%`
                                    }}
                                  ></div>
                                </div>
                              </div>
                              
                              <p className="text-xs text-gray-500">{badge.requirement}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Badge Detail Modal */}
        {selectedBadge && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Badge Details</h3>
                <button
                  onClick={() => setSelectedBadge(null)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                  title="Close badge details"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="text-center mb-6">
                <div className={`inline-flex p-4 rounded-full mb-4 ${getBadgeColorClass(selectedBadge.color, selectedBadge.earned)}`}>
                  {(() => {
                    const IconComponent = getIconComponent(selectedBadge.icon);
                    return <IconComponent className="h-8 w-8" />;
                  })()}
                </div>
                <h4 className="font-medium text-gray-900 mb-2">{selectedBadge.name}</h4>
                <span className={`inline-block text-xs px-3 py-1 rounded-full font-medium ${getLevelBadgeColor(selectedBadge.level)}`}>
                  {selectedBadge.level.toUpperCase()}
                </span>
              </div>
              
              <div className="space-y-3 text-sm">
                <p className="text-gray-700">{selectedBadge.description}</p>
                <p className="text-gray-600"><strong>Requirement:</strong> {selectedBadge.requirement}</p>
                {selectedBadge.earned && selectedBadge.earnedDate && (
                  <p className="text-green-600"><strong>Earned:</strong> {new Date(selectedBadge.earnedDate).toLocaleDateString()}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Verification Modal */}
        {showVerificationModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Add Verification</h3>
                <button
                  onClick={() => setShowVerificationModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                  title="Close verification modal"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="text-center py-8">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h4 className="font-medium text-gray-900 mb-2">Upload Documents</h4>
                <p className="text-gray-600 text-sm mb-6">
                  Upload the required documents for verification. We&apos;ll review them within 24-48 hours.
                </p>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Choose Files
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}