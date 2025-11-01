'use client';

import { useState, useEffect } from 'react';
import { 
  Gift, 
  Users, 
  TrendingUp, 
  Award, 
  Share2, 
  Copy, 
  Check, 
  DollarSign, 
  Star, 
  Calendar, 
  Clock, 
  Target, 
  Zap, 
  Activity, 
  BarChart3, 
  PieChart, 
  Link2, 
  UserPlus, 
  Mail, 
  MessageCircle, 
  Twitter, 
  Facebook, 
  Linkedin, 
  Send,
  Eye,
  Download,
  Filter,
  Search,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  Sparkles,
  Crown,
  Medal,
  Gem,
  Hash,
  ExternalLink,
  ArrowRight,
  Percent,
  CreditCard,
  Wallet,
  Banknote,
  QrCode,
  Smartphone,
  Briefcase
} from 'lucide-react';

interface Referral {
  id: string;
  referredUser: {
    name: string;
    email: string;
    profileImage?: string;
    joinDate: string;
    status: 'pending' | 'active' | 'inactive';
  };
  referralDate: string;
  status: 'pending' | 'completed' | 'rewarded';
  reward: {
    amount: number;
    currency: string;
    type: 'cash' | 'credit' | 'bonus';
  };
  milestones: {
    joined: boolean;
    firstProject: boolean;
    firstPayment: boolean;
    active30Days: boolean;
  };
  totalEarnings: number;
}

interface ReferralStats {
  totalReferrals: number;
  successfulReferrals: number;
  pendingReferrals: number;
  totalEarnings: number;
  conversionRate: number;
  averageReward: number;
  thisMonthReferrals: number;
  thisMonthEarnings: number;
}

interface ReferralTier {
  id: string;
  name: string;
  icon: string;
  minReferrals: number;
  rewardMultiplier: number;
  bonusReward: number;
  color: string;
  benefits: string[];
}

interface ReferralCampaign {
  id: string;
  name: string;
  description: string;
  reward: number;
  bonusReward?: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  progress: number;
  target: number;
  type: 'limited_time' | 'milestone' | 'seasonal';
}

