"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../components/AuthProvider';
import { 
  User, 
  Edit3, 
  Star, 
  MapPin, 
  Mail, 
  Calendar, 
  Briefcase, 
  DollarSign, 
  Award,
  ExternalLink,
  Settings,
  Eye
} from 'lucide-react';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    role: '',
    bio: '',
    location: '',
    hourlyRate: 0,
    skills: [] as string[],
    completedProjects: 0,
    rating: 0,
    joinDate: '',
    portfolio: [] as any[]
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      // Mock profile data - replace with actual API call
      setProfileData({
        name: user.name || 'Professional User',
        email: user.email,
        role: user.role || 'FREELANCER',
        bio: 'Experienced professional specializing in modern web development and blockchain solutions. Passionate about creating innovative digital experiences.',
        location: 'San Francisco, CA',
        hourlyRate: 85,
        skills: ['React', 'TypeScript', 'Node.js', 'Blockchain', 'UI/UX Design'],
        completedProjects: 42,
        rating: 4.8,
        joinDate: '2024-01-15',
        portfolio: [
          { id: 1, title: 'E-commerce Platform', image: '/api/placeholder/300/200', description: 'Modern React-based shopping platform' },
          { id: 2, title: 'Blockchain Wallet', image: '/api/placeholder/300/200', description: 'Secure cryptocurrency wallet application' }
        ]
      });
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Redirecting in useEffect
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
              {profileData.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{profileData.name}</h1>
              <p className="text-gray-400 mb-2">{profileData.role.toLowerCase()}</p>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{profileData.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {formatDate(profileData.joinDate)}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Link
              href="/profile/edit"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Edit3 className="h-4 w-4" />
              Edit Profile
            </Link>
            <Link
              href="/profile/settings"
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-1">{profileData.completedProjects}</div>
            <div className="text-sm text-gray-400">Projects Completed</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-2xl font-bold text-white mb-1">
              {profileData.rating}
              <Star className="h-5 w-5 text-yellow-400 fill-current" />
            </div>
            <div className="text-sm text-gray-400">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-1">${profileData.hourlyRate}</div>
            <div className="text-sm text-gray-400">Hourly Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-1">{profileData.skills.length}</div>
            <div className="text-sm text-gray-400">Skills</div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* About */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">About</h2>
            <p className="text-gray-300 leading-relaxed">{profileData.bio}</p>
          </div>

          {/* Portfolio */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Portfolio</h2>
              <Link
                href="/profile/portfolio"
                className="text-blue-400 hover:text-blue-300 text-sm font-medium"
              >
                View All
              </Link>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {profileData.portfolio.map((item) => (
                <div key={item.id} className="bg-gray-700/50 rounded-lg overflow-hidden">
                  <div className="h-48 bg-gray-600 flex items-center justify-center">
                    <span className="text-gray-400">Portfolio Image</span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-white mb-2">{item.title}</h3>
                    <p className="text-gray-400 text-sm mb-3">{item.description}</p>
                    <button className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm">
                      <ExternalLink className="h-3 w-3" />
                      View Project
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg">
                <div className="p-2 bg-green-600/20 rounded-lg">
                  <Briefcase className="h-4 w-4 text-green-400" />
                </div>
                <div className="flex-1">
                  <p className="text-white">Completed project: E-commerce Platform</p>
                  <p className="text-gray-400 text-sm">2 days ago</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg">
                <div className="p-2 bg-blue-600/20 rounded-lg">
                  <Star className="h-4 w-4 text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-white">Received 5-star review from TechStartup Co.</p>
                  <p className="text-gray-400 text-sm">1 week ago</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg">
                <div className="p-2 bg-purple-600/20 rounded-lg">
                  <Award className="h-4 w-4 text-purple-400" />
                </div>
                <div className="flex-1">
                  <p className="text-white">Earned Top Performer badge</p>
                  <p className="text-gray-400 text-sm">2 weeks ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Info */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-gray-300">{profileData.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <DollarSign className="h-4 w-4 text-gray-400" />
                <span className="text-gray-300">${profileData.hourlyRate}/hour</span>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {profileData.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                href="/opportunities"
                className="w-full flex items-center gap-2 p-3 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-colors"
              >
                <Briefcase className="h-4 w-4" />
                <span>Find Work</span>
              </Link>
              
              <Link
                href="/projects"
                className="w-full flex items-center gap-2 p-3 bg-green-600/20 text-green-400 rounded-lg hover:bg-green-600/30 transition-colors"
              >
                <Eye className="h-4 w-4" />
                <span>My Projects</span>
              </Link>
              
              <Link
                href="/networking"
                className="w-full flex items-center gap-2 p-3 bg-purple-600/20 text-purple-400 rounded-lg hover:bg-purple-600/30 transition-colors"
              >
                <User className="h-4 w-4" />
                <span>Network</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}