export default function ReferralSystemPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'referrals' | 'campaigns' | 'analytics' | 'settings'>('overview');
  const [copied, setCopied] = useState(false);
  const [selectedReferral, setSelectedReferral] = useState<Referral | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);

  const [referralCode] = useState('WORKVERSE-JD2024');
  const [referralLink] = useState(`https://workverse.com/join?ref=${referralCode}`);

  const [referralStats] = useState<ReferralStats>({
    totalReferrals: 47,
    successfulReferrals: 32,
    pendingReferrals: 15,
    totalEarnings: 1680,
    conversionRate: 68.1,
    averageReward: 52.5,
    thisMonthReferrals: 8,
    thisMonthEarnings: 420
  });

  const [referralTiers] = useState<ReferralTier[]>([
    {
      id: 'bronze',
      name: 'Bronze Referrer',
      icon: '🥉',
      minReferrals: 0,
      rewardMultiplier: 1.0,
      bonusReward: 0,
      color: 'from-orange-400 to-orange-600',
      benefits: ['Standard referral rewards', 'Basic analytics', 'Email support']
    },
    {
      id: 'silver',
      name: 'Silver Referrer',
      icon: '🥈',
      minReferrals: 10,
      rewardMultiplier: 1.2,
      bonusReward: 100,
      color: 'from-gray-400 to-gray-600',
      benefits: ['20% bonus on rewards', '$100 tier bonus', 'Priority support', 'Advanced analytics']
    },
    {
      id: 'gold',
      name: 'Gold Referrer',
      icon: '🥇',
      minReferrals: 25,
      rewardMultiplier: 1.5,
      bonusReward: 250,
      color: 'from-yellow-400 to-yellow-600',
      benefits: ['50% bonus on rewards', '$250 tier bonus', 'VIP support', 'Custom referral codes']
    },
    {
      id: 'platinum',
      name: 'Platinum Referrer',
      icon: '💎',
      minReferrals: 50,
      rewardMultiplier: 2.0,
      bonusReward: 500,
      color: 'from-purple-400 to-purple-600',
      benefits: ['100% bonus on rewards', '$500 tier bonus', 'Dedicated account manager', 'Exclusive campaigns']
    }
  ]);

  const [referrals, setReferrals] = useState<Referral[]>([
    {
      id: 'ref-1',
      referredUser: {
        name: 'Alice Johnson',
        email: 'alice@example.com',
        profileImage: 'https://i.pravatar.cc/150?u=alice',
        joinDate: '2024-10-15T10:00:00Z',
        status: 'active'
      },
      referralDate: '2024-10-10T14:30:00Z',
      status: 'completed',
      reward: { amount: 50, currency: 'USD', type: 'cash' },
      milestones: {
        joined: true,
        firstProject: true,
        firstPayment: true,
        active30Days: true
      },
      totalEarnings: 50
    },
    {
      id: 'ref-2',
      referredUser: {
        name: 'Bob Smith',
        email: 'bob@example.com',
        profileImage: 'https://i.pravatar.cc/150?u=bob',
        joinDate: '2024-10-20T16:45:00Z',
        status: 'active'
      },
      referralDate: '2024-10-18T09:15:00Z',
      status: 'completed',
      reward: { amount: 50, currency: 'USD', type: 'cash' },
      milestones: {
        joined: true,
        firstProject: true,
        firstPayment: false,
        active30Days: false
      },
      totalEarnings: 25
    },
    {
      id: 'ref-3',
      referredUser: {
        name: 'Carol Davis',
        email: 'carol@example.com',
        joinDate: '2024-10-28T11:20:00Z',
        status: 'pending'
      },
      referralDate: '2024-10-25T13:40:00Z',
      status: 'pending',
      reward: { amount: 50, currency: 'USD', type: 'cash' },
      milestones: {
        joined: true,
        firstProject: false,
        firstPayment: false,
        active30Days: false
      },
      totalEarnings: 0
    }
  ]);

  const [campaigns] = useState<ReferralCampaign[]>([
    {
      id: 'halloween-2024',
      name: 'Halloween Special',
      description: 'Double rewards for all referrals during Halloween week!',
      reward: 100,
      bonusReward: 50,
      startDate: '2024-10-25T00:00:00Z',
      endDate: '2024-11-01T23:59:59Z',
      isActive: true,
      progress: 3,
      target: 10,
      type: 'seasonal'
    },
    {
      id: 'milestone-50',
      name: '50 Referral Milestone',
      description: 'Reach 50 total referrals for a massive bonus reward!',
      reward: 500,
      startDate: '2024-01-01T00:00:00Z',
      endDate: '2024-12-31T23:59:59Z',
      isActive: true,
      progress: 47,
      target: 50,
      type: 'milestone'
    }
  ]);

  const currentTier = referralTiers.find(tier => 
    referralStats.successfulReferrals >= tier.minReferrals && 
    (referralTiers.findIndex(t => t.id === tier.id) === referralTiers.length - 1 || 
     referralStats.successfulReferrals < referralTiers[referralTiers.findIndex(t => t.id === tier.id) + 1].minReferrals)
  ) || referralTiers[0];

  const nextTier = referralTiers[referralTiers.findIndex(t => t.id === currentTier.id) + 1];

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent('Join Workverse - The Future of Freelance Work');
    const body = encodeURIComponent(`Hi there!\n\nI've been using Workverse for my freelance work and it's been amazing. You should check it out!\n\nUse my referral link to join: ${referralLink}\n\nBest regards!`);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const shareViaWhatsApp = () => {
    const message = encodeURIComponent(`Check out Workverse - the best platform for freelancers! Join using my link: ${referralLink}`);
    window.open(`https://wa.me/?text=${message}`);
  };

  const shareViaSocial = (platform: string) => {
    const message = encodeURIComponent('Join me on Workverse - the future of freelance work!');
    const url = encodeURIComponent(referralLink);
    
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${message}&url=${url}`);
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`);
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`);
        break;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'inactive':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Referral System</h1>
              <p className="text-gray-600 mt-1">
                Earn rewards by referring talented professionals to Workverse
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowShareModal(true)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                <Share2 className="h-4 w-4" />
                Share
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Gift className="h-4 w-4" />
                Invite Friends
              </button>
            </div>
          </div>

          {/* Referral Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 border">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold">{referralStats.totalReferrals}</div>
                  <div className="text-sm text-gray-600">Total Referrals</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border">
              <div className="flex items-center gap-3">
                <DollarSign className="h-8 w-8 text-green-600" />
                <div>
                  <div className="text-2xl font-bold">${referralStats.totalEarnings}</div>
                  <div className="text-sm text-gray-600">Total Earnings</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-purple-600" />
                <div>
                  <div className="text-2xl font-bold">{referralStats.conversionRate}%</div>
                  <div className="text-sm text-gray-600">Conversion Rate</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border">
              <div className="flex items-center gap-3">
                <Award className="h-8 w-8 text-yellow-600" />
                <div>
                  <div className="text-2xl font-bold">{currentTier.icon}</div>
                  <div className="text-sm text-gray-600">{currentTier.name}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Current Tier Progress */}
          <div className={`bg-gradient-to-r ${currentTier.color} rounded-lg p-6 text-white mb-6`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <span className="text-2xl">{currentTier.icon}</span>
                  {currentTier.name}
                </h3>
                <p className="text-white/80">
                  {currentTier.rewardMultiplier}x reward multiplier • ${currentTier.bonusReward} tier bonus
                </p>
              </div>
              {nextTier && (
                <div className="text-right">
                  <div className="text-sm text-white/80">Next: {nextTier.name}</div>
                  <div className="text-lg font-bold">
                    {referralStats.successfulReferrals}/{nextTier.minReferrals} referrals
                  </div>
                </div>
              )}
            </div>
            
            {nextTier && (
              <div className="mb-4">
                <div className="flex justify-between text-sm text-white/80 mb-1">
                  <span>Progress to {nextTier.name}</span>
                  <span>{Math.round((referralStats.successfulReferrals / nextTier.minReferrals) * 100)}%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div 
                    className="bg-white h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${Math.min(100, (referralStats.successfulReferrals / nextTier.minReferrals) * 100)}%` }}
                  ></div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {currentTier.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-white/80" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', name: 'Overview', icon: Eye },
                { id: 'referrals', name: 'My Referrals', icon: Users, count: referralStats.totalReferrals },
                { id: 'campaigns', name: 'Campaigns', icon: Target, count: campaigns.filter(c => c.isActive).length },
                { id: 'analytics', name: 'Analytics', icon: BarChart3 },
                { id: 'settings', name: 'Settings', icon: Award }
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
                    {tab.count && (
                      <span className="ml-1 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="p-6">
              {/* Referral Link Section */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Referral Link</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Referral Code</label>
                      <div className="flex items-center gap-2">
                        <code className="bg-white px-3 py-2 rounded border text-lg font-mono">{referralCode}</code>
                        <button 
                          onClick={() => copyToClipboard(referralCode)}
                          className="p-2 text-gray-600 hover:text-gray-900"
                        >
                          {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Referral Link</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={referralLink}
                          readOnly
                          className="flex-1 px-3 py-2 bg-white border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button 
                          onClick={() => copyToClipboard(referralLink)}
                          className="p-2 text-gray-600 hover:text-gray-900"
                        >
                          {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Quick Share Buttons */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Quick share:</span>
                    <button 
                      onClick={shareViaEmail}
                      className="p-2 text-gray-600 hover:text-blue-600"
                      title="Share via Email"
                    >
                      <Mail className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => shareViaSocial('twitter')}
                      className="p-2 text-gray-600 hover:text-blue-600"
                      title="Share on Twitter"
                    >
                      <Twitter className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => shareViaSocial('facebook')}
                      className="p-2 text-gray-600 hover:text-blue-600"
                      title="Share on Facebook"
                    >
                      <Facebook className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => shareViaSocial('linkedin')}
                      className="p-2 text-gray-600 hover:text-blue-600"
                      title="Share on LinkedIn"
                    >
                      <Linkedin className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={shareViaWhatsApp}
                      className="p-2 text-gray-600 hover:text-green-600"
                      title="Share via WhatsApp"
                    >
                      <MessageCircle className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Active Campaigns */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Campaigns</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {campaigns.filter(c => c.isActive).map((campaign) => (
                    <div key={campaign.id} className="border rounded-lg p-4 bg-gradient-to-r from-blue-50 to-purple-50">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">{campaign.name}</h4>
                          <p className="text-sm text-gray-600">{campaign.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600">${campaign.reward}</div>
                          {campaign.bonusReward && (
                            <div className="text-sm text-orange-600">+${campaign.bonusReward} bonus</div>
                          )}
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Progress: {campaign.progress}/{campaign.target}</span>
                          <span>{Math.round((campaign.progress / campaign.target) * 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${Math.min(100, (campaign.progress / campaign.target) * 100)}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Ends: {formatDate(campaign.endDate)}</span>
                        <span className="capitalize">{campaign.type.replace('_', ' ')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Referrals */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Referrals</h3>
                <div className="space-y-3">
                  {referrals.slice(0, 3).map((referral) => (
                    <div key={referral.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {referral.referredUser.profileImage ? (
                          <img
                            src={referral.referredUser.profileImage}
                            alt={referral.referredUser.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <Users className="h-5 w-5 text-gray-500" />
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-gray-900">{referral.referredUser.name}</div>
                          <div className="text-sm text-gray-600">
                            Referred {formatDate(referral.referralDate)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(referral.status)}`}>
                          {referral.status}
                        </span>
                        <div className="text-right">
                          <div className="font-semibold text-green-600">${referral.totalEarnings}</div>
                          <div className="text-xs text-gray-500">earned</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Referrals Tab */}
          {activeTab === 'referrals' && (
            <div className="p-6">
              <div className="space-y-4">
                {referrals.map((referral) => (
                  <div key={referral.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        {referral.referredUser.profileImage ? (
                          <img
                            src={referral.referredUser.profileImage}
                            alt={referral.referredUser.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                            <Users className="h-6 w-6 text-gray-500" />
                          </div>
                        )}
                        <div>
                          <h3 className="font-semibold text-gray-900">{referral.referredUser.name}</h3>
                          <p className="text-sm text-gray-600">{referral.referredUser.email}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            <span>Referred: {formatDate(referral.referralDate)}</span>
                            <span>Joined: {formatDate(referral.referredUser.joinDate)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-2">
                          {getStatusIcon(referral.status)}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(referral.status)}`}>
                            {referral.status}
                          </span>
                        </div>
                        <div className="text-lg font-bold text-green-600">${referral.totalEarnings}</div>
                        <div className="text-xs text-gray-500">of ${referral.reward.amount} potential</div>
                      </div>
                    </div>

                    {/* Progress Milestones */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className={`p-2 rounded text-center ${referral.milestones.joined ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                        <CheckCircle className={`h-4 w-4 mx-auto mb-1 ${referral.milestones.joined ? 'text-green-600' : 'text-gray-400'}`} />
                        <div className="text-xs font-medium">Joined</div>
                      </div>
                      <div className={`p-2 rounded text-center ${referral.milestones.firstProject ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                        <Briefcase className={`h-4 w-4 mx-auto mb-1 ${referral.milestones.firstProject ? 'text-green-600' : 'text-gray-400'}`} />
                        <div className="text-xs font-medium">First Project</div>
                      </div>
                      <div className={`p-2 rounded text-center ${referral.milestones.firstPayment ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                        <DollarSign className={`h-4 w-4 mx-auto mb-1 ${referral.milestones.firstPayment ? 'text-green-600' : 'text-gray-400'}`} />
                        <div className="text-xs font-medium">First Payment</div>
                      </div>
                      <div className={`p-2 rounded text-center ${referral.milestones.active30Days ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                        <Calendar className={`h-4 w-4 mx-auto mb-1 ${referral.milestones.active30Days ? 'text-green-600' : 'text-gray-400'}`} />
                        <div className="text-xs font-medium">30 Days Active</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {referrals.length === 0 && (
                <div className="text-center py-12">
                  <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No referrals yet</h3>
                  <p className="text-gray-600 mb-4">
                    Start referring friends and colleagues to earn rewards!
                  </p>
                  <button 
                    onClick={() => setShowShareModal(true)}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Share Your Link
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Campaigns Tab */}
          {activeTab === 'campaigns' && (
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {campaigns.map((campaign) => (
                  <div key={campaign.id} className={`border rounded-lg p-6 ${campaign.isActive ? 'border-blue-200 bg-blue-50' : 'border-gray-200'}`}>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{campaign.name}</h3>
                        <p className="text-gray-600 mt-1">{campaign.description}</p>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${campaign.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                        {campaign.isActive ? 'Active' : 'Inactive'}
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Progress</span>
                        <span className="text-sm font-medium">{campaign.progress}/{campaign.target}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${Math.min(100, (campaign.progress / campaign.target) * 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Reward:</span>
                        <div className="font-semibold text-green-600">${campaign.reward}</div>
                      </div>
                      {campaign.bonusReward && (
                        <div>
                          <span className="text-gray-600">Bonus:</span>
                          <div className="font-semibold text-orange-600">+${campaign.bonusReward}</div>
                        </div>
                      )}
                      <div>
                        <span className="text-gray-600">Start Date:</span>
                        <div className="font-medium">{formatDate(campaign.startDate)}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">End Date:</span>
                        <div className="font-medium">{formatDate(campaign.endDate)}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Monthly Performance */}
                <div className="border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Performance</h3>
                  <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">Performance chart would be displayed here</p>
                    </div>
                  </div>
                </div>

                {/* Conversion Funnel */}
                <div className="border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversion Funnel</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded">
                      <span className="font-medium">Link Clicks</span>
                      <span className="text-lg font-bold">156</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded">
                      <span className="font-medium">Sign-ups</span>
                      <span className="text-lg font-bold">89</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded">
                      <span className="font-medium">Active Users</span>
                      <span className="text-lg font-bold">47</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                      <span className="font-medium">Completed Referrals</span>
                      <span className="text-lg font-bold">32</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">New Referral Notifications</div>
                        <div className="text-sm text-gray-600">Get notified when someone signs up with your link</div>
                      </div>
                      <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">Milestone Achievements</div>
                        <div className="text-sm text-gray-600">Get notified when you reach referral milestones</div>
                      </div>
                      <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">Weekly Reports</div>
                        <div className="text-sm text-gray-600">Receive weekly summaries of your referral performance</div>
                      </div>
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option>PayPal</option>
                        <option>Bank Transfer</option>
                        <option>Crypto Wallet</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Payout</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option>$25</option>
                        <option>$50</option>
                        <option>$100</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Share Modal */}
        {showShareModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex items-center gap-3 mb-4">
                <Share2 className="h-6 w-6 text-blue-600" />
                <h3 className="text-lg font-semibold">Share Your Referral Link</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Link</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={referralLink}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    />
                    <button 
                      onClick={() => copyToClipboard(referralLink)}
                      className="p-2 text-gray-600 hover:text-gray-900"
                    >
                      {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Share via</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button 
                      onClick={shareViaEmail}
                      className="flex flex-col items-center p-3 border rounded-lg hover:bg-gray-50"
                    >
                      <Mail className="h-6 w-6 text-gray-600 mb-1" />
                      <span className="text-xs">Email</span>
                    </button>
                    <button 
                      onClick={() => shareViaSocial('twitter')}
                      className="flex flex-col items-center p-3 border rounded-lg hover:bg-gray-50"
                    >
                      <Twitter className="h-6 w-6 text-blue-500 mb-1" />
                      <span className="text-xs">Twitter</span>
                    </button>
                    <button 
                      onClick={() => shareViaSocial('linkedin')}
                      className="flex flex-col items-center p-3 border rounded-lg hover:bg-gray-50"
                    >
                      <Linkedin className="h-6 w-6 text-blue-700 mb-1" />
                      <span className="text-xs">LinkedIn</span>
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button 
                  onClick={() => setShowShareModal(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}